import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box,FormControl,IconButton,Spinner,Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useState,useEffect } from 'react'
import {  getSenderBox, getSenderFull} from '../config/ChatLogic';
import { ChatState } from '../Context/ChatProvider'
import ProfileModel from './miniComponent/ProfileModel';
import UpdateGroupChatModal from './miniComponent/UpdateGroupChatModal';
import ScrollableChat from './miniComponent/ScrollableChat';
import io from "socket.io-client"
import { BASE_URL } from '../constant';


const ENDPOINT = "http://localhost:8080/";
var socket , selectedChatCompare;

 const SingleChat = ({fetchAgain,setFetchAgain}) => {
    
    const [message,setMessage] = useState([]);
    const [loading,setLoading]=useState(false)
    const [newMessage,setNewmessage]=useState();
    const [socketConnected,setSocketConnected] = useState(false);
    const {user,selectedChat,setSelectedChat,notification,setNotification} = ChatState();
    const [typing,setTyping] = useState(false)
    const [isTyping,setIsTyping] = useState(false)

        useEffect(()=>{
            socket = io(ENDPOINT)
            socket.emit("setup",user);
            socket.on('connected',()=> setSocketConnected(true))
            socket.on('typing',()=>setIsTyping(true))
            socket.on('stop typing',()=>setIsTyping(false))
            // eslint-disable-next-line react-hooks/exhaustive-deps
        },[]);
    const toast = useToast()
    const fetchMessage = async()=>{
        if(!selectedChat) return

        try {
            const config = {
                headers:{
                    "Content-Type":"application/json",
                    Authorization:`Bearer ${user.token}`
                }
            }  ;
            setLoading(true)
            const {data} = await axios.get(`${BASE_URL}api/message/${selectedChat._id}`,config);
           
            setMessage(data);
          setLoading(false)
            socket.emit('joinChat', selectedChat._id);
        } catch (error) {
            toast({
                title:"Chat not send",
                status:"error",
                duration:3000,
                isClosable:true,
                position:"top"
            });
        }
    }

    useEffect(()=>{
        fetchMessage() ;
        selectedChatCompare = selectedChat;
        console.log(notification)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[selectedChat]);

    useEffect(()=>{
        socket.on('message recived',(newMessageRecived)=>{
            if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecived.chat._id){
                if(!notification.includes(newMessageRecived)){
                    setNotification([...notification, newMessageRecived]);
                    setFetchAgain(!fetchAgain)

                }
            }else{
                setMessage([...message,newMessageRecived])
                
            }
        })
    })
    const clickMessage = async()=>{
        if(newMessage){
            socket.emit('stop typing',(selectedChat._id))
           try {
             const config = {
                 headers:{
                     "Content-Type":"application/json",
                     Authorization:`Bearer ${user.token}`
                 }
             }  ;
             setNewmessage("");
             const {data} = await axios.post(`${BASE_URL}api/message`,{
                 content:newMessage,
                 chatId:selectedChat._id,
             },config)
            socket.emit('new message',data)
    
             setMessage([...message,data])
           } catch (error) {
            toast({
                title:"Chat not send",
                status:"error",
                duration:3000,
                isClosable:true,
                position:"top"
            });
           }
}
    }
    const sendMessage = async(event)=>{
        if(event.key==="Enter" && newMessage){
            socket.emit('stop typing',(selectedChat._id))
           try {
             const config = {
                 headers:{
                     "Content-Type":"application/json",
                     Authorization:`Bearer ${user.token}`
                 }
             }  ;
             setNewmessage("");
             const {data} = await axios.post(`${BASE_URL}api/message `,{
                 content:newMessage,
                 chatId:selectedChat._id,
             },config)
            socket.emit('new message',data)
             setMessage([...message,data])
           } catch (error) {
            toast({
                title:"Chat not send",
                status:"error",
                duration:3000,
                isClosable:true,
                position:"top"
            });
           }
}
   
    }
 
    const typingHandler = async(e)=>{
        setNewmessage(e)
        if(!socketConnected) return;
        if(!typing)
        setTyping(true);
        socket.emit("typing", selectedChat._id);
       }
       let lastTypingTime = new Date().getTime();
       var timeLayer = 5000;
       setTimeout(() => {
           var timeNow = new Date().getTime();
           var timeDiff = timeNow - lastTypingTime;
           if(timeDiff>=timeLayer && typing){
               socket.emit("stop typing",selectedChat._id);
               setTyping(false)
           }
       }, timeLayer);
    return <>
    {
        selectedChat?(
            <>
            <Box
            fontSize={{base:"28px",md:"30px"}}
            p="5px"
            px={3}
            bg="White"
            w="100%"
            fontFamily="Work sans"
            d="flex"
            justifyContent={{base:"space-between"}}
            alignItems="center"
            >
                <IconButton
                bg='#1e3453'
                color="white"
                d={{base:"flex",md:"none"}}
                icon={<ArrowBackIcon/>}
                onClick={()=> setSelectedChat("")}
                />
                {!selectedChat.isGroupChat ?(
                    <>
                    {getSenderBox(user,selectedChat.users)}
                    <ProfileModel user={getSenderFull(user,selectedChat.users)}/>
                    </>
                ):(
                    <>
                    {selectedChat.chatName.toUpperCase()}
                    <UpdateGroupChatModal
                    fetchAgain = {fetchAgain}
                    setFetchAgain={setFetchAgain}
                    fetchMessage ={fetchMessage}
                    />
                    </>
                )}
            </Box>
            <Box 
            d="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bgImage='https://www.pixelstalk.net/wp-content/uploads/images4/Download-Free-Cool-iPhone-Backgrounds-3.jpg'
            bgSize="cover"
            bgPosition="center"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
            >
                {
                  loading?(<Spinner
                  size="xl"
                  w={20}
                  h={20}
                  alignSelf="center"
                  margin="auto"
                  />):(
                       <div className='messages'>
                       <ScrollableChat message={message}/>
                      
                       </div>
                  )
                }
                <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                    {isTyping?<div className='typ'>Typing...</div>:(<></>)}
                    <input
                    className='input'
                    placeholder='Enter the message...'
                    onChange={(e)=>typingHandler(e.target.value)}
                    value={newMessage}
                    />
                     <button className='send' onClick={clickMessage}><i class="fa-solid fa-paper-plane"></i>
             
             </button>
                </FormControl>
            </Box>
            </>
        ):(
            <Box d="flex" alignItems="center" justifyContent="center" h="100%" >
                <Text fontSize="3xl" pb={3} fontFamily="Work sans" >
                    Click on a User to start Chatting
                </Text>
  
            </Box>
        )
    }
    </>

 }


 export default SingleChat;