//import React, {useState, useEffect, useCallback, useRef, MutableRefObject} from 'react';

import { Injectable } from '@angular/core';
import { catchError, delayWhen, EMPTY, Observable, retryWhen, Subject, switchAll, tap, timer, map} from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

//import ReactService from '../../../services/react.service';

import { environment } from '../../environments/environment';

const BASE_URL = environment.wsUrl;

@Injectable({
  providedIn: 'root'
})
export class WsService {
  readonly RECONNECT_INTERVAL = 2000;

  socket$!: WebSocketSubject<any>;
  //reactSocket$!: MutableRefObject<WebSocket>;//= useRef<WebSocket>(null);// I swear to GOD
  private reactSocket$: WebSocket | null;

  constructor() {
    this.reactSocket$ = null;
  }

  private messagesSubject$: Subject<any> = new Subject();

  messages$ =  this.messagesSubject$.pipe(
    switchAll(),
    catchError(e => {
      throw e;
    })
  );

  connect(userId: string, config: { reconnect: boolean } = { reconnect: false }) {
    if (!this.reactSocket$ || this.reactSocket$.readyState !== WebSocket.OPEN) {
      this.reactSocket$ = new WebSocket(`${BASE_URL}?userId=${userId}`);
      this.reactSocket$.addEventListener('open', () => {console.log('ReactWebSocket connected succesfully');})
      this.reactSocket$.addEventListener('close', () => {console.log('ReactWebSocket connection ended succesfully');})
      this.reactSocket$.addEventListener('message', () => {console.log('ReactWebSocket Sent message');})
    }
    //this.reactSocket$ = useRef<WebSocket>(new WebSocket(BASE_URL));
    //this.reactSocket$.current?.addEventListener('open', () => {console.log('ReactWebSocket connected succesfully')})
    //this.reactSocket$.current?.addEventListener('close', () => {console.log('ReactWebSocket connection ended succesfully')})
    //this.reactSocket$.current?.addEventListener('message', () => {console.log('ReactWebSocket Sent message')})
      
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = this.getSocket(userId);




      console.log("Connect to socket: "+this.socket$);

      const messages = this.socket$.pipe(
        config.reconnect ? this.reconnect : o => o,
        tap({
          error: error => console.log(error)
        }),
        catchError(_ => EMPTY)
      );

      this.socket$.subscribe(
      (msg) => console.log('Sent message:', msg), // Sent handler
      (err) => console.error('WebSocket error:', err), // Error handler
      () => console.log('WebSocket connection ended succesfully') // Completion handler
    );

      console.log("Get messages: "+messages.toString());
      console.log("Get messagesSubject: "+this.messagesSubject$.toString());

      this.messagesSubject$.next(messages);
    }
  }

  reconnect(observable: Observable<any>) {
    return observable.pipe(
      retryWhen(errors =>
        errors.pipe(
          tap(val => console.log('[WS Service] Try to reconnect', val)),
          delayWhen(_ => timer(this.RECONNECT_INTERVAL))
        )
      )
    );
  }

  close() {
    this.socket$.complete();
    this.socket$ = null!;
    if (this.reactSocket$ && this.reactSocket$.readyState === WebSocket.OPEN) {
      this.reactSocket$.close();
    }
  }

  sendMessage(msg: {
    SenderName: string;
    SenderAvatar: string;
    SenderId: string;
    ReceiverId: string;
    Message: string;
  }) {
    console.log("Message to send: "+msg.Message);
    const body = JSON.stringify({action: 'send', message: msg});
    this.socket$?.next(body);// THIS POS DOES NOT SEND ANYTING!!!
    console.log("Message was sent");// LIES!!!
    //this.socket$.next(body);
    //if (this.reactSocket$?.current){
    //  this.reactSocket$?.current.send(body);
    //}

    if (this.reactSocket$ && this.reactSocket$.readyState === WebSocket.OPEN) {
      this.reactSocket$.send(body);
      console.log("React message was sent");
    }

    //const body2 = JSON.stringify({ "action": "send", "SenderName": msg.SenderName, "SenderAvatar": msg.SenderAvatar, "SenderId": msg.SenderId, "ReceiverId": msg.ReceiverId, "Message": msg.Message});
    //this.socket$.next(body2);
    
  }

  private getSocket(userId: string) {
    console.log("UserId of a socket: "+userId);
    
    return webSocket({
      url: `${BASE_URL}?userId=${userId}`,
      openObserver: {
        next: () => {
          console.log('connection ok');
        },
        error: (err) => console.error('WebSocket open error:', err)
      },
      closeObserver: {
        next: () => {
          console.log('connection closed');
          this.socket$ = null!;
          this.connect(userId, { reconnect: true });
        }
      }
    });
  }
}

// const ReactService = () => {
//   const reactSocket = useRef<WebSocket | null>(null); // Define the type of ref

//   const onConnect = useCallback(() => {
//     if (reactSocket.current?.readyState !== WebSocket.OPEN) {
//       reactSocket.current = new WebSocket(BASE_URL);
//       reactSocket.current.addEventListener('open', () => {
//         console.log("ReactSocket open");});
//       reactSocket.current.addEventListener('close', () => {
//         console.log("ReactSocket close");});
//       reactSocket.current.addEventListener('message', (event) => {
//         console.log(event.data);
//       });
//     }
//   }, []);

//   useEffect(() => {
//     return () => {
//       reactSocket.current?.close();
//     };
//   }, []);

//   const onDisconnect = useCallback(() => {
//     reactSocket.current?.close();
//   }, []);


//   const onSendMessage = useCallback((msg: {
//     SenderName: string;
//     SenderAvatar: string;
//     SenderId: string;
//     ReceiverId: string;
//     Message: string;}
//     ) => {
//     reactSocket.current?.send(JSON.stringify({
//       action: 'send',
//       msg
//     }));
//   }, []);


  

//   return (ReactService);
// };

