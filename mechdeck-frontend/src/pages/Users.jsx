import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../services/api';

const Users = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('TEACHER');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState([]);
  const [fetchError, setFetchError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [editOpen, setEditOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setFetchError('');
    try {
      const res = await api.get('/api/users');
      // normalize response: backend may return array or { users: [...] }
      if (Array.isArray(res.data)) {
        setUsers(res.data);
      } else if (res.data && Array.isArray(res.data.users)) {
        setUsers(res.data.users);
      } else if (res.data && Array.isArray(res.data.data)) {
        setUsers(res.data.data);
      } else {
        setUsers([]);
      }
    } catch (err) {
      setFetchError(err?.response?.data?.message || err.message || 'Failed to load users');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      // Call the backend register endpoint but do NOT replace current admin token
      const res = await api.post('/api/auth/register', { name, email, password, role });
      if (res?.data?.token) {
        setSuccess('User created successfully');
        setName('');
        setEmail('');
        setPassword('');
        setRole('TEACHER');
        fetchUsers();
      } else {
        setError('Unexpected response from server');
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      await api.delete(`/api/users/${id}`);
      setSuccess('User deleted');
      fetchUsers();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to delete user');
    }
  };

  const openEdit = (user) => {
    setEditUser({ ...user });
    setEditOpen(true);
  };

  const handleEditSave = async () => {
    if (!editUser) return;
    setEditLoading(true);
    setError('');
    try {
      await api.put(`/api/users/${editUser.id}`, {
        name: editUser.name,
        email: editUser.email,
        role: editUser.role,
      });
      setEditOpen(false);
      setSuccess('User updated');
      fetchUsers();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to update user');
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <Container maxWidth={false} sx={{ paddingY: 4, px: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Users
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ marginBottom: 2 }}>
          {success}
        </Alert>
      )}

      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">
            Existing Users
          </Typography>
          <Button variant="contained" onClick={() => setCreateOpen(true)}>
            Add User
          </Button>
        </Box>

        {fetchError && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {fetchError}
          </Alert>
        )}

        <TableContainer component={Paper}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
            <TextField
              placeholder="Search users by name, email or role"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              size="small"
              sx={{ width: '100%', maxWidth: 720 }}
            />
          </Box>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(() => {
                const list = Array.isArray(users) ? users : [];
                const q = search.trim().toLowerCase();
                const filtered = list.filter((u) => {
                  if (!q) return true;
                  return (
                    (u.name || '').toLowerCase().includes(q) ||
                    (u.email || '').toLowerCase().includes(q) ||
                    (u.role || '').toLowerCase().includes(q)
                  );
                });

                const start = page * rowsPerPage;
                const paginated = filtered.slice(start, start + rowsPerPage);

                return paginated.map((u) => (
                  <TableRow key={u.id || u._id || u.email}>
                    <TableCell>{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.role}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => openEdit(u)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(u.id || u._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ));
              })()}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={(() => {
              const list = Array.isArray(users) ? users : [];
              const q = search.trim().toLowerCase();
              return list.filter((u) => {
                if (!q) return true;
                return (
                  (u.name || '').toLowerCase().includes(q) ||
                  (u.email || '').toLowerCase().includes(q) ||
                  (u.role || '').toLowerCase().includes(q)
                );
              }).length;
            })()}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </TableContainer>
      </Box>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={editUser?.name || ''}
            onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Email"
            type="email"
            value={editUser?.email || ''}
            onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Role"
            value={editUser?.role || ''}
            onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
            fullWidth
            margin="normal"
            helperText="Use ADMIN, TEACHER, or STUDENT"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave} disabled={editLoading} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)}>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleCreate} sx={{ pt: 2 }}>
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              margin="normal"
            />

            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
            />

            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
            />

            <TextField
              select
              label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              fullWidth
              margin="normal"
              helperText="Select role for the new user"
            >
              <MenuItem value="ADMIN">ADMIN</MenuItem>
              <MenuItem value="TEACHER">TEACHER</MenuItem>
              <MenuItem value="STUDENT">STUDENT</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button type="submit" onClick={handleCreate} variant="contained" disabled={loading}>
            Create User
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Users;
