const BaseService = require("../core/base_service");
const db = require("../db/index");

class PostService extends BaseService {
    constructor() {
        super(db.Post);
        this.db = db;
    }

    async createPost(postPayload) {
        return await this.db.sequelize.transaction(async (t) => {
            const category = await this.db.Category.findByPk(postPayload.category_id, { transaction: t });
            if (!category) throw new Error("Kategori bulunamadı");

            const newPost = await this.db.Post.create(postPayload, { transaction: t });
            return newPost;
        });
    }

    async getPostById(postId) {
        const post = await this.db.Post.findByPk(postId, {
            include: [{ model: this.db.User, as: "author" }],
        });
        if (!post) throw new Error("Post bulunamaduuuuı");
        return post;
    }

    async updatePost({ postId, userId, updateData }) {
        const post = await this.db.Post.findByPk(postId);
        if (!post) throw new Error("Post bulunamadı");
        if (post.user_id !== userId) throw new Error("Bu postu güncelleme yetkiniz yok");

        return await post.update(updateData);
    }

    async deletePost(postId, userId) {
        return await this.db.sequelize.transaction(async (t) => {
            const post = await this.db.Post.findByPk(postId, { transaction: t });
            if (!post) throw new Error("Post bulunamadı");
            if (post.user_id !== userId) throw new Error("Başkasının postunu silemezsin");

            await this.db.Comment.destroy({ where: { post_id: postId }, transaction: t });
            await post.destroy({ transaction: t });

            return { message: "Post başarıyla silindi" };
        });
    }



    async getAllPosts() {
        const { fn, col } = this.db.Sequelize;

        return await this.db.Post.findAll({
            attributes: {
                include: [
                    [fn('COUNT', col('likes.id')), 'likeCount']
                ]
            },
            include: [
                {
                    model: this.db.User,
                    as: "author",
                    attributes: ["id", "username"]
                },
                {
                    model: this.db.Category,
                    as: "category",
                    attributes: ["id", "name"]
                },
                {
                    model: this.db.Like,
                    as: 'likes',
                    attributes: ['user_id'] // ✅ like atan kullanıcıların id'si
                }
            ],
            group: [
                'Post.id',
                'author.id',
                'category.id',
                'likes.id',        // 👈 Ekledik çünkü likes.user_id alıyoruz
                'likes.user_id'    // 👈 MySQL ONLY_FULL_GROUP_BY için gerekli
            ]
        });
    }



    async getPostsByUserId(userId) {
        return await this.db.Post.findAll({
            where: { user_id: parseInt(userId, 10) },
            include: [
                { model: this.db.User, as: "author", attributes: ["id", "username"] },
                { model: this.db.Category, as: "category", attributes: ["id", "name"] },
            ],
        });
    }

    async updatePostImage(post_id, imageUrl) {
        const post = await this.db.Post.findByPk(post_id);
        if (!post) {
            throw new Error("Post bulunamadı");
        }

        post.image_url = imageUrl;
        await post.save();

        return post;
    }
}

module.exports = new PostService();
