const accessLogKey = 'deeksha-access-log';

function renderAccessLog() {
  const list = document.getElementById('visitorLogList');
  const lastStamp = document.getElementById('lastAccessStamp');
  const logs = JSON.parse(localStorage.getItem(accessLogKey) || '[]');

  if (list) {
    if (!logs.length) {
      list.innerHTML = '<li>No visits recorded yet.</li>';
      return;
    }

    list.innerHTML = logs
      .map((entry) => `<li>${entry.label}</li>`)
      .join('');
  }

  if (lastStamp && logs.length) {
    lastStamp.textContent = logs[0].label;
  }
}

function recordAccess() {
  const logEntry = {
    time: new Date().toISOString(),
    label: new Date().toLocaleString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  };

  const existing = JSON.parse(localStorage.getItem(accessLogKey) || '[]');
  const updated = [logEntry, ...existing].slice(0, 10);
  localStorage.setItem(accessLogKey, JSON.stringify(updated));
  renderAccessLog();
}

const phaseData = [
  {
    phase: 'Foundation',
    title: 'SQL, Excel & Data Basics',
    items: [
      'Learn SQL basics: SELECT, WHERE, GROUP BY, ORDER BY',
      'Practice joins, subqueries, and aggregate functions',
      'Work with Pandas and NumPy for data cleaning',
      'Use Excel for pivot tables, formulas, and charts',
      'Build one data-cleaning project from a messy dataset'
    ]
  },
  {
    phase: 'Practice',
    title: 'BI, Dashboards & Storytelling',
    items: [
      'Create a Power BI or Tableau dashboard project',
      'Learn KPI design and dashboard storytelling',
      'Work with public datasets and derive business insights',
      'Practice API-based data collection with Python',
      'Write a short data analysis report with recommendations'
    ]
  },
  {
    phase: 'Confidence',
    title: 'AI-Enabled Analytics',
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
          <span class="phase-meta">${phase.phase}</span>
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

  let phase = 'Foundation';
  if (percent >= 67) {
    phase = 'Confidence';
  } else if (percent >= 34) {
    phase = 'Practice';
  }

  const encouragementBox = document.getElementById('encouragementBox');
  let message = 'Well done for taking one more step forward. Every small effort counts, and every completed task brings you closer to confidence.';

  if (percent >= 100) {
    message = 'Amazing work, Deeksha! 🎉 You completed the full learning path. Your consistency is creating real confidence.';
  } else if (percent >= 75) {
    message = 'Dear Deeksha, you are almost there. 🌟 Keep going — your effort is already becoming strength.';
  } else if (percent >= 50) {
    message = 'Great progress, Deeksha! 💪 You are building momentum, and that matters more than perfection.';
  } else if (percent >= 25) {
    message = 'Nice effort, Deeksha! 🌱 Small steps are still strong steps, and you are moving forward.';
  }

  if (encouragementBox) {
    encouragementBox.innerHTML = `<p>${message}</p>`;
  }

  document.getElementById('progressFill').style.width = `${percent}%`;
  document.getElementById('progressText').textContent = `${percent}% complete`;
  document.getElementById('progressCount').textContent = `${done} / ${total} tasks`;
  document.getElementById('currentPhase').textContent = phase;
  document.getElementById('heroProgress').textContent = `${percent}%`;
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

const quizData = [
  {
    question: 'Which SQL clause is used to filter rows before grouping?',
    options: ['WHERE', 'GROUP BY', 'HAVING', 'ORDER BY'],
    answer: 'WHERE',
    explanation: 'WHERE filters rows before aggregation, while HAVING filters grouped results.'
  },
  {
    question: 'Which tool is commonly used to create interactive dashboards for business reporting?',
    options: ['Power BI', 'Git', 'HTML', 'Windows'],
    answer: 'Power BI',
    explanation: 'Power BI is widely used for interactive dashboard reporting and data visualization.'
  },
  {
    question: 'What is the best next step when a concept feels difficult?',
    options: ['Skip it and continue', 'Revisit the resource and practice again', 'Ignore it completely', 'Only read once'],
    answer: 'Revisit the resource and practice again',
    explanation: 'Strong learning comes from repetition, revision, and guided practice.'
  }
];

let quizIndex = 0;

function renderQuiz() {
  const question = quizData[quizIndex];
  const questionEl = document.getElementById('quizQuestion');
  const optionsEl = document.getElementById('quizOptions');
  const feedbackEl = document.getElementById('quizFeedback');

  if (!question || !questionEl || !optionsEl) return;

  questionEl.textContent = question.question;
  optionsEl.innerHTML = '';
  feedbackEl.textContent = '';

  question.options.forEach((option) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'quiz-option';
    button.textContent = option;
    button.addEventListener('click', () => {
      const isCorrect = option === question.answer;
      const buttons = optionsEl.querySelectorAll('.quiz-option');

      buttons.forEach((btn) => {
        btn.disabled = true;
        if (btn.textContent === question.answer) {
          btn.classList.add('correct');
        }
        if (btn === button && !isCorrect) {
          btn.classList.add('incorrect');
        }
      });

      feedbackEl.textContent = isCorrect
        ? `Correct — ${question.explanation}`
        : `Not quite. ${question.explanation}`;

      setTimeout(() => {
        quizIndex = (quizIndex + 1) % quizData.length;
        renderQuiz();
      }, 1500);
    });

    optionsEl.appendChild(button);
  });
}

const taskList = document.getElementById('taskList');
if (taskList) {
  taskList.addEventListener('change', handleCheckboxChange);
}

const resetButton = document.getElementById('resetProgress');
if (resetButton) {
  resetButton.addEventListener('click', resetProgress);
}

recordAccess();

document.addEventListener('keydown', (event) => {
  const isShortcut = (event.ctrlKey || event.metaKey) && event.shiftKey && event.key.toLowerCase() === 'y';
  if (!isShortcut) return;

  const ownerScore = document.querySelector('.owner-score');
  if (!ownerScore) return;

  ownerScore.classList.toggle('hidden');
});

renderPhaseCards();
renderTaskList();
renderQuiz();
