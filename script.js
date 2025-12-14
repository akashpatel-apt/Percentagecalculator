// --- THEME & TABS ---
const body = document.body;
const themeBtn = document.getElementById('themeToggle');

if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark');
}

themeBtn.addEventListener('click', () => {
    body.classList.toggle('dark');
    localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
});

// Updated for 3 Tabs
function switchTab(tabName) {
    // Hide ALL sections
    document.getElementById('section-age').classList.add('hidden');
    document.getElementById('section-percent').classList.add('hidden');
    document.getElementById('section-about').classList.add('hidden');
    
    // Deactivate ALL buttons
    document.getElementById('tab-age').classList.remove('active');
    document.getElementById('tab-percent').classList.remove('active');
    document.getElementById('tab-about').classList.remove('active');

    // Show SELECTED
    document.getElementById(`section-${tabName}`).classList.remove('hidden');
    document.getElementById(`tab-${tabName}`).classList.add('active');
}

// --- HISTORY LOGIC ---
function addToHistory(type, text) {
    let history = JSON.parse(localStorage.getItem('calcHistory') || '[]');
    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    history.unshift({ type, text, time });
    if (history.length > 10) history.pop();
    localStorage.setItem('calcHistory', JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    const list = document.getElementById('historyList');
    let history = JSON.parse(localStorage.getItem('calcHistory') || '[]');
    
    if (history.length === 0) {
        list.innerHTML = '<p style="text-align:center; color:#94a3b8; font-size:0.9rem;">No calculations yet</p>';
        return;
    }

    list.innerHTML = history.map(item => `
        <div class="history-item" style="border-color: ${getColor(item.type)}">
            <div class="h-top">
                <span>${item.type}</span>
                <span>${item.time}</span>
            </div>
            <div class="h-res">${item.text}</div>
        </div>
    `).join('');
}

function getColor(type) {
    if(type === 'Age') return '#4f46e5';
    if(type === 'Percent') return '#3b82f6';
    if(type === 'Find X') return '#8b5cf6';
    if(type === 'Change') return '#ec4899';
    return '#64748b';
}

function clearHistory() {
    localStorage.removeItem('calcHistory');
    renderHistory();
}

// --- AGE CALCULATOR ---
function calculateAge() {
    const input = document.getElementById('dobInput').value;
    if (!input) return alert("Please enter Date of Birth");

    const dob = new Date(input);
    const today = new Date();
    
    let years = today.getFullYear() - dob.getFullYear();
    let months = today.getMonth() - dob.getMonth();
    let days = today.getDate() - dob.getDate();

    if (days < 0) {
        months--;
        days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    if (months < 0) {
        years--;
        months += 12;
    }

    const nextBday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
    if (today > nextBday) nextBday.setFullYear(today.getFullYear() + 1);
    const oneDay = 24 * 60 * 60 * 1000;
    const daysLeft = Math.round(Math.abs((nextBday - today) / oneDay));
    const daysName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    document.getElementById('ageResult').classList.remove('hidden');
    document.getElementById('ageMain').innerText = `${years}y ${months}m ${days}d`;
    document.getElementById('nextBday').innerText = `${daysLeft} Days`;
    document.getElementById('bornDay').innerText = daysName[dob.getDay()];

    addToHistory('Age', `Born: ${input} → ${years}y ${months}m`);
}

// --- PERCENTAGE CALCULATOR ---
function calcType1() {
    const x = parseFloat(document.getElementById('c1_x').value);
    const y = parseFloat(document.getElementById('c1_y').value);
    if(isNaN(x) || isNaN(y)) return;
    const res = (x / 100) * y;
    const final = Number.isInteger(res) ? res : res.toFixed(2);
    document.getElementById('res1').innerText = final;
    addToHistory('Percent', `${x}% of ${y} = ${final}`);
}

function calcType2() {
    const x = parseFloat(document.getElementById('c2_x').value);
    const y = parseFloat(document.getElementById('c2_y').value);
    if(isNaN(x) || isNaN(y)) return;
    const res = (x / y) * 100;
    const final = res.toFixed(2) + "%";
    document.getElementById('res2').innerText = final;
    addToHistory('Find X', `${x} is ${final} of ${y}`);
}

function calcType3() {
    const x = parseFloat(document.getElementById('c3_x').value);
    const y = parseFloat(document.getElementById('c3_y').value);
    if(isNaN(x) || isNaN(y)) return;
    const res = ((y - x) / x) * 100;
    const arrow = res >= 0 ? "↑" : "↓";
    const color = res >= 0 ? "#10b981" : "#ef4444";
    const el = document.getElementById('res3');
    const final = `${arrow} ${Math.abs(res).toFixed(2)}%`;
    el.innerText = final;
    el.style.color = color;
    addToHistory('Change', `${x} to ${y}: ${final}`);
}

renderHistory();