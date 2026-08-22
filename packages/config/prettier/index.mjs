/** Shared Prettier config for the monorepo. */
const config = {
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 90,
  tabWidth: 2,
  plugins: ['prettier-plugin-tailwindcss'],
};

export default config;
