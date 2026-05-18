const topics = [
  {
    id: "algebra",
    icon: "🔣",
    title: "Algebraic Expressions & Formulae",
    description: "Manipulation of equations and symbolic reasoning.",
    color: "#60a5fa",
    active: true,
    subtopics: [
      {
        id: "simplification",
        title: "Simplification of Linear Expressions",
        description: "Expand brackets and combine like terms.",
        active: true
      },
      {
        id: "factorisation",
        title: "Factorisation",
        description: "Finding common factors and rewriting expressions.",
        active: false
      },
      {
        id: "linear-equations",
        title: "Linear Equations",
        description: "Solving equations with one unknown.",
        active: false
      },
      {
        id: "quadratic-expressions",
        title: "Quadratic Expressions",
        description: "Expanding and simplifying quadratic terms.",
        active: false
      }
    ]
  },
  {
    id: "fractions",
    icon: "➗",
    title: "Fractions & Rational Expressions",
    description: "Quantitative reasoning and proportional thinking.",
    color: "#34d399",
    active: false,
    subtopics: []
  },
  {
    id: "graphs",
    icon: "📈",
    title: "Functions & Graphs",
    description: "Interpretation, application, and conceptual understanding.",
    color: "#a78bfa",
    active: false,
    subtopics: []
  }
];

const lessons = {
  simplification: {
    topicId: "algebra",
    title: "Simplification of Linear Expressions",
    flow: "Learning flow: Scope → Quick Watch → Learn Properly → Key Notes → Interactive Worksheet → Understanding Check.",

    scope: "This lesson focuses on simplifying linear algebraic expressions by expanding brackets and combining like terms.",

    objectives: [
      "Identify terms inside and outside brackets.",
      "Expand brackets correctly.",
      "Multiply the number outside the bracket to every term inside.",
      "Combine like terms after expanding.",
      "Simplify linear expressions step by step."
    ],

    formLink: "https://forms.office.com/r/cA0d4TY6Dw",

    videos: {
      quick: {
        title: "⚡ Quick Watch",
        desc: "A short video to capture attention before learning.",
        embed: "https://www.youtube.com/embed/yuzEM48O1uM",
        open: "https://www.youtube.com/shorts/yuzEM48O1uM"
      },
      main: {
        title: "📺 Learn Properly",
        desc: "A clearer explanation before attempting the worksheet.",
        embed: "https://www.youtube.com/embed/JucSVDuV0mg",
        open: "https://www.youtube.com/watch?v=JucSVDuV0mg"
      }
    },

    notes: [
      "Expand brackets first.",
      "Multiply the number outside to every term inside the bracket.",
      "Take care of positive and negative signs.",
      "Combine like terms only after expanding."
    ],

    questions: [
      {
        question: "Expand: 3(x + 4)",
        placeholder: "Example: 3(x) + 3(4)",
        answer: "3x+12",
        hints: [
          "Multiply 3 with both x and 4.",
          "3 × x = 3x and 3 × 4 = 12.",
          "Guided hint: Write it as 3(x) + 3(4), then simplify."
        ]
      },
      {
        question: "Expand and simplify: 2(x + 3) + 4x",
        placeholder: "Step 1: expand. Step 2: combine like terms.",
        answer: "6x+6",
        hints: [
          "Expand 2(x + 3) first.",
          "2(x + 3) becomes 2x + 6.",
          "Guided hint: After expanding, combine 2x + 4x."
        ]
      },
      {
        question: "Simplify: 3(2x + 1) - 2(x - 1)",
        placeholder: "Expand both brackets, then combine like terms.",
        answer: "4x+5",
        hints: [
          "Expand both brackets separately.",
          "Be careful with the negative sign in -2(x - 1).",
          "Guided hint: You should get 6x + 3 - 2x + 2 before combining."
        ]
      }
    ]
  }
};

// ================= ENGINE ZONE =================

const totalMainTopics = topics.length;
let currentTopicId = null;
let currentLessonId = null;
let worksheetCompleted = {};
let attempts = {};

function getCompletedLessons() {
  return JSON.parse(localStorage.getItem("completedLessons")) || [];
}

function saveCompletedLessons(data) {
  localStorage.setItem("completedLessons", JSON.stringify(data));
}

function normaliseAnswer(answer) {
  return answer.toLowerCase().replace(/\s+/g, "");
}

function showPage(pageId) {
  document.getElementById("homePage").classList.add("hidden");
  document.getElementById("subtopicPage").classList.add("hidden");
  document.getElementById("lessonPage").classList.add("hidden");

  document.getElementById(pageId).classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderTopics() {
  const container = document.getElementById("topicContainer");
  container.innerHTML = "";

  const completedLessons = getCompletedLessons();

  topics.forEach((topic, index) => {
    const lessonIdsForTopic = Object.keys(lessons).filter(
      lessonId => lessons[lessonId].topicId === topic.id
    );

    const topicCompleted =
      lessonIdsForTopic.length > 0 &&
      lessonIdsForTopic.every(lessonId => completedLessons.includes(lessonId));

    const card = document.createElement("article");
    card.className = `card ${!topic.active ? "locked" : ""} ${index === 2 ? "wide" : ""}`;
    card.style.setProperty("--strip", topic.color);

    if (topicCompleted) card.classList.add("completed");

    card.innerHTML = `
      <div class="card-title">
        <div class="title-left">
          <span class="icon">${topic.icon}</span>
          <span class="title-text">${topic.title}</span>
        </div>

        <span class="tick" style="--percent:${topicCompleted ? "100%" : "0%"}">
          <span>${topicCompleted ? "✓" : ""}</span>
        </span>
      </div>

      <p>${topic.description}</p>

      ${
        topic.active
          ? `<button class="btn primary" onclick="openTopic('${topic.id}')">Start Topic</button>`
          : `<span class="badge">Coming Soon</span>`
      }
    `;

    container.appendChild(card);
  });
}

function openTopic(topicId) {
  currentTopicId = topicId;

  const topic = topics.find(t => t.id === topicId);

  document.getElementById("topicTitle").textContent = `${topic.icon} ${topic.title}`;
  document.getElementById("topicDescription").textContent = "Choose a subtopic below.";

  renderSubtopics(topic);
  showPage("subtopicPage");
}

function renderSubtopics(topic) {
  const container = document.getElementById("subtopicContainer");
  const completedLessons = getCompletedLessons();

  container.innerHTML = "";

  topic.subtopics.forEach(subtopic => {
    const completed = completedLessons.includes(subtopic.id);

    const card = document.createElement("article");
    card.className = `subcard ${!subtopic.active ? "locked" : ""}`;
    card.style.setProperty("--strip", "#fbbf24");

    if (completed) card.classList.add("completed");

    card.innerHTML = `
      <h3 class="card-title">
        <div class="title-left">
          <span class="title-text">${subtopic.title}</span>
        </div>

        <span class="tick" style="--percent:${completed ? "100%" : "0%"}">
          <span>${completed ? "✓" : ""}</span>
        </span>
      </h3>

      <p>${subtopic.description}</p>

      ${
        subtopic.active
          ? `<button class="btn primary" onclick="openLesson('${subtopic.id}')">Open Lesson</button>`
          : `<span class="badge">Coming Soon</span>`
      }
    `;

    container.appendChild(card);
  });
}

function openLesson(lessonId) {
  currentLessonId = lessonId;

  const lesson = lessons[lessonId];

  worksheetCompleted = {};
  attempts = {};

  lesson.questions.forEach((_, index) => {
    worksheetCompleted[index] = false;
    attempts[index] = 0;
  });

  document.getElementById("lessonTitle").textContent = lesson.title;
  document.getElementById("lessonFlow").textContent = lesson.flow;

  renderLessonContent(lesson);
  showPage("lessonPage");
  updateWorksheetUnlock();
}

function renderLessonContent(lesson) {
  const container = document.getElementById("lessonContent");

  const objectivesHTML = lesson.objectives
    ? lesson.objectives.map(item => `<li>${item}</li>`).join("")
    : "";

  const notesHTML = lesson.notes.map(note => `<li>${note}</li>`).join("");

  const questionsHTML = lesson.questions.map((item, index) => `
    <div class="question-card">
      <h4>Question ${index + 1}</h4>
      <p><strong>${item.question}</strong></p>

      <label>Working Space</label>
      <textarea id="working${index}" placeholder="${item.placeholder}"></textarea>

      <label>Final Answer</label>
      <input id="answer${index}" type="text" placeholder="Type final answer">

      <button class="btn primary" onclick="checkAnswer(${index})">Check Answer</button>
      <p class="feedback" id="feedback${index}"></p>
    </div>
  `).join("");

  container.innerHTML = `
    <div class="objective-box">
      <h3>🎯 Scope of Learning</h3>
      <p>${lesson.scope}</p>

      <h3>What You Will Learn</h3>
      <p class="muted">By the end of this lesson, you should be able to:</p>
      <ul>${objectivesHTML}</ul>
    </div>

    <div class="lesson-box">
      <h3>🎬 1. Watch</h3>
      <p class="muted">Start with a quick video, then watch the main explanation.</p>

      <div class="video-grid">

        <div class="video-card">
          <h4>${lesson.videos.quick.title}</h4>
          <p class="muted">${lesson.videos.quick.desc}</p>

          <div class="short-video-wrap">
            <iframe src="${lesson.videos.quick.embed}" title="Quick Video" allowfullscreen></iframe>
          </div>

          <a class="btn ghost" href="${lesson.videos.quick.open}" target="_blank">Open Quick Video</a>
        </div>

        <div class="video-card">
          <h4>${lesson.videos.main.title}</h4>
          <p class="muted">${lesson.videos.main.desc}</p>

          <div class="main-video-wrap">
            <iframe src="${lesson.videos.main.embed}" title="Main Video" allowfullscreen></iframe>
          </div>

          <a class="btn ghost" href="${lesson.videos.main.open}" target="_blank">Open Main Video</a>
        </div>

      </div>
    </div>

    <div class="lesson-box">
      <h3>📘 2. Key Notes</h3>
      <ul>${notesHTML}</ul>
    </div>

    <div class="lesson-box">
      <h3>✍ 3. Interactive Worksheet</h3>
      <p class="muted">Type your working before checking your answer. Hints will appear after wrong attempts.</p>
      ${questionsHTML}
    </div>

    <div class="check-box">
      <h3>🧠 4. Check Your Understanding</h3>

      <p class="muted">
        After completing the worksheet, proceed to the Microsoft Form understanding check.
      </p>

      <button class="btn primary" id="formButton" disabled>
        Open Microsoft Form
      </button>

      <p class="hint" id="unlockMessage">
        Complete all questions to unlock this form.
      </p>
    </div>
  `;

  const formButton = document.getElementById("formButton");

  if (formButton) {
    formButton.addEventListener("click", () => {
      window.open(lesson.formLink, "_blank");

      const completed = getCompletedLessons();

      if (!completed.includes(currentLessonId)) {
        completed.push(currentLessonId);
        saveCompletedLessons(completed);
      }

      updateProgress();
      renderTopics();

      const topic = topics.find(t => t.id === currentTopicId);
      if (topic) renderSubtopics(topic);

      alert("Lesson completed! Please submit your Microsoft Form.");
    });
  }
}

function checkAnswer(questionIndex) {
  const lesson = lessons[currentLessonId];
  const item = lesson.questions[questionIndex];

  const working = document.getElementById("working" + questionIndex).value.trim();
  const answer = document.getElementById("answer" + questionIndex).value.trim();
  const feedback = document.getElementById("feedback" + questionIndex);

  if (working.length < 5) {
    feedback.textContent = "Please show your working before checking your answer.";
    feedback.style.color = "#dc2626";
    return;
  }

  if (normaliseAnswer(answer) === normaliseAnswer(item.answer)) {
    feedback.textContent = "Correct! Good job showing your working.";
    feedback.style.color = "#15803d";
    worksheetCompleted[questionIndex] = true;
  } else {
    attempts[questionIndex]++;

    const hintIndex = Math.min(attempts[questionIndex] - 1, item.hints.length - 1);
    feedback.textContent = "Try again. " + item.hints[hintIndex];
    feedback.style.color = "#dc2626";
    worksheetCompleted[questionIndex] = false;
  }

  updateWorksheetUnlock();
}

function updateWorksheetUnlock() {
  const formButton = document.getElementById("formButton");
  const unlockMessage = document.getElementById("unlockMessage");

  if (!formButton || !unlockMessage) return;

  const allDone = Object.values(worksheetCompleted).every(
    value => value === true
  );

  if (allDone) {
    formButton.disabled = false;

    unlockMessage.textContent =
      "All questions completed. You may now proceed to the Microsoft Form.";

    unlockMessage.style.color = "#15803d";
  } else {
    formButton.disabled = true;

    unlockMessage.textContent =
      "Complete all worksheet questions to unlock the understanding check.";

    unlockMessage.style.color = "#6b7280";
  }
}

function updateProgress() {
  const completedLessons = getCompletedLessons();

  const completedMainTopics = topics.filter(topic => {
    const lessonIdsForTopic = Object.keys(lessons).filter(
      lessonId => lessons[lessonId].topicId === topic.id
    );

    return (
      lessonIdsForTopic.length > 0 &&
      lessonIdsForTopic.every(lessonId => completedLessons.includes(lessonId))
    );
  }).length;

  const progress = Math.round((completedMainTopics / totalMainTopics) * 100);

  document.getElementById("progressFill").style.width = progress + "%";
  document.getElementById("progressText").textContent =
    completedMainTopics + " / " + totalMainTopics + " Main Topics Completed";
}

document.getElementById("backHome").addEventListener("click", () => {
  showPage("homePage");
});

document.getElementById("backSubtopics").addEventListener("click", () => {
  showPage("subtopicPage");
});

document.getElementById("resetBtn").addEventListener("click", () => {
  localStorage.removeItem("completedLessons");
  worksheetCompleted = {};
  attempts = {};

  updateProgress();
  renderTopics();

  if (currentTopicId) {
    const topic = topics.find(t => t.id === currentTopicId);
    if (topic) renderSubtopics(topic);
  }
});

renderTopics();
updateProgress();
