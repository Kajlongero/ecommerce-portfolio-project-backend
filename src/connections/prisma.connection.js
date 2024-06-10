const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  transactionOptions: {
    timeout: 5000,
  },
});

module.exports = prisma;
