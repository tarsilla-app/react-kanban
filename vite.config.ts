export default {
  plugins: [
    {
      name: 'fix-storybook-virtual-modules',
      resolveId: (id: string): string | null => {
        if (id.startsWith('\0')) {
          return id.replace('\0', '');
        }
        return null;
      },
    },
  ],
};
