import { Container, Typography, Box } from '@mui/material';

const Questions = () => {
  return (
    <Container maxWidth="lg" sx={{ paddingY: 4 }}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Questions
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage questions here. More content coming soon!
        </Typography>
      </Box>
    </Container>
  );
};

export default Questions;
