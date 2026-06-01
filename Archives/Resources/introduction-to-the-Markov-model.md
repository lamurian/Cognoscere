---
author: Lam
date: 2025-10-20T09:08:08+02:00
title: Introduction to the Markov model
tags:
- Health Economics
- Pharmacoeconomics
- Modelling
- RUG
---

# Fundamentals of Markov Modeling

## Introduction to Markov Models

A Markov model is a powerful analytical tool used in health economic evaluations to simulate the progression of diseases over time. These models are especially effective for analyzing chronic conditions where events, such as recurrence or complications, can happen more than once. The core of a Markov model is its ability to represent a process where patients move between a finite set of distinct health states (e.g., *Well*, *Diseased*, *Dead*) over a series of fixed time intervals, known as cycles.

The primary purpose of a Markov model is to provide a structured framework for decisions where the timing and repetition of events are critical. By tracking a hypothetical cohort of patients as they transition through various health states, the model accumulates the associated costs and health outcomes (like life-years gained or Quality-Adjusted Life-Years) over a defined time horizon. This allows for a comprehensive comparison of the long-term cost-effectiveness of different healthcare interventions.

## Core Components of a Markov Model

Every Markov model is built upon four fundamental components that define its structure and logic.

### Health States

A health state represents a distinct stage of a disease or condition that a patient can occupy. For a model to be valid, the defined states must be mutually exclusive (a patient can only be in one state at any given time) and exhaustive (all possible states are represented).

For example, a simplified model for breast cancer might include three states:

- **Well**: The patient has a history of breast cancer but is currently disease-free.  
- **Recurrence**: The patient's cancer has returned.  
- **Dead**: The patient has died from any cause.  

### Transitions

Transitions are the permitted movements between health states that can occur from one cycle to the next. In a state-transition diagram, these are represented by arrows connecting the states. It is important to note that a transition can include remaining in the same state for another cycle (represented by an arrow pointing from a state back to itself). Certain states, known as absorbing states, cannot be left once entered; *Dead* is the most common example.

### Transition Probabilities

Transition probabilities are the numerical values that govern the movement of the patient cohort between health states during each cycle. They represent the likelihood that a patient in a given state will move to another specific state (or remain in their current state) in the next time interval. The set of transition probabilities for all possible movements from a single state must always sum to 1.

### Cycles

A cycle is the fixed, uniform interval of time during which patients remain in a health state before another set of transitions can occur. The length of a cycle (e.g., one month, one year) is a critical modeling decision that must be clinically relevant to the disease's natural history and align with the available data. All model parameters—including costs, health outcomes, and transition probabilities—must be calculated to correspond precisely to the chosen cycle length.

## The Role of Rewards

As a cohort moves through the model over time, it accumulates costs and health outcomes (such as life-years or QALYs). Within the modeling framework, these costs and outcomes are collectively referred to as *rewards* and are assigned to states or transitions. There are three distinct types of rewards:

- **State Rewards**: Costs or outcomes that a patient accumulates for spending one full cycle in a specific health state.  
- **Transition Rewards**: One-time costs or outcomes accrued only when a patient makes a specific transition from one state to another.  
- **One-Time Rewards**: Costs or outcomes that occur only once during the entire model simulation, either at the very beginning (cycle zero) or the very end.  

Understanding these components is the first step toward appreciating the foundational assumptions that underpin the model's logic.

---

# The Core Markovian Assumption

## Defining the "Memoryless" Property

A strategic understanding of the core Markovian assumption is essential for both building and critically appraising a Markov model. This assumption simplifies complex reality to make modeling feasible, but its implications must be carefully considered. The assumption, often called the *memoryless property*, has two key facets:

1. **Homogeneity**: All individuals within a particular health state are considered identical.  
2. **Lack of Memory**: The probability of a patient transitioning from their current state to another depends only on the current state.  

The direct implication is that the model does not recall what has occurred in previous cycles. For example, the probability of dying after a cancer recurrence would be the same in the first year post-recurrence as it would be in the fifth, which may not reflect clinical reality.

## Overcoming the Assumption's Limitations

While the *memoryless* property is a significant simplification, modelers have developed techniques to overcome its most critical limitations. The primary method is the use of **tunnel states**, which are a series of temporary states that must be visited in a fixed sequence. This technique effectively incorporates a limited "memory" into the model.

For instance, in the breast cancer example, the *Recurrence* state can be replaced with a tunnel consisting of three states:

- Recurrence Year 1  
- Recurrence Year 2  
- Post-Recurrence Year 3+  

This structure allows for different costs, outcomes, and transition probabilities to be assigned to those crucial first two years, making the model more clinically accurate.

---

# Designing and Parameterizing a Markov Model: A Step-by-Step Guide

Building a robust and credible Markov model follows a well-defined methodology to ensure accuracy and transparency.

## Step 1: Defining States and Allowable Transitions

Identify and define the health states central to the decision problem. These must be mutually exclusive and exhaustive. Once defined, represent them in a **state-transition diagram** using circles (states) and arrows (transitions).

## Step 2: Identifying Starting Probabilities

Define the initial distribution of the patient cohort across health states at cycle zero. For example, if evaluating a preventive treatment, 100% of the cohort may start in the *Well* state.

## Step 3: Determining Transition Probabilities

Assign probabilities to every possible transition for each cycle. Organize these into a **transition matrix**:

| From State (t) | To: Well | To: Recurrence | To: Dead |
|-----------------|-----------|----------------|-----------|
| Well | | 0.3 | 0.1 |
| Recurrence | 0 | | 0.2 |
| Dead | 0 | 0 | 1 |

To convert rates to probabilities, use the formula:

```
P = 1 – exp(–r * t)
```

where *P* is the probability, *r* is the rate, and *t* is the cycle length.

## Step 4: Determining the Cycle Length

Select a clinically relevant cycle length (e.g., 1 month or 1 year). All parameters—costs, utilities, and transition probabilities—must correspond to this cycle duration.

## Step 5: Setting the Stopping Rule

Define the model’s **time horizon**. Common stopping rules include:

- Until all patients reach an absorbing state (*Dead*).  
- A pre-specified number of cycles (e.g., 20 years).  
- Remaining life expectancy of the cohort.  

## Step 6: Determining the Rewards

Assign costs and outcomes (QALYs, life-years) to the appropriate states or transitions. The reward’s time frame must align with the cycle length.

---

# The Modeling Process: Cohort Simulation and Analysis

The primary method of analysis is **cohort simulation**, which tracks the movement of a hypothetical group of patients through the model’s health states over time.

## The Cohort Simulation Process

Steps:

1. Place the cohort into health states based on starting probabilities.  
2. Multiply the number of patients in each state by the corresponding transition probabilities.  
3. Sum the number of patients arriving in each destination state.  
4. Repeat for every cycle until the stopping rule is reached.  

**Example:**

Cycle 1:
- 10,000 × = 6,000 remain *Well*  
- 10,000 × = 3,000 move to *Recurrence*  
- 10,000 × = 1,000 move to *Dead*  

Cycle 2:
- *Well*: 6,000 × = 3,600  
- *Recurrence*: (6,000 × 0.3) + (3,000 × 0.8) = 4,200  
- *Dead*: 1,000 + (6,000 × 0.1) + (3,000 × 0.2) = 2,200  

Resulting distribution: 3,600 (*Well*), 4,200 (*Recurrence*), 2,200 (*Dead*).

## Calculating Expected Costs and Outcomes

The results are organized into a **Markov Trace**, showing cohort distribution across cycles. From this, expected values are calculated:

- **Expected Cycle Cost** = (Proportion in each state × state cost) + transition costs  
- **Expected Life-Years** = Sum of proportions in all non-absorbing states  
- **Expected QALYs** = (Proportion in each state × utility value), summed across cycles  

Totals (discounted or undiscounted) provide the cost-effectiveness outcomes.

---

# Model Refinement: Half-Cycle Correction

A **half-cycle correction** adjusts for bias caused by assuming transitions occur at either the start or end of each cycle. It assumes transitions happen on average midway through the cycle.

**Implementation:**

1. Apply half of state rewards at cycle zero.  
2. Apply full rewards for all intermediate cycles.  
3. Apply a final half-reward at the start of the final cycle.  

This refinement improves accuracy, ensuring that costs and outcomes are more realistically accumulated for credible cost-effectiveness results.
