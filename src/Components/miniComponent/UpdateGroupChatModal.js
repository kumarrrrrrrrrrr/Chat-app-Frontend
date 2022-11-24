import { ViewIcon } from '@chakra-ui/icons'
import { Button, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast, Box, FormControl, Input, Spinner } from '@chakra-ui/react'
import axios from 'axios';
import React, { useState } from 'react'
import { BASE_URL } from '../../constant';
import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../userAvator/UserBadgeItem';
import { UserList } from '../userAvator/UserList';


function UpdateGroupChatModal({fetchAgain,setFetchAgain,fetchMessage}) {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const {user,selectedChat,setSelectedChat} = ChatState();
    const [groupChatName,setGroupChatName]=useState();
    const [search,setSearch]=useState("");
    const [searchResult,setSearchResult] = useState([]);
    const [loading,setLoading]= useState(false);
    const [renameLoading,setRenameLoading]=useState(false)
 const toast = useToast()

 const handleAddUser = async(userAdd)=>{
   console.log("hai");
    if(selectedChat.users.find((u)=>u._id === userAdd._id)){
      toast({
        title:"User Already In the Group",
        status:"error",
        duration:3000,
        isClosable:true,
        position:"top"
    });
    return

    }
    if(selectedChat.groupAdmin._id !== user._id){
      toast({
        title:"Only admins can add someone!",
        status:"error",
        duration:3000,
        isClosable:true,
        position:"top"
    });
    return

    }
    try {
      setLoading(true)
      const config = {
        headers:{
            Authorization:`Bearer ${user.token}`,
        },
    };
    const {data} = await axios.put(`${BASE_URL}api/chat/groupadd`,{
      chatId:selectedChat._id,
      userId:userAdd._id,
    },config);
      setSelectedChat(data)
      setFetchAgain(!fetchAgain)
      setLoading(false)
    } catch (error) {
      toast({
        title:"error",
        status:"error",
        duration:3000,
        isClosable:true,
        position:"top"
    });
    }
 }
 const handleRemove =async(userDel)=>{
    if(selectedChat.groupAdmin._id !== user._id && userDel._id !== user._id){
      toast({
        title:"Only admins can remove someone!",
        status:"error",
        duration:3000,
        isClosable:true,
        position:"top"
    });
    return

  }
  try {
    setLoading(true)
    const config = {
      headers:{
          Authorization:`Bearer ${user.token}`,
      },
  };
  const {data} = await axios.put(`${BASE_URL}api/chat/groupremove`,{
    chatId:selectedChat._id,
    userId:userDel._id,
  },config);
    userDel._id===user._id? setSelectedChat() : setSelectedChat(data);
    setFetchAgain(!fetchAgain)
    fetchMessage();
    setLoading(false)
  } catch (error) {
    toast({
      title:"error",
      status:"error",
      duration:3000,
      isClosable:true,
      position:"top"
  });
  }

 }

 const handleRename=async()=>{
    if(!groupChatName)return

    try {
      setRenameLoading(true)
      const config = {
        headers:{
            Authorization:`Bearer ${user.token}`,
        },
    };
      const {data} = await axios.put(`${BASE_URL}api/chat/rename`,{
        chatId : selectedChat._id,
        chatName:groupChatName
      },config)
      setSelectedChat(data);
      setFetchAgain(!fetchAgain)
      setRenameLoading(false)
    } catch (error) {
      toast({
        title:"Error occured",
        description:error.response.data.message,
        status:"error",
        duration:3000,
        isClosable:true,
        position:"bottom-left"
    });
    }
    setGroupChatName("")
  }
 
  const handleSearch= async (query)=>{
    setSearch(query)
   if(!search){
    
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
       console.log(data);
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
  return <>
  <IconButton
  d={{base:"flex"}} icon={<ViewIcon/>} onClick={onOpen}
  />
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
          fontSize="35px"
          fontFamily="Work sans"
          d="flex"
          justifyContent="center"
          >{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
          d="flex"
          flexDir="column"
          alignItems="center"
          justifyContent="space-between"
          >
          <Box w="100%" d="flex" flexWrap="warp " pb={3}>
            {selectedChat.users.map((u)=>(
              <UserBadgeItem
              key={u._id}
              user={u}
              handleFunction={()=>handleRemove(u)}
              />
            ))}
          </Box>
          <FormControl d="flex">
            <Input
           placeholder='Change group Name'
           mb={3}
           value={groupChatName}
           onChange={(e)=>setGroupChatName(e.target.value)}
            />
            <Button
            variant="solid"
            colorScheme="teal"
            ml={1}
            isLoading={renameLoading}
            onClick={handleRename}
            >
              Update
            </Button>
          </FormControl>
          <FormControl>
          <Input
           placeholder='Add User'
           mb={3}
           onChange={(e)=>handleSearch(e.target.value)}
            />
          </FormControl>
          {loading?(
            <Spinner size="lg"/>
          ):(
            searchResult?.map((user)=>(
              <UserList
              key={user._id}
              user={user}
              handleFunction={()=>handleAddUser(user)}
              />
            ))
          )

          }
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={()=>handleRemove(user)}>
              Leave Group
            </Button>

          </ModalFooter>
        </ModalContent>
      </Modal>
  </>
}

export default UpdateGroupChatModal