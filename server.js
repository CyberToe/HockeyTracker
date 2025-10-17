const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'hockey-tracker-secret-key-change-in-production';

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname)));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs (increased for development)
  message: 'Too many requests, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

// Database setup
const db = new sqlite3.Database('./hockey_tracker.db');

// Initialize database tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT,
    team_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Shared teams table for team sharing
  db.run(`CREATE TABLE IF NOT EXISTS shared_teams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    team_string TEXT UNIQUE NOT NULL,
    created_by_user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by_user_id) REFERENCES users (id)
  )`);

  // Teams table
  db.run(`CREATE TABLE IF NOT EXISTS teams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    shared_team_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (shared_team_id) REFERENCES shared_teams (id),
    UNIQUE(user_id, name)
  )`);

  // User data table for storing hockey tracking data
  db.run(`CREATE TABLE IF NOT EXISTS user_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    data_type TEXT NOT NULL, -- 'shots', 'players', 'stats'
    data_content TEXT NOT NULL, -- JSON string
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  // Add team_id column to users table if it doesn't exist
  db.run(`ALTER TABLE users ADD COLUMN team_id INTEGER REFERENCES teams(id)`, (err) => {
    // Ignore error if column already exists
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Error adding team_id column:', err);
    }
  });

  // Add team_id column to user_data table if it doesn't exist
  db.run(`ALTER TABLE user_data ADD COLUMN team_id INTEGER REFERENCES teams(id)`, (err) => {
    // Ignore error if column already exists
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Error adding team_id column to user_data:', err);
    }
  });

  // Add shared_team_id column to teams table if it doesn't exist
  db.run(`ALTER TABLE teams ADD COLUMN shared_team_id INTEGER REFERENCES shared_teams(id)`, (err) => {
    // Ignore error if column already exists
    if (err && !err.message.includes('duplicate column name')) {
      console.error('Error adding shared_team_id column to teams:', err);
    }
  });

  console.log('Database tables initialized');
});

// Utility function to generate unique 5-character team string
function generateTeamString() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// JWT middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Serve the main application
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Register new user
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password, fullName, teamName } = req.body;

    // Validate input
    if (!username || !email || !password || !teamName) {
      return res.status(400).json({ error: 'Username, email, password, and team name are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    db.get('SELECT id FROM users WHERE username = ? OR email = ?', [username, email], async (err, row) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (row) {
        return res.status(400).json({ error: 'Username or email already exists' });
      }

      // Hash password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Insert new user
      db.run(
        'INSERT INTO users (username, email, password_hash, full_name, team_name) VALUES (?, ?, ?, ?, ?)',
        [username, email, passwordHash, fullName || null, teamName || null],
        function(err) {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to create user' });
          }

          const userId = this.lastID;
          console.log(`User created with ID: ${userId}`);

          // Create team for the user
          console.log(`Creating team for user ${userId} with name: ${teamName.trim()}`);
          db.run(
            'INSERT INTO teams (user_id, name, created_at) VALUES (?, ?, ?)',
            [userId, teamName.trim(), new Date().toISOString()],
            function(err) {
              if (err) {
                console.error('Database error creating team:', err);
                return res.status(500).json({ error: 'Failed to create team' });
              }

              const teamId = this.lastID;
              console.log(`Team created with ID: ${teamId}`);

              // Set the team as the user's default team
              db.run(
                'UPDATE users SET team_id = ? WHERE id = ?',
                [teamId, userId],
                function(err) {
                  if (err) {
                    console.error('Database error setting default team:', err);
                    return res.status(500).json({ error: 'Failed to set default team' });
                  }

                  console.log(`Team ${teamId} set as default for user ${userId}`);

                  // Generate JWT token
                  const token = jwt.sign(
                    { userId: userId, username },
                    JWT_SECRET,
                    { expiresIn: '7d' }
                  );

                  res.status(201).json({
                    message: 'User created successfully',
                    token,
                    user: {
                      id: userId,
                      username,
                      email,
                      fullName: fullName || null,
                      teamName: teamName || null,
                      teamId: teamId
                    }
                  });
                }
              );
            }
          );
        }
      );
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login user
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  db.get(
    'SELECT id, username, email, password_hash, full_name, team_name FROM users WHERE username = ? OR email = ?',
    [username, username],
    async (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      const validPassword = await bcrypt.compare(password, user.password_hash);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.full_name,
          teamName: user.team_name
        }
      });
    }
  );
});

// Get user profile
app.get('/api/profile', authenticateToken, (req, res) => {
  const userId = req.user.userId;
  
  db.get(
    'SELECT id, username, email, full_name, team_name, team_id, created_at FROM users WHERE id = ?',
    [userId],
    (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Get user's teams with shared team information
      db.all(
        `SELECT t.*, st.team_string 
         FROM teams t 
         LEFT JOIN shared_teams st ON t.shared_team_id = st.id 
         WHERE t.user_id = ? 
         ORDER BY t.name`,
        [userId],
        (err, teams) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
          }

          // Add isShared flag and teamString to each team
          const teamsWithFlags = teams.map(team => ({
            ...team,
            isShared: team.shared_team_id !== null,
            teamString: team.team_string || null
          }));

          res.json({
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
              fullName: user.full_name,
              teamName: user.team_name,
              teamId: user.team_id,
              createdAt: user.created_at
            },
            teams: teamsWithFlags || []
          });
        }
      );
    }
  );
});

// Update user profile
app.put('/api/profile', authenticateToken, (req, res) => {
  const { fullName, teamName, email } = req.body;
  const userId = req.user.userId;

  // Validate email if provided
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
  }

  // Check if email is already taken by another user
  if (email) {
    db.get('SELECT id FROM users WHERE email = ? AND id != ?', [email, userId], (err, row) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (row) {
        return res.status(400).json({ error: 'Email already in use' });
      }

      // Update profile
      updateProfile();
    });
  } else {
    updateProfile();
  }

  function updateProfile() {
    const updates = [];
    const values = [];

    if (fullName !== undefined) {
      updates.push('full_name = ?');
      values.push(fullName);
    }
    if (teamName !== undefined) {
      updates.push('team_name = ?');
      values.push(teamName);
    }
    if (email !== undefined) {
      updates.push('email = ?');
      values.push(email);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(userId);

    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;

    db.run(query, values, function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to update profile' });
      }

      res.json({ message: 'Profile updated successfully' });
    });
  }
});

// Change password
app.put('/api/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }

    // Get current password hash
    db.get('SELECT password_hash FROM users WHERE id = ?', [userId], async (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Verify current password
      const validPassword = await bcrypt.compare(currentPassword, user.password_hash);
      if (!validPassword) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      // Hash new password
      const saltRounds = 12;
      const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

      // Update password
      db.run(
        'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [newPasswordHash, userId],
        function(err) {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to update password' });
          }

          res.json({ message: 'Password updated successfully' });
        }
      );
    });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Save user data
app.post('/api/data/:type', authenticateToken, (req, res) => {
  const { type } = req.params;
  const { data } = req.body;
  const userId = req.user.userId;

  if (!data) {
    return res.status(400).json({ error: 'Data is required' });
  }

  // Validate data type
  const validTypes = ['shots', 'players', 'stats', 'games'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ error: 'Invalid data type' });
  }

  // Get user's current team_id and check if it's a shared team
  db.get(`
    SELECT u.team_id, t.shared_team_id 
    FROM users u 
    JOIN teams t ON u.team_id = t.id 
    WHERE u.id = ?
  `, [userId], (err, user) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      return res.status(400).json({ error: 'No team selected' });
    }

    const teamId = user.team_id;
    const sharedTeamId = user.shared_team_id;
    console.log(`Saving data for user ${userId}, team ${teamId}, shared_team ${sharedTeamId}, type ${type}:`, data);

    // For shared teams, we need to handle data differently
    if (sharedTeamId) {
      // For shared teams, check if any user in this shared team has data
      db.get(
        'SELECT id FROM user_data WHERE team_id IN (SELECT id FROM teams WHERE shared_team_id = ?) AND data_type = ?',
        [sharedTeamId, type],
        (err, row) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
          }

          if (row) {
            // Update existing shared team data
            db.run(
              'UPDATE user_data SET data_content = ?, updated_at = CURRENT_TIMESTAMP WHERE team_id IN (SELECT id FROM teams WHERE shared_team_id = ?) AND data_type = ?',
              [JSON.stringify(data), sharedTeamId, type],
              function(err) {
                if (err) {
                  console.error('Database error:', err);
                  return res.status(500).json({ error: 'Failed to update shared team data' });
                }

                res.json({ message: 'Shared team data updated successfully' });
              }
            );
          } else {
            // Insert new shared team data for current user
            // For shared teams, we use the current user's team_id but ensure consistency
            db.run(
              'INSERT INTO user_data (user_id, team_id, data_type, data_content) VALUES (?, ?, ?, ?)',
              [userId, teamId, type, JSON.stringify(data)],
              function(err) {
                if (err) {
                  console.error('Database error:', err);
                  return res.status(500).json({ error: 'Failed to save shared team data' });
                }

                res.json({ message: 'Shared team data saved successfully' });
              }
            );
          }
        }
      );
    } else {
      // Regular team - existing logic
      const query = 'SELECT id FROM user_data WHERE user_id = ? AND team_id = ? AND data_type = ?';
      const params = [userId, teamId, type];

      db.get(query, params, (err, row) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
        }

        if (row) {
          // Update existing data
          db.run(
            'UPDATE user_data SET data_content = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND team_id = ? AND data_type = ?',
            [JSON.stringify(data), userId, teamId, type],
            function(err) {
              if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Failed to update data' });
              }

              res.json({ message: 'Data updated successfully' });
            }
          );
        } else {
          // Insert new data
          db.run(
            'INSERT INTO user_data (user_id, team_id, data_type, data_content) VALUES (?, ?, ?, ?)',
            [userId, teamId, type, JSON.stringify(data)],
            function(err) {
              if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Failed to save data' });
              }

              res.json({ message: 'Data saved successfully' });
            }
          );
        }
      });
    }
  });
});

// Teams endpoints
app.get('/api/teams', authenticateToken, (req, res) => {
  const userId = req.user.userId;
  
  console.log(`Fetching teams for user ${userId}`);
  db.all(
    `SELECT t.*, st.team_string 
     FROM teams t 
     LEFT JOIN shared_teams st ON t.shared_team_id = st.id 
     WHERE t.user_id = ? 
     ORDER BY t.name`,
    [userId],
    (err, teams) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      // Add isShared flag and teamString to each team
      const teamsWithFlags = teams.map(team => ({
        ...team,
        isShared: team.shared_team_id !== null,
        teamString: team.team_string || null
      }));
      
      console.log(`Found ${teamsWithFlags ? teamsWithFlags.length : 0} teams for user ${userId}:`, teamsWithFlags);
      res.json({ teams: teamsWithFlags });
    }
  );
});

app.post('/api/teams', authenticateToken, (req, res) => {
  const { name, isShared } = req.body;
  const userId = req.user.userId;
  
  if (!name || name.trim().length === 0) {
    return res.status(400).json({ error: 'Team name is required' });
  }
  
  if (isShared) {
    // Create a shared team with unique string
    createSharedTeam(name.trim(), userId, res);
  } else {
    // Create a regular team
    createRegularTeam(name.trim(), userId, res);
  }
});

function createSharedTeam(name, userId, res) {
  // Generate unique team string
  let teamString;
  let attempts = 0;
  const maxAttempts = 10;
  
  function generateUniqueString() {
    teamString = generateTeamString();
    
    // Check if string already exists
    db.get('SELECT id FROM shared_teams WHERE team_string = ?', [teamString], (err, row) => {
      if (err) {
        console.error('Database error checking team string:', err);
        return res.status(500).json({ error: 'Failed to create team' });
      }
      
      if (row) {
        // String exists, try again
        attempts++;
        if (attempts < maxAttempts) {
          generateUniqueString();
        } else {
          return res.status(500).json({ error: 'Failed to generate unique team string' });
        }
      } else {
        // String is unique, create shared team
        db.run(
          'INSERT INTO shared_teams (team_string, created_by_user_id, created_at) VALUES (?, ?, ?)',
          [teamString, userId, new Date().toISOString()],
          function(err) {
            if (err) {
              console.error('Database error creating shared team:', err);
              return res.status(500).json({ error: 'Failed to create shared team' });
            }
            
            const sharedTeamId = this.lastID;
            
            // Create team entry for the creator
            db.run(
              'INSERT INTO teams (user_id, name, shared_team_id, created_at) VALUES (?, ?, ?, ?)',
              [userId, name, sharedTeamId, new Date().toISOString()],
              function(err) {
                if (err) {
                  console.error('Database error creating team:', err);
                  return res.status(500).json({ error: 'Failed to create team' });
                }
                
                const newTeam = {
                  id: this.lastID,
                  name: name,
                  teamString: teamString,
                  isShared: true,
                  createdAt: new Date().toISOString()
                };
                
                res.json({ team: newTeam });
              }
            );
          }
        );
      }
    });
  }
  
  generateUniqueString();
}

function createRegularTeam(name, userId, res) {
  db.run(
    'INSERT INTO teams (user_id, name, created_at) VALUES (?, ?, ?)',
    [userId, name, new Date().toISOString()],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
          return res.status(400).json({ error: 'A team with this name already exists' });
        }
        return res.status(500).json({ error: 'Failed to create team' });
      }
      
      const newTeam = {
        id: this.lastID,
        name: name,
        isShared: false,
        createdAt: new Date().toISOString()
      };
      
      res.json({ team: newTeam });
    }
  );
}

app.put('/api/teams/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const userId = req.user.userId;
  
  if (!name || name.trim().length === 0) {
    return res.status(400).json({ error: 'Team name is required' });
  }
  
  db.run(
    'UPDATE teams SET name = ? WHERE id = ? AND user_id = ?',
    [name.trim(), id, userId],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
          return res.status(400).json({ error: 'A team with this name already exists' });
        }
        return res.status(500).json({ error: 'Failed to update team' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Team not found' });
      }
      
      res.json({ success: true });
    }
  );
});

app.delete('/api/teams/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  
  // Check if team is currently selected by user
  db.get('SELECT team_id FROM users WHERE id = ?', [userId], (err, user) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (user && user.team_id == id) {
      return res.status(400).json({ error: 'Cannot delete the team you are currently using. Please select a different team first.' });
    }
    
    db.run(
      'DELETE FROM teams WHERE id = ? AND user_id = ?',
      [id, userId],
      function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Failed to delete team' });
        }
        
        if (this.changes === 0) {
          return res.status(404).json({ error: 'Team not found' });
        }
        
        res.json({ success: true });
      }
    );
  });
});

// Update user's selected team
// Join team by shared string
app.post('/api/teams/join', authenticateToken, (req, res) => {
  const { teamString } = req.body;
  const userId = req.user.userId;
  
  if (!teamString || teamString.trim().length !== 5) {
    return res.status(400).json({ error: 'Valid 5-character team string is required' });
  }
  
  // Find the shared team
  db.get(
    'SELECT st.*, t.name as team_name FROM shared_teams st JOIN teams t ON st.id = t.shared_team_id WHERE st.team_string = ? AND t.user_id != ?',
    [teamString.trim().toUpperCase(), userId],
    (err, sharedTeam) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (!sharedTeam) {
        return res.status(404).json({ error: 'Team not found or you already have access to this team' });
      }
      
      // Check if user already has a team with this shared_team_id
      db.get(
        'SELECT id FROM teams WHERE user_id = ? AND shared_team_id = ?',
        [userId, sharedTeam.id],
        (err, existingTeam) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
          }
          
          if (existingTeam) {
            return res.status(400).json({ error: 'You already have access to this team' });
          }
          
          // Create team entry for the joining user
          db.run(
            'INSERT INTO teams (user_id, name, shared_team_id, created_at) VALUES (?, ?, ?, ?)',
            [userId, sharedTeam.team_name, sharedTeam.id, new Date().toISOString()],
            function(err) {
              if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Failed to join team' });
              }
              
              const joinedTeam = {
                id: this.lastID,
                name: sharedTeam.team_name,
                teamString: teamString.trim().toUpperCase(),
                isShared: true,
                createdAt: new Date().toISOString()
              };
              
              res.json({ team: joinedTeam, message: 'Successfully joined team' });
            }
          );
        }
      );
    }
  );
});

app.put('/api/profile/team', authenticateToken, (req, res) => {
  const { teamId } = req.body;
  const userId = req.user.userId;
  
  console.log(`User ${userId} trying to switch to team ${teamId}`);
  
  // If teamId is provided, verify it belongs to the user (including shared teams)
  if (teamId) {
    db.get(`
      SELECT t.id FROM teams t 
      WHERE t.id = ? AND t.user_id = ?
    `, [teamId, userId], (err, team) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      console.log(`Team verification result for user ${userId}, team ${teamId}:`, team);
      
      if (!team) {
        return res.status(400).json({ error: 'Team not found or does not belong to you' });
      }
      
      // Update user's team_id
      db.run('UPDATE users SET team_id = ? WHERE id = ?', [teamId, userId], (err) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Failed to update team' });
        }
        
        res.json({ success: true });
      });
    });
  } else {
    // Clear team selection
    db.run('UPDATE users SET team_id = NULL WHERE id = ?', [userId], (err) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to update team' });
      }
      
      res.json({ success: true });
    });
  }
});

// Get user data
app.get('/api/data/:type', authenticateToken, (req, res) => {
  const { type } = req.params;
  const userId = req.user.userId;

  // Validate data type
  const validTypes = ['shots', 'players', 'stats', 'games'];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ error: 'Invalid data type' });
  }

  // Get user's current team_id and check if it's a shared team
  db.get(`
    SELECT u.team_id, t.shared_team_id 
    FROM users u 
    JOIN teams t ON u.team_id = t.id 
    WHERE u.id = ?
  `, [userId], (err, user) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      return res.status(400).json({ error: 'No team selected' });
    }

    const teamId = user.team_id;
    const sharedTeamId = user.shared_team_id;
    console.log(`Getting data for user ${userId}, team ${teamId}, shared_team ${sharedTeamId}, type ${type}`);

    let query, params;

    if (sharedTeamId) {
      // For shared teams, get data from any user in the shared team
      query = `
        SELECT ud.data_content 
        FROM user_data ud 
        JOIN teams t ON ud.team_id = t.id 
        WHERE t.shared_team_id = ? AND ud.data_type = ?
      `;
      params = [sharedTeamId, type];
    } else {
      // Regular team
      query = 'SELECT data_content FROM user_data WHERE user_id = ? AND team_id = ? AND data_type = ?';
      params = [userId, teamId, type];
    }

    db.get(query, params, (err, row) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (!row) {
        console.log(`No ${type} data found for shared team ${sharedTeamId}`);
        return res.json({ data: null });
      }

      try {
        const data = JSON.parse(row.data_content);
        console.log(`Loaded ${type} data for shared team ${sharedTeamId}:`, data);
        res.json({ data });
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        res.status(500).json({ error: 'Failed to parse data' });
      }
    });
  });
});

// Delete user account
app.delete('/api/account', authenticateToken, async (req, res) => {
  const { password } = req.body;
  const userId = req.user.userId;

  if (!password) {
    return res.status(400).json({ error: 'Password is required to delete account' });
  }

  // Verify password
  db.get('SELECT password_hash FROM users WHERE id = ?', [userId], async (err, user) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Delete user data first (foreign key constraint)
    db.run('DELETE FROM user_data WHERE user_id = ?', [userId], (err) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to delete user data' });
      }

      // Delete user account
      db.run('DELETE FROM users WHERE id = ?', [userId], function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Failed to delete account' });
        }

        res.json({ message: 'Account deleted successfully' });
      });
    });
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Hockey Tracker server running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} to view the application`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed');
    }
    process.exit(0);
  });
});
