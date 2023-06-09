document.addEventListener('DOMContentLoaded', () => {
    const sendButton = document.getElementById('send-button');
    const messageInput = document.getElementById('message-input');
    const chatScreen = document.getElementById('chat-screen');
  
    // Array to store the conversation history
    let conversation = [];
  
    // Function to send a message and receive a response from the ChatGPT API
    const sendMessage = async (message) => {
      conversation.push({ role: 'user', content: message });
  
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer <YOU API KEY>' // Replace with your actual API key
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: conversation
        })
      });
  
      const data = await response.json();
      const reply = data.choices[0].message.content;
      conversation.push({ role: 'assistant', content: reply });
  
      return reply;
    };
  
    // Function to format the message content with line breaks
    const formatMessageContent = (content) => {
      return content.replace(/\n/g, '<br>');
    };
  
    // Initial instructions
    const initialInstructions = 'You are a personal chef working for a company that creates food products called master-chef. Your job is to offer few ideas of dishes to people according to their ingredients while using the products that the company master-chef is creating and selling through all major supermarkets in Israel. You will get what ingredient they want to use, and then use some of them to offer 5 different meal options, and ask them which one they want the recipe for? If they ask for more options give them 5 more and then ask them which one to give them the recipe for out of all 10. Help them if they have more questions. The products that masterchef are currently making are: Mayo, Garlic Mayo, wasabi mayo,  truffles Mayo, Canned Tomato Sauce, tortillas, chilli sauce, teriyaki sauce, soy sauce, noodles, barilla pasta, Crotons For every ingiridient of masterchef that then can use say its from master-chef.  ';
  
    // Send initial instructions as a system message
    conversation.push({ role: 'system', content: initialInstructions });
  
    // Initial message
    const initialMessage = document.createElement('div');
    initialMessage.classList.add('message', 'computer-message');
    initialMessage.innerHTML = `
      <p>Hi, How are you?</p>
      <p>I'm the Master-Chef here and I'm here to help you create a beautiful dish.</p>
      <p>Which ingredients do you consider using?</p>
    `;
    chatScreen.appendChild(initialMessage);
  
    // Send button event listener
    const sendMessageHandler = async () => {
      const userMessage = messageInput.value.trim();
      if (userMessage !== '') {
        const userMessageElement = document.createElement('div');
        userMessageElement.classList.add('message', 'user-message');
        userMessageElement.textContent = userMessage;
        chatScreen.appendChild(userMessageElement);
  
        messageInput.value = '';
        messageInput.focus();
  
        // Scroll to the bottom of the chat screen
        chatScreen.scrollTop = chatScreen.scrollHeight;
  
        // Send user message and receive response from the ChatGPT API
        const reply = await sendMessage(userMessage);
  
        const replyMessageElement = document.createElement('div');
        replyMessageElement.classList.add('message', 'computer-message');
        replyMessageElement.innerHTML = formatMessageContent(reply); // Format the message content
        chatScreen.appendChild(replyMessageElement);
  
        // Scroll to the bottom after receiving the response
        chatScreen.scrollTop = chatScreen.scrollHeight;
      }
    };
  
    // Send button click event listener
    sendButton.addEventListener('click', sendMessageHandler);
  
    // Message input keydown event listener
    messageInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        sendMessageHandler();
      }
    });
  });
  