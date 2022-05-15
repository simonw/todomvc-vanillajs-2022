// This is loaded with <script type="module" src="js/app.js"></script> so import works:
import { addEvent, getURLHash } from "./helpers.js";

/* Inlining these helpers here just to save me from looking in the other file:
export const addEvent = (el, selector, event, handler) =>{
  el.querySelector(selector).addEventListener(event, e => handler(e));
}
export const getURLHash = () => document.location.hash.replace(/^#\//, '');
*/

import { TodoStore } from "./store.js";

// This is the key used for localStorage - data is serialized there as JSON
const Todos = new TodoStore("todo-vanillajs-2022");

const App = {
  // Shortcuts to support "App.$.input" references later on
  $: {
    input: document.querySelector(".new-todo"),
    list: document.querySelector(".todo-list"),
    count: document.querySelector(".todo-count"),
    footer: document.querySelector(".footer"),
    toggleAll: document.querySelector(".toggle-all"),
    main: document.querySelector(".main"),
    clear: document.querySelector(".clear-completed"),
    filters: document.querySelector(".filters"),
  },
  // "" or "/active" or "/completed" depending on user navigation:
  filter: getURLHash(),
  // init() is called once at the end of this module
  init() {
    // TodoStore extends EventTarget, which is why this works. The "save" event is
    // fired any time the todos change in any way - adding, removing or toggling
    Todos.addEventListener("save", App.render);
    // Re-render the app if the user clicks a link that changes the hash
    window.addEventListener("hashchange", () => {
      App.filter = getURLHash();
      App.render();
    });
    // Special handling for Enter presses to add the TODO item
    App.$.input.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        App.addTodo(e.target.value);
        App.$.input.value = "";
      }
    });
    // These dispatch to the TodoStore, which updates self.todos, serializes
    // it back to localStorage and  then files a "save" event, subscribed above
    App.$.toggleAll.addEventListener("click", (e) => {
      // Marks every task as completed
      Todos.toggleAll();
    });
    App.$.clear.addEventListener("click", (e) => {
      // Deletes any tasks that are marked as completed
      Todos.clearCompleted();
    });
    // Render once at end of init()
    App.render();
  },
  addTodo(todo) {
    Todos.add({ title: todo, completed: false, id: "id_" + Date.now() });
  },
  removeTodo(todo) {
    // Defined as remove ({ id }) - so this extracts just the id: property
    Todos.remove(todo);
  },
  toggleTodo(todo) {
    Todos.toggle(todo);
  },
  editingTodo(todo, li) {
    // Triggeed on double click
    li.classList.add("editing");
    li.querySelector(".edit").focus();
  },
  updateTodo(todo, li) {
    // Called when user hits "enter"
    Todos.update(todo);
    // Update the hidden input field for next time they edit:
    li.querySelector(".edit").value = todo.title;
  },
  createTodoItem(todo) {
    // Creates <li> representing TODO, attaches listeners, returns it
    const li = document.createElement("li");
    if (todo.completed) {
      li.classList.add("completed");
    }
    // I love multi-line backtick strings as a templating mechanism!
    li.innerHTML = `
      <div class="view">
	<input class="toggle" type="checkbox" ${todo.completed ? "checked" : ""}>
	<label></label>
	<button class="destroy"></button>
      </div>
      <!-- This is hidden in the CSS by:
        .todo-list li .edit { display: none; }
      -->
      <input class="edit">
    `;
    // Using .textContent here automatically applies HTML escaping rules
    li.querySelector("label").textContent = todo.title;
    li.querySelector(".edit").value = todo.title;

    addEvent(li, ".destroy", "click", () => App.removeTodo(todo, li));
    addEvent(li, ".toggle", "click", () => App.toggleTodo(todo, li));
    addEvent(li, "label", "dblclick", () => App.editingTodo(todo, li));
    addEvent(li, ".edit", "keyup", (e) => {
      // Enter updates the TODO, escape undos any changes
      if (e.key === "Enter")
        App.updateTodo({ ...todo, title: e.target.value }, li);
      if (e.key === "Escape") {
        e.target.value = todo.title;
        // I don't understand why this takes it back out of editing mode:
        App.render();
      }
    });
    // Hitting "tab" to blur away from the edit saves state too
    addEvent(li, ".edit", "blur", (e) =>
      App.updateTodo({ ...todo, title: e.target.value }, li)
    );

    return li;
  },
  render() {
    // Removes the entire list and rebuilds from scratch each time
    const todosCount = Todos.all().length;
    App.$.filters
      .querySelectorAll("a")
      .forEach((el) => el.classList.remove("selected"));
    App.$.filters
      .querySelector(`[href="#/${App.filter}"]`)
      .classList.add("selected");
    App.$.list.innerHTML = "";
    Todos.all(App.filter).forEach((todo) => {
      App.$.list.appendChild(App.createTodoItem(todo));
    });
    App.$.footer.style.display = todosCount ? "block" : "none";
    App.$.main.style.display = todosCount ? "block" : "none";
    App.$.clear.style.display = Todos.hasCompleted() ? "block" : "none";
    App.$.toggleAll.checked = todosCount && Todos.isAllCompleted();
    App.$.count.innerHTML = `
      <strong>${Todos.all("active").length}</strong>
      ${Todos.all("active").length === 1 ? "item" : "items"} left
    `;
  },
};

App.init();
