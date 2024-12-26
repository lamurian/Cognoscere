---
author: Lam
date: 2024-12-15T02:30:53+01:00
title: 2-month learning plan to prepare for web widget development
tags:
- konsulin
- webdev
---

## **Week 1: Core JavaScript Basics**

[Detailed plan](Resources/week-1-learning-JavaScript.md) 

### Focus: Build a strong foundation in JavaScript.

**Milestones**:
- Understand JavaScript syntax and basics.
- Write simple scripts manipulating HTML and CSS.

**Topics to Learn**:
1. **JavaScript Fundamentals**:
   - Variables (`let`, `const`, `var`).
   - Data types (strings, numbers, booleans, arrays, objects).
   - Operators, conditionals (`if`, `else`, `switch`).
2. **Functions**:
   - Declaration and expression.
   - Arrow functions.
3. **DOM Manipulation**:
   - `document.querySelector()`, `getElementById()`.
   - Event listeners (`addEventListener()`).
   - Changing content and styles dynamically.

**Practical Objectives**:
- Create a simple webpage with interactive elements (e.g., a button that changes text on click).
- Build a basic to-do list app (vanilla JavaScript).

---

## **Week 2: Intermediate JavaScript**

[Detailed plan](Resources/week-2-learning-JavaScript.md) 

### Focus: Learn advanced JavaScript concepts for building dynamic web widgets.

**Milestones**:
- Master working with APIs and asynchronous code.
- Handle user interactions effectively.

**Topics to Learn**:
1. **APIs and Fetch**:
   - Fetch data from public APIs (e.g., a weather or joke API).
   - Understand HTTP methods (GET, POST).
2. **ES6+ Features**:
   - Template literals, destructuring, spread/rest operators.
   - Modules and `import/export`.
3. **Asynchronous JavaScript**:
   - Promises, `async/await`.
   - Error handling (`try/catch`).

**Practical Objectives**:
- Fetch and display data from a public API (e.g., show weather details for a city).
- Enhance your to-do list app with local storage to save tasks.

---

## **Week 3: React Fundamentals**

[Detailed plan](Resources/week-3-learning-JavaScript.md) 

### Focus: Understand React's core concepts and start building components.

**Milestones**:
- Set up a React environment.
- Build your first React components.

**Topics to Learn**:
1. **React Basics**:
   - Setting up React using `create-react-app` or Vite.
   - JSX and rendering elements.
   - Components (function components).
2. **Props and State**:
   - Passing data via props.
   - Managing state with `useState`.
3. **Event Handling**:
   - Handling user inputs (onClick, onChange).

**Practical Objectives**:
- Build a React app with a button that toggles between “ON” and “OFF”.
- Create a basic widget that fetches and displays data from a mock API (use JSONPlaceholder).

---

## **Week 4: React with State Management**

[Detailed plan](Resources/week-4-learning-JavaScript.md) 

### Focus: Use React’s state management to build interactive widgets.

**Milestones**:
- Use `useState` and `useEffect` effectively.
- Fetch and display real-time data in widgets.

**Topics to Learn**:
1. **Effect Hook (`useEffect`)**:
   - Lifecycle methods (mounting, updating).
   - Fetch data on component mount.
2. **Forms in React**:
   - Controlled components.
   - Form validation.
3. **Conditional Rendering**:
   - Ternary operators, `&&` conditions.

**Practical Objectives**:
- Build a search bar widget that fetches and displays filtered results from an API.
- Enhance the to-do list app to persist data using a backend API.

---

## **Week 5: Advanced React Concepts**

[Detailed plan](Resources/week-5-learning-JavaScript.md) 

### Focus: Learn advanced React concepts and best practices.

**Milestones**:
- Build reusable, modular components.
- Implement basic routing in React.

**Topics to Learn**:
1. **Component Composition**:
   - Reusable and nested components.
2. **Context API**:
   - Share state globally without props drilling.
3. **React Router**:
   - Add navigation between different widgets/pages.

**Practical Objectives**:
- Build a patient data widget that fetches and displays a list of users from your FHIR API.
- Create a navigation bar and route between widgets (e.g., `Home`, `Patients`, `Records`).

---

## **Week 6: Authentication and API Integration**

[Detailed plan](Resources/week-6-learning-JavaScript.md) 

### Focus: Secure your app and integrate with FHIR.

**Milestones**:
- Understand and implement basic authentication.
- Fetch and display data securely from your FHIR backend.

**Topics to Learn**:
1. **Authentication**:
   - Use Firebase Auth or a similar service.
   - Store and handle authentication tokens.
2. **Working with APIs**:
   - Use libraries like `axios` for API calls.
   - Secure your FHIR backend (e.g., OAuth tokens).

**Practical Objectives**:
- Add user login/logout functionality to your app using Firebase.
- Build a widget that fetches and displays patient data securely.

---

## **Week 7: Styling and Optimization**

[Detailed plan](Resources/week-7-learning-JavaScript.md) 

### Focus: Enhance the look and feel of your widgets.

**Milestones**:
- Style your widgets using modern CSS tools.
- Optimize performance.

**Topics to Learn**:
1. **CSS Frameworks**:
   - Use **Tailwind CSS** or **Material-UI** for professional designs.
2. **Performance Optimization**:
   - Code splitting, lazy loading.
   - Minimize React bundle size using tools like Vite.

**Practical Objectives**:
- Style your patient data widget using Material-UI or Tailwind CSS.
- Optimize your widgets for faster loading times.

---

## **Week 8: Deployment and Final Project**

[Detailed plan](Resources/week-8-learning-JavaScript.md) 

### Focus: Deploy your widgets and integrate them into Hugo.

**Milestones**:
- Successfully deploy your React widgets.
- Integrate with your static Hugo site.

**Topics to Learn**:
1. **Widget Deployment**:
   - Use Vite/Webpack to bundle React widgets into a standalone JS file.
   - Deploy widgets using GitHub Pages, Netlify, or similar.
2. **Hugo Integration**:
   - Embed widgets into Hugo templates with `<script>` and `<div>` tags.

**Practical Objectives**:
- Deploy your React widget that displays patient records and integrates with the FHIR backend.
- Embed the widget into your Hugo site and test functionality.

---

### **Final Deliverable**

By the end of 2 months, you’ll have:
1. A secure, embedded React widget fetching real-time patient data.
2. A polished UI styled with Tailwind CSS or Material-UI.
3. A fully deployed and integrated solution with your Hugo site.

# Relevant notes

- [consideration-to-use-React-JS-when-developing-Konsulin-widgets](Projects/consideration-to-use-React-JS-when-developing-Konsulin-widgets.md) 
- [learn-web-development-from-scratch](Resources/learn-web-development-from-scratch.md) 
- [learn-JavaScript-HTML-CSS](Resources/learn-JavaScript-HTML-CSS.md) 
