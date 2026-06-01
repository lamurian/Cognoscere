---
author: Lam
date: 2025-10-14T13:59:47+02:00
title: Use cost-effectiveness information for resource allocation and determining threshold
tags:
- Health Economics
- Pharmacoeconomics
- Modelling
- RUG
---

# The Economic Imperative for a Decision Threshold in Healthcare

The British economist Lionel Robbins defined economics as the science of studying human behavior in the context of scarce means with alternative uses. This concept of scarcity lies at the heart of the fundamental economic problem in healthcare. Available resources—from funding and hospital beds to clinical expertise and new technologies—are never sufficient to provide every available health intervention to every person who might benefit. Consequently, difficult choices are unavoidable. 

The central challenge in health economics is to determine how these scarce resources can be allocated to maximize the health gains for the population. This necessitates a systematic framework for evaluating the costs and consequences of different courses of action.

---

## Contrasting Evaluation Frameworks: CBA vs. CEA/CUA

Two primary frameworks are used for economic evaluation, each with a different philosophical approach to valuing outcomes.

- **Cost-Benefit Analysis (CBA):**  
  A framework often employed in sectors like transportation and environmental policy. Its central aim is to value all outcomes, including health benefits and even life itself, in monetary terms. By converting everything to a common currency, CBA can assess whether a project's total benefits outweigh its costs, providing a measure of net social welfare.  

  While theoretically capable of comparing investments across sectors (e.g., healthcare vs. education), CBA has seen limited application in healthcare due to significant practical challenges and ethical concerns regarding the explicit monetization of human life.

- **Cost-Effectiveness Analysis (CEA)** and **Cost-Utility Analysis (CUA):**  
  These are the dominant evaluation frameworks in healthcare. They deliberately avoid the direct monetization of life, instead comparing interventions by measuring **costs in monetary units** and **health outcomes in natural units**, such as cases detected or life-years gained.  
  - **Cost-Utility Analysis (CUA)** is a specific and highly influential form of CEA that uses the **Quality-Adjusted Life-Year (QALY)** as its primary outcome measure.  
    The QALY combines the **quantity** and **quality** of life into a single metric, allowing comparisons across diverse health interventions.

---

## The Incremental Cost-Effectiveness Ratio (ICER) and the Decision Problem

When comparing a new intervention to an existing one, health economists calculate the **Incremental Cost-Effectiveness Ratio (ICER)**, defined as:

\[
ICER = \frac{Cost_{New} - Cost_{Old}}{Effect_{New} - Effect_{Old}}
\]

The ICER can be visualized on the **cost-effectiveness plane**, where incremental costs are plotted on the *y-axis* and incremental effects (e.g., QALYs) on the *x-axis*:

- **Southeast quadrant:** Cheaper and more effective — always adopt.  
- **Northwest quadrant:** Costlier and less effective — always reject.  
- **Northeast quadrant:** More costly but more effective — requires a trade-off decision.

A new intervention that is both more effective and more expensive will fall into the northeast quadrant. Its ICER represents the additional cost required to gain one additional unit of health (e.g., one QALY).

However, while the ICER indicates *the price* of a health gain, it does not indicate *whether that price is worth paying.* For example:

- Drug A costs **£5,000 per QALY gained**  
- Drug B costs **£500,000 per QALY gained**

Both are more effective and more costly, but represent vastly different value propositions. The ICER alone cannot determine whether the additional cost is justified.

This dilemma establishes the need for a **formal decision rule**. Policymakers require a **cost-effectiveness threshold** to interpret an ICER consistently and decide whether an intervention offers acceptable value for money.

---

# Defining the Cost-Effectiveness Threshold

A **cost-effectiveness threshold** is a benchmark representing the **maximum acceptable ICER**. It functions as a decision rule, signifying the highest amount a healthcare system or society is willing to pay for a unit of health gain (e.g., one QALY).

- If **ICER < threshold**, the intervention is considered cost-effective.  
- If **ICER > threshold**, it is considered not cost-effective.

---

## A Glossary of Terms

The cost-effectiveness threshold is referred to by several synonymous terms, each emphasizing a different conceptual facet:

| Term | Description |
|------|--------------|
| **Ceiling ratio** | Emphasizes the upper limit of acceptable cost-effectiveness. |
| **Threshold value** | A general numerical reference for decision-making. |
| **Cut-off value** | Highlights the dividing line between acceptable and unacceptable interventions. |
| **Willingness to pay** | Expresses societal valuation of health gains. |
| **Lambda (λ)** | Common mathematical symbol representing the threshold. |
| **Cost-effectiveness threshold** | The most widely used term in health economics. |

---

## The Decision Rule in Practice

The decision rule derived from the threshold is straightforward:

- **If ICER < λ → Adopt (Cost-effective)**  
- **If ICER > λ → Reject (Not cost-effective)**  

While simple in concept, the challenge lies in determining the *value of λ* itself—an inherently complex and debated issue.

---

# Methodologies for Determining the Threshold

There is no single universally accepted method for determining the cost-effectiveness threshold. Its value depends on both **economic analysis** and **societal value judgments**. Three major approaches are used to estimate or infer it:

## Rule-Based Approaches

These rely on precedent, guidelines, or economic benchmarks rather than empirical estimation.

- **World Health Organization (WHO) Rules of Thumb:**  
  Links the threshold to a country’s GDP per capita:  
  - < 1× GDP per capita: *Very cost-effective*  
  - 1–3× GDP per capita: *Cost-effective*  
  - > 3× GDP per capita: *Not cost-effective*

- **NICE Thresholds (UK):**  
  The National Institute for Health and Care Excellence (NICE) uses a threshold range of **£20,000–£30,000 per QALY**:  
  - < £20,000: Acceptance highly likely  
  - £20,000–£30,000: Case-dependent, requiring justification  
  - > £30,000: Acceptance unlikely unless exceptional circumstances apply

- **The “$50,000 per QALY” Rule (US):**  
  A historically cited figure with weak empirical foundations, based on early Medicare dialysis funding estimates.  
  More recent analyses (e.g., Braithwaite et al., 2008) suggest plausible bounds of **$109,000–$297,000 per QALY**, reflecting contemporary economic conditions.

---

## Revealed Preference Approaches

This method infers the implicit threshold by analyzing *past funding decisions* of healthcare agencies.

- **Example:** Devlin and Parkin (2004) analyzed NICE’s first 51 decisions and found an **implicit threshold** of **£35,000–£48,000 per QALY**, higher than the official £20,000–£30,000 range.  
- **Alternative focus:** Studies of *existing services* (e.g., Martin et al., 2008) estimated the **marginal cost per QALY** in NHS services to be **£12,000–£19,000**, suggesting that new technologies displace care with much lower opportunity costs.

---

## Stated Preference Approaches

These survey-based techniques elicit explicit valuations of health gains from individuals, usually members of the public.

- **Contingent Valuation (CV):**  
  Participants state how much they would be willing to pay for a health intervention or to avoid a negative health outcome.

- **Choice Modelling (CM):**  
  Participants choose between alternative health scenarios with varying costs and benefits to infer their preferences.

Systematic reviews of contingent valuation studies report median QALY valuations around **$161,305**, though results vary widely.  
This diversity illustrates the challenges of converting public preferences into a single policy threshold.

---

# Factors Influencing the Threshold Value

A single, uniform threshold may fail to capture **societal heterogeneity** in valuing different types of health gains. Decision-makers often apply flexible or context-dependent thresholds to reflect these variations.

## Societal Preferences for Specific Health Gains

Evidence indicates that willingness to pay for health improvements varies by context (Mason et al., 2009):

- **Nature of outcome:** Greater willingness to pay for mortality reduction than morbidity reduction.  
- **Age:** Valuations differ significantly across age groups.  

These findings suggest that thresholds may justifiably vary depending on **disease severity**, **type of outcome**, or **population group**.

---

## Application in Decision-Making Frameworks

Organizations such as NICE incorporate flexibility to accommodate societal and ethical considerations:

- **Innovative Benefits:** Technologies offering novel mechanisms or significant innovation may justify higher thresholds.  
- **Limitations of the QALY:** Recognition that QALYs may underrepresent value in certain disease areas.  
- **Certainty Around the ICER:** High confidence in data may warrant greater willingness to pay.

These factors demonstrate how formal thresholds are adapted to reflect broader social priorities beyond pure cost-effectiveness.

---

# Conclusion: The Critical Role and Challenges of the Threshold

The **cost-effectiveness threshold** is a cornerstone of modern health technology assessment, providing a transparent, consistent rule for translating economic evaluations into policy action. Yet determining its value is inherently normative and contested.

A persistent debate remains:  
- Should the threshold reflect the **opportunity cost** of displacing existing programs (as suggested by Martin et al., £12,000–£19,000 per QALY)?  
- Or should it represent **society’s broader willingness to pay** for health improvements (as implied by stated preference studies with much higher valuations)?

This unresolved tension underscores the dual nature of the threshold—as both an **economic efficiency parameter** and a **social value statement**. Navigating this balance remains one of the most pressing challenges in contemporary health economics, particularly in times of fiscal constraint where every resource allocation decision carries tangible opportunity costs.
