import { createTheme } from '@mui/material';

// Extend the BreakpointOverrides to include 'menu'
declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: true;
    menu: true; // add custom breakpoint
  }
}

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
      // Custom breakpoint for menu items
      menu: 670,
    },
  },
});

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#FF6F61', // Coral
//     },
//     secondary: {
//       main: '#6B5B95', // Purple
//     },
//     background: {
//       default: '#F7CAC9', // Light Pink
//       paper: '#FFFFFF', // White
//     },
//     text: {
//       primary: '#2E2E2E', // Dark Gray
//       secondary: '#6B5B95', // Purple
//     },
//   },
//   typography: {
//     fontFamily: 'Arial, sans-serif',
//   },
// });

export default theme;
