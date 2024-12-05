---
author: Lam
date: 2024-12-04T23:41:22+01:00
title: Definition of graph in math
source:
- https://chatgpt.com/share/6750daaa-6b9c-8006-aeee-5ccbdecaddde
tags:
- mathematics
- graph-theory
---

Graph theory is a formal concept depicting connections among entities. In a graph, there exist a pair of nodes and edges $\mathcal{G} = (\mathcal{V}, \mathcal{E})$. The nodes contain a finite set of entity $\mathcal{V} = \{\mathcal{v}_1, \mathcal{v}_2, \dots, \mathcal{v}_n$, while the edges $\mathcal{E}$ represent the connection between two nodes. In a directed graph, the edge is an ordered pair of nodes $\mathcal{E} = (\mathcal{v}_i, \mathcal{v}_j)$, where the order of $i, j$ matters. Directed graphs may contain self connections $(\mathcal{v}_i, \mathcal{v}_i) \in \mathcal{E}$. In an undirected graph, the edge is an unordered set of nodes $\mathcal{E} = \{\mathcal{v}_i, \mathcal{v}_j\}$, where the order of $i, j$ does not matter. Typically, undirected graphs do not contain self connections $\{\mathcal{v}_i, \mathcal{v}_i\} \notin \mathcal{E}$.

- $\mathcal{G} = (\mathcal{V}, \mathcal{E})$
- $\mathcal{V} = \{\mathcal{v}_1, \mathcal{v}_2, \dots, \mathcal{v}_n\}$
- In directed graph: $\mathcal{E} \subseteq \mathcal{V} \times \mathcal{V}$
  - $\mathcal{V} \times \mathcal{V}$ implies Cartesian product
  - The edges $\mathcal{E}$ are a subset of any pair from elements from the nodes $\mathcal{V}$
- In undirected graph: $\mathcal{E} \subseteq \{\{\mathcal{v}_i, \mathcal{v}_j\} | \mathcal{v}_i, \mathcal{v}_j \in \mathcal{V}, \mathcal{v}_i \neq \mathcal{v}_j$
  - $\{\mathcal{v}_i, \mathcal{v}_j\}$ is an unordered set, so $\{\mathcal{v}_i, \mathcal{v}_j\} = \{\mathcal{v}_j, \mathcal{v}_i\}$
  - $\mathcal{v}_i \neq \mathcal{v}_j$ applies in most cases, but not for all cases
