import {createContext, useEffect,useState,useContext} from 'react';
const ChatContext = createContext();
const ChatProvider = ({children})=>{

    const [user,setUser]=useState();
    const [selectedChat,setSelectedChat]=useState();
    const [Chats,setChats]=useState([]);
    const [notification,setNotification] = useState([])
    useEffect(()=>{
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);
    },[])
    return<><ChatContext.Provider value={{user,setUser,selectedChat,setSelectedChat,Chats,setChats,notification,setNotification}}>
        {children}
        </ChatContext.Provider></>
}
export const ChatState=()=>{
    return useContext(ChatContext)

}
export default ChatProvider;