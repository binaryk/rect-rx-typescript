/*
 * TodoModel is a generic 'model' object. 
*/
import Utils from '../../utils';
import {List, fromJS} from 'immutable';
import {Cursor, from} from 'immutable/contrib/cursor';
import * as RX from 'rx';

//Here we define the interface of the structure of a task.
interface ITodo{
	id: string,
	title: string,
	completed: boolean
}

//Here we define interface of the Todo Model.
interface ITodoContext{
	key: any,
	todos: Cursor,
	onChanges: any,
    history: List<Cursor>,
	subscribe(onChange),
	store(),
	addTodo(title: string),
	toggleAll(checked),
	toggle(todoToToggle),
	destroy(todo),
	save(todoToSave, text),
	clearCompleted(),
    undo()
}


class TodoContext implements ITodoContext {
	//key is used for local storage.
	public key: string;
	//a list of tasks.
	public todos: Cursor;
	//a list of events.
	public onChanges: any;
    //a list for undo action
    public history: List<Cursor>;
    
	constructor(){
		this.key = 'react-todos';
		this.todos = from(fromJS(Utils.store(this.key)),
            this.onChange.bind(this));
        
		this.onChanges = new RX.BehaviorSubject(this.todos);
        this.history = fromJS([]);
	}
    
    onChange(newValue) {
        this.todos = from(newValue, this.onChange.bind(this));
        this.onChanges.onNext(this.todos);
        this.store();
    }
	
	//Here we define some methods used to manipulate the list of tasks.
	public subscribe(onChange):{dispose:Function} {
        return this.onChanges.subscribe(onChange);
	}
	
	public store(){
		Utils.store(this.key, this.todos);
	}
	
	public addTodo(title: string){
        this.history = this.history.push(this.todos);
		this.todos.push(fromJS({
			id: Utils.uuid(),
			title: title,
			completed: false
		}));
	}
	
	//We use map and filter because React works very well with immutable data. This kind of data is also easier to use and even better than mutating the array.
	public toggleAll(checked){
        this.history = this.history.push(this.todos);
		this.todos.update(value => value.map((todo:any) => {
			return  todo.set('completed', checked);
		}));
	}
	
	public toggle(todoToToggle) {
        this.history = this.history.push(this.todos);
        todoToToggle.set('completed', !todoToToggle.get('completed'));
	}
	
	public destroy(todo:Cursor) {
        this.history = this.history.push(this.todos);
		this.todos.update(todos => todos.filter(function(candidate){
			return candidate.get('id') !== todo.get('id');
		}));
	}
	
	public save(todoToSave, text){
        this.history = this.history.push(this.todos);
        todoToSave.set('title', text);
	}
	
	public clearCompleted(){
        this.history = this.history.push(this.todos);
		this.todos.update(todos => todos.filter(function(todo){
			return !todo.get('completed');
		}));
	}
    
    public undo(){
        if(this.history.size>0){
            var i = this.history.size;
            this.todos.update(todos=>this.history.last().deref());
            this.history = this.history.pop();
        }
    }	
}

export default new TodoContext();
