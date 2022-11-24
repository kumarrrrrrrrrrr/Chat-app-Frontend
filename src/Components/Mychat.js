import { Box, Button, Stack, useToast,Text, Avatar } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import axios from 'axios';
import React, { useState,useEffect } from 'react';
import { ChatState } from '../Context/ChatProvider';
import { getSender } from '../config/ChatLogic';
import { ChatLoading } from './ChatLoading';
import GroupChatModel from './miniComponent/GroupChatModel';
import { BASE_URL } from '../constant';





function Mychat({fetchAgain}) {
 const {user,selectedChat,setSelectedChat,Chats,setChats} = ChatState();
    const [loggedUser,setLoggedUser]= useState();
 
    console.log(Chats);
    const toast = useToast();
    
    const fetchChats = async ()=>{
        try {
            const config = {
                headers:{
                    Authorization:`Bearer ${user.token}`,
                },
            };

            const {data}=await axios.get(`${BASE_URL}api/chat`, config);
            console.log(data);
            setChats(data)
            
        } catch (error) {
          toast({
            title:"Error n occured",
            description:"Failed to Load the Chats",
            status:"error",
            duration:3000,
            isClosable:true,
            position:"bottom-left"
        });
        }
    }
    useEffect(() => {
      setLoggedUser(JSON.parse(localStorage.getItem("userInfo")))
      fetchChats();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchAgain])
    
  return<Box
   d={{base:selectedChat ? "none":"flex",md:"flex"}}
   flexDir="column"
   alignItems="center"
   p={3}
   bg="white"
   w={{base:"100%",md:"31%"}}
   borderRadius="lg"
   borderWidth="1px"
    >
      <Box
      pb={3}
      px={3}
      fontSize={{base:"28px",md:"30px"}}
      fontFamily="Work sans"
      d="flex"
      w="100%"
      justifyContent="space-between"
      alignItems="center"
      >
       <span ><b>Chats</b></span>
        <GroupChatModel>
        <Button d="flex" bg="#031630" color="white"
        _hover={{
          background:"#1e3453",
          color:"white",
      }}
        fontSize={{base:"17px",md:"10px",lg:"17px"}} rightIcon={<AddIcon/>} >Group Chat</Button>

        </GroupChatModel>
      </Box>
      <Box
      d="flex"
      flexDir="column"
      p={3}
      bd="#f8f8f8"
      w="100%"
      h="100%"
      borderRadius="lg"
      overflowY="hidden"
      >
         {Chats?(
        <Stack overflowY='scroll'>
          {Chats.map((chat)=>(
            <Box onClick={()=>setSelectedChat(chat)}
            key={chat._id}
            >
          {!chat.isGroupChat
            ? getSender(loggedUser,chat.users): (
              <Box 
              cursor="pointer"
              _hover={{
                  background:"#1e3453",
                  color:"white",
              }}
              
              w="100%"
              d="flex"
              alignItems="center"
              color="black"
              px={3}
              py={2}
              mb={2}
              borderRadius="lg"
              >
                  <Avatar
              mr={2}
              size="sm"
              cursor="pointer"
              name={chat.chatName}
              src='https://cdn.imgbin.com/14/4/7/imgbin-computer-icons-online-chat-chat-room-group-G1GHS9YFYfGjCppvrjNud7GWE.jpg'
              />
              <Box>
                  <Text fontSize={{base:"20px",md:"18px"}}>{chat.chatName}</Text>
              </Box>
              </Box>

            )}
            </Box>
          ))}
        </Stack>
      ):(<ChatLoading/>)}
      </Box>
     
     
    </Box>
  
}

export default Mychat