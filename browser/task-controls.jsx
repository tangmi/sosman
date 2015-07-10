import React from 'react';

class TaskControls extends React.Component {

	render() {
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
}

module.exports = TaskControls;
