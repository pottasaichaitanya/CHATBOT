import { useState, useEffect, useRef } from 'react'
import ChatMessages from '../chatMessages/ChatMessages.jsx'
import SlideBar from '../SlideBar/SlideBar.jsx';
import './Chatarea.css'
import { useParams, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore.js'
import toast from 'react-hot-toast';

const Chatarea = () => {
  const { chatId } = useParams();
  const { token } = useStore();
  const [slidebar, setSlidebar] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const navigate = useNavigate();
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (!token) {
      toast.error('Please log in to access chat area');
      navigate('/');
    }
  }, []);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      setShowScrollButton(false); 
    }
  };

  const handleScroll = () => {
    const container = chatContainerRef.current;
    if (container) {
      const isAtBottom =
        container.scrollHeight - container.scrollTop <= container.clientHeight + 10;
      setShowScrollButton(!isAtBottom);
    }
  };

  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll(); 
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div className='chatarea'>
      <div className='chatarea__sidebar' style={{ width: slidebar ? '250px' : '0px' }}>
        <div className='sidebar-header'>
          <button className='toggle-button' onClick={() => setSlidebar(!slidebar)}>
            ☰
            {slidebar && <h4 style={{ marginLeft: '10px' }}>Chat History</h4>}
          </button>
        </div>
        {slidebar && <SlideBar />}
      </div>

      <div className='chat__messages' ref={chatContainerRef}>
        <h2>Chat Messages</h2>
        <ChatMessages />
        {showScrollButton && (
          <button className="scroll-to-bottom" onClick={scrollToBottom}>↓</button>
        )}
      </div>
    </div>
  )
}

export default Chatarea
