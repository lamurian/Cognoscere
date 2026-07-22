---
title: Exporting a Single GGUF Model from Fine-Tuned Checkpoints
description: Pipeline for merging LoRA adapters or model components into one unified GGUF file using mergekit and llama.cpp for production deployment
author: pi
editor: lam
date: 2026-07-21T23:38:23.039Z
tags:
  - small-language-model
  - training
  - deployment
  - gguf
  - quantization
  - llama.cpp
---
## Summary

To deploy a fine-tuned model as a single GGUF file, you need a three-stage pipeline: merge adapters into base weights, convert to GGUF, then quantize. This works whether you fine-tuned with LoRA (PEFT), full-parameter training, or merged multiple task-specific checkpoints via model merging.

**Stage 1: Merge adapters or model components.** If you fine-tuned with LoRA, the adapter weights must be merged into the base model before GGUF conversion — the converter expects full weights, not deltas [@mark2025]. Use PEFT's `merge_and_unload()` to collapse LoRA A/B matrices into base weights. If you trained separate checkpoints for NER and ECL generation, use mergekit to combine them via task arithmetic, TIES, or SCE merging methods [@kytx2025]. Mergekit takes a YAML config specifying base model, merge method, and model weights, then outputs a merged Safetensors model.

**Stage 2: Convert to GGUF.** llama.cpp's `convert_hf_to_gguf.py` transforms the merged HuggingFace model into GGUF format [@gerganov2025]. Always convert to F16 first (no quantization at this stage), then quantize in a separate step. This preserves a high-precision intermediate that quantizers need. Common pitfalls: missing `rope_scaling` fields in config.json (patch with `null`) and custom architectures requiring updated llama.cpp [@mark2025].

**Stage 3: Quantize.** The `llama-quantize` tool applies lossy compression. For an 8B model: Q4_K_M (~4.7GB, best default), Q5_K_M (~5.7GB, higher quality), Q8_0 (~8.5GB, near-lossless). K-quant methods (`_K_M`) keep attention and output layers at higher precision than the rest. A perplexity check against the F16 baseline should show less than 1.5 point increase. For your 40GB RAM system, a Q4_K_M quantized 1-3B model will run comfortably on CPU.

**Multi-task training directly into one model.** Rather than merging separate models, the cleaner approach is training a single seq2seq or causal LM on combined instruction data covering both SNOMED CT concept extraction and ECL generation. Format: `Input: clinical note -> Output: [concept IDs] [ECL expression]`. This avoids merge complexity entirely and produces a single HF checkpoint ready for GGUF conversion [@anisuzzaman2025].

## Key Points

- LoRA adapters must be merged into base before GGUF conversion using PEFT's `merge_and_unload()`
- Mergekit combines multiple fine-tuned checkpoints into one model via TIES/SCE methods
- GGUF pipeline: merged Safetensors -> convert_hf_to_gguf.py (F16) -> llama-quantize (Q4_K_M)
- For 1-3B models on CPU, Q4_K_M gives ~600MB-1.5GB files with minimal quality loss
- Simpler approach: train one multi-task seq2seq model instead of merging separate components
- Always verify with perplexity check against F16 baseline (<1.5 point delta)

## Sources

- [Step-by-Step Model Merging and GGUF imatrix Quantization](https://k4yt3x.com/step-by-step-model-merging-and-gguf-imatrix-quantization/)
- [Convert Fine-Tuned Models to GGUF: llama.cpp Workflow 2026](https://markaicode.com/gguf-quantization-after-fine-tuning-llama-cpp/)
- [llama.cpp: LLM inference in C/C++](https://github.com/ggml-org/llama.cpp)
- [Fine-Tuning Large Language Models for Specialized Use Cases](https://pmc.ncbi.nlm.nih.gov/articles/PMC11976015/)

## Relevant notes

- [Deploying GGUF Models via Go REST API](Resources/deploying-gguf-models-via-go-rest-api.md)
- [MiniCPM5-1B: Edge Deployment Applications](Resources/minicpm5-1b-edge-deployment-applications.md)
- [Memory Management and Optimization for CPU-Only Fine-Tuning of Small Language Models](Resources/memory-management-and-optimization-for-cpu-only-fine-tuning-of-small-language-models.md)
- [CPU-Feasible Architectures for Medical NLP: DistilBERT, MiniLM, and Bi-GRU](Resources/cpu-feasible-architectures-for-medical-nlp-distilbert-minilm-and-bi-gru.md)
- [Executive Summary: MiniCPM5-1B Performance and SLM State of the Art](Resources/executive-summary-minicpm5-1b-performance-and-slm-state-of-the-art.md)