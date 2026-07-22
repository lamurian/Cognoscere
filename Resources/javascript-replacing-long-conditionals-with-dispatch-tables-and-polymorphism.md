---
title: 'JavaScript: Replacing Long Conditionals with Dispatch Tables and Polymorphism'
description: Techniques to replace long if/else chains in JavaScript using dispatch tables (object maps), strategy pattern, polymorphism, guard clauses, and early returns
author: pi
editor: lam
date: 2026-07-22T00:28:01.292Z
tags:
  - javascript
  - best-practices
  - design-patterns
  - software-engineering
  - reference
---
## Summary

Long if/else chains and switch statements are a code smell that indicate poor scalability as logic grows. JavaScript offers several well-established techniques to replace them with more maintainable and extensible alternatives. The choice of technique depends on the nature of the condition: static value-to-value mapping, dynamic behavior selection, or type-based dispatch.

## Technique 1: Object Lookups (Dispatch Tables)

The simplest replacement for if/else chains that map input values to outputs. JavaScript objects are already key-value maps, so using them as dispatch tables is idiomatic and performs O(1) lookup vs O(n) for else-if chains [@dasilva2022].

```javascript
// Before: else-if chain
let fruit = 'apple';
if (fruit === 'apple') {
  console.log('Apple is great for making pies.');
} else if (fruit === 'banana') {
  console.log('Bananas are great for smoothies.');
} else {
  console.log('Unknown fruit');
}

// After: object lookup
const fruitMessages = {
  apple: 'Apple is great for making pies.',
  banana: 'Bananas are great for smoothies.',
  default: 'Unknown fruit'
};
console.log(fruitMessages[fruit] || fruitMessages.default);
```

For returning values, use plain objects. For executing code, store functions in the object and invoke them. This technique works best when the condition is a single value comparison and each case returns a value or calls a function with the same signature [@cettolo2026].

## Technique 2: Strategy Pattern via Function Map

When each branch contains non-trivial logic, extract each behavior into its own function and map keys to functions. This follows the Open/Closed Principle — add new behaviors without modifying existing dispatch code [@cettolo2026].

```javascript
// Strategy map
const paymentStrategies = {
  'credit-card': payWithCreditCard,
  'paypal': payWithPaypal,
  'bank-transfer': payWithBankTransfer,
  'crypto': payWithCrypto
};

function processPayment(method, amount) {
  const strategy = paymentStrategies[method];
  if (!strategy) throw new Error(`Unsupported payment method: ${method}`);
  strategy(amount);
}
```

New payment methods are added as new functions and registered in the map — no existing code is modified. This pattern scales to dozens of variants without increasing complexity.

## Technique 3: Polymorphism (Replace Conditional with Polymorphism)

When the branching logic depends on object type, refactoring.guru's canonical refactoring recommends creating subclasses and moving each branch into a polymorphic method [@shvets2018].

```javascript
// Base class with polymorphic method
class Bird {
  getSpeed() { throw new Error('Must implement getSpeed'); }
}

class European extends Bird {
  getSpeed() { return getBaseSpeed(); }
}

class African extends Bird {
  getSpeed() { return getBaseSpeed() - getLoadFactor() * this.numberOfCoconuts; }
}

class NorwegianBlue extends Bird {
  getSpeed() { return this.isNailed ? 0 : getBaseSpeed(this.voltage); }
}

// Client code — no conditionals
const bird = getBird();  // returns concrete subclass
const speed = bird.getSpeed();
```

This adheres to the Tell-Don't-Ask principle and the Open/Closed Principle: new bird types are added as new subclasses without touching existing code.

## Technique 4: Guard Clauses and Early Returns

For nested conditionals, replacing deeply nested if/else with guard clauses (early returns for edge cases) flattens the control flow and reduces cognitive complexity. This refactoring is documented in the MDN if...else reference as a best practice to avoid dangling else issues [@mozilladevelopernetwork2026].

```javascript
// Before: nested conditional
function calculateShippingCost(customer) {
  if (customer.membership === 'premium') {
    if (customer.totalOrders > 10) {
      return 0;
    } else {
      return 5;
    }
  } else if (customer.membership === 'standard') {
    // ...
  }
}

// After: guard clauses + configuration object
const shippingConfig = {
  premium: { threshold: 10, free: true },
  standard: { threshold: 20, cost: 10 },
  basic: { cost: 25 }
};

function calculateShippingCost(customer) {
  const config = shippingConfig[customer.membership] || shippingConfig.basic;
  if (config.free && customer.totalOrders > config.threshold) return 0;
  return config.cost;
}
```

Configuration objects combine naturally with early returns to replace arbitrarily nested conditionals with data-driven logic.

## Technique 5: When to Use Each Technique

| Technique | Best For | When to Avoid |
|-----------|----------|---------------|
| Object lookup | Static value-to-value mapping | Complex per-case behavior |
| Strategy pattern | Functions with same interface, many variants | 1-2 simple branches |
| Polymorphism | Type-based dispatch, type family grows | Single-use types, simple condition |
| Guard clauses | Deep nesting, edge cases | Already flat logic |
| switch statement | Exact value matching with fall-through | Dynamic keys, computed lookups |

## Key Points

- Long if/else chains are a scaling problem, not just a readability issue
- Object lookups turn O(n) conditional chains into O(1) data lookups
- The Strategy Pattern encapsulates behavior per variant, following Open/Closed Principle
- Polymorphism eliminates type-based conditionals via subclassing and method dispatch
- Guard clauses and early returns flatten nested code without adding abstractions
- Extract conditional expressions into helper functions for self-documenting conditions
- Use configuration objects to centralize thresholds, labels, and rules that change frequently

## Sources

- [@shvets2018] — Refactoring Guru: Replace Conditional with Polymorphism (canonical refactoring catalog)
- [@mozilladevelopernetwork2026] — MDN: if...else statement reference and best practices
- [@cettolo2026] — Strategy Pattern in JavaScript: Replace Messy If-Else Logic With Clean Code
- [@dasilva2022] — Replacing Nested else-if Statements in JavaScript: The Power of Object Mapping

## Relevant notes

- [Pi Agent Efficiency: Practical Optimization Techniques](Resources/pi-agent-efficiency-practical-optimization-techniques.md)
- [Text-based Terminal Browsers with Vi-like Keys](Resources/text-based-terminal-browsers-with-vi-like-keys.md)
- [Measurement and Quantification of the Local-Global Correctness Gap](Resources/measurement-and-quantification-of-the-local-global-correctness-gap.md)
- [Context Engineering for pi Agents](Resources/context-engineering-for-pi-agents.md)
- [Issues, Opportunities, and Best Practices for LLMs in Healthcare and Medical Informatics](Resources/issues-opportunities-and-best-practices-for-llms-in-healthcare-and-medical-informatics.md)