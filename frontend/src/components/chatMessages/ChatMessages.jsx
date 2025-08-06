import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import useStore from '../store/useStore.js';
import './ChatMessages.css';
import toast from 'react-hot-toast';

const ChatMessages = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const { token } = useStore();
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const back_end_url = import.meta.env.VITE_BACKEND_URL;


  const generateResponse = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${back_end_url}/messages/request`,
        { chat_id: chatId, text: inputValue },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.data.status === 'success') {
        toast.success('response generated successfully');
        setMessages(prevMessages => [...prevMessages, { human_message: inputValue, ai_message: response.data.response, timestamp: new Date().toISOString() }]);
      }
      else {
        navigate('/');
        toast.error(response.data.message);

      }
    } catch (error) {
      console.error('Error generating response:', error);
      toast.error('Error generating response');
    }
    finally {
      setLoading(false);
      setInputValue('');
    }
  }
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.post(
          `${back_end_url}/messages/chat_conversation`,
          { chat_id: chatId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.data.status === 'success') {
          setMessages(response.data.messages);
          toast.success('Chat messages fetched successfully');
        }
        else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error('Error fetching messages');
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [chatId, token]);



  return (
    <div className="chat-messages-container">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <React.Fragment key={index}>
            <div className="message-text">{message.human_message}
              <div className="timestamp">
                {new Date(message.timestamp).toLocaleString([], {
                  dateStyle: 'medium',
                  timeStyle: 'short'
                })}
              </div>
            </div>


            <div className="ai-message-container">
              <div className="message-ai">{message.ai_message}</div>
              <button
                className="copy-btn"
                onClick={() => {
                  navigator.clipboard.writeText(message.ai_message);
                  toast.success('Copied to clipboard!');
                }}
              >
                Copy
              </button>
            </div>
          </React.Fragment>
        ))}


      </div>
      {
        loading && (
          <div className="spinner-wrapper">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden"></span>
            </div>
          </div>)}

      <div className="chat-input">
        <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Ask anything" />
        <button onClick={() => {
          generateResponse()
        }}>
          <span style={{ color: 'white', padding: '1px' }}>
            <i className="bi bi-send-fill"></i> Send
          </span>
        </button>
      </div>
    </div>
  );
};

export default ChatMessages;
