/*
 * The footer component allows users to filter the list of tasks by their status and displays the number of tasks.
 * This componens has no state, but it has some properties that are set by its parent component. 
*/

import * as React from 'react';
import Utils from '../utils';
import * as CONSTANTS from './constants';


//Classnames is declared in a file from node_modules, file that is included in 'index.html' .
declare var classNames:any;


//Here we define the interface of the properties of the Footer component.
interface ITodoFooterProps{
	completedCount: number,
	onClearCompleted: any,
	nowShowing: string,
	count: number
}



class TodoFooter extends React.Component<ITodoFooterProps, {}>{
	public render(){
		var activeTodoWord = Utils.pluralize(this.props.count, 'item');
		var clearButton = null;
		if(this.props.completedCount > 0){
			clearButton = (
				<button className="clear-completed" onClick={this.props.onClearCompleted}>Clear completed</button>
			);
		} 
		
		var nowShowing = this.props.nowShowing;
		return(
			<footer className="footer">
				<span className="todo-count">
					<strong>{this.props.count}</strong>
					{activeTodoWord} left
				</span>
				<ul className="filters">
					<li>
					<a href="#/" className = {classNames({selected: nowShowing === CONSTANTS.ALL_TODOS})}>All</a>
					</li>
					{' '}
					<li>
						<a href="#/active" className={classNames({selected: nowShowing === CONSTANTS.ACTIVE_TODOS})} >Active</a>
					</li>
					{' '}
					<li>
						<a href="#/completed" className={classNames({selected: nowShowing === CONSTANTS.COMPLETED_TODOS})}>Completed</a>
					</li>
				</ul>
				{clearButton}
			</footer>
		);
	}
}

export default TodoFooter;