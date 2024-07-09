// dependencies
const boom = require("@hapi/boom");

// esentials
const prisma = require("../../connections/prisma.connection");
const { WhereId, WhereName } = require("../Shared/utils/prisma.objects");
const SharedController = require("../Shared/controller");

// utils

class CategoriesController extends SharedController {
  async getAllCategories(filters) {
    const categories = await prisma.categories.findMany({
      skip: filters.offset ?? 0,
      take: filters.take ?? 30,
    });

    return categories;
  }

  async getCategoryById(categoryId) {
    const category = await prisma.categories.findUnique(
      WhereId(parseInt(categoryId))
    );
    if (!category) throw new boom.notFound("Category not found");

    return category;
  }

  async createCategory(user, data) {
    await this.getPermissionsAndValidate(user, "CREATE_CATEGORY");

    await prisma.$transaction(async (tx) => {
      const _category = await tx.categories.findFirst(WhereName(data.name));
      if (_category) throw new boom.conflict("Category name already taken");

      const _created = await tx.categories.create({
        data: {
          name: data.name,
        },
      });

      return _created;
    });

    return {
      message: "Category created successfully",
    };
  }

  async updateCategoryName(user, data) {
    await this.getPermissionsAndValidate(user, "UPDATE_CATEGORY");

    await prisma.$transaction(async (tx) => {
      const _category = await tx.categories.findUnique(
        WhereId(parseInt(data.categoryId))
      );
      if (!_category) throw new boom.notFound("Category does not exists");

      const _updated = await tx.categories.update({
        ...WhereId(parseInt(data.categoryId)),
        data: {
          name: data.name,
        },
      });

      return _updated;
    });

    return {
      message: "Category updated successfully",
    };
  }

  async deleteCategory(user, categoryId) {
    const id = parseInt(categoryId);

    await this.getPermissionsAndValidate(user, "DELETE_CATEGORY");

    await prisma.$transaction(async (tx) => {
      const _category = await tx.categories.findUnique(WhereId(id));
      if (!_category) throw new boom.notFound("Category does not exists");

      const _deleted = await tx.categories.delete({
        ...WhereId(id),
      });

      return _deleted;
    });

    return {
      message: "Category deleted successfully",
    };
  }
}

module.exports = new CategoriesController();
