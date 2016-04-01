import TodoContext from './index';

export default function addTodo(title: string) {
    TodoContext.addTodo(title);
}