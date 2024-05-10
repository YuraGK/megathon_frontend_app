import React, { useState, useEffect, useCallback, useRef } from 'react'

import { environment } from '../../environments/environment';

const BASE_URL = environment.wsUrl;


const ReactService = () => {
  const reactSocket = useRef<WebSocket | null>(null); // Define the type of ref

  const onConnect = useCallback(() => {
    if (reactSocket.current?.readyState !== WebSocket.OPEN) {
      reactSocket.current = new WebSocket(BASE_URL);
      reactSocket.current.addEventListener('open', (event) => {
        console.log(event.data);});
      reactSocket.current.addEventListener('close', (event) => {
        console.log(event.data);});
      reactSocket.current.addEventListener('message', (event) => {
        console.log(event.data);
      });
    }
  }, []);

  useEffect(() => {
    return () => {
      reactSocket.current?.close();
    };
  }, []);

  const onDisconnect = useCallback(() => {
    reactSocket.current?.close();
  }, []);


  const onSendMessage = useCallback((msg: {
    SenderName: string;
    SenderAvatar: string;
    SenderId: string;
    ReceiverId: string;
    Message: string;}
    ) => {
    reactSocket.current?.send(JSON.stringify({
      action: 'send',
      msg
    }));
  }, []);


  

  return (true);
};

export default ReactService;