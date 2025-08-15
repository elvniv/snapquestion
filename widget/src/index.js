import './styles.css';

(function() {
  'use strict';

  // Widget configuration
  const config = {
    apiUrl: 'http://localhost:8000',
    appUrl: 'http://localhost:3000',
    position: 'bottom-right',
    primaryColor: '#3B82F6',
    tenant: null
  };

  // Initialize widget
  function init() {
    // Get configuration from script tag
    const script = document.currentScript || document.querySelector('script[data-tenant]');
    if (script) {
      config.tenant = script.getAttribute('data-tenant');
      config.position = script.getAttribute('data-position') || config.position;
      config.primaryColor = script.getAttribute('data-color') || config.primaryColor;
      config.apiUrl = script.getAttribute('data-api-url') || config.apiUrl;
    }

    // Create widget elements
    createWidget();
  }

  function createWidget() {
    // Create container
    const container = document.createElement('div');
    container.id = 'snapquestion-widget';
    container.className = 'sq-widget-container';
    
    // Position based on config
    if (config.position === 'bottom-left') {
      container.style.left = '20px';
      container.style.right = 'auto';
    }

    // Create bubble button
    const bubble = document.createElement('button');
    bubble.className = 'sq-widget-bubble';
    bubble.style.backgroundColor = config.primaryColor;
    bubble.innerHTML = `
      <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
        <path d="M7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/>
      </svg>
    `;
    
    // Create chat window
    const chatWindow = document.createElement('div');
    chatWindow.className = 'sq-widget-window';
    chatWindow.style.display = 'none';
    chatWindow.innerHTML = `
      <div class="sq-widget-header" style="background-color: ${config.primaryColor}">
        <div class="sq-widget-header-content">
          <h3>SnapQuestion Support</h3>
          <p>Ask us anything!</p>
        </div>
        <button class="sq-widget-close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
      <div class="sq-widget-messages">
        <div class="sq-widget-welcome">
          <div class="sq-widget-avatar">👋</div>
          <p>Hi! How can we help you today?</p>
        </div>
      </div>
      <div class="sq-widget-input-container">
        <textarea 
          class="sq-widget-input" 
          placeholder="Type your message..."
          rows="1"
        ></textarea>
        <button class="sq-widget-send" style="background-color: ${config.primaryColor}">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
    `;

    // Add elements to container
    container.appendChild(bubble);
    container.appendChild(chatWindow);
    document.body.appendChild(container);

    // Event handlers
    bubble.addEventListener('click', toggleChat);
    chatWindow.querySelector('.sq-widget-close').addEventListener('click', toggleChat);
    
    const input = chatWindow.querySelector('.sq-widget-input');
    const sendBtn = chatWindow.querySelector('.sq-widget-send');
    
    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    // Auto-resize textarea
    input.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 100) + 'px';
    });
  }

  function toggleChat() {
    const chatWindow = document.querySelector('.sq-widget-window');
    const bubble = document.querySelector('.sq-widget-bubble');
    
    if (chatWindow.style.display === 'none') {
      chatWindow.style.display = 'flex';
      bubble.style.display = 'none';
      // Focus input
      setTimeout(() => {
        document.querySelector('.sq-widget-input').focus();
      }, 100);
    } else {
      chatWindow.style.display = 'none';
      bubble.style.display = 'flex';
    }
  }

  async function sendMessage() {
    const input = document.querySelector('.sq-widget-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    addMessage(message, 'user');
    input.value = '';
    input.style.height = 'auto';
    
    // Show typing indicator
    const typingId = showTypingIndicator();
    
    try {
      // Send to API
      const response = await fetch(`${config.apiUrl}/v1/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer DEV' // In production, use proper auth
        },
        body: JSON.stringify({
          tenant_id: config.tenant || 'demo',
          query_text: message
        })
      });
      
      const data = await response.json();
      
      // Remove typing indicator
      removeTypingIndicator(typingId);
      
      // Add bot response
      addMessage(data.answer, 'bot', data);
      
    } catch (error) {
      console.error('Error sending message:', error);
      removeTypingIndicator(typingId);
      addMessage('Sorry, I encountered an error. Please try again.', 'bot', { error: true });
    }
  }

  function addMessage(text, sender, metadata = {}) {
    const messagesContainer = document.querySelector('.sq-widget-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `sq-widget-message sq-widget-message-${sender}`;
    
    if (sender === 'user') {
      messageDiv.innerHTML = `
        <div class="sq-widget-message-bubble" style="background-color: ${config.primaryColor}">
          ${escapeHtml(text)}
        </div>
      `;
    } else {
      let content = `
        <div class="sq-widget-message-bubble">
          ${escapeHtml(text)}
        </div>
      `;
      
      // Add confidence indicator if available
      if (metadata.confidence !== undefined) {
        const confidencePercent = Math.round(metadata.confidence * 100);
        const confidenceColor = metadata.confidence > 0.8 ? '#10B981' : 
                               metadata.confidence > 0.6 ? '#F59E0B' : '#EF4444';
        content += `
          <div class="sq-widget-confidence">
            <span>Confidence: ${confidencePercent}%</span>
            <div class="sq-widget-confidence-bar">
              <div style="width: ${confidencePercent}%; background-color: ${confidenceColor}"></div>
            </div>
          </div>
        `;
      }
      
      // Add citations if available
      if (metadata.citations && metadata.citations.length > 0) {
        content += '<div class="sq-widget-citations">Sources: ';
        metadata.citations.forEach((citation, i) => {
          if (i > 0) content += ', ';
          content += `<span>${escapeHtml(citation.title)}</span>`;
        });
        content += '</div>';
      }
      
      messageDiv.innerHTML = content;
    }
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function showTypingIndicator() {
    const messagesContainer = document.querySelector('.sq-widget-messages');
    const typingDiv = document.createElement('div');
    const typingId = 'typing-' + Date.now();
    typingDiv.id = typingId;
    typingDiv.className = 'sq-widget-message sq-widget-message-bot';
    typingDiv.innerHTML = `
      <div class="sq-widget-typing">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return typingId;
  }

  function removeTypingIndicator(typingId) {
    const typingDiv = document.getElementById(typingId);
    if (typingDiv) {
      typingDiv.remove();
    }
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export for global access
  window.SnapQuestionWidget = {
    init: init,
    toggle: toggleChat,
    config: config
  };
})();