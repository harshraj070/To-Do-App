import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { showNotification, checkDueTasks } from './utils/notifications';

// Import Bootstrap and React-Toastify CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/tasks`);
      setTasks(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();

    // Set up interval to check for due tasks every minute
    const intervalId = setInterval(async () => {
      const currentTasks = await fetchTasks();
      checkDueTasks(currentTasks);
    }, 60000); // Check every minute

    // Also check immediately when the component mounts
    fetchTasks().then(tasks => checkDueTasks(tasks));

    return () => clearInterval(intervalId); // Clean up on unmount
  }, []);

  return (
    <div className="bg-light min-vh-100 py-5">
      <Container>
        <Row className="justify-content-center mb-4">
          <Col md={8} lg={6}>
            <h1 className="text-center mb-4 fw-bold text-primary">Task Manager</h1>
            <TaskForm fetchTasks={fetchTasks} />
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            {loading ? (
              <div className="text-center p-5">Loading tasks...</div>
            ) : (
              <TaskList tasks={tasks} fetchTasks={fetchTasks} />
            )}
          </Col>
        </Row>
      </Container>
      <ToastContainer />
    </div>
  );
}

export default App;