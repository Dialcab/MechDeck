import { useState } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Alert,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin } from '../services/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      const { token, role } = await apiLogin(email, password);
      if (!token) {
        setError('Login failed: invalid credentials');
        return;
      }
      // navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Login failed');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
          {/* Logo / Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 3,
              gap: 1,
            }}
          >
            <LockIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 'bold',
                color: 'primary.main',
              }}
            >
              MechDeck
            </Typography>
          </Box>

          <Typography
            variant="h5"
            component="h2"
            sx={{
              textAlign: 'center',
              marginBottom: 1,
              fontWeight: 'bold',
            }}
          >
            Admin Login
          </Typography>

          <Typography
            variant="body2"
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              marginBottom: 3,
            }}
          >
            Enter your credentials to access the admin panel
          </Typography>

          {/* Error Message */}
          {error && (
            <Alert severity="error" sx={{ marginBottom: 2 }}>
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <Box component="form" onSubmit={handleLogin} noValidate>
            <TextField
              fullWidth
              id="email"
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              variant="outlined"
              placeholder="admin@example.com"
              autoComplete="email"
              autoFocus
            />

            <TextField
              fullWidth
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              variant="outlined"
              placeholder="••••••••"
              autoComplete="current-password"
            />

            <Button
              fullWidth
              variant="contained"
              sx={{
                marginTop: 3,
                marginBottom: 2,
                padding: '10px',
                fontSize: '1rem',
                textTransform: 'none',
              }}
              onClick={handleLogin}
            >
              Sign In
            </Button>
          </Box>

          {/* Footer Text */}
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              textAlign: 'center',
              color: 'text.secondary',
              marginTop: 2,
            }}
          >
            © 2026 MechDeck Admin Panel. All rights reserved.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
