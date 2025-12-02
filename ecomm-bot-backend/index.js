const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { model } = require('@angular/core');
const app = express();

//define constants
const PORT= 5000;
const Json_server_url="http://localhost:3000"; 
const Ollama_api_url="http://localhost:11434/api/chat"; 
const ollama_model="tinyllama";
const embed_model="nomic-embed-text";
const ollama_embed_url="http://localhost:11434/api/embeddings";

//front-end
app.use(cors()); 
app.use(express.json());

app.get('/', (req, res) => {
  res.send('E-COMM bot backend is running');
});

//db.json
async function fetchProductsFromJsonServer(){ 
  try{
    const response = await axios.get(`${Json_server_url}/products`);
    return response.data; //product array
  }catch(err){
    console.error("Error fetching products: ", err.message);
    return[];
  }
}


let productEmbeddings = []; //in-memory store

async function embedText(text){ 
  try{
    const response = await axios.post(ollama_embed_url,{
      model: embed_model,
      prompt: text
    });
    const data = response.data;
    if (Array.isArray(data.embedding) && data.embedding.length > 0) {
      return data.embedding;
    }
    console.warn('Unknown embedding response shape:', JSON.stringify(data));
    return null;
  } 
  catch(err){
    console.error("Error generating embedding:", err.message);
    return null;
  }
}


async function buildProductIndex(){ //embedding for all products
  try{
    const products = await fetchProductsFromJsonServer();
    const index =[];

    for(const product of products){
      const text = `${product.name}\n${product.category}\n${product.description}\n${product.color}`;
      const embedding = await embedText(text);
      if (embedding){
        index.push({
          product,
          embedding,
        });
      }else {
        console.warn("Failed to get embedding for product:", product.name);
      }
    }
    productIndex = index;
    console.log("product index built with embeddings:", productIndex.length);
  }catch(err){
    console.error("Error building product index:", err.message);
  }
}

function cosineSimilarity(a,b){
  if(!a || !b || a.length !== b.length) return 0;
  let dot=0, 
    normA=0, 
    normB=0;

  for (let i=0; i<a.length; i++){
    dot += a[i]*b[i];
    normA += a[i]* a[i];
    normB +=b[i]*b[i];
  }
  if(!normA || !normB) return 0;
  return dot/(Math.sqrt(normA)*Math.sqrt(normB));
}

async function semanticSearchProducts(query, topK = 5) {
  if (!productIndex.length) {
    await buildProductIndex();
  }

  const queryEmbedding = await embedText(query);

  if (!queryEmbedding){
    console.warn("Failed to get embedding for query:", query);
    return [];
  }

  const scored = productIndex.map(({ product, embedding }) => ({
    product,
    score: cosineSimilarity(queryEmbedding, embedding)
  }));

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(x => x.product);
}


//normal chat
app.post('/api/chat', async(req, res) => {
  const {message, history,systemPrompt}= req.body;

  if(!message){
    return res.status(400).json({error: "message is required"});
  }

  const safeHistory = Array.isArray(history)? history: [];

  const defaultSystemPrompt= "you are a helful assistant for an e-commerece website called e-com."+"you help with products, orders, sellers etc. answer breifly and clearly.";
  
  const systemContent= systemPrompt && systemPrompt.trim().length >0
    ? systemPrompt
    : defaultSystemPrompt;

  const messages =[
    {role: "system", content: systemContent},
    ...safeHistory,
    {role: "user", content: message},
  ];

  try {
    const ollamaResponse= await axios.post(Ollama_api_url, {
      model: ollama_model,
      messages,
      stream: false,
    });

    const botText = ollamaResponse.data?.message?.content || '';

    res.json({
      answer: botText,
      newHistory:[
        ...safeHistory,
        {role: 'user', content: message},
        {role: 'assistant', content: botText},
      ]
    });
  } 
  catch (err) {
    console.error('Error in /api/chat:', err.message);
    res.status(500).json({ error: 'Failed to get response from bot' });
  }
});


//  main chat 
app.post('/api/chat-rag', async(req, res)=>{

  const {message, history}=req.body;  // message:string, history:array

  if(!message){
    return res.status(400).json({error: "message is required"});
  }

  const safeHistory=Array.isArray(history)? history: [];

  try{
    
    const matchedProducts = await semanticSearchProducts(message, 5);

    let contextText;
    if (matchedProducts.length===0){
      contextText="No product matches your query";
    }else{
      contextText=matchedProducts.map(
        (product)=>
          `${product.name}, (₹${product.price}, Category: ${product.category}, Color: ${product.color})\n ${product.description}`
      ).join("\n\n");
    }

    const ragSystemPrompt=`
    You are a helpful assistant for an e-commerce website called E-Comm.
    When a user asks about products, use the following product information to answer:
    ${contextText}
    if no products match, inform the user accordingly.
    Answer briefly and clearly.
    `;

    // prompt chain
    const messages =[
      {
        role:"system",
        content: ragSystemPrompt
      },
      ...safeHistory, //previous
      {
        role: 'user',
        content: message 
      },
    ];

    const ollamaResponse=await axios.post(Ollama_api_url,{
      model: ollama_model,
      messages,
      stream: false,
    });


    let botText="";

    if(
      ollamaResponse.data &&
      typeof ollamaResponse.data === 'object' &&
      !Array.isArray(ollamaResponse.data)
    ){
      botText=ollamaResponse.data?.message?.content || "";
    }else if(Array.isArray(ollamaResponse.data)){
      botText=ollamaResponse.data
        .map((part)=> part.content || part.token || '')
        .join("");
    }else{
      botText=String(ollamaResponse.data);
    }


    res.json({ //response 
      answer: botText,
      matchedProducts,
      newHistory: [
        ...safeHistory,
        {role: 'user', content: message},
        {role: 'assistant', content: botText},
      ],
    });

  }catch(err){
    console.error("Error in /api/chat-rag", err.message);
    res.status(500).json({error: "Failed to get RAG response from bot"});
  }
});


buildProductIndex()
  .then(()=>{
    app.listen(PORT, ()=>{
      console.log(`Bot backend listening on http://localhost:${PORT}`);
    }
  );
})
