const todoInput = document.querySelector(".todo-input");
const todoForm = document.querySelector(".todo-form");
const searchInput = document.querySelector(".search-input");
const todoOutput = document.querySelector(".todo-output");

const addTodo = (e) => {
  e.preventDefault();
  const todo = todoInput.value;
  if (todo) {
    const id = Date.now();
    addTodoLocalStorage({ id, todo, completed: false });
    const todoItem = document.createElement("div");
    todoItem.className = `todo-item ${id}`;
    todoItem.innerHTML = `
    <input class="todo-check" type="checkbox"/>
    <input class="todo-text" type="text" value=${todo} disabled/>
    <button class="todo-edit">Edit</button>
    <button class="todo-delete">Delete</button>
    `;
    todoOutput.appendChild(todoItem);
    todoInput.value = "";
  }
};

const addTodoLocalStorage = (todo) => {
  let tasks = JSON.parse(localStorage.getItem("tasks"));
  if (!tasks) {
    tasks = [];
  }
  tasks.push(todo);
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const deleteTodo = (e) => {
  if (e.target.className === "todo-delete") {
    deleteTodoFromLocalStorage(e.target.parentElement.classList[1]);
    e.target.parentElement.remove();
  }
};

const deleteTodoFromLocalStorage = (id) => {
  let tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks = tasks.filter((task) => task.id !== parseInt(id));
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const checkedTodo = (e) => {
  if (e.target.className === "todo-check") {
    const id = e.target.parentElement.classList[1];
    const checked = e.target.checked;

    if (checked) {
      e.target.nextElementSibling.style.textDecoration = "line-through";
    } else {
      e.target.nextElementSibling.style.textDecoration = "none";
    }
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks = tasks.map((task) => {
      if (task.id === parseInt(id)) {
        task.completed = checked;
      }
      return task;
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
};

const editTodo = (e) => {
  if (e.target.className === "todo-edit") {
    const id = e.target.parentElement.classList[1];
    const todoText = e.target.parentElement.querySelector(".todo-text");
    if (todoText.disabled) {
      todoText.disabled = false;
      e.target.textContent = "Save";
    } else {
      todoText.disabled = true;
      e.target.textContent = "Edit";
      editTodoInLocalStorage(id, todoText.value);
    }
  }
};

const editTodoInLocalStorage = (id, todo) => {
  let tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks = tasks.map((task) => {
    if (task.id === parseInt(id)) {
      task.todo = todo;
    }
    return task;
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const searchTodo = (e) => {
  const searchText = e.target.value.toLowerCase();
  const todoItems = document.querySelectorAll(".todo-item");
  todoItems.forEach((todoItem) => {
    const todo = todoItem.querySelector(".todo-text").value.toLowerCase();
    if (todo.indexOf(searchText) !== -1) {
      todoItem.style.display = "flex";
    } else {
      todoItem.style.display = "none";
    }
  });
};

const getTodo = (e) => {
  let tasks = localStorage.getItem("tasks");
  if (tasks) {
    tasks = JSON.parse(tasks);
    tasks.forEach((task) => {
      const todoItem = document.createElement("div");
      todoItem.className = `todo-item ${task.id}`;
      todoItem.innerHTML = `
    <input class="todo-check" type="checkbox" ${
      task.completed ? "checked" : ""
    }/>
    <input class="todo-text ${
      task.completed ? "strike" : ""
    }" type="text" value=${task.todo} disabled/>
    <button class="todo-edit">Edit</button>
    <button class="todo-delete">Delete</button>
    `;
      todoOutput.appendChild(todoItem);
    });
  }
};

// event listeners
todoForm.addEventListener("submit", addTodo);
todoOutput.addEventListener("click", deleteTodo);
todoOutput.addEventListener("click", checkedTodo);
todoOutput.addEventListener("click", editTodo);
searchInput.addEventListener("keyup", searchTodo);
document.addEventListener("DOMContentLoaded", getTodo);
