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
router.get("/users", authMiddleware, (req, res) => userController.getAllUsers(req, res));
router.get("/users/query", authMiddleware, (req, res) => userController.getUserByQuery(req, res));
router.get("/users/:id", authMiddleware, (req, res) => userController.getUserById(req, res));

// Auth routes
router.post("/auth/register", validateBody(schemas.userSchema), (req, res) => userController.register(req, res));
router.post("/auth/login", (req, res) => userController.login(req, res));
router.post("/auth/logout", authMiddleware, (req, res) => userController.logout(req, res));
router.put("/auth/user", authMiddleware, (req, res) => userController.update(req, res));
router.delete("/auth/user", authMiddleware, (req, res) => userController.delete(req, res));

// Post routes
router.get("/posts", authMiddleware, (req, res) => postController.getAllPosts(req, res));
router.get("/posts/search", authMiddleware, (req, res) => postController.searchPost(req, res));
router.get("/posts/pagination/:page/:limit", authMiddleware, (req, res) => postController.pagination(req, res));
router.get("/users/me/posts", authMiddleware, (req, res) => postController.getPostsByUserId(req, res));
router.get("/posts/:id", authMiddleware, (req, res) => postController.getPostById(req, res));
router.post("/posts", upload.single("image"), authMiddleware, (req, res) => postController.createPost(req, res));
router.put("/posts/:id", authMiddleware, (req, res) => postController.updatePost(req, res));
router.delete("/posts/:id", authMiddleware, (req, res) => postController.deletePost(req, res));
router.post("/posts/:id/image", upload.single("image"), authMiddleware, (req, res) => postController.updatePostImage(req, res));

// Category routes
router.get("/categories", authMiddleware, (req, res) => categoryController.getAll(req, res));
router.get("/categories/:id", authMiddleware, (req, res) => categoryController.getById(req, res));
router.post("/categories", authMiddleware, roleMiddleware("admin"), (req, res) => categoryController.create(req, res));
router.put("/categories/:id", authMiddleware, (req, res) => categoryController.update(req, res));
router.delete("/categories/:id", authMiddleware, roleMiddleware("admin"), (req, res) => categoryController.delete(req, res));

// Comment routes
router.post("/comments", authMiddleware, (req, res) => commentController.createComment(req, res));
router.get("/comments/post/:postId", authMiddleware, (req, res) => commentController.getCommentsByPost(req, res));
router.get("/comments", authMiddleware, (req, res) => commentController.getAllComments(req, res));
router.put("/comments/:commentId", authMiddleware, (req, res) => commentController.updateComment(req, res));
router.delete("/comments/:commentId", authMiddleware, (req, res) => commentController.deleteComment(req, res));

// Like routes
router.post("/posts/:postId/like", authMiddleware, (req, res) => likeController.ToggleLike.call(likeController, req, res));
router.get("/posts/:postId/like", authMiddleware, (req, res) => likeController.GetLikesByPostId(req, res));

module.exports = router;
