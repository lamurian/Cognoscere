---
author: Lam
date: 2024-12-15T02:25:48+01:00
title: Comparison between building a web app or creating widgets for Konsulin
tags:
- konsulin
- webdev
---

### **Option 1: Learning JavaScript and Building a Proper Web App Using React.js**

#### **1. Practicality**

- **Pros**:  
  - React.js is widely used for building feature-rich, responsive web applications.
  - Building a web app allows I to fully customize the user experience.
  - React integrates well with modern libraries and tools (like state management, APIs, and routing).
- **Cons**:  
  - Requires substantial time to learn JavaScript and React.js from scratch.
  - I need to handle hosting, deployment, and ensuring compatibility with my FHIR backend.

#### **2. Estimated Opportunity Cost**

- **Time**: Learning React.js properly might take 2–6 months depending on my pace, including understanding JavaScript fundamentals, React concepts, and working with APIs.
- **Money**:  
  - React itself is free, but additional costs might include:
    - Hosting platforms (e.g., AWS, Vercel) for deploying the app.
    - Optional paid courses or resources for learning React.
    - UI libraries (e.g., Material-UI) are free but may have premium components.

#### **3. Complexity**

- **High**: React is beginner-friendly compared to other frameworks, but mastering it requires a deep understanding of JavaScript, component lifecycle, state management (like Redux or Context), and API integration.

#### **4. Aesthetics**

- **Excellent**: React enables I to use modern UI libraries (e.g., Material-UI, Tailwind CSS) for polished, professional designs.
- Fully responsive and dynamic experiences are possible, which can rival commercial-grade apps.

---

### **Option 2: Building Widgets with an Authentication Layer**

#### **1. Practicality**

- **Pros**:  
  - Aligns with my current skillset (Hugo, static hosting, HTML/CSS, basic JavaScript).
  - Embedding widgets is faster and easier than creating a full web app.
  - Authentication can be abstracted using services like Firebase Auth, Auth0, or OAuth-based libraries.
- **Cons**:  
  - Limited flexibility compared to a full web app.
  - Might not handle complex user flows (e.g., real-time interactions) as well as React apps.

#### **2. Estimated Opportunity Cost**

- **Time**: 
  - Adding widgets requires a shorter learning curve: just basic JavaScript and integrating libraries for authentication (1–2 months).
  - Securing my FHIR backend using an authentication layer will take extra time depending on the tools and complexity.
- **Money**:  
  - Lower costs than a full React app:
    - Hugo hosting remains free if I use GitHub Pages.
    - Authentication services like Firebase Auth offer free tiers.

#### **3. Complexity**

- **Moderate**:  
  - Basic widgets with simple data retrieval and display are easier to implement.
  - Securing and authenticating FHIR APIs is the trickiest part but manageable using pre-built solutions.
  - Maintaining compatibility with Hugo templates and my backend requires planning.

#### **4. Aesthetics**

- **Good**:  
  - Widgets are simpler and less flexible, but I can use libraries like Bootstrap or Tailwind CSS for attractive designs.
  - Embedding multiple widgets might make my interface feel fragmented compared to a cohesive React app.

---

### **Comparison**

| **Criteria**         | **React.js Web App**                       | **Widgets with Authentication**          |
|-----------------------|-------------------------------------------|------------------------------------------|
| **Practicality**      | Suitable for building a full-featured app, but steep learning curve. | Leverages existing skills, quicker to implement. |
| **Opportunity Cost**  | High: 2–6 months to learn and build; hosting costs may apply. | Lower: 1–2 months for learning + setup; mostly free. |
| **Complexity**        | High: Requires learning React, JavaScript, state management, and API integration. | Moderate: Easier implementation but requires securing backend. |
| **Aesthetics**        | Excellent: Professional-grade, responsive, and dynamic interfaces. | Good: Polished but less cohesive across widgets. |

---

### **Recommendation**

For my current expertise and goals, **Option 2 (Widgets with Authentication)** is the better choice:

1. **Faster Implementation**: I can achieve a functional solution without the steep learning curve of React.
2. **Skill Leverage**: I’re already comfortable with Hugo and HTML/CSS/JS basics, making widgets more feasible.
3. **Lower Risk**: Tackling backend authentication is a manageable challenge, especially with pre-built tools like Firebase or Auth0.
