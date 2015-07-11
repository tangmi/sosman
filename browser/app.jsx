import React from 'react';
import moment from 'moment';

import TaskControls from './task-controls.jsx';
import Task from './task.jsx';


import shared from '../shared/shared.js';
shared();

const ENTER_KEY = 13;

export default
class App extends React.Component {
	state: {}

	constructor() {
		super();
		this.handleNewTask = this.handleNewTask.bind(this);
	}

	handleNewTask(event) {
		if (event.keyCode !== ENTER_KEY) {
			return;
		}

		event.preventDefault();

		let val = React.findDOMNode(this.refs.newField).value.trim();

		if (val) {
			this.props.model.add(val);
			React.findDOMNode(this.refs.newField).value = '';
		}
	}

	complete(task) {
		this.props.model.complete(task);
	}

	remove(task) {
		this.props.model.remove(task);
	}

	promote(task) {
		this.props.model.promote(task);
	}

	bury(task) {
		this.props.model.bury(task);
	}

	render() {
		let tasks_pending = this.props.model.tasks
			.filter(function(task) {
				return !task.completed;
			});

		let dom_top_task;
		if(tasks_pending.length > 0) {
			let top_task = tasks_pending.shift();
			dom_top_task = (
				<div id="top-task">
					<a href="#"
						id="top-task-checkbox"
						onClick={this.complete.bind(this, top_task)}>
						<i className="fa fa-check-square-o"></i>
					</a>
					<div id="top-task-content">
						{top_task.title}

						<TaskControls
							data={top_task}
							onRemove={this.remove.bind(this, top_task)}
							onBury={this.bury.bind(this, top_task)} />
					</div>
				</div>
			);
		}
		
		let dom_tasks = tasks_pending
			.map(function(task, i, arr) {
				// TODO:TANG display age if older than a day?
				return (
					<Task data={task}
						onRemove={this.remove.bind(this, task)}
						onPromote={this.promote.bind(this, task)}
						onBury={this.bury.bind(this, task)} />
				);
			}, this);

		let tasks_completed = this.props.model.tasks
			.filter(function(task) {
				return task.completed;
			});
		tasks_completed.sort(function(a, b) {
			return b.tmCompleted - a.tmCompleted;
		});
		var dom_tasks_completed = tasks_completed
			.map(function(task) {
				var st_tmCompleted = moment(task.tmCompleted).fromNow(); //.format('MMMM Do YYYY, h:mm:ss a');
				return (
					<li>{task.title} <span className="task-completed-on">completed {st_tmCompleted}</span></li>
				);
			});

        return (
        	<div className="sos">
	            <div id="app-title">- ̗̀New ̖́- sosman</div>

	            <input type="text"
		            ref="newField"
		            id="task-input"
		            onKeyDown={this.handleNewTask} />

	            <h2>current</h2>
		        {dom_top_task}

	            <h2>todo</h2>
	            <ul id="task-list">
	            	{dom_tasks}
	            </ul>

	            <h2>done</h2>
	            <ul id="task-list-completed">
		            {dom_tasks_completed}
	            </ul>
            </div>
        );
    }
}
