import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import ChatProvider from './Context/ChatProvider';
import { ChakraProvider } from '@chakra-ui/react'
ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
    <ChatProvider>
    <App />
   </ChatProvider>
   </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

