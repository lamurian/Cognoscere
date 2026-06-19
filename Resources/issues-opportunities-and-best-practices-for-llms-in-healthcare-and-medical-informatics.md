---
title: Issues, Opportunities, and Best Practices for LLMs in Healthcare and Medical Informatics
description: Synthesised overview of issues, opportunities, and best practices for leveraging LLMs at the intersection of healthcare and software engineering.
author: pi
editor: lam
date: 2026-06-19T23:00:38.370Z
tags:
  - LLM
  - healthcare
  - software-engineering
  - medical-informatics
  - digital-health
  - AI
  - guardrails
  - policy
  - research
---

Synthesising the evidence across all research questions reveals a coherent picture of the current landscape.

## Key Issues (Ongoing and Impending)

1. **Hallucination in clinical context.** The single greatest barrier to clinical deployment. Even low hallucination rates are unacceptable when outputs inform patient care. RAG reduces but does not eliminate this risk.
2. **Regulatory vacuum.** No regulatory framework adequately addresses non-deterministic AI in medical devices. This creates liability uncertainty and slows adoption.
3. **Bias amplification.** LLMs risk entrenching existing healthcare disparities if deployed without fairness guarantees. Current bias mitigation techniques are insufficient for clinical contexts.
4. **Privacy architecture.** Traditional cloud-based LLM APIs conflict with healthcare data protection requirements. Private/local deployments are emerging but increase costs.
5. **Professional deskilling.** As clinicians and developers rely on LLM outputs, critical reasoning skills may atrophy, reducing ability to detect errors.
6. **Evaluation gap.** Benchmarks do not translate to clinical safety. Rigorous prospective validation in real clinical workflows remains rare.
7. **Data poisoning.** Medical LLMs trained on open-web data are vulnerable to adversarial contamination with false medical knowledge.

## Key Opportunities

1. **Clinical workflow automation.** LLMs can reduce documentation burden, generate clinical summaries, and automate prior authorisation — freeing clinicians for direct patient care.
2. **Democratised medical knowledge.** Multilingual LLMs can make medical expertise accessible in low-resource settings and underserved languages.
3. **Accelerated health IT development.** LLM-assisted software engineering can reduce the time from clinical need to deployed digital health solution, while generating compliance documentation automatically.
4. **Personalised patient engagement.** LLM chatbots that understand individual patient context can improve medication adherence, self-management of chronic conditions, and mental health support.
5. **Evidence synthesis at scale.** LLMs can accelerate systematic reviews and meta-analyses, keeping clinical guidelines current with rapidly expanding literature.
6. **Multi-agent clinical teams.** Orchestrated LLM agents for triage, diagnosis support, and follow-up could improve care coordination and reduce clinician cognitive load.

## Best Approaches to Leverage LLMs

**Architectural.** Prefer RAG over fine-tuning for most clinical applications — it provides traceability, updateability, and lower hallucination rates. Use fine-tuned smaller models for specific high-frequency tasks (e.g., ICD coding, FHIR translation). Implement multi-agent patterns for complex workflows with human oversight at decision points.

**Engineering.** Maintain human-in-the-loop for all clinical decisions. Implement confidence scoring and automatic escalation. Require explainability for every LLM-generated recommendation. Use traditional testing methods (compiler verification, metamorphic testing) alongside LLM-generated tests for health IT code.

**Organisational.** Invest in AI literacy training for clinicians and health IT developers. Establish interdisciplinary teams including clinicians, data scientists, ethicists, and regulatory specialists. Create internal validation pipelines that mirror clinical trial methodology.

**Regulatory.** Adopt TRIPOD-LLM reporting standards proactively. Design for post-market surveillance from day one. Build privacy-preserving architectures (on-device inference, differential privacy) regardless of current regulatory certainty.

**Research priorities.** Develop causal reasoning benchmarks for medical LLMs. Conduct large-scale RCTs of LLM-assisted vs. conventional care. Create standardised adversarial testing suites for medical LLMs. Investigate long-term effects of LLM use on clinical skill retention.