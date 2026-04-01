/**
 * =============================================================
 *  LEAD COLLECTOR - Google Apps Script Web App
 *  Dự án: SHD Academy - Hệ thống thu thập Lead từ Landing Page
 * =============================================================
 *
 *  HƯỚNG DẪN TRIỂN KHAI:
 *  1. Mở Google Sheet → Extensions → Apps Script
 *  2. Dán toàn bộ code này vào file Code.gs
 *  3. Thay 'EMAIL_CUA_BAN@GMAIL.COM' bằng email thực của bạn
 *  4. Deploy → New deployment → Web app
 *     - Execute as: Me
 *     - Who has access: Anyone
 *  5. Copy URL Web App và dùng trong Landing Page
 *
 *  DỮ LIỆU GỬI LÊN (JSON):
 *  {
 *    "name": "Nguyễn Văn A",
 *    "phone": "0901234567",
 *    "email": "email@example.com",
 *    "interest": "Khóa K90 - Digital Marketing",
 *    "intent_level": "hot"    // hot | warm | cold
 *  }
 * =============================================================
 */

// ⚠️ THAY EMAIL CỦA BẠN TẠI ĐÂY
var NOTIFICATION_EMAIL = 'EMAIL_CUA_BAN@GMAIL.COM';

/**
 * Xử lý POST request từ Landing Page
 * @param {Object} e - Event object chứa postData
 * @returns {TextOutput} JSON response
 */
function doPost(e) {
  try {
    // 1. Parse dữ liệu JSON từ request
    var data = JSON.parse(e.postData.contents);

    var name        = data.name        || '';
    var phone       = data.phone       || '';
    var email       = data.email       || '';
    var interest    = data.interest    || '';
    var intentLevel = data.intent_level || '';

    // 2. Mở Google Sheet hiện tại và lấy sheet đầu tiên
    var ss    = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheets()[0];

    // 3. Thêm dòng mới với dữ liệu lead + timestamp
    var timestamp = new Date();
    sheet.appendRow([
      timestamp,
      name,
      phone,
      email,
      interest,
      intentLevel
    ]);

    // 4. Nếu intent_level là 'hot' → gửi email thông báo
    if (intentLevel.toLowerCase() === 'hot') {
      sendHotLeadNotification_(name, phone, email, interest);
    }

    // 5. Trả về JSON success
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Xử lý lỗi và trả về thông báo
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Gửi email thông báo khi có lead "hot"
 * @private
 */
function sendHotLeadNotification_(name, phone, email, interest) {
  var subject = '[K90] CÓ KHÁCH HÀNG TIỀM NĂNG MỚI';

  var body = '🔥 KHÁCH HÀNG TIỀM NĂNG MỚI (HOT LEAD)\n'
    + '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n'
    + '👤 Họ tên:      ' + name + '\n'
    + '📞 Điện thoại:  ' + phone + '\n'
    + '📧 Email:       ' + email + '\n'
    + '🎯 Quan tâm:    ' + interest + '\n'
    + '⏰ Thời gian:   ' + new Date().toLocaleString('vi-VN') + '\n\n'
    + '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'
    + '⚡ Hãy liên hệ ngay để không bỏ lỡ cơ hội!\n';

  MailApp.sendEmail(NOTIFICATION_EMAIL, subject, body);
}

/**
 * Hàm tiện ích: Tạo header cho sheet (chạy 1 lần)
 * Vào Apps Script → chọn hàm này → Run
 */
function setupSheetHeaders() {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheets()[0];

  // Chỉ thêm header nếu sheet trống
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Thời gian',
      'Họ tên',
      'Số điện thoại',
      'Email',
      'Quan tâm',
      'Mức độ'
    ]);

    // Format header
    var headerRange = sheet.getRange(1, 1, 1, 6);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#1a73e8');
    headerRange.setFontColor('#ffffff');
    headerRange.setHorizontalAlignment('center');

    // Auto-resize columns
    for (var i = 1; i <= 6; i++) {
      sheet.autoResizeColumn(i);
    }

    // Đặt width cố định cho cột Thời gian
    sheet.setColumnWidth(1, 180);
  }
}
