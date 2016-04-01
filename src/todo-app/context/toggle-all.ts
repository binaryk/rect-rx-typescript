import TodoContext from './index';

export default function toggleAll(checked:boolean) {
    TodoContext.toggleAll(checked);
}