var Task = React.createClass({
	render: function() {
		return (
        	<li>
        		<label>{this.props.data.id} Ω {this.props.data.title}</label>

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
			<span>
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
				<h2>
					current:
					<a href="#" onClick={this.complete.bind(this, top_task)}>
						<i className="fa fa-check-square-o"></i>
					</a>
					{top_task.title}
					<TaskControls
						data={top_task}
						onRemove={this.remove.bind(this, top_task)}
						onBury={this.bury.bind(this, top_task)} />
				</h2>
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
					<li>{task.title}, completed {st_tmCompleted}</li>
				);
			});

        return (
        	<div className="sos">
	            <div>Sos</div>

	            <input type="text"
		            ref="newField"
		            onKeyDown={this.handleNewTask} />

		        {dom_top_task}

	            <ul id="task-list">
	            	{dom_tasks}
	            </ul>

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



model.add('hello');
model.complete(model.tasks[0]);
model.add('hello2');
model.add('hellodasfd2');
model.add('hefasdfasdfllo2');
model.add('helasdfasdfasdfasdflo2');
model.add('helasdfasdfsafdsafsdfasdfsdlo2');
model.add('hello2-last');
