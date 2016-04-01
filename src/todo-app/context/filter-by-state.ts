import TodoContext from './index';
import * as Constants from '../constants';

export default function filterBy(showing) {
    return TodoContext.todos.filter(
        (todo) => {
            switch (showing) {
                case Constants.ACTIVE_TODOS:
                    return !todo.get('completed');
                case Constants.COMPLETED_TODOS:
                    return todo.get('completed');
                default:
                    return true;
            }
        });
}