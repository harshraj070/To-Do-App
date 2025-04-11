import { Card, ListGroup, Button } from 'react-bootstrap';
import { FaTrash, FaCheck } from 'react-icons/fa';
import { showNotification } from '../utils/notifications';
import axios from 'axios';

const TaskList = ({ tasks, fetchTasks }) => {
    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    const handleComplete = async (id, completed) => {
        try {
            await axios.patch(`${import.meta.env.VITE_API_URL}/tasks/${id}`, {
                completed: !completed
            });

            showNotification('success', completed ? 'Task marked as incomplete' : 'Task completed!');
            fetchTasks();
        } catch (error) {
            showNotification('error', 'Failed to update task');
            console.error('Error updating task:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/tasks/${id}`);

            showNotification('info', 'Task deleted successfully');
            fetchTasks();
        } catch (error) {
            showNotification('error', 'Failed to delete task');
            console.error('Error deleting task:', error);
        }
    };

    return (
        <Card className="shadow-sm border-0">
            <Card.Body>
                <Card.Title className="mb-3 text-primary">Your Tasks</Card.Title>
                {tasks.length === 0 ? (
                    <div className="text-center p-4 text-muted">
                        No tasks yet. Add a new task to get started!
                    </div>
                ) : (
                    <ListGroup variant="flush">
                        {tasks.map((task) => (
                            <ListGroup.Item key={task._id} className="d-flex justify-content-between align-items-center">
                                <div className={task.completed ? 'text-decoration-line-through text-muted' : ''}>
                                    <div className="fw-bold">{task.title}</div>
                                    <small className="text-muted">{formatDateTime(task.dateTime)}</small>
                                </div>
                                <div className="d-flex gap-2">
                                    <Button
                                        variant={task.completed ? "outline-success" : "success"}
                                        size="sm"
                                        onClick={() => handleComplete(task._id, task.completed)}
                                    >
                                        <FaCheck />
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDelete(task._id)}
                                    >
                                        <FaTrash />
                                    </Button>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Card.Body>
        </Card>
    );
};

export default TaskList;