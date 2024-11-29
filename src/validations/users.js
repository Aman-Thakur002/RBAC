import { i18n } from "../app.js"; 

// User Registration Validation Schema
export const userValidation = {
  name: {
    exists: {
      errorMessage: (value, { req }) => {
        return i18n.__("uservalidation.firstName");
      }
    },
    isLength: {
      errorMessage: (value, { req }) => {
        return i18n.__("uservalidation.firstNameLength");
      },
      options: { min: 1 },
    },
  },
  email: {
    exists: {
      errorMessage: (value, { req }) => {
        return i18n.__("leadValidation.email.required");
      }
    },
    isEmail: {
      bail: true,
      errorMessage: (value, { req }) => {
        return i18n.__("leadValidation.email.valid");
      }
    },
  },
  password: {
    exists: {
      errorMessage: (value, { req }) => {
        return i18n.__("uservalidation.password.required");
      }
    },
    isLength: {
      errorMessage: (value, { req }) => {
        return i18n.__("uservalidation.password.isValid");
      },
      options: { min: 7 },
    },
  },
  phoneNumber: {
    exists: {
      errorMessage: (value, { req }) => {
        return i18n.__("leadValidation.phone.required");
      }
    },
    isInt: {
      errorMessage: (value, { req }) => {
        return i18n.__("phoneNotformet");
      }
    },
  },
};

// User Login Validation Schema
export const userLoginValidation = {
    email: {
      exists: {
        errorMessage: (value, { req }) => {
          return i18n.__("leadValidation.email.required");
        }
      },
      isEmail: {
        bail: true,
        errorMessage: (value, { req }) => {
          return i18n.__("leadValidation.email.valid");
        }
      },
    },
    password: {
      exists: {
        errorMessage: (value, { req }) => {
          return i18n.__("uservalidation.password.required");
        }
      },
      isLength: {
        errorMessage: (value, { req }) => {
          return i18n.__("uservalidation.password.isValid");
        },
        options: { min: 6 },
      },
    },
  };
  
