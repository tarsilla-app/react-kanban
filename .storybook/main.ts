import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-onboarding',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal(config) {
    config.plugins = config.plugins || [];
    config.plugins.push({
      name: 'strip-null-byte',
      resolveId(source) {
        // Only process Storybook virtual modules starting with a null byte
        if (source.startsWith('\0') && source.includes('@storybook/builder-vite')) {
          return source.replace('\0', '');
        }
        return null; // Let Vite handle other modules
      },
    });
    return config;
  },
};
export default config;
