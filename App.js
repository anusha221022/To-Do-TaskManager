import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [error, setError] = useState('');

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks');
      setTasks(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to fetch tasks. Please check if the backend server is running.');
    }
  };

  // Create a new task
  const createTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    try {
      const response = await axios.post('http://localhost:5000/api/tasks', {
        title,
        description
      });
      setTasks([...tasks, response.data]);
      setTitle('');
      setDescription('');
      setError('');
    } catch (error) {
      console.error('Error creating task:', error);
      setError('Failed to create task. Please try again.');
    }
  };

  // Update a task
  const updateTask = async (id) => {
    if (!editTitle.trim()) return;
    
    try {
      const response = await axios.put(`http://localhost:5000/api/tasks/${id}`, {
        title: editTitle,
        description: editDescription
      });
      setTasks(tasks.map(task => task._id === id ? response.data : task));
      setEditingId(null);
      setEditTitle('');
      setEditDescription('');
      setError('');
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task. Please try again.');
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
      setError('');
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task. Please try again.');
    }
  };

  // Toggle task completion
  const toggleComplete = async (id, completed) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/tasks/${id}`, {
        completed: !completed
      });
      setTasks(tasks.map(task => task._id === id ? response.data : task));
      setError('');
    } catch (error) {
      console.error('Error toggling task completion:', error);
      setError('Failed to update task status. Please try again.');
    }
  };

  // Set task for editing
  const startEditing = (task) => {
    setEditingId(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Todo List App</h1>
        
        {/* Error Message */}
        {error && <div className="error-message">{error}</div>}
        
        {/* Add Task Form */}
        <form onSubmit={createTask} className="task-form">
          <h2>Add New Task</h2>
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Task description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="submit">Add Task</button>
        </form>

        {/* Tasks List */}
        <div className="tasks-list">
          <h2>Tasks ({tasks.length})</h2>
          {tasks.length === 0 ? (
            <p>No tasks yet. Add one above!</p>
          ) : (
            <ul>
              {tasks.map((task) => (
                <li key={task._id} className={task.completed ? 'completed' : ''}>
                  {editingId === task._id ? (
                    // Edit Mode
                    <div className="edit-mode">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        required
                      />
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                      />
                      <div className="edit-actions">
                        <button onClick={() => updateTask(task._id)}>Save</button>
                        <button onClick={cancelEditing}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="view-mode">
                      <div className="task-content">
                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                        <small>Created: {new Date(task.createdAt).toLocaleDateString()}</small>
                      </div>
                      <div className="task-actions">
                        <button 
                          onClick={() => toggleComplete(task._id, task.completed)}
                          className={task.completed ? 'undo-btn' : 'complete-btn'}
                        >
                          {task.completed ? 'Undo' : 'Complete'}
                        </button>
                        <button onClick={() => startEditing(task)}>Edit</button>
                        <button onClick={() => deleteTask(task._id)} className="delete-btn">Delete</button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;