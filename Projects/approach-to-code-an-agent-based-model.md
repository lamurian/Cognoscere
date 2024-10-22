---
author: Lam
date: 2024-10-22T12:22:50+02:00
title: Approach to code an agent-based model
source: https://doi.org/10.1007/978-3-642-24004-1_2
tags:
- simulation
- ABM
---

# Software and packages

- Programmed from scratch in any programming languages
- Use a low-level library:
  - [Swarm](http://www.swarm.org/wiki/Swarm_main_page)
  - [Repast](https://repast.github.io/)
- Use a graphical interface:
  - [Netlogo](https://ccl.northwestern.edu/netlogo/)
  - [Sesam](https://multiagentsimulation.com/)

# Best practices

- Structure the code modularly into separate functions, avoid using a monolithic code
- Use semantic versioning, clearly describe how each version is different
- Do not hard-code the parameters to the code, read it from a separate input file
- Initialize all parameters and variables immediately when they are introduced in the code
- Make small iterative changes overtime, avoid implementing a big change in one go
