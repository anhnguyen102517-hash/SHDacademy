import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';
import OpenAI from 'https://cdn.jsdelivr.net/npm/openai@4.28.0/+esm';

// 1. Khởi tạo OpenAI Client
const openai = new OpenAI({
  apiKey: 'sk-4bd27113b7dc78d1-lh6jld-f4f9c69f',
  baseURL: 'https://9router.vuhai.io.vn/v1',
  dangerouslyAllowBrowser: true,
});

const MODEL_NAME = 'ces-chatbot-gpt-5.4';
let systemPrompt = "";

// 2. Hàm tải dữ liệu làm System Prompt
async function loadChatbotData() {
  try {
    const response = await fetch('chatbot_data.txt');
    if (!response.ok) throw new Error('Cannot load chatbot_data.txt');
    systemPrompt = await response.text();
  } catch (err) {
    console.error("Lỗi tải thông tin chatbot:", err);
  }
}

// 3. Xây dựng giao diện (UI) -> Chèn vào DOM
function buildUI() {
  const container = document.createElement('div');
  container.id = 'shd-chatbot-container';
  container.innerHTML = `
    <!-- Cửa sổ Chat -->
    <div id="shd-chatbot-window">
      <div id="shd-chatbot-header">
        <div class="shd-chatbot-header-info">
          <div class="shd-chatbot-avatar">
            <span class="material-symbols-outlined" style="font-size:20px;">support_agent</span>
            <div class="shd-chatbot-online-dot"></div>
          </div>
          <div>
            <h3 class="shd-chatbot-title">Tư vấn viên SHD Academy</h3>
            <p class="shd-chatbot-subtitle">Luôn sẵn sàng hỗ trợ</p>
          </div>
        </div>
        <div class="shd-chatbot-actions">
          <button id="shd-chatbot-refresh-btn" class="shd-chatbot-action-btn">
            <span class="material-symbols-outlined">refresh</span>
          </button>
          <button id="shd-chatbot-close-btn" class="shd-chatbot-action-btn">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>
      
      <div id="shd-chatbot-messages"></div>
      
      <div id="shd-chatbot-input-area">
        <input type="text" id="shd-chatbot-input" placeholder="Hỏi gì đó về SHD Academy..." autocomplete="off" />
        <button id="shd-chatbot-send-btn">
          <span class="material-symbols-outlined">send</span>
        </button>
      </div>
    </div>
    
    <!-- Nút Chat lơ lửng -->
    <button id="shd-chatbot-toggle">
      <span class="material-symbols-outlined">chat</span>
    </button>
  `;
  document.body.appendChild(container);
}

// 4. Logic Xử lý & Event Listeners
let messagesHistory = [];

function initChatbot() {
  buildUI();
  loadChatbotData();

  const toggleBtn = document.getElementById('shd-chatbot-toggle');
  const closeBtn = document.getElementById('shd-chatbot-close-btn');
  const refreshBtn = document.getElementById('shd-chatbot-refresh-btn');
  const chatWindow = document.getElementById('shd-chatbot-window');
  const messagesContainer = document.getElementById('shd-chatbot-messages');
  const inputField = document.getElementById('shd-chatbot-input');
  const sendBtn = document.getElementById('shd-chatbot-send-btn');

  // Khởi tạo câu chào ban đầu
  const initGreeting = () => {
    messagesContainer.innerHTML = '';
    messagesHistory = [];
    appendMessage(
      "bot", 
      "Chào mừng đến với SHD Academy! Mình là chuyên viên tư vấn hỗ trợ du học nghề Đức. Bạn cần giải đáp thông tin gì về chương trình học, chi phí hay các ngành nghề ạ?"
    );
  };

  // Nút mở chat
  toggleBtn.addEventListener('click', () => {
    chatWindow.classList.add('open');
    if (messagesContainer.children.length === 0) initGreeting();
    inputField.focus();
  });

  // Nút đóng chat
  closeBtn.addEventListener('click', () => {
    chatWindow.classList.remove('open');
  });

  // Nút làm mới (refresh)
  refreshBtn.addEventListener('click', () => {
    const icon = refreshBtn.querySelector('.material-symbols-outlined');
    icon.classList.add('spin');
    setTimeout(() => {
      icon.classList.remove('spin');
      initGreeting();
    }, 500);
  });

  // Nhấn Enter để gửi
  inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
  });

  // Click gửi
  sendBtn.addEventListener('click', handleSend);

  // Hiển thị tin nhắn lên UI
  function appendMessage(role, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = \`shd-chat-msg \${role}\`;
    
    if (role === 'bot') {
      msgDiv.innerHTML = marked.parse(text);
    } else {
      msgDiv.textContent = text;
    }
    
    messagesContainer.appendChild(msgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Hiệu ứng đang nhập
  let typingIndicator = null;
  function showTyping() {
    typingIndicator = document.createElement('div');
    typingIndicator.className = 'shd-typing-indicator';
    typingIndicator.innerHTML = \`
      <div class="shd-typing-dot"></div>
      <div class="shd-typing-dot"></div>
      <div class="shd-typing-dot"></div>
    \`;
    messagesContainer.appendChild(typingIndicator);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function hideTyping() {
    if (typingIndicator) {
      typingIndicator.remove();
      typingIndicator = null;
    }
  }

  // Gửi tin nhắn và gọi API
  async function handleSend() {
    const text = inputField.value.trim();
    if (!text) return;

    // Hiển thị tin user
    appendMessage('user', text);
    inputField.value = '';
    
    // Đẩy vào lịch sử hội thoại
    messagesHistory.push({ role: 'user', content: text });

    // Hiển thị "Bot đang nhập..."
    showTyping();
    inputField.disabled = true;
    sendBtn.disabled = true;

    try {
      // 5. API Call
      const apiMessages = [
        { role: 'system', content: systemPrompt },
        ...messagesHistory
      ];

      const completion = await openai.chat.completions.create({
        messages: apiMessages,
        model: MODEL_NAME,
        temperature: 0.7
      });

      const botReply = completion.choices[0].message.content;
      
      hideTyping();
      appendMessage('bot', botReply);
      messagesHistory.push({ role: 'assistant', content: botReply });

    } catch (error) {
      console.error("Lỗi gọi API chatbot:", error);
      hideTyping();
      appendMessage('bot', "**Xin lỗi!** Hệ thống đang gián đoạn lúc này. Vui lòng liên hệ Hotline: (+84) 336 760 276.");
    } finally {
      inputField.disabled = false;
      sendBtn.disabled = false;
      inputField.focus();
    }
  }
}

// Khởi chạy khi DOM đã load
document.addEventListener('DOMContentLoaded', initChatbot);
