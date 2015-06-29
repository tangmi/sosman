window.Model = function() {
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

	this.tasks.unshift({
		id: this.id_max++,
		title: title.trim(),
		tmAdded: new Date(),
		completed: false,
	});

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