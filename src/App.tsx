import { Component, createSignal } from 'solid-js';

import styles from './App.module.css';

function readTodosFromLocalStorage() {
  const todos = localStorage.getItem('todos');
  return todos ? JSON.parse(todos) : [];
}

function writeTodosToLocalStorage(todos: string[]) {
  localStorage.setItem('todos', JSON.stringify(todos));
}

const App: Component = () => {
  const [todo, setTodo] = createSignal('');
  const [todos, setTodos] = createSignal(readTodosFromLocalStorage());

  let todoInput: HTMLInputElement | undefined;

  const addTodo = (todo: string) => {
    setTodos([...todos(), todo]);
    setTodo('');

    writeTodosToLocalStorage(todos());

    if (todoInput) {
      todoInput.focus();
    }
  };

  return (
    <div class={styles.App}>
      <h2>Solid Todo</h2>
      <form>
        <input
          ref={todoInput}
          type='text'
          name='todo'
          // @ts-ignore
          onInput={(e) => setTodo(e.target.value)}
          value={todo()}
        />
        <button type='button' onClick={() => addTodo(todo())}>
          Add
        </button>
      </form>

      <ul class={styles.todoList}>
        {todos().map((todo: string) => (
          <li class={styles.todoItem}>
            <span>{todo}</span>
            <button>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
