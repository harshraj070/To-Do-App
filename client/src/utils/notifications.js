import { toast } from 'react-toastify';

export const showNotification = (type, message) => {
  const options = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  switch (type) {
    case 'success':
      toast.success(message, options);
      break;
    case 'error':
      toast.error(message, options);
      break;
    case 'info':
      toast.info(message, options);
      break;
    case 'warning':
      toast.warning(message, options);
      break;
    default:
      toast(message, options);
  }
};

// New function to check for due tasks
export const checkDueTasks = (tasks) => {
  if (!tasks || tasks.length === 0) return;

  const now = new Date();
  
  tasks.forEach(task => {
    if (task.completed) return; // Skip completed tasks
    
    const taskTime = new Date(task.dateTime);
    
    // Check if the task is due within the last minute
    const timeDiff = Math.abs(now - taskTime);
    if (timeDiff <= 60000) { // 60000 ms = 1 minute
      showNotification('warning', `Task due now: ${task.title}`);
    }
  });
};