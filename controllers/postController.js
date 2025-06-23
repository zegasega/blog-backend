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

            // form-data'dan gelen text alanlarını al
            const { title, content, category_id } = req.body;

            // Güncellenecek veriyi sadece dolu alanlarla oluştur
            const updateData = {};
            if (title !== undefined) updateData.title = title;
            if (content !== undefined) updateData.content = content;
            if (category_id !== undefined) updateData.category_id = category_id;

            // Eğer dosya varsa, Cloudinary'ye yükle ve URL'yi ekle
            if (req.file) {
            const { url } = await this.service.cloudinaryService.uploadImage(req.file.path);

            // Geçici dosyayı sil (async/await ile)
            try {
                await fs.unlink(req.file.path);
            } catch (unlinkErr) {
                console.error("Geçici dosya silinemedi:", unlinkErr);
            }

            updateData.image_url = url;
            }

            // Post servisinde güncelleme yap
            const updatedPost = await this.service.postService.updatePost({
            postId,
            userId,
            updateData,
            });

            res.status(200).json(updatedPost);

        } catch (error) {
            console.error("Post güncellenirken hata:", error);
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


}

module.exports = new postController();