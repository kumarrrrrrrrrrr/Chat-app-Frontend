import React from 'react'
import { ChatState } from '../Context/ChatProvider';
import {Box} from '@chakra-ui/react';
import SingleChat from './SingleChat';

function ChatBox({fetchAgain,setFetchAgain}) {

    const {selectedChat}=ChatState()
  return <Box d={{base:selectedChat? "flex":"none",md:"flex"}}
  alignItems="center"
  flexDir="column"
  w={{base:"100%",md:"68%"}}
  borderRadius="lg"

  >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
  </Box>
}

export default ChatBox