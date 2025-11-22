// client/src/components/tasks/TaskList.jsx
import React from 'react';
import { Card, Button, Row, Col, Badge } from 'react-bootstrap';

const TaskList = ({ tasks, onEdit, onDelete }) => {
  if (!tasks || tasks.length === 0) return <p>No tasks found</p>;

  return (
    <>
      {tasks.map(task => (
        <Card key={task._id} className="mb-3">
          <Card.Body>
            <Row>
              <Col md={8}>
                <h5>{task.title}</h5>
                {task.description && <p>{task.description}</p>}
                <div className="mb-2">
                  <Badge bg={
                    task.status === 'todo' ? 'secondary' :
                    task.status === 'in-progress' ? 'info' :
                    'success'
                  } className="me-2">{task.status}</Badge>
                  <Badge bg={
                    task.priority === 'low' ? 'success' :
                    task.priority === 'medium' ? 'warning' :
                    'danger'
                  }>{task.priority}</Badge>
                </div>
                {task.dueDate && <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>}
                {task.tags && task.tags.length > 0 && (
                  <p>
                    Tags: {task.tags.map(tag => (
                      <Badge bg="dark" key={tag} className="me-1">{tag}</Badge>
                    ))}
                  </p>
                )}
              </Col>
              <Col md={4} className="text-end">
                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => onEdit(task)}>Edit</Button>
                <Button variant="outline-danger" size="sm" onClick={() => onDelete(task._id)}>Delete</Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}
    </>
  );
};

export default TaskList;
