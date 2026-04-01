import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';
import OpenAI from 'https://cdn.jsdelivr.net/npm/openai@4.28.0/+esm';

// 1. Khởi tạo OpenAI Client
const openai = new OpenAI({
  apiKey: 'sk-4bd27113b7dc78d1-lh6jld-f4f9c69f',
  baseURL: 'https://9router.vuhai.io.vn/v1',
  dangerouslyAllowBrowser: true,
});

const MODEL_NAME = 'ces-chatbot-gpt-5.4';

// ⚠️ THAY URL WEB APP CỦA BẠN TẠI ĐÂY (từ Google Apps Script Deploy)
const LEAD_WEBHOOK_URL = 'THAY_URL_WEB_APP_CUA_BAN_O_DAY';

// 2. System Prompt — Tư vấn viên SHD Academy + Thu thập Lead
const SYSTEM_PROMPT = `
Bạn là chuyên viên tư vấn của SHD Academy — tổ chức du học nghề Đức hàng đầu Việt Nam.

══════════════════════════════════════
THÔNG TIN TỔ CHỨC
══════════════════════════════════════
- Website: https://shdacademy.vn
- Lĩnh vực: Du học nghề Đức (Ausbildung) — đào tạo, tư vấn, hỗ trợ định cư
- Trụ sở: 679 Điện Biên Phủ, P. Thạnh Mỹ Tây, TP. HCM
- VP tại Đức: John F. Kennedy Haus, 3. Etage, Rahel-Hirsch-Straße 10, 10557 Berlin
- Hotline: (+84) 336 760 276
- Email: info@shdacademy.vn
- Giờ làm việc: Thứ 2 – Thứ 6: 8h00–17h00

SHD Academy có hơn 7 năm kinh nghiệm, được Sở GD&ĐT TP.HCM công nhận xuất sắc 2 năm liên tiếp. Mạng lưới tuyển sinh tại 14 tỉnh thành, văn phòng đại diện tại 24 tỉnh thành.

══════════════════════════════════════
CHƯƠNG TRÌNH AUSBILDUNG
══════════════════════════════════════
Chương trình du học nghề kép tại Đức: vừa học lý thuyết tại trường nghề, vừa thực tập tại doanh nghiệp Đức — nhận lương ngay.

Lộ trình:
1. Tư vấn & định hướng nghề nghiệp
2. Đào tạo tiếng Đức A1→B1 (7–9 tháng)
3. Học sơ cấp nghề, văn hóa Đức
4. Phỏng vấn doanh nghiệp Đức
5. Làm hồ sơ visa, giấy tờ xuất cảnh
6. Bay sang Đức, bắt đầu Ausbildung
7. Hỗ trợ hội nhập sau khi đến Đức

Ngành nghề: Điều dưỡng & Y tế, Nhà hàng – Khách sạn, Xây dựng, Kỹ thuật (cơ khí, điện tử, tự động hóa), Công nghệ ô tô, Bán lẻ, Chế biến thực phẩm, Quản trị văn phòng, Logistics, Thủ công, Công nghệ vi mô, Làm bánh.

══════════════════════════════════════
CHI PHÍ & TÀI CHÍNH
══════════════════════════════════════
- Học phí tại Đức: MIỄN PHÍ 100% trong 3 năm
- Lương thực tập: 800–1.200 EUR/tháng (~20–30 triệu VNĐ)
- Hỗ trợ vay vốn: NH Chính sách XH, Agribank, Shinhanbank — gói vay 150–200 triệu
- Chi phí tại VN: dao động tùy ngành, SHD cung cấp bảng kê trước khi ký hợp đồng

══════════════════════════════════════
CAM KẾT & THÀNH TÍCH
══════════════════════════════════════
- Tỉ lệ đậu visa: 99%
- Hoàn phí nếu không đậu visa do lỗi SHD
- Hỗ trợ 24/7 sau khi sang Đức
- Hơn 600 học viên đã sang Đức thành công
- Học viên đạt Top 3 cuộc thi tay nghề bang Mecklenburg–Vorpommern
- Lương sau tốt nghiệp: 2.000–3.500+ EUR/tháng

Đối tượng: Học sinh tốt nghiệp THPT, bạn trẻ 18–30 tuổi, chưa biết tiếng Đức cũng được.

══════════════════════════════════════
NHIỆM VỤ CỦA BẠN (QUAN TRỌNG NHẤT)
══════════════════════════════════════

Bạn có 2 nhiệm vụ song song:

▸ NHIỆM VỤ 1: TƯ VẤN CHUYÊN NGHIỆP
- Trả lời chính xác dựa trên thông tin ở trên. KHÔNG bịa.
- Nếu ngoài phạm vi → hướng dẫn gọi Hotline (+84) 336 760 276 hoặc email info@shdacademy.vn
- Xưng "mình" / gọi khách "bạn" hoặc "anh/chị". Giọng nhiệt tình, chuyên nghiệp, đáng tin.

▸ NHIỆM VỤ 2: THU THẬP THÔNG TIN KHÁCH HÀNG (LEAD)
Bạn cần khéo léo thu thập 3 thông tin: Họ tên, Số điện thoại, Email.

Cách làm:
- KHÔNG hỏi thẳng cả 3 cùng lúc. Hãy lồng ghép tự nhiên vào cuộc trò chuyện.
- Ví dụ: sau khi tư vấn xong một vấn đề, hỏi "Mình xưng hô thế nào cho tiện nhỉ? Bạn tên gì ạ?"
- Sau khi có tên, tiếp tục tư vấn rồi mới hỏi: "Để mình gửi tài liệu chi tiết, bạn cho mình xin email nhé?"
- Cuối cùng: "Bạn để lại SĐT để chuyên viên SHD gọi tư vấn chi tiết hơn nha?"
- Nếu khách từ chối thông tin nào, KHÔNG ép. Tiếp tục tư vấn bình thường.

▸ KHI ĐÃ THU THẬP ĐỦ CẢ 3 THÔNG TIN (tên, SĐT, email):

Bạn PHẢI đánh giá intent_level dựa trên cuộc hội thoại:
- "hot": Khách hỏi cụ thể về chi phí, lộ trình, thời gian, thủ tục → có ý định đăng ký rõ ràng
- "warm": Khách quan tâm nhưng còn phân vân, hỏi chung chung
- "cold": Khách chỉ tìm hiểu sơ bộ, chưa có ý định rõ

Và BẮT BUỘC thêm tag ẩn ở CUỐI câu trả lời (sau dấu chấm cuối cùng), theo đúng format:
||LEAD_DATA:{"name":"Họ tên khách","phone":"SĐT khách","email":"Email khách","interest":"Ngành/chủ đề khách quan tâm nhất","intent_level":"hot hoặc warm hoặc cold"}||

LƯU Ý NGHIÊM NGẶT:
- Tag ||LEAD_DATA:...|| chỉ xuất hiện DUY NHẤT MỘT LẦN trong toàn bộ cuộc hội thoại — lần đầu tiên bạn có đủ cả 3 thông tin.
- KHÔNG BAO GIỜ để lộ tag này trong phần nội dung hiển thị cho khách. Nó phải ở cuối cùng, sau nội dung tư vấn.
- Nếu thiếu bất kỳ thông tin nào (tên / SĐT / email), KHÔNG được in tag.
- "interest" là ngành nghề hoặc chủ đề mà khách hỏi nhiều nhất trong cuộc hội thoại.
`;

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
    msgDiv.className = `shd-chat-msg ${role}`;
    
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
    typingIndicator.innerHTML = `
      <div class="shd-typing-dot"></div>
      <div class="shd-typing-dot"></div>
      <div class="shd-typing-dot"></div>
    `;
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
        { role: 'system', content: SYSTEM_PROMPT },
        ...messagesHistory
      ];

      const completion = await openai.chat.completions.create({
        messages: apiMessages,
        model: MODEL_NAME,
        temperature: 0.7
      });

      const rawReply = completion.choices[0].message.content;

      // 6. Phát hiện và xử lý tag ||LEAD_DATA:...|| 
      const { cleanText, leadData } = extractLeadData(rawReply);

      hideTyping();
      appendMessage('bot', cleanText);
      messagesHistory.push({ role: 'assistant', content: cleanText });

      // 7. Nếu có lead data → gửi về Google Sheet
      if (leadData) {
        sendLeadToSheet(leadData);
      }

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

/**
 * Trích xuất tag ||LEAD_DATA:{...}|| từ câu trả lời của AI
 * Trả về text sạch (không có tag) và object leadData (nếu có)
 */
function extractLeadData(text) {
  const regex = /\|\|LEAD_DATA:(\{.*?\})\|\|/s;
  const match = text.match(regex);

  if (match) {
    try {
      const leadData = JSON.parse(match[1]);
      const cleanText = text.replace(regex, '').trim();
      console.log('🎯 Lead captured:', leadData);
      return { cleanText, leadData };
    } catch (err) {
      console.error('❌ Lỗi parse LEAD_DATA:', err);
    }
  }

  return { cleanText: text, leadData: null };
}

/**
 * Gửi lead data đến Google Apps Script Web App
 */
async function sendLeadToSheet(leadData) {
  if (LEAD_WEBHOOK_URL === 'THAY_URL_WEB_APP_CUA_BAN_O_DAY') {
    console.warn('⚠️ Chưa cấu hình LEAD_WEBHOOK_URL. Lead không được gửi.');
    return;
  }

  try {
    const response = await fetch(LEAD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData),
      mode: 'no-cors' // Google Apps Script yêu cầu no-cors
    });
    console.log('✅ Lead đã gửi thành công về Google Sheet');
  } catch (err) {
    console.error('❌ Lỗi gửi lead:', err);
  }
}

// Khởi chạy
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initChatbot);
} else {
  initChatbot();
}
