module.exports = {
  purge: { content: ['./public/**/*.html', './src/**/*.vue', './src/**/*.tsx'] },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: {
          lightest: '#fca28a',
          light: '#fb7450',
          main: '#fa4616',
          dark: '#c72d04',
          darkest: '#851e02',
        },
        label: '#808080',
        icon: '#a6a6a6',
        placeholder: '#bfbfbf',
        bg2: '#e5e5e5',
        bg1: '#f5f5f5',
      },
      lineHeight: {
        20: '5rem',
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
    },
  },
  plugins: [],
}
