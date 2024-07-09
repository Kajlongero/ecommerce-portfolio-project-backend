// dependencys
const boom = require("@hapi/boom");
const crypto = require("crypto");

// esentials
const prisma = require("../../connections/prisma.connection");
const SharedController = require("../Shared/controller");

// utils
const { WhereId, WhereName } = require("../Shared/utils/prisma.objects");
const { SelectProduct, SearchWithFilters } = require("./utils/prisma.objects");
const {
  deleteImagesInBulk,
} = require("../Shared/utils/delete.images.from.disk");
const UPLOADS_DIRECTORY = require("./utils/products.images.dir");

class ProductsController extends SharedController {
  async getProducts(querys) {
    const { limit, offset } = querys;

    const products = await prisma.products.findMany({
      skip: offset ?? 0,
      take: limit ?? 30,
      where: {
        active: true,
        deletedAt: null,
      },
      ...SelectProduct,
    });

    return products;
  }

  async getProductById(productId) {
    const product = await prisma.products.findUnique({
      where: {
        id: parseInt(productId),
        active: true,
      },
      ...SelectProduct,
    });
    if (!product) throw new boom.notFound("Product not found");

    return product;
  }

  async getProductByCategory(categoryName, querys) {
    const { limit, offset } = querys;

    const category = await prisma.categories.findFirst(WhereName(categoryName));
    if (!category) throw new boom.notFound("Category not found");

    const products = await prisma.products.findMany({
      skip: offset ?? 0,
      take: limit ?? 30,
      where: {
        active: true,
        Categories: {
          some: {
            id: category.id,
          },
        },
      },
      ...SelectProduct,
    });

    return products;
  }

  async getProductBySearchAndFilters(filters) {
    const products = await prisma.products.findMany({
      skip: filters.offset ?? 0,
      take: filters.limit ?? 30,
      where: SearchWithFilters(filters),
    });

    return products;
  }

  async createProduct(user, productData) {
    await this.getPermissionsAndValidate(user, "CREATE_PRODUCT");

    const transaction = await prisma.$transaction(async (tx) => {
      const sku = crypto.randomBytes(256).toString("hex").substring(0, 32);

      const _product = await tx.products.create({
        data: {
          ...productData,
          sku,
        },
      });

      return _product;
    });

    return transaction;
  }

  async updateProduct(user, productId, productData) {
    await this.getPermissionsAndValidate(user, "UPDATE_PRODUCT");

    const transaction = await prisma.$transaction(async (tx) => {
      const _product = await prisma.products.findUnique(WhereId(productId));

      const _updated = await tx.products.update({
        ...WhereId(_product.id),
        data: {
          ...productData,
        },
      });

      return _updated;
    });

    return {
      message: "Product updated successfully",
    };
  }

  async setCoverImage(user, productId, image = undefined, imageId = undefined) {
    if (image && imageId) {
      deleteImagesInBulk(UPLOADS_DIRECTORY, [image.filename]);

      throw new boom.notAcceptable(
        "You must provide an image or a image id, not both"
      );
    }

    await this.getPermissionsAndValidate(user, "UPDATE_PRODUCT");

    const transaction = await prisma.$transaction(async (tx) => {
      const _product = await this.getProductById(productId);

      if (image) {
        const id = image.filename.split(".")[0];

        const _productUpdated = await tx.products.update({
          ...WhereId(parseInt(productId)),
          data: {
            coverImageId: id,
            Images: {
              create: {
                id: id,
                uri: image.path,
                width: image.width,
                height: image.height,
              },
            },
          },
        });

        return _productUpdated;
      }

      const _image = await tx.images.findUnique({
        ...WhereId(imageId),
        select: {
          id: true,
          Products: {
            select: {
              id: true,
              coverImageId: true,
            },
          },
        },
      });
      if (!_image) throw new boom.notFound("Image does not exists");

      if (_image && _image.Products && !_image.Products.length)
        throw new boom.forbidden("This image does not belong to any product");

      if (_product.id !== _image.Products[0].id)
        throw new boom.forbidden("Image does not belong to this product");

      const updated = await tx.products.update({
        ...WhereId(_product.id),
        data: {
          coverImageId: _image.id,
        },
      });

      return updated;
    });

    return {
      message: "Cover image updated successfully",
    };
  }

  async removeCoverImage(user, productId) {
    await this.getPermissionsAndValidate(user, "UPDATE_PRODUCT");

    const transaction = await prisma.$transaction(async (tx) => {
      const product = await this.getProductById(productId);

      if (product && !product.coverImageId)
        throw new boom.notFound("Cover image already removed");

      const every = [product.coverImageId].every(
        (img) => typeof img === "string"
      );
      if (!every)
        throw new boom.notAcceptable("Images must be an array of strings");

      await tx.products.update({
        ...WhereId(product.id),
        data: {
          coverImageId: null,
          Images: {
            delete: {
              id: product.coverImageId,
            },
          },
        },
      });

      return product;
    });

    deleteImagesInBulk(UPLOADS_DIRECTORY, [transaction.coverImageId]);

    return {
      message: "Cover image removed successfully",
    };
  }

  async addProductImages(user, productId, images) {
    await this.getPermissionsAndValidate(user, "ADD_PRODUCT_IMAGES");

    const transaction = await prisma.$transaction(async (tx) => {
      await this.getProductById(parseInt(productId));

      const _images = await tx.images.count({
        where: { Products: { some: { id: parseInt(productId) } } },
      });

      if (images && images.length + _images > 13) {
        deleteImagesInBulk(UPLOADS_DIRECTORY, [
          ...images.map((i) => i.filename.split(".")[0]),
        ]);

        throw new boom.notAcceptable(
          "This product cannot have more than 12 images of presentation and 1 of cover"
        );
      }
      await tx.images.createMany({
        data: images.map((i) => ({
          id: i.filename.split(".")[0],
          uri: i.path,
          width: i.width,
          height: i.height,
        })),
        skipDuplicates: true,
      });

      await tx.products.update({
        ...WhereId(productId),
        data: {
          Images: {
            connect: images.map((i) => ({
              id: i.filename.split(".")[0],
            })),
          },
        },
      });

      return true;
    });

    return {
      message: "Images added successfully",
    };
  }

  async removeProductImages(user, productId, imagesId) {
    if (imagesId && !imagesId.length)
      throw new boom.notAcceptable("You must provide image ids");

    await this.getPermissionsAndValidate(user, "ADD_PRODUCT_IMAGES");

    const _product = await this.getProductById(productId);
    if (_product && !_product.Images.length)
      throw new boom.notFound("Product does not have images");

    const images = new Set(_product.Images.map((img) => img.id));
    let arr = [];

    imagesId.map((img) => {
      if (images.has(img)) arr.push(img);
    });

    if (arr && !arr.length)
      throw new boom.notFound(
        "Images does not belong to the product or does not exists"
      );

    const transaction = await prisma.$transaction(async (tx) => {
      if (images.has(_product.coverImageId))
        await tx.products.update({
          ...WhereId(_product.id),
          data: {
            coverImageId: null,
          },
        });

      const _deleted = await tx.images.deleteMany({
        where: { id: { in: arr } },
      });

      return _deleted;
    });

    deleteImagesInBulk(UPLOADS_DIRECTORY, arr);

    return {
      message: "Images deleted successfully",
    };
  }

  async deleteProduct(user, productId) {
    await this.getPermissionsAndValidate(user, "DELETE_PRODUCT");

    const transaction = await prisma.$transaction(async (tx) => {
      const _product = await this.getProductById(productId);

      await tx.images.deleteMany({
        where: {
          Products: {
            some: {
              id: _product.id,
            },
          },
        },
      });

      await tx.products.delete(WhereId(productId));

      return true;
    });

    return {
      message: "Product deleted successfully",
    };
  }
}

module.exports = new ProductsController();
