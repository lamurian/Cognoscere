---
author: Lam
date: 2024-12-26T02:17:41+01:00
title: Week 6 learning JavaScript
tag:
- webdev
- konsulin
- frontend
- JavaScript
---

![learn-web-development-from-scratch](Resources/learn-web-development-from-scratch.md) 

# Week 6: Authentication and API Integration Pomodoro Planner

This week will focus on integrating authentication into your React app, securing API calls, and interacting with a FHIR backend. You will work with Firebase for authentication and use `axios` to securely fetch data from your API.

---

# Day 1: Setting Up Authentication with Firebase (3 hours)  

## Goal: Integrate Firebase Authentication into your app.

Pomodoro 1:  
- Focus: Introduction to Firebase Authentication.  
  - Set up Firebase in your React app.  
  - Learn how Firebase handles authentication (sign-in, sign-out).  
- Task: Create a Firebase project and set up the authentication module in your app.  

Pomodoro 2:  
- Focus: Implement Sign Up/Sign In.  
  - Implement user registration and login with email/password using Firebase.  
- Task: Build a simple `SignUp` and `SignIn` component.  

Pomodoro 3:  
- Focus: Handle Authentication State.  
  - Use `onAuthStateChanged` to track the user’s login state.  
- Task: Display user details when logged in, and hide sign-up/sign-in forms.  

Pomodoro 4:  
- Test the login/logout flow and debug any issues.  

---

# Day 2: Handling Authentication Tokens (3 hours)  

## Goal: Securely store and manage authentication tokens.

Pomodoro 1:  
- Focus: Understanding Firebase Auth Tokens.  
  - Learn how Firebase issues authentication tokens for secure API requests.  
- Task: Fetch and store the Firebase user token on successful login.  

Pomodoro 2:  
- Focus: Storing the Token.  
  - Use `localStorage` or `sessionStorage` to store the authentication token.  
- Task: Securely store the token and pass it with API requests.  

Pomodoro 3:  
- Practice:  
  - Create a `Profile` component that displays user data, which is fetched using the stored token.  
  - Handle token expiration and implement token refresh logic.  

Pomodoro 4:  
- Review and test token storage and handling for secure access.  

---

# Day 3: Setting Up `axios` for API Calls (3 hours)  

## Goal: Set up `axios` to make secure API requests.

Pomodoro 1:  
- Focus: Introduction to `axios`.  
  - Install and configure `axios` for API calls.  
- Task: Set up a global `axios` instance with default headers (e.g., Authorization) for secure communication.  

Pomodoro 2:  
- Focus: Making authenticated API calls.  
  - Add the authentication token to the headers of your requests using `axios`.  
- Task: Fetch some test data (e.g., a list of users or records) from your FHIR API.  

Pomodoro 3:  
- Practice:  
  - Handle errors in `axios` requests (e.g., 401 Unauthorized).  
  - Display user-friendly messages on error.  

Pomodoro 4:  
- Test API calls, ensuring they return data and handle errors correctly.  

---

# Day 4: Fetching and Displaying Secure Data (3 hours)  

## Goal: Fetch patient data securely from your FHIR backend and display it in your app.

Pomodoro 1:  
- Focus: Fetching data from the FHIR API.  
  - Use `axios` to send authenticated requests to your FHIR API.  
  - Understand how to make requests to endpoints such as `/Patient`, `/Observation`, etc.  
- Task: Build a component that fetches a list of patients from the FHIR API and displays it.  

Pomodoro 2:  
- Focus: Handling FHIR data.  
  - Learn how to parse and display FHIR resource data (e.g., patient names, identifiers, etc.).  
- Task: Display patient information in a table format.  

Pomodoro 3:  
- Enhancements:  
  - Add loading states and error handling (e.g., display "No patients found" if the request returns an empty list).  

Pomodoro 4:  
- Test and refine the display of patient data.  

---

# Day 5: Adding User Login/Logout to Your App (3 hours)  

## Goal: Integrate login/logout functionality into your app.

Pomodoro 1:  
- Focus: Implementing user login functionality.  
  - Add a login button to your app that authenticates users using Firebase.  
- Task: Make sure users are redirected to a dashboard or home page upon successful login.  

Pomodoro 2:  
- Focus: Implementing logout functionality.  
  - Add a logout button that clears the authentication token and redirects users to the login page.  
- Task: Implement a `Logout` button and ensure the user is logged out correctly.  

Pomodoro 3:  
- Practice:  
  - Ensure that users who are not authenticated are redirected to the login page if they try to access protected routes.  

Pomodoro 4:  
- Test login/logout flow thoroughly and ensure session persistence across refreshes.  

---

# Day 6: Building the Patient Data Widget (3 hours)  

## Goal: Create a widget that fetches and displays patient data securely.

Pomodoro 1:  
- Focus: Design the widget.  
  - Plan the widget structure, considering how patient data will be displayed (e.g., list or table view).  

Pomodoro 2:  
- Focus: Fetch and display patient data from the FHIR API.  
  - Use `axios` to get patient data securely and display it in the widget.  
- Task: Create a `PatientList` component to display patient details.  

Pomodoro 3:  
- Enhancements:  
  - Add pagination or search functionality to filter through the list of patients.  

Pomodoro 4:  
- Test and refine the widget, ensuring smooth functionality and security.  

---

# Day 7: Final Review and Polishing (3 hours)  

## Goal: Refine your app and ensure everything works securely.

Pomodoro 1:  
- Review Firebase authentication and token management.  
  - Ensure users are authenticated and tokens are being stored and used securely.  

Pomodoro 2:  
- Review API calls and error handling.  
  - Make sure all API calls are authenticated and handle any possible errors correctly.  

Pomodoro 3:  
- Polish the user interface and fix any remaining bugs.  
  - Refine the UI for login/logout states, loading indicators, and error handling.  

Pomodoro 4:  
- Final testing and documentation.  
  - Ensure that all functionality works as expected, and document the authentication flow and API integration.  

---

# Relevant notes

- [2-month-learning-plan-to-prepare-for-web-widget-development](Projects/2-month-learning-plan-to-prepare-for-web-widget-development.md)
- [week-5-learning-JavaScript](Resources/week-5-learning-JavaScript.md)
