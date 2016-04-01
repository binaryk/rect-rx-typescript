/*
 * This file contains the application's entry point.
*/
/// <reference path="../typings/main.d.ts" />

import * as ReactDOM from 'react-dom';
import * as React from 'react';

import TodoApp from './todo-app';


function render() {
  ReactDOM.render(
    <TodoApp />,
    document.querySelector('#app')
  );
}

render();