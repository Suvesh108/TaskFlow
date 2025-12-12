# Modern Todo List Application - TaskFlow

## Overview

A stunning modern todo list application called **TaskFlow** with integrated timer and stopwatch features, plus a beautiful light/dark theme toggle.

## Features Implemented

### ✅ Todo List Management
- Add new tasks with a clean input interface
- Mark tasks as complete/incomplete with visual feedback
- Delete tasks with hover effects
- Filter tasks by: All, Active, or Completed
- Real-time statistics showing Total, Active, and Completed tasks
- Local storage persistence - tasks survive page refreshes

### ⏱️ Timer Functionality
- Preset time options: 5, 25, 45, and 60 minutes
- Custom time input for any duration (1-999 minutes)
- Start, Pause, and Reset controls
- Visual progress ring animation
- Audio notification when timer completes
- Browser notifications (when permitted)

### ⏲️ Stopwatch Functionality
- Accurate time tracking: Hours:Minutes:Seconds
- Start, Pause, and Reset controls
- Lap time recording
- Laps displayed in reverse chronological order
- Lap counter for tracking number of laps

### 🎨 Theme Toggle
- Seamless light/dark mode switching
- Animated theme transition
- Theme preference saved to localStorage
- Beautiful glassmorphism effects in both themes

## Design Highlights

### Premium Aesthetics
- **Glassmorphism**: Frosted glass effects with backdrop blur
- **Gradient Accents**: Vibrant purple-blue gradients throughout
- **Smooth Animations**: Micro-interactions on hover and click
- **Modern Typography**: Inter font for clean readability
- **Responsive Design**: Works perfectly on mobile and desktop

### Color System
- **Light Theme**: Soft blues and whites with subtle shadows
- **Dark Theme**: Deep navy with bright accents and enhanced contrast
- **Accent Colors**: Purple-blue gradient for primary actions
- **Status Colors**: Green (success), Red (danger), Orange (warning), Blue (info)

### Animation & Interaction
- Slide-down header animation on load
- Slide-up tab navigation animation
- Fade-in content transitions
- Smooth tab switching
- Hover effects on all interactive elements
- Pulse animations for active timers

## Technical Implementation

### Technologies Used
- **HTML5**: Semantic markup with accessibility attributes
- **CSS3**: Custom properties, gradients, animations, glassmorphism
- **Vanilla JavaScript**: No frameworks, pure ES6+
- **Web APIs**: localStorage, Notifications, Web Audio

### Code Structure
- `index.html` - Semantic HTML structure
- `style.css` - Complete design system
- `script.js` - All functionality and state management

### Key Features
- **State Management**: Clean separation of state and rendering
- **Event Handling**: Efficient event delegation where appropriate
- **Persistence**: Automatic localStorage sync for tasks and theme
- **Accessibility**: ARIA labels and semantic HTML
- **Responsive**: Mobile-first design with breakpoints at 768px and 480px

## Getting Started

Simply open `index.html` in your web browser to start using TaskFlow. No installation or build process required!

## Browser Compatibility

Works in all modern browsers that support:
- ES6+ JavaScript
- CSS Grid and Flexbox
- CSS Custom Properties
- LocalStorage API
- Web Audio API (for timer notifications)
