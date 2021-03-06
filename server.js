const express = require('express');
const socket = require('socket.io');
const path = require('path');
const { uuid } = require('uuidv4');
const app = express();

let tasks = [];

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000');
});

const io = socket(server);

io.on('connection', (socket) => {
  socket.emit('updateData', tasks);
    socket.on('addTask', (task) => {
        const newTask = ({id: uuid(), name: task});
        tasks.push(newTask);
        io.emit('addTask', newTask);
    });
   socket.on('removeTask', (taskToRemove) => {
      tasks = tasks.filter((task) => task.id !== taskToRemove);
     io.emit('removeTask', taskToRemove);
    });
});


app.use(express.static(path.join(__dirname, '/client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});