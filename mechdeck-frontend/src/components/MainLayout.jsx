import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getRole, logout } from '../services/auth';

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const role = getRole();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => navigate('/dashboard')}
          >
            MechDeck Control Panel
          </Typography>

          {(role === 'ADMIN' || role === 'TEACHER') && (
            <Button color="inherit" onClick={() => navigate('/dashboard')}>
              Dashboard
            </Button>
          )}

          {(role === 'ADMIN' || role === 'TEACHER') && (
            <Button color="inherit" onClick={() => navigate('/questions')}>
              Questions
            </Button>
          )}

          {role === 'ADMIN' && (
            <Button color="inherit" onClick={() => navigate('/users')}>
              Users
            </Button>
          )}

          {role === 'ADMIN' && (
            <Button color="inherit" onClick={() => navigate('/subjects')}>
              Subjects
            </Button>
          )}

          {role === 'ADMIN' && (
            <Button color="inherit" onClick={() => navigate('/topics')}>
              Topics
            </Button>
          )}

          <Typography variant="body2" sx={{ mx: 2 }}>
            {role || ''}
          </Typography>

          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ mt: 2 }}>{children}</Box>
    </>
  );
};

export default MainLayout;
