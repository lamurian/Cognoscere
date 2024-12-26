---
author: Lam
date: 2024-12-26T02:14:26+01:00
title: Week 5 learning JavaScript
tag:
- webdev
- konsulin
- frontend
- JavaScript
---

![learn-web-development-from-scratch](Resources/learn-web-development-from-scratch.md) 

# Week 5: Advanced React Concepts Pomodoro Planner

This week focuses on mastering advanced React concepts, including component composition, the Context API, and React Router. You’ll also build more complex applications and explore best practices for modularity and global state management.

---

# Day 1: Component Composition and Reusable Components (3 hours)  

## Goal: Learn to build reusable, modular components.

Pomodoro 1:  
- Focus: Introduction to component composition.  
  - Understand how to build reusable components and structure a React app effectively.  
- Task: Build a simple `Card` component (e.g., displaying user info).  

Pomodoro 2:  
- Focus: Nesting components.  
  - Learn how to pass data between parent and child components.  
  - Create a `UserList` component that maps over an array of users and passes data to `Card` components.  

Pomodoro 3:  
- Practice: Create a `Button` component that can be reused with different labels and styles.  

Pomodoro 4:  
- Review and consolidate concepts related to reusable components.  

---

# Day 2: Context API (3 hours)  

## Goal: Share state across components without prop drilling.

Pomodoro 1:  
- Focus: Introduction to the Context API.  
  - Learn the basics of `React.createContext()` and `useContext()`.  
- Task: Create a context to manage global state (e.g., theme or user authentication status).  

Pomodoro 2:  
- Focus: Using `Provider` and `Consumer`.  
  - Set up a `Provider` to make the state accessible throughout your app.  
- Task: Build a `ThemeContext` to toggle between light and dark modes.  

Pomodoro 3:  
- Practice: Create a shopping cart context.  
  - Implement `addItem` and `removeItem` functions within the context and display the cart count globally.  

Pomodoro 4:  
- Review and experiment with the Context API in different scenarios (e.g., form inputs, user data).  

---

# Day 3: React Router Basics (3 hours)  

## Goal: Implement basic routing in React to navigate between pages.

Pomodoro 1:  
- Focus: Introduction to React Router.  
  - Install `react-router-dom` and set up basic routing.  
  - Learn the difference between `Route` and `Link`.  
- Task: Set up routing for `Home`, `About`, and `Contact` pages in your app.  

Pomodoro 2:  
- Focus: Nested routing.  
  - Learn how to set up nested routes (e.g., `/patients/:id` to display patient details).  
- Task: Create a simple multi-page app with nested routes for patient details.  

Pomodoro 3:  
- Practice: Create a `Navbar` with navigation links to different pages.  
  - Add a working search feature that navigates to a filtered list of items.  

Pomodoro 4:  
- Test your routing setup and refine the structure.  

---

# Day 4: Patient Data Widget (3 hours)  

## Goal: Build a data-fetching widget that displays patient information from an API.

Pomodoro 1:  
- Focus: Design the widget structure.  
  - Plan a widget layout that displays patient data in a table or list format.  
  - Decide which API (e.g., FHIR) will be used to fetch patient data.  

Pomodoro 2:  
- Focus: Fetch data using `useEffect` and display it.  
  - Use `useEffect` to call the API on mount and display a list of patients.  
- Task: Build a `PatientList` component that fetches and displays patient data.  

Pomodoro 3:  
- Enhancements:  
  - Add a loading spinner and error handling for API requests.  

Pomodoro 4:  
- Review and refine the widget, ensuring it’s reusable.  

---

# Day 5: Routing with Dynamic Data (3 hours)  

## Goal: Add routing to display dynamic patient data.

Pomodoro 1:  
- Focus: Implement routing to display patient details.  
  - Create a `PatientDetail` component that receives dynamic data through `React Router` and displays more information about a selected patient.  

Pomodoro 2:  
- Focus: Passing parameters with `React Router`.  
  - Use `useParams()` to get the `id` of the patient from the URL and fetch detailed information.  
- Task: Create a detail page for a specific patient that shows all the patient’s information.  

Pomodoro 3:  
- Practice: Add links to the `PatientList` to navigate to the details page of each patient.  

Pomodoro 4:  
- Test your routing and dynamic data flow to ensure everything works correctly.  

---

# Day 6: Final Project (3 hours)  

## Goal: Build a full-fledged app with routing, context, and dynamic data.

Pomodoro 1:  
- Setup: Plan and design a full application (e.g., a healthcare dashboard with multiple pages).  
  - Define the main components and structure of the app.  

Pomodoro 2:  
- Implementation: Build out the navigation bar with routing for `Home`, `Patients`, `Records`, etc.  
  - Implement `Context` for managing global state (e.g., patient data, user session).  

Pomodoro 3:  
- Enhancements: Fetch real-time data for different sections (patients, records, etc.) and display it using `useEffect`.  

Pomodoro 4:  
- Review and test the app. Ensure smooth routing, data handling, and state management.  

---

# Day 7: Review and Polishing (3 hours)  

## Goal: Refine and finalize your project.

Pomodoro 1:  
- Review component composition and best practices for modularization.  

Pomodoro 2:  
- Add additional features (e.g., search, filtering) to improve usability.  

Pomodoro 3:  
- Refactor code for optimization and clarity.  

Pomodoro 4:  
- Final testing, documentation, and plan next steps.  

---

# Relevant notes

- [2-month-learning-plan-to-prepare-for-web-widget-development](Projects/2-month-learning-plan-to-prepare-for-web-widget-development.md)
- [week-4-learning-JavaScript](Resources/week-4-learning-JavaScript.md)
