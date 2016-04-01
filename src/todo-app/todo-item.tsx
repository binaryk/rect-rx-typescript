/*
 * The TodoItem component represents one of the tasks in the list of tasks.
 * The component's initial state is set in the component’s constructor by itself while the properties are passed as constructor arguments and are set by the component’s parent component   
*/

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as CONSTANTS from './constants';
import {Cursor} from 'immutable/contrib/cursor';

declare var classNames:any;

//Here we define the interface of the structure of a task.
interface ITodo{
	id: string,
	title: string,
	completed: boolean
}

//Here we define the interface of the properties of the TodoItemcomponent.
interface ITodoItemProps{
	key: string,
	todo: Cursor,
	editing?: boolean,
	onSave: (val:any) => void,
	onDestroy: () => void,
	onEdit: () => void,
	onCancel: (event:any) => void,
	onToggle: () => void 
}

//Here we define the interface of the state of the TodoItem component.
interface ITodoItemState{
	editText: string
}


class TodoItem extends React.Component<ITodoItemProps,ITodoItemState >{
	constructor(props: ITodoItemProps){
		super(props);
		//Here we set the initial state.
		this.state = {editText: this.props.todo.get('title')};
	}
	
	public handleSubmit(event){
		var val = this.state.editText.trim();
		if(val){
			this.props.onSave(val);
			this.setState({editText: val});
		}
		else{
			this.props.onDestroy();
		}
	}
	
	public handleEdit(){
		this.props.onEdit();
		this.setState({editText: this.props.todo.get('title')});
	}
	
	public handleKeyDown(event){
		if(event.which === CONSTANTS.ESCAPE_KEY){
			this.setState({editText: this.props.todo.get('title')});
			this.props.onCancel(event);
		}
		else{
			if(event.which === CONSTANTS.ENTER_KEY){
				this.handleSubmit(event);
			}
		}
	}
	
	public handleChange(event){
		this.setState({editText: event.target.value});
	}
	
	//Optional
	/* This code is an optional performance enhancement that can be implemented on any React component.
	 * Using this, our app's performnce will be better.
	*/
	public shouldComponentUpdate(nextProps, nextState){
		return(
			nextProps.todo !== this.props.todo ||
			nextProps.editing !== this.props.editing ||
			nextState.editText !== this.state.editText
		);
	}
	
	// Safely manipulat the DOM after updating the state.
	public componentDidUpdate(prevProps){
		if(!prevProps.editing && this.props.editing){
			var node = ReactDOM.findDOMNode<HTMLInputElement>(this.refs["editField"]);
			node.focus();
			node.setSelectionRange(node.value.length, node.value.length);
		}
	}
	
	public render(){
		return(
			<li className={classNames({completed: this.props.todo.get('completed'), editing: this.props.editing})}>
				<div className="view">
					<input className="toggle" type="checkbox" checked={this.props.todo.get('completed')} onChange={this.props.onToggle} />
					<label onDoubleClick={e=>this.handleEdit()}>{this.props.todo.get('title')}</label>
					<button className="destroy" onClick={this.props.onDestroy}/>
				</div>
				<input
					ref="editField"
					className="edit"
					value = {this.state.editText}
					onBlur = {e => this.handleSubmit(e)}
					onChange = {e => this.handleChange(e)}
					onKeyDown = {e => this.handleKeyDown(e)}
				/>
			</li>
		);
	}
}

export default TodoItem;