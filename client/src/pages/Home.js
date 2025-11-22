import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner, Modal } from 'react-bootstrap';
import api from '../api';
import TaskForm from '../components/tasks/TaskForm';
import TaskList from '../components/tasks/TaskList';

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [filters, setFilters] = useState({ status: '', priority: '' });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);

      const res = await api.get(`/api/tasks?${params}`);
      setTasks(res.data.data);
    } catch (err) {
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, [filters]);

  const handleCreateTask = async (taskData) => {
    try {
      await api.post('/api/tasks', taskData);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
      throw err; // allow TaskForm to stop loading
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      await api.put(`/api/tasks/${taskId}`, taskData);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task');
      throw err;
    }
  };

  const handleDeleteTask = (taskId) => {
    setTaskToDelete(taskId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/api/tasks/${taskToDelete}`);
      setShowDeleteModal(false);
      fetchTasks();
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTaskToDelete(null);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleFilterChange = (type, value) => {
    setFilters(prev => ({ ...prev, [type]: value }));
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>My Tasks</h1>
            <Button onClick={() => setShowForm(true)}>Add New Task</Button>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          {/* Filters */}
          <Card className="mb-4">
            <Card.Body>
              <Row>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      value={filters.status}
                      onChange={e => handleFilterChange('status', e.target.value)}
                    >
                      <option value="">All Status</option>
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Priority</Form.Label>
                    <Form.Select
                      value={filters.priority}
                      onChange={e => handleFilterChange('priority', e.target.value)}
                    >
                      <option value="">All Priority</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4} className="d-flex align-items-end">
                  <Button variant="outline-secondary" onClick={() => setFilters({ status: '', priority: '' })}>
                    Clear Filters
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <TaskList tasks={tasks} onEdit={handleEditTask} onDelete={handleDeleteTask} />

          {/* TaskForm Modal */}
          <TaskForm
            show={showForm}
            task={editingTask}
            onSubmit={editingTask ? (data) => handleUpdateTask(editingTask._id, data) : handleCreateTask}
            onClose={() => { setShowForm(false); setEditingTask(null); }}
          />

          {/* Delete Modal */}
          <Modal show={showDeleteModal} onHide={cancelDelete} centered>
            <Modal.Header closeButton>
              <Modal.Title>Confirm Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete this task?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={cancelDelete}>Cancel</Button>
              <Button variant="danger" onClick={confirmDelete}>Delete</Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
