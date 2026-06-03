---
title: Social Interaction and Emotional Contagion Mechanism
description: How agents interact through social networks with asymmetric mutual influence, network adaptation under stress, and support exchange dynamics
author: pi
editor: lam
date: 2026-06-03T13:31:11.634Z
tags:
  - social-support
  - network
  - simulation
  - agent
  - affect
  - emotion-regulation
---

Social interactions between neighboring agents drive emotional contagion, mutual support, and network restructuring. The model incorporates several empirically grounded phenomena: negative emotional states spread more strongly than positive ones, stressed individuals adapt their social connections, and support effectiveness depends on the neighbor's psychological state.

Mutual influence implements asymmetric emotional contagion: Delta_A_i = alpha_p * (A_j - A_i) amplified by 1.5 when the affect change is negative. This captures the well-established negativity bias in emotional contagion, where negative affect propagates more readily through social networks. Agent-based modeling of emotion contagion in groups has demonstrated that such asymmetry is necessary to reproduce realistic group emotion dynamics [@bosse2014]. Empirical validation studies confirm that ABM emotion contagion models can accurately predict observed emotional convergence in small groups [@vanhaeringen2024].

Network adaptation triggers after repeated stress breaches: when c_breach >= eta_adapt (default threshold), agents evaluate their connections. Connection preferences use similarity computed from affect and resilience: s_ij = 1 - (|A_i - A_j| + |R_i - R_j|) / 2. Retention probability balances homophily with support effectiveness: p_keep = s_ij * delta_homophily + e_s * (1 - delta_homophily). This follows the principle of social safety, where individuals under threat preferentially seek connections with supportive others [@slavich2023].

Support effectiveness depends on the neighbor's resilience and affect: e_s = (R_j + (1 + A_j)/2) / 2 + 0.2. Support exchanges are detected when any state change exceeds the exchange threshold eta_exchange. This framework integrates the social support buffering hypothesis with network homophily theory [@cohen1985; @mcpherson2001]. Computational models of collective decision making show that integrating interacting emotions with social influence produces more realistic group dynamics than models using either mechanism alone [@bosse2012].