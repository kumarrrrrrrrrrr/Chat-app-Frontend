import React from 'react'
import { Box,Avatar,Text } from '@chakra-ui/react'

export const UserList = ({user,handleFunction}) => {
  return (
    <div>
    <Box
    onClick={handleFunction}
    cursor="pointer"
    bg="#bbbbbb"
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
        name={user.name}
        src={user.pic}
        />
        <Box>
            <Text>{user.name}</Text>
            <Text fontSize="xs"><b>Email : </b>{user.email}</Text>
        </Box>
    </Box>
</div>
  )
}
