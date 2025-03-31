const client=require('../config/db')

const addTask = async (taskDescription) => {
    try {
      const res = await client.query('INSERT INTO tasks (task) VALUES ($1) RETURNING *', [taskDescription]);
      return res.rows[0];
    } catch (err) {
      console.error('Error adding task:', err);
      throw err;
    }
  };

  const listTasks = async () => {
    try {
      const res = await client.query('SELECT * FROM tasks ORDER BY id ASC');
      return res.rows;
    } catch (err) {
      console.error('Error retrieving tasks:', err);
      throw err;
    }
  };

  const completeTask = async (taskId) => {
    try {
      const res = await client.query('UPDATE tasks SET completed = TRUE WHERE id = $1 RETURNING *', [taskId]);
      return res.rows[0];
    } catch (err) {
      console.error('Error completing task:', err);
      throw err;
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const res = await client.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [taskId]);
      return res.rows[0];
    } catch (err) {
      console.error('Error deleting task:', err);
      throw err;
    }
  };

  module.exports = {
    addTask,
    listTasks,
    completeTask,
    deleteTask,
  };