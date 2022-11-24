import React, { useEffect,useState } from 'react'

import {ChatState} from "../Context/ChatProvider"
import SideDrawe from './miniComponent/SideDrawe';
import { Box } from '@chakra-ui/react';

import ChatBox from './ChatBox';
import Mychat from './Mychat';

function ChatPage() {
  const {user,Chats} = ChatState();
  const [fetchAgain,setFetchAgain] = useState(false)
  useEffect(()=>{
    setFetchAgain(true) 
  },[])
  console.log(Chats);
  return<>{
    user? <div style={{width:"100%"}}>
    {user &&<SideDrawe/>}
   <Box d="flex" justifyContent="space-between" w="100%" h={{base:"100vh", md:"90.7vh"}}  > 
   {user && (
   <Mychat fetchAgain={fetchAgain}/>
    )}
   {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} /> }
 
 
   </Box>
 
   </div>:"loading"
  }
 
  </>
}

export default ChatPage