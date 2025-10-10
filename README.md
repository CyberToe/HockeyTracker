# 🏒 Hockey Shot Tracker

A modern, responsive web application for tracking hockey shots on the ice in real-time. Built according to the Business Requirements Document v1.2.

## Features

### Core Functionality
- **Interactive Rink Canvas**: Click anywhere on the hockey rink to place shot markers
- **State Management**: Toggle between Score/Miss and For/Against states
- **Visual Feedback**: Dynamic background colors and status display based on current state
- **Shot Markers**: Four distinct marker styles for different state combinations:
  - **Score + For**: Green filled circle with glow effect
  - **Score + Against**: Orange filled circle with glow effect
  - **Miss + For**: Cyan hollow circle
  - **Miss + Against**: Pink hollow circle

### Data Management
- **Export**: Save your current session to a JSON file
- **Import**: Load previously saved sessions
- **Reset**: Clear all shots with confirmation
- **Validation**: Imported files are validated for correct structure

### User Interface
- **Real-time Counters**: Track total shots, scores, and misses
- **Visual Legend**: Quick reference for marker meanings
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Beautiful gradient backgrounds that change with state

## How to Use

### Getting Started
1. Open `index.html` in any modern web browser
2. No installation or setup required - it's 100% client-side

### Tracking Shots
1. **Select State**: Choose the current shot state using the toggle buttons
   - Click **SCORE!** or **MISS** to set the result
   - Click **FOR** or **AGAINST** to set the team
2. **Place Marker**: Click on the rink where the shot was taken
3. **Repeat**: Continue selecting states and placing markers as the game progresses

### Managing Data
- **Export Session**: Click the **EXPORT** button to download your current session as a JSON file
- **Import Session**: Click the **IMPORT** button to load a previously saved JSON file (imported shots are added to existing ones, not replaced)
- **Reset**: Click the **RESET** button to clear all shots (with confirmation)

### State Combinations
The app supports four valid state combinations:

| Result | Team | Marker Style | Background Color |
|--------|------|--------------|------------------|
| Score | For | Green filled | Green gradient |
| Score | Against | Orange filled | Orange/Red gradient |
| Miss | For | Cyan hollow | Cyan/Blue gradient |
| Miss | Against | Pink hollow | Pink/Yellow gradient |

## Technical Details

### File Structure
```
HockeyShotTracker/
├── index.html          # Main HTML structure
├── styles.css          # Styling and responsive design
├── app.js              # Application logic
└── README.md           # Documentation
```

### Data Format
Each shot is stored as an object with the following structure:
```json
{
  "id": 0,
  "x": 400,
  "y": 212,
  "resultState": "score",
  "teamState": "for",
  "timestamp": "2025-10-10T12:00:00.000Z"
}
```

Export files include metadata:
```json
{
  "version": "1.0",
  "exportDate": "2025-10-10T12:00:00.000Z",
  "totalShots": 15,
  "shots": [...]
}
```

### Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Requirements Met

This application fulfills all requirements from the BRD:

### Functional Requirements
- ✅ FR-1: Toggle Score/Miss buttons
- ✅ FR-2: Toggle For/Against buttons
- ✅ FR-3: Four valid state combinations
- ✅ FR-4: Visual feedback for current state
- ✅ FR-5: Clickable rink interaction
- ✅ FR-6: Unique marker styling per state
- ✅ FR-7: Shot data tracking with all required fields
- ✅ FR-8: Reset functionality
- ✅ FR-9: Export to JSON file
- ✅ FR-10: Import from JSON file
- ✅ FR-11: Data validation on import
- ✅ FR-12: Responsive design

### Out of Scope (as specified)
- ❌ Backend database or user accounts
- ❌ Real-time multiplayer syncing
- ❌ Analytics, charts, or statistics

## Usage Tips

1. **Compact Design**: The app is optimized to fit on a standard screen at 100% zoom - no need to zoom out!
2. **Mobile Use**: The app is fully responsive - perfect for tracking shots mid-game on a tablet
3. **Undo Feature**: Made a mistake? Use the UNDO button to remove the last shot placed
4. **Team Statistics**: Track shots, scores, and misses separately for FOR and AGAINST teams
5. **Data Backup**: Export your data regularly to avoid losing session data
6. **File Naming**: Export files are automatically named with timestamps for easy organization
7. **State Selection**: The background color changes to match your current state for quick visual reference

## Future Enhancements

Potential features for future versions (currently out of scope):
- Shot statistics and heat maps
- Game session management
- Player-specific tracking
- Export to PDF reports
- Cloud storage integration

## License

This project was created for personal use. Feel free to modify and distribute as needed.

## Support

For issues or questions, please refer to the source code comments or contact the development team.

---

**Version**: 1.0  
**Last Updated**: October 10, 2025  
**Author**: Built for Paul Leblanc


