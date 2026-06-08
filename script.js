// Digital Clock Functionality
function updateClock() {
    const now = new Date();
    
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    document.getElementById('time').textContent = `${hours}:${minutes}:${seconds}`;
    
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    document.getElementById('date').textContent = now.toLocaleDateString('en-US', options);
}

// Countdown Timer Functionality
let countdownInterval = null;
let targetDate = null;
let isPaused = false;

function updateCountdown() {
    if (!targetDate) return;
    
    const now = new Date();
    const diff = targetDate - now;
    
    if (isPaused) return;
    
    if (diff <= 0) {
        clearInterval(countdownInterval);
        countdownInterval = null;
        showMessage('🎉 Countdown Complete!', 'success');
        resetCountdownDisplay();
        return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

function setTargetDate() {
    const inputValue = document.getElementById('target-datetime').value;
    
    if (!inputValue) {
        showMessage('Please select a date and time', 'error');
        return;
    }
    
    targetDate = new Date(inputValue);
    const now = new Date();
    
    if (targetDate <= now) {
        showMessage('Please select a future date and time', 'error');
        return;
    }
    
    showMessage('Timer set successfully!', 'success');
    document.getElementById('start-btn').disabled = false;
}

function startCountdown() {
    if (!targetDate) {
        showMessage('Please set a target date first', 'error');
        return;
    }
    
    isPaused = false;
    updateCountdown();
    
    countdownInterval = setInterval(updateCountdown, 1000);
    updateButtonStates(true);
}

function pauseCountdown() {
    if (countdownInterval) {
        isPaused = true;
        clearInterval(countdownInterval);
        countdownInterval = null;
        showMessage('Timer paused', 'success');
    }
    updateButtonStates(false);
}

function resetCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
    
    targetDate = null;
    isPaused = false;
    
    resetCountdownDisplay();
    clearMessage();
    updateButtonStates(false);
    document.getElementById('target-datetime').value = '';
}

function resetCountdownDisplay() {
    document.getElementById('days').textContent = '00';
    document.getElementById('hours').textContent = '00';
    document.getElementById('minutes').textContent = '00';
    document.getElementById('seconds').textContent = '00';
}

function updateButtonStates(running) {
    document.getElementById('start-btn').disabled = running;
    document.getElementById('pause-btn').disabled = !running;
    document.getElementById('reset-btn').disabled = false;
}

function showMessage(text, type) {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = `message show ${type}`;
}

function clearMessage() {
    const messageEl = document.getElementById('message');
    messageEl.className = 'message';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize clock
    updateClock();
    setInterval(updateClock, 1000);
    
    // Event Listeners
    document.getElementById('set-timer').addEventListener('click', setTargetDate);
    document.getElementById('start-btn').addEventListener('click', startCountdown);
    document.getElementById('pause-btn').addEventListener('click', pauseCountdown);
    document.getElementById('reset-btn').addEventListener('click', resetCountdown);
    
    // Allow pressing Enter on datetime input
    document.getElementById('target-datetime').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            setTargetDate();
        }
    });
});