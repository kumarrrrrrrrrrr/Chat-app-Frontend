import { Box,Text } from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/react";
export const getSender = (loggedUser,users)=>{
    return <Box 
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
    name={ users[0] && loggedUser && users[0]._id === loggedUser._id ? users[1].name : users[0].name}
    src={ users[0] && loggedUser && users[0]._id === loggedUser._id ? users[1].pic : users[0].pic}
    />
    <Box>
        <Text fontSize={{base:"20px",md:"18px"}}>{ users[0] && loggedUser && users[0]._id === loggedUser._id ? users[1].name : users[0].name}</Text>
    </Box>
    </Box>

}
export const getAlert =(loggedUser,users)=>{
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name
}
export const getSenderBox = (loggedUser,users)=>{
 return<Text>{ users[0]._id === loggedUser._id ? users[1].name : users[0].name}</Text>

}
export const getSenderFull = (loggedUser,users)=>{
    return users[0]._id === loggedUser._id ? users[1] : users[0].name;

}
export const isSameSender =(messages,m,i,userId)=>{
    return (
        i < messages.length -1 &&
        (messages[i+1].sender._id !== m.sender._id ||
            messages[i+1].sender._id === undefined) &&
            messages[i].sender._id !== userId            
            
            );
};

export const isLastMessage = (messages,i,userId)=>{
    return(
        i=== messages.length -1 && 
        messages[messages.length-1].sender._id !== userId && 
        messages[messages.length-1].sender._id
    );
}

export const isSameSenderMargin = (messages,m,i,userId)=>{
    if(
        i<messages.length -1 &&
        messages[i+1].sender._id === m.sender._id &&
        messages[i].sender._id !== userId
    )
    return 33;
    else if(
        (i<messages.length-1 &&
            messages[i+1].sender._id !== m.sender._id &&
        messages[i].sender._id !== userId) ||
        (i===messages.length-1 && messages[i].sender._id !== userId)
    )
    return 0;
    else return "auto"
}

export const isSameUser = (messages,m,i)=>{
    return i> 0 && messages[i - 1].sender._id === m.sender._id;
}