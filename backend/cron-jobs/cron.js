import MailModel from "../models/MailModel.js";
import cron from "node-cron";
// npm install node-cron

cron.schedule("0 0 * * *", async () => {
  //(4)
  const X_DAYS = 7; //Xét khoảng thời gian 7 ngày trước ngày hết hạn
  const expiryDate = new Date(); //Lấy ngày hiện tại (1)
  expiryDate.setDate(expiryDate.getDate() - X_DAYS); //(2)

  try {
    const result = await MailModel.deleteMany({
      // isRead: true,
      createdAt: { $lt: expiryDate },
    }); // (3)
    console.log(`Đã xóa ${result.deletedCount} thư hết hạn.`);
  } catch (error) {
    console.error("Lỗi khi xóa thư hết hạn:", error);
  }
});

// cron.schedule("* * * * * *", () => {
//   console.log("hello");
// });

/*
(1) Cho expiryDate là ngày hiện tại tức 22/02/2025 -> expiryDate = Sat Feb 22 2025 10:00:00 GMT+0000
(2) expiryDate.getDate() tức ngày 22 => expiryDate.setDate(22 - 7); => expiryDate.setDate(15) 
    -> qua hàm setDate; expiryDate sẽ là Sat Feb 15 2025 10:00:00 GMT+0000 (UTC) (15/02/2025)
(3) tìm những ngày mà createdAt nhỏ hơn ngày 15/02/2025 để xóa
*/

/*
(4) Cú pháp của cron "0 2 * * *" 
    0: chạy vào 0 phút
    2: chạy vào 2 giờ sáng 
    * * *: chạy vào mỗi ngày, mỗi tháng, mỗi năm

  (*) ("* * * * * *") chia ra 5 vị trí ("[1] [2] [3] [4] [5] [6]") 
    [1]: Giây (0 - 59) (tùy chọn, như bài là bỏ qua phần này) 
    [2]: Phút (0 - 59)
    [3]: Giờ (0 - 23)
    [4]: Ngày trong tháng (1 - 31)
    [5]: Tháng (1 - 12)
    [6]: Thứ trong tuần (0 - 7) (Chủ Nhật là 0 hoặc 7) 

  (Biểu thức): 
  - "* * * * *": chạy mỗi phút (mỗi ngày, mỗi  tháng, mỗi năm)
  - "0 * * * *": Chạy mỗi giờ lúc 0 phút (00h00; 1h00)
  -"30 14 * * 1-5": Chạy 14h30 từ thứ 2 tới thứ 6 
  - "* / 5 * * * *": chạy mỗi 5 phút (* / 5 viết liền lại nhé, tại t viết liền là nó thành đóng comment :))))
  Vdu nhé: 
    - "30 5 * 7 4"  chạy vào 5h30 sáng mọi thứ 5 của tháng 7
    - "30 5 1 7 *": chạy 5h30 sáng ngày 1/7 
    - "30 23 1 7 4": chỉ chạy 23h30 vào ngày 1/7 nếu hôm đó là thứ 5
 \
*/
