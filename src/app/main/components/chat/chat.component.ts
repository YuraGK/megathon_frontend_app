import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { ChatForm, ExpandedUserDetailed, Message, User, ChatProper} from '../../main.model';
import { APP_ROUTER_NAME, BUTTON_THEMES, ICON_NAMES, INPUT_PLACEHOLDERS } from '../../../app.config';
import { HeaderService } from '../../../services/header.service';
import { EpmChatMessageComponent } from '../epm-chat-message/epm-chat-message.component';
import { EpmInputComponent } from '../../../shared/components/epm-input/epm-input.component';
import { EpmButtonComponent } from '../../../shared/components/epm-button/epm-button.component';
import { ToggleDisplayMessageTimePipe } from '../../../shared/pipes/toggle-display-message-time.pipe';
import { ToggleDisplayChatStartDayPipe } from '../../../shared/pipes/toggle-display-chat-start-day.pipe';
import { ChatStartDayPipe } from '../../../shared/pipes/chat-start-day.pipe';
import { CHAT_MOCK, USERS_MOCK } from '../../../../mocks/mock-data';
import { SetUserAvatarPipe } from '../../../shared/pipes/set-user-avatar.pipe';
import { WsService } from '../../../services/ws.service';
import { ApiService } from '../../../services/api.service';
import { take } from 'rxjs';


@Component({
  selector: 'epm-chat',
  standalone: true,
  imports: [
    CommonModule,
    EpmChatMessageComponent,
    EpmInputComponent,
    EpmButtonComponent,
    ReactiveFormsModule,
    NgOptimizedImage,
    ToggleDisplayMessageTimePipe,
    ToggleDisplayChatStartDayPipe,
    ChatStartDayPipe,
    SetUserAvatarPipe
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit {
  @ViewChild('messageInput') messageInputRef!: EpmInputComponent;

  receiver: ExpandedUserDetailed = window.history.state.receiver;
  chatForm!: FormGroup<ChatForm>;
  // TODO change to id from http request
  // userId = '2';
  // messages: Message[] = CHAT_MOCK;
  // interlocutor: User = USERS_MOCK[1];

  // private mainApiService: MainApiService = "";
  // private apiService: ApiService = "";
  
  userId = "";
  
  //messages: Message[] = this.http.get<Message[]>(`${APP_ROUTER_NAME.Main}/${APP_ROUTER_NAME.Contact}/${this.receiver.email}`).subscribe();
  // wrong

  //thisChatId = this.userId+"-"+this.currentUser+"-chat";

  
  //chatsPr: ChatProper[] = mainApiService.getChatsList().pipe(take(1)).subscribe();
  
  //chatsList.forEach(ch => { 
  //  if((ch.user1.email == this.currentUser) && (ch.user2.email == this.userId) || (ch.user2.email == this.currentUser) && (ch.user1.email == this.userId))
  //  {
  //    this.thisChatId = ch.chat_id;
  //  };
  //});

  messages: Message[] = [];

  interlocutor: User = this.receiver;

  readonly buttonThemes: typeof BUTTON_THEMES = BUTTON_THEMES;
  readonly iconNames: typeof ICON_NAMES = ICON_NAMES;
  readonly inputPlaceholders: typeof INPUT_PLACEHOLDERS = INPUT_PLACEHOLDERS;

  get message(): FormControl {
    return this.chatForm.controls.message;
  }

  constructor(
    private title: Title,
    private router: Router,
    private headerService: HeaderService,
    private fb: FormBuilder,
    private wsService: WsService,
    private apiService: ApiService
    
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.userId = this.interlocutor.email;
    console.log("Receiver: "+this.userId);
    var currentUser = this.apiService.currentUser();
    var currentUserEmail = "";
    if(currentUser != null){
      currentUserEmail = currentUser.email;
    }
    console.log("Sender: "+currentUserEmail);
   // var chatsList: ChatProper[] = [];


    //this.apiService.getChatsList().pipe(take(1)).subscribe((response: ChatProper[]) => {chatsList = response;});

    //var thisChatId = chatsList.filter(ch => ((ch.user1.email == currentUserEmail) && (ch.user2.email == this.userId)) || ((ch.user2.email == currentUserEmail) && (ch.user1.email == this.userId)))[0].chat_id;


    //var unfilMessages: Message[] = [];
    //this.apiService.getMessagesList().pipe(take(1)).subscribe((response: Message[]) => {
    //    unfilMessages = response;});
    //this.messages = unfilMessages.filter(messag => {messag.chatId == thisChatId});

    this.wsService.connect(currentUserEmail);
    this.wsService.messages$.subscribe((message: any) => {
      console.log(message);
    });
  }

  ngAfterViewInit(): void {
    this.focusOnInput();
    this.scrollToBottom();
    setTimeout(() => this.setTitles(), 0);
  }

  onSend(): void {
    const currentUser = this.apiService.currentUser();
    console.log("CurrentUser: "+currentUser);
    if (this.message.value && currentUser) {
      const requestBody = {
        SenderName: currentUser.name,
        SenderAvatar: currentUser.avatar,
        SenderId: currentUser.email,
        ReceiverId: this.receiver.email,
        Message: this.message.value
      };
      console.log(requestBody);

      this.wsService.sendMessage(requestBody);
      this.message.reset();
      this.focusOnInput();
    }
  }

  onOpenUser(): void {
    this.router.navigateByUrl(`${APP_ROUTER_NAME.Main}/${APP_ROUTER_NAME.Contact}/${this.receiver.email}`);
  }

  trackByMessageId(_index: number, message: Message): string {
    return message.id;
  }

  private setTitles(): void {
    this.title.setTitle(`MEGATHON | ${this.interlocutor.name} chat`);
    this.headerService.addTitle(this.interlocutor.name);
  }

  private initForm(): void {
    this.chatForm = this.fb.group({
      message: new FormControl<string>('', { nonNullable: true })
    });
  }

  private scrollToBottom(): void {
    window.scrollTo(0, document.body.scrollHeight);
  }

  private focusOnInput(): void {
    this.messageInputRef.epmInputRef.nativeElement.focus();
  }
}
