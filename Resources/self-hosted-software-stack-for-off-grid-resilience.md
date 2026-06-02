---
title: Self-Hosted Software Stack for Off-Grid Resilience
description: 'Essential software services for off-grid digital sovereignty: search, passwords, home automation, monitoring, and communication'
author: pi
editor: lam
date: 2026-06-02T20:11:55.381Z
tags:
  - self-hosting
  - software
  - technology
  - infrastructure
  - privacy
---
When living off-grid, every self-hosted service must work without internet connectivity or cloud dependencies. This note lists essential software for digital sovereignty, privacy, and survival.

## Core Services

**Vaultwarden**
Password manager (Rust implementation of Bitwarden). Syncs across all devices. Keeps credentials for banking, government services, and online accounts offline and encrypted. Works entirely on LAN. Cost: free (Docker, 128MB RAM). [^1]

**SearXNG**
Privacy-respecting metasearch engine. Queries Google, DuckDuckGo, Bing, and others without sending your IP or tracking cookies. Runs on LAN only. Cost: free (Docker, 256MB RAM). [^2]

**Home Assistant**
Central smart home controller. Integrates over 2,000 devices: lights, switches, sensors, cameras, climate. Automates garden watering, emergency alerts (smoke, flood, intrusion). Uses MQTT for ESP32/ESP8266 sensor communication. Voice via Wyoming protocol (local, no cloud). Cost: free (Docker or HAOS, 512MB-1GB RAM). [^3]

**ESPHome**
Firmware tool for ESP32/ESP8266 microcontrollers. Write YAML once, flash over WiFi. Sensors (temperature, humidity, soil moisture, light), relays (garden valves, lights), and displays report to Home Assistant via native API. No cloud vendor lock-in. Cost: free. Device cost: $3-8 per ESP32. [^4]

**Mosquitto MQTT Broker**
Lightweight message broker connecting all IoT devices. Every sensor publishes data to topics; Home Assistant subscribes. Very low bandwidth, works on LoRa/Zigbee bridges to MQTT. Cost: free (Docker, 32MB RAM).

**Tailscale**
Mesh VPN connecting all devices securely. Zero-config: install on server, phone, laptop. Access homelab from anywhere without port forwarding. Free for up to 3 users / 100 devices. Cost: free (Docker, 64MB RAM). [^5]

## Communication and File Sync

**Syncthing**
Decentralized file synchronization between devices. Works entirely on LAN; no cloud server needed. Syncs documents, photos, offline maps (Organic Maps). Every device keeps a full copy; data never hosted on a third party. Cost: free (Docker, 128MB RAM). [^6]

**Gitea**
Lightweight self-hosted Git service. Version-control all configuration files (Docker Compose, Ansible, Home Assistant YAML, ESPHome configs). If the server dies, clone the repo to a new machine and restore within an hour. Cost: free (Docker, 256MB RAM). [^7]

## Monitoring and Alerts

**Grafana + Prometheus** (or **Netdata**)
Monitor system health, disk usage, temperature, solar charge level, battery voltage, network traffic. Alerts via Telegram Bot or email. Monitoring the solar system is critical: know when battery is low to shed non-essential loads. Cost: free (Docker, 256MB + 128MB RAM).

**Uptime Kuma**
Ping monitors for all services. Sends push notifications to phone (Gotify) when a container goes down. Cost: free (Docker, 64MB RAM).

## Essential Utilities

- **Pi-hole** or **AdGuard Home**: DNS-level ad blocking, reduces bandwidth, speeds up browsing.
- **Nginx Proxy Manager**: Reverse proxy with SSL for all web services.
- **Docker Compose** with Watchtower: Automated updates. Disable during monsoon; update manually during sunny days.
- **Gotify**: Self-hosted push notifications. Replaces Telegram for off-grid alerts.

## Off-Grid Design Principles

- Run all services as Docker containers for easy migration and resource limits.
- Use Alpine Linux as base OS (Proxmox or Debian minimal). Alpine uses 50-100MB RAM at idle.
- Set container CPU/memory limits to prevent overload during low-battery scenarios.
- Use **Authelia** or OAuth2 Proxy for single sign-on with 2FA.
- Keep a local DNS forwarder (Unbound) for DNS resolution even when upstream internet is down.
- Pin Docker image versions during rainy season; do not auto-update when solar generation is low.

## How It Builds a Sustainable Ecosystem

Every service above runs on a single $80 mini PC at under 20W. Together they replace a dozen cloud subscriptions (Google Workspace, Dropbox, LastPass, DuckDuckGo, Telegram) and the associated data extraction. In an off-grid context, these tools provide functional internet independence: you can search, communicate, control your home, and manage your data without ever touching a cloud server.

[^1]: Vaultwarden — github.com/dani-garcia/vaultwarden
[^2]: SearXNG — docs.searxng.org
[^3]: Home Assistant — home-assistant.io
[^4]: ESPHome — esphome.io
[^5]: Tailscale — tailscale.com
[^6]: Syncthing — syncthing.net
[^7]: Gitea — gitea.io

## Relevant notes

- [[budget-digital-homelab-for-sustainable-living]]
- [[global-trajectories-and-current-impact-of-solarpunk]]
- [[solarpunk-in-the-european-union]]
- [[major-nationwide-programs-soeharto-vs-prabowo-indonesia]]
- [[grid-integration-of-renewables]]