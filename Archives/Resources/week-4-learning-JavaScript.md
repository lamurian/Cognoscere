---
author: Lam
date: 2024-12-26T02:09:35+01:00
title: Week 4 learning JavaScript
tag:
- webdev
- konsulin
- frontend
- JavaScript
---

![learn-web-development-from-scratch](Resources/learn-web-development-from-scratch.md) 

# Week 4: React with State Management Pomodoro Planner

This week, you'll focus on advanced state management using `useState` and `useEffect`, working with forms, and incorporating real-time interactivity and API data handling.

---

# Day 1: `useEffect` and Lifecycle Methods (3 hours)  

## Goal: Understand and implement `useEffect`.

Pomodoro 1:  
- Focus: Introduction to `useEffect`.  
  - Learn how `useEffect` replaces lifecycle methods like `componentDidMount` and `componentDidUpdate`.  
  - Understand dependencies and how they control when the effect runs.  

Pomodoro 2:  
- Practice: Use `useEffect` to fetch data.  
  - Fetch and log data from an API when the component mounts.  
- Task: Create a basic component that displays data from JSONPlaceholder or a similar API.  

Pomodoro 3:  
- Enhancements:  
  - Add cleanup logic in `useEffect` for scenarios like removing event listeners or cancelling requests.  

Pomodoro 4:  
- Reflect on when and why `useEffect` is useful.  

---

# Day 2: Controlled Components and Forms (3 hours)  

## Goal: Build and validate controlled forms in React.

Pomodoro 1:  
- Focus: Controlled components.  
  - Learn how to bind form inputs (text, checkbox, etc.) to state.  
- Task: Build a simple form that updates the displayed output dynamically.  

Pomodoro 2:  
- Focus: Form validation.  
  - Implement basic validations (e.g., required fields, length checks).  
- Task: Add validation logic to your form to display error messages for invalid inputs.  

Pomodoro 3:  
- Practice: Create a feedback form with input fields for name, email, and comments.  
  - Display a success message upon submission.  

Pomodoro 4:  
- Test and refine your form’s behavior.  

---

# Day 3: Conditional Rendering (3 hours)  

## Goal: Display content conditionally based on state.

Pomodoro 1:  
- Focus: Ternary operators and `&&` conditions.  
  - Learn how to conditionally render elements.  
- Task: Create a login/logout button that toggles between states.  

Pomodoro 2:  
- Practice:  
  - Add a loading spinner that displays only while data is being fetched.  

Pomodoro 3:  
- Enhancements:  
  - Combine conditional rendering with user inputs or fetched data.  

Pomodoro 4:  
- Review and consolidate knowledge of conditional rendering.  

---

# Day 4: Building a Search Bar Widget (3 hours)  

## Goal: Build a dynamic search bar fetching and filtering API data.

Pomodoro 1:  
- Setup: Design the structure of your search widget.  
  - Create a search bar and an area to display results.  

Pomodoro 2:  
- Focus: Fetch and filter data.  
  - Use `useEffect` to fetch data when the component mounts.  
  - Filter results dynamically as the user types.  

Pomodoro 3:  
- Enhancements:  
  - Add error handling and a "No results found" message.  

Pomodoro 4:  
- Test and refine the search widget.  

---

# Day 5: Enhancing the To-Do List App (3 hours)  

## Goal: Persist tasks to a backend API.

Pomodoro 1:  
- Focus: Setting up a backend for persistence.  
  - Use a mock API like JSONPlaceholder or create your own backend using a service like MockAPI.  
- Task: Connect your React app to the backend to fetch tasks on load.  

Pomodoro 2:  
- Focus: Persist tasks.  
  - Implement logic to save new tasks to the backend when added.  
  - Update state to reflect the changes.  

Pomodoro 3:  
- Enhancements:  
  - Add a delete feature to remove tasks both from the backend and the UI.  

Pomodoro 4:  
- Test the app thoroughly to ensure data persists correctly.  

---

# Day 6: Mini React Project (3 hours)  

## Goal: Build a "Weather Dashboard" app.

Pomodoro 1:  
- Setup: Plan the app and set up the structure.  
  - Create a search bar for city names.  

Pomodoro 2:  
- Implementation: Fetch real-time weather data from an API (e.g., OpenWeatherMap).  
  - Display the temperature, conditions, and a relevant icon.  

Pomodoro 3:  
- Enhancements: Add error handling.  
  - Display a message for invalid cities or failed requests.  

Pomodoro 4:  
- Test, refine, and document your project.  

---

# Day 7: Review and Consolidation (3 hours)  

## Goal: Reinforce concepts and polish projects.

Pomodoro 1:  
- Review the concepts of `useEffect` and controlled components.  

Pomodoro 2:  
- Add documentation and comments to your projects.  

Pomodoro 3:  
- Optional: Expand or refine your projects with additional features or styling.  

Pomodoro 4:  
- Plan the focus areas for next week based on progress.  

---

# Relevant notes

- [2-month-learning-plan-to-prepare-for-web-widget-development](Projects/2-month-learning-plan-to-prepare-for-web-widget-development.md) 
- [week-3-learning-JavaScript](Resources/week-3-learning-JavaScript.md) 
