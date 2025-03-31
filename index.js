const express = require('express');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');
const yargs = require('yargs');
const { addTask, listTasks, completeTask, deleteTask } = require('./controllers/todoController');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));    

app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
    try {
      const tasks = await listTasks();
      res.render('index', { tasks });
    } catch (err) {
      res.status(500).send('Error retrieving tasks');
    }
    })


    app.post('/complete/:id', async (req, res) => {
        try {
          const taskId = parseInt(req.params.id, 10);
          await completeTask(taskId);
          res.redirect('/');
        } catch (err) {
          res.status(500).send('Error completing task');
        }
      });

      app.post('/delete/:id', async (req, res) => {
        try {
          const taskId = parseInt(req.params.id, 10);
          await deleteTask(taskId);
          res.redirect('/');
        } catch (err) {
          res.status(500).send('Error deleting task');
        }
      });

      app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}/`);
      });

      yargs
  .command(
    'add <task>',
    'Add a new task',
    (yargs) => {
      yargs.positional('task', {
        describe: 'Task description',
        type: 'string',
      });
    },
    async (argv) => {
      try {
        await addTask(argv.task);
        console.log(chalk.green(`Task added: ${argv.task}`));
      } catch (err) {
        console.error(chalk.red('Error adding task:', err));
      }
    }
  )
  .command('list', 'List all tasks', async () => {
    try {
      const tasks = await listTasks();
      if (tasks.length === 0) {
        console.log(chalk.yellow('No tasks found.'));
      } else {
        tasks.forEach((task) => {
          console.log(
            task.completed
              ? chalk.strikethrough(`${task.id}. ${task.task}`)
              : `${task.id}. ${task.task}`
          );
        });
      }
    } catch (err) {
      console.error(chalk.red('Error retrieving tasks:', err));
    }
  })
  .command(
    'complete <id>',
    'Mark a task as completed',
    (yargs) => {
      yargs.positional('id', {
        describe: 'Task ID',
        type: 'number',
      });
    },
    async (argv) => {
      try {
        await completeTask(argv.id);
        console.log(chalk.green(`Task completed: ${argv.id}`));
      } catch (err) {
        console.error(chalk.red('Error completing task:', err));
      }
    }
  )
  .command(
    'delete <id>',
    'Delete a task',
    (yargs) => {
      yargs.positional('id', {
        describe: 'Task ID',
        type: 'number',
      });
    },
    async (argv) => {
      try {
        await deleteTask(argv.id);
        console.log(chalk.green(`Task deleted: ${argv.id}`));
      } catch (err) {
        console.error(chalk.red('Error deleting task:', err));
      }
    }
  )
  .help()
  .argv;