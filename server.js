const express = require('express');
const socket = require('socket.io');
const app = express();

let tasks = [];

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000');
});

const io = socket(server);

io.on('connection', (socket) => {
    socket.on('updateData', () => {
        socket.emit('updateData', tasks);
    });
    socket.on('addTask', (task) => {
        const newTask = ({id: tasks.length + 1, name: task});
        tasks.push(newTask);
        socket.broadcast.emit('addTask', newTask);
    });
    socket.on('removeTask', (taskToRemove) => {
      tasks.filter((task) => task.id !== taskToRemove.id);
      socket.broadcast.emit('removeTask', taskToRemove);
    });
});

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});