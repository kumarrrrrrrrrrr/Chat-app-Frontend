import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import axios from 'axios';
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import { UserList } from '../userAvator/UserList';
import UserBadgeItem from '../userAvator/UserBadgeItem';
import { BASE_URL } from '../../constant';


const GroupChatModel = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName,setGroupChatName]=useState();
    const [selectedUser,setSelectedUser]=useState([]);
    const [search,setSearch]=useState("");
    const [searchResult,setSearchResult] = useState([]);
    const [loading,setLoading]=useState(false)
   const toast = useToast();

   const {user,Chats,setChats} = ChatState();
    
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
        // console.log(data);
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

 function handleGroup(userToAdd){
    if(selectedUser.includes(userToAdd)){
      toast({
        title:"User already added",
        status:"warning",
        duration:3000,
        isClosable:true,
        position:"top"
        })
        return;
    }

    setSelectedUser([...selectedUser,userToAdd])
 }
 function handleDelete(del){
  setSelectedUser(selectedUser.filter(d=>d._id !== del._id))
 }

const handleSubmit = async()=>{
  if(!groupChatName || !selectedUser){
    toast({
      title:"Please fill all field",
      status:"warning",
      duration:3000,
      isClosable:true,
      position:"top"
      })
      return;
  }
  try {
    const config={
      headers:{

          Authorization:`Bearer ${user.token}`,
      },
  };
  const {data} = await axios.post(`${BASE_URL}api/chat/group`,{
    name:groupChatName,
    users:JSON.stringify(selectedUser.map((u)=>u._id)),
  },config);

  setChats([data, ...Chats])
  onClose();
  toast({
    title:"New Group Chat Created!",
    status:"success",
    duration:3000,
    isClosable:true,
    position:"buttom",
    })
  } catch (error) {
    toast({
      title:"erroe occur while creating Group Chat",
      status:"warning",
      duration:3000,
      isClosable:true,
      position:"buttom",
      })
  }
   }

  return <>
    <span onClick={onOpen} >{children}</span>
     <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent w={{base:"270px",md:"350px"}}>
          <ModalHeader
          fontSize="25px"
          fontFamily="work sans"
          d="flex"
          justifyContent="center"
          >Create Group</ModalHeader>
          <ModalCloseButton />
          <ModalBody
          d="flex"
          flexDir="column"
          alignItems="center"
          >
           <FormControl>
             <Input placeholder='Group Name' mb={3}
             onChange={(e)=>setGroupChatName(e.target.value)}
             />
           </FormControl>
           <FormControl>
             <Input placeholder='Add User eg: John,Piyush,Jane' mb={1}
             onChange={(e)=>handleSearch(e.target.value)}
             />
           </FormControl>
          <Box w="100%"d="flex" flexwarp="wrap">
          {
           selectedUser.map((u)=>(
            <UserBadgeItem
            key={user._id}
            user={u}
            handleFunction={()=>handleDelete(u)}
            />

           ))
           }
          </Box>
          <Box
          d="flex"
          flexDir="column"
          p={1}
          bd="#f8f8f8"
          w="100%"
          h="50%"
          borderRadius="lg"
          overflowY="hidden"
          >
             { 
             loading?<div>Loading..</div>:(
               searchResult?.slice(0,4).map(user=>(<UserList
               key={user._id}
               user = {user}
               handleFunction={()=>handleGroup(user)}
               />)))
           }
          </Box>
          
          </ModalBody>

          <ModalFooter>
            <Button bg="#1e3453" color="white"
            _hover={{
              background:"#1e3453",
              color:"white",
          }}
            onClick={()=>handleSubmit()
            }
            >
              Create
            </Button>

          </ModalFooter>
        </ModalContent>
      </Modal>
  </>
}

export default GroupChatModel

