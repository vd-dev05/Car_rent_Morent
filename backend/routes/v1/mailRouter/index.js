import { Router } from "express";
import MailController from "../../../controllers/mailController.js";
import UserMiddleware from "../../../middlewares/userMiddleware.js";
import MailMidleware from "../../../middlewares/mailMidleware.js";

const MailRouter = Router();
// Lấy tất cả thư
MailRouter.get("", MailController.getAllMail);
//
MailRouter.post(
  "/PostMail",
  MailMidleware.validateCar,
  UserMiddleware.modifyUser,
  MailController.sendMail
);
//Lấy thư của recipient
MailRouter.get("/ProviderMail", MailController.getProviderMail);
MailRouter.get("/SenderMail", MailController.getSenderMail);
// Cập nhật status thư
MailRouter.put("/:id/status", MailController.changeMailStatus);
//Đánh dầu là đã đọc
MailRouter.put("/:id/read", MailController.readMail);
//hàm xóa thư
MailRouter.delete(
  "/deleteMail/:id",
  UserMiddleware.modifyUser,
  MailController.deleteMail
);
export default MailRouter;
