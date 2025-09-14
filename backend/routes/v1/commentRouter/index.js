import { Router } from "express";
import middlewares from "../../../middlewares/index.js";
import commentMidleware from "../../../middlewares/commetMidleware.js";
import commentController from "../../../controllers/commentController.js";
const CommentRouter = Router();

CommentRouter.post("/create-comment", middlewares.verifyAccessToken, commentMidleware.validateNews, commentController.createComment); // Tạo bình luận mới - USER
CommentRouter.get("/countComments", middlewares.verifyAccessToken, middlewares.validateAdmin, commentController.countComments); // Đếm tất cả bình luận theo trạng thái - ADMIN
CommentRouter.get("/", middlewares.verifyAccessToken, middlewares.validateAdmin, commentController.getAllComment); // Lấy tất cả bình luận theo trạng thái - ADMIN
CommentRouter.get("/countCommentsByNews/:newsId", middlewares.verifyAccessToken, middlewares.validateAdmin, commentController.countCommentsByNews); // Đếm tất cả bình luận theo trạng thái theo tin - ADMIN
CommentRouter.get("/commentByNewsId", commentController.getCommentByNewsId); // Lấy tất cả bình luận theo trạng thái theo tin - ALL
CommentRouter.delete("/deleteCommentById/:id", middlewares.verifyAccessToken, middlewares.validateAdmin, commentController.deleteCommentById); // Xóa bình luận - ADMIN
CommentRouter.put("/changeCommentStatus", middlewares.verifyAccessToken, middlewares.validateAdmin, commentController.changeCommentStatus); // Thay đổi trạng thái bình luận - ADMIN
CommentRouter.put("/edit-comment/:id", middlewares.verifyAccessToken, middlewares.validateAdmin, commentController.editComment); // Chỉnh sửa bình luận - ADMIN

export default CommentRouter;
