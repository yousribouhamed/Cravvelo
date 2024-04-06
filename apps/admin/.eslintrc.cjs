/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: [require.resolve("eslint-config-custom")],
  parserOptions: {
    project: `${__dirname}/tsconfig.json`,
  },
};
