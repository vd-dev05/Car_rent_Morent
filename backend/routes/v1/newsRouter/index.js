import { Router } from "express";
import middlewares from "../../../middlewares/index.js"
import newsController from "../../../controllers/newsController.js";
const NewsRouter = Router();

NewsRouter.post("/create-news", middlewares.verifyAccessToken, middlewares.validateAdmin, newsController.createNews); // Tạo tin tức mới - ADMIN
NewsRouter.put("/edit-news/:id", middlewares.verifyAccessToken, middlewares.validateAdmin, newsController.editNews); // Sửa tin tức - ADMIN
NewsRouter.get("/the3LatestNewsPerCategory", newsController.getThe3LatestNewsPerCategory); // 3 tin mới nhất mỗi danh mục, hiển thị ở NewsPage Overview - ALL
NewsRouter.get("/publishedByCategory", newsController.getNewsPublishedByCategory); // Đã xuất bản, hiển thị ở NewsPage Category - ALL
NewsRouter.get("/countNews", middlewares.verifyAccessToken, middlewares.validateAdmin, newsController.countNews); // Đếm tất cả tin theo trạng thái - ADMIN
NewsRouter.get("/", middlewares.verifyAccessToken, middlewares.validateAdmin, newsController.getAllNews); // Tất cả theo trạng thái - ADMIN
NewsRouter.get("/countNewsByCategory/:isCategory", middlewares.verifyAccessToken, middlewares.validateAdmin, newsController.countNewsByCategory); // Đếm tất cả tin theo trạng thái theo danh mục - ADMIN
NewsRouter.get("/newsByCategory", middlewares.verifyAccessToken, middlewares.validateAdmin, newsController.getNewsByCategory); // Tất cả theo trạng thái theo danh mục - ADMIN
NewsRouter.delete("/deleteNewsById/:id", middlewares.verifyAccessToken, middlewares.validateAdmin, newsController.deleteNewsById); // Xóa tin - ADMIN
NewsRouter.get("/:id", newsController.getNewsById); // Theo id - ALL

export default NewsRouter;
