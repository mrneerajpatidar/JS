document.addEventListener('DOMContentLoaded', () => {
    const addItemBtn = document.getElementById('add-btn');
    const newItemInput = document.getElementById('new-item');
    const todoList = document.getElementById('todo-list');
    const searchInput = document.getElementById('search');

    // Load existing items from localStorage
    function loadItems() {
        const items = JSON.parse(localStorage.getItem('todoItems')) || [];
        items.forEach(item => {
            const li = createListItem(item.text, item.done);
            todoList.appendChild(li);
        });
    }

    // Save items to localStorage
    function saveItems() {
        const items = Array.from(todoList.children).map(li => ({
            text: li.querySelector('.item-text').textContent,
            done: li.classList.contains('done')
        }));
        localStorage.setItem('todoItems', JSON.stringify(items));
    }

    function createListItem(text, done = false) {
        const li = document.createElement('li');
        li.classList.toggle('done', done);
        li.innerHTML = `
            <span class="item-text">${text}</span>
            <button class="done-btn">&#10003;</button>
            <button class="edit-btn">&#9998;</button>
            <button class="delete-btn">&#10007;</button>
            <button class="up-btn">&#9650;</button>
            <button class="down-btn">&#9660;</button>
        `;
        li.draggable = true;
        return li;
    }

    function addItem() {
        const text = newItemInput.value.trim();
        if (text === '') return;
        const li = createListItem(text);
        todoList.appendChild(li);
        newItemInput.value = '';
        saveItems();
    }

    function editItem(e) {
        if (!e.target.classList.contains('edit-btn')) return;
        const li = e.target.parentElement;
        const span = li.querySelector('.item-text');
        const newText = prompt('Edit item:', span.textContent);
        if (newText) span.textContent = newText;
        saveItems();
    }

    function deleteItem(e) {
        if (!e.target.classList.contains('delete-btn')) return;
        const li = e.target.parentElement;
        li.remove();
        saveItems();
    }

    function toggleDone(e) {
        if (!e.target.classList.contains('done-btn')) return;
        const li = e.target.parentElement;
        li.classList.toggle('done');
        saveItems();
    }

    function moveItem(e) {
        const li = e.target.parentElement;
        if (e.target.classList.contains('up-btn')) {
            const prev = li.previousElementSibling;
            if (prev) todoList.insertBefore(li, prev);
        } else if (e.target.classList.contains('down-btn')) {
            const next = li.nextElementSibling;
            if (next) todoList.insertBefore(next, li);
        }
        saveItems();
    }

    function searchItems() {
        const searchText = searchInput.value.toLowerCase();
        const items = todoList.querySelectorAll('li');
        items.forEach(item => {
            const text = item.querySelector('.item-text').textContent.toLowerCase();
            item.style.display = text.includes(searchText) ? '' : 'none';
        });
    }

    function handleDragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.dataset.id);
        e.target.classList.add('dragging');
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.target.classList.add('drag-over');
    }

    function handleDragEnter(e) {
        e.preventDefault();
    }

    function handleDrop(e) {
        e.preventDefault();
        const draggingElement = document.querySelector('.dragging');
        const targetElement = e.target.closest('li');

        if (targetElement && draggingElement !== targetElement) {
            todoList.insertBefore(draggingElement, targetElement);
            saveItems();
        }
        e.target.classList.remove('drag-over');
        draggingElement.classList.remove('dragging');
    }

    function handleDragEnd(e) {
        e.target.classList.remove('dragging');
    }

    addItemBtn.addEventListener('click', addItem);
    todoList.addEventListener('click', editItem);
    todoList.addEventListener('click', deleteItem);
    todoList.addEventListener('click', toggleDone);
    todoList.addEventListener('click', moveItem);
    searchInput.addEventListener('input', searchItems);

    // Drag-and-drop functionality
    todoList.addEventListener('dragstart', handleDragStart);
    todoList.addEventListener('dragover', handleDragOver);
    todoList.addEventListener('dragenter', handleDragEnter);
    todoList.addEventListener('drop', handleDrop);
    todoList.addEventListener('dragend', handleDragEnd);

    loadItems();
});