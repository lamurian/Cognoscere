---
author: Lam
date: 2024-12-05T03:07:39+01:00
title: Interpret centrality measure in a drug-prescription network
tags:
- graph-theory
- mathematics
- network
---

In a drug prescription network where nodes are medications and edges represent the frequency of co-prescriptions, centrality measures can help analyze the relationships between drugs and their importance in the network. Here’s a layman interpretation of high and low centrality measures in this context:

---

# 1. **Degree Centrality**

- **High Degree Centrality:** A medication with high degree centrality is co-prescribed with many other drugs. It’s like a “jack-of-all-trades” drug that’s used in various treatment regimens.
  - **Example:** A painkiller like paracetamol, which is commonly prescribed alongside many other medications.
- **Low Degree Centrality:** A medication with low degree centrality is co-prescribed with very few drugs or used alone.
  - **Example:** A specialized medication for a rare condition that doesn’t often interact with other drugs.

---

# 2. **Betweenness Centrality**

- **High Betweenness Centrality:** A medication with high betweenness centrality acts as a “connector” between different drug combinations. It’s often included in prescriptions that combine different treatment pathways. Removing this drug could disrupt how other drugs are prescribed together.
  - **Example:** A medication like steroids, which are often prescribed in combination with drugs from different categories (e.g., anti-inflammatory and antibiotics).
- **Low Betweenness Centrality:** A medication with low betweenness centrality doesn’t play a significant bridging role and is more peripheral in prescription patterns.
  - **Example:** A highly specific drug prescribed independently or in predictable, limited combinations.

---

# 3. **Closeness Centrality**

- **High Closeness Centrality:** A medication with high closeness centrality can quickly "connect" to other medications through co-prescription relationships. It’s commonly prescribed and acts as a central part of treatment plans.
  - **Example:** A broad-spectrum antibiotic, which is often prescribed in diverse treatment regimens, making it easy to “reach” other medications in the network.
- **Low Closeness Centrality:** A medication with low closeness centrality is distant from others in the network and not commonly part of overlapping prescriptions.
  - **Example:** An orphan drug for a rare disease, which is rarely used alongside other medications.

---

# 4. **Eigenvector Centrality**

- **High Eigenvector Centrality:** A medication with high eigenvector centrality is not only co-prescribed with many drugs but also frequently paired with other influential medications in the network. It’s a "powerful influencer" in treatment regimens.
  - **Example:** Insulin, which is co-prescribed with other important medications like blood pressure or cholesterol-lowering drugs in diabetic treatment plans.
- **Low Eigenvector Centrality:** A medication with low eigenvector centrality may either be peripheral in the network or only co-prescribed with less important drugs.
  - **Example:** A supplement or adjunct therapy that doesn’t feature prominently in core treatment regimens.

---

# Summary Analogy for a Drug Prescription Network:

- **Degree Centrality:** How many different drugs a medication is co-prescribed with.
- **Betweenness Centrality:** How often a medication acts as a "bridge" between different combinations of drugs.
- **Closeness Centrality:** How quickly a medication can connect to others in the network of prescriptions.
- **Eigenvector Centrality:** How influential a medication is, based on the importance of the drugs it is commonly prescribed with.

This analysis helps identify key drugs in prescriptions, potential dependencies, and opportunities to optimize treatment plans or identify risks in co-prescription patterns.

# Relevant notes

- [definition-of-graph-in-math](Resources/definition-of-graph-in-math.md) 
- [use-and-rationale-of-centrality-measure-in-a-drug-prescription-network](Resources/use-and-rationale-of-centrality-measure-in-a-drug-prescription-network.md) 
