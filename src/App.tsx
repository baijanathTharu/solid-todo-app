import { Component, createSignal } from 'solid-js';

import styles from './App.module.css';

interface ITodo {
  id: number;
  text: string;
  isCompleted: boolean;
}

function readTodosFromLocalStorage() {
  const todos = localStorage.getItem('todos');
  return todos ? JSON.parse(todos) : [];
}

function writeTodosToLocalStorage(todos: ITodo[]) {
  localStorage.setItem('todos', JSON.stringify(todos));
}

const App: Component = () => {
  const [todo, setTodo] = createSignal('');
  const [todos, setTodos] = createSignal<ITodo[]>(readTodosFromLocalStorage());

  let todoInput: HTMLInputElement | undefined;

  const addTodo = (todo: string) => {
    setTodos([
      ...todos(),
      {
        id: Math.ceil(Math.random() * 2000000),
        text: todo,
        isCompleted: false,
      },
    ]);
    setTodo('');

    writeTodosToLocalStorage(todos());

    if (todoInput) {
      todoInput.focus();
    }
  };

  const completeTodo = (id: number) => {
    setTodos(
      todos().map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      )
    );
    writeTodosToLocalStorage(todos());
  };

  const undoTodo = (id: number) => {
    setTodos(
      todos().map((todo) =>
        todo.id === id ? { ...todo, isCompleted: false } : todo
      )
    );
    writeTodosToLocalStorage(todos());
  };

  const deleteTodo = (id: number) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      setTodos(todos().filter((todo) => todo.id !== id));
      writeTodosToLocalStorage(todos());
    }
  };

  return (
    <div class={styles.App}>
      <h2>Daily Todo Tracker</h2>

      <h3>
        Date: <span>{new Date().toLocaleDateString()}</span>
      </h3>

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

      <ol class={styles.todoList}>
        {todos().map((todo: ITodo, i) => (
          <li class={styles.todoItem}>
            <span class={todo.isCompleted ? styles.strikeThrough : ''}>
              {' '}
              {todo.text}
            </span>
            {!todo.isCompleted ? (
              <button
                class={styles.completeButton}
                type='button'
                onClick={() => completeTodo(todo.id)}
              >
                Done
              </button>
            ) : (
              <button
                class={styles.undoButton}
                type='button'
                onClick={() => undoTodo(todo.id)}
              >
                Undo
              </button>
            )}
            {/* delete todo */}
            <button
              class={styles.deleteButton}
              type='button'
              onClick={() => deleteTodo(todo.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default App;
