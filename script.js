const phaseData = [
  {
    phase: 'Phase 1',
    title: 'Core Employability Skills',
    timeline: 'Days 1–30',
    items: [
      'Learn SQL basics: SELECT, WHERE, GROUP BY, ORDER BY',
      'Practice joins, subqueries, and aggregate functions',
      'Work with Pandas and NumPy for data cleaning',
      'Use Excel for pivot tables, formulas, and charts',
      'Build one data-cleaning project from a messy dataset'
    ]
  },
  {
    phase: 'Phase 2',
    title: 'BI, Dashboards, and Storytelling',
    timeline: 'Days 31–60',
    items: [
      'Create a Power BI or Tableau dashboard project',
      'Learn KPI design and dashboard storytelling',
      'Work with public datasets and derive business insights',
      'Practice API-based data collection with Python',
      'Write a short data analysis report with recommendations'
    ]
  },
  {
    phase: 'Phase 3',
    title: 'AI-Enabled Analytics',
    timeline: 'Days 61–90',
    items: [
      'Use AI to extract insights from PDFs or reports',
      'Summarize public or government data using structured workflows',
      'Build a workflow that cleans and transforms AI-assisted outputs',
      'Create a mini research assistant for analysis tasks',
      'Prepare a portfolio-ready case study for job applications'
    ]
  }
];

const tasks = phaseData.flatMap((phase) =>
  phase.items.map((item, index) => ({
    id: `${phase.phase}-${index}`,
    phase: phase.phase,
    title: item,
    description: phase.title,
    checked: false
  }))
);

const storageKey = 'deeksha-roadmap-progress';

function loadProgress() {
  const saved = localStorage.getItem(storageKey);
  if (!saved) return tasks;

  try {
    const parsed = JSON.parse(saved);
    return tasks.map((task) => {
      const match = parsed.find((item) => item.id === task.id);
      return match ? { ...task, checked: match.checked } : task;
    });
  } catch (error) {
    return tasks;
  }
}

const progressItems = loadProgress();

function renderPhaseCards() {
  const container = document.getElementById('phaseCards');
  container.innerHTML = phaseData
    .map(
      (phase) => `
        <article class="phase-card">
          <span class="phase-meta">${phase.timeline}</span>
          <h3>${phase.title}</h3>
          <ul>
            ${phase.items
              .map(
                (item) => `<li>${item}</li>`
              )
              .join('')}
          </ul>
        </article>
      `
    )
    .join('');
}

function renderTaskList() {
  const list = document.getElementById('taskList');
  list.innerHTML = progressItems
    .map(
      (task) => `
        <label class="task-item ${task.checked ? 'checked' : ''}">
          <input type="checkbox" data-id="${task.id}" ${task.checked ? 'checked' : ''} />
          <div class="task-content">
            <span class="task-phase">${task.phase}</span>
            <strong>${task.title}</strong>
            <span>${task.description}</span>
          </div>
        </label>
      `
    )
    .join('');

  updateProgress();
}

function updateProgress() {
  const total = progressItems.length;
  const done = progressItems.filter((item) => item.checked).length;
  const percent = total ? Math.round((done / total) * 100) : 0;

  document.getElementById('progressFill').style.width = `${percent}%`;
  document.getElementById('progressText').textContent = `${percent}% complete`;
  document.getElementById('progressCount').textContent = `${done} / ${total} tasks`;
}

function saveProgress() {
  localStorage.setItem(storageKey, JSON.stringify(progressItems));
}

function handleCheckboxChange(event) {
  const target = event.target;
  if (!target.matches('input[type="checkbox"]')) return;

  const taskId = target.dataset.id;
  const task = progressItems.find((item) => item.id === taskId);
  if (!task) return;

  task.checked = target.checked;
  saveProgress();
  renderTaskList();
}

function resetProgress() {
  progressItems.forEach((task) => {
    task.checked = false;
  });
  saveProgress();
  renderTaskList();
}

document.getElementById('taskList').addEventListener('change', handleCheckboxChange);
document.getElementById('resetProgress').addEventListener('click', resetProgress);

renderPhaseCards();
renderTaskList();
