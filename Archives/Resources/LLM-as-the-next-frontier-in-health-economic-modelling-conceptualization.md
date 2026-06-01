---
author: Lam
date: 2024-11-18T15:45:23+01:00
title: LLM as the next frontier in health economic modelling conceptualization
tags:
- ISPOR
- conference
- LLM
- HE-model
---

- The impact of AI in clinical trials:
  - 10% increase in the success rates of clinical trials
  - 20% cost reduction and duration of trials
- Feasibility of implementing LLM for HE modelling:
  - No need for training, simply tune the AI
  - LLM translates natural language to and from programming language
  - LLM understands multiple modalities: Text, numbers, images, audio, video
  - LLM can perform web search

# Challenges of AI adoption:
  - Insufficient AI literacy
  - Lack of agreement on how AI should be adopted

# Challenges in HE-model conceptualization:
  - Limited time and resources
  - Insufficient expertise in conceptual modelling
  - Conceptualization is underweighted

# Step of conceptualizing a model

- Break a problem into multiple segments
- Deep dive into each segment and think about the key information
- How AI can help: As an assistant
  - LLM reasoning algorithm:
    - Basic input-output approach $\to$ The simplest approach, AI may hallucinate
    - Chain of thoughts $\to$ Keep human in the loop, give feedback to minimize hallucination
    - Multiple chain of thoughts $\to$ Multiple independent chains can work together
    - Tree of thoughts $\to$ Backtracing logical error to redo the command/prompt differently
    - Graph of thoughts^[https://github.com/spcl/graph-of-thoughts] $\to$ Multiple tree path may end up in the same output node
  - HEM-X: A platform to ensure optimal use of AI and human expertise, i.e. a copilot for HE modeller

# Relevant notes

- [conceptualizing-model-using-LLM](Resources/conceptualizing-model-using-LLM.md) 
- [economic-modelling-using-generative-AI](Resources/economic-modelling-using-generative-AI.md) 
- [navigating-LLM-for-HEOR](Resources/navigating-LLM-for-HEOR.md) 
- [HTA-perspective-of-LLM-in-HEOR](Resources/HTA-perspective-of-LLM-in-HEOR.md) 
