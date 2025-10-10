// State Management
let currentState = {
    result: 'score',  // 'score' or 'miss'
    team: 'for'       // 'for' or 'against'
};

let shots = [];
let shotIdCounter = 0;

// Canvas setup
const canvas = document.getElementById('rinkCanvas');
const ctx = canvas.getContext('2d');

// DOM Elements
const scoreBtn = document.getElementById('scoreBtn');
const missBtn = document.getElementById('missBtn');
const forBtn = document.getElementById('forBtn');
const againstBtn = document.getElementById('againstBtn');
const undoBtn = document.getElementById('undoBtn');
const resetBtn = document.getElementById('resetBtn');
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const fileInput = document.getElementById('fileInput');
const statusDisplay = document.getElementById('statusDisplay');
const statusText = document.getElementById('statusText');
const forShotsEl = document.getElementById('forShots');
const forScoresEl = document.getElementById('forScores');
const forMissesEl = document.getElementById('forMisses');
const againstShotsEl = document.getElementById('againstShots');
const againstScoresEl = document.getElementById('againstScores');
const againstMissesEl = document.getElementById('againstMisses');

// Initialize
function init() {
    drawRink();
    updateUI();
    attachEventListeners();
}

// Draw Hockey Rink
function drawRink() {
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Background (ice)
    ctx.fillStyle = '#e8f4f8';
    ctx.fillRect(0, 0, width, height);

    // Rink outline
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, width, height);

    // Center line (red)
    ctx.strokeStyle = '#c41e3a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();

    // Blue lines
    ctx.strokeStyle = '#0033a0';
    ctx.lineWidth = 4;
    
    // Left blue line
    ctx.beginPath();
    ctx.moveTo(width * 0.25, 0);
    ctx.lineTo(width * 0.25, height);
    ctx.stroke();
    
    // Right blue line
    ctx.beginPath();
    ctx.moveTo(width * 0.75, 0);
    ctx.lineTo(width * 0.75, height);
    ctx.stroke();

    // Face-off circles
    drawFaceoffCircle(width * 0.2, height * 0.35, 40);
    drawFaceoffCircle(width * 0.2, height * 0.65, 40);
    drawFaceoffCircle(width * 0.8, height * 0.35, 40);
    drawFaceoffCircle(width * 0.8, height * 0.65, 40);

    // Center face-off circle
    drawFaceoffCircle(width * 0.5, height * 0.5, 50);

    // Goal creases
    drawGoalCrease(width * 0.05, height * 0.5);
    drawGoalCrease(width * 0.95, height * 0.5);

    // Redraw all shot markers
    shots.forEach(shot => drawMarker(shot));
}

// Draw face-off circle
function drawFaceoffCircle(x, y, radius) {
    ctx.strokeStyle = '#c41e3a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Center dot
    ctx.fillStyle = '#c41e3a';
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
}

// Draw goal crease
function drawGoalCrease(x, y) {
    ctx.strokeStyle = '#c41e3a';
    ctx.fillStyle = 'rgba(196, 30, 58, 0.1)';
    ctx.lineWidth = 2;

    ctx.beginPath();
    if (x < canvas.width / 2) {
        // Left goal
        ctx.arc(x, y, 30, -Math.PI / 2, Math.PI / 2);
    } else {
        // Right goal
        ctx.arc(x, y, 30, Math.PI / 2, -Math.PI / 2);
    }
    ctx.fill();
    ctx.stroke();
}

// Draw shot marker
function drawMarker(shot) {
    const { x, y, resultState, teamState } = shot;
    
    // Determine marker style based on state
    const stateKey = `${resultState}-${teamState}`;
    let fillColor, strokeColor, isFilled;

    switch (stateKey) {
        case 'score-for':
            fillColor = '#38ef7d';
            strokeColor = '#11998e';
            isFilled = true;
            break;
        case 'score-against':
            fillColor = '#ff6a00';
            strokeColor = '#ee0979';
            isFilled = true;
            break;
        case 'miss-for':
            fillColor = 'transparent';
            strokeColor = '#00f2fe';
            isFilled = false;
            break;
        case 'miss-against':
            fillColor = 'transparent';
            strokeColor = '#fa709a';
            isFilled = false;
            break;
    }

    // Draw marker
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    
    if (isFilled) {
        ctx.fillStyle = fillColor;
        ctx.fill();
    }
    
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Add glow effect for scores
    if (resultState === 'score') {
        ctx.shadowColor = strokeColor;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
    }
}

// Update UI based on current state
function updateUI() {
    const stateClass = `${currentState.result}-${currentState.team}`;
    
    // Update status display
    statusDisplay.className = `status-display ${stateClass}`;
    statusText.textContent = `${currentState.result.toUpperCase()} - ${currentState.team.toUpperCase()}`;
    
    // Update body class for background
    document.body.className = `state-${stateClass}`;
    
    // Update button states
    scoreBtn.classList.toggle('active', currentState.result === 'score');
    missBtn.classList.toggle('active', currentState.result === 'miss');
    forBtn.classList.toggle('active', currentState.team === 'for');
    againstBtn.classList.toggle('active', currentState.team === 'against');
    
    // Update counters
    updateCounters();
}

// Update shot counters
function updateCounters() {
    // FOR stats
    const forShots = shots.filter(s => s.teamState === 'for');
    forShotsEl.textContent = forShots.length;
    forScoresEl.textContent = forShots.filter(s => s.resultState === 'score').length;
    forMissesEl.textContent = forShots.filter(s => s.resultState === 'miss').length;
    
    // AGAINST stats
    const againstShots = shots.filter(s => s.teamState === 'against');
    againstShotsEl.textContent = againstShots.length;
    againstScoresEl.textContent = againstShots.filter(s => s.resultState === 'score').length;
    againstMissesEl.textContent = againstShots.filter(s => s.resultState === 'miss').length;
}

// Handle canvas click
function handleCanvasClick(event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;
    
    // Create shot object
    const shot = {
        id: shotIdCounter++,
        x: x,
        y: y,
        resultState: currentState.result,
        teamState: currentState.team,
        timestamp: new Date().toISOString()
    };
    
    shots.push(shot);
    drawMarker(shot);
    updateCounters();
}

// Toggle result state
function toggleResult(result) {
    currentState.result = result;
    updateUI();
}

// Toggle team state
function toggleTeam(team) {
    currentState.team = team;
    updateUI();
}

// Undo last shot
function undoLastShot() {
    if (shots.length === 0) {
        alert('No shots to undo!');
        return;
    }
    
    shots.pop();
    drawRink();
    updateCounters();
}

// Reset all shots
function resetShots() {
    if (shots.length === 0) {
        alert('No shots to reset!');
        return;
    }
    
    if (confirm('Are you sure you want to clear all shots?')) {
        shots = [];
        shotIdCounter = 0;
        drawRink();
        updateCounters();
    }
}

// Export data to JSON
function exportData() {
    if (shots.length === 0) {
        alert('No shots to export!');
        return;
    }
    
    const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        totalShots: shots.length,
        shots: shots
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `hockey-shots-${Date.now()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
}

// Import data from JSON
function importData() {
    fileInput.click();
}

// Handle file selection
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            // Validate data structure
            if (!data.shots || !Array.isArray(data.shots)) {
                throw new Error('Invalid data format: missing or invalid shots array');
            }
            
            // Validate each shot object
            for (let shot of data.shots) {
                if (!shot.hasOwnProperty('id') || 
                    !shot.hasOwnProperty('x') || 
                    !shot.hasOwnProperty('y') || 
                    !shot.hasOwnProperty('resultState') || 
                    !shot.hasOwnProperty('teamState') || 
                    !shot.hasOwnProperty('timestamp')) {
                    throw new Error('Invalid shot object structure');
                }
            }
            
            // Import successful - add to existing shots instead of replacing
            const importedCount = data.shots.length;
            shots = [...shots, ...data.shots];
            shotIdCounter = Math.max(...shots.map(s => s.id), 0) + 1;
            drawRink();
            updateCounters();
            alert(`Successfully imported ${importedCount} shots! Total shots: ${shots.length}`);
            
        } catch (error) {
            alert(`Import failed: ${error.message}\n\nPlease select a valid Hockey Shot Tracker JSON file.`);
        }
    };
    
    reader.readAsText(file);
    
    // Reset file input
    fileInput.value = '';
}

// Attach event listeners
function attachEventListeners() {
    canvas.addEventListener('click', handleCanvasClick);
    
    scoreBtn.addEventListener('click', () => toggleResult('score'));
    missBtn.addEventListener('click', () => toggleResult('miss'));
    forBtn.addEventListener('click', () => toggleTeam('for'));
    againstBtn.addEventListener('click', () => toggleTeam('against'));
    
    undoBtn.addEventListener('click', undoLastShot);
    resetBtn.addEventListener('click', resetShots);
    exportBtn.addEventListener('click', exportData);
    importBtn.addEventListener('click', importData);
    fileInput.addEventListener('change', handleFileSelect);
}

// Start the app
init();


