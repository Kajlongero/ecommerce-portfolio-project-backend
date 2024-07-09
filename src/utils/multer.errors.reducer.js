const errorMessages = {
  LIMIT_PART_COUNT: "Too many parts",
  LIMIT_FILE_SIZE: "File too large",
  LIMIT_FILE_COUNT: "Too many files",
  LIMIT_FIELD_KEY: "Field name too long",
  LIMIT_FIELD_VALUE: "Field value too long",
  LIMIT_FIELD_COUNT: "Too many fields",
  LIMIT_UNEXPECTED_FILE: "Unexpected field",
  MISSING_FIELD_NAME: "Field name missing",
};

const MulterErrorsReducer = (err) => {
  switch (err.code) {
    case errorMessages[err.code]: {
      return {
        message: "One or more files exceed the maximum file size",
      };
    }
    case "LIMIT_FILE_COUNT": {
      return {
        message: err.message,
      };
    }
    case "LIMIT_UNEXPECTED_FILE": {
      return {
        message: "You cannot upload more than 12 files at time",
      };
    }

    default:
      return {
        message: "Error uploading the file",
      };
  }
};

module.exports = {
  MulterErrorsReducer,
};
