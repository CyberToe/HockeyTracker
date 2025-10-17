// Authentication State
let currentUser = null;
let authToken = null;

// State Management
let currentState = {
    result: 'score',     // 'score' or 'miss'
    team: 'against',     // 'player' or 'against'
    selectedPlayer: null // player name or null
};

let shots = [];
let shotIdCounter = 0;
let players = []; // Array of player names
let gameName = ''; // Current game name
let attackDirection = 'left'; // 'right' or 'left' - default to left
let currentPeriod = 1; // 1, 2, 3, or 'all'
let gamePeriodDirections = {}; // Store direction for each period

// Stats tracking
let statsGameName = '';
let goals = []; // Array of goal objects {id, goal, assist1, assist2, timestamp}
let goalIdCounter = 0;
let activeAssignmentButton = null; // Which button is active: 'goal', 'assist1', 'assist2'
let currentAssignments = {
    goal: null,
    assist1: null,
    assist2: null
};
let currentGoalsAssistsPlayer = null; // Currently selected player for goals & assists
let currentLineupPlayer = null; // Currently selected player for lineup
let currentFaceoffsPlayer = null; // Currently selected player for faceoffs

// Lineup +/- tracking
let plusMinusEvents = []; // Array of +/- events
let plusMinusIdCounter = 0;
let activePositionButton = null; // Which position button is active
let currentLineup = {
    leftWing: null,
    center: null,
    rightWing: null,
    leftDefence: null,
    rightDefence: null
};

// Faceoffs tracking
let faceoffStats = []; // Array of {playerName, taken, won}
let activeFaceoffAddButton = false; // Whether "Add Player" button is active

// Game management
let games = []; // Array of game objects {id, name, date, stats}
let gameIdCounter = 0;
let currentGame = null; // Currently selected game
let currentStatType = 'rink'; // Current stat type being viewed

// Canvas setup - using game rink canvas
const canvas = document.getElementById('gameRinkCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;

// DOM Elements
const playersBtn = document.getElementById('playersBtn');
const gamesBtn = document.getElementById('gamesBtn');
const playersView = document.getElementById('playersView');
const gamesView = document.getElementById('gamesView');

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
const gameNameInput = document.getElementById('gameNameInput');
const toggleDirectionBtn = document.getElementById('toggleDirectionBtn');

// Games DOM Elements
const gameDropdown = document.getElementById('gameDropdown');
const addGameBtn = document.getElementById('addGameBtn');
const deleteGameBtn = document.getElementById('deleteGameBtn');
const addGameForm = document.getElementById('addGameForm');
const newGameName = document.getElementById('newGameName');
const newGameDate = document.getElementById('newGameDate');
const saveGameBtn = document.getElementById('saveGameBtn');
const cancelGameBtn = document.getElementById('cancelGameBtn');
const gameStatsSection = document.getElementById('gameStatsSection');

// Game Stats DOM Elements
const goalsAssistsStatBtn = document.getElementById('goalsAssistsStatBtn');
const lineupStatBtn = document.getElementById('lineupStatBtn');
const faceoffsStatBtn = document.getElementById('faceoffsStatBtn');
const rinkStatBtn = document.getElementById('rinkStatBtn');

// Game Goals & Assists
const gameGoalBtn = document.getElementById('gameGoalBtn');
const gameAssist1Btn = document.getElementById('gameAssist1Btn');
const gameAssist2Btn = document.getElementById('gameAssist2Btn');
const gameSubmitGoalBtn = document.getElementById('gameSubmitGoalBtn');
const gameClearAssignmentsBtn = document.getElementById('gameClearAssignmentsBtn');
const goalsAssistsPlayerButtons = document.getElementById('goalsAssistsPlayerButtons');
const gameGoalsList = document.getElementById('gameGoalsList');
const lineupPlayerButtons = document.getElementById('lineupPlayerButtons');
const faceoffsPlayerButtons = document.getElementById('faceoffsPlayerButtons');

// Game Lineup +/-
const gameLeftWingBtn = document.getElementById('gameLeftWingBtn');
const gameCenterBtn = document.getElementById('gameCenterBtn');
const gameRightWingBtn = document.getElementById('gameRightWingBtn');
const gameLeftDefenceBtn = document.getElementById('gameLeftDefenceBtn');
const gameRightDefenceBtn = document.getElementById('gameRightDefenceBtn');
const gamePlusBtn = document.getElementById('gamePlusBtn');
const gameMinusBtn = document.getElementById('gameMinusBtn');
const gameClearLineupBtn = document.getElementById('gameClearLineupBtn');
const gamePlusMinusList = document.getElementById('gamePlusMinusList');

// Game Faceoffs
const gameFaceoffPlayersList = document.getElementById('gameFaceoffPlayersList');

// Game Rink
const gameRinkCanvas = document.getElementById('gameRinkCanvas');
const gameCtx = gameRinkCanvas ? gameRinkCanvas.getContext('2d') : null;
const gameScoreBtn = document.getElementById('gameScoreBtn');
const gameMissBtn = document.getElementById('gameMissBtn');
const gameAgainstBtn = document.getElementById('gameAgainstBtn');
const gamePlayerButtons = document.getElementById('gamePlayerButtons');
const gameUndoBtn = document.getElementById('gameUndoBtn');
const gameResetBtn = document.getElementById('gameResetBtn');
const gameExportBtn = document.getElementById('gameExportBtn');
const gameImportBtn = document.getElementById('gameImportBtn');
const gameForShots = document.getElementById('gameForShots');
const gameForScores = document.getElementById('gameForScores');
const gameForMisses = document.getElementById('gameForMisses');
const gameAgainstShots = document.getElementById('gameAgainstShots');
const gameAgainstScores = document.getElementById('gameAgainstScores');
const gameAgainstMisses = document.getElementById('gameAgainstMisses');
const gameShotTooltip = document.getElementById('gameShotTooltip');

// Game Period Buttons
const gamePeriod1Btn = document.getElementById('gamePeriod1Btn');
const gamePeriod2Btn = document.getElementById('gamePeriod2Btn');
const gamePeriod3Btn = document.getElementById('gamePeriod3Btn');
const gamePeriodAllBtn = document.getElementById('gamePeriodAllBtn');

// Game Direction Button
const gameToggleDirectionBtn = document.getElementById('gameToggleDirectionBtn');

// Period buttons
const period1Btn = document.getElementById('period1Btn');
const period2Btn = document.getElementById('period2Btn');
const period3Btn = document.getElementById('period3Btn');
const periodAllBtn = document.getElementById('periodAllBtn');

// Stats DOM Elements
const statsGameNameInput = document.getElementById('statsGameNameInput');
const exportStatsBtn = document.getElementById('exportStatsBtn');
const importStatsBtn = document.getElementById('importStatsBtn');
const statsFileInput = document.getElementById('statsFileInput');
const statsPlayersList = document.getElementById('statsPlayersList');

// Stats Sub-Tabs removed - now handled in games view

const goalBtn = document.getElementById('goalBtn');
const assist1Btn = document.getElementById('assist1Btn');
const assist2Btn = document.getElementById('assist2Btn');
const goalPlayerName = document.getElementById('goalPlayerName');
const assist1PlayerName = document.getElementById('assist1PlayerName');
const assist2PlayerName = document.getElementById('assist2PlayerName');
const submitGoalBtn = document.getElementById('submitGoalBtn');
const clearAssignmentsBtn = document.getElementById('clearAssignmentsBtn');
const goalsList = document.getElementById('goalsList');

// Lineup +/- DOM Elements
const leftWingBtn = document.getElementById('leftWingBtn');
const centerBtn = document.getElementById('centerBtn');
const rightWingBtn = document.getElementById('rightWingBtn');
const leftDefenceBtn = document.getElementById('leftDefenceBtn');
const rightDefenceBtn = document.getElementById('rightDefenceBtn');
const leftWingPlayerName = document.getElementById('leftWingPlayerName');
const centerPlayerName = document.getElementById('centerPlayerName');
const rightWingPlayerName = document.getElementById('rightWingPlayerName');
const leftDefencePlayerName = document.getElementById('leftDefencePlayerName');
const rightDefencePlayerName = document.getElementById('rightDefencePlayerName');
const plusBtn = document.getElementById('plusBtn');
const minusBtn = document.getElementById('minusBtn');
const clearLineupBtn = document.getElementById('clearLineupBtn');
const plusMinusList = document.getElementById('plusMinusList');

// Faceoffs DOM Elements
const faceoffPlayersList = document.getElementById('faceoffPlayersList');

// Modal elements
const customModal = document.getElementById('customModal');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');
const modalOkBtn = document.getElementById('modalOkBtn');
const modalCancelBtn = document.getElementById('modalCancelBtn');

// Custom Modal Functions
function showAlert(title, message) {
    return new Promise((resolve) => {
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        modalCancelBtn.classList.add('hidden');
        modalOkBtn.textContent = 'OK';
        customModal.classList.add('show');
        
        const handleOk = () => {
            customModal.classList.remove('show');
            modalOkBtn.removeEventListener('click', handleOk);
            resolve(true);
        };
        
        modalOkBtn.addEventListener('click', handleOk);
    });
}

function showConfirm(title, message) {
    return new Promise((resolve) => {
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        modalCancelBtn.classList.remove('hidden');
        modalOkBtn.textContent = 'OK';
        customModal.classList.add('show');
        
        const handleOk = () => {
            customModal.classList.remove('show');
            modalOkBtn.removeEventListener('click', handleOk);
            modalCancelBtn.removeEventListener('click', handleCancel);
            resolve(true);
        };
        
        const handleCancel = () => {
            customModal.classList.remove('show');
            modalOkBtn.removeEventListener('click', handleOk);
            modalCancelBtn.removeEventListener('click', handleCancel);
            resolve(false);
        };
        
        modalOkBtn.addEventListener('click', handleOk);
        modalCancelBtn.addEventListener('click', handleCancel);
    });
}

// Authentication Functions
function showAuthModal(modalId) {
    console.log('Hockey Tracker: showAuthModal called with:', modalId);
    const modal = document.getElementById(modalId);
    if (modal) {
        console.log('Hockey Tracker: Modal found, adding show class');
        modal.classList.add('show');
        // Focus first input
        const firstInput = modal.querySelector('input');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    } else {
        console.error('Hockey Tracker: Modal not found:', modalId);
    }
}

function hideAuthModal(modalId) {
    console.log('Hockey Tracker: hideAuthModal called with:', modalId);
    const modal = document.getElementById(modalId);
    if (modal) {
        console.log('Hockey Tracker: Modal found, removing show class');
        modal.classList.remove('show');
        // Clear forms
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
        }
        // Clear error messages
        const errorMsg = modal.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.classList.add('hidden');
            errorMsg.textContent = '';
        }
    } else {
        console.error('Hockey Tracker: Modal not found:', modalId);
    }
}

function showError(modalId, message) {
    const errorElement = document.getElementById(modalId + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
    }
}

function showSuccess(modalId, message) {
    const successElement = document.getElementById(modalId + 'Success');
    if (successElement) {
        successElement.textContent = message;
        successElement.classList.remove('hidden');
        setTimeout(() => {
            successElement.classList.add('hidden');
        }, 3000);
    }
}

function hideError(modalId) {
    const errorElement = document.getElementById(modalId + 'Error');
    if (errorElement) {
        errorElement.classList.add('hidden');
        errorElement.textContent = '';
    }
}

function hideSuccess(modalId) {
    const successElement = document.getElementById(modalId + 'Success');
    if (successElement) {
        successElement.classList.add('hidden');
        successElement.textContent = '';
    }
}

// Global success message function
function showSuccessMessage(message) {
    // Create or get success message element
    let successElement = document.getElementById('globalSuccessMessage');
    if (!successElement) {
        successElement = document.createElement('div');
        successElement.id = 'globalSuccessMessage';
        successElement.className = 'global-success-message';
        document.body.appendChild(successElement);
    }
    
    successElement.textContent = message;
    successElement.classList.remove('hidden');
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        successElement.classList.add('hidden');
    }, 3000);
}

// Team Management Functions
let userTeams = [];
let currentEditingTeamId = null;
let currentDeletingTeamId = null;

async function loadTeams() {
    try {
        console.log('Loading teams...');
        console.log('Current user:', currentUser);
        console.log('Auth token:', authToken ? 'Present' : 'Missing');
        
        const result = await apiCall('/teams');
        console.log('Teams API response:', result);
        userTeams = result.teams || [];
        console.log('Loaded teams:', userTeams);
        
        // Debug: Check each team's properties
        userTeams.forEach((team, index) => {
            console.log(`Team ${index}:`, team);
            console.log(`Team ${index} isShared:`, team.isShared);
            console.log(`Team ${index} teamString:`, team.teamString);
            console.log(`Team ${index} shared_team_id:`, team.shared_team_id);
        });
        
        renderProfileTeamsList();
        renderTeamSwitchList();
        return userTeams;
    } catch (error) {
        console.error('Failed to load teams:', error);
        return [];
    }
}

function renderProfileTeamsList() {
    const profileTeamsList = document.getElementById('profileTeamsList');
    if (!profileTeamsList) {
        console.log('Profile teams list element not found');
        return;
    }
    
    console.log('Rendering profile teams list, userTeams:', userTeams);
    console.log('Profile teams list element:', profileTeamsList);
    console.log('Element visible:', profileTeamsList.offsetParent !== null);
    
    profileTeamsList.innerHTML = '';
    
    if (userTeams.length === 0) {
        console.log('No teams to render, showing empty message');
        profileTeamsList.innerHTML = '<p style="text-align: center; color: #666; font-style: italic; padding: 20px;">No teams created yet</p>';
        return;
    }
    
    console.log(`Rendering ${userTeams.length} teams`);
    
    userTeams.forEach(team => {
        console.log('Rendering team:', team);
        console.log('Team isShared:', team.isShared);
        console.log('Team teamString:', team.teamString);
        
        const teamItem = document.createElement('div');
        teamItem.className = 'profile-team-item';
        teamItem.dataset.teamId = team.id;
        
        teamItem.innerHTML = `
            <div class="profile-team-info">
                <div class="profile-team-name">${team.name}</div>
                <div class="profile-team-meta">
                    Created: ${new Date(team.created_at).toLocaleDateString()}
                    ${team.isShared && team.teamString ? `<br><span class="team-string">Code: ${team.teamString}</span>` : ''}
                </div>
            </div>
            <div class="profile-team-actions">
                <button class="profile-team-action-btn profile-edit-team-btn" data-team-id="${team.id}">Edit</button>
                <button class="profile-team-action-btn profile-delete-team-btn" data-team-id="${team.id}">Delete</button>
            </div>
        `;
        
        // Add event listeners for edit and delete buttons
        const editBtn = teamItem.querySelector('.profile-edit-team-btn');
        const deleteBtn = teamItem.querySelector('.profile-delete-team-btn');
        
        if (editBtn) {
            editBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Edit button clicked for team:', team.id);
                editProfileTeam(team.id);
            });
        }
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Delete button clicked for team:', team.id);
                deleteProfileTeam(team.id);
            });
        }
        
        profileTeamsList.appendChild(teamItem);
    });
}

function renderTeamSwitchList() {
    const teamSwitchList = document.getElementById('teamSwitchList');
    if (!teamSwitchList) return;
    
    console.log('renderTeamSwitchList - currentUser:', currentUser);
    console.log('renderTeamSwitchList - currentUser.teamId:', currentUser?.teamId);
    console.log('renderTeamSwitchList - userTeams:', userTeams);
    
    teamSwitchList.innerHTML = '';
    
    if (userTeams.length === 0) {
        teamSwitchList.innerHTML = '<p style="text-align: center; color: #666; font-style: italic;">No teams available</p>';
        return;
    }
    
    userTeams.forEach(team => {
        const teamItem = document.createElement('div');
        teamItem.className = 'team-switch-item';
        teamItem.dataset.teamId = team.id;
        
        const isCurrentTeam = currentUser && (currentUser.teamId == team.id || currentUser.teamId === team.id);
        console.log(`Team ${team.name} (ID: ${team.id}, type: ${typeof team.id}) - currentUser.teamId: ${currentUser?.teamId} (type: ${typeof currentUser?.teamId}) - isCurrentTeam: ${isCurrentTeam}`);
        if (isCurrentTeam) {
            teamItem.classList.add('current');
        }
        
        teamItem.innerHTML = `
            <div>
                <div class="team-name">${team.name}</div>
                <div class="team-indicator">${isCurrentTeam ? 'Currently selected' : 'Click to select'}</div>
            </div>
        `;
        
        if (!isCurrentTeam) {
            teamItem.addEventListener('click', () => {
                switchToTeam(team.id);
            });
        }
        
        teamSwitchList.appendChild(teamItem);
    });
}

async function createTeam(teamName, isShared = false) {
    try {
        const result = await apiCall('/teams', 'POST', { name: teamName, isShared: isShared });
        
        userTeams.push(result.team);
        
        // Auto-select the first team if no team is currently selected
        if (!currentUser.teamId && userTeams.length === 1) {
            await switchToTeam(result.team.id);
        }
        
        renderProfileTeamsList();
        renderTeamSwitchList();
        return result.team;
    } catch (error) {
        console.error('Failed to create team:', error);
        throw error;
    }
}

async function joinTeam(teamString) {
    try {
        console.log('Joining team with string:', teamString);
        const result = await apiCall('/teams/join', 'POST', { teamString: teamString });
        console.log('Join team result:', result);
        userTeams.push(result.team);
        
        // Auto-select the joined team
        console.log('Switching to joined team:', result.team.id);
        await switchToTeam(result.team.id);
        
        renderProfileTeamsList();
        renderTeamSwitchList();
        showProfileSuccess(result.message || 'Successfully joined team!');
        return result.team;
    } catch (error) {
        console.error('Failed to join team:', error);
        showProfileError(error.message || 'Failed to join team');
        throw error;
    }
}

async function switchToTeam(teamId) {
    try {
        console.log('Switching to team:', teamId);
        console.log('Current user before switch:', currentUser);
        await updateUserTeam(teamId);
        currentUser.teamId = teamId;
        console.log('Current user after switch:', currentUser);
        updateCurrentTeamDisplay();
        updateAuthUI();
        renderTeamSwitchList();
        
        // Set flag to prevent auto-selection during team switch
        window.switchingTeams = true;
        
        // Reload user data to get team-specific players and other data
        await loadUserData();
        
        // Clear the flag after loading
        window.switchingTeams = false;
        
        // Clear current game selection and hide stats section
        currentGame = null;
        if (gameDropdown) {
            gameDropdown.value = '';
        }
        if (gameStatsSection) {
            gameStatsSection.classList.add('hidden');
        }
        
        // Reload games for the new team
        await loadGames();
        renderGameDropdown();
        
        showSuccessMessage(`Switched to ${userTeams.find(t => t.id == teamId)?.name || 'team'}`);
    } catch (error) {
        console.error('Failed to switch team:', error);
        throw error;
    }
}

async function updateTeam(teamId, newName) {
    try {
        await apiCall(`/teams/${teamId}`, 'PUT', { name: newName });
        const team = userTeams.find(t => t.id == teamId);
        if (team) {
            team.name = newName;
        }
        populateTeamDropdown();
    } catch (error) {
        console.error('Failed to update team:', error);
        throw error;
    }
}

async function deleteTeam(teamId) {
    try {
        await apiCall(`/teams/${teamId}`, 'DELETE');
        userTeams = userTeams.filter(t => t.id != teamId);
        populateTeamDropdown();
    } catch (error) {
        console.error('Failed to delete team:', error);
        throw error;
    }
}

async function updateUserTeam(teamId) {
    try {
        console.log('Updating user team to:', teamId);
        const result = await apiCall('/profile/team', 'PUT', { teamId });
        console.log('Update user team result:', result);
        return result;
    } catch (error) {
        console.error('Failed to update user team:', error);
        throw error;
    }
}

function populateTeamDropdown() {
    // This function is no longer needed since we removed the dropdown
    // but keeping it to prevent errors in existing code
    return;
}

function renderTeamsList() {
    const teamsList = document.getElementById('teamsList');
    if (!teamsList) return;
    
    teamsList.innerHTML = '';
    
    if (userTeams.length === 0) {
        teamsList.innerHTML = '<p style="text-align: center; color: #666; font-style: italic;">No teams created yet</p>';
        return;
    }
    
    userTeams.forEach(team => {
        const teamItem = document.createElement('div');
        teamItem.className = 'team-item';
        teamItem.dataset.teamId = team.id;
        
        const isCurrentTeam = currentUser && currentUser.teamId == team.id;
        if (isCurrentTeam) {
            teamItem.classList.add('current-team');
        }
        
        teamItem.innerHTML = `
            <div class="team-info">
                <div class="team-name">${team.name}</div>
                <div class="team-meta">Created: ${new Date(team.created_at).toLocaleDateString()}</div>
            </div>
            <div class="team-actions">
                <button class="team-action-btn edit-team-btn" data-team-id="${team.id}">Edit</button>
                <button class="team-action-btn delete-team-btn" data-team-id="${team.id}">Delete</button>
            </div>
        `;
        
        // Add event listeners for edit and delete buttons
        const editBtn = teamItem.querySelector('.edit-team-btn');
        const deleteBtn = teamItem.querySelector('.delete-team-btn');
        
        if (editBtn) {
            editBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                editTeam(team.id);
            });
        }
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                deleteTeamConfirm(team.id);
            });
        }
        
        teamsList.appendChild(teamItem);
    });
}

function editTeam(teamId) {
    const team = userTeams.find(t => t.id == teamId);
    if (!team) return;
    
    // Set the current team being edited
    currentEditingTeamId = teamId;
    
    // Populate the edit form
    document.getElementById('editTeamName').value = team.name;
    
    // Show the edit modal
    showAuthModal('teamEditModal');
}

function deleteTeamConfirm(teamId) {
    const team = userTeams.find(t => t.id == teamId);
    if (!team) return;
    
    // Set the current team being deleted
    currentDeletingTeamId = teamId;
    
    // Update the confirmation message
    document.getElementById('deleteConfirmMessage').textContent = `Are you sure you want to delete "${team.name}"? This action cannot be undone.`;
    
    // Show the delete confirmation modal
    showAuthModal('teamDeleteModal');
}

function editProfileTeam(teamId) {
    console.log('editProfileTeam called with teamId:', teamId);
    const team = userTeams.find(t => t.id == teamId);
    if (!team) {
        console.log('Team not found');
        return;
    }
    
    console.log('Found team:', team);
    
    // Set the current team being edited
    currentEditingTeamId = teamId;
    
    // Populate the edit form
    const editInput = document.getElementById('editTeamName');
    if (editInput) {
        editInput.value = team.name;
        console.log('Set edit input value to:', team.name);
    } else {
        console.error('editTeamName input not found');
    }
    
    // Show the edit modal
    console.log('Showing teamEditModal');
    showAuthModal('teamEditModal');
}

function deleteProfileTeam(teamId) {
    console.log('deleteProfileTeam called with teamId:', teamId);
    const team = userTeams.find(t => t.id == teamId);
    if (!team) {
        console.log('Team not found');
        return;
    }
    
    console.log('Found team to delete:', team);
    
    // Set the current team being deleted
    currentDeletingTeamId = teamId;
    
    // Update the confirmation message
    const messageElement = document.getElementById('deleteConfirmMessage');
    if (messageElement) {
        messageElement.textContent = `Are you sure you want to delete "${team.name}"? This action cannot be undone.`;
        console.log('Updated delete confirmation message');
    } else {
        console.error('deleteConfirmMessage element not found');
    }
    
    // Show the delete confirmation modal
    console.log('Showing teamDeleteModal');
    showAuthModal('teamDeleteModal');
}

// API Functions
async function apiCall(endpoint, method = 'GET', data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (authToken) {
        options.headers['Authorization'] = `Bearer ${authToken}`;
    }

    if (data) {
        options.body = JSON.stringify(data);
    }

    console.log(`API Call: ${method} /api${endpoint}`, { options, data });

    try {
        const response = await fetch(`/api${endpoint}`, options);
        
        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        let result;
        
        if (contentType && contentType.includes('application/json')) {
            result = await response.json();
        } else {
            // Handle non-JSON responses (like rate limiting errors)
            const text = await response.text();
            console.error('Non-JSON response:', text);
            throw new Error(`Server error: ${text}`);
        }

        console.log(`API Response: ${response.status}`, result);

        if (!response.ok) {
            throw new Error(result.error || 'Request failed');
        }

        return result;
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

// Authentication API calls
async function loginUser(username, password) {
    try {
        const result = await apiCall('/login', 'POST', { username, password });
        authToken = result.token;
        currentUser = result.user;
        
        // Save to localStorage
        localStorage.setItem('hockeyTrackerToken', authToken);
        localStorage.setItem('hockeyTrackerUser', JSON.stringify(currentUser));
        
        updateAuthUI();
        
        // Load user data
        await loadUserData();
        
        // Show success message
        showSuccessMessage(`Welcome back, ${currentUser.fullName || currentUser.username}!`);
        
        hideAuthModal('loginModal');
        
        return result;
    } catch (error) {
        throw error;
    }
}

async function registerUser(userData) {
    try {
        const result = await apiCall('/register', 'POST', userData);
        authToken = result.token;
        currentUser = result.user;
        
        // Save to localStorage
        localStorage.setItem('hockeyTrackerToken', authToken);
        localStorage.setItem('hockeyTrackerUser', JSON.stringify(currentUser));
        
        updateAuthUI();
        
        // Load user data (will be empty for new users, but sets up the structure)
        await loadUserData();
        
        // Load teams to populate the teams list with the newly created team
        await loadTeams();
        
        // Show success message
        showSuccessMessage(`Welcome to Hockey Tracker, ${currentUser.fullName || currentUser.username}!`);
        
        hideAuthModal('registerModal');
        
        return result;
    } catch (error) {
        throw error;
    }
}

async function logoutUser() {
    authToken = null;
    currentUser = null;
    
    // Clear localStorage
    localStorage.removeItem('hockeyTrackerToken');
    localStorage.removeItem('hockeyTrackerUser');
    
    // Clear current data
    shots = [];
    players = [];
    goals = [];
    plusMinusEvents = [];
    faceoffStats = [];
    
    updateAuthUI();
    
    // Reset UI
    renderPlayerButtons();
    renderPlayersList();
    renderGoalsList();
    renderPlusMinusList();
    renderFaceoffStats();
    drawRink();
    updateCounters();
}

async function updateUserProfile(profileData) {
    try {
        await apiCall('/profile', 'PUT', profileData);
        
        // Update current user data
        if (profileData.fullName !== undefined) {
            currentUser.fullName = profileData.fullName;
        }
        if (profileData.teamName !== undefined) {
            currentUser.teamName = profileData.teamName;
        }
        if (profileData.email !== undefined) {
            currentUser.email = profileData.email;
        }
        
        // Update localStorage
        localStorage.setItem('hockeyTrackerUser', JSON.stringify(currentUser));
        
        updateAuthUI();
        showSuccess('profile', 'Profile updated successfully!');
        
    } catch (error) {
        throw error;
    }
}

async function changePassword(currentPassword, newPassword) {
    try {
        await apiCall('/change-password', 'PUT', { currentPassword, newPassword });
        showSuccess('profile', 'Password changed successfully!');
    } catch (error) {
        throw error;
    }
}

async function deleteUserAccount(password) {
    try {
        await apiCall('/account', 'DELETE', { password });
        await logoutUser();
        await showAlert('Account Deleted', 'Your account and all data have been permanently deleted.');
    } catch (error) {
        throw error;
    }
}

async function getUserProfile() {
    try {
        const result = await apiCall('/profile');
        userTeams = result.teams || [];
        
        // Update currentUser with latest data from server
        if (result.user) {
            currentUser = { ...currentUser, ...result.user };
            console.log('Updated currentUser from server:', currentUser);
        }
        
        renderProfileTeamsList();
        return result.user;
    } catch (error) {
        throw error;
    }
}

// Data persistence API calls
async function saveUserData(type, data) {
    try {
        console.log(`Saving ${type} data:`, data);
        console.log(`Current user when saving ${type}:`, currentUser);
        console.log(`Current user team ID when saving ${type}:`, currentUser?.teamId);
        const result = await apiCall(`/data/${type}`, 'POST', { data });
        console.log(`Successfully saved ${type} data:`, result);
    } catch (error) {
        console.error(`Failed to save ${type} data:`, error);
        // Fallback to localStorage if server is unavailable
        localStorage.setItem(`hockeyTracker${type.charAt(0).toUpperCase() + type.slice(1)}`, JSON.stringify(data));
        console.log(`Saved ${type} data to localStorage as fallback`);
    }
}

async function loadUserData() {
    if (!currentUser) return;
    
    console.log('Loading user data...');
    console.log('Current user before loading:', currentUser);
    console.log('Current user teamId before loading:', currentUser?.teamId);
    
    try {
        // Load shots data
        const shotsResult = await apiCall('/data/shots');
        if (shotsResult.data) {
            const data = shotsResult.data;
            shots = data.shots || [];
            shotIdCounter = data.shotIdCounter || 0;
            gameName = data.gameName || '';
            attackDirection = data.attackDirection || 'left';
            currentPeriod = data.currentPeriod || 1;
            gameNameInput.value = gameName;
            updateDirectionButton();
            updatePeriodButtons();
        }

        // Load players data
        const playersResult = await apiCall('/data/players');
        console.log('Players result:', playersResult);
        console.log('Current user teamId:', currentUser.teamId);
        console.log('Current user teams:', userTeams);
        
        if (playersResult.data) {
            players = playersResult.data;
            console.log('Loaded players:', players);
        } else {
            console.log('No players data found for team:', currentUser.teamId);
            players = [];
        }

        // Load stats data
        const statsResult = await apiCall('/data/stats');
        if (statsResult.data) {
            const data = statsResult.data;
            goals = data.goals || [];
            goalIdCounter = data.goalIdCounter || 0;
            plusMinusEvents = data.plusMinusEvents || [];
            plusMinusIdCounter = data.plusMinusIdCounter || 0;
            faceoffStats = data.faceoffStats || [];
            statsGameName = data.statsGameName || '';
            statsGameNameInput.value = statsGameName;
        }

        // Load teams first to ensure we have the team list
        await loadTeams();

        // Auto-select first team if no team is currently selected (only during initial load)
        console.log('Checking auto-selection - currentUser.teamId:', currentUser.teamId, 'userTeams.length:', userTeams.length, 'autoSelectingTeam:', window.autoSelectingTeam, 'switchingTeams:', window.switchingTeams);
        if (!currentUser.teamId && userTeams.length > 0 && !window.autoSelectingTeam && !window.switchingTeams) {
            console.log('Auto-selecting first team:', userTeams[0]);
            window.autoSelectingTeam = true;
            try {
                await switchToTeam(userTeams[0].id);
            } finally {
                window.autoSelectingTeam = false;
            }
        }

        // Load games for the current team (after team selection is complete)
        await loadGames();
        renderGameDropdown();
        
        // Update UI
        renderPlayerButtons();
        renderPlayersList();
        renderStatsPlayersList();
        renderGoalsList();
        renderPlusMinusList();
        renderFaceoffStats();
        updateLineupDisplay();
        drawRink();
        updateCounters();
        updateUI();
        
    } catch (error) {
        console.error('Failed to load user data:', error);
        // Fallback to localStorage
        loadPlayersFromStorage();
        loadShotsFromStorage();
        loadStatsFromStorage();
        await loadGames();
        renderPlayerButtons();
        renderPlayersList();
        renderStatsPlayersList();
        renderGoalsList();
        renderPlusMinusList();
        renderFaceoffStats();
        renderGameDropdown();
        drawRink();
        updateCounters();
    }
}

// UI Update Functions
function updateAuthUI() {
    const authButtons = document.getElementById('authButtons');
    const userProfile = document.getElementById('userProfile');
    const welcomeScreen = document.getElementById('welcomeScreen');
    const mainApp = document.getElementById('mainApp');
    const footer = document.querySelector('footer');
    
    if (currentUser) {
        // User is logged in
        authButtons.classList.add('hidden');
        userProfile.classList.remove('hidden');
        welcomeScreen.classList.add('hidden');
        mainApp.classList.remove('hidden');
        if (footer) footer.classList.remove('hidden');
        
        // Update user info
        const userDisplayName = document.getElementById('userDisplayName');
        const userTeam = document.getElementById('userTeam');
        
        if (userDisplayName) {
            userDisplayName.textContent = currentUser.fullName || currentUser.username;
        }
        if (userTeam) {
            // Show current team name if available
            const currentTeam = userTeams.find(team => team.id == currentUser.teamId);
            userTeam.textContent = currentTeam ? currentTeam.name : (currentUser.teamName || 'No team selected');
        }
        
    } else {
        // User is not logged in
        authButtons.classList.remove('hidden');
        userProfile.classList.add('hidden');
        welcomeScreen.classList.remove('hidden');
        mainApp.classList.add('hidden');
        if (footer) footer.classList.add('hidden');
    }
}

function switchProfileTab(tabName) {
    // Remove active class from all tabs and contents
    document.querySelectorAll('.profile-tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.profile-tab-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab and content
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}Tab`).classList.add('active');
    
    // Clear error/success messages when switching tabs
    hideError('profile');
    hideSuccess('profile');
}

function updateCurrentTeamDisplay() {
    const userTeam = document.getElementById('userTeam');
    if (userTeam && currentUser) {
        const currentTeam = userTeams.find(team => team.id == currentUser.teamId);
        userTeam.textContent = currentTeam ? currentTeam.name : 'No team selected';
        console.log('Updated team display:', currentTeam ? currentTeam.name : 'No team selected');
    } else {
        console.log('userTeam element not found or currentUser not set');
    }
}

// Restore previously selected game from localStorage
async function restoreSelectedGame() {
    try {
        const savedGame = localStorage.getItem('hockeyTrackerSelectedGame');
        if (savedGame && currentUser) {
            const gameData = JSON.parse(savedGame);
            
            // Check if the saved game belongs to the current team
            if (gameData.teamId === currentUser.teamId) {
                console.log('Restoring selected game:', gameData.gameName);
                
                // Load games first to ensure we have the latest data
                await loadGames();
                
                // Find the game in the loaded games
                const game = games.find(g => g.id == gameData.gameId);
                if (game) {
                    // Set the current game and update UI
                    currentGame = game;
                    if (gameDropdown) {
                        gameDropdown.value = gameData.gameId;
                    }
                    if (gameStatsSection) {
                        gameStatsSection.classList.remove('hidden');
                    }
                    
                    // Load the game stats
                    loadGameStats();
                    
                    // Update canvas event listeners
                    updateCanvasEventListeners();
                    
                    // Redraw the rink
                    drawGameRink();
                    
                    console.log('Successfully restored game:', gameData.gameName);
                } else {
                    console.log('Saved game not found in current games, clearing selection');
                    localStorage.removeItem('hockeyTrackerSelectedGame');
                }
            } else {
                console.log('Saved game belongs to different team, clearing selection');
                localStorage.removeItem('hockeyTrackerSelectedGame');
            }
        }
    } catch (error) {
        console.error('Error restoring selected game:', error);
        localStorage.removeItem('hockeyTrackerSelectedGame');
    }
}

// Initialize
async function init() {
    // Check for existing authentication
    const savedToken = localStorage.getItem('hockeyTrackerToken');
    const savedUser = localStorage.getItem('hockeyTrackerUser');
    
    if (savedToken && savedUser) {
        try {
            authToken = savedToken;
            currentUser = JSON.parse(savedUser);
            
            // Verify token is still valid by fetching profile
            await getUserProfile();
            
            updateAuthUI();
            await loadUserData();
            
            // Restore previously selected game if it exists
            await restoreSelectedGame();
        } catch (error) {
            console.error('Authentication failed:', error);
            // Clear invalid auth data
            localStorage.removeItem('hockeyTrackerToken');
            localStorage.removeItem('hockeyTrackerUser');
            authToken = null;
            currentUser = null;
            
            // Load from localStorage as fallback
            loadPlayersFromStorage();
            loadShotsFromStorage();
            loadStatsFromStorage();
        }
    } else {
        // No authentication, load from localStorage
        loadPlayersFromStorage();
        loadShotsFromStorage();
        loadStatsFromStorage();
    }
    
    renderPlayerButtons();
    renderPlayersList();
    renderStatsPlayersList();
    renderGoalsList();
    renderPlusMinusList();
    renderFaceoffStats();
    updateLineupDisplay(); // Initialize lineup display
    updateDirectionButton(); // Initialize direction button display
    updatePeriodButtons(); // Initialize period button display
    drawRink();
    updateUI();
    updateAuthUI();
    
    // Initialize game stats section as hidden
    if (gameStatsSection) {
        gameStatsSection.classList.add('hidden');
    }
    
    attachEventListeners();
}

// Tab Switching
async function switchTab(tabName) {
    console.log('switchTab called with tabName:', tabName);
    console.log('switchTab - currentGame before switch:', currentGame);
    
    // Save current game data before switching tabs if we're leaving games tab
    if (tabName === 'players' && currentGame) {
        console.log('Saving game data before switching to players tab');
        await saveGameStats();
    }
    
    // Remove all active classes
    playersBtn.classList.remove('active');
    gamesBtn.classList.remove('active');
    playersView.classList.remove('active');
    gamesView.classList.remove('active');
    
    // Add active class to selected tab
    if (tabName === 'players') {
        playersBtn.classList.add('active');
        playersView.classList.add('active');
        // Refresh player stats when viewing the Players tab
        renderPlayersList();
    } else if (tabName === 'games') {
        console.log('Switching to games tab');
        gamesBtn.classList.add('active');
        gamesView.classList.add('active');
        // Load games and refresh game dropdown
        await loadGames();
        renderGameDropdown();
        
        // Restore previously selected game if it exists
        if (currentGame) {
            console.log('Restoring selected game:', currentGame.name);
            console.log('Restoring selected game - currentGame:', currentGame);
            
            // Use the same logic as selecting from dropdown
            gameDropdown.value = currentGame.id;
            selectGame(currentGame.id);
        } else {
            console.log('No current game to restore');
            // Hide game stats section if no game is selected
            gameStatsSection.classList.add('hidden');
        }
        
        // Refresh stats player list and sync game name
        renderStatsPlayersList();
        renderPlayersList();
        syncStatsGameName();
    }
}

// Stats Sub-Tab Switching removed - now handled in games view

// Player Management
function loadPlayersFromStorage() {
    const saved = localStorage.getItem('hockeyTrackerPlayers');
    if (saved) {
        players = JSON.parse(saved);
    }
}

async function savePlayersToStorage() {
    if (currentUser) {
        await saveUserData('players', players);
    } else {
        localStorage.setItem('hockeyTrackerPlayers', JSON.stringify(players));
    }
}

// Shot Data Management
function loadShotsFromStorage() {
    const saved = localStorage.getItem('hockeyTrackerShots');
    if (saved) {
        const data = JSON.parse(saved);
        shots = data.shots || [];
        shotIdCounter = data.shotIdCounter || 0;
        gameName = data.gameName || '';
        attackDirection = data.attackDirection || 'left';
        currentPeriod = data.currentPeriod || 1;
        gameNameInput.value = gameName;
        updateDirectionButton();
        updatePeriodButtons();
    }
}

async function saveShotsToStorage() {
    gameName = gameNameInput.value.trim();
    const data = {
        shots: shots,
        shotIdCounter: shotIdCounter,
        gameName: gameName,
        attackDirection: attackDirection,
        currentPeriod: currentPeriod
    };
    
    console.log('saveShotsToStorage called with data:', data);
    console.log('Current user in saveShotsToStorage:', currentUser);
    console.log('Current user team ID in saveShotsToStorage:', currentUser?.teamId);
    
    if (currentUser) {
        await saveUserData('shots', data);
    } else {
        localStorage.setItem('hockeyTrackerShots', JSON.stringify(data));
    }
}

// Attack Direction Management
async function toggleAttackDirection() {
    attackDirection = attackDirection === 'right' ? 'left' : 'right';
    
    // Mirror all existing shots
    shots.forEach(shot => {
        shot.x = canvas.width - shot.x;
    });
    
    drawRink();
    updateDirectionButton();
    await saveShotsToStorage();
}

function updateDirectionButton() {
    // Check if element exists (old rink view)
    if (!toggleDirectionBtn) {
        return; // Element doesn't exist, skip rendering
    }
    
    const arrow = toggleDirectionBtn.querySelector('.direction-arrow');
    const text = toggleDirectionBtn.querySelector('.direction-text');
    
    if (attackDirection === 'right') {
        arrow.textContent = '→';
        text.textContent = 'Attacking Right';
    } else {
        arrow.textContent = '←';
        text.textContent = 'Attacking Left';
    }
}

// Period Management
async function selectPeriod(period) {
    currentPeriod = period;
    updatePeriodButtons();
    drawRink();
    updateCounters();
    await saveShotsToStorage();
}

function updatePeriodButtons() {
    // Check if elements exist (old rink view)
    if (!period1Btn || !period2Btn || !period3Btn || !periodAllBtn) {
        return; // Elements don't exist, skip rendering
    }
    
    period1Btn.classList.toggle('active', currentPeriod === 1);
    period2Btn.classList.toggle('active', currentPeriod === 2);
    period3Btn.classList.toggle('active', currentPeriod === 3);
    periodAllBtn.classList.toggle('active', currentPeriod === 'all');
}

async function addPlayer() {
    const playerName = playerNameInput.value.trim();
    if (!playerName) {
        await showAlert('Error', 'Please enter a player name');
        return;
    }
    if (players.includes(playerName)) {
        await showAlert('Error', 'Player already exists');
        return;
    }
    if (players.length >= 20) {
        await showAlert('Error', 'Maximum 20 players allowed');
        return;
    }
    
    players.push(playerName);
    await savePlayersToStorage();
    renderPlayerButtons();
    renderPlayersList();
    playerNameInput.value = '';
    
    // Auto-select the first player if none selected
    if (!currentState.selectedPlayer && players.length === 1) {
        selectPlayer(playerName);
    }
}

async function removePlayer(playerName) {
    const confirmed = await showConfirm('Confirm Removal', `Remove ${playerName} from the team?`);
    if (confirmed) {
        players = players.filter(p => p !== playerName);
        await savePlayersToStorage();
        
        // If removed player was selected, deselect
        if (currentState.selectedPlayer === playerName) {
            currentState.selectedPlayer = null;
            currentState.team = 'against';
        }
        
        // Remove from faceoff stats if present
        faceoffStats = faceoffStats.filter(fs => fs.playerName !== playerName);
        await saveStatsToStorage();
        
        renderPlayerButtons();
        renderPlayersList();
        renderFaceoffStats();
        updateUI();
    }
}

function renderPlayerButtons() {
    // Sort players alphabetically
    const sortedPlayers = [...players].sort((a, b) => a.localeCompare(b));
    
    // Check if we have the old playerButtonsContainer (for rink view)
    if (playerButtonsContainer) {
        playerButtonsContainer.innerHTML = '';
        
        if (players.length === 0) {
            playerButtonsContainer.innerHTML = '<p style="color: #666; font-size: 0.8em; font-style: italic;">Add players in the Players tab</p>';
            return;
        }
        
        sortedPlayers.forEach(playerName => {
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
    
    // Also render for game player buttons if we're in games view
    if (gamePlayerButtons) {
        gamePlayerButtons.innerHTML = '';
        
        if (players.length === 0) {
            gamePlayerButtons.innerHTML = '<p style="color: #666; font-size: 0.8em; font-style: italic;">Add players in the Players tab</p>';
            return;
        }
        
        sortedPlayers.forEach(playerName => {
            const btn = document.createElement('button');
            btn.className = 'player-btn';
            btn.textContent = playerName;
            btn.dataset.player = playerName;
            
            if (currentState.selectedPlayer === playerName) {
                btn.classList.add('active');
            }
            
            btn.addEventListener('click', () => selectPlayer(playerName));
            gamePlayerButtons.appendChild(btn);
        });
    }
    
    // Also render for goals & assists player buttons
    renderGoalsAssistsPlayerButtons();
    
    // Also render for lineup and faceoffs player buttons
    renderLineupPlayerButtons();
    renderFaceoffsPlayerButtons();
}

// Calculate player stats from all games in the current team
function calculatePlayerStatsFromAllGames(playerName) {
    let totalShots = 0;
    let scores = 0;
    let misses = 0;
    let goals = 0;
    let assists = 0;
    let plusCount = 0;
    let minusCount = 0;
    let faceoffsTaken = 0;
    let faceoffsWon = 0;
    
    // Loop through all games in the current team
    games.forEach(game => {
        if (game.stats) {
            // Calculate shots from rink stats
            if (game.stats.rink && game.stats.rink.shots) {
                const gameShots = game.stats.rink.shots.filter(s => s.playerName === playerName);
                totalShots += gameShots.length;
                scores += gameShots.filter(s => s.result === 'score').length;
                misses += gameShots.filter(s => s.result === 'miss').length;
            }
            
            // Calculate goals and assists from goals stats
            if (game.stats.goals) {
                game.stats.goals.forEach(goal => {
                    if (goal.goal === playerName) {
                        goals++;
                    }
                    if (goal.assist1 === playerName || goal.assist2 === playerName) {
                        assists++;
                    }
                });
            }
            
            // Calculate +/- from plus/minus events
            if (game.stats.plusMinus) {
                game.stats.plusMinus.forEach(event => {
                    const isOnIce = Object.values(event.lineup).includes(playerName);
                    if (isOnIce) {
                        if (event.type === 'plus') {
                            plusCount++;
                        } else {
                            minusCount++;
                        }
                    }
                });
            }
            
            // Calculate faceoff stats
            if (game.stats.faceoffs) {
                const faceoffData = game.stats.faceoffs.find(fs => fs.playerName === playerName);
                if (faceoffData) {
                    faceoffsTaken += faceoffData.taken || 0;
                    faceoffsWon += faceoffData.won || 0;
                }
            }
        }
    });
    
    return {
        totalShots,
        scores,
        misses,
        goals,
        assists,
        plusMinus: plusCount - minusCount,
        faceoffsTaken,
        faceoffsWon
    };
}

function renderPlayersList() {
    if (players.length === 0) {
        playersListEl.innerHTML = '<p class="no-players">No players added yet. Add players above to start tracking individual performance.</p>';
        return;
    }
    
    playersListEl.innerHTML = '';
    players.forEach(playerName => {
        // Calculate stats from all games in the current team
        const playerStats = calculatePlayerStatsFromAllGames(playerName);
        
        const totalShots = playerStats.totalShots;
        const scores = playerStats.scores;
        const misses = playerStats.misses;
        const percentage = totalShots > 0 ? ((scores / totalShots) * 100).toFixed(1) : '0.0';
        
        const assists = playerStats.assists;
        const goals = playerStats.goals;
        
        const plusMinus = playerStats.plusMinus;
        const plusMinusDisplay = plusMinus > 0 ? `+${plusMinus}` : plusMinus.toString();
        
        const faceoffsTaken = playerStats.faceoffsTaken;
        const faceoffsWon = playerStats.faceoffsWon;
        const faceoffPercentage = faceoffsTaken > 0 ? ((faceoffsWon / faceoffsTaken) * 100).toFixed(1) : '0.0';
        
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
            <span class="stat-detail"><strong>Goals:</strong> ${goals}</span>
            <span class="stat-detail"><strong>Assists:</strong> ${assists}</span>
            <span class="stat-detail"><strong>Misses:</strong> ${misses}</span>
            <span class="stat-detail percentage"><strong>Shot %:</strong> ${percentage}%</span>
            <span class="stat-detail plusminus-stat"><strong>+/-:</strong> ${plusMinusDisplay}</span>
            <span class="stat-detail"><strong>FO Taken:</strong> ${faceoffsTaken}</span>
            <span class="stat-detail"><strong>FO Won:</strong> ${faceoffsWon}</span>
            <span class="stat-detail percentage"><strong>FO %:</strong> ${faceoffPercentage}%</span>
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
async function exportPlayers() {
    if (players.length === 0) {
        await showAlert('Error', 'No players to export!');
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
    link.download = `hockey-tracker-players-${Date.now()}.json`;
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
    reader.onload = async function(e) {
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
            const action = await showConfirm(
                'Import Players',
                `Import ${data.players.length} players.\n\nClick OK to ADD to existing players (${players.length} current).\nClick CANCEL to REPLACE all existing players.`
            );
            
            if (action) {
                // Add to existing (avoid duplicates)
                const newPlayers = data.players.filter(p => !players.includes(p));
                players = [...players, ...newPlayers];
                await showAlert('Success', `Added ${newPlayers.length} new players! Total: ${players.length}`);
            } else {
                // Replace all
                players = [...data.players];
                // Deselect current player if not in new list
                if (!players.includes(currentState.selectedPlayer)) {
                    currentState.selectedPlayer = null;
                    currentState.team = 'against';
                }
                await showAlert('Success', `Replaced with ${players.length} players!`);
            }
            
            await savePlayersToStorage();
            renderPlayerButtons();
            renderPlayersList();
            updateUI();
            
        } catch (error) {
            await showAlert('Import Failed', `${error.message}\n\nPlease select a valid Hockey Tracker Players JSON file.`);
        }
    };
    
    reader.readAsText(file);
    
    // Reset file input
    playersFileInput.value = '';
}

// Clear all players
async function clearAllPlayers() {
    if (players.length === 0) {
        await showAlert('Error', 'No players to clear!');
        return;
    }
    
    const confirmed = await showConfirm('Confirm Clear All', `Remove all ${players.length} players from the roster?`);
    if (confirmed) {
        players = [];
        currentState.selectedPlayer = null;
        currentState.team = 'against';
        await savePlayersToStorage();
        renderPlayerButtons();
        renderPlayersList();
        updateUI();
        await showAlert('Success', 'All players cleared!');
    }
}

// Stats Management Functions
function loadStatsFromStorage() {
    const saved = localStorage.getItem('hockeyTrackerStats');
    if (saved) {
        const data = JSON.parse(saved);
        goals = data.goals || [];
        goalIdCounter = data.goalIdCounter || 0;
        plusMinusEvents = data.plusMinusEvents || [];
        plusMinusIdCounter = data.plusMinusIdCounter || 0;
        faceoffStats = data.faceoffStats || [];
        statsGameName = data.statsGameName || '';
        if (statsGameNameInput) {
            statsGameNameInput.value = statsGameName;
        }
    }
}

async function saveStatsToStorage() {
    // Only update statsGameName if the input element exists
    if (statsGameNameInput) {
        statsGameName = statsGameNameInput.value.trim();
    }
    
    const data = {
        goals: goals,
        goalIdCounter: goalIdCounter,
        plusMinusEvents: plusMinusEvents,
        plusMinusIdCounter: plusMinusIdCounter,
        faceoffStats: faceoffStats,
        statsGameName: statsGameName
    };
    
    if (currentUser) {
        await saveUserData('stats', data);
    } else {
        localStorage.setItem('hockeyTrackerStats', JSON.stringify(data));
    }
}

function syncStatsGameName() {
    // Check if elements exist before accessing them
    if (!statsGameNameInput || !gameNameInput) {
        return; // Elements don't exist, skip
    }
    
    // Sync game name from Rink tab if Stats game name is empty
    if (!statsGameNameInput.value.trim() && gameNameInput.value.trim()) {
        statsGameNameInput.value = gameNameInput.value.trim();
        statsGameName = statsGameNameInput.value;
        saveStatsToStorage();
    }
}

function renderStatsPlayersList() {
    // Check if statsPlayersList exists (old stats view)
    if (!statsPlayersList) {
        return; // Element doesn't exist, skip rendering
    }
    
    if (players.length === 0) {
        statsPlayersList.innerHTML = '<p class="no-players">No players available. Add players in the Players tab.</p>';
        return;
    }
    
    statsPlayersList.innerHTML = '';
    players.forEach(playerName => {
        const btn = document.createElement('button');
        btn.className = 'stats-player-btn';
        btn.textContent = playerName;
        btn.dataset.player = playerName;
        btn.addEventListener('click', () => assignPlayerToPosition(playerName));
        statsPlayersList.appendChild(btn);
    });
}

function activateAssignmentButton(buttonType) {
    // Deactivate all goal/assist buttons first
    goalBtn.classList.remove('active');
    assist1Btn.classList.remove('active');
    assist2Btn.classList.remove('active');
    
    // Deactivate position buttons when goal/assist is selected
    leftWingBtn.classList.remove('active');
    centerBtn.classList.remove('active');
    rightWingBtn.classList.remove('active');
    leftDefenceBtn.classList.remove('active');
    rightDefenceBtn.classList.remove('active');
    activePositionButton = null;
    
    // Set active button
    activeAssignmentButton = buttonType;
    
    if (buttonType === 'goal') {
        goalBtn.classList.add('active');
    } else if (buttonType === 'assist1') {
        assist1Btn.classList.add('active');
    } else if (buttonType === 'assist2') {
        assist2Btn.classList.add('active');
    }
}

function updateAssignmentDisplay() {
    // Check if elements exist (old stats view)
    if (!goalPlayerName || !assist1PlayerName || !assist2PlayerName) {
        return; // Elements don't exist, skip rendering
    }
    
    // Update goal display
    if (currentAssignments.goal) {
        goalPlayerName.textContent = currentAssignments.goal;
        goalBtn.classList.add('assigned');
    } else {
        goalPlayerName.textContent = 'Click to assign';
        goalBtn.classList.remove('assigned');
    }
    
    // Update assist 1 display
    if (currentAssignments.assist1) {
        assist1PlayerName.textContent = currentAssignments.assist1;
        assist1Btn.classList.add('assigned');
    } else {
        assist1PlayerName.textContent = 'Click to assign';
        assist1Btn.classList.remove('assigned');
    }
    
    // Update assist 2 display
    if (currentAssignments.assist2) {
        assist2PlayerName.textContent = currentAssignments.assist2;
        assist2Btn.classList.add('assigned');
    } else {
        assist2PlayerName.textContent = 'Click to assign';
        assist2Btn.classList.remove('assigned');
    }
}

async function submitGoal() {
    if (!currentAssignments.goal) {
        await showAlert('Error', 'Please assign a goal scorer');
        return;
    }
    
    const goal = {
        id: goalIdCounter++,
        goal: currentAssignments.goal,
        assist1: currentAssignments.assist1,
        assist2: currentAssignments.assist2,
        timestamp: new Date().toISOString()
    };
    
    goals.push(goal);
    await saveStatsToStorage();
    renderGoalsList();
    
    // Update player stats if on Players tab
    if (playersView.classList.contains('active')) {
        renderPlayersList();
    }
    
    // Clear assignments after submit
    clearAssignments();
}

function clearAssignments() {
    currentAssignments = {
        goal: null,
        assist1: null,
        assist2: null
    };
    activeAssignmentButton = null;
    
    goalBtn.classList.remove('active');
    assist1Btn.classList.remove('active');
    assist2Btn.classList.remove('active');
    
    updateAssignmentDisplay();
}

function renderGoalsList() {
    // Check if goalsList exists (old stats view)
    if (!goalsList) {
        return; // Element doesn't exist, skip rendering
    }
    
    if (goals.length === 0) {
        goalsList.innerHTML = '<p class="no-goals">No goals recorded yet.</p>';
        return;
    }
    
    goalsList.innerHTML = '';
    goals.forEach((goal, index) => {
        const item = document.createElement('div');
        item.className = 'goal-item';
        
        const info = document.createElement('div');
        info.className = 'goal-info';
        
        const scorer = document.createElement('div');
        scorer.className = 'goal-scorer';
        scorer.textContent = `⚽ ${goal.goal}`;
        
        const assists = document.createElement('div');
        assists.className = 'goal-assists';
        let assistsText = '';
        if (goal.assist1) {
            assistsText += `<strong>${goal.assist1}</strong>`;
        }
        if (goal.assist2) {
            if (assistsText) assistsText += ', ';
            assistsText += `<strong>${goal.assist2}</strong>`;
        }
        if (assistsText) {
            assists.innerHTML = `Assists: ${assistsText}`;
        } else {
            assists.textContent = 'Unassisted';
        }
        
        info.appendChild(scorer);
        info.appendChild(assists);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-goal-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteGoal(goal.id));
        
        item.appendChild(info);
        item.appendChild(deleteBtn);
        goalsList.appendChild(item);
    });
}

async function deleteGoal(goalId) {
    const confirmed = await showConfirm('Confirm Delete', 'Delete this goal?');
    if (confirmed) {
        goals = goals.filter(g => g.id !== goalId);
        await saveStatsToStorage();
        renderGoalsList();
        
        // Update player stats if on Players tab
        if (playersView.classList.contains('active')) {
            renderPlayersList();
        }
    }
}

// Lineup +/- Functions
function activatePositionButton(position) {
    // Deactivate all position buttons
    leftWingBtn.classList.remove('active');
    centerBtn.classList.remove('active');
    rightWingBtn.classList.remove('active');
    leftDefenceBtn.classList.remove('active');
    rightDefenceBtn.classList.remove('active');
    
    // Deactivate goal/assist buttons when position is selected
    goalBtn.classList.remove('active');
    assist1Btn.classList.remove('active');
    assist2Btn.classList.remove('active');
    activeAssignmentButton = null;
    
    // Set active position
    activePositionButton = position;
    
    const buttonMap = {
        leftWing: leftWingBtn,
        center: centerBtn,
        rightWing: rightWingBtn,
        leftDefence: leftDefenceBtn,
        rightDefence: rightDefenceBtn
    };
    
    if (buttonMap[position]) {
        buttonMap[position].classList.add('active');
    }
}

function assignPlayerToPosition(playerName) {
    // Check if we should add to faceoff tracking
    if (activeFaceoffAddButton) {
        addPlayerToFaceoffs(playerName);
        return;
    }
    
    // Check if we should assign to position or to goal/assist
    if (activePositionButton) {
        currentLineup[activePositionButton] = playerName;
        updateLineupDisplay();
    } else if (activeAssignmentButton) {
        currentAssignments[activeAssignmentButton] = playerName;
        updateAssignmentDisplay();
    } else {
        showAlert('Error', 'Please select a position, goal, or assist button first');
    }
}

function updateLineupDisplay() {
    // Check if elements exist (old stats view)
    if (!leftWingPlayerName || !centerPlayerName || !rightWingPlayerName || 
        !leftDefencePlayerName || !rightDefencePlayerName) {
        return; // Elements don't exist, skip rendering
    }
    
    // Update left wing
    if (currentLineup.leftWing) {
        leftWingPlayerName.textContent = currentLineup.leftWing;
        leftWingBtn.classList.add('assigned');
    } else {
        leftWingPlayerName.textContent = 'Click to assign';
        leftWingBtn.classList.remove('assigned');
    }
    
    // Update center
    if (currentLineup.center) {
        centerPlayerName.textContent = currentLineup.center;
        centerBtn.classList.add('assigned');
    } else {
        centerPlayerName.textContent = 'Click to assign';
        centerBtn.classList.remove('assigned');
    }
    
    // Update right wing
    if (currentLineup.rightWing) {
        rightWingPlayerName.textContent = currentLineup.rightWing;
        rightWingBtn.classList.add('assigned');
    } else {
        rightWingPlayerName.textContent = 'Click to assign';
        rightWingBtn.classList.remove('assigned');
    }
    
    // Update left defence
    if (currentLineup.leftDefence) {
        leftDefencePlayerName.textContent = currentLineup.leftDefence;
        leftDefenceBtn.classList.add('assigned');
    } else {
        leftDefencePlayerName.textContent = 'Click to assign';
        leftDefenceBtn.classList.remove('assigned');
    }
    
    // Update right defence
    if (currentLineup.rightDefence) {
        rightDefencePlayerName.textContent = currentLineup.rightDefence;
        rightDefenceBtn.classList.add('assigned');
    } else {
        rightDefencePlayerName.textContent = 'Click to assign';
        rightDefenceBtn.classList.remove('assigned');
    }
}

async function recordPlusMinus(type) {
    // Check if at least one position is filled
    const hasPlayers = Object.values(currentLineup).some(p => p !== null);
    
    if (!hasPlayers) {
        await showAlert('Error', 'Please assign at least one player to a position');
        return;
    }
    
    const event = {
        id: plusMinusIdCounter++,
        type: type, // 'plus' or 'minus'
        lineup: { ...currentLineup },
        timestamp: new Date().toISOString()
    };
    
    plusMinusEvents.push(event);
    await saveStatsToStorage();
    renderPlusMinusList();
    
    // Update player stats if on Players tab
    if (playersView.classList.contains('active')) {
        renderPlayersList();
    }
}

function clearLineup() {
    currentLineup = {
        leftWing: null,
        center: null,
        rightWing: null,
        leftDefence: null,
        rightDefence: null
    };
    activePositionButton = null;
    
    leftWingBtn.classList.remove('active');
    centerBtn.classList.remove('active');
    rightWingBtn.classList.remove('active');
    leftDefenceBtn.classList.remove('active');
    rightDefenceBtn.classList.remove('active');
    
    updateLineupDisplay();
}

function renderPlusMinusList() {
    // Check if plusMinusList exists (old stats view)
    if (!plusMinusList) {
        return; // Element doesn't exist, skip rendering
    }
    
    if (plusMinusEvents.length === 0) {
        plusMinusList.innerHTML = '<p class="no-events">No +/- events recorded yet.</p>';
        return;
    }
    
    plusMinusList.innerHTML = '';
    plusMinusEvents.forEach(event => {
        const item = document.createElement('div');
        item.className = `plusminus-item ${event.type}`;
        
        const info = document.createElement('div');
        info.className = 'plusminus-info';
        
        const typeLabel = document.createElement('div');
        typeLabel.className = 'plusminus-type';
        typeLabel.textContent = event.type === 'plus' ? '+ Goal For' : '- Goal Against';
        
        const lineup = document.createElement('div');
        lineup.className = 'lineup-players';
        let lineupHTML = '';
        
        if (event.lineup.leftWing) lineupHTML += `<span class="position-item"><span class="position-label">LW:</span> ${event.lineup.leftWing}</span>`;
        if (event.lineup.center) lineupHTML += `<span class="position-item"><span class="position-label">C:</span> ${event.lineup.center}</span>`;
        if (event.lineup.rightWing) lineupHTML += `<span class="position-item"><span class="position-label">RW:</span> ${event.lineup.rightWing}</span>`;
        if (event.lineup.leftDefence) lineupHTML += `<span class="position-item"><span class="position-label">LD:</span> ${event.lineup.leftDefence}</span>`;
        if (event.lineup.rightDefence) lineupHTML += `<span class="position-item"><span class="position-label">RD:</span> ${event.lineup.rightDefence}</span>`;
        
        lineup.innerHTML = lineupHTML;
        
        info.appendChild(typeLabel);
        info.appendChild(lineup);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-plusminus-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deletePlusMinusEvent(event.id));
        
        item.appendChild(info);
        item.appendChild(deleteBtn);
        plusMinusList.appendChild(item);
    });
}

async function deletePlusMinusEvent(eventId) {
    const confirmed = await showConfirm('Confirm Delete', 'Delete this +/- event?');
    if (confirmed) {
        plusMinusEvents = plusMinusEvents.filter(e => e.id !== eventId);
        await saveStatsToStorage();
        renderPlusMinusList();
        
        // Update player stats if on Players tab
        if (playersView.classList.contains('active')) {
            renderPlayersList();
        }
    }
}

// Faceoffs Functions
function activateFaceoffAddButton() {
    console.log('activateFaceoffAddButton called');
    console.log('currentFaceoffsPlayer:', currentFaceoffsPlayer);
    
    // Check if a player is selected
    if (!currentFaceoffsPlayer) {
        console.log('No player selected for faceoffs');
        showAlert('No Player Selected', 'Please select a player first before adding to faceoffs.');
        return;
    }
    
    // Add the selected player to faceoff stats
    addFaceoffPlayer(currentFaceoffsPlayer);
}

async function addPlayerToFaceoffs(playerName) {
    if (faceoffStats.find(fs => fs.playerName === playerName)) {
        await showAlert('Error', 'Player already in faceoff tracking');
        activeFaceoffAddButton = false;
        renderFaceoffStats();
        return;
    }
    
    faceoffStats.push({
        playerName: playerName,
        taken: 0,
        won: 0
    });
    
    activeFaceoffAddButton = false;
    await saveStatsToStorage();
    renderFaceoffStats();
}

async function incrementFaceoff(playerName, won) {
    const player = faceoffStats.find(fs => fs.playerName === playerName);
    if (player) {
        player.taken++;
        if (won) {
            player.won++;
        }
        // Save to current game if in game context, otherwise save to global storage
        if (currentGame) {
            await saveGameStats();
        } else {
            await saveStatsToStorage();
        }
        renderFaceoffStats();
        
        // Update player stats if on Players tab
        if (playersView.classList.contains('active')) {
            renderPlayersList();
        }
    }
}

function renderFaceoffStats() {
    // Check if faceoffPlayersList exists (old stats view)
    if (!faceoffPlayersList) {
        return; // Element doesn't exist, skip rendering
    }
    
    faceoffPlayersList.innerHTML = '';
    
    // Render existing players
    faceoffStats.forEach(player => {
        const row = document.createElement('div');
        row.className = 'faceoff-player-row';
        
        const name = document.createElement('div');
        name.className = 'faceoff-player-name';
        name.textContent = player.playerName;
        
        const taken = document.createElement('div');
        taken.className = 'faceoff-stat';
        taken.textContent = player.taken;
        
        const won = document.createElement('div');
        won.className = 'faceoff-stat';
        won.textContent = player.won;
        
        const actions = document.createElement('div');
        actions.className = 'faceoff-actions';
        
        const plusBtn = document.createElement('button');
        plusBtn.className = 'faceoff-btn faceoff-plus-btn';
        plusBtn.textContent = '+ Won';
        plusBtn.title = 'Won faceoff';
        plusBtn.style.backgroundColor = '#28a745';
        plusBtn.style.color = 'white';
        plusBtn.style.border = '1px solid #28a745';
        plusBtn.addEventListener('click', async () => await incrementFaceoff(player.playerName, true));
        
        const minusBtn = document.createElement('button');
        minusBtn.className = 'faceoff-btn faceoff-minus-btn';
        minusBtn.textContent = '- Loss';
        minusBtn.title = 'Lost faceoff';
        minusBtn.style.backgroundColor = '#dc3545';
        minusBtn.style.color = 'white';
        minusBtn.style.border = '1px solid #dc3545';
        minusBtn.addEventListener('click', async () => await incrementFaceoff(player.playerName, false));
        
        actions.appendChild(plusBtn);
        actions.appendChild(minusBtn);
        
        const deleteCol = document.createElement('div');
        deleteCol.style.textAlign = 'center';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'faceoff-delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteFaceoffPlayer(player.playerName));
        
        deleteCol.appendChild(deleteBtn);
        
        row.appendChild(name);
        row.appendChild(taken);
        row.appendChild(won);
        row.appendChild(actions);
        row.appendChild(deleteCol);
        
        faceoffPlayersList.appendChild(row);
    });
    
    // Add "Add Player" button row
    const addRow = document.createElement('div');
    addRow.className = 'add-faceoff-row';
    
    const addBtn = document.createElement('button');
    addBtn.className = 'add-faceoff-btn';
    if (activeFaceoffAddButton) {
        addBtn.classList.add('active');
    }
    addBtn.textContent = 'Add Player';
    addBtn.addEventListener('click', activateFaceoffAddButton);
    
    addRow.appendChild(addBtn);
    faceoffPlayersList.appendChild(addRow);
}

async function deleteFaceoffPlayer(playerName) {
    const confirmed = await showConfirm('Confirm Delete', `Remove ${playerName} from faceoff tracking?`);
    if (confirmed) {
        faceoffStats = faceoffStats.filter(fs => fs.playerName !== playerName);
        await saveStatsToStorage();
        renderFaceoffStats();
        
        // Update player stats if on Players tab
        if (playersView.classList.contains('active')) {
            renderPlayersList();
        }
    }
}

// Export stats to JSON
async function exportStats() {
    if (goals.length === 0 && plusMinusEvents.length === 0 && faceoffStats.length === 0) {
        await showAlert('Error', 'No stats to export!');
        return;
    }
    
    statsGameName = statsGameNameInput.value.trim();
    
    const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        gameName: statsGameName || 'Unnamed Game',
        totalGoals: goals.length,
        totalPlusMinusEvents: plusMinusEvents.length,
        goals: goals,
        plusMinusEvents: plusMinusEvents,
        faceoffStats: faceoffStats
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    
    // Create filename with game name if available
    let filename = 'hockey-tracker-stats';
    if (statsGameName) {
        const sanitizedName = statsGameName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
        filename = `hockey-tracker-stats-${sanitizedName}`;
    }
    filename += `-${Date.now()}.json`;
    
    link.download = filename;
    link.click();
    
    URL.revokeObjectURL(url);
}

// Import stats from JSON
function importStats() {
    statsFileInput.click();
}

// Handle stats file selection
function handleStatsFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            // Validate data structure
            if (!data.goals || !Array.isArray(data.goals)) {
                throw new Error('Invalid data format: missing or invalid goals array');
            }
            
            const importGoals = data.goals.length;
            const importPlusMinus = (data.plusMinusEvents || []).length;
            const importFaceoffs = (data.faceoffStats || []).length;
            
            // Ask user if they want to replace or merge
            const action = await showConfirm(
                'Import Stats',
                `Import ${importGoals} goals, ${importPlusMinus} +/- events, and ${importFaceoffs} faceoff players.\n\nClick OK to ADD to existing data.\nClick CANCEL to REPLACE all existing data.`
            );
            
            if (action) {
                // Add to existing
                goals = [...goals, ...data.goals];
                plusMinusEvents = [...plusMinusEvents, ...(data.plusMinusEvents || [])];
                
                // Merge faceoff stats (avoid duplicates, sum stats for same player)
                const importedFaceoffs = data.faceoffStats || [];
                importedFaceoffs.forEach(importedPlayer => {
                    const existing = faceoffStats.find(fs => fs.playerName === importedPlayer.playerName);
                    if (existing) {
                        existing.taken += importedPlayer.taken;
                        existing.won += importedPlayer.won;
                    } else {
                        faceoffStats.push({...importedPlayer});
                    }
                });
                
                await showAlert('Success', `Added ${importGoals} goals, ${importPlusMinus} +/- events, and ${importFaceoffs} faceoff players!`);
            } else {
                // Replace all
                goals = [...data.goals];
                plusMinusEvents = [...(data.plusMinusEvents || [])];
                faceoffStats = [...(data.faceoffStats || [])];
                await showAlert('Success', `Replaced with ${importGoals} goals, ${importPlusMinus} +/- events, and ${importFaceoffs} faceoff players!`);
            }
            
            goalIdCounter = goals.length > 0 ? Math.max(...goals.map(g => g.id), 0) + 1 : 0;
            plusMinusIdCounter = plusMinusEvents.length > 0 ? Math.max(...plusMinusEvents.map(e => e.id), 0) + 1 : 0;
            
            // Import game name if current is empty
            if (data.gameName && !statsGameNameInput.value.trim()) {
                statsGameName = data.gameName;
                statsGameNameInput.value = statsGameName;
            }
            
            await saveStatsToStorage();
            renderGoalsList();
            renderPlusMinusList();
            renderFaceoffStats();
            
            // Update player stats if on Players tab
            if (playersView.classList.contains('active')) {
                renderPlayersList();
            }
            
        } catch (error) {
            await showAlert('Import Failed', `${error.message}\n\nPlease select a valid Hockey Tracker Stats JSON file.`);
        }
    };
    
    reader.readAsText(file);
    statsFileInput.value = '';
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
    ctx.moveTo(width * 0.33, 0);
    ctx.lineTo(width * 0.33, height);
    ctx.stroke();
    
    // Right blue line
    ctx.beginPath();
    ctx.moveTo(width * 0.66, 0);
    ctx.lineTo(width * 0.66, height);
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

    // Filter and redraw shot markers based on selected period
    const shotsToDisplay = currentPeriod === 'all' 
        ? shots 
        : shots.filter(shot => shot.period === currentPeriod);
    
    shotsToDisplay.forEach(shot => drawMarker(shot));
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
    // Check if elements exist (old rink view)
    if (!statusDisplay || !statusText) {
        return; // Elements don't exist, skip rendering
    }
    
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
    // Check if elements exist (old rink view)
    if (!forShotsEl || !forScoresEl || !forMissesEl || 
        !againstShotsEl || !againstScoresEl || !againstMissesEl) {
        return; // Elements don't exist, skip rendering
    }
    
    // Filter shots based on selected period
    const periodShots = currentPeriod === 'all' 
        ? shots 
        : shots.filter(s => s.period === currentPeriod);
    
    // FOR stats (includes all player shots)
    const forShots = periodShots.filter(s => s.teamState === 'for' || s.teamState === 'player');
    forShotsEl.textContent = forShots.length;
    forScoresEl.textContent = forShots.filter(s => s.resultState === 'score').length;
    forMissesEl.textContent = forShots.filter(s => s.resultState === 'miss').length;
    
    // AGAINST stats
    const againstShots = periodShots.filter(s => s.teamState === 'against');
    againstShotsEl.textContent = againstShots.length;
    againstScoresEl.textContent = againstShots.filter(s => s.resultState === 'score').length;
    againstMissesEl.textContent = againstShots.filter(s => s.resultState === 'miss').length;
}

// Handle canvas click
async function handleCanvasClick(event) {
    console.log('handleCanvasClick called!', event);
    console.log('currentPeriod:', currentPeriod);
    console.log('currentState:', currentState);
    
    // Check if a specific period is selected
    if (currentPeriod === 'all') {
        await showAlert('Error', 'Please select a specific period (1, 2, or 3) to add shots');
        return;
    }
    
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
        period: currentPeriod,
        timestamp: new Date().toISOString()
    };
    
    shots.push(shot);
    drawMarker(shot);
    updateCounters();
    await saveShotsToStorage();
}

// Handle canvas mousemove for tooltip
function handleCanvasMouseMove(event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const mouseX = (event.clientX - rect.left) * scaleX;
    const mouseY = (event.clientY - rect.top) * scaleY;
    
    // Filter shots based on current period (only show tooltip for visible shots)
    const visibleShots = currentPeriod === 'all' 
        ? shots 
        : shots.filter(shot => shot.period === currentPeriod);
    
    // Find shot under mouse (within 12px radius) from visible shots only
    const hoveredShot = visibleShots.find(shot => {
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
    // Format player/team info - handle both 'team' and 'teamState' properties
    let playerInfo = '';
    const shotTeam = shot.team || shot.teamState;
    if (shot.playerName) {
        playerInfo = `<span class="player-name">${shot.playerName}</span>`;
    } else if (shotTeam === 'against') {
        playerInfo = `<span class="against-label">AGAINST</span>`;
    } else {
        playerInfo = `<span class="player-name">FOR</span>`;
    }
    
    // Format result - handle both 'result' and 'resultState' properties
    const shotResult = shot.result || shot.resultState;
    const resultIcon = shotResult === 'score' ? '⚽' : '❌';
    const resultText = shotResult === 'score' ? 'SCORE' : 'MISS';
    
    // Format period
    const periodText = shot.period ? `Period ${shot.period}` : 'Unknown Period';
    
    // Format timestamp
    const date = new Date(shot.timestamp);
    const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Get game name for debugging
    const gameName = currentGame ? currentGame.name : (gameNameInput ? gameNameInput.value : 'No Game');
    
    // Build tooltip content
    const tooltipContent = `
        <div>${playerInfo}</div>
        <div class="shot-result">${resultIcon} ${resultText}</div>
        <div class="shot-time">${periodText} • ${timeStr}</div>
        <div class="shot-game" style="color: #666; font-size: 0.8em; margin-top: 4px;">Game: ${gameName}</div>
    `;
    
    // Determine which canvas and tooltip to use
    const isGameRink = currentGame && gameRinkCanvas && gameRinkCanvas.contains(event.target);
    const targetTooltip = isGameRink ? gameShotTooltip : shotTooltip;
    const targetCanvas = isGameRink ? gameRinkCanvas : canvas;
    
    if (targetTooltip && targetCanvas) {
        targetTooltip.innerHTML = tooltipContent;
        
        // Position tooltip - account for mirroring when attacking right
        const containerRect = targetCanvas.parentElement.getBoundingClientRect();
        let tooltipX = clientX - containerRect.left + 15;
        
        // If we're in game mode and attacking right, we need to mirror the tooltip position
        if (isGameRink && attackDirection === 'right') {
            // Calculate the mirrored position of the shot on the canvas
            const canvasRect = targetCanvas.getBoundingClientRect();
            const shotCanvasX = targetCanvas.width - shot.x;
            const shotScreenX = canvasRect.left + shotCanvasX;
            tooltipX = shotScreenX - containerRect.left + 15;
        }
        
        targetTooltip.style.left = `${tooltipX}px`;
        targetTooltip.style.top = `${clientY - containerRect.top - 10}px`;
        targetTooltip.classList.add('visible');
    }
}

// Hide shot tooltip
function hideShotTooltip() {
    if (shotTooltip) {
        shotTooltip.classList.remove('visible');
    }
    if (gameShotTooltip) {
        gameShotTooltip.classList.remove('visible');
    }
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

// Game Rink Control Functions
function toggleGameResult(result) {
    currentState.result = result;
    updateGameUI();
}

function toggleGameAgainst() {
    currentState.team = 'against';
    currentState.selectedPlayer = null;
    renderGamePlayerButtons();
    updateGameUI();
}

// Update Game UI
function updateGameUI() {
    const gameStatusDisplay = document.getElementById('gameStatusDisplay');
    if (!gameStatusDisplay) return;
    
    let displayTeam = currentState.team === 'player' ? 'for' : 'against';
    const stateClass = `${currentState.result}-${displayTeam}`;
    
    // Update status display
    gameStatusDisplay.className = `status-display ${stateClass}`;
    
    let statusTeamText = currentState.team === 'player' && currentState.selectedPlayer 
        ? currentState.selectedPlayer 
        : currentState.team.toUpperCase();
    
    gameStatusDisplay.textContent = `${currentState.result.toUpperCase()} - ${statusTeamText}`;
    
    // Update button states
    if (gameScoreBtn) {
        gameScoreBtn.classList.toggle('active', currentState.result === 'score');
    }
    if (gameMissBtn) {
        gameMissBtn.classList.toggle('active', currentState.result === 'miss');
    }
    if (gameAgainstBtn) {
        gameAgainstBtn.classList.toggle('active', currentState.team === 'against');
    }
}

// Render Game Player Buttons
function renderGamePlayerButtons() {
    if (!gamePlayerButtons) return;
    
    gamePlayerButtons.innerHTML = '';
    
    // Sort players alphabetically
    const sortedPlayers = [...players].sort((a, b) => a.localeCompare(b));
    
    sortedPlayers.forEach(playerName => {
        const btn = document.createElement('button');
        btn.className = 'player-btn';
        btn.textContent = playerName;
        btn.dataset.player = playerName;
        
        if (currentState.selectedPlayer === playerName) {
            btn.classList.add('active');
        }
        
        btn.addEventListener('click', () => selectGamePlayer(playerName));
        gamePlayerButtons.appendChild(btn);
    });
}

// Render Goals & Assists Player Buttons
function renderGoalsAssistsPlayerButtons() {
    if (!goalsAssistsPlayerButtons) return;
    
    goalsAssistsPlayerButtons.innerHTML = '';
    
    if (players.length === 0) {
        goalsAssistsPlayerButtons.innerHTML = '<p style="color: #666; font-size: 0.8em; font-style: italic; text-align: center; width: 100%;">Add players in the Players tab</p>';
        return;
    }
    
    // Sort players alphabetically
    const sortedPlayers = [...players].sort((a, b) => a.localeCompare(b));
    
    sortedPlayers.forEach(playerName => {
        const btn = document.createElement('button');
        btn.className = 'player-btn';
        btn.textContent = playerName;
        btn.dataset.player = playerName;
        
        btn.addEventListener('click', () => selectGoalsAssistsPlayer(playerName));
        goalsAssistsPlayerButtons.appendChild(btn);
    });
}

// Select Goals & Assists Player
function selectGoalsAssistsPlayer(playerName) {
    // Remove active class from all buttons
    goalsAssistsPlayerButtons.querySelectorAll('.player-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to selected button
    const selectedBtn = goalsAssistsPlayerButtons.querySelector(`[data-player="${playerName}"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('active');
    }
    
    // Store the selected player for goals & assists
    currentGoalsAssistsPlayer = playerName;
    
    // If a goal/assist button is active, assign the player to it
    if (activeAssignmentButton) {
        assignGamePlayerToButton(playerName);
    }
}

// Activate Game Assignment Button
function activateGameAssignmentButton(buttonType) {
    // Deactivate all game goal/assist buttons first
    gameGoalBtn.classList.remove('active');
    gameAssist1Btn.classList.remove('active');
    gameAssist2Btn.classList.remove('active');
    
    // Activate the selected button
    if (buttonType === 'goal') {
        gameGoalBtn.classList.add('active');
        activeAssignmentButton = 'goal';
    } else if (buttonType === 'assist1') {
        gameAssist1Btn.classList.add('active');
        activeAssignmentButton = 'assist1';
    } else if (buttonType === 'assist2') {
        gameAssist2Btn.classList.add('active');
        activeAssignmentButton = 'assist2';
    }
    
    // If a player is selected, assign them to the active button
    if (currentGoalsAssistsPlayer && activeAssignmentButton) {
        assignGamePlayerToButton(currentGoalsAssistsPlayer);
    }
}

// Assign Game Player to Button
function assignGamePlayerToButton(playerName) {
    if (!activeAssignmentButton) return;
    
    // Update the button display
    const button = activeAssignmentButton === 'goal' ? gameGoalBtn : 
                   activeAssignmentButton === 'assist1' ? gameAssist1Btn : gameAssist2Btn;
    const playerNameSpan = button.querySelector('.assigned-player');
    
    if (playerNameSpan) {
        playerNameSpan.textContent = playerName;
        button.classList.add('assigned');
    }
    
    // Update current assignments
    currentAssignments[activeAssignmentButton] = playerName;
    
    // Deactivate the button
    button.classList.remove('active');
    activeAssignmentButton = null;
}

// Submit Game Goal
async function submitGameGoal() {
    console.log('submitGameGoal called - currentAssignments:', currentAssignments);
    console.log('submitGameGoal called - currentGame:', currentGame);
    
    if (!currentAssignments.goal) {
        await showAlert('Error', 'Please assign a goal scorer first.');
        return;
    }
    
    const goal = {
        id: ++goalIdCounter,
        goal: currentAssignments.goal,
        assist1: currentAssignments.assist1,
        assist2: currentAssignments.assist2,
        period: currentPeriod,
        timestamp: new Date().toISOString()
    };
    
    console.log('submitGameGoal - adding goal:', goal);
    goals.push(goal);
    console.log('submitGameGoal - goals array after push:', goals);
    
    // Save to current game if in game context, otherwise save to global storage
    if (currentGame) {
        await saveGameStats();
    } else {
        await saveStatsToStorage();
    }
    
    renderGameGoalsList();
    
    // Update player stats if on Players tab
    if (playersView.classList.contains('active')) {
        renderPlayersList();
    }
    
    // Clear assignments after submit
    clearGameAssignments();
}

// Clear Game Assignments
function clearGameAssignments() {
    // Clear assignment displays
    [gameGoalBtn, gameAssist1Btn, gameAssist2Btn].forEach(btn => {
        const playerNameSpan = btn.querySelector('.assigned-player');
        if (playerNameSpan) {
            playerNameSpan.textContent = 'Click to assign';
        }
        btn.classList.remove('assigned', 'active');
    });
    
    // Reset assignments
    currentAssignments = {
        goal: null,
        assist1: null,
        assist2: null
    };
    
    activeAssignmentButton = null;
}

// Render Lineup Player Buttons
function renderLineupPlayerButtons() {
    if (!lineupPlayerButtons) return;
    
    lineupPlayerButtons.innerHTML = '';
    
    if (players.length === 0) {
        lineupPlayerButtons.innerHTML = '<p style="color: #666; font-size: 0.8em; font-style: italic; text-align: center; width: 100%;">Add players in the Players tab</p>';
        return;
    }
    
    // Sort players alphabetically
    const sortedPlayers = [...players].sort((a, b) => a.localeCompare(b));
    
    sortedPlayers.forEach(playerName => {
        const btn = document.createElement('button');
        btn.className = 'player-btn';
        btn.textContent = playerName;
        btn.dataset.player = playerName;
        
        btn.addEventListener('click', () => selectLineupPlayer(playerName));
        lineupPlayerButtons.appendChild(btn);
    });
}

// Select Lineup Player
function selectLineupPlayer(playerName) {
    // Remove active class from all buttons
    lineupPlayerButtons.querySelectorAll('.player-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to selected button
    const selectedBtn = lineupPlayerButtons.querySelector(`[data-player="${playerName}"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('active');
    }
    
    // Store the selected player for lineup
    currentLineupPlayer = playerName;
    
    // If a position button is active, assign the player to it
    if (activePositionButton) {
        assignLineupPlayerToPosition(playerName);
    }
}

// Assign Lineup Player to Position
function assignLineupPlayerToPosition(playerName) {
    if (!activePositionButton) return;
    
    // Update the position button display
    const positionButton = document.getElementById(activePositionButton);
    const playerNameSpan = positionButton.querySelector('.assigned-player');
    
    if (playerNameSpan) {
        playerNameSpan.textContent = playerName;
        positionButton.classList.add('assigned');
    }
    
    // Update current lineup based on button ID
    const positionKey = activePositionButton.replace('game', '').replace('Btn', '');
    // Convert to lowercase camelCase to match currentLineup object keys
    const lineupKey = positionKey.charAt(0).toLowerCase() + positionKey.slice(1);
    currentLineup[lineupKey] = playerName;
    
    console.log('Assigned player to lineup:', lineupKey, playerName);
    console.log('Current lineup:', currentLineup);
    
    // Deactivate the position button
    positionButton.classList.remove('active');
    activePositionButton = null;
}

// Render Faceoffs Player Buttons
function renderFaceoffsPlayerButtons() {
    console.log('renderFaceoffsPlayerButtons called');
    console.log('faceoffsPlayerButtons element:', faceoffsPlayerButtons);
    console.log('players array:', players);
    console.log('players.length:', players.length);
    
    if (!faceoffsPlayerButtons) {
        console.log('faceoffsPlayerButtons element not found');
        return;
    }
    
    faceoffsPlayerButtons.innerHTML = '';
    
    if (players.length === 0) {
        console.log('No players available, showing message');
        faceoffsPlayerButtons.innerHTML = '<p style="color: #666; font-size: 0.8em; font-style: italic; text-align: center; width: 100%;">Add players in the Players tab</p>';
        return;
    }
    
    // Sort players alphabetically
    const sortedPlayers = [...players].sort((a, b) => a.localeCompare(b));
    
    sortedPlayers.forEach(playerName => {
        const btn = document.createElement('button');
        btn.className = 'player-btn';
        btn.textContent = playerName;
        btn.dataset.player = playerName;
        
        btn.addEventListener('click', () => selectFaceoffsPlayer(playerName));
        faceoffsPlayerButtons.appendChild(btn);
    });
}

// Select Faceoffs Player
function selectFaceoffsPlayer(playerName) {
    console.log('selectFaceoffsPlayer called with:', playerName);
    
    // Remove active class from all buttons
    faceoffsPlayerButtons.querySelectorAll('.player-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to selected button
    const selectedBtn = faceoffsPlayerButtons.querySelector(`[data-player="${playerName}"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('active');
    }
    
    // Store the selected player for faceoffs
    currentFaceoffsPlayer = playerName;
    console.log('Selected player for faceoffs:', currentFaceoffsPlayer);
}

// Add Faceoff Player
async function addFaceoffPlayer(playerName) {
    console.log('addFaceoffPlayer called with:', playerName);
    console.log('faceoffStats before:', faceoffStats);
    
    // Check if player already exists in faceoff stats
    const existingPlayer = faceoffStats.find(fs => fs.playerName === playerName);
    if (existingPlayer) {
        console.log('Player already exists in faceoff stats');
        await showAlert('Player Already Added', `${playerName} is already in the faceoff stats.`);
        return;
    }
    
    // Add new faceoff player
    const newFaceoffPlayer = {
        playerName: playerName,
        taken: 0,
        won: 0
    };
    
    faceoffStats.push(newFaceoffPlayer);
    
    // Save to current game if in game context, otherwise save to global storage
    if (currentGame) {
        await saveGameStats();
    } else {
        await saveStatsToStorage();
    }
    
    // Render the appropriate faceoff list based on context
    if (currentGame) {
        renderGameFaceoffPlayersList();
    } else {
        renderFaceoffStats();
    }
    
    // Update player stats if on Players tab
    if (playersView.classList.contains('active')) {
        renderPlayersList();
    }
    
    // Clear the selected player
    currentFaceoffsPlayer = null;
    
    // Remove active class from all player buttons
    faceoffsPlayerButtons.querySelectorAll('.player-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    console.log('addFaceoffPlayer completed, faceoffStats after:', faceoffStats);
}

// Activate Game Position Button
function activateGamePositionButton(buttonId) {
    // Deactivate all position buttons first
    [gameLeftWingBtn, gameCenterBtn, gameRightWingBtn, gameLeftDefenceBtn, gameRightDefenceBtn].forEach(btn => {
        if (btn) btn.classList.remove('active');
    });
    
    // Activate the selected button
    const button = document.getElementById(buttonId);
    if (button) {
        button.classList.add('active');
        activePositionButton = buttonId;
    }
    
    // If a player is selected, assign them to the active button
    if (currentLineupPlayer && activePositionButton) {
        assignLineupPlayerToPosition(currentLineupPlayer);
    }
}

// Submit Game Plus/Minus
async function submitGamePlusMinus(type) {
    console.log('submitGamePlusMinus - currentLineup:', currentLineup);
    console.log('submitGamePlusMinus - leftWing:', currentLineup.leftWing);
    console.log('submitGamePlusMinus - center:', currentLineup.center);
    console.log('submitGamePlusMinus - rightWing:', currentLineup.rightWing);
    console.log('submitGamePlusMinus - leftDefence:', currentLineup.leftDefence);
    console.log('submitGamePlusMinus - rightDefence:', currentLineup.rightDefence);
    
    if (!currentLineup.leftWing && !currentLineup.center && !currentLineup.rightWing && 
        !currentLineup.leftDefence && !currentLineup.rightDefence) {
        console.log('No players assigned to lineup, showing error');
        await showAlert('Error', 'Please assign players to the lineup first.');
        return;
    }
    
    const event = {
        id: ++plusMinusIdCounter,
        type: type,
        lineup: { ...currentLineup },
        period: currentPeriod,
        timestamp: new Date().toISOString()
    };
    
    console.log('submitGamePlusMinus - adding event:', event);
    plusMinusEvents.push(event);
    console.log('submitGamePlusMinus - plusMinusEvents array after push:', plusMinusEvents);
    
    // Save to current game if in game context, otherwise save to global storage
    if (currentGame) {
        console.log('submitGamePlusMinus - calling saveGameStats');
        await saveGameStats();
    } else {
        console.log('submitGamePlusMinus - calling saveStatsToStorage');
        await saveStatsToStorage();
    }
    
    renderGamePlusMinusList();
    
    // Update player stats if on Players tab
    if (playersView.classList.contains('active')) {
        renderPlayersList();
    }
}

// Delete Game Goal
async function deleteGameGoal(goalId) {
    const confirmed = await showConfirm('Confirm Delete', 'Delete this goal?');
    if (confirmed) {
        goals = goals.filter(g => g.id !== goalId);
        
        // Save to current game if in game context, otherwise save to global storage
        if (currentGame) {
            await saveGameStats();
        } else {
            await saveStatsToStorage();
        }
        
        renderGameGoalsList();
        
        // Update player stats if on Players tab
        if (playersView.classList.contains('active')) {
            renderPlayersList();
        }
    }
}

// Delete Game Plus/Minus Event
async function deleteGamePlusMinus(eventId) {
    const confirmed = await showConfirm('Confirm Delete', 'Delete this +/- event?');
    if (confirmed) {
        plusMinusEvents = plusMinusEvents.filter(e => e.id !== eventId);
        
        // Save to current game if in game context, otherwise save to global storage
        if (currentGame) {
            await saveGameStats();
        } else {
            await saveStatsToStorage();
        }
        
        renderGamePlusMinusList();
        
        // Update player stats if on Players tab
        if (playersView.classList.contains('active')) {
            renderPlayersList();
        }
    }
}

// Clear Game Lineup
function clearGameLineup() {
    // Clear lineup assignments
    currentLineup = {
        leftWing: null,
        center: null,
        rightWing: null,
        leftDefence: null,
        rightDefence: null
    };
    
    // Clear position button displays
    [gameLeftWingBtn, gameCenterBtn, gameRightWingBtn, gameLeftDefenceBtn, gameRightDefenceBtn].forEach(btn => {
        if (btn) {
            const playerNameSpan = btn.querySelector('.assigned-player');
            if (playerNameSpan) {
                playerNameSpan.textContent = 'Click to assign';
            }
            btn.classList.remove('assigned', 'active');
        }
    });
    
    activePositionButton = null;
}

// Select Game Player
function selectGamePlayer(playerName) {
    currentState.selectedPlayer = playerName;
    currentState.team = 'player';
    renderGamePlayerButtons();
    updateGameUI();
}

// Select Game Period
function selectGamePeriod(period) {
    console.log('selectGamePeriod - switching to period:', period);
    currentPeriod = period;
    updateGamePeriodButtons();
    
    // Set direction based on hockey rules: periods 1&3 same, period 2 opposite
    if (period === 1 || period === '1' || period === 3 || period === '3') {
        // Periods 1 and 3 should have the same direction
        if (period === 1 || period === '1') {
            // If switching to period 1, use period 3's direction if it exists, otherwise keep current
            attackDirection = gamePeriodDirections['3'] || attackDirection;
        } else {
            // If switching to period 3, use period 1's direction if it exists, otherwise keep current
            attackDirection = gamePeriodDirections['1'] || attackDirection;
        }
    } else if (period === 2 || period === '2') {
        // Period 2 should be opposite of periods 1&3
        const baseDirection = gamePeriodDirections['1'] || gamePeriodDirections['3'] || attackDirection;
        attackDirection = baseDirection === 'left' ? 'right' : 'left';
    } else if (period === 'all') {
        // For "All" period, use the stored direction if it exists, otherwise keep current
        attackDirection = gamePeriodDirections['all'] || attackDirection;
    }
    
    // Store the direction for this period (use string keys for consistency)
    const periodKey = period.toString();
    gamePeriodDirections[periodKey] = attackDirection;
    
    updateGameDirectionButton();
    drawGameRink();
    updateGameCounters();
}

// Update canvas event listeners based on current state
function updateCanvasEventListeners() {
    console.log('updateCanvasEventListeners called');
    console.log('updateCanvasEventListeners - currentGame:', currentGame);
    console.log('updateCanvasEventListeners - gameRinkCanvas:', gameRinkCanvas);
    
    // Canvas - only attach old rink handlers if not in game view
    if (canvas) {
        // Remove any existing listeners first
        canvas.removeEventListener('click', handleCanvasClick);
        canvas.removeEventListener('mousemove', handleCanvasMouseMove);
        canvas.removeEventListener('mouseleave', hideShotTooltip);
        
        // Only add old rink listeners if we're not in a game
        console.log('updateCanvasEventListeners - currentGame:', currentGame);
        console.log('updateCanvasEventListeners - canvas:', canvas);
        if (!currentGame) {
            console.log('Adding canvas click listener');
            canvas.addEventListener('click', handleCanvasClick);
            canvas.addEventListener('mousemove', handleCanvasMouseMove);
            canvas.addEventListener('mouseleave', hideShotTooltip);
        } else {
            console.log('Not adding canvas click listener - in game mode');
        }
    }
    
    // Game Rink Canvas - only attach game handlers if in game view
    if (gameRinkCanvas) {
        console.log('Setting up game rink canvas listeners');
        // Remove any existing listeners first
        gameRinkCanvas.removeEventListener('click', handleGameCanvasClick);
        gameRinkCanvas.removeEventListener('mousemove', handleGameCanvasMouseMove);
        gameRinkCanvas.removeEventListener('mouseleave', hideShotTooltip);
        
        // Only add game rink listeners if we're in a game
        if (currentGame) {
            console.log('Adding game rink canvas listeners for game:', currentGame.name);
            gameRinkCanvas.addEventListener('click', handleGameCanvasClick);
            gameRinkCanvas.addEventListener('mousemove', handleGameCanvasMouseMove);
            gameRinkCanvas.addEventListener('mouseleave', hideShotTooltip);
        } else {
            console.log('Not adding game rink listeners - no current game');
        }
    }
}

// Update Game Period Buttons
function updateGamePeriodButtons() {
    if (gamePeriod1Btn) {
        gamePeriod1Btn.classList.toggle('active', currentPeriod === 1);
    }
    if (gamePeriod2Btn) {
        gamePeriod2Btn.classList.toggle('active', currentPeriod === 2);
    }
    if (gamePeriod3Btn) {
        gamePeriod3Btn.classList.toggle('active', currentPeriod === 3);
    }
    if (gamePeriodAllBtn) {
        gamePeriodAllBtn.classList.toggle('active', currentPeriod === 'all');
    }
}

// Toggle Game Direction
function toggleGameDirection() {
    attackDirection = attackDirection === 'left' ? 'right' : 'left';
    
    // Store the new direction for the current period
    const periodKey = currentPeriod.toString();
    gamePeriodDirections[periodKey] = attackDirection;
    
    // Sync other periods based on hockey rules
    if (currentPeriod === 1 || currentPeriod === '1' || currentPeriod === 3 || currentPeriod === '3') {
        // If changing period 1 or 3, update the other (1&3 should be same)
        const otherPeriod = (currentPeriod === 1 || currentPeriod === '1') ? '3' : '1';
        gamePeriodDirections[otherPeriod] = attackDirection;
        
        // Period 2 should be opposite
        gamePeriodDirections['2'] = attackDirection === 'left' ? 'right' : 'left';
    } else if (currentPeriod === 2 || currentPeriod === '2') {
        // If changing period 2, periods 1&3 should be opposite
        const oppositeDirection = attackDirection === 'left' ? 'right' : 'left';
        gamePeriodDirections['1'] = oppositeDirection;
        gamePeriodDirections['3'] = oppositeDirection;
    }
    // For 'all' period, we don't sync other periods
    
    updateGameDirectionButton();
    drawGameRink();
}

// Reset Game Shots
async function resetGameShots() {
    if (!currentGame) return;
    
    // Filter shots based on current period
    if (currentPeriod === 'all') {
        // Reset all shots for the entire game
        shots = [];
    } else {
        // Reset shots only for the selected period
        shots = shots.filter(shot => shot.period !== currentPeriod);
    }
    
    // Update the game stats
    if (currentGame.stats.rink) {
        currentGame.stats.rink.shots = shots;
    }
    
    // Redraw the rink and update counters
    drawGameRink();
    updateGameCounters();
    await saveGameStats();
}

// Undo Last Game Shot
async function undoGameShot() {
    if (!currentGame || shots.length === 0) return;
    
    console.log('undoGameShot - removing last shot:', shots[shots.length - 1]);
    
    // Remove the last shot
    const removedShot = shots.pop();
    
    // Update the shot ID counter to prevent ID conflicts
    if (shots.length > 0) {
        shotIdCounter = Math.max(...shots.map(s => s.id), 0);
    } else {
        shotIdCounter = 0;
    }
    
    // Update the game stats
    if (currentGame.stats.rink) {
        currentGame.stats.rink.shots = shots;
    }
    
    // Redraw the rink and update counters
    drawGameRink();
    updateGameCounters();
    
    // Update player stats if on Players tab
    if (playersView && playersView.classList.contains('active')) {
        renderPlayersList();
    }
    
    // Save changes to ensure they persist
    await saveGameStats();
    
    console.log('undoGameShot - shot removed, remaining shots:', shots.length);
}

// Update Game Direction Button
function updateGameDirectionButton() {
    if (!gameToggleDirectionBtn) return;
    
    const arrow = gameToggleDirectionBtn.querySelector('.direction-arrow');
    const text = gameToggleDirectionBtn.querySelector('.direction-text');
    
    if (attackDirection === 'left') {
        if (arrow) arrow.textContent = '←';
        if (text) text.textContent = 'Attacking Left';
    } else {
        if (arrow) arrow.textContent = '→';
        if (text) text.textContent = 'Attacking Right';
    }
}

// Undo last shot
async function undoLastShot() {
    if (shots.length === 0) {
        await showAlert('Error', 'No shots to undo!');
        return;
    }
    
    shots.pop();
    drawRink();
    updateCounters();
    await saveShotsToStorage();
    // Refresh player list if on Players tab
    if (playersView.classList.contains('active')) {
        renderPlayersList();
    }
}

// Reset all shots
async function resetShots() {
    if (shots.length === 0) {
        await showAlert('Error', 'No shots to reset!');
        return;
    }
    
    const confirmed = await showConfirm('Confirm Reset', 'Are you sure you want to clear all shots?');
    if (confirmed) {
        shots = [];
        shotIdCounter = 0;
        drawRink();
        updateCounters();
        await saveShotsToStorage();
        // Refresh player list if on Players tab
        if (playersView.classList.contains('active')) {
            renderPlayersList();
        }
    }
}

// Export data to JSON
async function exportData() {
    if (shots.length === 0) {
        await showAlert('Error', 'No shots to export!');
        return;
    }
    
    gameName = gameNameInput.value.trim();
    
    const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        gameName: gameName || 'Unnamed Game',
        attackDirection: attackDirection,
        currentPeriod: currentPeriod,
        totalShots: shots.length,
        shots: shots
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    
    // Create filename with game name if available
    let filename = 'hockey-tracker-shots';
    if (gameName) {
        // Sanitize game name for filename (remove special characters)
        const sanitizedName = gameName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
        filename = `hockey-tracker-shots-${sanitizedName}`;
    }
    filename += `-${Date.now()}.json`;
    
    link.download = filename;
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
    reader.onload = async function(e) {
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
                
                // Add period field if missing (backward compatibility)
                if (!shot.hasOwnProperty('period')) {
                    shot.period = 1; // Default to period 1 for old data
                }
                
                // Normalize old 'for' teamState to 'player' if there's no playerName
                if (shot.teamState === 'for' && !shot.playerName) {
                    // Keep as 'for' for backward compatibility
                    shot.teamState = 'for';
                }
            }
            
            // Import successful - add to existing shots instead of replacing
            const importedCount = data.shots.length;
            
            // If imported data has different attack direction, mirror the imported shots
            const importedDirection = data.attackDirection || 'left';
            const needsMirroring = importedDirection !== attackDirection;
            
            if (needsMirroring) {
                data.shots.forEach(shot => {
                    shot.x = canvas.width - shot.x;
                });
            }
            
            shots = [...shots, ...data.shots];
            shotIdCounter = Math.max(...shots.map(s => s.id), 0) + 1;
            
            // If game name is in imported data and current game name is empty, use imported name
            if (data.gameName && !gameNameInput.value.trim()) {
                gameName = data.gameName;
                gameNameInput.value = gameName;
            }
            
            drawRink();
            updateCounters();
            await saveShotsToStorage();
            // Refresh player list if on Players tab
            if (playersView.classList.contains('active')) {
                renderPlayersList();
            }
            
            let message = `Successfully imported ${importedCount} shots! Total shots: ${shots.length}`;
            if (data.gameName) {
                message += `\n\nGame: ${data.gameName}`;
            }
            if (needsMirroring) {
                message += `\n\nNote: Shots were mirrored to match current attack direction.`;
            }
            await showAlert('Success', message);
            
        } catch (error) {
            await showAlert('Import Failed', `${error.message}\n\nPlease select a valid Hockey Shot Tracker JSON file.`);
        }
    };
    
    reader.readAsText(file);
    
    // Reset file input
    fileInput.value = '';
}

// Attach event listeners
function attachEventListeners() {
    // Main navigation
    playersBtn.addEventListener('click', () => switchTab('players'));
    gamesBtn.addEventListener('click', () => switchTab('games'));
    
    // Game management event listeners
    if (addGameBtn) {
        addGameBtn.addEventListener('click', () => {
            addGameForm.classList.remove('hidden');
        });
    }
    
    if (deleteGameBtn) {
        deleteGameBtn.addEventListener('click', deleteGame);
    }
    
    if (saveGameBtn) {
        saveGameBtn.addEventListener('click', addGame);
    }
    
    if (cancelGameBtn) {
        cancelGameBtn.addEventListener('click', () => {
            addGameForm.classList.add('hidden');
            newGameName.value = '';
            newGameDate.value = '';
        });
    }
    
    if (gameDropdown) {
        gameDropdown.addEventListener('change', (e) => {
            selectGame(e.target.value);
        });
    }
    
    // Game stat type switching
    if (goalsAssistsStatBtn) {
        goalsAssistsStatBtn.addEventListener('click', () => switchGameStatType('goalsAssists'));
    }
    if (lineupStatBtn) {
        lineupStatBtn.addEventListener('click', () => switchGameStatType('lineup'));
    }
    if (faceoffsStatBtn) {
        faceoffsStatBtn.addEventListener('click', () => switchGameStatType('faceoffs'));
    }
    if (rinkStatBtn) {
        rinkStatBtn.addEventListener('click', () => switchGameStatType('rink'));
    }
    
    // Stats sub-tab switching removed - now handled in games view
    
    // Game Goals & Assists buttons
    if (gameGoalBtn) {
        gameGoalBtn.addEventListener('click', () => activateGameAssignmentButton('goal'));
    }
    if (gameAssist1Btn) {
        gameAssist1Btn.addEventListener('click', () => activateGameAssignmentButton('assist1'));
    }
    if (gameAssist2Btn) {
        gameAssist2Btn.addEventListener('click', () => activateGameAssignmentButton('assist2'));
    }
    if (gameSubmitGoalBtn) {
        gameSubmitGoalBtn.addEventListener('click', submitGameGoal);
    }
    if (gameClearAssignmentsBtn) {
        gameClearAssignmentsBtn.addEventListener('click', clearGameAssignments);
    }
    
    // Game Lineup +/- buttons
    if (gameLeftWingBtn) {
        gameLeftWingBtn.addEventListener('click', () => activateGamePositionButton('gameLeftWingBtn'));
    }
    if (gameCenterBtn) {
        gameCenterBtn.addEventListener('click', () => activateGamePositionButton('gameCenterBtn'));
    }
    if (gameRightWingBtn) {
        gameRightWingBtn.addEventListener('click', () => activateGamePositionButton('gameRightWingBtn'));
    }
    if (gameLeftDefenceBtn) {
        gameLeftDefenceBtn.addEventListener('click', () => activateGamePositionButton('gameLeftDefenceBtn'));
    }
    if (gameRightDefenceBtn) {
        gameRightDefenceBtn.addEventListener('click', () => activateGamePositionButton('gameRightDefenceBtn'));
    }
    if (gamePlusBtn) {
        gamePlusBtn.addEventListener('click', () => submitGamePlusMinus('plus'));
    }
    if (gameMinusBtn) {
        gameMinusBtn.addEventListener('click', () => submitGamePlusMinus('minus'));
    }
    if (gameClearLineupBtn) {
        gameClearLineupBtn.addEventListener('click', clearGameLineup);
    }
    
    // Update canvas event listeners based on current state
    updateCanvasEventListeners();
    
    // Game Rink Controls
    if (gameScoreBtn) {
        gameScoreBtn.addEventListener('click', () => toggleGameResult('score'));
    }
    if (gameMissBtn) {
        gameMissBtn.addEventListener('click', () => toggleGameResult('miss'));
    }
    if (gameAgainstBtn) {
        gameAgainstBtn.addEventListener('click', toggleGameAgainst);
    }
    
    // Game Period Buttons
    if (gamePeriod1Btn) {
        gamePeriod1Btn.addEventListener('click', () => selectGamePeriod(1));
    }
    if (gamePeriod2Btn) {
        gamePeriod2Btn.addEventListener('click', () => selectGamePeriod(2));
    }
    if (gamePeriod3Btn) {
        gamePeriod3Btn.addEventListener('click', () => selectGamePeriod(3));
    }
    if (gamePeriodAllBtn) {
        gamePeriodAllBtn.addEventListener('click', () => selectGamePeriod('all'));
    }
    
    // Game Direction Button
    if (gameToggleDirectionBtn) {
        gameToggleDirectionBtn.addEventListener('click', toggleGameDirection);
    }
    
    // Game Action Buttons
    if (gameUndoBtn) {
        gameUndoBtn.addEventListener('click', undoGameShot);
    }
    if (gameResetBtn) {
        gameResetBtn.addEventListener('click', resetGameShots);
    }
    if (gameExportBtn) {
        gameExportBtn.addEventListener('click', exportGameData);
    }
    if (gameImportBtn) {
        gameImportBtn.addEventListener('click', importGameData);
    }
    
    // Result toggles (old rink view)
    if (scoreBtn) {
        scoreBtn.addEventListener('click', () => toggleResult('score'));
    }
    if (missBtn) {
        missBtn.addEventListener('click', () => toggleResult('miss'));
    }
    
    // Team toggle (old rink view)
    if (againstBtn) {
        againstBtn.addEventListener('click', toggleAgainst);
    }
    
    // Action buttons (old rink view)
    if (undoBtn) {
        undoBtn.addEventListener('click', undoLastShot);
    }
    if (resetBtn) {
        resetBtn.addEventListener('click', resetShots);
    }
    if (exportBtn) {
        exportBtn.addEventListener('click', exportData);
    }
    if (importBtn) {
        importBtn.addEventListener('click', importData);
    }
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
    
    // Game name auto-save (old rink view)
    if (gameNameInput) {
        gameNameInput.addEventListener('change', async () => await saveShotsToStorage());
        gameNameInput.addEventListener('blur', async () => await saveShotsToStorage());
    }
    
    // Attack direction toggle (old rink view)
    if (toggleDirectionBtn) {
        toggleDirectionBtn.addEventListener('click', async () => await toggleAttackDirection());
    }
    
    // Period selection
    // Period buttons (old rink view)
    if (period1Btn) {
        period1Btn.addEventListener('click', async () => await selectPeriod(1));
    }
    if (period2Btn) {
        period2Btn.addEventListener('click', async () => await selectPeriod(2));
    }
    if (period3Btn) {
        period3Btn.addEventListener('click', async () => await selectPeriod(3));
    }
    if (periodAllBtn) {
        periodAllBtn.addEventListener('click', async () => await selectPeriod('all'));
    }
    
    // Stats tab (old stats view)
    if (statsGameNameInput) {
        statsGameNameInput.addEventListener('change', async () => await saveStatsToStorage());
        statsGameNameInput.addEventListener('blur', async () => await saveStatsToStorage());
    }
    if (goalBtn) {
        goalBtn.addEventListener('click', () => activateAssignmentButton('goal'));
    }
    if (assist1Btn) {
        assist1Btn.addEventListener('click', () => activateAssignmentButton('assist1'));
    }
    if (assist2Btn) {
        assist2Btn.addEventListener('click', () => activateAssignmentButton('assist2'));
    }
    if (submitGoalBtn) {
        submitGoalBtn.addEventListener('click', submitGoal);
    }
    if (clearAssignmentsBtn) {
        clearAssignmentsBtn.addEventListener('click', clearAssignments);
    }
    if (exportStatsBtn) {
        exportStatsBtn.addEventListener('click', exportStats);
    }
    if (importStatsBtn) {
        importStatsBtn.addEventListener('click', importStats);
    }
    if (statsFileInput) {
        statsFileInput.addEventListener('change', handleStatsFileSelect);
    }
    
    // Lineup +/- buttons (old stats view)
    if (leftWingBtn) {
        leftWingBtn.addEventListener('click', () => activatePositionButton('leftWing'));
    }
    if (centerBtn) {
        centerBtn.addEventListener('click', () => activatePositionButton('center'));
    }
    if (rightWingBtn) {
        rightWingBtn.addEventListener('click', () => activatePositionButton('rightWing'));
    }
    if (leftDefenceBtn) {
        leftDefenceBtn.addEventListener('click', () => activatePositionButton('leftDefence'));
    }
    if (rightDefenceBtn) {
        rightDefenceBtn.addEventListener('click', () => activatePositionButton('rightDefence'));
    }
    if (plusBtn) {
        plusBtn.addEventListener('click', () => recordPlusMinus('plus'));
    }
    if (minusBtn) {
        minusBtn.addEventListener('click', () => recordPlusMinus('minus'));
    }
    if (clearLineupBtn) {
        clearLineupBtn.addEventListener('click', clearLineup);
    }
    
}

// Setup Authentication Event Listeners
function setupAuthentication() {
    // Authentication event listeners
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const profileBtn = document.getElementById('profileBtn');
    
    // Modal close buttons
    const loginCloseBtn = document.getElementById('loginCloseBtn');
    const registerCloseBtn = document.getElementById('registerCloseBtn');
    const profileCloseBtn = document.getElementById('profileCloseBtn');
    
    // Modal switch buttons
    const switchToRegister = document.getElementById('switchToRegister');
    const switchToLogin = document.getElementById('switchToLogin');
    
    // Forms
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const profileForm = document.getElementById('profileForm');
    const passwordForm = document.getElementById('passwordForm');
    
    // Profile tabs
    const profileTabBtns = document.querySelectorAll('.profile-tab-btn');
    
    // Delete account button
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    
    // Team management elements
    const manageTeamsBtn = document.getElementById('manageTeamsBtn');
    const teamManagementCloseBtn = document.getElementById('teamManagementCloseBtn');
    const createTeamForm = document.getElementById('createTeamForm');
    
    // Profile team management elements
    const addTeamBtn = document.getElementById('addTeamBtn');
    const addTeamForm = document.getElementById('addTeamForm');
    const saveTeamBtn = document.getElementById('saveTeamBtn');
    const cancelTeamBtn = document.getElementById('cancelTeamBtn');
    const newTeamNameInput = document.getElementById('newTeamName');
    const createTeamNameInput = document.getElementById('createTeamName');
    
    // Team switching elements
    const switchTeamBtn = document.getElementById('switchTeamBtn');
    const teamSwitchCloseBtn = document.getElementById('teamSwitchCloseBtn');
    
    // Team edit/delete modal elements
    const teamEditCloseBtn = document.getElementById('teamEditCloseBtn');
    const teamEditForm = document.getElementById('teamEditForm');
    const teamDeleteCloseBtn = document.getElementById('teamDeleteCloseBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    
    
    // Welcome screen buttons
    const welcomeLoginBtn = document.getElementById('welcomeLoginBtn');
    const welcomeRegisterBtn = document.getElementById('welcomeRegisterBtn');
    
    // Check if elements exist before adding listeners
    if (loginBtn) {
        console.log('Hockey Tracker: Adding login button listener');
        loginBtn.addEventListener('click', () => {
            console.log('Hockey Tracker: Login button clicked');
            showAuthModal('loginModal');
        });
    } else {
        console.error('Hockey Tracker: Login button not found');
    }
    if (registerBtn) {
        console.log('Hockey Tracker: Adding register button listener');
        registerBtn.addEventListener('click', () => {
            console.log('Hockey Tracker: Register button clicked');
            showAuthModal('registerModal');
        });
    } else {
        console.error('Hockey Tracker: Register button not found');
    }
    if (welcomeLoginBtn) {
        welcomeLoginBtn.addEventListener('click', () => showAuthModal('loginModal'));
    }
    if (welcomeRegisterBtn) {
        welcomeRegisterBtn.addEventListener('click', () => showAuthModal('registerModal'));
    }
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logoutUser);
    }
    if (profileBtn) {
        profileBtn.addEventListener('click', async () => {
            try {
                const profile = await getUserProfile();
                document.getElementById('profileUsername').value = profile.username;
                document.getElementById('profileEmail').value = profile.email;
                document.getElementById('profileFullName').value = profile.fullName || '';
                document.getElementById('profileTeamName').value = profile.teamName || '';
                
                // Load teams and render team management
                await loadTeams();
                renderTeamsList();
                
        // Show the modal after loading data
        showAuthModal('profileModal');
        
        // Debug: Log the teams after loading
        console.log('Teams loaded for profile:', userTeams);
            } catch (error) {
                console.error('Failed to load profile:', error);
                // Still show modal even if loading fails
                showAuthModal('profileModal');
            }
        });
    }
    
    // Modal close event listeners
    if (loginCloseBtn) {
        loginCloseBtn.addEventListener('click', () => hideAuthModal('loginModal'));
    }
    if (registerCloseBtn) {
        registerCloseBtn.addEventListener('click', () => hideAuthModal('registerModal'));
    }
    if (profileCloseBtn) {
        profileCloseBtn.addEventListener('click', () => hideAuthModal('profileModal'));
    }
    
    // Modal switch event listeners
    if (switchToRegister) {
        switchToRegister.addEventListener('click', () => {
            hideAuthModal('loginModal');
            showAuthModal('registerModal');
        });
    }
    if (switchToLogin) {
        switchToLogin.addEventListener('click', () => {
            hideAuthModal('registerModal');
            showAuthModal('loginModal');
        });
    }
    
    // Form submission event listeners
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(loginForm);
            const username = formData.get('username');
            const password = formData.get('password');
            
        try {
            hideError('loginModal');
            await loginUser(username, password);
            hideAuthModal('loginModal');
        } catch (error) {
            showError('loginModal', error.message);
        }
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(registerForm);
            const userData = {
                username: formData.get('username'),
                email: formData.get('email'),
                password: formData.get('password'),
                fullName: formData.get('fullName'),
                teamName: 'My Team' // Default team name that users can change later
            };
            
        try {
            hideError('registerModal');
            await registerUser(userData);
            hideAuthModal('registerModal');
        } catch (error) {
            showError('registerModal', error.message);
        }
        });
    }
    
    if (profileForm) {
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(profileForm);
            const profileData = {
                email: formData.get('email'),
                fullName: formData.get('fullName'),
                teamName: formData.get('teamName')
            };
            
        try {
            hideError('profileModal');
            hideSuccess('profileModal');
            await updateUserProfile(profileData);
            showSuccess('profileModal', 'Profile updated successfully!');
        } catch (error) {
            showError('profileModal', error.message);
        }
        });
    }
    
    if (passwordForm) {
        passwordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(passwordForm);
            const currentPassword = formData.get('currentPassword');
            const newPassword = formData.get('newPassword');
            const confirmPassword = formData.get('confirmPassword');
            
            if (newPassword !== confirmPassword) {
                showError('profileModal', 'New passwords do not match');
                return;
            }
            
        try {
            hideError('profileModal');
            hideSuccess('profileModal');
            await changePassword(currentPassword, newPassword);
            showSuccess('profileModal', 'Password changed successfully!');
            passwordForm.reset();
        } catch (error) {
            showError('profileModal', error.message);
        }
        });
    }
    
    // Profile tab switching
    profileTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            switchProfileTab(tabName);
        });
    });
    
    // Delete account button
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', async () => {
            const confirmed = await showConfirm('Delete Account', 'Are you sure you want to permanently delete your account? This action cannot be undone.');
            if (confirmed) {
                const password = prompt('Please enter your password to confirm account deletion:');
                if (password) {
                    try {
                        await deleteUserAccount(password);
                    } catch (error) {
                        await showAlert('Error', error.message);
                    }
                }
            }
        });
    }
    
    
    // Profile team management event listeners
    if (addTeamBtn) {
        addTeamBtn.addEventListener('click', () => {
            addTeamForm.classList.remove('hidden');
            newTeamNameInput.focus();
        });
    }
    
    // Add event listeners to radio buttons to change placeholder text
    const teamTypeRadios = document.querySelectorAll('input[name="teamType"]');
    teamTypeRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (newTeamNameInput) {
                if (radio.value === 'join') {
                    newTeamNameInput.placeholder = 'Enter 5-character team code...';
                } else {
                    newTeamNameInput.placeholder = 'Enter team name...';
                }
            }
        });
    });
    
    if (cancelTeamBtn) {
        cancelTeamBtn.addEventListener('click', () => {
            addTeamForm.classList.add('hidden');
            newTeamNameInput.value = '';
        });
    }
    
    if (saveTeamBtn) {
        saveTeamBtn.addEventListener('click', async () => {
            const teamName = newTeamNameInput.value.trim();
            if (!teamName) {
                alert('Please enter a team name');
                return;
            }
            
            // Check if it's create or join
            const teamTypeRadios = document.querySelectorAll('input[name="teamType"]');
            const checkedRadio = Array.from(teamTypeRadios).find(radio => radio.checked);
            const actionType = checkedRadio?.value;
            
            if (actionType === 'join') {
                // Handle joining an existing team
                const teamCode = teamName.trim().toUpperCase();
                if (!teamCode || teamCode.length !== 5) {
                    alert('Please enter a valid 5-character team code');
                    return;
                }
                
                try {
                    await joinTeam(teamCode);
                    addTeamForm.classList.add('hidden');
                    newTeamNameInput.value = '';
                    // Reset radio buttons
                    document.querySelector('input[name="teamType"][value="create"]').checked = true;
                } catch (error) {
                    // Error is already handled in joinTeam function
                }
                return;
            }
            
            // Handle creating a new team (always shared with 5-character code)
            const isShared = true;
            
            try {
                const createdTeam = await createTeam(teamName, isShared);
                addTeamForm.classList.add('hidden');
                newTeamNameInput.value = '';
                // Reset radio buttons
                document.querySelector('input[name="teamType"][value="create"]').checked = true;
                
                // Show success message with team code
                const successMessage = createdTeam.teamString ? 
                    `Team created successfully! Code: ${createdTeam.teamString}` : 
                    'Team created successfully!';
                showSuccess('profileModal', successMessage);
            } catch (error) {
                showError('profileModal', error.message);
            }
        });
    }
    
    // Allow Enter key to save team
    if (newTeamNameInput) {
        newTeamNameInput.addEventListener('keypress', async (e) => {
            if (e.key === 'Enter') {
                const teamName = newTeamNameInput.value.trim();
                if (!teamName) {
                    alert('Please enter a team name');
                    return;
                }
                
                // Check if it's create or join
                const teamTypeRadios = document.querySelectorAll('input[name="teamType"]');
                const checkedRadio = Array.from(teamTypeRadios).find(radio => radio.checked);
                const actionType = checkedRadio?.value;
                
                if (actionType === 'join') {
                    // Handle joining an existing team
                    const teamCode = teamName.trim().toUpperCase();
                    if (!teamCode || teamCode.length !== 5) {
                        alert('Please enter a valid 5-character team code');
                        return;
                    }
                    
                    try {
                        await joinTeam(teamCode);
                        addTeamForm.classList.add('hidden');
                        newTeamNameInput.value = '';
                        // Reset radio buttons
                        document.querySelector('input[name="teamType"][value="create"]').checked = true;
                    } catch (error) {
                        // Error is already handled in joinTeam function
                    }
                    return;
                }
                
                // Handle creating a new team (always shared with 5-character code)
                try {
                    const createdTeam = await createTeam(teamName, true);
                    addTeamForm.classList.add('hidden');
                    newTeamNameInput.value = '';
                    // Reset radio buttons
                    document.querySelector('input[name="teamType"][value="create"]').checked = true;
                    
                    // Show success message with team code
                    const successMessage = createdTeam.teamString ? 
                        `Team created successfully! Code: ${createdTeam.teamString}` : 
                        'Team created successfully!';
                    showSuccess('profileModal', successMessage);
                } catch (error) {
                    showError('profileModal', error.message);
                }
            }
        });
    }
    
    
    // Allow Enter key to save team in team management modal
    if (createTeamNameInput) {
        createTeamNameInput.addEventListener('keypress', async (e) => {
            if (e.key === 'Enter') {
                const teamName = createTeamNameInput.value.trim();
                if (!teamName) {
                    alert('Please enter a team name');
                    return;
                }
                
                try {
                    await createTeam(teamName);
                    createTeamNameInput.value = '';
                    showSuccess('teamManagement', 'Team created successfully!');
                    renderTeamsList();
                } catch (error) {
                    showError('teamManagement', error.message);
                }
            }
        });
    }
    
    // Team switching event listeners
    if (switchTeamBtn) {
        switchTeamBtn.addEventListener('click', () => {
            console.log('Switch team button clicked');
            console.log('Current user before opening modal:', currentUser);
            console.log('Current user teamId before opening modal:', currentUser?.teamId);
            showAuthModal('teamSwitchModal');
            renderTeamSwitchList();
        });
    }
    
    if (teamSwitchCloseBtn) {
        teamSwitchCloseBtn.addEventListener('click', () => hideAuthModal('teamSwitchModal'));
    }
    
    // Team edit modal event listeners
    if (teamEditCloseBtn) {
        teamEditCloseBtn.addEventListener('click', () => hideAuthModal('teamEditModal'));
    }
    
    if (teamEditForm) {
        teamEditForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(teamEditForm);
            const newName = formData.get('teamName').trim();
            
            if (!newName) {
                showError('teamEditModal', 'Team name is required');
                return;
            }
            
            try {
                hideError('teamEditModal');
                hideSuccess('teamEditModal');
                await updateTeam(currentEditingTeamId, newName);
                
                // Refresh team data from server
                await loadTeams();
                
                // Refresh all team lists
                renderProfileTeamsList();
                renderTeamSwitchList();
                renderTeamsList();
                
                // Update header display
                updateCurrentTeamDisplay();
                
                showSuccess('teamEditModal', 'Team updated successfully!');
                
                // Close modal after a short delay
                setTimeout(() => {
                    hideAuthModal('teamEditModal');
                }, 1000);
            } catch (error) {
                showError('teamEditModal', error.message);
            }
        });
    }
    
    // Team delete modal event listeners
    if (teamDeleteCloseBtn) {
        teamDeleteCloseBtn.addEventListener('click', () => hideAuthModal('teamDeleteModal'));
    }
    
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', () => hideAuthModal('teamDeleteModal'));
    }
    
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', async () => {
            try {
                hideError('teamDeleteModal');
                await deleteTeam(currentDeletingTeamId);
                
                // Refresh team data from server
                await loadTeams();
                
                // Refresh all team lists
                renderProfileTeamsList();
                renderTeamSwitchList();
                renderTeamsList();
                
                // Update header display
                updateCurrentTeamDisplay();
                
                showSuccessMessage('Team deleted successfully!');
                
                // Close modal
                hideAuthModal('teamDeleteModal');
            } catch (error) {
                showError('teamDeleteModal', error.message);
            }
        });
    }
    
    // Team management event listeners
    if (manageTeamsBtn) {
        manageTeamsBtn.addEventListener('click', () => {
            showAuthModal('teamManagementModal');
            renderTeamsList();
        });
    }
    
    if (teamManagementCloseBtn) {
        teamManagementCloseBtn.addEventListener('click', () => hideAuthModal('teamManagementModal'));
    }
    
    if (createTeamForm) {
        createTeamForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(createTeamForm);
            const teamName = formData.get('teamName');
            
            // Check if it's create or join in the team management modal
            const teamTypeRadios = createTeamForm.querySelectorAll('input[name="teamType"]');
            const checkedRadio = Array.from(teamTypeRadios).find(radio => radio.checked);
            const actionType = checkedRadio?.value;
            
            if (actionType === 'join') {
                // Handle joining an existing team
                const teamCode = teamName.trim().toUpperCase();
                if (!teamCode || teamCode.length !== 5) {
                    showError('teamManagement', 'Please enter a valid 5-character team code');
                    return;
                }
                
                try {
                    hideError('teamManagement');
                    hideSuccess('teamManagement');
                    await joinTeam(teamCode);
                    showSuccess('teamManagement', 'Successfully joined team!');
                    renderTeamsList();
                    createTeamForm.reset();
                } catch (error) {
                    showError('teamManagement', error.message);
                }
                return;
            }
            
            // Handle creating a new team (always shared with 5-character code)
            try {
                hideError('teamManagement');
                hideSuccess('teamManagement');
                const createdTeam = await createTeam(teamName, true);
                const successMessage = createdTeam.teamString ? 
                    `Team created successfully! Code: ${createdTeam.teamString}` : 
                    'Team created successfully!';
                showSuccess('teamManagement', successMessage);
                renderTeamsList();
                createTeamForm.reset();
            } catch (error) {
                showError('teamManagement', error.message);
            }
        });
    }
}

// Game Management Functions
async function loadGames() {
    console.log('loadGames - currentUser:', currentUser);
    console.log('loadGames - currentUser.teamId:', currentUser?.teamId);
    
    if (!currentUser || !currentUser.teamId) {
        console.log('No current user or team ID, setting games to empty array');
        games = [];
        return;
    }
    
    try {
        const response = await apiCall('/data/games', 'GET');
        console.log('loadGames - server response:', response);
        
        if (response && response.data) {
            games = response.data;
            console.log('loadGames - loaded games from server:', games);
        } else {
            console.log('No games data from server');
            games = [];
        }
    } catch (error) {
        console.error('Failed to load games from server:', error);
        // Fallback to localStorage for backward compatibility
        const savedGames = localStorage.getItem('hockeyTracker_games');
        if (savedGames) {
            const allGames = JSON.parse(savedGames);
            console.log('loadGames - fallback to localStorage, allGames:', allGames);
            if (currentUser && currentUser.teamId) {
                games = allGames.filter(game => game.teamId == currentUser.teamId);
                console.log('loadGames - filtered games from localStorage:', games);
            } else {
                games = [];
            }
        } else {
            console.log('No saved games found in localStorage');
            games = [];
        }
    }
    
    // Initialize gameIdCounter based on existing games
    if (games.length > 0) {
        gameIdCounter = Math.max(...games.map(g => g.id), 0);
        console.log('loadGames - initialized gameIdCounter to:', gameIdCounter);
    } else {
        gameIdCounter = 0;
        console.log('loadGames - initialized gameIdCounter to 0');
    }
}

async function saveGames() {
    console.log('saveGames called');
    console.log('currentUser.teamId:', currentUser?.teamId);
    console.log('games to save:', games);
    
    if (!currentUser || !currentUser.teamId) {
        console.log('No current user or team ID, cannot save games');
        return;
    }
    
    try {
        console.log('saveGames - sending to server:', games.map(g => ({
            id: g.id,
            name: g.name,
            faceoffs: g.stats.faceoffs
        })));
        await apiCall('/data/games', 'POST', { data: games });
        console.log('Games saved to server successfully');
    } catch (error) {
        console.error('Failed to save games to server:', error);
        // Fallback to localStorage for backward compatibility
        const savedGames = localStorage.getItem('hockeyTracker_games');
        let allGames = [];
        if (savedGames) {
            allGames = JSON.parse(savedGames);
        }
        console.log('allGames before filtering:', allGames);
        
        // Remove existing games for this team
        allGames = allGames.filter(game => game.teamId != currentUser.teamId);
        console.log('allGames after filtering:', allGames);
        
        // Add current team's games
        const teamGames = games.map(game => ({ ...game, teamId: currentUser.teamId }));
        allGames = allGames.concat(teamGames);
        console.log('allGames after adding current team games:', allGames);
        
        // Save all games back to localStorage
        localStorage.setItem('hockeyTracker_games', JSON.stringify(allGames));
        console.log('Games saved to localStorage as fallback');
    }
}

function renderGameDropdown() {
    if (!gameDropdown) return;
    
    gameDropdown.innerHTML = '<option value="">Select a game...</option>';
    
    // Debug logging
    console.log('renderGameDropdown - currentUser:', currentUser);
    console.log('renderGameDropdown - currentUser.teamId:', currentUser?.teamId);
    console.log('renderGameDropdown - currentUser.teamId type:', typeof currentUser?.teamId);
    console.log('renderGameDropdown - games:', games);
    console.log('renderGameDropdown - games.length:', games?.length);
    
    // Check if user has a team selected
    if (!currentUser || !currentUser.teamId) {
        console.log('No team selected, showing "Please select a team first"');
        const option = document.createElement('option');
        option.value = "";
        option.textContent = "Please select a team first";
        option.disabled = true;
        gameDropdown.appendChild(option);
        return;
    }
    
    games.forEach(game => {
        const option = document.createElement('option');
        option.value = game.id;
        option.textContent = `${game.name} (${game.date})`;
        gameDropdown.appendChild(option);
    });
}

async function addGame() {
    const name = newGameName.value.trim();
    const date = newGameDate.value;
    
    if (!name || !date) {
        alert('Please enter both game name and date.');
        return;
    }
    
    // Check if user has a team selected
    if (!currentUser || !currentUser.teamId) {
        alert('Please select a team before creating a game.');
        return;
    }
    
    console.log('addGame - gameIdCounter before:', gameIdCounter);
    const game = {
        id: ++gameIdCounter,
        name: name,
        date: date,
        teamId: currentUser.teamId, // Associate game with current team
        stats: {
            goals: [],
            plusMinus: [],
            faceoffs: [],
            rink: {
                shots: [],
                stats: {
                    forShots: 0,
                    forScores: 0,
                    forMisses: 0,
                    againstShots: 0,
                    againstScores: 0,
                    againstMisses: 0
                }
            }
        }
    };
    
    console.log('addGame - created game with ID:', game.id);
    console.log('addGame - gameIdCounter after:', gameIdCounter);
    games.push(game);
    await saveGames();
    renderGameDropdown();
    
    // Clear form and hide it
    newGameName.value = '';
    newGameDate.value = '';
    addGameForm.classList.add('hidden');
    
    // Select the new game
    gameDropdown.value = game.id;
    selectGame(game.id);
}

async function deleteGame() {
    if (!currentGame) {
        alert('Please select a game to delete.');
        return;
    }
    
    const confirmed = await showConfirm(
        'Delete Game', 
        `Are you sure you want to delete "${currentGame.name}"? This action cannot be undone and will delete all game data including shots, goals, assists, and faceoff stats.`
    );
    
    if (confirmed) {
        console.log('Deleting game:', currentGame.name);
        
        // Remove game from games array
        const gameIndex = games.findIndex(g => g.id === currentGame.id);
        if (gameIndex !== -1) {
            games.splice(gameIndex, 1);
        }
        
        // Clear current game
        currentGame = null;
        
        // Save changes to server
        await saveGames();
        
        // Update UI
        renderGameDropdown();
        gameStatsSection.classList.add('hidden');
        
        // Clear game dropdown selection
        gameDropdown.value = '';
        
        // Hide delete button
        deleteGameBtn.style.display = 'none';
        
        console.log('Game deleted successfully');
        showSuccessMessage('Game deleted successfully');
    }
}

function selectGame(gameId) {
    console.log('selectGame called with gameId:', gameId);
    console.log('selectGame - available games:', games.map(g => ({ id: g.id, name: g.name })));
    currentGame = games.find(game => game.id == gameId);
    console.log('selectGame - found game:', currentGame?.name);
    
    // Additional security check: ensure game belongs to current team or shared team
    if (currentGame && currentUser && currentUser.teamId) {
        const userTeam = userTeams.find(t => t.id == currentUser.teamId);
        if (userTeam && userTeam.isShared) {
            // For shared teams, we need to check if the game belongs to the same shared team
            // Since the game was loaded from the server for this shared team, it should be accessible
            // The server already filtered games by shared team, so we can trust it
            console.log('Game belongs to shared team, allowing access');
        } else {
            // For regular teams, check exact team ID match
            if (currentGame.teamId != currentUser.teamId) {
                console.warn('Game does not belong to current team');
                currentGame = null;
            }
        }
    }
    
    if (currentGame) {
        // Save selected game to localStorage for persistence
        localStorage.setItem('hockeyTrackerSelectedGame', JSON.stringify({
            gameId: currentGame.id,
            gameName: currentGame.name,
            teamId: currentUser?.teamId
        }));
        
        console.log('selectGame - loading game:', currentGame.name);
        console.log('selectGame - currentGame.stats:', currentGame.stats);
        console.log('selectGame - currentGame.stats.faceoffs:', currentGame.stats.faceoffs);
        gameStatsSection.classList.remove('hidden');
        
        // Show delete button when a game is selected
        if (deleteGameBtn) {
            deleteGameBtn.style.display = 'inline-block';
        }
        
        loadGameStats();
        
        // Initialize period directions for hockey rules
        gamePeriodDirections = {
            '1': attackDirection,
            '2': attackDirection === 'left' ? 'right' : 'left',
            '3': attackDirection,
            'all': attackDirection
        };
        
        // Initialize game UI
        renderGamePlayerButtons();
        updateGameUI();
        updateGamePeriodButtons();
        updateGameDirectionButton();
        
        // Update canvas event listeners for game view
        updateCanvasEventListeners();
    } else {
        // Clear selected game from localStorage
        localStorage.removeItem('hockeyTrackerSelectedGame');
        
        gameStatsSection.classList.add('hidden');
        
        // Update canvas event listeners for non-game view
        updateCanvasEventListeners();
    }
}

function loadGameStats() {
    if (!currentGame) return;
    
    console.log('loadGameStats called for game:', currentGame.name);
    console.log('currentGame.stats:', currentGame.stats);
    
    // Load goals - clear first, then load from current game
    goals = [];
    goals = currentGame.stats.goals || [];
    console.log('Loaded goals for game:', currentGame.name, goals);
    goalIdCounter = Math.max(...goals.map(g => g.id), 0);
    
    // Load plus/minus events - clear first, then load from current game
    plusMinusEvents = [];
    plusMinusEvents = currentGame.stats.plusMinus || [];
    console.log('Loaded plusMinusEvents for game:', currentGame.name, plusMinusEvents);
    plusMinusIdCounter = Math.max(...plusMinusEvents.map(p => p.id), 0);
    
    // Load faceoff stats - clear first, then load from current game
    faceoffStats = [];
    faceoffStats = currentGame.stats.faceoffs || [];
    console.log('Loaded faceoffStats for game:', currentGame.name, faceoffStats);
    console.log('faceoffStats length:', faceoffStats.length);
    
    // Load rink stats - clear first, then load from current game
    shots = [];
    if (currentGame.stats.rink) {
        shots = currentGame.stats.rink.shots || [];
        shotIdCounter = Math.max(...shots.map(s => s.id), 0);
    } else {
        // Initialize empty rink stats if none exist
        shotIdCounter = 0;
    }
    console.log('Loaded shots for game:', currentGame.name, shots.length, 'shots');
    
    // Update counters based on current shots
    updateGameCounters();
    
    // Refresh displays
    renderGameGoalsList();
    renderGamePlusMinusList();
    renderGameFaceoffPlayersList();
    if (gameCtx) {
        drawGameRink();
    }
}

async function saveGameStats() {
    if (!currentGame) return;
    
    console.log('saveGameStats called - currentGame:', currentGame.name);
    console.log('saveGameStats called - goals:', goals);
    console.log('saveGameStats called - plusMinusEvents:', plusMinusEvents);
    console.log('saveGameStats called - faceoffStats:', faceoffStats);
    console.log('saveGameStats called - shots:', shots.length, 'shots');
    console.log('saveGameStats called - shots array:', shots);
    console.log('saveGameStats called - currentGame.stats before save:', currentGame.stats);
    
    // Save current stats to game
    currentGame.stats.goals = goals;
    currentGame.stats.plusMinus = plusMinusEvents;
    currentGame.stats.faceoffs = faceoffStats;
    
    console.log('saveGameStats - saving to game:', currentGame.name);
    console.log('saveGameStats - currentGame.stats.faceoffs after save:', currentGame.stats.faceoffs);
    
    // Initialize rink stats if they don't exist
    if (!currentGame.stats.rink) {
        currentGame.stats.rink = {
            shots: [],
            stats: {
                forShots: 0,
                forScores: 0,
                forMisses: 0,
                againstShots: 0,
                againstScores: 0,
                againstMisses: 0
            }
        };
    }
    
    // Save shots and stats to rink
    currentGame.stats.rink.shots = shots;
    currentGame.stats.rink.stats = {
        forShots: parseInt(gameForShots?.textContent || 0),
        forScores: parseInt(gameForScores?.textContent || 0),
        forMisses: parseInt(gameForMisses?.textContent || 0),
        againstShots: parseInt(gameAgainstShots?.textContent || 0),
        againstScores: parseInt(gameAgainstScores?.textContent || 0),
        againstMisses: parseInt(gameAgainstMisses?.textContent || 0)
    };
    
    await saveGames();
    console.log('saveGameStats - shot saved to game:', currentGame.name, 'shots now:', currentGame.stats.rink.shots.length);
    console.log('saveGameStats - currentGame.stats after save:', currentGame.stats);
    console.log('saveGameStats - rink shots after save:', currentGame.stats.rink.shots);
}

// Export Game Data
function exportGameData() {
    if (!currentGame) {
        alert('Please select a game first.');
        return;
    }
    
    const gameData = {
        gameName: currentGame.name,
        gameDate: currentGame.date,
        shots: shots,
        goals: goals,
        plusMinusEvents: plusMinusEvents,
        faceoffStats: faceoffStats,
        exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(gameData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentGame.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_game_data.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Import Game Data
function importGameData() {
    if (!currentGame) {
        alert('Please select a game first.');
        return;
    }
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
        
        try {
            const text = await file.text();
            const importedData = JSON.parse(text);
            
            // Validate the imported data
            if (!importedData.shots || !Array.isArray(importedData.shots)) {
                alert('Invalid file format. Please select a valid game data file.');
                return;
            }
            
            // Ask for confirmation before importing
            const confirmed = await showConfirm(
                'Import Game Data', 
                `This will add ${importedData.shots.length} shots to the current game. This action cannot be undone. Continue?`
            );
            
            if (confirmed) {
                // Import shots
                const maxShotId = Math.max(...shots.map(s => s.id), 0);
                const importedShots = importedData.shots.map((shot, index) => ({
                    ...shot,
                    id: maxShotId + index + 1
                }));
                shots.push(...importedShots);
                shotIdCounter = Math.max(...shots.map(s => s.id), 0);
                
                // Import goals if they exist
                if (importedData.goals && Array.isArray(importedData.goals)) {
                    const maxGoalId = Math.max(...goals.map(g => g.id), 0);
                    const importedGoals = importedData.goals.map((goal, index) => ({
                        ...goal,
                        id: maxGoalId + index + 1
                    }));
                    goals.push(...importedGoals);
                    goalIdCounter = Math.max(...goals.map(g => g.id), 0);
                }
                
                // Import plus/minus events if they exist
                if (importedData.plusMinusEvents && Array.isArray(importedData.plusMinusEvents)) {
                    const maxPlusMinusId = Math.max(...plusMinusEvents.map(p => p.id), 0);
                    const importedPlusMinus = importedData.plusMinusEvents.map((event, index) => ({
                        ...event,
                        id: maxPlusMinusId + index + 1
                    }));
                    plusMinusEvents.push(...importedPlusMinus);
                    plusMinusIdCounter = Math.max(...plusMinusEvents.map(p => p.id), 0);
                }
                
                // Import faceoff stats if they exist
                if (importedData.faceoffStats && Array.isArray(importedData.faceoffStats)) {
                    faceoffStats.push(...importedData.faceoffStats);
                }
                
                // Update the game stats
                currentGame.stats.rink.shots = shots;
                currentGame.stats.goals = goals;
                currentGame.stats.plusMinus = plusMinusEvents;
                currentGame.stats.faceoffs = faceoffStats;
                
                // Save the updated game
                await saveGameStats();
                
                // Refresh the display
                drawGameRink();
                updateGameCounters();
                renderGameGoalsList();
                renderGamePlusMinusList();
                renderGameFaceoffPlayersList();
                
                showSuccessMessage(`Successfully imported ${importedShots.length} shots to ${currentGame.name}`);
            }
        } catch (error) {
            console.error('Error importing game data:', error);
            alert('Error importing file. Please check the file format and try again.');
        }
    };
    
    input.click();
}

function switchGameStatType(statType) {
    currentStatType = statType;
    
    // Hide all stat views
    document.querySelectorAll('.stat-view').forEach(view => {
        view.classList.remove('active');
    });
    
    // Remove active class from all stat type buttons
    document.querySelectorAll('.stat-type-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected stat view
    const statView = document.getElementById(statType + 'StatView');
    const statBtn = document.getElementById(statType + 'StatBtn');
    
    if (statView) statView.classList.add('active');
    if (statBtn) statBtn.classList.add('active');
    
    // Load appropriate data
    if (statType === 'goalsAssists') {
        renderGoalsAssistsPlayerButtons();
        renderGameGoalsList();
    } else if (statType === 'lineup') {
        renderLineupPlayerButtons();
        renderGamePlusMinusList();
    } else if (statType === 'faceoffs') {
        renderFaceoffsPlayerButtons();
        renderGameFaceoffPlayersList();
    } else if (statType === 'rink') {
        if (gameCtx) {
            drawGameRink();
        }
        // Initialize game UI for rink view
        renderGamePlayerButtons();
        updateGameUI();
        updateGamePeriodButtons();
        updateGameDirectionButton();
    }
}

// Game-specific rendering functions
function renderGameGoalsList() {
    console.log('renderGameGoalsList called');
    console.log('currentGame:', currentGame);
    console.log('gameGoalsList element:', gameGoalsList);
    console.log('goals array:', goals);
    console.log('goals.length:', goals.length);
    
    if (!gameGoalsList) {
        console.log('gameGoalsList element not found');
        return;
    }
    
    if (goals.length === 0) {
        console.log('No goals, showing empty message');
        gameGoalsList.innerHTML = '<p class="no-goals">No goals recorded yet.</p>';
        return;
    }
    
    gameGoalsList.innerHTML = goals.map(goal => `
        <div class="goal-item">
            <span class="goal-info">
                Goal: ${goal.goal || 'Unassigned'} | 
                Assists: ${goal.assist1 || 'None'}, ${goal.assist2 || 'None'}
            </span>
            <button class="delete-goal-btn" data-goal-id="${goal.id}">Delete</button>
        </div>
    `).join('');
    
    // Add event listeners to delete buttons
    gameGoalsList.querySelectorAll('.delete-goal-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const goalId = parseInt(btn.getAttribute('data-goal-id'));
            await deleteGameGoal(goalId);
        });
    });
}

function renderGamePlusMinusList() {
    console.log('renderGamePlusMinusList called');
    console.log('gamePlusMinusList element:', gamePlusMinusList);
    console.log('plusMinusEvents array:', plusMinusEvents);
    console.log('plusMinusEvents.length:', plusMinusEvents.length);
    
    if (!gamePlusMinusList) {
        console.log('gamePlusMinusList element not found');
        return;
    }
    
    if (plusMinusEvents.length === 0) {
        console.log('No plus/minus events, showing empty message');
        gamePlusMinusList.innerHTML = '<p class="no-events">No +/- events recorded yet.</p>';
        return;
    }
    
    gamePlusMinusList.innerHTML = plusMinusEvents.map(event => `
        <div class="plusminus-item">
            <span class="plusminus-info">
                ${event.type === 'plus' ? '+' : '-'} | 
                ${event.lineup.leftWing || 'LW'}, ${event.lineup.center || 'C'}, ${event.lineup.rightWing || 'RW'}, 
                ${event.lineup.leftDefence || 'LD'}, ${event.lineup.rightDefence || 'RD'}
            </span>
            <button class="delete-plusminus-btn" data-event-id="${event.id}">Delete</button>
        </div>
    `).join('');
    
    // Add event listeners to delete buttons
    gamePlusMinusList.querySelectorAll('.delete-plusminus-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const eventId = parseInt(btn.getAttribute('data-event-id'));
            await deleteGamePlusMinus(eventId);
        });
    });
}

function renderGameFaceoffPlayersList() {
    if (!gameFaceoffPlayersList) return;
    
    console.log('renderGameFaceoffPlayersList - faceoffStats:', faceoffStats);
    console.log('renderGameFaceoffPlayersList - currentGame:', currentGame?.name);
    console.log('renderGameFaceoffPlayersList - faceoffStats.length:', faceoffStats.length);
    
    gameFaceoffPlayersList.innerHTML = '';
    
    if (faceoffStats.length === 0) {
        gameFaceoffPlayersList.innerHTML = '<p class="no-players">No faceoff players added yet.</p>';
    } else {
        // Render existing players
        faceoffStats.forEach(player => {
            const row = document.createElement('div');
            row.className = 'faceoff-player-row';
            
            const name = document.createElement('div');
            name.className = 'faceoff-col-player';
            name.textContent = player.playerName;
            
            const taken = document.createElement('div');
            taken.className = 'faceoff-col-taken';
            taken.textContent = player.taken;
            
            const won = document.createElement('div');
            won.className = 'faceoff-col-won';
            won.textContent = player.won;
            
            const actions = document.createElement('div');
            actions.className = 'faceoff-col-actions';
            
            const takenBtn = document.createElement('button');
            takenBtn.textContent = '-Loss';
            takenBtn.style.backgroundColor = '#dc3545';
            takenBtn.style.color = 'white';
            takenBtn.style.border = '1px solid #dc3545';
            takenBtn.onclick = () => incrementGameFaceoffTaken(player.playerName);
            
            const wonBtn = document.createElement('button');
            wonBtn.textContent = '+ Won';
            wonBtn.style.backgroundColor = '#28a745';
            wonBtn.style.color = 'white';
            wonBtn.style.border = '1px solid #28a745';
            wonBtn.onclick = () => incrementGameFaceoffWon(player.playerName);
            
            actions.appendChild(takenBtn);
            actions.appendChild(wonBtn);
            
            const deleteCol = document.createElement('div');
            deleteCol.className = 'faceoff-col-delete';
            
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = () => removeGameFaceoffPlayer(player.playerName);
            
            deleteCol.appendChild(deleteBtn);
            
            row.appendChild(name);
            row.appendChild(taken);
            row.appendChild(won);
            row.appendChild(actions);
            row.appendChild(deleteCol);
            
            gameFaceoffPlayersList.appendChild(row);
        });
    }
    
    // Add "Add Player" button row
    const addRow = document.createElement('div');
    addRow.className = 'add-faceoff-row';
    
    const addBtn = document.createElement('button');
    addBtn.className = 'add-faceoff-btn';
    if (activeFaceoffAddButton) {
        addBtn.classList.add('active');
    }
    addBtn.textContent = 'Add Player';
    addBtn.addEventListener('click', activateFaceoffAddButton);
    
    addRow.appendChild(addBtn);
    gameFaceoffPlayersList.appendChild(addRow);
}

// Game Faceoff Functions
async function incrementGameFaceoffTaken(playerName) {
    const player = faceoffStats.find(fs => fs.playerName === playerName);
    if (player) {
        player.taken++;
        
        // Save to current game if in game context, otherwise save to global storage
        if (currentGame) {
            await saveGameStats();
        } else {
            await saveStatsToStorage();
        }
        
        renderGameFaceoffPlayersList();
        
        // Update player stats if on Players tab
        if (playersView.classList.contains('active')) {
            renderPlayersList();
        }
    }
}

async function incrementGameFaceoffWon(playerName) {
    const player = faceoffStats.find(fs => fs.playerName === playerName);
    if (player) {
        player.taken++; // Increment faceoffs taken
        player.won++;   // Increment faceoffs won
        
        // Save to current game if in game context, otherwise save to global storage
        if (currentGame) {
            await saveGameStats();
        } else {
            await saveStatsToStorage();
        }
        
        renderGameFaceoffPlayersList();
        
        // Update player stats if on Players tab
        if (playersView.classList.contains('active')) {
            renderPlayersList();
        }
    }
}

async function removeGameFaceoffPlayer(playerName) {
    const confirmed = await showConfirm('Confirm Delete', `Remove ${playerName} from faceoff tracking?`);
    if (confirmed) {
        faceoffStats = faceoffStats.filter(fs => fs.playerName !== playerName);
        
        // Save to current game if in game context, otherwise save to global storage
        if (currentGame) {
            await saveGameStats();
        } else {
            await saveStatsToStorage();
        }
        
        renderGameFaceoffPlayersList();
        
        // Update player stats if on Players tab
        if (playersView.classList.contains('active')) {
            renderPlayersList();
        }
    }
}

function drawGameRink() {
    if (!gameCtx || !gameRinkCanvas) return;
    
    const width = gameRinkCanvas.width;
    const height = gameRinkCanvas.height;

    // Clear canvas
    gameCtx.clearRect(0, 0, width, height);

    // Background (ice)
    gameCtx.fillStyle = '#e8f4f8';
    gameCtx.fillRect(0, 0, width, height);

    // Rink outline
    gameCtx.strokeStyle = '#000';
    gameCtx.lineWidth = 3;
    gameCtx.strokeRect(0, 0, width, height);

    // Center line (red)
    gameCtx.strokeStyle = '#c41e3a';
    gameCtx.lineWidth = 4;
    gameCtx.beginPath();
    gameCtx.moveTo(width / 2, 0);
    gameCtx.lineTo(width / 2, height);
    gameCtx.stroke();

    // Blue lines
    gameCtx.strokeStyle = '#0033a0';
    gameCtx.lineWidth = 4;
    
    // Left blue line
    gameCtx.beginPath();
    gameCtx.moveTo(width * 0.33, 0);
    gameCtx.lineTo(width * 0.33, height);
    gameCtx.stroke();
    
    // Right blue line
    gameCtx.beginPath();
    gameCtx.moveTo(width * 0.66, 0);
    gameCtx.lineTo(width * 0.66, height);
    gameCtx.stroke();

    // Face-off circles
    drawGameFaceoffCircle(width * 0.2, height * 0.35, 40);
    drawGameFaceoffCircle(width * 0.2, height * 0.65, 40);
    drawGameFaceoffCircle(width * 0.8, height * 0.35, 40);
    drawGameFaceoffCircle(width * 0.8, height * 0.65, 40);

    // Center face-off circle
    drawGameFaceoffCircle(width * 0.5, height * 0.5, 50);

    // Goal creases
    drawGameGoalCrease(width * 0.05, height * 0.5);
    drawGameGoalCrease(width * 0.95, height * 0.5);

    // Filter and redraw shot markers based on selected period
    const shotsToDisplay = currentPeriod === 'all' 
        ? shots 
        : shots.filter(shot => shot.period === currentPeriod);
    
    shotsToDisplay.forEach(shot => drawGameShot(shot));
}

// Game Canvas Event Handlers
async function handleGameCanvasClick(event) {
    console.log('handleGameCanvasClick called');
    console.log('handleGameCanvasClick - currentGame:', currentGame);
    console.log('handleGameCanvasClick - gameRinkCanvas:', gameRinkCanvas);
    
    if (!currentGame) {
        console.log('handleGameCanvasClick - no currentGame, cannot add shot');
        return;
    }
    
    console.log('handleGameCanvasClick - currentGame:', currentGame.name);
    
    const rect = gameRinkCanvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // If attacking right, we need to mirror the click coordinates back to original
    // because we want to store the original coordinates, not the mirrored ones
    if (attackDirection === 'right') {
        x = gameRinkCanvas.width - x;
    }
    
    // Create new shot with original coordinates
    const shot = {
        id: ++shotIdCounter,
        x: x,
        y: y,
        result: currentState.result,
        team: currentState.team,
        playerName: currentState.selectedPlayer,
        period: currentPeriod,
        timestamp: new Date().toISOString()
    };
    
    console.log('handleGameCanvasClick - creating shot for period:', currentPeriod);
    console.log('handleGameCanvasClick - shot object:', shot);
    
    shots.push(shot);
    drawGameRink();
    updateGameCounters();
    await saveGameStats();
}

// Update Game Counters
function updateGameCounters() {
    if (!currentGame) return;
    
    // Filter shots by current period
    const periodShots = currentPeriod === 'all' 
        ? shots 
        : shots.filter(shot => shot.period === currentPeriod);
    
    console.log('updateGameCounters - currentPeriod:', currentPeriod);
    console.log('updateGameCounters - all shots:', shots.map(s => ({ id: s.id, period: s.period })));
    console.log('updateGameCounters - filtered periodShots:', periodShots.map(s => ({ id: s.id, period: s.period })));
    
    // FOR stats (includes all player shots)
    const forShots = periodShots.filter(s => s.team === 'player');
    if (gameForShots) gameForShots.textContent = forShots.length;
    if (gameForScores) gameForScores.textContent = forShots.filter(s => s.result === 'score').length;
    if (gameForMisses) gameForMisses.textContent = forShots.filter(s => s.result === 'miss').length;
    
    // AGAINST stats
    const againstShots = periodShots.filter(s => s.team === 'against');
    if (gameAgainstShots) gameAgainstShots.textContent = againstShots.length;
    if (gameAgainstScores) gameAgainstScores.textContent = againstShots.filter(s => s.result === 'score').length;
    if (gameAgainstMisses) gameAgainstMisses.textContent = againstShots.filter(s => s.result === 'miss').length;
}

function handleGameCanvasMouseMove(event) {
    if (!currentGame) return;
    
    const rect = gameRinkCanvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Apply the same mirroring logic as drawGameShot for hover detection
    // When attacking right, we need to mirror the mouse position to match the mirrored shot positions
    if (attackDirection === 'right') {
        x = gameRinkCanvas.width - x;
    }
    
    // Filter shots based on current period (only show tooltip for visible shots)
    const visibleShots = currentPeriod === 'all' 
        ? shots 
        : shots.filter(shot => shot.period === currentPeriod);
    
    // Find hovered shot from visible shots only
    const hoveredShot = visibleShots.find(shot => {
        const distance = Math.sqrt((shot.x - x) ** 2 + (shot.y - y) ** 2);
        return distance < 15; // Within 15 pixels
    });
    
    if (hoveredShot) {
        showShotTooltip(hoveredShot, event.clientX, event.clientY);
    } else {
        hideShotTooltip();
    }
}

// Draw face-off circle for game rink
function drawGameFaceoffCircle(x, y, radius) {
    gameCtx.strokeStyle = '#c41e3a';
    gameCtx.lineWidth = 2;
    gameCtx.beginPath();
    gameCtx.arc(x, y, radius, 0, Math.PI * 2);
    gameCtx.stroke();

    // Center dot
    gameCtx.fillStyle = '#c41e3a';
    gameCtx.beginPath();
    gameCtx.arc(x, y, 4, 0, Math.PI * 2);
    gameCtx.fill();
}

// Draw goal crease for game rink
function drawGameGoalCrease(x, y) {
    gameCtx.strokeStyle = '#c41e3a';
    gameCtx.fillStyle = 'rgba(196, 30, 58, 0.1)';
    gameCtx.lineWidth = 2;

    gameCtx.beginPath();
    if (x < gameRinkCanvas.width / 2) {
        // Left goal
        gameCtx.arc(x, y, 30, -Math.PI / 2, Math.PI / 2);
    } else {
        // Right goal
        gameCtx.arc(x, y, 30, Math.PI / 2, -Math.PI / 2);
    }
    gameCtx.fill();
    gameCtx.stroke();
}

function drawGameShot(shot) {
    if (!gameCtx) return;
    
    // Apply direction mirroring
    let x = shot.x;
    const y = shot.y;
    
    // Mirror shots based on attack direction
    if (attackDirection === 'right') {
        x = gameRinkCanvas.width - x;
    }
    
    const isScore = shot.result === 'score';
    const isFor = shot.team === 'player';
    
    // Determine marker style based on shot type
    let fillColor, strokeColor, strokeWidth, shadowColor;
    
    if (isScore && isFor) {
        // Score - For
        fillColor = '#38ef7d';
        strokeColor = '#11998e';
        strokeWidth = 2;
        shadowColor = 'rgba(56, 239, 125, 0.6)';
    } else if (isScore && !isFor) {
        // Score - Against
        fillColor = '#ff6a00';
        strokeColor = '#ee0979';
        strokeWidth = 2;
        shadowColor = 'rgba(255, 106, 0, 0.6)';
    } else if (!isScore && isFor) {
        // Miss - For
        fillColor = 'transparent';
        strokeColor = '#00f2fe';
        strokeWidth = 3;
        shadowColor = null;
    } else {
        // Miss - Against
        fillColor = 'transparent';
        strokeColor = '#fa709a';
        strokeWidth = 3;
        shadowColor = null;
    }
    
    // Draw the marker
    gameCtx.beginPath();
    gameCtx.arc(x, y, 8, 0, 2 * Math.PI);
    
    // Fill if needed
    if (fillColor !== 'transparent') {
        gameCtx.fillStyle = fillColor;
        gameCtx.fill();
    }
    
    // Draw border
    gameCtx.strokeStyle = strokeColor;
    gameCtx.lineWidth = strokeWidth;
    gameCtx.stroke();
    
    // Add glow effect for scores
    if (shadowColor) {
        gameCtx.shadowColor = shadowColor;
        gameCtx.shadowBlur = 10;
        gameCtx.beginPath();
        gameCtx.arc(x, y, 8, 0, 2 * Math.PI);
        gameCtx.stroke();
        gameCtx.shadowBlur = 0;
    }
}

// Start the app
document.addEventListener('DOMContentLoaded', () => {
    console.log('Hockey Tracker: DOM loaded, initializing...');
    try {
        init();
        setupAuthentication();
        console.log('Hockey Tracker: Initialization complete');
    } catch (error) {
        console.error('Hockey Tracker: Initialization error:', error);
    }
});


