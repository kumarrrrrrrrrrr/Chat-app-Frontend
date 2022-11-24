import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuItem, MenuList, Spinner, Text, Tooltip, useToast } from '@chakra-ui/react';
import React,{useState} from 'react'
import {ChevronDownIcon} from "@chakra-ui/icons";
import { ChatState } from '../../Context/ChatProvider';
import ProfileModel from './ProfileModel';
import { useNavigate } from 'react-router-dom';
import {useDisclosure} from "@chakra-ui/hooks"
import axios from 'axios';
import { ChatLoading } from '../ChatLoading';
import { UserList } from '../userAvator/UserList';
import { getAlert} from '../../config/ChatLogic';
import { BASE_URL } from '../../constant';


function SideDrawe() {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const navigate = useNavigate()
    const {user,selectedChat,setSelectedChat,Chats,setChats,notification,setNotification} = ChatState();
    const [search,setSearch]=useState('');
    const [searchResult,setSearchResult]=useState([])
    const [loading,setLoading]=useState(false);
    const [loadingChat,setLoadingChat]=useState()
    const toast = useToast();
    const handleSearch= async ()=>{
        if(!search){
            toast({
                title:"Please Enter something in search",
                status:"warning",
                duration:3000,
                isClosable:true,
                position:"top-left"
            });
            return;
        }
        try {
            setLoading(true)
            const config={
                headers:{

                    Authorization:`Bearer ${user.token}`,
                },
            };
            const {data}= await axios.get(`${BASE_URL}api/user?search=${search}`,config);
            setLoading(false);
            setSearchResult(data)
        } catch (error) {
            toast({
                title:"Error occured",
                status:"error",
                duration:3000,
                isClosable:true,
                position:"bottom-left"
            });
        }
    }

    const accessChat = async(userId)=>{
        try {
            setLoadingChat(true);
            const config={
                headers:{
                    "Content-type": "application/json",
                    Authorization:`Bearer ${user.token}`,
                },
            };

            const {data}= await axios.post(`${BASE_URL}api/chat`, {userId}, config);

            if(!Chats.find((c)=>c._id === data._id)) setChats([data, ...Chats]);       
            setSelectedChat(data)
            setLoadingChat(false);
            onClose();
        } catch (error) {
            toast({
                title:"Error is occured",
                status:"error",
                duration:3000,
                isClosable:true,
                position:"bottom-left"
            });
        }
       
    }

    function logOut(){
        localStorage.removeItem("userInfo");
        navigate('/')

    }
    
  return <div>
     <Box
     d={selectedChat ? {base:"none",md:"flex"}:"flex"}
     justifyContent="space-between"
     alignItems="center"
     w="100%"
     p={{base:"10px 10px 10px 10px",md:"9px 10px 9px 10px"}}
     bg="#031630"

     >
         <Tooltip d={{base:"none",md:"flex"} } label="seach Users to Chat" hasArrow placement='bottom-end'>
             <Button  d={{base:"none",md:"flex"} } bg="white" onClick={onOpen}><i className="fa-solid fa-magnifying-glass"></i>
             <Text d={{base:"none",md:"flex"} }px='4'>Seach Users</Text>
             
             </Button>
         </Tooltip>
         <Text fontSize="3xl" ml={2} color="white" fontFamily="monospace">ZoText</Text>
         <div>
             <Menu>
                 <MenuButton p={1} pr={6}>
                 <i className="fa-solid fa-bell" style={{color:"white"}}></i>
                 <span className="notification">{notification.length}</span>
                 </MenuButton>
                 <MenuList pl={2}>
                     {!notification.length && "No New Messages"}
                     {notification.map((notif)=>(
                         <MenuItem key={notif._id} onClick={()=>{
                             setSelectedChat(notif.chat)
                             setNotification(notification.filter((n)=>n !== notif))
                         }}>
                             {notif.chat.isGroupChat?`New message in ${notif.chat.chatName}`:
                            ` New Message from ${getAlert(user,notif.chat.users)}`}
                         </MenuItem>
                     ))}
                 </MenuList>
             </Menu>
             <Menu p="-10px">
                 <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
                    <Avatar size="sm"
                     cursor="pointer"
                      name={user.name}
                      src={user.pic}
                    
                      />

                  
                 </MenuButton>
                 <MenuList><ProfileModel user={user}>
                 <MenuItem>My Profile</MenuItem>
                 </ProfileModel>
                     <MenuItem onClick={()=>onOpen()}>Search User</MenuItem>
                     <MenuItem onClick={()=>logOut()}>LogOut</MenuItem>

                 </MenuList>
             </Menu>
         </div>
     </Box>
     <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
       <DrawerOverlay/>
       <  DrawerContent>
       <DrawerHeader borderBottomWidth="1px">Search User</DrawerHeader>
       <DrawerBody  >
           <Box d="flex" pb={2} >
               <Input placeholder="Search By Name or Email"
               mr={2}
               value={search}
               onChange={(e)=>setSearch(e.target.value)} />
               <Button onClick={()=>handleSearch()}>GO</Button>
            </Box>
            {loading?(<ChatLoading/>):(
                searchResult?.map(user =>(
                  <UserList
                    key={user._id}
                    user={user}
                    handleFunction = {()=>accessChat(user._id)}
                    />
                ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
       </DrawerBody>

       </DrawerContent>
       
    </Drawer>
      
  </div>
  
}

export default SideDrawe
