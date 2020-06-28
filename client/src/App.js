import React from 'react';
import io from 'socket.io-client';

class App extends React.Component {

  state = {
    tasks: [],
    taskName: '',
  }

  componentDidMount() {
    this.socket = io('http://localhost:8000');
    this.socket.on('addTask', (task) => this.addTask(task));
    this.socket.on('removeTask',(taskToRemove) => this.removeTask(taskToRemove));
    this.socket.on('updateData', (tasks) => this.updateTasks(tasks));
  }
  
  removeTask(id) {
    this.setState({
      tasks: this.state.tasks.filter((task) => task.id !== id),
    });
  }

  addTask(task) {
    this.setState({tasks: [...this.state.tasks, task]});
  }

  
  changeTaskName = (event) => {
    this.setState({taskName: event.target.value})
  }

  submitForm = (event) => {
    event.preventDefault();
    this.socket.emit('addTask', this.state.taskName);
  }

  updateTasks(tasks) {
    this.setState({
      tasks:  [ ...tasks],
    });
  }

  sendRemoveTaskToServer(id) {
    this.socket.emit('removeTask', id);
  }
 
  render() {
    const {tasks} = this.state;
    return (
      <div className="App">
    
        <header>
          <h1>ToDoList.app</h1>
        </header>
    
        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>
    
          <ul className="tasks-section__list" id="tasks-list">
            {tasks.map(task => (
              <li key={task.id} className="task">{task.name}<button className="btn btn--red" onClick={() => this.sendRemoveTaskToServer(task.id)}>Remove</button></li>
            ))}
          </ul>
    
          <form id="add-task-form" onSubmit={this.submitForm}>
            <input 
            className="text-input" 
            autoComplete="off" 
            type="text" 
            placeholder="Type your description" 
            id="task-name" 
            value={this.state.taskName} 
            onChange={this.changeTaskName} />
            <button className="btn" type="submit">Add</button>
          </form>
    
        </section>
      </div>
    );
  };

};

export default App;