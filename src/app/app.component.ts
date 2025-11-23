import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from './footer/footer.component';
import { ChatBotComponent } from './chat-bot/chat-bot.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FormsModule, FooterComponent, ChatBotComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ecom-project';
  
}
