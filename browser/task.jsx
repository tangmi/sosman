import React from 'react';

import TaskControls from './task-controls.jsx';

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

module.exports = Task;
