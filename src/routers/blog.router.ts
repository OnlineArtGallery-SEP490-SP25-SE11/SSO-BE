import { Router } from "express";
import roleRequire from "@/configs/middleware.config";
import { Role } from "@/constants/enum";
import container from "@/configs/container.config";
import { TYPES } from "@/types/types";
import { IBlogController } from "@/interfaces/controller.interface";

const router = Router();
const blogController = container.get<IBlogController>(TYPES.BlogController);
router.get("/", blogController.getBlogs);
router.get("/published", blogController.getPublishedBlogs);
router.get(
  "/last-edited",
  roleRequire(["user"]),
  blogController.getLastEditedBlog
);
router.get("/:id", blogController.getBlogById);
router.post("/", roleRequire([Role.USER, Role.ADMIN]), (req, res, next) => {
  blogController.createBlog(req, res, next);
});
router.put("/:id", roleRequire(["user", "admin"]), blogController.updateBlog);
router.delete("/:id", blogController.deleteBlog);
  
export default router;
