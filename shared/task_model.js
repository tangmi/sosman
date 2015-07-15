import uuid from 'node-uuid';

export
class Task {
	static new(stTitle) {
		return new Task(
			// uuid.v1(),
			uuid.v4(),
			stTitle,
			new Date(),
			null);
	}

	constructor(id, stTitle, tmCreated, tmCompleted) {
		this.id = id;
		this.stTitle = String(stTitle);
		this.tmCreated = tmCreated != null ? new Date(tmCreated) : null;
		this.tmCompleted = tmCompleted != null ? new Date(tmCompleted) : null;
	}
}

export
class TaskModel {
	static serialize(model) {
		return JSON.stringify(model.data);
	}

	static deserialize(json_model) {
		var data = JSON.parse(json_model)
			.map(el => {
				el.priority = el.priority;
				el.task = new Task(
					el.task.id,
					el.task.stTitle,
					el.task.tmCreated,
					el.task.tmCompleted);
				return el;
			});
		var model = new TaskModel();
		model.data = data;
		return model;
	}

	constructor() {
		this.on_changes = [];
		this.data = [];
	}

	subscribe(on_change) {
		this.on_changes.push(on_change);
	}

	inform() {
		// store? or subscribe a storage strat to this

		this.on_changes.forEach(on_change => on_change());
	}

	add(stTitle) {
		this.data = this.data.map(task => {
			task.priority++;
			return task;
		});

		this.data.push({
			priority: 0,
			task: Task.new(stTitle),
		});
	}

	remove(id) {
		const filtered = this.data.filter(el => el.task.id == id);
		if (filtered.length != 1) {
			throw new Error('wrong number of tasks found: ' + filtered.length);
		}

		const curr_el = filtered[0];

		this.data = this.data
			.map(el => {
				if (el.priority > curr_el.priority) {
					el.priority--;
				}
				return el;
			})
			.filter(el => el.task.id != id);
	}

	complete() {}
	promote() {}
	bury() {}
}