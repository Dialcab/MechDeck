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
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import api from '../services/api';

const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD'];

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [fetchError, setFetchError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editQuestion, setEditQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const [questionText, setQuestionText] = useState('');
  const [difficulty, setDifficulty] = useState('EASY');
  const [explanation, setExplanation] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [topicId, setTopicId] = useState('');
  const [createdById, setCreatedById] = useState('');
  const [choices, setChoices] = useState([
    { choiceText: '', correct: false },
    { choiceText: '', correct: false },
  ]);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchQuestions();
    fetchSubjects();
    fetchTopics();
  }, []);

  const normalizeResponse = (data) => {
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.questions)) return data.questions;
    if (data && Array.isArray(data.data)) return data.data;
    return [];
  };

  const fetchQuestions = async () => {
    setFetchError('');
    try {
      const res = await api.get('/api/questions');
      setQuestions(normalizeResponse(res.data));
    } catch (err) {
      setFetchError(err?.response?.data?.message || err.message || 'Failed to load questions');
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await api.get('/api/subjects');
      const normalized = normalizeResponse(res.data);
      setSubjects(normalized);
    } catch (err) {
      console.warn('Failed to load subjects:', err?.message);
    }
  };

  const fetchTopics = async () => {
    try {
      const res = await api.get('/api/topics');
      const normalized = normalizeResponse(res.data);
      setTopics(normalized);
    } catch (err) {
      console.warn('Failed to load topics:', err?.message);
    }
  };

  const getSubjectDescription = (subjectId) => {
    if (!subjectId) return 'None';
    const subject = subjects.find(s => (s.id || s._id) === subjectId);
    return subject ? subject.name : 'Unknown';
  };

  const getTopicName = (topicId) => {
    if (!topicId) return 'None';
    const topic = topics.find(t => (t.id || t._id) === topicId);
    return topic ? topic.name : 'Unknown';
  };

  const resetForm = () => {
    setQuestionText('');
    setDifficulty('EASY');
    setExplanation('');
    setSubjectId('');
    setTopicId('');
    setCreatedById('');
    setChoices([
      { choiceText: '', correct: false },
      { choiceText: '', correct: false },
    ]);
    setError('');
    setSuccess('');
  };

  const buildQuestionPayload = ({ questionText, difficulty, explanation, subjectId, topicId, createdById, choices }) => ({
    questionText: questionText.trim(),
    difficulty,
    explanation: explanation.trim(),
    subjectId: subjectId.trim() || null,
    topicId: topicId.trim() || null,
    createdById: createdById.trim() || null,
    choices: choices
      .filter((choice) => choice.choiceText.trim())
      .map((choice) => ({
        choiceText: choice.choiceText.trim(),
        correct: !!choice.correct,
      })),
  });

  const validateQuestionPayload = ({ questionText, choices }) => {
    if (!questionText.trim()) {
      return 'Please enter the question text';
    }
    const filledChoices = choices.filter((choice) => choice.choiceText.trim());
    if (filledChoices.length < 2) {
      return 'Please add at least two answer choices';
    }
    if (!filledChoices.some((choice) => choice.correct)) {
      return 'Please mark at least one correct choice';
    }
    return '';
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const payload = buildQuestionPayload({ questionText, difficulty, explanation, subjectId, topicId, createdById, choices });
    const validation = validateQuestionPayload({ questionText, choices });
    if (validation) {
      setError(validation);
      return;
    }

    try {
      setLoading(true);
      await api.post('/api/questions', payload);
      setSuccess('Question created successfully');
      resetForm();
      setCreateOpen(false);
      fetchQuestions();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to create question');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this question?')) return;
    try {
      await api.delete(`/api/questions/${id}`);
      setSuccess('Question deleted');
      fetchQuestions();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to delete question');
    }
  };

  const openEdit = (question) => {
    setEditQuestion({
      id: question.id || question._id,
      questionText: question.questionText || question.title || '',
      difficulty: question.difficulty || 'EASY',
      explanation: question.explanation || question.description || '',
      subjectId: question.subjectId || '',
      topicId: question.topicId || '',
      createdById: question.createdById || '',
      choices: Array.isArray(question.choices)
        ? question.choices.map((choice) => ({
            choiceText: choice.choiceText || '',
            correct: !!choice.correct,
          }))
        : [{ choiceText: '', correct: false }, { choiceText: '', correct: false }],
    });
    setEditOpen(true);
  };

  const handleEditSave = async () => {
    if (!editQuestion) return;

    setError('');
    setEditLoading(true);

    const validation = validateQuestionPayload({ questionText: editQuestion.questionText, choices: editQuestion.choices || [] });
    if (validation) {
      setError(validation);
      setEditLoading(false);
      return;
    }

    const payload = buildQuestionPayload(editQuestion);

    try {
      await api.put(`/api/questions/${editQuestion.id}`, payload);
      setSuccess('Question updated');
      setEditOpen(false);
      fetchQuestions();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to update question');
    } finally {
      setEditLoading(false);
    }
  };

  const setChoiceValue = (index, field, value, useEdit = false) => {
    if (useEdit) {
      const newChoices = [...(editQuestion.choices || [])];
      newChoices[index] = { ...newChoices[index], [field]: value };
      setEditQuestion({ ...editQuestion, choices: newChoices });
      return;
    }

    const newChoices = [...choices];
    newChoices[index] = { ...newChoices[index], [field]: value };
    setChoices(newChoices);
  };

  const addChoice = (useEdit = false) => {
    const newChoice = { choiceText: '', correct: false };
    if (useEdit) {
      setEditQuestion({ ...editQuestion, choices: [...(editQuestion.choices || []), newChoice] });
    } else {
      setChoices([...choices, newChoice]);
    }
  };

  const removeChoice = (index, useEdit = false) => {
    if (useEdit) {
      setEditQuestion({
        ...editQuestion,
        choices: (editQuestion.choices || []).filter((_, i) => i !== index),
      });
      return;
    }

    setChoices(choices.filter((_, i) => i !== index));
  };

  const filteredQuestions = questions.filter((question) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return [
      question.questionText,
      question.explanation,
      question.difficulty,
      question.subjectId,
      question.topicId,
    ]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(q));
  });

  const paginatedQuestions = filteredQuestions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Container maxWidth={false} sx={{ paddingY: 4, px: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Questions
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
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h6">Question Bank</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => { resetForm(); setCreateOpen(true); }}>
            Add Question
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
              placeholder="Search questions by text, difficulty, subject or topic"
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
                <TableCell>Question</TableCell>
                <TableCell>Difficulty</TableCell>
                <TableCell>Explanation</TableCell>
                <TableCell>Subject / Topic</TableCell>
                <TableCell>Choices</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedQuestions.map((question) => (
                <TableRow key={question.id || question._id}>
                  <TableCell>{question.questionText}</TableCell>
                  <TableCell>{question.difficulty || 'N/A'}</TableCell>
                  <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}>{question.explanation || '—'}</TableCell>
                  <TableCell sx={{ maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {getSubjectDescription(question.subjectId)} / {getTopicName(question.topicId)}
                  </TableCell>
                  <TableCell>{Array.isArray(question.choices) ? question.choices.length : 0}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => openEdit(question)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(question.id || question._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filteredQuestions.length}
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

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Question</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleCreate} sx={{ pt: 2 }}>
            <TextField
              label="Question Text"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              fullWidth
              margin="normal"
              required
            />

            <TextField
              label="Explanation"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              fullWidth
              margin="normal"
              multiline
              rows={2}
            />

            <TextField
              select
              label="Difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              fullWidth
              margin="normal"
            >
              {DIFFICULTIES.map((level) => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Subject"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              fullWidth
              margin="normal"
            >
              <MenuItem value="">— None —</MenuItem>
              {subjects.map((subject) => (
                <MenuItem key={subject.id || subject._id} value={subject.id || subject._id}>
                  {subject.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Topic"
              value={topicId}
              onChange={(e) => setTopicId(e.target.value)}
              fullWidth
              margin="normal"
            >
              <MenuItem value="">— None —</MenuItem>
              {topics.map((topic) => (
                <MenuItem key={topic.id || topic._id} value={topic.id || topic._id}>
                  {topic.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Created By ID"
              value={createdById}
              onChange={(e) => setCreatedById(e.target.value)}
              fullWidth
              margin="normal"
            />

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Choices
              </Typography>
              {choices.map((choice, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <TextField
                    label={`Choice ${index + 1}`}
                    value={choice.choiceText}
                    onChange={(e) => setChoiceValue(index, 'choiceText', e.target.value)}
                    fullWidth
                    size="small"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={choice.correct}
                        onChange={(e) => setChoiceValue(index, 'correct', e.target.checked)}
                      />
                    }
                    label="Correct"
                  />
                  {choices.length > 2 && (
                    <Button color="error" size="small" onClick={() => removeChoice(index)}>
                      Remove
                    </Button>
                  )}
                </Box>
              ))}
              <Button onClick={() => addChoice()} size="small" sx={{ mt: 1 }}>
                Add Choice
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button type="submit" onClick={handleCreate} variant="contained" disabled={loading}>
            Create Question
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Question</DialogTitle>
        <DialogContent>
          <TextField
            label="Question Text"
            value={editQuestion?.questionText || ''}
            onChange={(e) => setEditQuestion({ ...editQuestion, questionText: e.target.value })}
            fullWidth
            margin="normal"
            required
          />

          <TextField
            label="Explanation"
            value={editQuestion?.explanation || ''}
            onChange={(e) => setEditQuestion({ ...editQuestion, explanation: e.target.value })}
            fullWidth
            margin="normal"
            multiline
            rows={2}
          />

          <TextField
            select
            label="Difficulty"
            value={editQuestion?.difficulty || 'EASY'}
            onChange={(e) => setEditQuestion({ ...editQuestion, difficulty: e.target.value })}
            fullWidth
            margin="normal"
          >
            {DIFFICULTIES.map((level) => (
              <MenuItem key={level} value={level}>
                {level}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Subject"
            value={editQuestion?.subjectId || ''}
            onChange={(e) => setEditQuestion({ ...editQuestion, subjectId: e.target.value })}
            fullWidth
            margin="normal"
          >
            <MenuItem value="">— None —</MenuItem>
            {subjects.map((subject) => (
              <MenuItem key={subject.id || subject._id} value={subject.id || subject._id}>
                {subject.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Topic"
            value={editQuestion?.topicId || ''}
            onChange={(e) => setEditQuestion({ ...editQuestion, topicId: e.target.value })}
            fullWidth
            margin="normal"
          >
            <MenuItem value="">— None —</MenuItem>
            {topics.map((topic) => (
              <MenuItem key={topic.id || topic._id} value={topic.id || topic._id}>
                {topic.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Created By ID"
            value={editQuestion?.createdById || ''}
            onChange={(e) => setEditQuestion({ ...editQuestion, createdById: e.target.value })}
            fullWidth
            margin="normal"
          />

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Choices
            </Typography>
            {(editQuestion?.choices || []).map((choice, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <TextField
                  label={`Choice ${index + 1}`}
                  value={choice.choiceText || ''}
                  onChange={(e) => setChoiceValue(index, 'choiceText', e.target.value, true)}
                  fullWidth
                  size="small"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={choice.correct || false}
                      onChange={(e) => setChoiceValue(index, 'correct', e.target.checked, true)}
                    />
                  }
                  label="Correct"
                />
                {(editQuestion.choices || []).length > 2 && (
                  <Button color="error" size="small" onClick={() => removeChoice(index, true)}>
                    Remove
                  </Button>
                )}
              </Box>
            ))}
            <Button onClick={() => addChoice(true)} size="small" sx={{ mt: 1 }}>
              Add Choice
            </Button>
          </Box>
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

export default Questions;
