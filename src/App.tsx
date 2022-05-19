import { Component, createSignal } from 'solid-js';
import { AiFillDelete } from 'solid-icons/ai';
import { FaSolidUndo } from 'solid-icons/fa';
import { IoCloudDone } from 'solid-icons/io';

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

  let todoInput: HTMLTextAreaElement | undefined;

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
      <h2
        style={{
          color: '#b318f0',
        }}
      >
        Daily Todo Tracker
      </h2>

      <h3
        style={{
          color: '#b318f0',
        }}
      >
        Date: <span>{new Date().toLocaleDateString()}</span>
      </h3>

      <form>
        <textarea
          class={styles.todoInput}
          ref={todoInput}
          name='todo'
          // @ts-ignore
          onInput={(e) => setTodo(e.target.value)}
          value={todo()}
          rows={10}
          placeholder='What do you need to do today?'
        />
        <button
          class={styles.addTodoButton}
          type='button'
          onClick={() => addTodo(todo())}
          disabled={!todo()}
        >
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
              <IoCloudDone
                onClick={() => completeTodo(todo.id)}
                size='24'
                color='#00b300'
              />
            ) : (
              <FaSolidUndo
                color='#00b300'
                size='24'
                onClick={() => undoTodo(todo.id)}
              />
            )}

            <AiFillDelete
              color='#ff0000'
              onClick={() => deleteTodo(todo.id)}
              size='24'
            />
          </li>
        ))}
      </ol>
    </div>
  );
};

export default App;
