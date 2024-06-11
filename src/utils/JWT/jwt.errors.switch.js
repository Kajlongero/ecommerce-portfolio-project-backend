const ErrorSwitch = (err) => {
  switch (err.name) {
    case "TokenExpiredError": {
      return {
        message: "Token expired",
      };
    }

    case "JsonWebTokenError": {
      return {
        message: "Unauthorized",
      };
    }

    case "NotBeforeError": {
      return {
        message: `Token cannot be used yet until ${err.date}`,
      };
    }

    default: {
      return {
        message: "Unauthorized",
      };
    }
  }
};

module.exports = ErrorSwitch;
