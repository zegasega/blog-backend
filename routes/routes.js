const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/auth");
const roleMiddleware = require("../middleware/role");
const postController = require("../controllers/postController");
const categoryController = require("../controllers/categoryController");
const commentController = require("../controllers/commentController");
const likeController = require("../controllers/likeController");
const schemas = require("../validators/index");

const multer = require('multer');
const upload = multer({ dest: 'tmp/' });

const validateBody = require("../middleware/validationMiddleware");

// User routes
router.get("/users", authMiddleware, userController.getAllUsers);
router.get("/users/query", authMiddleware, userController.getUserByQuery);
router.get("/users/:id", authMiddleware, userController.getUserById);

// Auth routes
router.post("/auth/register", validateBody(schemas.userSchema), userController.register);
router.post("/auth/login", userController.login);
router.post("/auth/logout", authMiddleware, userController.logout);
router.put("/auth/user", authMiddleware, userController.update);
router.delete("/auth/user", authMiddleware, userController.delete);

// Post routes
router.get("/posts", authMiddleware, postController.getAllPosts);
router.get("/posts/search", authMiddleware, postController.searchPost);
router.get("/posts/page/:page/limit/:limit", authMiddleware, postController.pagination);
router.get("/users/me/posts", authMiddleware, postController.getPostsByUserId);
router.get("/posts/:id", authMiddleware, postController.getPostById);
router.post("/posts", upload.single("image"), authMiddleware, postController.createPost);
router.put("/posts/:id", authMiddleware, postController.updatePost);
router.delete("/posts/:id", authMiddleware, postController.deletePost);
router.post("/posts/:id/image", upload.single("image"), authMiddleware, postController.updatePostImage);

// Category routes
router.get("/categories", authMiddleware, categoryController.getAll);
router.get("/categories/:id", authMiddleware, categoryController.getById);
router.post("/categories", authMiddleware, roleMiddleware("admin"), categoryController.create);
router.put("/categories/:id", authMiddleware, categoryController.update);
router.delete("/categories/:id", authMiddleware, roleMiddleware("admin"), categoryController.delete);

// Comment routes
router.post("/comments", authMiddleware, commentController.createComment);
router.get("/comments/post/:postId", authMiddleware, commentController.getCommentsByPost);
router.get("/comments", authMiddleware, commentController.getAllComments);
router.put("/comments/:commentId", authMiddleware, commentController.updateComment);
router.delete("/comments/:commentId", authMiddleware, commentController.deleteComment);

// Like routes
router.post("/posts/:postId/like", authMiddleware, likeController.ToggleLike.bind(likeController));
router.get("/posts/:postId/like", authMiddleware, likeController.GetLikesByPostId);

module.exports = router;
