---
author: Lam
date: 2024-10-22T12:51:18+02:00
title: Characteristics of an agent in agent-based model
source: https://link.springer.com/content/pdf/10.1057/jos.2010.3.pdf
tags:
- simulation
- ABM
- model
---

# Needs:

- Self-contained, modular, uniquely identifiable
- Have attributes that may serve two purposes:
  - To distinguish one agent from another
  - To let agents recognize each other
- Have a state that varies over time, consisting a (proper) subset of its attributes
  - Agent's behavior is derived from this state
  - The state of the model is the collective states of all agents and their environments
  - The state is time-dependent, i.e. the state in T+1 depends on the state in T+0
- Have dynamic interactions with other agents and their environments
  - Interaction based on protocols
  - Protocol depends on attributes and states
  - An agent is able to recognize and distinguish the attribute of other agents

# An agent may have:

- An abstract mechanism that allows adaptation
- A goal to achieve, where an agent can:
  - Compare its state to its goal
  - Adjust its responses and behaviors in future interactions
- Heterogeneous attributes that allows diversity across a population of agents by differentiating its:
  - Characteristics and behaviors
  - Internal model of the environments
  - Perception of other agents
  - Memory of past states
