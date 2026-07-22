---
title: Data Preparation for SNOMED CT ECL Mapping from Free-Text Medical Records
description: How to prepare training data for a model that maps free-text clinical notes to SNOMED CT Expression Constraint Language (ECL)
author: pi
editor: lam
date: 2026-07-21T23:21:57.401Z
tags:
  - SNOMED-CT
  - clinical-NLP
  - training
  - data-preparation
  - ECL
  - NER
---
## Summary

Mapping free-text medical records to SNOMED CT Expression Constraint Language (ECL) requires two-stage data preparation: first, concept extraction (NER linking text spans to SNOMED CT concept IDs), then ECL generation (assembling concepts with refinement operators into valid ECL syntax). Each stage needs different training data formats.

**Stage 1: NER training data for SNOMED CT concept recognition.** The standard format is IOB (Inside-Outside-Beginning) tagging on clinical texts. Noori et al. achieved 90% F1 using MIMIC-IV discharge summaries segmented into overlapping 19-token chunks with contextual, syntactic, and morphological features [@noori2025]. For training, prepare: (a) clinical notes annotated with SNOMED CT concept IDs; (b) each concept span labelled with IOB tags; (c) overlapping chunks to handle boundary ambiguity. Public sources: MIMIC-III/IV (requires CITI training), n2c2 datasets, and SNOMED CT RF2 release data via Snowstorm API [@liu2025].

**Stage 2: ECL generation training data.** ECL is a formal query language with well-defined ABNF grammar (available in the IHTSDO/snomed-expression-constraint-language repository). To train a seq2seq model for NL-to-ECL: create paired examples of (free-text description, ECL expression). Example: "medications containing paracetamol" maps to `<< 763158003 |Medicinal product| : 127489000 |Has active ingredient| = << 387517004 |Paracetamol|`. The ABC of ECL tutorial provides 15+ query templates. The ECLed tool (2025) uses a structured approach to compose valid ECL [@zhu2025].

**SNOMED CT RF2 preprocessing.** The RF2 release contains over 300,000 concepts with descriptions, relationships, and hierarchies. Liu et al. processed this via Snowstorm API with concurrent parsing and batch committing, extracting 58 core diagnostic concept types and 1,194 relationship types for their knowledge graph [@liu2025]. For ECL training, you need: concept IDs, fully specified names (FSN), preferred terms, and is-a relationships.

## Key Points

- Two-stage pipeline: NER (concept IDs) -> ECL generation (syntactic assembly)
- NER training uses IOB-tagged clinical texts; MIMIC-IV provides de-identified records
- ECL generation uses paired (NL description, ECL expression) training examples
- ECL formal grammar is specified in ANTLR (ECL.g4) and ABNF in the IHTSDO repository
- SNOMED CT RF2 data (300K+ concepts) processed via Snowstorm API for ontology context
- ABC of ECL provides 15+ ready-to-use query templates for training data

## Sources

- [Bi-GRU Achieves 90% F1 for SNOMED CT Concept Annotation](Resources/bi-gru-achieves-90-f1-for-snomed-ct-concept-annotation.md)
- [SNOMED CT Knowledge Graph Construction Pipeline](Resources/snomed-ct-knowledge-graph-construction-pipeline.md)
- [OntoTune Aligns LLMs with SNOMED CT Ontology via Self-Training](Resources/ontotune-aligns-llms-with-snomed-ct-ontology-via-self-training.md)
- [Hyperbolic Embeddings for SNOMED CT Hierarchical Retrieval](Resources/hyperbolic-embeddings-for-snomed-ct-hierarchical-retrieval.md)

## Relevant notes

- [CPU-Feasible Architectures for Medical NLP: DistilBERT, MiniLM, and Bi-GRU](Resources/cpu-feasible-architectures-for-medical-nlp-distilbert-minilm-and-bi-gru.md)
- [Executive Summary: SLMs for SNOMED CT Knowledge Graphs and Clinical NER](Resources/executive-summary-slms-for-snomed-ct-knowledge-graphs-and-clinical-ner.md)
- [SNOMED CT Knowledge Graph Construction Pipeline](Resources/snomed-ct-knowledge-graph-construction-pipeline.md)
- [Bi-GRU Achieves 90% F1 for SNOMED CT Concept Annotation](Resources/bi-gru-achieves-90-f1-for-snomed-ct-concept-annotation.md)
- [OntoTune Aligns LLMs with SNOMED CT Ontology via Self-Training](Resources/ontotune-aligns-llms-with-snomed-ct-ontology-via-self-training.md)