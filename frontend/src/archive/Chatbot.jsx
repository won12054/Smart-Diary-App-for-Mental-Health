import React, { useState } from 'react';
import '../styles/Chatbot.css';
import WellmindAvatar from '../images/wellmind.png'; 

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSendMessage = async () => {
    if (input.trim()) {
      // Add user message to chat
      const userMessage = { text: input, sender: 'user' };
      setMessages([...messages, userMessage]);

      // Clear the input field
      setInput('');

      try {
        // Make an API request to the backend
        const response = await fetch('http://localhost:8000/generate-response', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: input }), // Send user input as JSON
        });

        // Check if the response is ok
        if (!response.ok) {
          throw new Error('Failed to get response from server');
        }

        // Parse the response
        const data = await response.json();

        // Add the bot response to chat
        const botMessage = { text: data.response, sender: 'bot' };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error) {
        // Handle errors
        const errorMessage = { text: `Error: ${error.message}`, sender: 'bot' };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="avatar-section">
          <img src={WellmindAvatar} alt="Chatbot Avatar" className="avatar"/>
          <div className="chatbot-info">
            <h2>Wellmind</h2>
            <p>Expected Mood: Happy</p>
          </div>
        </div>
      </div>
      
      <div className="chat-window">
        {/* Display chat messages */}
        {messages.map((msg, index) => (
          <div key={index} className={`chat-bubble ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>

      <div className="input-container">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message here..."
        />
        <button onClick={handleSendMessage} className="send-btn">Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
