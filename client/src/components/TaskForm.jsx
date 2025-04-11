import { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { showNotification } from '../utils/notifications';
import axios from 'axios';

const TaskForm = ({ fetchTasks }) => {
    const [title, setTitle] = useState('');
    const [dateTime, setDateTime] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !dateTime) {
            showNotification('error', 'Please fill in all fields');
            return;
        }

        try {
            setIsLoading(true);
            await axios.post(`${import.meta.env.VITE_API_URL}/tasks`, {
                title,
                dateTime: new Date(dateTime).toISOString()
            });

            showNotification('success', 'Task added successfully!');
            setTitle('');
            setDateTime('');
            fetchTasks();
        } catch (error) {
            showNotification('error', 'Failed to add task');
            console.error('Error adding task:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="mb-4 shadow-sm border-0">
            <Card.Body>
                <Card.Title className="mb-3 text-primary">Add New Task</Card.Title>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Task Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter task name"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Date & Time</Form.Label>
                        <Form.Control
                            type="datetime-local"
                            value={dateTime}
                            onChange={(e) => setDateTime(e.target.value)}
                        />
                    </Form.Group>

                    <Button
                        variant="primary"
                        type="submit"
                        className="w-100"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Adding...' : 'Add Task'}
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default TaskForm;