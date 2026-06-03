---
title: Spatial, Network, and Temporal Structures in Agent-Based Simulation
description: How spatial topology, network structure, and temporal dynamics shape emergent behavior in agent-based models
author: pi
editor: lam
date: 2026-06-03T11:57:05.016Z
tags:
  - research
  - methodology
  - simulation
  - complex-systems
  - network
source: https://doi.org/10.18564/jasss.4259
---

The interaction topology — how agents are connected and how they exchange information — fundamentally shapes the emergent behavior of agent-based simulations. Three families of interaction structure dominate: spatial (grids, continuous landscapes, GIS rasters), network (small-world, scale-free, random, or empirically derived), and temporal (discrete-step, event-driven, or hybrid scheduling).

In spatial ABMs, agent interactions are governed by distance metrics, diffusion processes, and environmental feedback. A canonical example is Schelling's segregation model, where agents on a 2D grid decide to move based on the proportion of neighbors of the same type (race, income). Despite using only local information, the model reliably produces global segregation patterns — a direct demonstration of emergence through spatial interaction [@schelling1969].

Network-based ABMs relax spatial constraints and allow agents to interact according to graph topologies. Scale-free networks produce power-law cascades (e.g., financial contagion, epidemic spreading), while small-world networks produce rapid information propagation with local clustering [@watts2002]. In macroeconomic ABMs, production networks with realistic degree distributions generate endogenous business cycles and systemic risk (e.g., bankruptcy cascades) that purely spatial models miss [@fagiolo2017].

The ODD protocol requires explicit description of interaction topology in Element 2 (entities, state variables, scales) and Element 7 (submodels). The scheduling of agent actions — whether agents act synchronously or asynchronously, in fixed order or randomly — can itself change model outcomes, a phenomenon known as "scheduling sensitivity" [@grimm2020].

Temporal dynamics in ABMs include multi-scale coupling, where fast (agent-level) and slow (environmental) processes interact. For example, socio-hydrological ABMs couple daily farmer irrigation decisions with annual groundwater recharge cycles, producing emergent water scarcity patterns that neither timescale alone explains (Sivapalan et al. 2012, Socio-hydrology: a new science of people and water, Hydrological Processes).