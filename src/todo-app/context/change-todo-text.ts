import TodoContext from './index';

export default function changeTodoText(todoToSave, text) {
    TodoContext.save(todoToSave, text);
}