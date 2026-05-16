let isLoginMode = true;
let currentQuestions = [];
let currentIndex = 0;
let userAnswers = {};
let activeCategory = "";

async function handleAuth() {
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    if(!u || !p) return alert("Fill all fields");

    const endpoint = isLoginMode ? '/login' : '/register';
    const res = await fetch(endpoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username: u, password: p})
    });
    const data = await res.json();

    if(data.success) {
        if(isLoginMode) {
            document.getElementById('user-display').innerText = u;
            document.getElementById('auth-box').classList.add('hidden');
            document.getElementById('dashboard-box').classList.remove('hidden');
            loadHistory();
        } else {
            alert("Registration complete! Please log in.");
            toggleAuthMode();
        }
    } else {
        alert(data.error || "Execution error encountered");
    }
}

function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    document.getElementById('auth-title').innerText = isLoginMode ? "Account Login" : "Create Account";
    document.getElementById('auth-action-btn').innerText = isLoginMode ? "Login" : "Register";
    document.getElementById('auth-toggle-text').innerText = isLoginMode ? "Need an account? Register here." : "Have an account? Login here.";
}

async function loadHistory() {
    const res = await fetch('/get_history');
    const items = await res.json();
    const list = document.getElementById('history-list');
    list.innerHTML = items.length ? '' : '<li>No recorded scores found.</li>';
    items.forEach(i => {
        list.innerHTML += `<li>${i.category.toUpperCase()}: <strong>${i.score}/20</strong> marks</li>`;
    });
}

async function startTest(category) {
    activeCategory = category;
    const res = await fetch(`/get_test/${category}`);
    currentQuestions = await res.json();
    currentIndex = 0;
    userAnswers = {};

    document.getElementById('test-title').innerText = category.toUpperCase() + " TEST";
    document.getElementById('dashboard-box').classList.add('hidden');
    document.getElementById('quiz-box').classList.remove('hidden');
    renderQuestion();
}

function renderQuestion() {
    const q = currentQuestions[currentIndex];
    document.getElementById('progress').innerText = `Question ${currentIndex + 1}/20`;
    document.getElementById('question-text').innerText = q.q;
    
    const container = document.getElementById('options-container');
    container.innerHTML = '';
    
    q.options.forEach(opt => {
        const div = document.createElement('div');
        div.className = `option-wrapper ${userAnswers[currentIndex] === opt ? 'selected' : ''}`;
        div.innerText = opt;
        div.onclick = () => {
            userAnswers[currentIndex] = opt;
            renderQuestion();
        };
        container.appendChild(div);
    });

    document.getElementById('prev-btn').disabled = currentIndex === 0;
    document.getElementById('next-btn').innerText = currentIndex === 19 ? "Finish and Submit" : "Next";
}

function nextQuestion() {
    if(currentIndex < 19) { currentIndex++; renderQuestion(); } 
    else { submitTestFinal(); }
}

function prevQuestion() {
    if(currentIndex > 0) { currentIndex--; renderQuestion(); }
}

async function submitTestFinal() {
    let finalMarks = 0;
    currentQuestions.forEach((q, idx) => {
        if(userAnswers[idx] === q.answer) finalMarks++;
    });

    await fetch('/submit_score', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({category: activeCategory, score: finalMarks})
    });

    document.getElementById('quiz-box').classList.add('hidden');
    document.getElementById('result-box').classList.remove('hidden');
    document.getElementById('score-display').innerText = finalMarks;
    document.getElementById('performance-feedback').innerText = finalMarks >= 12 ? "Great job!" : "Keep learning.";
}

function exitToDashboard() {
    document.getElementById('result-box').classList.add('hidden');
    document.getElementById('dashboard-box').classList.remove('hidden');
    loadHistory();
}

// Initial fetch if session cookie exists
if(document.getElementById('dashboard-box') && !document.getElementById('dashboard-box').classList.contains('hidden')) {
    loadHistory();
}
