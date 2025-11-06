---
author: Lam
date: 2025-10-20T10:43:38+02:00
title: Introduction to the decision tree
tags:
- Health Economics
- Pharmacoeconomics
- Modelling
- RUG
---

# A Guide to Decision Tree Modeling in Health Economic Evaluation

## 1. The Rationale for Decision Modeling in Health Economics

Decision analytic modeling is a critical tool for health economic evaluation, providing a systematic, quantitative framework for decision-making under uncertainty. In health care, where choices must be made about allocating scarce resources, models offer a structured approach to comparing alternative options and evaluating their expected costs and outcomes. This is essential for addressing key resource-allocation questions, such as whether to adopt a new screening program or fund a new drug intervention.

While Randomized Clinical Trials (RCTs) are often considered the gold standard for assessing clinical effectiveness, relying solely on them for economic evaluation presents several significant limitations. A decision analytic model provides a framework to synthesize evidence from multiple sources—including trials, cohort studies, and patient records—thereby overcoming the inherent constraints of a single study.

The primary limitations of using a single RCT for economic evaluation include:

1. **Limited Comparators:** An economic evaluation must compare all relevant alternatives to be useful for decision-making. An RCT typically provides evidence on only two or three options and is unlikely to include every feasible course of action available in clinical practice.  
2. **Inappropriate Time Horizons:** The time horizon for an economic evaluation should be long enough to capture the full differences in costs and benefits between alternatives. For chronic diseases, this often requires a lifetime horizon, whereas trials rarely follow patients for their entire lives. Models provide a necessary vehicle for extrapolating evidence beyond the trial's timeframe.  
3. **Use of Intermediate Endpoints:** Due to limited time horizons, RCTs often report on intermediate clinical endpoints (e.g., changes in risk factors) rather than final outcomes like mortality or quality-adjusted life-years (QALYs) (a metric that combines both the quantity and quality of life). Models are required to link these intermediate results to the long-term outcomes that are of primary interest to health economists.  
4. **Lack of Generalizability:** Trial evidence is often specific to a particular patient group or clinical setting, which may not be representative of the broader population or the specific context of the decision problem. Modeling is often necessary to generalize results to other settings or patient subgroups.  
5. **Need for Evidence Synthesis:** A comprehensive economic evaluation requires evidence on resource use, costs, effectiveness, and health-related quality of life, which is rarely available from a single trial and must be synthesized from disparate sources. Decision models provide the organizing framework within which these disparate data can be synthesized.

For these reasons, clinical trials and decision models are best viewed as complementary rather than competing approaches. Trials and other primary studies provide the essential data and parameter estimates, while decision models offer the analytical framework to synthesize this evidence, extrapolate outcomes over an appropriate time horizon, and directly address the decision problem at hand. The decision tree is a foundational type of model that is particularly valuable for structuring and clarifying complex decisions.

---

## 2. The Anatomy of a Decision Tree

A decision tree is a foundational model that offers a clear, graphical representation of a decision problem. It maps out the logical sequence of alternatives, subsequent events, and final outcomes, making it a powerful tool for structuring an economic question. The tree is composed of three core components that work together to illustrate every possible pathway a patient might follow.

Below is a simplified representation of a decision tree's structure:

```
                □ Decision Node
                       |
         +-------------+-------------+
         |                           |
 Alternative 1                 Alternative 2
         |                           |
         |                           △ Terminal Node
         |                           | (Cost C, QALY C)
         |
         ◯ Chance Node
         |
    +----+----+
    |         |
Event A    Event B
(Prob P1)  (Prob 1 - P1)
    |         |
    △         △
Terminal   Terminal
Node       Node
(Cost A,   (Cost B,
 QALY A)    QALY B)
```

### 2.1. Decision Node

A Decision Node represents the initial point of choice in the analysis and is the starting point of the tree. It is from this node that branches representing the different alternatives being evaluated—for example, a new screening program versus no screening—emanate. The source text specifies that this node is "usually drawn as a square" (Chapter 8, Section 8.5.1).

### 2.2. Chance Node

A Chance Node represents a point of uncertainty where different events can occur. The branches extending from a chance node represent all possible subsequent outcomes or events, each assigned a specific probability of occurring. A fundamental rule is that the sum of the probabilities for all branches originating from a single chance node must equal 1, ensuring all possibilities are accounted for.

### 2.3. Terminal Node

A Terminal Node marks the end of a specific pathway in the tree. It represents a final health outcome for a patient who has followed that sequence of decisions and events. A terminal node has no further branches and is the point at which the total costs and final health effects (such as life-years or QALYs) for that pathway are assigned.

Together, these three components—decision, chance, and terminal nodes—combine to create a comprehensive map of a decision problem, from the initial choice to all potential final outcomes. This clear structure provides several strategic advantages for health economic analysis.

---

## 3. The Strategic Advantages of the Decision Tree Approach

The logical and visual structure of a decision tree gives it inherent advantages for analyzing certain types of health economic problems. Its primary strengths lie in its clarity and its suitability for modeling discrete, non-repeating events, which makes it an accessible and effective tool for many decision-making contexts.

1. **Simplicity and Transparency**  
   The branching structure of a decision tree makes the model highly intuitive and easy for stakeholders to understand. It clearly visualizes the sequence of events and the available alternatives, making the underlying logic of the decision transparent. This clarity is a significant advantage when communicating the basis of an economic evaluation to decision-makers who may not be modeling experts.

2. **Effective for Non-Repetitive Events**  
   Decision trees are particularly well-suited for problems involving acute conditions or clinical pathways that can be modeled as a finite sequence of non-repeating events. This distinguishes them from Markov models, which are specifically designed to analyze processes involving chronic diseases or situations where events are likely to recur over time. While a Markov model excels at representing patients transitioning between health states over many cycles, a decision tree is the ideal choice when the problem can be represented as a straightforward, one-time sequence of events.

Realizing these conceptual advantages requires a systematic and practical process of model construction and analysis, which we will now detail step-by-step.

---

## 4. The Decision Tree Modeling Process: A Step-by-Step Explanation

Building and analyzing a decision tree is a systematic process that transforms a defined clinical problem into a quantitative comparison of alternatives. This process moves from structuring the problem graphically to populating the model with data and, finally, calculating the expected cost-effectiveness of each option to guide decision-making.

### 4.1. Structuring the Tree

The first step is to define the decision problem and structure it visually. This begins with establishing the initial decision node, which represents the core choice being evaluated. From this node, a branch is drawn for each alternative under consideration. For example, in an evaluation of a breast cancer screening program, the decision node would have two branches: "Screening" and "No Screening." Subsequent chance and terminal nodes are then added to map out all possible clinical pathways and outcomes that follow from each initial choice.

### 4.2. Populating the Tree with Data

Once the structure is established, the tree must be populated with data sourced from clinical trials, epidemiological studies, and other relevant evidence. This involves assigning specific values to the branches and nodes:

- **Probabilities:** Each branch extending from a chance node is assigned a probability representing the likelihood of that event occurring.  
- **Costs:** The costs associated with each event or pathway are assigned along the relevant branches of the tree.  
- **Health Outcomes:** A final health outcome, measured in units such as life-years gained or QALYs, is assigned to each terminal node.

### 4.3. Analyzing the Tree: The "Averaging Out and Folding Back" Method

The core analytical mechanism for solving a decision tree is known as "averaging out and folding back." This is a step-by-step process that works from the end of the tree (the terminal nodes) back to the beginning (the decision node) to calculate the expected value of each alternative.

The process can be summarized in the following steps:

1. Start at the right-hand side (Terminal Nodes), where final costs and outcomes are defined.  
2. Calculate the 'expected value' at each Chance Node by multiplying the value (cost or outcome) of each subsequent branch by its probability and then summing the results for all branches from that node.  
3. Replace the chance node and its branches with the calculated expected value, effectively 'folding back' the tree.  
4. Continue this process, moving left until all chance nodes are resolved.  
5. Compare the final expected values at the initial Decision Node for each alternative branch. This allows for the identification of the optimal choice based on the objective, such as the strategy with the highest expected QALYs or the lowest expected cost.

This methodical process allows for a robust quantitative comparison of alternatives, providing clear guidance for health resource allocation decisions and serving as a foundation for understanding more complex modeling techniques.
