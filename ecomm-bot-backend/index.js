const express = require('express');
const cors = require('cors');

const axios = require('axios');


const app = express();
const PORT= 5000;

app.use(cors()); //front-end
app.use(express.json());

app.get('/', (req, res) => {
  res.send('E-COMM bot backend is running');
});


//  main chat 
app.post('/api/chat', async(req, res)=>{

  const {message, history}=req.body;  // message:string, history:array of messages

  if(!message){
    return res.status(400).json({error: "message is required"});
  }

  // prompt chain
  const messages =[
    {
        role:"system",
        content:
            "You are a helpful assistant for an e-commerce website called E-Comm"+
            "You help with products, orders, sellers, etc. Answer briefly and clearly"
    },
    ...(history || []), //previous
    {
        role: 'user',
        content: message 
    }
  ];

  try{
    //Ollama chat API
    const ollamaResponse=await axios.post("http://localhost:11434/api/chat", {
        model: "tinyllama",
        messages,
        stream: false
    });

    
    const botText=ollamaResponse.data?.message?.content || "";
    res.json({
        answer: botText,
        usedMessages: messages
    });

  }catch(err){
    console.error("Error talking to ollama:", err.message);
    res.status(500).json({error: "Failed to get response from bot"});
  }
});

app.listen(PORT, ()=>{
    console.log(`Bot backend listening on http://localhost${PORT}`);
});
