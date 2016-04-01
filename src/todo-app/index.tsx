/*
 * This file contains the 'TodoApp' component which is the only top level component in this application.
*/

import * as ReactDOM from 'react-dom';
import * as React from 'react';

import TodoFooter from './footer';
import TodoItem from './todo-item';
import * as CONSTANTS from './constants';
import {List} from 'immutable';
import {Cursor} from 'immutable/contrib/cursor';

import TodoContext from './context';
import AddTodo from './context/add-todo';
import Toggle from './context/toggle';
import ToggleAll from './context/toggle-all';
import Destroy from './context/destroy';
import ClearCompleted from './context/clear-completed'
import ChangeTodoText from './context/change-todo-text';
import Undo from './context/undo';
import FilterByState from './context/filter-by-state';

//Router is provided by the 'director' node module.
declare var Router: any;


//Here we define the interface of the structure of a task.
interface ITodo {
    id: string,
    title: string,
    completed: boolean
}


//Here we define the interface of the properties of App component.
interface IAppProps {
}

//Here we define the interface of the state of the App component.
interface IAppState {
    editing?: string,
    nowShowing?: string
}



class TodoApp extends React.Component<IAppProps, IAppState>{
    keysPressed: {};
    bindUpdate: Function;
    subscription: { dispose: Function };

    constructor(props: IAppProps) {
        super(props);
        this.state = { nowShowing: CONSTANTS.ALL_TODOS, editing: null };
        this.keysPressed = { 90: false, 17: false }

        this.bindUpdate = this.update.bind(this);
    }

    update(state) {
        if (this.state === state) {
            return;
        }
        this.setState(state);
    }

    componentWillMount() {
        this.subscription = TodoContext.subscribe(this.bindUpdate);
    }
    componentWillUnmount() {
        this.subscription.dispose();
    }

    public componentDidMount() {
        var setState = this.setState;
        //Router observes changes in the URL and triggers some events.
        var router = Router({
            '/': setState.bind(this, { nowShowing: CONSTANTS.ALL_TODOS }),
            '/active': setState.bind(this, { nowShowing: CONSTANTS.ACTIVE_TODOS }),
            '/completed': setState.bind(this, { nowShowing: CONSTANTS.COMPLETED_TODOS })
        });
        router.init('/');
    }

    public handleNewTodoKeyDown(event) {
        if (event.keyCode !== CONSTANTS.ENTER_KEY) {
            return;
        }
        event.preventDefault();
        var val = ReactDOM.findDOMNode<HTMLInputElement>(this.refs['newField']).value.trim();
        if (val) {
            AddTodo(val);
            ReactDOM.findDOMNode<HTMLInputElement>(this.refs['newField']).value = '';
        }
    }

    public handleUndoKeyDown(event) {
        if (event.keyCode in this.keysPressed) {
            this.keysPressed[event.keyCode] = true;
            if (this.keysPressed[CONSTANTS.CTRL_LEFT_KEY] && this.keysPressed[CONSTANTS.Z_KEY]) {
                Undo();
            }
        }
    }

    public handleUndoKeyUp(event) {
        if (event.keyCode in this.keysPressed) {
            this.keysPressed[event.keyCode] = false;
        }
    }

    public toggleAll(event) {
        var checked = event.target.checked;
        ToggleAll(checked);
    }

    public toggle(todoToToggle) {
        Toggle(todoToToggle);
    }

    public destroy(todo) {
        Destroy(todo);
    }

    public edit(todo) {
        this.setState({ editing: todo.get('id') });
    }

    public save(todoToSave, text) {
        ChangeTodoText(todoToSave, text);
        this.setState({ editing: null });
    }

    public cancel() {
        this.setState({ editing: null });
    }

    public clearCompleted() {
        ClearCompleted();
    }

    public render() {
        var footer;
        var main;
        var todos = TodoContext.todos;

        console.log('list',todos);
        var shownTodos = FilterByState(this.state.nowShowing);

        var todoItems = shownTodos.map(function(todo) {
        return (
            <TodoItem
                    key={todo.get('id') }
                    todo={todo}
                    onToggle={this.toggle.bind(this, todo) }
                    onDestroy={this.destroy.bind(this, todo) }
                    onEdit={this.edit.bind(this, todo) }
                    editing={this.state.editing === todo.get('id') }
                    onSave={this.save.bind(this, todo) }
                    onCancel={ e => this.cancel() }
                    />
            );
        }, this);

        var activeTodoCount = todos.reduce(function(accum, todo) {
            return todo.get('completed') ? accum : accum + 1;
        }, 0);

        var completedCount = todos.size - activeTodoCount;

        if (activeTodoCount || completedCount) {
            footer =
                <TodoFooter
                    count={activeTodoCount}
                    completedCount={completedCount}
                    nowShowing={this.state.nowShowing}
                    onClearCompleted={ e => this.clearCompleted() }
                    />;
        }

        if (todos.size) {
            main = (
                <section className="main">
                    <input
                        className="toggle-all"
                        type="checkbox"
                        onChange={ e => this.toggleAll(e) }
                        checked={activeTodoCount === 0}
                        />
                    <ul className="todo-list">
                        {todoItems}
                    </ul>
                </section>
            );
        }

        return (
            <div onKeyDown={e => this.handleUndoKeyDown(e) } onKeyUp={e => this.handleUndoKeyUp(e) }>
                <header className="header">
                    <h1>todoss</h1>
                    <input
                        ref="newField"
                        className="new-todo"
                        placeholder="What needs to be done?"
                        onKeyDown={ e => this.handleNewTodoKeyDown(e) }
                        autoFocus={true}
                        />
                </header>
                {main}
                {footer}
            </div>
        );
    }
}

export default TodoApp;