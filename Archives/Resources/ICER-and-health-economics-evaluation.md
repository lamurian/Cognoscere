---
author: Lam
date: 2025-10-14T12:58:25+02:00
title: ICER and health economics evaluation
tags:
- Health Economics
- Pharmacoeconomics
- Modelling
- RUG
- ICER
---

# Introduction: The Economic Foundation of Healthcare Decisions

The British economist Lionel Robbins defined economics as a science that studies human behavior as a relationship between ends and scarce means with alternative uses. This concept of scarcity and choice is the central challenge in healthcare. The resources available—from budgets and equipment to the time of skilled professionals—are never sufficient to provide every possible health intervention to every person who might benefit. Consequently, difficult choices must be made. The fundamental economic problem in healthcare is how to allocate these scarce resources to maximize the health gain for the population. 

Cost-effectiveness analysis (CEA) is the set of analytical methods developed to provide a systematic and explicit framework to help decision-makers address this challenge. To do so, these analyses rely on a set of core metrics that allow for the consistent comparison of different healthcare interventions.

---

# Differentiating Core Ratios: Average vs. Incremental Cost-Effectiveness

The strategic importance of using the correct ratio in cost-effectiveness analysis cannot be overstated. The choice of ratio determines whether an intervention is being compared against a "do-nothing" baseline or against the next best alternative. This distinction is critical for efficient resource allocation, as it ensures that decisions are based on the additional cost required to achieve an additional unit of health gain, rather than on a simple average that can obscure the true trade-offs involved.

### Average Cost-Effectiveness Ratio (ACER)
The ACER is the ratio of an intervention's total costs to its total effects, typically compared to a baseline of "do-nothing" or "care as usual."  
It answers the question:  
> "What is the average cost per unit of health effect produced by this intervention?"

### Incremental Cost-Effectiveness Ratio (ICER)
The ICER is the ratio of the difference in costs to the difference in effects between two or more competing interventions.  
It is calculated by dividing the additional cost of a specific intervention by the additional health effects it delivers compared to an alternative.  
It answers the question:  
> "What is the extra cost for each extra unit of health effect gained?"

---

## The Critical Distinction for Decision-Making

Focusing only on the ACER can be profoundly misleading. A classic analysis of statin therapy by Goldman et al. (1991), illustrated in the source text (Figure 2.2), demonstrates this point perfectly.

| Intervention | Cost (£k) | Life-years | ACER (£/LY) |
|---------------|------------|-------------|---------------|
| A | 500 | 250 | 2,000 |
| B | 2,500 | 300 | 8,333 |

Judged by its ACER, intervention B appears highly cost-effective. However, the ICER tells a different story:

- Incremental cost = £2,000k (£2,500k - £500k)  
- Incremental benefit = 50 life-years (300 - 250)  
- **ICER = £40,000 per life-year gained**

The ICER reveals the true marginal cost of the additional health gain from choosing B over A, which is far higher than B's average cost-effectiveness might suggest. This incremental perspective is essential for making efficient choices at the margin. Once interventions are properly compared using the ICER, the next step is to filter out any options that are clearly inefficient using the principles of dominance.

---

# Identifying Efficient Options: The Principles of Dominance

Before comparing the cost-effectiveness of different interventions against a willingness-to-pay threshold, it is essential to first eliminate any options that are clearly inefficient. This filtering step ensures that decision-makers are only considering strategies that lie on the *cost-effectiveness frontier*—the set of options that maximize health for a given level of spending.

### Simple Dominance
An intervention is subject to *simple dominance* if it is simultaneously more expensive and less effective than an alternative. In this case, the decision is straightforward:  
> The dominated option should be eliminated from consideration, as it offers a worse outcome for a higher cost.

### Extended Dominance
Extended dominance is a more subtle but equally important concept. An intervention is subject to *extended dominance* when it is less efficient than a combination of two other strategies. This can occur even if the intervention is not simply dominated by any single alternative.

#### Example
In Table 2.1 and Figure 2.5 of the source material, five options (A–E) are ranked by cost. Option D is first eliminated because it is simply dominated by option C (it is more expensive and less effective). This leaves options A, B, C, and E on the potential cost-effectiveness frontier.  

The inefficiency of option C is then revealed by comparing its incremental cost-effectiveness against B with that of the more effective option E against the same baseline, B.  

- The ICER of moving from **B → C** is greater than the ICER of **B → E**.  
- Therefore, **C** is an inefficient choice and is eliminated by extended dominance.  
- The efficient frontier runs directly from **B → E**.

Failing to remove dominated and extendedly dominated options leads to inefficient resource allocation and a failure to maximize the health gain from the available budget.

---

# Key Methodological Challenges in Practice

Moving from theoretical concepts to real-world application introduces significant challenges. The most prominent of these relate to defining the appropriate scope for the analysis and addressing the inherent uncertainty that pervades all healthcare data.

## Defining the Appropriate Scope for Decision-Making

A critical issue in any economic evaluation is its scope. The choice of scope determines the type of efficiency question the analysis can answer.

### Cost-Effectiveness Analysis (CEA) vs. Cost-Benefit Analysis (CBA)
- **CEA** is designed to achieve *productive efficiency*—maximizing the health gain from a given healthcare budget. It helps decide how best to spend money within the health sector.  
- **CBA** aims to address *allocative efficiency* by placing a monetary value on health outcomes, allowing comparisons across sectors (e.g., healthcare vs. education).  
- Due to conceptual and practical difficulties in valuing life and health monetarily, **CEA** has become the dominant approach in health economics.

### Evaluating New vs. Existing Treatments
A common critique of CEA is that it often focuses on adopting new technologies without identifying the *opportunity cost*—the health benefits lost from displacing existing activities.  
However, CEA can address this by ranking **all** interventions (new and existing) by their ICERs. With a fixed budget, decision-makers can fund interventions in ascending ICER order until the budget is exhausted.  
This approach highlights which less-efficient activities should be discontinued to fund more cost-effective ones, thereby maximizing population health.

---

## Addressing Inherent Uncertainty

The costs and effects of any healthcare intervention are not known with certainty. They are based on data that are inherently variable and subject to statistical uncertainty. A robust cost-effectiveness analysis must transparently acknowledge and quantify these uncertainties.

### Primary Sources of Uncertainty

- **Parameter Uncertainty:** Uncertainty in input values (e.g., true mean cost, side effect probability, utility values).  
- **Structural Uncertainty:** Uncertainty about model structure or assumptions (e.g., health states, transitions, extrapolation methods).  
- **Heterogeneity:** Systematic differences in costs or effects across patient subgroups (e.g., younger vs. older patients).  
- **Variability:** Random chance that identical patients may experience different outcomes.

### Probabilistic Sensitivity Analysis (PSA)

To handle parameter uncertainty, modern analyses use **Probabilistic Sensitivity Analysis (PSA)**:

1. Assign probability distributions (e.g., normal for means, beta for probabilities) to uncertain parameters.  
2. Run the model thousands of times, sampling new parameter values each iteration.  
3. Generate a distribution of cost-effectiveness results that reflects total uncertainty.

This approach provides a more realistic understanding of uncertainty and informs decision-makers about the probability that an intervention is cost-effective under different willingness-to-pay thresholds.

---

# Conclusion: From Analysis to Pragmatic Decision-Making

Healthcare decision-makers must make definitive resource allocation choices despite uncertainty in cost-effectiveness evidence. Decisions cannot be deferred indefinitely—choices must be made.  

To bridge the gap between analysis and action, **willingness-to-pay (WTP) thresholds**, or *ceiling ratios*, are used. These represent the maximum amount a healthcare system is willing to pay for an additional unit of health gain, such as a **Quality-Adjusted Life-Year (QALY)**.  
An intervention with an **ICER below this threshold** is generally considered cost-effective and worthy of funding.

### Approaches to Establishing Thresholds

- **Rule-Based Approaches:**  
  Some organizations set explicit thresholds. For example, NICE (UK) generally considers interventions with ICERs below **£20,000 per QALY** to be cost-effective, with **£20,000–£30,000 per QALY** requiring stronger justification.

- **Revealed Preference:**  
  Examines implicit thresholds revealed by historical funding decisions (e.g., NICE or PBAC).

- **Stated Preference:**  
  Uses surveys (e.g., contingent valuation) to elicit how much stakeholders or the public are willing to pay for specific health gains.

---

Ultimately, **cost-effectiveness analysis** is not a rigid formula that dictates decisions.  
Rather, it provides a **structured, transparent, and evidence-based framework** to inform the difficult, real-world choices that must be made when allocating scarce healthcare resources to maximize population health.
