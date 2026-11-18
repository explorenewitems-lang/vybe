const NAV_ITEMS = [
  { section: "MAIN" },
  { name: "Dashboard", icon: "⌂" },
  { name: "Tasks", icon: "☑", key: "tasks" },
  { name: "Planner", icon: "✧" },
  { name: "Habits", icon: "◷", key: "habits" },
  { name: "Notes", icon: "▤", key: "notes" },
  { name: "Calendar", icon: "▦", key: "events" },
  { section: "YOUR LIFE" },
  { name: "Student Hub", icon: "⌑" },
  { name: "Money", icon: "₹" },
  { name: "Wellness", icon: "♡" },
  { name: "Goals", icon: "◎", key: "goals" },
  { section: "INTELLIGENCE" },
  { name: "AI Studio", icon: "✦", badge: "AI" },
  { name: "Settings", icon: "⚙" }
];

const TODAY = new Date();
const STORAGE_KEY = "vybe-data";
const LEGACY_STORAGE_KEY = "myspace-data";
const DAY = value => new Date(value).toISOString().slice(0, 10);
const OFFSET_DATE = offset => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return DAY(date);
};
const uid = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const defaultData = () => ({
  tasks: [
    { id: uid(), title: "Finish product strategy deck", details: "Share the revised story with the team.", priority: "High", due: DAY(TODAY), status: "In progress" },
    { id: uid(), title: "Morning movement", details: "A little space to reset.", priority: "Medium", due: DAY(TODAY), status: "To do" },
    { id: uid(), title: "Read 20 pages", details: "Atomic Habits — chapter 8.", priority: "Low", due: DAY(TODAY), status: "To do" },
    { id: uid(), title: "Reply to Maya", details: "Send over the weekend photos.", priority: "Medium", due: OFFSET_DATE(1), status: "To do" },
    { id: uid(), title: "Weekly review", details: "Close the week with intention.", priority: "Low", due: OFFSET_DATE(2), status: "Done", completedOn: DAY(TODAY) }
  ],
  habits: [
    { id: uid(), name: "Drink 8 glasses of water", emoji: "💧", goal: "8 glasses", days: {} },
    { id: uid(), name: "Move your body", emoji: "✳", goal: "30 minutes", days: {} },
    { id: uid(), name: "Read a little", emoji: "▤", goal: "20 pages", days: {} }
  ],
  notes: [
    { id: uid(), title: "A few thoughts for this week", body: "Make time for the work that matters most. Leave a little room for the unexpected, too.", date: DAY(TODAY), tag: "Reflection" },
    { id: uid(), title: "Weekend getaway ideas", body: "Find a cabin with a view, a fireplace and a trail nearby. Maybe the coast?", date: OFFSET_DATE(-1), tag: "Personal" },
    { id: uid(), title: "Things worth remembering", body: "Small steps still move you forward. Progress is allowed to be quiet.", date: OFFSET_DATE(-2), tag: "Journal" }
  ],
  events: [
    { id: uid(), title: "Design sync", date: DAY(TODAY), time: "10:30", location: "Studio room", details: "Review the new onboarding flow." },
    { id: uid(), title: "Lunch with Jordan", date: DAY(TODAY), time: "13:00", location: "Little Fern", details: "Catch up over lunch." },
    { id: uid(), title: "Focus time", date: OFFSET_DATE(1), time: "09:00", location: "At home", details: "Block the morning for deep work." },
    { id: uid(), title: "Design review", date: OFFSET_DATE(2), time: "14:00", location: "Studio room", details: "Share final concepts." }
  ],
  subjects: [
    { id: uid(), name: "Psychology 101", teacher: "Dr. Lee", hours: 2.5, color: "purple" },
    { id: uid(), name: "Statistics", teacher: "Prof. Kumar", hours: 1.5, color: "green" },
    { id: uid(), name: "Creative Writing", teacher: "Ms. Park", hours: 1, color: "orange" }
  ],
  assignments: [
    { id: uid(), title: "Research methods essay", subject: "Psychology 101", due: OFFSET_DATE(4), status: "In progress" },
    { id: uid(), title: "Problem set 06", subject: "Statistics", due: OFFSET_DATE(2), status: "To do" }
  ],
  exams: [{ id: uid(), title: "Statistics midterm", date: OFFSET_DATE(12), subject: "Statistics" }],
  expenses: [
    { id: uid(), title: "Coffee & pastry", category: "Food", amount: 180, date: DAY(TODAY), type: "Expense" },
    { id: uid(), title: "Weekly groceries", category: "Home", amount: 2450, date: OFFSET_DATE(-1), type: "Expense" },
    { id: uid(), title: "Freelance project", category: "Income", amount: 35000, date: OFFSET_DATE(-2), type: "Income" }
  ],
  wellness: [
    { id: uid(), date: DAY(TODAY), weight: 68.4, water: 5, sleep: 7.5, workout: "Walk · 30 min" },
    { id: uid(), date: OFFSET_DATE(-1), weight: 68.5, water: 7, sleep: 8, workout: "Strength · 40 min" },
    { id: uid(), date: OFFSET_DATE(-2), weight: 68.6, water: 6, sleep: 7, workout: "Rest day" }
  ],
  goals: [
    { id: uid(), title: "Build a calmer morning routine", category: "Wellbeing", progress: 65, target: OFFSET_DATE(28), status: "In progress" },
    { id: uid(), title: "Save for a little adventure", category: "Money", progress: 42, target: OFFSET_DATE(90), status: "In progress" },
    { id: uid(), title: "Finish my reading list", category: "Personal", progress: 25, target: OFFSET_DATE(45), status: "In progress" }
  ],
  studySessions: [{ id: uid(), date: DAY(TODAY), subject: "Psychology 101", hours: 1.5 }],
  attendance: { attended: 38, total: 42 },
  preferences: { theme: "dark", notifications: false }
});

let data;
try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY) || "null");
  data = saved && typeof saved === "object" ? { ...defaultData(), ...saved } : defaultData();
  if (saved && !localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  }
} catch (error) {
  console.error("Could not load VYBE data:", error);
  data = defaultData();
}
const legacySampleAmounts = new Map([
  ["Coffee & pastry:8.5", 180],
  ["Weekly groceries:62.4", 2450],
  ["Freelance project:450", 35000]
]);
for (const expense of data.expenses || []) {
  const updatedAmount = legacySampleAmounts.get(`${expense.title}:${expense.amount}`);
  if (updatedAmount !== undefined) expense.amount = updatedAmount;
}

let currentPage = "Dashboard";
let activeTool = "Personal assistant";
let editing = null;
let chartInstances = [];
let renderedPage = null;
let revealObserver = null;
let searchQuery = "";

const $ = selector => document.querySelector(selector);
const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const formatMoney = value => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(value) || 0);
const niceDate = value => value ? new Date(`${value}T12:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "—";
const fullDate = value => new Date(value).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
const todayLabel = () => new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
const collection = key => Array.isArray(data[key]) ? data[key] : [];
function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
  catch (error) { console.error("Could not save VYBE data:", error); toast("Could not save data. Your browser storage may be full.", "error"); }
}
function toast(message, type = "") {
  const node = document.createElement("div");
  node.className = `toast ${type}`;
  node.textContent = message;
  $("#toastRegion").append(node);
  setTimeout(() => node.remove(), 3500);
}
function setTheme() {
  document.body.classList.toggle("light-theme", data.preferences?.theme === "light");
  $("#themeToggle").textContent = data.preferences?.theme === "light" ? "☾" : "☼";
}
function renderNav() {
  $("#mainNav").innerHTML = NAV_ITEMS.map(item => item.section
    ? `<div class="nav-divider"></div><div class="nav-caption">${esc(item.section)}</div>`
    : `<button class="nav-item ${currentPage === item.name ? "active" : ""}" data-page="${esc(item.name)}"><span class="nav-icon">${item.icon}</span><span>${esc(item.name)}</span>${item.badge ? `<span class="nav-badge">${esc(item.badge)}</span>` : ""}</button>`
  ).join("");
  document.querySelectorAll(".mobile-nav-item[data-page]").forEach(item => item.classList.toggle("active", item.dataset.page === currentPage));
}
function go(page) {
  currentPage = page;
  searchQuery = "";
  $("#globalSearch").value = "";
  $("#currentPage").textContent = page;
  $("#sidebar").classList.remove("open");
  $("#sidebarOverlay").hidden = true;
  renderNav();
  renderPage();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function heading(kicker, title, description, actions = "") {
  return `<div class="page-heading"><div><span class="eyebrow">${esc(kicker)}</span><h1>${esc(title)}</h1><p>${esc(description)}</p></div><div class="heading-actions">${actions}</div></div>`;
}
function emptyState(icon, text) {
  return `<div class="empty-state"><div class="empty-icon">${icon}</div>${esc(text)}</div>`;
}
function button(text, action, primary = false, icon = "") {
  return `<button class="button ${primary ? "button-primary" : ""}" data-action="${esc(action)}">${icon ? `<span>${icon}</span>` : ""}${esc(text)}</button>`;
}
function taskRow(task, compact = false) {
  return `<div class="task-row"><button class="task-check ${task.status === "Done" ? "checked" : ""}" data-action="toggle-task" data-id="${esc(task.id)}" aria-label="${task.status === "Done" ? "Mark incomplete" : "Mark complete"}">${task.status === "Done" ? "✓" : ""}</button><span class="task-name ${task.status === "Done" ? "done" : ""}">${esc(task.title)}</span><span class="task-meta"><i class="priority-dot ${esc((task.priority || "").toLowerCase())}"></i>${compact ? esc(task.priority || "Normal") : esc(task.due === DAY(TODAY) ? "Today" : niceDate(task.due))}</span></div>`;
}
function eventRow(event) {
  return `<div class="event-row"><span class="event-time">${esc(event.time || "—")}</span><div><div class="event-title">${esc(event.title)}</div><div class="event-sub">${esc(event.location || event.details || "Scheduled event")}</div></div></div>`;
}
function renderDashboard() {
  const tasks = collection("tasks");
  const todayTasks = tasks.filter(task => task.due === DAY(TODAY));
  const done = todayTasks.filter(task => task.status === "Done").length;
  const percent = todayTasks.length ? Math.round(done / todayTasks.length * 100) : 0;
  const events = collection("events").filter(event => event.date >= DAY(TODAY)).sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)).slice(0, 3);
  const taskTotal = tasks.length;
  const completed = tasks.filter(task => task.status === "Done").length;
  const studyHours = collection("studySessions").filter(session => session.date === DAY(TODAY)).reduce((sum, session) => sum + Number(session.hours || 0), 0);
  const month = DAY(TODAY).slice(0, 7);
  const expenses = collection("expenses").filter(item => item.type !== "Income" && String(item.date || "").startsWith(month)).reduce((sum, item) => sum + Number(item.amount || 0), 0);
  return `
    <section class="dashboard-hero"><div class="hero-copy"><span class="eyebrow">${todayLabel().toUpperCase()}</span><h1>Good ${new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}, Alex <span>✦</span></h1><p>A fresh page. Let’s make a little room for what matters.</p></div><div class="hero-action"><div class="progress-ring" style="--progress:${percent * 3.6}deg"><strong>${percent}%</strong></div><div class="ring-label"><strong>Your day, in motion</strong><span>${done} of ${todayTasks.length} tasks complete</span></div></div></section>
    <section class="stats-grid">
      <article class="panel stat-card"><div class="stat-top"><span>Tasks completed</span><span class="stat-icon">✓</span></div><div class="stat-value">${completed}<span class="stat-note">of ${taskTotal} total</span></div></article>
      <article class="panel stat-card"><div class="stat-top"><span>Study time today</span><span class="stat-icon">◷</span></div><div class="stat-value">${studyHours}<span class="stat-note">hours logged</span></div></article>
      <article class="panel stat-card"><div class="stat-top"><span>Upcoming events</span><span class="stat-icon">▦</span></div><div class="stat-value">${events.length}<span class="stat-note">on your calendar</span></div></article>
      <article class="panel stat-card"><div class="stat-top"><span>Spending this month</span><span class="stat-icon">₹</span></div><div class="stat-value">${formatMoney(expenses)}<span class="stat-note">so far</span></div></article>
    </section>
    <section class="dashboard-grid">
      <article class="panel"><div class="panel-head"><div><h2>Today’s focus</h2><p>A few things to move forward</p></div><button class="text-link" data-page="Tasks">See all tasks ↗</button></div><div class="task-list">${todayTasks.slice(0, 5).map(task => taskRow(task)).join("") || emptyState("☑", "No tasks for today. Enjoy the breathing room.")}</div><div class="panel-head" style="padding-top:0"><button class="text-link" data-action="add-task">＋ Add a task</button></div></article>
      <article class="panel"><div class="panel-head"><div><h2>Coming up</h2><p>A little look ahead</p></div><button class="text-link" data-page="Calendar">Calendar ↗</button></div><div class="events-list">${events.map(eventRow).join("") || emptyState("▦", "Nothing on your calendar yet.")}</div></article>
    </section>
    <section class="panel quick-actions"><div class="panel-head"><div><h2>A little momentum</h2><p>Pick up wherever you are</p></div></div><div class="quick-action-buttons"><button class="button" data-action="add-task">＋ New task</button><button class="button" data-action="add-note">▤ Capture a thought</button><button class="button" data-action="plan-day">✦ Plan my day</button></div></section>
    <section class="charts-grid"><article class="panel chart-panel"><div class="panel-head"><div><h2>Your rhythm</h2><p>Tasks completed this week</p></div><span class="pill purple">THIS WEEK</span></div><div class="chart-wrap"><canvas id="weeklyChart" aria-label="Weekly task completion chart"></canvas></div></article><article class="panel chart-panel"><div class="panel-head"><div><h2>Life in balance</h2><p>Where your attention goes</p></div></div><div class="chart-wrap"><canvas id="balanceChart" aria-label="Productivity overview chart"></canvas></div></article></section>`;
}

function renderPlanner() {
  const tasks = collection("tasks").filter(task => task.due === plannerDate).map(task => ({
    id: task.id, key: "tasks", time: "", title: task.title,
    description: `${task.priority || "Normal"} priority · ${task.status || "To do"}`,
    kind: "task", status: task.status
  }));
  const events = collection("events").filter(event => event.date === plannerDate).map(event => ({
    id: event.id, key: "events", time: event.time || "12:00", title: event.title,
    description: event.location || event.details || "Calendar event", kind: "event"
  }));
  const timeline = [...events, ...tasks].sort((a, b) => (a.time || "99:99").localeCompare(b.time || "99:99"));
  const entries = timeline.map(entry => `<div class="planner-entry ${entry.kind === "task" ? "task-entry" : ""}"><span class="planner-entry-time">${entry.kind === "task" ? (entry.status === "Done" ? "DONE" : "TASK") : esc(entry.time)}</span><span class="planner-entry-marker"></span><div class="planner-entry-copy"><strong class="${entry.status === "Done" ? "done" : ""}">${esc(entry.title)}</strong><span>${esc(entry.description)}</span></div><div class="planner-entry-actions">${entry.kind === "task" ? `<button data-action="toggle-task" data-id="${esc(entry.id)}" title="Toggle completion">${entry.status === "Done" ? "↶" : "✓"}</button>` : ""}<button data-action="edit" data-key="${entry.key}" data-id="${esc(entry.id)}" title="Edit">✎</button></div></div>`).join("");
  const actions = `${button("Add task", "add-task")} ${button("Add event", "add-event")} ${button("Plan with AI", "plan-day", true, "✦")}`;
  return `${heading("A GENTLER WAY TO GET THINGS DONE","Your daily planner","A clear view of today, with room for the unexpected.",actions)}<div class="module-toolbar"><label class="field-control" style="display:flex;align-items:center;gap:8px">Plan for <input id="plannerDate" type="date" value="${esc(plannerDate)}" style="border:0;outline:0;color:inherit;background:transparent"></label><span class="pill purple">${timeline.length} ${timeline.length === 1 ? "thing" : "things"} on the page</span></div><section class="panel"><div class="panel-head"><div><h2>${esc(fullDate(`${plannerDate}T12:00:00`))}</h2><p>Keep it steady. Leave yourself a little breathing room.</p></div></div><div class="planner-timeline">${entries || emptyState("✧","Nothing planned for this day yet. Add a task, schedule an event, or let AI help you find a starting point.")}</div></section>`;
}

const MODULES = {
  Tasks: { key: "tasks", kicker: "MAKE SPACE FOR WHAT MATTERS", title: "Your tasks", description: "Small steps, steady progress.", add: "New task", search: "Search tasks...", filters: ["All", "To do", "In progress", "Done"], fields: [
    ["title", "Task", "text", true], ["details", "Details", "textarea"], ["priority", "Priority", "select", ["Low", "Medium", "High"]], ["due", "Due date", "date"], ["status", "Status", "select", ["To do", "In progress", "Done"]]
  ] },
  Habits: { key: "habits", kicker: "LITTLE THINGS, OFTEN", title: "Your habits", description: "Show up for the things that make you feel like you.", add: "Add a habit", fields: [
    ["name", "Habit", "text", true], ["emoji", "Icon or emoji", "text"], ["goal", "Daily intention", "text"]
  ] },
  Notes: { key: "notes", kicker: "A HOME FOR YOUR THOUGHTS", title: "Notes & journal", description: "Catch the thought before it floats away.", add: "New note", search: "Search notes...", fields: [
    ["title", "Title", "text", true], ["body", "Your note", "textarea"], ["tag", "Tag", "text"]
  ] },
  Calendar: { key: "events", kicker: "YOUR TIME, WELL SPENT", title: "Calendar & reminders", description: "Make a little room for what’s ahead.", add: "Add event", fields: [
    ["title", "Event", "text", true], ["date", "Date", "date"], ["time", "Time", "time"], ["reminder", "Reminder", "select", ["None", "At time", "10 minutes before", "1 hour before"]], ["location", "Location", "text"], ["details", "Details", "textarea"]
  ] },
  "Student Hub": { key: "subjects", kicker: "A LITTLE CLOSER EVERY DAY", title: "Student hub", description: "Keep classes, assignments and study time in one place.", add: "Add subject", tabs: ["subjects", "assignments", "exams", "studySessions"], fields: [
    ["name", "Subject", "text", true], ["teacher", "Teacher", "text"], ["hours", "Study hours", "number"]
  ] },
  Money: { key: "expenses", kicker: "MONEY, WITH INTENTION", title: "Your money", description: "A clearer view of what comes in, goes out, and stays.", add: "Add transaction", fields: [
    ["title", "Transaction", "text", true], ["type", "Type", "select", ["Expense", "Income"]], ["category", "Category", "text"], ["amount", "Amount (₹)", "number"], ["date", "Date", "date"]
  ] },
  Wellness: { key: "wellness", kicker: "CHECK IN WITH YOURSELF", title: "Wellness", description: "Your energy is worth looking after.", add: "Log today", fields: [
    ["date", "Date", "date"], ["weight", "Weight (kg)", "number"], ["water", "Water (glasses)", "number"], ["sleep", "Sleep (hours)", "number"], ["workout", "Movement", "text"]
  ] },
  Goals: { key: "goals", kicker: "A NORTH STAR, NOT A DEADLINE", title: "Your goals", description: "Keep the bigger picture close, and enjoy the small wins.", add: "Add a goal", search: "Search goals...", fields: [
    ["title", "Goal", "text", true], ["category", "Area of life", "text"], ["progress", "Progress (%)", "number"], ["target", "Target date", "date"], ["status", "Status", "select", ["In progress", "Complete", "On hold"]]
  ] }
};

let moduleFilter = "All";
let studentTab = "subjects";
let plannerDate = DAY(TODAY);
function openModal(moduleName, id = null, overrides = null) {
  const module = MODULES[moduleName];
  if (!module) return;
  const fields = overrides || module.fields;
  const key = moduleName === "Student Hub" ? studentTab : module.key;
  const record = id ? collection(key).find(item => item.id === id) : null;
  editing = { moduleName, key, id, fields, record };
  $("#modalTitle").textContent = `${record ? "Edit" : "Add"} ${moduleName === "Student Hub" ? studentTab === "subjects" ? "subject" : studentTab === "assignments" ? "assignment" : studentTab === "exams" ? "exam" : "study session" : moduleName === "Money" ? "transaction" : moduleName === "Wellness" ? "wellness log" : moduleName === "Habits" ? "habit" : moduleName === "Goals" ? "goal" : moduleName === "Calendar" ? "event" : moduleName === "Tasks" ? "task" : "note"}`;
  $("#modalEyebrow").textContent = moduleName.toUpperCase();
  $("#formFields").innerHTML = fields.map(([name, label, type, extra]) => {
    const value = record?.[name] ?? (name === "date" || name === "due" ? DAY(TODAY) : name === "target" ? OFFSET_DATE(30) : name === "time" ? "12:00" : name === "reminder" ? "10 minutes before" : name === "priority" ? "Medium" : name === "status" ? "To do" : name === "type" ? "Expense" : name === "progress" ? 0 : name === "hours" || name === "water" || name === "sleep" || name === "weight" || name === "amount" ? "" : "");
    let control;
    if (type === "select") control = `<select name="${esc(name)}" ${extra ? "" : ""}>${extra.map(option => `<option ${String(value) === option ? "selected" : ""}>${esc(option)}</option>`).join("")}</select>`;
    else if (type === "textarea") control = `<textarea name="${esc(name)}" placeholder="Write a little...">${esc(value)}</textarea>`;
    else control = `<input name="${esc(name)}" type="${esc(type)}" value="${esc(value)}" ${extra === true ? "required" : ""} ${type === "number" ? 'step="any" min="0"' : ""}>`;
    return `<div class="form-field"><label>${esc(label)}</label>${control}</div>`;
  }).join("");
  $("#modalBackdrop").hidden = false;
  $("#formFields input,#formFields textarea,#formFields select")?.focus();
}
function closeModal() { $("#modalBackdrop").hidden = true; editing = null; }
function storeForm(event) {
  event.preventDefault();
  if (!editing) return;
  const { key, id, fields } = editing;
  const record = Object.fromEntries(fields.map(([name]) => [name, new FormData(event.target).get(name)]));
  if (key === "tasks" && !record.status) record.status = "To do";
  if (key === "tasks" && !record.priority) record.priority = "Medium";
  if (key === "tasks") {
    if (record.status === "Done") record.completedOn = editing.record?.status === "Done" ? editing.record.completedOn : DAY(TODAY);
    else delete record.completedOn;
  }
  if (key === "habits") record.days = editing.record?.days || {};
  if (key === "habits" && !record.emoji) record.emoji = "✦";
  if (key === "habits" && !record.goal) record.goal = "A little, each day";
  if (key === "subjects") record.hours = Number(record.hours || 0);
  if (key === "expenses") record.amount = Number(record.amount || 0);
  if (key === "wellness") {
    ["weight", "water", "sleep"].forEach(name => record[name] = Number(record[name] || 0));
    const prior = collection("wellness").find(item => item.date === record.date);
    if (prior && prior.id !== id && confirm("A wellness log already exists for this date. Replace it?")) {
      data.wellness = data.wellness.filter(item => item.id !== prior.id);
    } else if (prior && prior.id !== id) { closeModal(); return; }
  }
  if (key === "goals") record.progress = Math.max(0, Math.min(100, Number(record.progress || 0)));
  if (key === "studySessions") record.hours = Number(record.hours || 0);
  if (key === "assignments") record.status ||= "To do";
  if (key === "exams") record.subject ||= "";
  if (id) {
    const index = collection(key).findIndex(item => item.id === id);
    if (index >= 0) data[key][index] = { ...data[key][index], ...record };
  } else {
    record.id = uid();
    if (key === "notes") record.date = DAY(TODAY);
    if (key === "exams" && !record.date) record.date = OFFSET_DATE(7);
    if (key === "studySessions" && !record.date) record.date = DAY(TODAY);
    data[key].unshift(record);
  }
  save(); closeModal(); renderPage(); toast(id ? "Your changes are saved." : "Added to your space.");
}

function recordCell(value, pill = false) {
  if (!value) return `<span class="record-sub">—</span>`;
  if (!pill) return esc(value);
  const lower = String(value).toLowerCase();
  const color = lower === "done" || lower === "complete" || lower === "income" ? "green" : lower === "high" || lower === "in progress" ? "purple" : "";
  return `<span class="pill ${color}">${esc(value)}</span>`;
}
function tableView(moduleName, records, columns, key, actionColumn = true) {
  if (!records.length) return `<div class="records-panel panel">${emptyState("✧", `Nothing here yet. ${moduleName === "Tasks" ? "Add your first task to get moving." : "Add something to make this space yours."}`)}</div>`;
  const headings = columns.map(column => `<th>${esc(column[1])}</th>`).join("");
  const rows = records.map(record => `<tr data-record-row>${columns.map(([field, label, type]) => `<td>${field === "title" || field === "name" ? `<span class="record-title">${esc(record[field] || "Untitled")}</span>${record.details ? `<span class="record-sub">${esc(record.details)}</span>` : record.body ? `<span class="record-sub">${esc(record.body)}</span>` : ""}` : type === "pill" ? recordCell(record[field], true) : type === "date" ? recordCell(niceDate(record[field])) : type === "money" ? recordCell(`${record.type === "Income" ? "+" : "−"}${formatMoney(record.amount)}`) : type === "percent" ? `<span>${Number(record[field] || 0)}%</span>` : recordCell(record[field])}</td>`).join("")}${actionColumn ? `<td><div class="record-actions"><button data-action="edit" data-key="${esc(key)}" data-id="${esc(record.id)}" title="Edit">✎</button><button data-action="delete" data-key="${esc(key)}" data-id="${esc(record.id)}" title="Delete">×</button></div></td>` : ""}</tr>`).join("");
  return `<div class="panel records-panel"><table class="record-table"><thead><tr>${headings}${actionColumn ? "<th></th>" : ""}</tr></thead><tbody>${rows}</tbody></table></div>`;
}
function filterRecords(records, query = searchQuery) {
  const q = query.trim().toLowerCase();
  return records.filter(item => !q || Object.values(item).some(value => String(value).toLowerCase().includes(q)));
}
function toolbar(module, key, extraFilters = "") {
  return `<div class="module-toolbar">${module.search ? `<input class="field-control module-search" id="moduleSearch" type="search" value="${esc(searchQuery)}" placeholder="${esc(module.search)}">` : ""}${extraFilters}${module.filters ? `<select class="field-control" id="moduleFilter">${module.filters.map(filter => `<option ${moduleFilter === filter ? "selected" : ""}>${esc(filter)}</option>`).join("")}</select>` : ""}</div>`;
}
function renderTasks(module) {
  let records = filterRecords(collection("tasks"));
  if (moduleFilter !== "All") records = records.filter(record => record.status === moduleFilter);
  return `${heading(module.kicker, module.title, module.description, button(module.add, "add-record", true, "+"))}${toolbar(module, module.key)}${tableView("Tasks", records.sort((a,b) => (a.due || "").localeCompare(b.due || "")), [["title","Task"],["priority","Priority","pill"],["status","Status","pill"],["due","Due","date"]], module.key)}`;
}
function renderHabits(module) {
  const cards = filterRecords(collection("habits")).map(habit => {
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = OFFSET_DATE(index - 6);
      const key = `${date}`;
      return `<button class="habit-day ${habit.days?.[key] ? "checked" : ""}" data-action="habit-toggle" data-id="${esc(habit.id)}" data-date="${key}" aria-label="Toggle habit ${esc(habit.name)} on ${niceDate(date)}">${habit.days?.[key] ? "✓" : new Date(`${date}T12:00:00`).getDate()}</button>`;
    }).join("");
    let streak = 0;
    while (streak < 365 && habit.days?.[OFFSET_DATE(-streak)]) streak++;
    return `<article class="panel habit-card"><div class="habit-top"><span class="habit-emoji">${esc(habit.emoji || "✦")}</span><div class="record-actions"><button data-action="edit" data-key="habits" data-id="${esc(habit.id)}" title="Edit habit">✎</button><button data-action="delete" data-key="habits" data-id="${esc(habit.id)}" title="Delete habit">×</button></div></div><h3>${esc(habit.name)}</h3><span class="habit-streak">${streak ? `✦ ${streak} day streak` : esc(habit.goal || "One day at a time")}</span><div class="habit-days">${days}</div><div class="habit-legend"><span>7 days ago</span><span>Today</span></div></article>`;
  }).join("");
  return `${heading(module.kicker, module.title, module.description, button(module.add, "add-record", true, "+"))}<div class="module-toolbar"><input class="field-control module-search" id="moduleSearch" type="search" value="${esc(searchQuery)}" placeholder="Search habits..."></div>${cards ? `<div class="habit-grid">${cards}</div>` : `<div class="panel">${emptyState("◷", "Your first habit can start whenever you’re ready.")}</div>`}`;
}
function renderNotes(module) {
  const notes = filterRecords(collection("notes")).sort((a,b) => (b.date || "").localeCompare(a.date || ""));
  const cards = notes.map((note,index) => `<article class="panel note-card" data-action="edit-note" data-id="${esc(note.id)}"><div class="note-color" style="background:${["#a285f3","#6bc5ae","#e5a56e"][index % 3]}"></div><h3>${esc(note.title)}</h3><p>${esc(note.body || "A blank page for a new thought.")}</p><div class="note-footer"><span>${esc(note.tag || "Note")}</span><span>${niceDate(note.date)}</span><span class="record-actions"><button data-action="edit" data-key="notes" data-id="${esc(note.id)}" title="Edit note">✎</button><button data-action="delete" data-key="notes" data-id="${esc(note.id)}" title="Delete note">×</button></span></div></article>`).join("");
  return `${heading(module.kicker, module.title, module.description, button(module.add, "add-record", true, "+"))}${toolbar(module,module.key)}${cards ? `<div class="notes-grid">${cards}</div>` : `<div class="panel">${emptyState("▤", "A blank page is a lovely place to begin.")}</div>`}`;
}
function renderCalendar(module) {
  const records = filterRecords(collection("events")).sort((a,b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  const cards = records.map(event => `<article class="panel calendar-card"><div class="date-tile"><strong>${new Date(`${event.date}T12:00:00`).getDate()}</strong><span>${new Date(`${event.date}T12:00:00`).toLocaleDateString(undefined,{month:"short"})}</span></div><div class="calendar-info"><h3>${esc(event.title)}</h3><p>${esc(event.time || "Time TBD")} · ${esc(event.location || "No location")}</p></div><div class="record-actions"><button data-action="edit" data-key="events" data-id="${esc(event.id)}" title="Edit event">✎</button><button data-action="delete" data-key="events" data-id="${esc(event.id)}" title="Delete event">×</button></div></article>`).join("");
  return `${heading(module.kicker, module.title, module.description, button(module.add, "add-record", true, "+"))}${toolbar(module,module.key)}<div class="calendar-list">${cards || `<div class="panel">${emptyState("▦", "Your calendar is wide open. Add a little something.")}</div>`}</div>`;
}
function renderStudent(module) {
  let key = studentTab;
  const tabNames = { subjects: "Subjects", assignments: "Assignments", exams: "Exams", studySessions: "Study log" };
  const addNames = { subjects: "Add subject", assignments: "Add assignment", exams: "Add exam", studySessions: "Log study time" };
  let addFields = module.fields;
  if (key === "assignments") addFields = [["title","Assignment","text",true],["subject","Subject","text"],["due","Due date","date"],["status","Status","select",["To do","In progress","Done"]]];
  if (key === "exams") addFields = [["title","Exam","text",true],["subject","Subject","text"],["date","Exam date","date"]];
  if (key === "studySessions") addFields = [["subject","Subject","text",true],["hours","Hours studied","number",true],["date","Date","date",true]];
  let records = filterRecords(collection(key));
  let columns;
  let extra = "";
  if (key === "subjects") columns = [["name","Subject"],["teacher","Teacher"],["hours","Hours / week"],["color","Area","pill"]];
  if (key === "assignments") columns = [["title","Assignment"],["subject","Subject"],["due","Due","date"],["status","Status","pill"]];
  if (key === "exams") columns = [["title","Exam"],["subject","Subject"],["date","Date","date"]];
  if (key === "studySessions") columns = [["subject","Subject"],["hours","Hours"],["date","Date","date"]];
  const totalHours = collection("studySessions").reduce((sum, item) => sum + Number(item.hours || 0), 0);
  const attendance = data.attendance || { attended: 0, total: 0 };
  const exam = collection("exams").filter(item => item.date >= DAY(TODAY)).sort((a,b) => a.date.localeCompare(b.date))[0];
  const daysUntil = exam ? Math.max(0, Math.ceil((new Date(`${exam.date}T12:00:00`) - new Date(`${DAY(TODAY)}T12:00:00`)) / 86400000)) : null;
  extra = `<div class="stats-grid"><article class="panel stat-card"><div class="stat-top"><span>Study hours logged</span><span class="stat-icon">◷</span></div><div class="stat-value">${totalHours}<span class="stat-note">all time</span></div></article><article class="panel stat-card"><div class="stat-top"><span>Next exam</span><span class="stat-icon">⌑</span></div><div class="stat-value">${daysUntil ?? "—"}<span class="stat-note">${exam ? `days · ${esc(exam.title)}` : "no exams set"}</span></div></article><article class="panel stat-card"><div class="stat-top"><span>Attendance</span><span class="stat-icon">✓</span></div><div class="stat-value">${attendance.total ? Math.round(attendance.attended / attendance.total * 100) : 0}%<span class="stat-note">${attendance.attended} of ${attendance.total} classes</span></div></article></div>`;
  const attendancePanel = `<article class="panel settings-card" style="margin-top:14px"><h2>Attendance tracker</h2><p>Keep an eye on how often you show up.</p><div class="settings-row"><div><strong>${attendance.attended} attended · ${attendance.total} total</strong><small>${attendance.total ? Math.round(attendance.attended / attendance.total * 100) : 0}% attendance rate</small></div><div><button class="button button-small" data-action="attendance-attended">Attended</button> <button class="button button-small" data-action="attendance-missed">Missed</button></div></div></article>`;
  return `${heading("A LITTLE CLOSER EVERY DAY","Student hub","Keep classes, assignments and study time in one place.",button(addNames[key], "student-add", true, "+"))}${extra}<div class="module-toolbar">${Object.entries(tabNames).map(([id,name]) => `<button class="button button-small ${key===id ? "button-primary" : ""}" data-action="student-tab" data-tab="${id}">${name}</button>`).join("")}<input class="field-control module-search" id="moduleSearch" type="search" value="${esc(searchQuery)}" placeholder="Search ${tabNames[key].toLowerCase()}..."></div>${tableView("Student Hub",records,columns,key)}${key === "subjects" ? attendancePanel : ""}`;
}
function renderMoney(module) {
  const records = filterRecords(collection("expenses")).sort((a,b) => (b.date || "").localeCompare(a.date || ""));
  const income = records.filter(item => item.type === "Income").reduce((sum,item) => sum + Number(item.amount || 0),0);
  const spent = records.filter(item => item.type !== "Income").reduce((sum,item) => sum + Number(item.amount || 0),0);
  return `${heading(module.kicker,module.title,module.description,button(module.add,"add-record",true,"+"))}<div class="stats-grid"><article class="panel stat-card"><div class="stat-top"><span>Income recorded</span><span class="stat-icon">↗</span></div><div class="stat-value">${formatMoney(income)}</div></article><article class="panel stat-card"><div class="stat-top"><span>Spending recorded</span><span class="stat-icon">↘</span></div><div class="stat-value">${formatMoney(spent)}</div></article><article class="panel stat-card"><div class="stat-top"><span>Left after spending</span><span class="stat-icon">₹</span></div><div class="stat-value">${formatMoney(income-spent)}</div></article><article class="panel stat-card"><div class="stat-top"><span>Savings rate</span><span class="stat-icon">◎</span></div><div class="stat-value">${income ? Math.max(0,Math.round((income-spent)/income*100)) : 0}%</div></article></div>${toolbar(module,module.key)}${tableView("Money",records,[["title","Transaction"],["category","Category"],["type","Type","pill"],["amount","Amount (₹)","money"],["date","Date","date"]],module.key)}`;
}
function renderWellness(module) {
  const records = filterRecords(collection("wellness")).sort((a,b) => (b.date || "").localeCompare(a.date || ""));
  const today = collection("wellness").find(item => item.date === DAY(TODAY)) || {};
  return `${heading(module.kicker,module.title,module.description,button(module.add,"add-record",true,"+"))}<div class="stats-grid"><article class="panel stat-card"><div class="stat-top"><span>Water today</span><span class="stat-icon">💧</span></div><div class="stat-value">${today.water || 0}<span class="stat-note">glasses · goal 8</span></div></article><article class="panel stat-card"><div class="stat-top"><span>Sleep last night</span><span class="stat-icon">☾</span></div><div class="stat-value">${today.sleep || 0}<span class="stat-note">hours</span></div></article><article class="panel stat-card"><div class="stat-top"><span>Latest weight</span><span class="stat-icon">⌁</span></div><div class="stat-value">${today.weight || records[0]?.weight || "—"}<span class="stat-note">kg</span></div></article><article class="panel stat-card"><div class="stat-top"><span>Movement</span><span class="stat-icon">✳</span></div><div class="stat-value" style="font-size:15px">${esc(today.workout || "Not logged")}</div></article></div>${toolbar(module,module.key)}${tableView("Wellness",records,[["date","Date","date"],["weight","Weight (kg)"],["water","Water"],["sleep","Sleep"],["workout","Movement"]],module.key)}`;
}
function renderGoals(module) {
  const records = filterRecords(collection("goals"));
  const cards = records.map(goal => `<article class="panel habit-card"><div class="habit-top"><span class="pill purple">${esc(goal.category || "Personal")}</span><div class="record-actions"><button data-action="edit" data-key="goals" data-id="${esc(goal.id)}" title="Edit goal">✎</button><button data-action="delete" data-key="goals" data-id="${esc(goal.id)}" title="Delete goal">×</button></div></div><h3>${esc(goal.title)}</h3><span class="habit-streak">Target · ${niceDate(goal.target)}</span><div style="height:5px;margin:15px 0 8px;border-radius:4px;background:rgba(255,255,255,.08)"><div style="width:${Math.max(0,Math.min(100,Number(goal.progress||0)))}%;height:100%;border-radius:4px;background:linear-gradient(90deg,#8965e5,#b29afd)"></div></div><div class="habit-legend"><span>${esc(goal.status || "In progress")}</span><span>${Number(goal.progress || 0)}%</span></div><button class="text-link" data-action="goal-progress" data-id="${esc(goal.id)}">＋ Add progress</button></article>`).join("");
  return `${heading(module.kicker,module.title,module.description,button(module.add,"add-record",true,"+"))}${toolbar(module,module.key)}${cards ? `<div class="habit-grid">${cards}</div>` : `<div class="panel">${emptyState("◎", "A meaningful goal can start with one small step.")}</div>`}`;
}

const AI_TOOLS = [
  ["Personal assistant","✦","A thoughtful partner for whatever’s on your mind."],
  ["Daily planner","◷","Turn a busy day into a plan that feels possible."],
  ["Study assistant","⌑","Understand ideas, make a study guide, or practice."],
  ["Notes summarizer","▤","Find the signal in your notes."],
  ["Idea generator","✧","Get unstuck and explore something new."],
  ["Productivity analyzer","◈","Reflect on your routines and priorities."],
  ["Translator","文","Translate a message while keeping its tone."],
  ["Goal coach","◎","Make your next meaningful step feel clear."]
];
let chatHistory = [];
let reminderTimer = null;
function renderAI() {
  const tool = AI_TOOLS.find(item => item[0] === activeTool) || AI_TOOLS[0];
  const prompt = chatHistory.map(item => `<div class="chat-message ${item.role === "assistant" ? "" : "user"} ${item.error ? "error" : ""}">${esc(item.content)}</div>`).join("");
  return `${heading("A LITTLE HELP, RIGHT WHEN YOU NEED IT","AI studio","A thoughtful co-pilot, here for the big plans and small questions.")}<div class="ai-layout"><aside class="panel ai-tools"><div class="ai-tools-label">YOUR AI TOOLS</div>${AI_TOOLS.map(([name,icon])=>`<button class="ai-tool ${name===activeTool?"active":""}" data-action="select-ai" data-tool="${esc(name)}"><span class="ai-tool-icon">${icon}</span>${esc(name)}</button>`).join("")}</aside><section class="panel ai-chat"><header class="ai-chat-head"><div class="ai-avatar">${tool[1]}</div><div><strong>${esc(tool[0])}</strong><span>Ready when you are · Private to your space</span></div><button class="text-link" style="margin-left:auto" data-action="clear-chat">Clear chat</button></header><div class="chat-messages" id="chatMessages">${prompt || `<div class="chat-welcome"><div class="ai-avatar">${tool[1]}</div><h3>Hi Alex, I’m here to help.</h3><p>${esc(tool[2])} Your messages are sent to the AI provider configured by your VYBE server.</p></div>`}</div><form class="chat-form" id="chatForm"><textarea name="prompt" id="chatPrompt" placeholder="Ask me anything..." required maxlength="12000"></textarea><button class="button button-primary" type="submit" id="chatSend">Send ↗</button></form></section></div>`;
}
function renderSettings() {
  const light = data.preferences?.theme === "light";
  return `${heading("MAKE IT YOURS","Your settings","A few little details about how your space works.")}<div class="settings-grid"><article class="panel settings-card"><h2>Your experience</h2><p>Make VYBE feel right for you.</p><div class="settings-row"><div><strong>Light appearance</strong><small>Switch between a dark and light workspace.</small></div><button class="toggle ${light?"on":""}" data-action="theme-setting" aria-label="Toggle light appearance"></button></div><div class="settings-row"><div><strong>Browser notifications</strong><small>Let your browser remind you about plans.</small></div><button class="toggle ${data.preferences?.notifications?"on":""}" data-action="notifications" aria-label="Toggle notifications"></button></div></article><article class="panel settings-card"><h2>Your data</h2><p>Your information stays in this browser. Download a copy anytime.</p><div class="settings-row"><div><strong>Export your data</strong><small>Save a portable JSON backup.</small></div><button class="button button-small" data-action="export">Export data ↗</button></div><div class="settings-row"><div><strong>Import a backup</strong><small>Restore a previously exported VYBE file.</small></div><button class="button button-small" data-action="import">Choose file ↗</button></div><div class="settings-row"><div><strong>Clear all data</strong><small>This permanently removes this browser’s VYBE data.</small></div><button class="button button-small" data-action="reset" style="color:#f18a93">Clear data</button></div></article><article class="panel settings-card"><h2>AI setup</h2><p>AI requests are sent securely through your VYBE server. Your API key is never stored in this browser.</p><div class="settings-row"><div><strong>Configure your AI provider</strong><small>Set OPENAI_API_KEY on the server, then restart it.</small></div><span class="pill purple">SERVER ONLY</span></div><div class="settings-row"><div><strong>Optional settings</strong><small>AI_API_URL and AI_MODEL can be set as environment variables.</small></div></div></article><article class="panel settings-card"><h2>Your personal space</h2><p>Made for the little moments that add up to a life.</p><div class="settings-row"><div><strong>VYBE</strong><small>Personal life assistant · Data saved locally</small></div><span class="pill green">READY</span></div></article></div>`;
}

function renderPage() {
  chartInstances.forEach(chart => chart.destroy());
  chartInstances = [];
  const pageChanged = renderedPage !== currentPage;
  if (revealObserver) {
    revealObserver.disconnect();
    revealObserver = null;
  }
  const module = MODULES[currentPage];
  let html;
  if (currentPage === "Dashboard") html = renderDashboard();
  else if (currentPage === "Planner") html = renderPlanner();
  else if (currentPage === "AI Studio") html = renderAI();
  else if (currentPage === "Settings") html = renderSettings();
  else if (module?.key === "tasks") html = renderTasks(module);
  else if (module?.key === "habits") html = renderHabits(module);
  else if (module?.key === "notes") html = renderNotes(module);
  else if (module?.key === "events") html = renderCalendar(module);
  else if (currentPage === "Student Hub") html = renderStudent(module);
  else if (currentPage === "Money") html = renderMoney(module);
  else if (currentPage === "Wellness") html = renderWellness(module);
  else if (currentPage === "Goals") html = renderGoals(module);
  else html = renderDashboard();
  $("#pageContent").innerHTML = html;
  if (pageChanged) {
    renderedPage = currentPage;
    revealPageSections();
  }
  if (currentPage === "Dashboard") renderCharts();
  if (currentPage === "AI Studio") $("#chatMessages").scrollTop = $("#chatMessages").scrollHeight;
  scheduleNextReminder();
}

function revealPageSections() {
  const sections = $("#pageContent").querySelectorAll(
    ":scope > *, :scope > * > .panel"
  );
  if (!("IntersectionObserver" in window)) return;

  revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" });

  sections.forEach((section, index) => {
    section.classList.add("scroll-reveal");
    section.style.setProperty("--reveal-delay", `${Math.min(index, 4) * 70}ms`);
    revealObserver.observe(section);
  });
}

function chartOptions() {
  const styles = getComputedStyle(document.body);
  return { color: styles.getPropertyValue("--muted").trim(), grid: styles.getPropertyValue("--border").trim(), purple: styles.getPropertyValue("--purple").trim() || "#a78bfa" };
}
function renderCharts() {
  if (!window.Chart) return;
  const colors = chartOptions();
  const labels = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - 6 + index);
    return date.toLocaleDateString(undefined,{weekday:"short"});
  });
  const values = labels.map((_, index) => {
    const date = OFFSET_DATE(index - 6);
    return collection("tasks").filter(task => task.status === "Done" && (task.completedOn || task.due) === date).length;
  });
  const weekly = new Chart($("#weeklyChart"), {
    type: "bar",
    data: { labels, datasets: [{ data: values, backgroundColor: labels.map((_, i) => i === 6 ? "#a78bfa" : "rgba(142,109,234,.35)"), borderRadius: 5, maxBarThickness: 23 }] },
    options: { maintainAspectRatio: false, plugins: { legend: { display:false }, tooltip: { displayColors:false } }, scales: { x: { grid: { display:false }, ticks: { color:colors.color,font:{size:9} } }, y: { beginAtZero:true, ticks:{stepSize:1,color:colors.color,font:{size:9}}, grid:{color:colors.grid}, border:{display:false} } } }
  });
  const done = collection("tasks").filter(task => task.status === "Done").length;
  const remaining = Math.max(0,collection("tasks").length-done);
  const study = collection("studySessions").length;
  const balance = new Chart($("#balanceChart"), {
    type:"doughnut",
    data:{labels:["Completed","In progress","Study sessions"],datasets:[{data:[done,remaining,study],backgroundColor:["#a78bfa","rgba(142,109,234,.27)","#60c9a5"],borderWidth:0,hoverOffset:4}]},
    options:{maintainAspectRatio:false,cutout:"72%",plugins:{legend:{position:"right",labels:{color:colors.color,usePointStyle:true,pointStyle:"circle",boxWidth:7,padding:14,font:{size:9}}}}}
  });
  chartInstances.push(weekly,balance);
}

function addRecord() {
  if (currentPage === "Student Hub") {
    if (studentTab === "subjects") openModal(currentPage);
    else {
      const fields = studentTab === "assignments"
        ? [["title","Assignment","text",true],["subject","Subject","text"],["due","Due date","date"],["status","Status","select",["To do","In progress","Done"]]]
        : studentTab === "exams"
          ? [["title","Exam","text",true],["subject","Subject","text"],["date","Exam date","date"]]
          : [["subject","Subject","text",true],["hours","Hours studied","number",true],["date","Date","date",true]];
      openModal(currentPage, null, fields);
    }
    return;
  }
  openModal(currentPage);
}
function deleteRecord(key, id) {
  const record = collection(key).find(item => item.id === id);
  if (!record || !confirm(`Delete “${record.title || record.name || record.subject || "this item"}”? This can’t be undone.`)) return;
  data[key] = collection(key).filter(item => item.id !== id);
  save(); renderPage(); toast("Removed from your space.");
}
function toggleTask(id) {
  const task = collection("tasks").find(item => item.id === id);
  if (!task) return;
  task.status = task.status === "Done" ? "To do" : "Done";
  if (task.status === "Done") task.completedOn = DAY(TODAY);
  else delete task.completedOn;
  save(); renderPage();
}
function onAction(target) {
  const action = target.dataset.action;
  const id = target.dataset.id;
  if (action === "add-record") return addRecord();
  if (action === "toggle-menu") {
    $("#sidebar").classList.toggle("open");
    $("#sidebarOverlay").hidden = !$("#sidebar").classList.contains("open");
    return;
  }
  if (action === "close-menu") {
    $("#sidebar").classList.remove("open");
    $("#sidebarOverlay").hidden = true;
    return;
  }
  if (action === "add-task") { go("Tasks"); return openModal("Tasks"); }
  if (action === "add-note") { go("Notes"); return openModal("Notes"); }
  if (action === "add-event") { go("Calendar"); return openModal("Calendar"); }
  if (action === "plan-day") { activeTool = "Daily planner"; chatHistory = []; go("AI Studio"); }
  if (action === "show-reminders") { go("Calendar"); return; }
  if (action === "edit" || action === "edit-note") {
    const key = target.dataset.key || "notes";
    const moduleName = Object.keys(MODULES).find(name => MODULES[name].key === key) || (key === "assignments" || key === "exams" || key === "studySessions" ? "Student Hub" : null);
    if (!moduleName) return;
    if (moduleName === "Student Hub") studentTab = key;
    if (moduleName === "Student Hub") {
      const fields = key === "assignments" ? [["title","Assignment","text",true],["subject","Subject","text"],["due","Due date","date"],["status","Status","select",["To do","In progress","Done"]]]
        : key === "exams" ? [["title","Exam","text",true],["subject","Subject","text"],["date","Exam date","date"]]
          : key === "studySessions" ? [["subject","Subject","text",true],["hours","Hours studied","number",true],["date","Date","date",true]]
            : MODULES[moduleName].fields;
      return openModal(moduleName,id,fields);
    }
    return openModal(moduleName,id);
  }
  if (action === "delete") return deleteRecord(target.dataset.key,id);
  if (action === "toggle-task") return toggleTask(id);
  if (action === "habit-toggle") {
    const habit = collection("habits").find(item => item.id === id);
    if (!habit) return;
    habit.days ||= {};
    if (habit.days[target.dataset.date]) delete habit.days[target.dataset.date];
    else habit.days[target.dataset.date] = true;
    save(); renderPage(); return;
  }
  if (action === "student-tab") { studentTab = target.dataset.tab; searchQuery = ""; renderPage(); return; }
  if (action === "student-add") return addRecord();
  if (action === "attendance-attended" || action === "attendance-missed") {
    data.attendance ||= { attended:0,total:0 };
    data.attendance.total++;
    if (action === "attendance-attended") data.attendance.attended++;
    save(); renderPage(); return;
  }
  if (action === "goal-progress") {
    const goal = collection("goals").find(item => item.id === id);
    const progress = prompt("How much progress would you like to add? (0–100)", "10");
    if (progress === null) return;
    if (!Number.isFinite(Number(progress))) return toast("Please enter a number from 0 to 100.", "error");
    if (goal) goal.progress = Math.max(0,Math.min(100,Number(goal.progress||0)+Number(progress)));
    save(); renderPage(); toast("Progress updated. Look at you go.");
    return;
  }
  if (action === "select-ai") { activeTool = target.dataset.tool; chatHistory = []; renderPage(); return; }
  if (action === "clear-chat") { chatHistory = []; renderPage(); return; }
  if (action === "theme-setting") { toggleTheme(); return; }
  if (action === "notifications") {
    if (!("Notification" in window)) return toast("This browser does not support notifications.", "error");
    if (data.preferences?.notifications && Notification.permission === "granted") {
      data.preferences.notifications = false; save(); renderPage(); return;
    }
    Notification.requestPermission().then(permission => {
      data.preferences.notifications = permission === "granted";
      save(); renderPage();
      toast(permission === "granted" ? "Browser notifications are enabled." : "Notification permission was not granted.");
    });
    return;
  }
  if (action === "export") return exportData();
  if (action === "import") { $("#importInput").click(); return; }
  if (action === "reset") {
    if (!confirm("Clear all VYBE data from this browser? This cannot be undone.")) return;
    data = defaultData(); save(); setTheme(); go("Dashboard"); toast("Your space is fresh again.");
  }
}
function toggleTheme() {
  data.preferences ||= {};
  data.preferences.theme = data.preferences.theme === "light" ? "dark" : "light";
  save(); setTheme(); renderPage();
}
function scheduleNextReminder() {
  clearTimeout(reminderTimer);
  reminderTimer = null;
  if (!data.preferences?.notifications || !("Notification" in window) || Notification.permission !== "granted") return;
  const now = Date.now();
  const next = collection("events").map(event => {
    const lead = event.reminder === "At time" ? 0 : event.reminder === "10 minutes before" ? 10 : event.reminder === "1 hour before" ? 60 : null;
    if (lead === null || !event.date) return null;
    const at = new Date(`${event.date}T${event.time || "09:00"}`).getTime() - lead * 60_000;
    const key = `vybe-reminder:${event.id}:${at}`;
    return at > now && !localStorage.getItem(key) ? { event, at, key } : null;
  }).filter(Boolean).sort((a, b) => a.at - b.at)[0];
  if (!next) return;
  reminderTimer = setTimeout(() => {
    try {
      localStorage.setItem(next.key, "1");
      const notice = new Notification(`Coming up: ${next.event.title}`, {
        body: next.event.location || next.event.details || "Your VYBE reminder",
        icon: "icon.svg"
      });
      notice.onclick = () => window.focus();
    } catch (error) {
      console.error("Could not show the event reminder:", error);
      toast("Could not show a browser reminder.", "error");
    }
    scheduleNextReminder();
  }, Math.min(next.at - now, 2_147_000_000));
}
function exportData() {
  const blob = new Blob([JSON.stringify({ version:1, exportedAt:new Date().toISOString(), data },null,2)],{type:"application/json"});
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `vybe-backup-${DAY(TODAY)}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
  toast("Your VYBE backup is ready.");
}
async function importData(file) {
  try {
    const parsed = JSON.parse(await file.text());
    const imported = parsed.data || parsed;
    const validKeys = Object.keys(defaultData());
    if (!imported || typeof imported !== "object" || !validKeys.some(key => Array.isArray(imported[key]))) throw new Error("This file does not look like a VYBE backup.");
    if (!confirm("Import this backup and replace the data in this browser?")) return;
    const fresh = defaultData();
    for (const key of validKeys) {
      if (key === "preferences" || key === "attendance") data[key] = { ...fresh[key], ...(imported[key] || {}) };
      else if (Array.isArray(imported[key])) data[key] = imported[key];
    }
    save(); setTheme(); go("Dashboard"); toast("Your backup has been imported.");
  } catch (error) {
    toast(error.message || "Could not read that backup file.", "error");
  } finally { $("#importInput").value = ""; }
}
function makeToolPrompt(prompt) {
  const context = {
    "Personal assistant":"You are a warm, practical personal life assistant. Be clear, kind, and concise.",
    "Daily planner":"You are a thoughtful daily planning assistant. Make realistic schedules with breaks and priorities.",
    "Study assistant":"You are a patient study coach. Explain concepts clearly, check understanding, and never just give an answer when teaching would help.",
    "Notes summarizer":"You summarize notes faithfully. Preserve key ideas, decisions, and next steps; never invent facts.",
    "Idea generator":"You are a curious, imaginative brainstorm partner. Offer distinct, useful options.",
    "Productivity analyzer":"You are a non-judgmental productivity coach. Find practical patterns and suggest gentle improvements. Do not invent personal data.",
    "Translator":"You translate text accurately while preserving tone and idiom. Ask for the target language if it is unclear.",
    "Goal coach":"You are a supportive goal coach. Help turn aspirations into small, measurable next steps without pressure."
  }[activeTool] || "You are a helpful personal assistant.";
  return `${context}\n\n${prompt}`;
}
async function sendAI(event) {
  event.preventDefault();
  const input = $("#chatPrompt");
  const content = input.value.trim();
  if (!content) return;
  input.value = "";
  chatHistory.push({ role:"user", content });
  renderPage();
  $("#chatSend").disabled = true;
  const loading = document.createElement("div");
  loading.className = "chat-message";
  loading.textContent = "Thinking…";
  $("#chatMessages").append(loading);
  try {
    const messages = [{ role:"system", content:makeToolPrompt("") }, ...chatHistory.slice(-12)];
    const response = await fetch(new URL("api/ai", document.baseURI),{ method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({messages}) });
    const contentType = response.headers.get("content-type") || "";
    const result = contentType.includes("application/json") ? await response.json().catch(() => ({})) : {};
    if (!response.ok) throw new Error(result.error || `AI request failed (${response.status}).`);
    if (typeof result.content !== "string" || !result.content.trim()) throw new Error("The AI service is not configured for this host yet.");
    chatHistory.push({ role:"assistant", content:result.content });
  } catch (error) {
    chatHistory.push({ role:"assistant", content:error.message || "Something went wrong while contacting the AI service.", error:true });
  }
  renderPage();
}

document.addEventListener("click", event => {
  const pageButton = event.target.closest("[data-page]");
  if (pageButton) { event.preventDefault(); go(pageButton.dataset.page); return; }
  const action = event.target.closest("[data-action]");
  if (action) { event.preventDefault(); onAction(action); }
});
document.addEventListener("submit", event => {
  if (event.target.id === "recordForm") storeForm(event);
  if (event.target.id === "chatForm") sendAI(event);
});
document.addEventListener("input", event => {
  if (event.target.id === "moduleSearch") {
    searchQuery = event.target.value;
    const position = event.target.selectionStart;
    renderPage();
    const input = $("#moduleSearch");
    if (input) { input.focus(); input.setSelectionRange(position,position); }
  }
  if (event.target.id === "globalSearch") {
    searchQuery = event.target.value;
    if (currentPage === "AI Studio" || currentPage === "Settings") return;
    if (currentPage === "Dashboard") {
      currentPage = "Tasks";
      $("#currentPage").textContent = currentPage;
      renderNav();
    }
    renderPage();
  }
});
document.addEventListener("change", event => {
  if (event.target.id === "moduleFilter") { moduleFilter = event.target.value; renderPage(); }
  if (event.target.id === "plannerDate") { plannerDate = event.target.value || DAY(TODAY); renderPage(); }
  if (event.target.id === "importInput" && event.target.files?.[0]) importData(event.target.files[0]);
});
$("#themeToggle").addEventListener("click", toggleTheme);
$("#menuToggle").addEventListener("click", () => {
  $("#sidebar").classList.toggle("open");
  $("#sidebarOverlay").hidden = !$("#sidebar").classList.contains("open");
});
$("#modalClose").addEventListener("click", closeModal);
$("#modalCancel").addEventListener("click", closeModal);
$("#modalBackdrop").addEventListener("click", event => { if (event.target.id === "modalBackdrop") closeModal(); });
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeModal();
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); $("#globalSearch").focus(); }
});
setTheme();
renderNav();
renderPage();
if ("serviceWorker" in navigator && location.protocol !== "file:") navigator.serviceWorker.register(new URL("service-worker.js", document.baseURI)).catch(error => console.error("Could not register the app service worker:", error));
