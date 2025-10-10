// State Management
let currentState = {
    result: 'score',     // 'score' or 'miss'
    team: 'against',     // 'player' or 'against'
    selectedPlayer: null // player name or null
};

let shots = [];
let shotIdCounter = 0;
let players = []; // Array of player names

// Canvas setup
const canvas = document.getElementById('rinkCanvas');
const ctx = canvas.getContext('2d');

// DOM Elements
const rinkTab = document.getElementById('rinkTab');
const playersTab = document.getElementById('playersTab');
const rinkView = document.getElementById('rinkView');
const playersView = document.getElementById('playersView');

const scoreBtn = document.getElementById('scoreBtn');
const missBtn = document.getElementById('missBtn');
const againstBtn = document.getElementById('againstBtn');
const playerButtonsContainer = document.getElementById('playerButtons');

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

const playerNameInput = document.getElementById('playerNameInput');
const addPlayerBtn = document.getElementById('addPlayerBtn');
const playersListEl = document.getElementById('playersList');
const exportPlayersBtn = document.getElementById('exportPlayersBtn');
const importPlayersBtn = document.getElementById('importPlayersBtn');
const clearPlayersBtn = document.getElementById('clearPlayersBtn');
const playersFileInput = document.getElementById('playersFileInput');
const shotTooltip = document.getElementById('shotTooltip');

// Initialize
function init() {
    loadPlayersFromStorage();
    renderPlayerButtons();
    renderPlayersList();
    drawRink();
    updateUI();
    attachEventListeners();
}

// Tab Switching
function switchTab(tabName) {
    if (tabName === 'rink') {
        rinkTab.classList.add('active');
        playersTab.classList.remove('active');
        rinkView.classList.add('active');
        playersView.classList.remove('active');
    } else if (tabName === 'players') {
        rinkTab.classList.remove('active');
        playersTab.classList.add('active');
        rinkView.classList.remove('active');
        playersView.classList.add('active');
        // Refresh player stats when viewing the Players tab
        renderPlayersList();
    }
}

// Player Management
function loadPlayersFromStorage() {
    const saved = localStorage.getItem('hockeyTrackerPlayers');
    if (saved) {
        players = JSON.parse(saved);
    }
}

function savePlayersToStorage() {
    localStorage.setItem('hockeyTrackerPlayers', JSON.stringify(players));
}

function addPlayer() {
    const playerName = playerNameInput.value.trim();
    if (!playerName) {
        alert('Please enter a player name');
        return;
    }
    if (players.includes(playerName)) {
        alert('Player already exists');
        return;
    }
    if (players.length >= 20) {
        alert('Maximum 20 players allowed');
        return;
    }
    
    players.push(playerName);
    savePlayersToStorage();
    renderPlayerButtons();
    renderPlayersList();
    playerNameInput.value = '';
    
    // Auto-select the first player if none selected
    if (!currentState.selectedPlayer && players.length === 1) {
        selectPlayer(playerName);
    }
}

function removePlayer(playerName) {
    if (confirm(`Remove ${playerName} from the team?`)) {
        players = players.filter(p => p !== playerName);
        savePlayersToStorage();
        
        // If removed player was selected, deselect
        if (currentState.selectedPlayer === playerName) {
            currentState.selectedPlayer = null;
            currentState.team = 'against';
        }
        
        renderPlayerButtons();
        renderPlayersList();
        updateUI();
    }
}

function renderPlayerButtons() {
    playerButtonsContainer.innerHTML = '';
    
    if (players.length === 0) {
        playerButtonsContainer.innerHTML = '<p style="color: #666; font-size: 0.8em; font-style: italic;">Add players in the Players tab</p>';
        return;
    }
    
    players.forEach(playerName => {
        const btn = document.createElement('button');
        btn.className = 'player-btn';
        btn.textContent = playerName;
        btn.dataset.player = playerName;
        
        if (currentState.selectedPlayer === playerName) {
            btn.classList.add('active');
        }
        
        btn.addEventListener('click', () => selectPlayer(playerName));
        playerButtonsContainer.appendChild(btn);
    });
}

function renderPlayersList() {
    if (players.length === 0) {
        playersListEl.innerHTML = '<p class="no-players">No players added yet. Add players above to start tracking individual performance.</p>';
        return;
    }
    
    playersListEl.innerHTML = '';
    players.forEach(playerName => {
        // Calculate player stats
        const playerShots = shots.filter(s => s.playerName === playerName);
        const totalShots = playerShots.length;
        const scores = playerShots.filter(s => s.resultState === 'score').length;
        const misses = playerShots.filter(s => s.resultState === 'miss').length;
        const percentage = totalShots > 0 ? ((scores / totalShots) * 100).toFixed(1) : '0.0';
        
        const item = document.createElement('div');
        item.className = 'player-item';
        
        // Player info section
        const infoDiv = document.createElement('div');
        infoDiv.className = 'player-info';
        
        const nameSpan = document.createElement('div');
        nameSpan.className = 'player-name';
        nameSpan.textContent = playerName;
        
        const statsDiv = document.createElement('div');
        statsDiv.className = 'player-stats';
        statsDiv.innerHTML = `
            <span class="stat-detail"><strong>Shots:</strong> ${totalShots}</span>
            <span class="stat-detail"><strong>Scores:</strong> ${scores}</span>
            <span class="stat-detail"><strong>Misses:</strong> ${misses}</span>
            <span class="stat-detail percentage"><strong>Percentage:</strong> ${percentage}%</span>
        `;
        
        infoDiv.appendChild(nameSpan);
        infoDiv.appendChild(statsDiv);
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-btn';
        removeBtn.textContent = 'Remove';
        removeBtn.addEventListener('click', () => removePlayer(playerName));
        
        item.appendChild(infoDiv);
        item.appendChild(removeBtn);
        playersListEl.appendChild(item);
    });
}

function selectPlayer(playerName) {
    currentState.selectedPlayer = playerName;
    currentState.team = 'player';
    renderPlayerButtons();
    updateUI();
}

// Export players to JSON
function exportPlayers() {
    if (players.length === 0) {
        alert('No players to export!');
        return;
    }
    
    const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        playerCount: players.length,
        players: players
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `hockey-players-${Date.now()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
}

// Import players from JSON
function importPlayers() {
    playersFileInput.click();
}

// Handle player file selection
function handlePlayerFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            // Validate data structure
            if (!data.players || !Array.isArray(data.players)) {
                throw new Error('Invalid data format: missing or invalid players array');
            }
            
            // Validate each player name
            for (let playerName of data.players) {
                if (typeof playerName !== 'string' || !playerName.trim()) {
                    throw new Error('Invalid player name in file');
                }
            }
            
            // Ask user if they want to replace or merge
            const action = confirm(
                `Import ${data.players.length} players.\n\n` +
                `Click OK to ADD to existing players (${players.length} current).\n` +
                `Click CANCEL to REPLACE all existing players.`
            );
            
            if (action) {
                // Add to existing (avoid duplicates)
                const newPlayers = data.players.filter(p => !players.includes(p));
                players = [...players, ...newPlayers];
                alert(`Added ${newPlayers.length} new players! Total: ${players.length}`);
            } else {
                // Replace all
                players = [...data.players];
                // Deselect current player if not in new list
                if (!players.includes(currentState.selectedPlayer)) {
                    currentState.selectedPlayer = null;
                    currentState.team = 'against';
                }
                alert(`Replaced with ${players.length} players!`);
            }
            
            savePlayersToStorage();
            renderPlayerButtons();
            renderPlayersList();
            updateUI();
            
        } catch (error) {
            alert(`Import failed: ${error.message}\n\nPlease select a valid Hockey Tracker Players JSON file.`);
        }
    };
    
    reader.readAsText(file);
    
    // Reset file input
    playersFileInput.value = '';
}

// Clear all players
function clearAllPlayers() {
    if (players.length === 0) {
        alert('No players to clear!');
        return;
    }
    
    if (confirm(`Remove all ${players.length} players from the roster?`)) {
        players = [];
        currentState.selectedPlayer = null;
        currentState.team = 'against';
        savePlayersToStorage();
        renderPlayerButtons();
        renderPlayersList();
        updateUI();
        alert('All players cleared!');
    }
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
    
    // Treat 'player' teamState as 'for' for visual purposes
    const visualTeam = (teamState === 'player' || teamState === 'for') ? 'for' : 'against';
    
    // Determine marker style based on state
    const stateKey = `${resultState}-${visualTeam}`;
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
    let displayTeam = currentState.team === 'player' ? 'for' : 'against';
    const stateClass = `${currentState.result}-${displayTeam}`;
    
    // Update status display
    statusDisplay.className = `status-display ${stateClass}`;
    
    let statusTeamText = currentState.team === 'player' && currentState.selectedPlayer 
        ? currentState.selectedPlayer 
        : currentState.team.toUpperCase();
    
    statusText.textContent = `${currentState.result.toUpperCase()} - ${statusTeamText}`;
    
    // Update body class for background
    document.body.className = `state-${stateClass}`;
    
    // Update button states
    scoreBtn.classList.toggle('active', currentState.result === 'score');
    missBtn.classList.toggle('active', currentState.result === 'miss');
    againstBtn.classList.toggle('active', currentState.team === 'against');
    
    // Update counters
    updateCounters();
}

// Update shot counters
function updateCounters() {
    // FOR stats (includes all player shots)
    const forShots = shots.filter(s => s.teamState === 'for' || s.teamState === 'player');
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
        playerName: currentState.team === 'player' ? currentState.selectedPlayer : null,
        timestamp: new Date().toISOString()
    };
    
    shots.push(shot);
    drawMarker(shot);
    updateCounters();
}

// Handle canvas mousemove for tooltip
function handleCanvasMouseMove(event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const mouseX = (event.clientX - rect.left) * scaleX;
    const mouseY = (event.clientY - rect.top) * scaleY;
    
    // Find shot under mouse (within 12px radius)
    const hoveredShot = shots.find(shot => {
        const distance = Math.sqrt(Math.pow(shot.x - mouseX, 2) + Math.pow(shot.y - mouseY, 2));
        return distance <= 12;
    });
    
    if (hoveredShot) {
        showShotTooltip(hoveredShot, event.clientX, event.clientY);
    } else {
        hideShotTooltip();
    }
}

// Show shot tooltip
function showShotTooltip(shot, clientX, clientY) {
    // Format player/team info
    let playerInfo = '';
    if (shot.playerName) {
        playerInfo = `<span class="player-name">${shot.playerName}</span>`;
    } else if (shot.teamState === 'against') {
        playerInfo = `<span class="against-label">AGAINST</span>`;
    } else {
        playerInfo = `<span class="player-name">FOR</span>`;
    }
    
    // Format result
    const resultIcon = shot.resultState === 'score' ? '⚽' : '❌';
    const resultText = shot.resultState === 'score' ? 'SCORE' : 'MISS';
    
    // Format timestamp
    const date = new Date(shot.timestamp);
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Build tooltip content
    shotTooltip.innerHTML = `
        <div>${playerInfo}</div>
        <div class="shot-result">${resultIcon} ${resultText}</div>
        <div class="shot-time">${timeStr}</div>
    `;
    
    // Position tooltip
    const containerRect = canvas.parentElement.getBoundingClientRect();
    shotTooltip.style.left = `${clientX - containerRect.left + 15}px`;
    shotTooltip.style.top = `${clientY - containerRect.top - 10}px`;
    shotTooltip.classList.add('visible');
}

// Hide shot tooltip
function hideShotTooltip() {
    shotTooltip.classList.remove('visible');
}

// Toggle result state
function toggleResult(result) {
    currentState.result = result;
    updateUI();
}

// Toggle team to against
function toggleAgainst() {
    currentState.team = 'against';
    currentState.selectedPlayer = null;
    renderPlayerButtons(); // Update player button states
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
    // Refresh player list if on Players tab
    if (playersView.classList.contains('active')) {
        renderPlayersList();
    }
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
        // Refresh player list if on Players tab
        if (playersView.classList.contains('active')) {
            renderPlayersList();
        }
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
            
            // Validate and normalize each shot object
            for (let shot of data.shots) {
                if (!shot.hasOwnProperty('id') || 
                    !shot.hasOwnProperty('x') || 
                    !shot.hasOwnProperty('y') || 
                    !shot.hasOwnProperty('resultState') || 
                    !shot.hasOwnProperty('teamState') || 
                    !shot.hasOwnProperty('timestamp')) {
                    throw new Error('Invalid shot object structure');
                }
                
                // Add playerName field if missing (backward compatibility)
                if (!shot.hasOwnProperty('playerName')) {
                    shot.playerName = null;
                }
                
                // Normalize old 'for' teamState to 'player' if there's no playerName
                if (shot.teamState === 'for' && !shot.playerName) {
                    // Keep as 'for' for backward compatibility
                    shot.teamState = 'for';
                }
            }
            
            // Import successful - add to existing shots instead of replacing
            const importedCount = data.shots.length;
            shots = [...shots, ...data.shots];
            shotIdCounter = Math.max(...shots.map(s => s.id), 0) + 1;
            drawRink();
            updateCounters();
            // Refresh player list if on Players tab
            if (playersView.classList.contains('active')) {
                renderPlayersList();
            }
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
    // Tab switching
    rinkTab.addEventListener('click', () => switchTab('rink'));
    playersTab.addEventListener('click', () => switchTab('players'));
    
    // Canvas
    canvas.addEventListener('click', handleCanvasClick);
    canvas.addEventListener('mousemove', handleCanvasMouseMove);
    canvas.addEventListener('mouseleave', hideShotTooltip);
    
    // Result toggles
    scoreBtn.addEventListener('click', () => toggleResult('score'));
    missBtn.addEventListener('click', () => toggleResult('miss'));
    
    // Team toggle
    againstBtn.addEventListener('click', toggleAgainst);
    
    // Action buttons
    undoBtn.addEventListener('click', undoLastShot);
    resetBtn.addEventListener('click', resetShots);
    exportBtn.addEventListener('click', exportData);
    importBtn.addEventListener('click', importData);
    fileInput.addEventListener('change', handleFileSelect);
    
    // Player management
    addPlayerBtn.addEventListener('click', addPlayer);
    playerNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addPlayer();
    });
    
    // Player list actions
    exportPlayersBtn.addEventListener('click', exportPlayers);
    importPlayersBtn.addEventListener('click', importPlayers);
    clearPlayersBtn.addEventListener('click', clearAllPlayers);
    playersFileInput.addEventListener('change', handlePlayerFileSelect);
}

// Start the app
init();


