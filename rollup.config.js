import { rollupReactConfig } from '@tarsilla/rollup-config/react';

export default rollupReactConfig({
  paths: {
    '@types': ['./src/types/index.ts'],
  },
});
