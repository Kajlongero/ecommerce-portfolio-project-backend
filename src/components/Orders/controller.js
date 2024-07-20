const boom = require("@hapi/boom");
const crypto = require("crypto");

const SharedController = require("../Shared/controller");
const prisma = require("../../connections/prisma.connection");
const { WhereId } = require("../Shared/utils/prisma.objects");
const { allowed } = require("../Auth/utils/has.permissions");
const RESPONSE_MESSAGES = require("../../responses/response.messages");

class OrdersController extends SharedController {
  async getAllOrders(user, filters) {
    await this.getPermissionsAndValidate(user, "READ_ORDERS");

    const orders = await prisma.orders.findMany({
      skip: filters.offset,
      take: filters.limit,
    });

    return orders;
  }

  async getOrdersByCustomer(user, id, filters) {
    const _user = await prisma.auth.findUnique(WhereId(user.uid));
    if (!_user)
      throw new boom.unauthorized(RESPONSE_MESSAGES.UNAUTHORIZED_ACTION);

    const { permissions } = await this.getRolePermissions(user.role[0] || "");

    if (user.uid === id && !allowed(permissions, "READ_OWN_ORDERS"))
      throw new boom.unauthorized(RESPONSE_MESSAGES.UNAUTHORIZED_ACTION);

    if (user.uid !== id && !allowed(permissions, "READ_ORDERS"))
      throw new boom.unauthorized(RESPONSE_MESSAGES.UNAUTHORIZED_ACTION);

    const orders = await prisma.orders.findMany({
      ...WhereId(id),
      skip: filters.offset,
      take: filters.limit,
    });

    return orders;
  }

  async getOrderById(user, orderId) {
    const _user = await prisma.auth.findUnique(WhereId(user.uid));
    if (!_user)
      throw new boom.unauthorized(RESPONSE_MESSAGES.UNAUTHORIZED_ACTION);

    const { permissions } = await this.getRolePermissions(user.role[0] || "");

    const order = await prisma.orders.findUnique(WhereId(orderId));
    if (!order) throw new boom.notFound("Order not found");

    if (order.userId === user.uid && !allowed(permissions, "READ_OWN_ORDERS"))
      throw new boom.unauthorized(RESPONSE_MESSAGES.UNAUTHORIZED_ACTION);

    if (order.userId !== user.uid && !allowed(permissions, "READ_ORDERS"))
      throw new boom.unauthorized(RESPONSE_MESSAGES.UNAUTHORIZED_ACTION);

    return order;
  }
}

module.exports = new OrdersController();
