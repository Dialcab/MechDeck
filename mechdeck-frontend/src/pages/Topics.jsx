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
import AddIcon from '@mui/icons-material/Add';
import api from '../services/api';

const Topics = () => {
  const [topics, setTopics] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [fetchError, setFetchError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editTopic, setEditTopic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const [name, setName] = useState('');
  const [weight, setWeight] = useState(1);
  const [subjectId, setSubjectId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchTopics();
    fetchSubjects();
  }, []);

  const normalizeResponse = (data) => {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.topics)) return data.topics;
    if (data && Array.isArray(data.data)) return data.data;
    return [];
  };

  const fetchTopics = async () => {
    setFetchError('');
    try {
      const res = await api.get('/api/topics/all');
      const normalized = normalizeResponse(res.data);
      console.log('Topics API response:', res.data);
      console.log('Normalized topics:', normalized);
      setTopics(normalized);
    } catch (err) {
      console.error('Error fetching topics:', err);
      const status = err?.response?.status;
      if (status === 401) {
        setFetchError('Authentication required. Please log in again.');
      } else if (status === 403) {
        setFetchError('Access denied. Admin privileges required.');
      } else {
        setFetchError(err?.response?.data?.message || err.message || 'Failed to load topics');
      }
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await api.get('/api/subjects/all');
      const normalized = normalizeResponse(res.data);
      setSubjects(normalized);
    } catch (err) {
      console.warn('Failed to load subjects:', err?.message);
    }
  };

  const resetForm = () => {
    setName('');
    setWeight(1);
    setSubjectId('');
    setError('');
    setSuccess('');
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Please enter a topic name');
      return;
    }

    if (!subjectId) {
      setError('Please select a subject');
      return;
    }

    try {
      setLoading(true);
      await api.post('/api/topics', {
        name: name.trim(),
        weight: parseInt(weight),
        subjectId,
      });
      setSuccess('Topic created successfully');
      resetForm();
      setCreateOpen(false);
      fetchTopics();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to create topic');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this topic? This may affect related questions.')) return;
    try {
      await api.delete(`/api/topics/${id}`);
      setSuccess('Topic deleted');
      fetchTopics();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to delete topic');
    }
  };

  const openEdit = (topic) => {
    setEditTopic({ ...topic });
    setEditOpen(true);
  };

  const handleEditSave = async () => {
    if (!editTopic) return;
    setError('');
    setEditLoading(true);

    if (!editTopic.name?.trim()) {
      setError('Please enter a topic name');
      setEditLoading(false);
      return;
    }

    if (!editTopic.subjectId) {
      setError('Please select a subject');
      setEditLoading(false);
      return;
    }

    try {
      await api.put(`/api/topics/${editTopic.id}`, {
        name: editTopic.name.trim(),
        weight: parseInt(editTopic.weight),
        subjectId: editTopic.subjectId,
      });
      setEditOpen(false);
      setSuccess('Topic updated');
      fetchTopics();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to update topic');
    } finally {
      setEditLoading(false);
    }
  };

  const getSubjectName = (subjectId) => {
    const subject = subjects.find(s => (s.id || s._id) === subjectId);
    return subject ? subject.code : 'Unknown';
  };

  const filteredTopics = topics.filter((topic) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      (topic.name || '').toLowerCase().includes(q) ||
      getSubjectName(topic.subjectId).toLowerCase().includes(q)
    );
  });

  const paginatedTopics = filteredTopics.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Container maxWidth={false} sx={{ paddingY: 4, px: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Topics
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
            Topic Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              resetForm();
              setCreateOpen(true);
            }}
          >
            Add Topic
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
              placeholder="Search topics by name or subject"
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
                <TableCell>Subject</TableCell>
                <TableCell>Weight</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedTopics.map((topic) => (
                <TableRow key={topic.id || topic._id}>
                  <TableCell>{topic.name}</TableCell>
                  <TableCell>{getSubjectName(topic.subjectId)}</TableCell>
                  <TableCell>{topic.weight}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => openEdit(topic)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(topic.id || topic._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filteredTopics.length}
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

      {/* Create Topic Dialog */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Topic</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleCreate} sx={{ pt: 2 }}>
            <TextField
              label="Topic Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              margin="normal"
              required
              placeholder="e.g., Algebra Basics"
            />

            <TextField
              label="Weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              fullWidth
              margin="normal"
              required
              inputProps={{ min: 1 }}
              helperText="Importance weight for this topic"
            />

            <TextField
              select
              label="Subject"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              fullWidth
              margin="normal"
              required
            >
              {subjects.map((subject) => (
                <MenuItem key={subject.id || subject._id} value={subject.id || subject._id}>
                  {subject.code} - {subject.description}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button type="submit" onClick={handleCreate} variant="contained" disabled={loading}>
            Create Topic
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Topic Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Topic</DialogTitle>
        <DialogContent>
          <TextField
            label="Topic Name"
            value={editTopic?.name || ''}
            onChange={(e) => setEditTopic({ ...editTopic, name: e.target.value })}
            fullWidth
            margin="normal"
            required
          />

          <TextField
            label="Weight"
            type="number"
            value={editTopic?.weight || 1}
            onChange={(e) => setEditTopic({ ...editTopic, weight: e.target.value })}
            fullWidth
            margin="normal"
            required
            inputProps={{ min: 1 }}
          />

          <TextField
            select
            label="Subject"
            value={editTopic?.subjectId || ''}
            onChange={(e) => setEditTopic({ ...editTopic, subjectId: e.target.value })}
            fullWidth
            margin="normal"
            required
          >
            {subjects.map((subject) => (
              <MenuItem key={subject.id || subject._id} value={subject.id || subject._id}>
                {subject.code} - {subject.description}
              </MenuItem>
            ))}
          </TextField>
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

export default Topics;