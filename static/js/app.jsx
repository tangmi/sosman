var Task = React.createClass({
	render: function() {
		return (
        	<li>
        		<span>{this.props.data.title}</span>

        		<TaskControls
        			data={this.props.data}
        			onRemove={this.props.onRemove}
        			onPromote={this.props.onPromote}
        			onBury={this.props.onBury} />
           	</li>
		);
	}
});

var TaskControls = React.createClass({

	render: function() {
		// TODO:TANG hide buttons when not applicable
		return (
			<span className="task-controls">
				<a href="#" onClick={this.props.onRemove}>
					<i className="fa fa-close"></i>
				</a>
				<a href="#" onClick={this.props.onPromote}>
					<i className="fa fa-hand-o-up"></i>
				</a>
				<a href="#" onClick={this.props.onBury}>
					<i className="fa fa-hand-o-down"></i>
				</a>
			</span>
		);
	}
});

var ENTER_KEY = 13;

var App = React.createClass({
	getInitialState: function() {
		return {};
	},

	handleNewTask: function(event) {
		if (event.keyCode !== ENTER_KEY) {
			return;
		}

		event.preventDefault();

		var val = React.findDOMNode(this.refs.newField).value.trim();

		if (val) {
			this.props.model.add(val);
			React.findDOMNode(this.refs.newField).value = '';
		}
	},

	complete: function(task) {
		this.props.model.complete(task);
	},

	remove: function(task) {
		this.props.model.remove(task);
	},

	promote: function(task) {
		this.props.model.promote(task);
	},

	bury: function(task) {
		this.props.model.bury(task);
	},

	render: function() {
		var tasks_pending = this.props.model.tasks
			.filter(function(task) {
				return !task.completed;
			});

		var dom_top_task;
		if(tasks_pending.length > 0) {
			var top_task = tasks_pending.shift();
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
		
		var dom_tasks = tasks_pending
			.map(function(task, i, arr) {
				// TODO:TANG display age if older than a day?
				return (
					<Task data={task}
						onRemove={this.remove.bind(this, task)}
						onPromote={this.promote.bind(this, task)}
						onBury={this.bury.bind(this, task)} />
				);
			}, this);

		var tasks_completed = this.props.model.tasks
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
});

// do it

var model = new Model();

function render() {
	React.render(
		<div className="container">
			<App model={model} />
		</div>,
		document.getElementById('content')
	);
};

model.subscribe(render);
window.setInterval(render, 5000);
render();
