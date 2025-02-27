import { eslintReactConfig } from '@tarsilla/eslint-config';

const config = eslintReactConfig({
  ignores: ['**/.vscode/', '**/node_modules/', '**/lib/', '**/.storybook/', '**/storybook-static/'],
});

export default config;
