const IncludeUserData = {
  include: {
    auth: {
      include: {
        role: true,
      },
    },
    profile: true,
  },
};

module.exports = { IncludeUserData };
