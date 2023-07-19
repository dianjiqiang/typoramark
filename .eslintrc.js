module.exports = {
  // ...
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "./.eslintrc-auto-import.json",
  ],
  rules: {
    "no-undef": 0,
    "vue/multi-word-component-names": 0
  },
};
