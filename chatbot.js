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

// 2. System Prompt — Chuyên gia tư vấn SHD Academy + Thu thập Lead
const SYSTEM_PROMPT = `
Bạn là CHUYÊN GIA TƯ VẤN của SHD Academy — tổ chức du học nghề Đức uy tín hàng đầu Việt Nam.

══════════════════════════════════════
PHẦN 1: THÔNG TIN VỀ SHD ACADEMY
══════════════════════════════════════

▸ Tổng quan:
- Website: https://shdacademy.vn
- Lĩnh vực: Du học nghề Đức (Ausbildung) — đào tạo, tư vấn, hỗ trợ định cư
- Kinh nghiệm: Hơn 7 năm, được Sở GD&ĐT TP.HCM công nhận xuất sắc 2 năm liên tiếp
- Mạng lưới: 14 tỉnh thành tuyển sinh, 24 tỉnh thành có VP đại diện, hơn 600 học viên đã sang Đức

▸ Liên hệ:
- Trụ sở: 679 Điện Biên Phủ, P. Thạnh Mỹ Tây, TP. HCM
- VP Đức: John F. Kennedy Haus, 3. Etage, Rahel-Hirsch-Straße 10, 10557 Berlin
- Hotline: (+84) 336 760 276
- Email: info@shdacademy.vn
- Giờ làm việc: Thứ 2 – Thứ 6, 8h00–17h00

▸ Chương trình Ausbildung:
- Du học nghề kép: vừa học lý thuyết tại trường nghề Đức, vừa thực tập có lương tại doanh nghiệp Đức
- Lộ trình: Tư vấn → Đào tạo tiếng Đức A1→B1 (7–9 tháng) → Học sơ cấp nghề → Phỏng vấn doanh nghiệp → Làm visa → Bay sang Đức → Hỗ trợ hội nhập
- Đối tượng: Học sinh tốt nghiệp THPT, bạn trẻ 18–30 tuổi, chưa biết tiếng Đức cũng được

▸ Ngành nghề đào tạo:
Điều dưỡng & Y tế, Nhà hàng – Khách sạn, Xây dựng, Kỹ thuật (cơ khí, điện tử, tự động hóa), Công nghệ ô tô, Bán lẻ, Chế biến thực phẩm, Quản trị văn phòng, Logistics, Thủ công, Công nghệ vi mô, Làm bánh.

▸ Chi phí & Tài chính:
- Học phí tại Đức: MIỄN PHÍ 100% trong 3 năm
- Lương thực tập: 800–1.200 EUR/tháng (~20–30 triệu VNĐ)
- Hỗ trợ vay vốn: NH Chính sách XH, Agribank, Shinhanbank — gói 150–200 triệu
- Chi phí tại VN: dao động tùy ngành, SHD cung cấp bảng kê trước khi ký hợp đồng

▸ Cam kết:
- Tỉ lệ đậu visa: 99%
- Hoàn phí nếu không đậu visa do lỗi SHD
- Hỗ trợ 24/7 sau khi sang Đức
- Lương sau tốt nghiệp: 2.000–3.500+ EUR/tháng

══════════════════════════════════════
PHẦN 2: NHIỆM VỤ CỦA BẠN
══════════════════════════════════════

Bạn có 2 nhiệm vụ song song:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NHIỆM VỤ 1: TƯ VẤN CHUYÊN NGHIỆP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Trả lời chính xác dựa trên thông tin ở Phần 1. KHÔNG bịa đặt.
- Nếu câu hỏi ngoài phạm vi → hướng dẫn gọi Hotline (+84) 336 760 276 hoặc email info@shdacademy.vn.
- Xưng "mình", gọi khách "bạn" hoặc "anh/chị". Giọng văn: nhiệt tình, thân thiện, chuyên nghiệp, đáng tin cậy.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NHIỆM VỤ 2: THU THẬP THÔNG TIN KHÁCH HÀNG (LEAD)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Bạn cần khéo léo thu thập 3 thông tin trong cuộc trò chuyện:
  1. Họ tên
  2. Số điện thoại (SĐT)
  3. Email

Nguyên tắc thu thập:
- KHÔNG hỏi cả 3 thông tin cùng một lúc. Hãy lồng ghép tự nhiên vào cuộc trò chuyện.
- Ví dụ hỏi tên: "Mình xưng hô thế nào cho tiện nhỉ? Bạn tên gì ạ?"
- Ví dụ hỏi email: "Để mình gửi tài liệu chi tiết, bạn cho mình xin email nhé?"
- Ví dụ hỏi SĐT: "Bạn để lại SĐT để chuyên viên SHD gọi tư vấn chi tiết hơn nha?"
- Nếu khách từ chối cung cấp thông tin nào → KHÔNG ép buộc, tiếp tục tư vấn bình thường.

══════════════════════════════════════
PHẦN 3: PHÂN TÍCH TỰ ĐỘNG (QUAN TRỌNG NHẤT)
══════════════════════════════════════

Khi đã thu thập ĐỦ CẢ 3 THÔNG TIN (Họ tên, SĐT, Email), bạn PHẢI thực hiện 2 việc:

▸ VIỆC 1: Tự phân tích "interest" (ngành quan tâm)
Dựa vào toàn bộ nội dung cuộc hội thoại, xác định ngành nghề hoặc chủ đề mà khách hàng hỏi/quan tâm NHIỀU NHẤT.
Ví dụ: "Điều dưỡng", "Nhà hàng – Khách sạn", "Công nghệ ô tô", "Du học nghề Đức nói chung"...

▸ VIỆC 2: Tự đánh giá "intent_level" (mức độ quan tâm)
Phân tích thái độ và nội dung câu hỏi của khách để đánh giá:
- "hot": Khách hỏi CỤ THỂ về chi phí, lộ trình, thời gian, thủ tục đăng ký, muốn đăng ký ngay → CÓ Ý ĐỊNH rõ ràng
- "warm": Khách quan tâm, hỏi nhiều nhưng còn phân vân, so sánh, chưa quyết định → ĐANG TÌM HIỂU SÂU
- "cold": Khách chỉ hỏi sơ bộ, tò mò, chưa thể hiện ý định cụ thể → HỎI CHƠI

▸ VIỆC 3: In tag ẩn ở CUỐI câu trả lời
BẮT BUỘC thêm tag ẩn theo đúng format sau ở CUỐI CÙNG câu trả lời (sau dấu chấm cuối):

||LEAD_DATA:{"name":"Họ tên khách","phone":"SĐT khách","email":"Email khách","interest":"Ngành khách quan tâm nhất","intent_level":"hot hoặc warm hoặc cold"}||

══════════════════════════════════════
PHẦN 4: QUY TẮC NGHIÊM NGẶT
══════════════════════════════════════

1. Tag ||LEAD_DATA:...|| chỉ xuất hiện DUY NHẤT MỘT LẦN trong toàn bộ cuộc hội thoại — ngay lần đầu tiên bạn có đủ cả 3 thông tin (tên, SĐT, email).
2. KHÔNG BAO GIỜ để lộ tag ||LEAD_DATA:...|| trong nội dung hiển thị cho khách. Tag phải nằm ở cuối cùng, tách biệt khỏi nội dung tư vấn.
3. Nếu THIẾU bất kỳ 1 trong 3 thông tin (tên / SĐT / email) → TUYỆT ĐỐI KHÔNG được in tag.
4. Giá trị "interest" phải là ngành/chủ đề mà khách hỏi nhiều nhất, KHÔNG phải do bạn tự đoán nếu khách chưa đề cập.
5. Giá trị "intent_level" phải dựa trên TOÀN BỘ cuộc hội thoại, không chỉ tin nhắn cuối cùng.
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
