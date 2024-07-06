// dependencys
const boom = require("@hapi/boom");
const crypto = require("crypto");

// esentials
const prisma = require("../../connections/prisma.connection");
const SharedController = require("../Shared/controller");

// utils
const { WhereId } = require("../Shared/utils/prisma.objects");
const { SelectProduct, SearchWithFilters } = require("./utils/prisma.objects");
const RESPONSE_MESSAGES = require("../../responses/response.messages");
const { unauthorized } = require("@hapi/boom");
const { allowed } = require("../Auth/utils/has.permissions");

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
      ...WhereId(productId),
      ...SelectProduct,
    });
    if (!product) throw new boom.notFound("Product not found");

    return product;
  }

  async getProductByCategory(categoryName, querys) {
    const { limit, offset } = querys;

    const products = await prisma.products.findMany({
      skip: offset ?? 0,
      take: limit ?? 30,
      where: {
        Categories: {
          some: {
            name: {
              equals: categoryName,
            },
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

  async createProduct(user, productData, image) {
    await this.getPermissionsAndValidate(user, "CREATE_PRODUCT");

    const transaction = await prisma.$transaction(async (tx) => {
      const sku = crypto.randomBytes(256).toString("utf8").substring(0, 32);

      const _image = await tx.images.create({
        data: {
          id: image.filename,
          uri: image.path,
          width: image.width,
          height: image.height,
        },
      });

      const _product = await tx.products.create({
        data: {
          ...productData,
          sku,
          coverImageId: _image.id,
          Images: {
            connect: {
              id: _image.id,
            },
          },
        },
      });

      return _product;
    });

    return {
      message: "Product created successfully",
    };
  }

  async updateProduct(user, productId, productData) {
    await this.getPermissionsAndValidate(user, "UPDATE_PRODUCT");

    const transaction = await prisma.$transaction(async (tx) => {
      await this.getProductById(productId);

      const _updated = await prisma.products.update({
        ...WhereId(productId),
        data: {
          ...productData,
        },
      });

      return _updated;
    });

    return {
      message: "Product created successfully",
    };
  }

  async setCoverImage(user, productId, image = undefined, imageId = undefined) {
    await this.getPermissionsAndValidate(user, "UPDATE_PRODUCT");

    const transaction = await prisma.$transaction(async (tx) => {
      await this.getProductById(productId);

      let img = imageId;

      if (image) {
        const _image = await tx.images.create({
          data: {
            id: image.filename,
            uri: image.path,
            width: image.width,
            height: image.height,
          },
        });

        img = _image.id;
      }

      const _product = await tx.products.update({
        ...WhereId(productId),
        data: {
          coverImageId: img,
          Images:
            img !== imageId
              ? {
                  connect: {
                    id: img,
                  },
                }
              : {},
        },
      });

      return _product;
    });

    return {
      message: "Cover image updated successfully",
    };
  }

  async removeCoverImage(user, productId, imageId) {
    await this.getPermissionsAndValidate(user, "UPDATE_PRODUCT");

    const transaction = await prisma.$transaction(async (tx) => {
      await this.getProductById(productId);

      await tx.products.update({
        ...WhereId(productId),
        data: {
          coverImageId: null,
        },
      });

      return true;
    });

    return {
      message: "Cover image removed successfully",
    };
  }

  async addProductImages(user, productId, images) {
    await this.getPermissionsAndValidate(user, "ADD_PRODUCT_IMAGES");

    const transaction = await prisma.$transaction(async (tx) => {
      const _product = await this.getProductById(productId);

      const _images = await tx.images.count({
        where: { Products: { some: { id: productId } } },
      });

      if (images.length + _images > 12)
        throw new boom.notAcceptable(
          "This product cannot have more than 12 images"
        );

      const _created = await tx.images.createMany({
        data: images.map((i) => ({
          id: i.filename,
          uri: i.path,
          width: i.width,
          height: i.height,
        })),
        skipDuplicates: true,
      });
    });
  }

  async removeProductImages(user, productId, imagesId) {}
}

module.exports = new ProductsController();
