# Hockey Shot Tracker

A comprehensive hockey analytics application with user authentication and real-time shot tracking capabilities.

## Features

### Core Functionality
- **Real-time Shot Tracking**: Click on the hockey rink to place shot markers for goals and misses
- **Player Management**: Add, remove, and track individual player statistics
- **Advanced Statistics**: Track goals, assists, +/- events, and faceoff statistics
- **Game Management**: Organize data by periods and games
- **Data Export/Import**: Save and load game data in JSON format

### User Authentication & Profile Management
- **User Registration & Login**: Secure account creation with email validation
- **Profile Management**: Update personal information, team name, and email
- **Password Management**: Change passwords securely
- **Account Deletion**: Permanent account removal with data cleanup
- **Data Persistence**: All hockey data is tied to user accounts and stored securely

### User Interface
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Intuitive Controls**: Easy-to-use interface for quick shot tracking
- **Visual Feedback**: Color-coded shot markers and real-time statistics
- **Modal Dialogs**: Clean authentication and profile management interfaces

## Installation & Setup

### Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation Steps

1. **Clone or download the project files**
   ```bash
   # If using git
   git clone <repository-url>
   cd HockeyShotTracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```
   
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

4. **Access the application**
   Open your web browser and navigate to:
   ```
   http://localhost:3000
   ```

## Usage Guide

### Getting Started
1. **Create an Account**: Click "Register" in the top-right corner to create a new account
2. **Login**: Use your credentials to access your personal hockey tracking data
3. **Add Players**: Go to the Players tab to add team members
4. **Start Tracking**: Switch to the Rink tab to begin tracking shots

### Tracking Shots
1. **Select Result**: Choose "SCORE!" or "MISS"
2. **Select Player/Team**: Choose a player or "AGAINST" for opponent shots
3. **Select Period**: Choose which period you're tracking (1, 2, 3, or All)
4. **Click on Rink**: Click anywhere on the hockey rink to place a shot marker
5. **View Statistics**: Real-time statistics update automatically

### Managing Players
- **Add Players**: Enter player name and click "Add Player"
- **View Stats**: See individual player statistics including shots, goals, assists, and faceoff percentages
- **Remove Players**: Click "Remove" next to any player
- **Import/Export**: Save player rosters to JSON files

### Advanced Statistics
The Stats tab provides three sub-sections:

#### Goals & Assists
- Assign goal scorers and up to 2 assists per goal
- Track goal history with timestamps
- Delete goals if needed

#### Lineup +/-
- Assign players to specific positions (LW, C, RW, LD, RD)
- Record +/- events when goals are scored
- Track which players were on ice during each goal

#### Faceoffs
- Add players to faceoff tracking
- Record faceoff wins (+) and losses (-)
- View faceoff percentages for each player

### Profile Management
Click the profile button (👤) in the header to:
- **Update Profile**: Change email, full name, and team name
- **Change Password**: Update your account password
- **Delete Account**: Permanently remove your account and all data

## Technical Details

### Backend Architecture
- **Express.js Server**: RESTful API with authentication middleware
- **SQLite Database**: Local database for user and data storage
- **JWT Authentication**: Secure token-based authentication
- **bcrypt Password Hashing**: Secure password storage
- **Rate Limiting**: Protection against abuse

### Frontend Architecture
- **Vanilla JavaScript**: No external frameworks for optimal performance
- **Canvas API**: Interactive hockey rink with shot visualization
- **Local Storage Fallback**: Offline functionality when server is unavailable
- **Responsive CSS**: Mobile-first design approach

### Data Storage
- **User Accounts**: Stored in SQLite with encrypted passwords
- **Hockey Data**: Organized by user with JSON serialization
- **Local Fallback**: Browser localStorage for offline use
- **Data Types**: Shots, players, and statistics stored separately

### Security Features
- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure authentication with expiration
- **Input Validation**: Server-side validation for all user inputs
- **Rate Limiting**: Prevents brute force attacks
- **CORS Protection**: Secure cross-origin requests

## File Structure
```
HockeyShotTracker/
├── server.js              # Express server and API endpoints
├── package.json           # Dependencies and scripts
├── index.html             # Main application interface
├── app.js                 # Frontend JavaScript logic
├── styles.css             # Application styling
├── README.md              # This documentation
└── hockey_tracker.db      # SQLite database (created automatically)
```

## API Endpoints

### Authentication
- `POST /api/register` - Create new user account
- `POST /api/login` - User login
- `GET /api/profile` - Get user profile (requires auth)
- `PUT /api/profile` - Update user profile (requires auth)
- `PUT /api/change-password` - Change password (requires auth)
- `DELETE /api/account` - Delete user account (requires auth)

### Data Management
- `POST /api/data/:type` - Save user data (shots/players/stats)
- `GET /api/data/:type` - Load user data (shots/players/stats)

## Development

### Adding New Features
1. **Backend**: Add new API endpoints in `server.js`
2. **Frontend**: Update `app.js` with new functionality
3. **Styling**: Add CSS rules in `styles.css`
4. **Testing**: Test both authenticated and unauthenticated states

### Database Schema
The application uses three main tables:
- `users`: User account information
- `user_data`: JSON storage for hockey tracking data

### Environment Variables
For production deployment, set these environment variables:
- `PORT`: Server port (default: 3000)
- `JWT_SECRET`: Secret key for JWT tokens

## Troubleshooting

### Common Issues
1. **Port Already in Use**: Change the PORT environment variable
2. **Database Errors**: Delete `hockey_tracker.db` to reset the database
3. **Authentication Issues**: Clear browser localStorage and re-register
4. **Mobile Issues**: Ensure you're using a modern browser with Canvas support

### Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support  
- Safari: Full support
- Mobile browsers: Full support with touch events

## License

MIT License - Feel free to use and modify for your own hockey tracking needs!

## Support

For issues or feature requests, please check the browser console for error messages and ensure all dependencies are properly installed.