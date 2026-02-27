// ======================================================
// 🚫 DO NOT TOUCH (for now):
// This is the "flow logic" that unlocks quizzes after revision.
// ======================================================
function unlockQuiz(topic){
  const quiz = document.getElementById(`quiz-${topic}`);
  const link = document.getElementById(`link-quiz-${topic}`);

  if(quiz && link){
    quiz.classList.remove("hidden");
    link.classList.remove("disabled");
    quiz.scrollIntoView({ behavior: "smooth" });
  }
}
