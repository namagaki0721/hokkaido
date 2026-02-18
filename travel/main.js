
    const input = document.getElementById('input');
    const list = document.getElementById('list');

    const todos = JSON.parse(localStorage.getItem('todos') || '[]');
    render();

    document.getElementById('addBtn').onclick = () => {
  if (input.value.trim()) {
    todos.push({ text: input.value, done: false });
    input.value = '';
    save();
    render();
  }
};


    function toggle(index) {
      todos[index].done = !todos[index].done;
      save();
      render();
    }

    function removeTodo(index) {
      todos.splice(index, 1);
      save();
      render();
    }

    function save() {
      localStorage.setItem('todos', JSON.stringify(todos));
    }

    function render() {
  list.innerHTML = '';

  todos.forEach((todo, i) => {
    const li = document.createElement('li');
    if (todo.done) li.classList.add('done');

    li.innerHTML = `
      <div class="checkbox">
        <input type="checkbox" ${todo.done ? 'checked' : ''} />
      </div>
      <div class="text">${todo.text}</div>
      <button class="delete">×</button>
    `;

    li.querySelector('input').onclick = () => toggle(i);
    li.querySelector('.delete').onclick = () => removeTodo(i);

    list.appendChild(li);
  });
}
