import { useState } from 'react'
import  {Routes, Route} from 'react-router-dom'
import Chatarea from './components/chatArea/Chatarea.jsx'
import Login from './components/login/Login.jsx'
import { Toaster } from 'react-hot-toast'
function App() {
  const [logIn,setLogIn]=useState(false)
  

  return (
    <div className="App">
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Login logIn={logIn} setLogIn={setLogIn} />} />
        <Route path="/chat/:chatId" element={<Chatarea />} />
      </Routes>
    </div>
  )
}

export default App
