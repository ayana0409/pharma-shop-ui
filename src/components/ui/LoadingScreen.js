import { CircularProgress, Box } from '@mui/material';

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu nền tối
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 9999
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default LoadingScreen;