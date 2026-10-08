// ─── DOM Elements ───────────────────────────────────────────
const input          = document.getElementById('todo-input');
const addBtn         = document.getElementById('add-btn');
const list           = document.getElementById('todo-list');
const prioritySelect = document.getElementById('priority-select');
const dueDateInput   = document.getElementById('due-date');
const searchInput    = document.getElementById('search-input');
const filterBtns     = document.querySelectorAll('.filter-btn');

// ─── Priority Select — live color theme ─────────────────────
function updateSelectTheme() {
    prioritySelect.classList.remove('sel-low', 'sel-medium', 'sel-high');
    prioritySelect.classList.add('sel-' + prioritySelect.value);
}
prioritySelect.addEventListener('change', updateSelectTheme);
updateSelectTheme(); // set on load


// ─── GSAP Page Load Animation ───────────────────────────────
function pageLoadAnim() {
    var tl = gsap.timeline();
    tl.from('h1', {
        y: -40,
        opacity: 0,
        duration: 1,
        ease: 'expo.out'
    })
    .from('body > p', {
        y: -20,
        opacity: 0,
        duration: 0.8,
        ease: 'expo.out',
        delay: -0.6
    })
    .from('#add-section', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'expo.out',
        delay: -0.5
    })
    .from('#search-section', {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: 'expo.out',
        delay: -0.5
    })
    .from('.filter-btn', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'expo.out',
        delay: -0.4
    })
    .from('#progress-section', {
        y: 20,
        opacity: 0,
        duration: 0.7,
        ease: 'expo.out',
        delay: -0.3
    })
    .from('#ai-section', {
        y: 20,
        opacity: 0,
        duration: 0.7,
        ease: 'expo.out',
        delay: -0.3
    });
}

// ─── Mouse Follower Circle ───────────────────────────────────
var timeout;
function circleMouseFollower(xscale, yscale) {
    window.addEventListener('mousemove', function(dets) {
        document.querySelector('#minicircle').style.transform =
            `translate(${dets.clientX}px, ${dets.clientY}px) scale(${xscale || 1}, ${yscale || 1})`;
    });
}

function circleChaptaKaro() {
    var xscale = 1;
    var yscale = 1;
    var xprev = 0;
    var yprev = 0;

    window.addEventListener('mousemove', function(dets) {
        clearTimeout(timeout);
        xscale = gsap.utils.clamp(0.8, 1.2, dets.clientX - xprev);
        yscale = gsap.utils.clamp(0.8, 1.2, dets.clientY - yprev);
        xprev = dets.clientX;
        yprev = dets.clientY;
        circleMouseFollower(xscale, yscale);
        timeout = setTimeout(function() {
            document.querySelector('#minicircle').style.transform =
                `translate(${dets.clientX}px, ${dets.clientY}px) scale(1, 1)`;
        }, 100);
    });
}

circleChaptaKaro();
circleMouseFollower();
pageLoadAnim();


// Progress tracking elements
const statCompleted  = document.getElementById('stat-completed');
const statTotal      = document.getElementById('stat-total');
const statPercent    = document.getElementById('stat-percent');
const progressFill   = document.getElementById('progress-bar-fill');
const progressMsg    = document.getElementById('progress-msg');

// ─── State ──────────────────────────────────────────────────
const saved = localStorage.getItem('todos');
const todos = saved ? JSON.parse(saved) : [];
let activeFilter = 'all';
let searchQuery  = '';

// ─── Persist ────────────────────────────────────────────────
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// ─── Progress Tracking ──────────────────────────────────────
function updateProgress() {
    const total     = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const percent   = total === 0 ? 0 : Math.round((completed / total) * 100);

    statCompleted.textContent = `${completed} Done`;
    statTotal.textContent     = `${total} Total`;
    statPercent.textContent   = `${percent}%`;
    progressFill.style.width  = `${percent}%`;

    // Motivational messages
    if (total === 0)          progressMsg.textContent = '✨ Add some tasks to get started!';
    else if (percent === 100) progressMsg.textContent = '🎉 All done! You crushed it!';
    else if (percent >= 75)   progressMsg.textContent = '🔥 Almost there, keep going!';
    else if (percent >= 50)   progressMsg.textContent = '💪 Halfway through, great work!';
    else if (percent >= 25)   progressMsg.textContent = '🚀 Good start, keep it up!';
    else                      progressMsg.textContent = '📝 Let\'s start checking things off!';
}

// ─── Helpers ────────────────────────────────────────────────
function isDueDateOverdue(dateStr) {
    if (!dateStr) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dateStr) < today;
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
}

// ─── Create one todo <li> node ───────────────────────────────
function createTodoNode(todo, index) {
    const li = document.createElement('li');
    li.classList.add(`priority-${todo.priority || 'medium'}`);
    if (todo.completed) li.classList.add('completed');

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = !!todo.completed;
    checkbox.addEventListener('change', () => {
        todo.completed = checkbox.checked;
        saveTodos();
        render();
    });

    // Text
    const textSpan = document.createElement('span');
    textSpan.className = 'todo-text';
    textSpan.textContent = todo.text;
    textSpan.addEventListener('dblclick', () => {
        const newText = prompt('Edit task:', todo.text);
        if (newText !== null && newText.trim()) {
            todo.text = newText.trim();
            saveTodos();
            render();
        }
    });

    // Meta (priority badge + due date)
    const meta = document.createElement('div');
    meta.className = 'todo-meta';

    const badge = document.createElement('span');
    badge.className = `priority-badge badge-${todo.priority || 'medium'}`;
    const icons = { high: '🔴 High', medium: '🟡 Medium', low: '🟢 Low' };
    badge.textContent = icons[todo.priority] || '🟡 Medium';

    meta.appendChild(badge);

    if (todo.dueDate) {
        const dateLabel = document.createElement('span');
        dateLabel.className = 'due-date-label' + (isDueDateOverdue(todo.dueDate) && !todo.completed ? ' overdue' : '');
        dateLabel.textContent = '📅 ' + formatDate(todo.dueDate);
        meta.appendChild(dateLabel);
    }

    // Delete button
    const delBtn = document.createElement('button');
    delBtn.className = 'del-btn';
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', () => {
        todos.splice(index, 1);
        saveTodos();
        render();
    });

    li.appendChild(checkbox);
    li.appendChild(textSpan);
    li.appendChild(meta);
    li.appendChild(delBtn);
    return li;
}

// ─── Render ──────────────────────────────────────────────────
function render() {
    list.innerHTML = '';

    // Filter + Search
    const filtered = todos.filter((todo, _i) => {
        const matchSearch = todo.text.toLowerCase().includes(searchQuery.toLowerCase());
        let matchFilter = true;
        if (activeFilter === 'completed') matchFilter = todo.completed;
        else if (activeFilter !== 'all')  matchFilter = todo.priority === activeFilter;
        return matchSearch && matchFilter;
    });

    // Sort: high → medium → low, completed at bottom
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    filtered.sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return (priorityOrder[a.priority] || 1) - (priorityOrder[b.priority] || 1);
    });

    // Update progress bar (always based on ALL todos, not filtered)
    updateProgress();

    if (filtered.length === 0) {
        const msg = document.createElement('p');
        msg.id = 'empty-msg';
        msg.textContent = searchQuery ? 'No tasks match your search.' : 'No tasks here yet!';
        list.appendChild(msg);
        return;
    }

    filtered.forEach((todo) => {
        // find real index in original todos array for delete/edit
        const realIndex = todos.indexOf(todo);
        const node = createTodoNode(todo, realIndex);
        list.appendChild(node);

        // GSAP: animate each todo item in with stagger
        gsap.fromTo(node, {
            opacity: 0,
            x: -30,
            scale: 0.95
        }, {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.4,
            ease: 'expo.out'
        });
    });
}

// ─── Add Todo ────────────────────────────────────────────────
function addTodo() {
    const text = input.value.trim();
    if (!text) return;

    todos.push({
        text,
        completed: false,
        priority: prioritySelect.value,
        dueDate: dueDateInput.value || null
    });

    input.value = '';
    dueDateInput.value = '';
    prioritySelect.value = 'medium';
    saveTodos();
    render();
}

addBtn.addEventListener('click', addTodo);
input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTodo();
});

// ─── Search ──────────────────────────────────────────────────
searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value;
    render();
});

// ─── Filter Buttons ──────────────────────────────────────────
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.dataset.filter;
        render();
    });
});

// ─── AI Suggest ──────────────────────────────────────────────
const aiBtn    = document.getElementById('ai-btn');
const aiInput  = document.getElementById('ai-input');
const aiStatus = document.getElementById('ai-status');

aiBtn.addEventListener('click', async () => {
    const goal = aiInput.value.trim();
    if (!goal) return;

    aiBtn.disabled = true;
    aiBtn.textContent = 'Thinking...';
    aiStatus.textContent = '';

    try {
        const res = await fetch('/api/suggest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ goal })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Something went wrong');

        // Add AI tasks with medium priority by default
        data.tasks.forEach(text => {
            todos.push({ text, completed: false, priority: 'medium', dueDate: null });
        });

        render();
        saveTodos();
        aiInput.value = '';
        aiStatus.textContent = `✅ Added ${data.tasks.length} tasks`;
        setTimeout(() => aiStatus.textContent = '', 3000);

    } catch (err) {
        aiStatus.textContent = '❌ ' + err.message;
    } finally {
        aiBtn.disabled = false;
        aiBtn.textContent = '✦ Suggest Tasks';
    }
});

aiInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') aiBtn.click();
});

// ─── Init ────────────────────────────────────────────────────
render();