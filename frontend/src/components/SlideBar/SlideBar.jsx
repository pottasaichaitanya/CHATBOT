import { useState, useEffect } from 'react';
import './SlideBar.css';
import useStore from '../store/useStore.js';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';


const SlideBar = () => {
  const { token } = useStore();
  const [chat_history, setChat_history] = useState([]);
  const navigate = useNavigate();
  const { chatId } = useParams();
  const back_end_url = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    axios.post(`${back_end_url}/messages/chat_history`, {}, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
    .then(response => {
      setChat_history(response.data.chat_history);
    })
    .catch(error => {
      navigate('/');
      console.error('Error fetching conversations:', error);
    });
  }, [token]);

  const get_new_Chat = async () => {
    try {
      const response = await axios.post(`${back_end_url}/messages/create_chat`, {chat_id:chatId}, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (response.data.status === 'success') {
        
        navigate(`/chat/${response.data.chat_id}`);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error creating new chat:', error);
      toast.error('Failed to create new chat');
    }
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <button onClick={get_new_Chat}>
          <i className="bi bi-file-earmark-plus"></i>
          <span>New Chat</span>
        </button>
      </div>

      <div className="sidebar-chats">
        {chat_history && chat_history.map((item, index) => (
          <div
            key={index}
            className={`chat-item ${chatId == item.chat_id ? 'active' : ''}`}
            onClick={() => navigate(`/chat/${item.chat_id}`)}
          >
            {item.chat_name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlideBar;