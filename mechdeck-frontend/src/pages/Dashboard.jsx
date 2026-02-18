import { Container, Typography, Box } from '@mui/material';

const Dashboard = () => {
  return (
    <Container maxWidth="lg" sx={{ paddingY: 4 }}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome to the MechDeck Admin Panel. More content coming soon!
        </Typography>
      </Box>
    </Container>
  );
};

export default Dashboard;
