import TodoContext from './index';

export default function toggle(todoToToggle: any) {
    TodoContext.toggle(todoToToggle);
}