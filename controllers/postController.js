const BaseController = require("../core/base_controller");
const fs = require('fs');
class postController extends BaseController {
    constructor() {
        super();
    }



    async createPost(req, res) {
        try {
            const userId = req.user.id;


            let imageUrl = null;
            if (req.file) {
                const { url } = await this.service.cloudinaryService.uploadImage(req.file.path);

                fs.unlink(req.file.path, (err) => {
                    if (err) console.error('Geçici dosya silinemedi:', err);
                });

                imageUrl = url;
            }

            const postPayload = {
                user_id: userId,
                category_id: req.body.category_id,
                title: req.body.title,
                content: req.body.content,
                image_url: imageUrl,
            };

            const result = await this.service.postService.createPost(postPayload);
            res.status(201).json(result);
        } catch (error) {
            console.error('Post oluşturulurken hata:', error);
            res.status(400).json({ error: error.message });
        }
    }



    async getPostById(req, res) {
        try {
            const postId = req.params.id;
            const result = await this.service.postService.getPostById(postId);
            res.status(200).json(result);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    async updatePost(req, res) {
        try {
            const postId = req.params.id;
            const userId = req.user.id;

            const { title, content, category_id } = req.body;

            const updateData = {
                title,
                content,
                category_id,
            };

            const updatedPost = await this.service.postService.updatePost({
                postId,
                userId,
                updateData,
            });

            res.status(200).json(updatedPost);
        } catch (error) {
            res.status(403).json({ error: error.message });
        }
    }





    async deletePost(req, res) {
        try {
            const postId = req.params.id;
            const userId = req.user.id;
            const result = await this.service.postService.deletePost(postId, userId);

            res.status(200).json(result);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }



    async getAllPosts(req, res) {
        try {
            const result = await this.service.postService.getAllPosts();
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }


    async getPostsByUserId(req, res) {
        try {
            const userId = req.user.id;
            const result = await this.service.postService.getPostsByUserId(userId);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async pagination(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 5;

            const result = await this.service.postService.pagination(page, limit);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }



    async updatePostImage(req, res) {
        try {
            const postId = req.params.id;
            if (!req.file) {
                return res.status(400).json({ error: "Dosya yüklenmedi" });
            }

            const { url } = await this.service.cloudinaryService.uploadImage(req.file.path);

            // Geçici dosyayı sil
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Geçici dosya silinemedi:", err);
            });

            // Post serviste resmi güncelle
            const updatedPost = await this.service.postService.updatePostImage(postId, url);

            res.status(200).json({
                message: "Post resmi başarıyla güncellendi",
                post: updatedPost
            });
        } catch (error) {
            console.error("Post resmi güncellenirken hata:", error);
            res.status(500).json({ error: error.message });
        }
    }

    async searchPost(req, res) {
        try {
            const query = req.query.query;
            const result = await this.service.postService.searchPost(query);
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

}

module.exports = new postController();