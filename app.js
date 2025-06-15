let questions = [];
    let currentQuestion = 0;
    let score = 0;
    let selectedAnswer = null;

async function loadQuestions() {
    const res = await fetch("https://opentdb.com/api.php?amount=10&category=19");
    const data = await res.json();
    questions = data.results;
    showQuestion();
}

function decode(text) {
    const txt = document.createElement("textarea");
    txt.innerHTML = text;
    return txt.value;
}

function showQuestion() {
    selectedAnswer = null;
    const q = questions[currentQuestion];
    const questionElement = document.getElementById("question");
    const optionsElement = document.getElementById("options");
    const questionNumber = document.getElementById("question-number");
    const progressBar = document.getElementById("progress-bar");

    questionElement.textContent = decode(q.question);
    questionNumber.textContent = `Question ${currentQuestion + 1}/${questions.length}`;
    progressBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;

    const answers = [...q.incorrect_answers.map(decode), decode(q.correct_answer)];
    const shuffled = answers.sort(() => Math.random() - 0.5);

    optionsElement.innerHTML = "";
    shuffled.forEach(answer => {
    const div = document.createElement("div");
    div.className = "option";
    div.textContent = answer;
    div.addEventListener("click", () => {
        document.querySelectorAll(".option").forEach(opt => opt.classList.remove("selected"));
        div.classList.add("selected");
        selectedAnswer = answer;
    });
    optionsElement.appendChild(div);
    });

    const nextBtn = document.getElementById("next-btn");
    nextBtn.textContent = currentQuestion === questions.length - 1 ? "Submit Quiz" : "Next Question";
}

document.getElementById("next-btn").addEventListener("click", () => {
    if (!selectedAnswer) {
    alert("Please select an answer!");
    return;
    }

    const correct = decode(questions[currentQuestion].correct_answer);
    if (selectedAnswer === correct) {
    score++;
    }

    currentQuestion++;

    if (currentQuestion < questions.length) {
    showQuestion();
    } else {
    document.querySelector(".quiz-card").innerHTML = `
        <h2>Quiz Completed</h2>
        <div id="score">You scored ${score} out of ${questions.length}!</div>`;
    }
});

loadQuestions();