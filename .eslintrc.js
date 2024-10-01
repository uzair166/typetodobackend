module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:@typescript-eslint/recommended",
    "prettier", // Disables ESLint rules that might conflict with Prettier
  ],
  plugins: ["@typescript-eslint", "prettier"],
  rules: {
    // Custom rules
    "prettier/prettier": "error",
  },
};
