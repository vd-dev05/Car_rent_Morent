import mongoose from "mongoose";

const mailSchema = new mongoose.Schema(
  {
    senderName: {
      type: String,
      required: true,
    },
    senderEmail: {
      type: String,
      required: true,
      lowercase: true,
    },
    senderPhone: {
      type: String,
      required: true,
      trim: true,
    },
    mailContent: String,
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    }, //Người nhận mail
    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cars",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "đang xử lý",
        "đã xem",
        "từ chối",
        "chấp thuận",
        "hết hạn",
        "đã xóa",
      ],
      default: "đang xử lý",
    },
    reason: { type: String, default: null }, //Lí do từ chối
    isRead: { type: Boolean, default: false }, //seen hay chưa
    expiresAt: {
      type: Date,
      //required: true
    }, //Thời gian thư hết hạn
  },
  { timestamps: true } // Tự động thêm createdAt và updatedAt
);

// Tối ưu truy vấn index
mailSchema.index({ recipientId: 1, status: 1, createdAt: -1 }); //1: Index cho việc lấy thư từ id người nhận
mailSchema.index({ senderId: 1, carId: 1 }); //2
mailSchema.index({ senderId: 1, createdAt: -1 }); //2
mailSchema.index({ createdAt: -1 }); //3: Index cho việc lấy thời gian mới nhất

const MailModel = mongoose.model("mails", mailSchema);

export default MailModel;

//Tạo index dựa trên dữ liệu
/*
Hiểu đơn giản là mongoose sẽ tạo sẵn 1 bảng index, có sắp xếp thứ tự trước để sau truy vấn cho dễ
1) Bảng 1: hỗ trọ truy vấn khi tìm thư của người nhận, trạng thái và thời gian tạo
  Vdu database Có 4 thư:
  recipientId: người A; status: "đang xử lý"; createdAt: 12h30p
  recipientId: người A; status: "đã xem"; createdAt: 13h 
  recipientId: người B; status: "đã xem"; createdAt: 11h
  recipientId: người A; status: "đang xử lý"; createdAt: 12h

=> Sắp xếp lại theo index 
recipientId: A, status: "đã xem", createdAt: 13h
recipientId: A, status: "đang xử lý", createdAt: 12h30p
recipientId: A, status: "đang xử lý", createdAt: 12h
recipientId: B, status: "đã xem", createdAt: 11h

  -> Vậy khi sử dụng API lấy thư của người nhận A. Thì index đã gộp sẵn người A vào 1 chỗ -> truy vấn nhanh hơn. Hoặc APi 
   lấy thư người nhận A trạng thái "đang xử lí" cũng vậy. => API không cần truy vấn tất cả dữ liệu nữa 
*/
