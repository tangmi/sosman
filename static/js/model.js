window.Model = function() {
	// todo: separate list for completed?
	this.tasks = [];
	this.onChanges = [];

	this.id_max = 0;
};

Model.prototype.subscribe = function(onChange) {
	this.onChanges.push(onChange);
};

Model.prototype.inform = function() {
	this.onChanges.forEach(function(cb) {
		cb();
	});
};

Model.prototype.add = function(title) {
	// TODO:TANG add due dates via nlp?

	var taskNew = {
		id: this.id_max++,
		title: title.trim(),
		tmAdded: new Date(),
		completed: false,
	};

	this.tasks.unshift(taskNew);

	// todo:tang add task UNDER current one
	// if (this.tasks.length == 0) {
	// 	this.tasks.unshift(taskNew);
	// } else {
	// 	this.tasks.splice(1, 0, taskNew);
	// 	console.log(this.tasks);
	// }

	this.inform();
};

Model.prototype.remove = function(taskCurrent) {
	this.tasks = this.tasks.filter(function(task) {
		return taskCurrent.id != task.id;
	});

	this.inform();
};

// Model.prototype.pop = function() {
// 	var task = this.tasks.shift();
// 	this.inform();
// 	return task;
// };

Model.prototype.complete = function(taskCurrent) {
	this.tasks = this.tasks.map(function(task) {
		if (taskCurrent.id == task.id) {
			task.completed = true;
			task.tmCompleted = new Date();
		}
		return task;
	});

	this.inform();
};

Model.prototype.promote = function(taskCurrent) {
	this.tasks = this.tasks.filter(function(task) {
		return task.id != taskCurrent.id;
	});

	this.tasks.unshift(taskCurrent);

	this.inform();
};

Model.prototype.bury = function(taskCurrent) {
	this.tasks = this.tasks.filter(function(task) {
		return task.id != taskCurrent.id;
	});

	this.tasks.push(taskCurrent);

	this.inform();
};