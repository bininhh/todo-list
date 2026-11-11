const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

window.addEventListener("load", function () {
  const STORAGE_KEY = "todo-list";

  const form = $("#todo-form");

  const todoList = $("#todo-list");

  const emptyState = $("#empty-state");

  const todoCount = $("#todo-count");
  const remainingCount = $("#remaining-count");

  const filterButtons = $$("[data-filter]");

  const clearCompletedButton = document.querySelector("#clear-completed");

  let todos = loadTodos();
  let filter = "all";

  function loadTodos() {
    try {
      const todos = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(todos) ? todos : [];
    } catch {
      return [];
    }
  }

  function saveTodo() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }

  function addTodo(title) {
    const trimTitle = title.trim();
    if (!trimTitle) return;

    todos.unshift({
      id: `${Date.now()}-${Math.random()}`,
      title: trimTitle,
      completed: false,
    });

    saveTodo();
    render();
  }

  function removeTodo(id) {
    todos = todos.filter((todo) => todo.id !== id);
    console.log(todos.filter((todo) => todo.id !== id));

    saveTodo();
    render();
  }

  function toggleTodo(id) {
    todos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo,
    );

    saveTodo();
    render();
  }

  function getTodos() {
    if (filter === "active") return todos.filter((todo) => !todo.completed);
    if (filter === "done") return todos.filter((todo) => todo.completed);

    return todos;
  }

  function render() {
    const todosFilter = getTodos();
    const remaining = todos.filter((task) => !task.completed).length;
    const completed = todos.length - remaining;

    todoList.replaceChildren();
    todosFilter.forEach((todo) => {
      const item = document.createElement("li");
      item.className = `todo-item ${todo.completed ? "done" : ""}`;

      const checkButton = document.createElement("button");
      checkButton.className = "check";
      checkButton.type = "button";
      if (todo.completed) {
        checkButton.innerHTML =
          '<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m3 8 3.2 3.2L13 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      }
      checkButton.addEventListener("click", () => toggleTodo(todo.id));

      const title = document.createElement("span");
      title.className = "todo-title";
      title.textContent = todo.title;

      const deleteButton = document.createElement("button");
      deleteButton.className = "delete";
      deleteButton.type = "button";
      deleteButton.innerHTML = `<i class="fa-solid fa-trash"></i>`;
      deleteButton.addEventListener("click", () => removeTodo(todo.id));

      item.append(checkButton, title, deleteButton);
      todoList.append(item);
    });

    todoCount.textContent = `${todos.length} công việc`;
    remainingCount.textContent = `${remaining} công việc cần hoàn thành`;
    console.log(clearCompletedButton);

    clearCompletedButton.disabled = completed === 0;
    clearCompletedButton.style.opacity = completed === 0 ? ".45" : "1";
    emptyState.hidden = todosFilter.length > 0;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const value = this.elements["todo-input"].value;
    addTodo(value);

    this.elements["todo-input"].value = "";
    this.elements["todo-input"].focus();
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      filter = button.dataset.filter;

      filterButtons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("active", isActive);
      });

      render();
    });
  });

  clearCompletedButton.addEventListener("click", (e) => {
    todos = todos.filter((todo) => !todo.completed);
    saveTodo();
    render();
  });

  render();
});
