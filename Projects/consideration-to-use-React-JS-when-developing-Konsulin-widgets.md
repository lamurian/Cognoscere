---
author: Lam
date: 2024-12-15T02:28:28+01:00
title: Consideration to use React JS when developing Konsulin widgets
tags:
- konsulin
- webdev
---

### **Why Use React for Widgets?**

#### **1. State Management**

React's built-in state and effects (using `useState` and `useEffect`) are excellent for managing widget-specific functionality, such as:
- Fetching and displaying dynamic data from your FHIR backend.
- Handling user interactions like form inputs or filters.
- Managing authentication tokens or session state.

This makes your widgets more modular and maintainable compared to plain JavaScript.

#### **2. Component Reusability**

React components allow you to encapsulate functionality and reuse it across multiple widgets:
- For example, if several widgets need to display patient data or handle search filters, you can build reusable components for these.

#### **3. Ecosystem**

React’s ecosystem includes tools that simplify development:
- Libraries for UI design (e.g., **Material-UI**, **Ant Design**, **Tailwind**).
- Pre-built solutions for handling authentication flows (e.g., **Firebase React SDK**, **React OAuth2**).

#### **4. Easier Maintenance**

- React encourages clean, declarative code that is easier to debug and scale.
- Using React allows you to adopt modern development practices without significant overhead.

---

### **How React Fits into Hugo Static Pages**

React widgets can be embedded into your Hugo templates without transitioning your entire site to a React app:
1. **Build React Widgets**: Each widget can be a small, self-contained React app.
2. **Bundle with Webpack/Vite**: Use tools like Webpack or Vite to compile your React code into a JavaScript bundle.
3. **Embed in Hugo**:
   - Include the JavaScript bundle in your Hugo templates using `<script>` tags.
   - Add a `<div>` element with a unique `id` where the React widget will mount.

Example:  
```html
<div id="my-widget"></div>
<script src="/path/to/react-widget.js"></script>
```

React will hydrate the widget dynamically at runtime.

---

### **When to Avoid React for Widgets**

Using React for widgets may not be necessary if:
1. **The Widget is Very Simple**: If the widget only displays static data or doesn't involve much interaction, plain JavaScript (or even a lightweight library like Vue.js or Alpine.js) might suffice.
2. **Performance is Critical**: For very lightweight use cases, a full React bundle might be overkill, as it adds some initial loading time.

---

### **Recommended Approach**

1. **Start with React**: Begin by building your widgets in React to leverage its state management and modularity.
2. **Optimize for Simplicity**:
   - Use tools like Vite for fast builds.
   - Bundle only the React components you need, keeping widget sizes minimal.
3. **Grow Over Time**:
   - As your needs expand, you can reuse these React widgets or migrate them into a larger React-based app if necessary.

This approach provides the benefits of React’s modern tooling while keeping things simple and aligned with your current skillset.

# Relevant notes

- [comparison-of-single-item-gauges-for-assessing-mental-health](Resources/comparison-of-single-item-gauges-for-assessing-mental-health.md) 
