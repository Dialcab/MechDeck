import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
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
import AddIcon from '@mui/icons-material/Add';
import api from '../services/api';

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [fetchError, setFetchError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editSubject, setEditSubject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSubjects();
  }, []);

  const normalizeResponse = (data) => {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.subjects)) return data.subjects;
    if (data && Array.isArray(data.data)) return data.data;
    return [];
  };

  const fetchSubjects = async () => {
    setFetchError('');
    try {
      const res = await api.get('/api/subjects');
      setSubjects(normalizeResponse(res.data));
    } catch (err) {
      setFetchError(err?.response?.data?.message || err.message || 'Failed to load subjects');
    }
  };

  const resetForm = () => {
    setCode('');
    setDescription('');
    setError('');
    setSuccess('');
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!code.trim()) {
      setError('Please enter a subject code');
      return;
    }

    if (!description.trim()) {
      setError('Please enter a subject description');
      return;
    }

    try {
      setLoading(true);
      await api.post('/api/subjects', {
        code: code.trim(),
        description: description.trim(),
      });
      setSuccess('Subject created successfully');
      resetForm();
      setCreateOpen(false);
      fetchSubjects();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to create subject');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this subject? This may affect related topics and questions.')) return;
    try {
      await api.delete(`/api/subjects/${id}`);
      setSuccess('Subject deleted');
      fetchSubjects();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to delete subject');
    }
  };

  const openEdit = (subject) => {
    setEditSubject({ ...subject });
    setEditOpen(true);
  };

  const handleEditSave = async () => {
    if (!editSubject) return;
    setError('');
    setEditLoading(true);

    if (!editSubject.code?.trim()) {
      setError('Please enter a subject code');
      setEditLoading(false);
      return;
    }

    if (!editSubject.description?.trim()) {
      setError('Please enter a subject description');
      setEditLoading(false);
      return;
    }

    try {
      await api.put(`/api/subjects/${editSubject.id}`, {
        code: editSubject.code.trim(),
        description: editSubject.description.trim(),
      });
      setEditOpen(false);
      setSuccess('Subject updated');
      fetchSubjects();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to update subject');
    } finally {
      setEditLoading(false);
    }
  };

  const filteredSubjects = subjects.filter((subject) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      (subject.code || '').toLowerCase().includes(q) ||
      (subject.description || '').toLowerCase().includes(q)
    );
  });

  const paginatedSubjects = filteredSubjects.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Container maxWidth={false} sx={{ paddingY: 4, px: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Subjects
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
            Subject Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              resetForm();
              setCreateOpen(true);
            }}
          >
            Add Subject
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
              placeholder="Search subjects by code or description"
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
                <TableCell>Code</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedSubjects.map((subject) => (
                <TableRow key={subject.id || subject._id}>
                  <TableCell>{subject.code}</TableCell>
                  <TableCell>{subject.description}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => openEdit(subject)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(subject.id || subject._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filteredSubjects.length}
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

      {/* Create Subject Dialog */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Subject</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleCreate} sx={{ pt: 2 }}>
            <TextField
              label="Subject Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              fullWidth
              margin="normal"
              required
              placeholder="e.g., MATH101"
            />

            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              margin="normal"
              required
              multiline
              rows={2}
              placeholder="e.g., Introduction to Mathematics"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button type="submit" onClick={handleCreate} variant="contained" disabled={loading}>
            Create Subject
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Subject Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Subject</DialogTitle>
        <DialogContent>
          <TextField
            label="Subject Code"
            value={editSubject?.code || ''}
            onChange={(e) => setEditSubject({ ...editSubject, code: e.target.value })}
            fullWidth
            margin="normal"
            required
          />

          <TextField
            label="Description"
            value={editSubject?.description || ''}
            onChange={(e) => setEditSubject({ ...editSubject, description: e.target.value })}
            fullWidth
            margin="normal"
            required
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained" disabled={editLoading}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Subjects;