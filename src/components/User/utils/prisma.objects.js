const { IncludeUserData } = require("../../Auth/utils/prisma.objects");
const prisma = require("../../../connections/prisma.connection");

const CreateCustomer = ({
  email,
  password,
  roleId,
  firstName,
  lastName,
  address,
  birthDate,
  rId,
}) => ({
  data: {
    auth: {
      create: {
        email,
        password,
        role: {
          connect: {
            id: roleId,
          },
        },
      },
    },
    profile: {
      create: {
        firstName,
        lastName,
        address: address || undefined,
        birthDate: birthDate || undefined,
      },
    },
    activeSessions: {
      create: {
        id: rId,
      },
    },
  },
  ...IncludeUserData,
});

const CreateEmployee = ({
  email,
  password,
  roleId,
  firstName,
  lastName,
  address,
  birthDate,
}) => ({
  data: {
    auth: {
      create: {
        email,
        password,
        role: {
          connect: {
            id: roleId,
          },
        },
        confirmed: true,
      },
    },
    profile: {
      create: {
        firstName,
        lastName,
        address,
        birthDate,
      },
    },
  },
});

const SelectUserInfo = {
  select: {
    id: true,
    auth: {
      select: {
        id: true,
        email: true,
        confirmed: true,
        createdAt: true,
        role: {
          select: {
            name: true,
          },
        },
      },
    },
    profile: {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        address: true,
        balance: true,
        birthDate: true,
        CoverImage: {
          select: {
            id: true,
            uri: true,
          },
        },
      },
    },
  },
};

module.exports = { CreateCustomer, CreateEmployee, SelectUserInfo };
