---
title: 'How SSH Works: Protocol, Key Exchange, and Authentication'
description: How the SSH protocol works — transport layer key exchange, symmetric encryption, host verification, and user authentication (password vs public key).
author: pi
editor: lam
date: 2026-06-05T21:23:04.064Z
tags:
  - security
  - authentication
  - network
  - infrastructure
  - fundamental
---

## Summary

SSH (Secure Shell) is a protocol for securely connecting to remote servers over an untrusted network. It uses a three-layer architecture: the Transport Layer handles key exchange, server authentication, and encryption; the User Authentication Layer verifies the client's identity; and the Connection Layer multiplexes multiple channels (terminal sessions, port forwards, file transfers) over a single encrypted connection [@ylonen2006a; @ylonen2006].

An SSH session is established in two stages. First, the client and server negotiate encryption keys using a Diffie-Hellman key exchange, producing a shared symmetric session key that encrypts all further traffic. Second, the client authenticates — either with a password (sent over the encrypted channel) or with a public-key challenge-response [@ellingwood2022].

## Transport Layer: Key Exchange and Encryption

The transport layer begins with a TCP handshake, followed by a version string exchange (overwhelmingly SSH 2.0 today, which fixed flaws in SSH 1.x such as weak CRC-32 integrity checks and lack of channel multiplexing) [@ylonen2006; @jones2022].

The client and server each send a `SSH_MSG_KEX_INIT` message listing supported cryptographic primitives — key exchange algorithms (e.g., ECDH, Diffie-Hellman), symmetric ciphers (e.g., ChaCha20-Poly1305, AES-256-GCM), message authentication codes (MACs), and host key algorithms. The highest-priority mutually supported option is selected for each [@jones2022].

In the key exchange, the client generates an ephemeral key pair and sends its public key (`SSH_MSG_KEX_ECDH_INIT`). The server generates its own ephemeral key pair, computes the shared secret `K` using the client's public key and its own private key, and derives an exchange hash `H`. The server signs `H` with its permanent host private key and sends its ephemeral public key, host public key, and signature back (`SSH_MSG_KEX_ECDH_REPLY`). The client computes `K` and `H` independently, then verifies the server's signature against its known_hosts database to prevent man-in-the-middle attacks [@jones2022; @ylonen2006].

From `K` and `H`, both sides derive six keys: two encryption keys (client-to-server and server-to-client), two initialization vectors, and two integrity keys. After exchanging `SSH_MSG_NEWKEYS`, all subsequent data is encrypted with the negotiated symmetric cipher and authenticated with the selected MAC [@jones2022]. Ephemeral key pairs provide **perfect forward secrecy** — even if a long-term host key is later compromised, past sessions cannot be decrypted [@jones2022].

## User Authentication

Once encryption is active, the client authenticates. In **password authentication**, the password is sent over the encrypted tunnel — safe from eavesdropping, but still vulnerable to brute-force attacks on weak passwords [@ellingwood2022].

In **public-key authentication**, the client sends a key ID. The server looks up the corresponding public key in `~/.ssh/authorized_keys`, generates a random number, encrypts it with that public key, and sends it to the client. The client decrypts it with its private key, combines the result with the session key, computes an MD5 hash, and returns it. The server independently computes the same hash — a match proves the client holds the private key without ever transmitting it [@ellingwood2022].

## Sources
- [@ylonen2006a] — SSH protocol architecture (RFC 4251)
- [@ylonen2006] — SSH transport layer protocol (RFC 4253)
- [@ellingwood2022] — SSH encryption and connection process explained
- [@jones2022] — SSH handshake steps (ECDH, forward secrecy, key derivation)

## Relevant notes
- [[digital-homelab-hardening-core-security-practices]] — practical SSH hardening on top of the protocol
- [[network-infrastructure-for-budget-homelab]] — network layer SSH depends on
- [[supertokens-open-source-authentication-architecture]] — authentication challenge-response in a different domain
- [[home-wi-fi-security-what-actually-works]] — network security at a complementary layer
- [[self-hosted-software-stack-for-off-grid-resilience]] — self-hosting context where SSH is a core tool