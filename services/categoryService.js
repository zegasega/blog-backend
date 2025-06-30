const BaseService = require("../core/base_service");
const db = require("../db/index");


class CategoryService extends BaseService {
    constructor() {
        super(db.Category);
        this.db = db;
    }

    async createCategory(categoryPayload) {
        const existingCategory = await this.db.Category.findOne({
            where: { name: categoryPayload.name }
        });
        if (existingCategory) {
            throw new Error("Category already exists");
        }
        return await this.db.Category.create(categoryPayload);
    }


    async getCategoryById(categoryId) {
        const category = await this.db.Category.findByPk(categoryId, {
            include: [{ model: this.db.Post, as: 'posts' }]

        });
        if (!category) {
            throw new Error("Category not found");
        }
        return category;
    }

    async updateCategory(categoryId, categoryPayload) {
        const category = await this.db.Category.findByPk(categoryId);
        if (!category) {
            throw new Error("Category not found");
        }
        await category.update(categoryPayload);
        return category;
    }

    async deleteCategory(categoryId) {
        const category = await this.db.Category.findByPk(categoryId);
        if (!category) {
            throw new Error("Category not found");
        }
        await category.destroy();
        return { message: "Category deleted successfully" };
    }

    async getAllCategories() {
        return await this.db.Category.findAll();
    }
}

module.exports = new CategoryService();