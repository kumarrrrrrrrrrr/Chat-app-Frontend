import React from 'react';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import './App.css';
import ChatPage from './Components/ChatPage';
import HomePage from './Components/HomePage';


function App() {
  return (
    <div className="app">
     <Router>
       <Routes>
         <Route path='/' element={<HomePage/>}></Route>
         <Route path='/chats' element={<ChatPage/>}></Route>
       </Routes>
     </Router>
    </div>
  )
}

export default App;
