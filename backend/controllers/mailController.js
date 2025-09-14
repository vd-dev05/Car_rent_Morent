import MailModel from "../models/MailModel.js";
import UserModel from "../models/UserModel.js";
import { io } from "../socket/socket.js";

const MailController = {
  //Api lấy tất cả thư, mới nhất trước
  getAllMail: async (req, res) => {
    try {
      const data = await MailModel.find().sort({ createdAt: -1 });
      res.status(200).send({
        message: "Tất cả thư trong database",
        data: data,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },
  //Api gửi thư
  sendMail: async (req, res) => {
    try {
      console.log("Request body:", req.body);
      const role = req.user.role;
      if (role === "ADMIN")
        throw new Error("Vui lòng không sử dụng tài khoản Admin để gửi đơn");
      // Kiểm tra request body có dữ liệu không
      if (!req.body || Object.keys(req.body).length === 0) {
        throw new Error("Dữ liệu yêu cầu không hợp lệ.");
      }
      const { senderName, senderEmail, senderPhone, mailContent } = req.body;
      const { senderId, recipientId, carId } = req.query;
      if (
        !senderName?.trim() ||
        senderName === "null" ||
        !senderEmail?.trim() ||
        senderEmail === "null" ||
        !senderPhone?.trim() ||
        senderPhone === "null"
      ) {
        throw new Error("Thiếu thông tin bắt buộc");
      }
      const checkMailExist = await MailModel.findOne({ senderId, carId });
      if (checkMailExist) throw new Error("Bạn đã hỏi về xe này rồi");
      if (senderId.toString() === recipientId.toString())
        throw new Error("Bạn không thể gửi thư cho mình");
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); //Hạn của thư (Ngày tạo + 7 ngày)
      const allMailInclude = {
        senderName,
        senderEmail,
        senderPhone,
        mailContent,
        senderId,
        recipientId,
        carId,
        status: "đang xử lý",
        expiresAt,
      };
      const newMail = await MailModel.create(allMailInclude);
      io.to(allMailInclude.recipientId.toString()).emit("sendMail", {
        message: `Bạn có 1 thư mới`,
      });
      res.status(200).send({
        message: "Gửi thư liên hệ thành công",
        data: newMail,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },
  //Api lấy thư đã gửi của sender
  getSenderMail: async (req, res) => {
    try {
      const { limit, page } = req.query;
      const dataLimit = parseInt(limit) || 10;
      const pageNumber = parseInt(page) || 1;
      const skip = (pageNumber - 1) * dataLimit;
      const { userId } = req.query;
      const mails = await MailModel.find({ senderId: userId })
        .sort({ createdAt: -1 })
        .populate("recipientId  senderId")
        .populate("carId", "carName")
        .skip(skip)
        .limit(dataLimit);
      const totalMail = await MailModel.countDocuments({
        senderId: userId,
      });
      res.status(200).send({
        message: "Đây là tất cả thư bạn đã gửi",
        data: mails,
        totalPages: Math.ceil(totalMail / dataLimit),
        currentPage: pageNumber,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },
  //Api lấy tất cả thư từ id người bán
  getProviderMail: async (req, res) => {
    try {
      const { limit, page } = req.query;
      const dataLimit = parseInt(limit) || 10;
      const pageNumber = parseInt(page) || 1;
      const skip = (pageNumber - 1) * dataLimit;
      const { providerId } = req.query;
      const mails = await MailModel.find({ recipientId: providerId })
        .sort({ createdAt: -1 })
        .populate("recipientId senderId")
        .populate("carId", "carName")
        .skip(skip)
        .limit(dataLimit);
      const totalMail = await MailModel.countDocuments({
        recipientId: providerId,
      });
      res.status(200).send({
        message: "Đây là tất cả thư của bạn",
        data: mails,
        totalPages: Math.ceil(totalMail / dataLimit),
        currentPage: pageNumber,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },
  //Api lấy số lượng thư chưa đọc của user (có role provider)
  getUnreadMailCount: async (req, res) => {
    try {
      const providerId = req.user.idUser;
      const provider = await UserModel.findById(providerId).select(
        "unreadMails"
      );
      res.status(200).send({
        message: `Bạn có ${provider.unreadMails} thư mới`,
        data: provider.unreadMails,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },
  changeMailStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status, reason } = req.body;
      const mail = await MailModel.findById(id);
      if (!mail) throw new Error("Thư không tồn tại!");
      if (!["từ chối", "chấp thuận"].includes(status))
        throw new Error("Trạng thái không hợp lệ!");
      if (status === "từ chối" && !reason)
        throw new Error("Vui lòng nhập lí do từ chối");
      const updatedMail = await MailModel.findByIdAndUpdate(
        id,
        {
          status,
          ...(mail.isRead ? {} : { isRead: true }), //chỉ chỉnh nếu isRead là false
          ...(reason && { reason }),
        },
        { new: true }
      ); //Cách viết shorthand conditional object property: ...(reason && { reason }), tránh trường hợp nếu reason bằng null hoặc undifine sẽ thêm key reason là null
      io.to(updatedMail.senderId.toString()).emit("mailStatusChanged", {
        message: `Người bán đã ${status} thư của bạn`,
        mailId: updatedMail._id,
        status,
      });

      // console.log(
      //   "📡 Gửi sự kiện mailStatusChanged đến:",
      //   updatedMail.senderId.toString()
      // );
      res.status(200).send({
        message: "Cập nhật thư thành công",
        data: updatedMail,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },
  readMail: async (req, res) => {
    try {
      const { id } = req.params;
      const mail = await MailModel.findById(id);
      if (!mail) return res.status(404).json({ message: "Thư không tồn tại!" });
      if (mail.isRead) {
        return res.json({ message: "Thư đã được đọc trước đó!", mail });
      }
      mail.isRead = true;
      mail.status = "đã xem";
      await mail.save();
      return res.json({
        message: "Đánh dấu thư là đã đọc!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },
  //Xóa đơn đẫ gửi của sender
  deleteMail: async (req, res) => {
    try {
      const { id } = req.params;
      const mail = await MailModel.findById(id);
      if (!mail) return res.status(404).json({ message: "Thư không tồn tại!" });

      const idUser = req.user._id;
      // console.log(idUser);
      // console.log(mail.senderId.toString());
      if (idUser !== mail.senderId.toString())
        throw new Error("Bạn không phải người gửi đơn này!");

      await MailModel.findByIdAndDelete(id);
      return res.json({ message: "Xóa đơn thành công!", data: mail });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Lỗi server!" });
    }
  },
};

export default MailController;

/*
A: web gửi đơn
B: web trả lời




*/
