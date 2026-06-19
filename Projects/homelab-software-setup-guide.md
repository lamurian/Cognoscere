---
title: Homelab Software Setup Guide
description: Step-by-step guide to installing Docker, configuring services, and setting up paseo.sh and pi agent.
author: pi
editor: lam
date: 2026-06-16T10:40:48.646Z
tags:
  - homelab
  - docker
  - practical
  - tutorial
---
## Prerequisites

- Debian 12 installed per [Homelab Hardware Build Guide](homelab-hardware-build-guide.md)
- SSH access to the homelab

## Step 1: Install Docker

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
# Log out and back in for group change
```

## Step 2: Install Docker Compose

```bash
sudo apt update
sudo apt install docker-compose-plugin
docker compose version  # Verify
```

## Step 3: Optimise Idle Power

This drops idle power from ~10W to ~5W on the M720q.

```bash
sudo apt install powertop
sudo powertop --auto-tune

# Make permanent
sudo tee /etc/rc.local << 'EOF'
#!/usr/bin/env bash
powertop --auto-tune
exit 0
EOF
sudo chmod +x /etc/rc.local
```

## Step 4: Create Docker Directory Structure

```bash
mkdir -p ~/docker/{vaultwarden,immich,paperless-ngx,searxng,obscura,nginx-proxy-manager,monitoring}
```

## Step 5: Install Portainer (Web UI for Docker)

```bash
docker volume create portainer_data
docker run -d -p 8000:8000 -p 9443:9443 \
  --name portainer --restart=always \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce:latest
```

Access at `https://homelab-ip:9443`

## Step 6: Install paseo.sh Daemon

```bash
# Follow paseo.sh official install guide
curl -sSL https://get.paseo.sh | bash
# or via git
# git clone https://github.com/your-org/paseo ~/paseo
```

## Step 7: Install Pi Agent

```bash
npm install -g pi-coding-agent
# or follow the pi agent install docs for your platform
```

## Step 8: Set Up Automatic Security Updates

```bash
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
# Enable automatic reboots for kernel updates if desired
```

## Step 9: Install Monitoring

```bash
docker run -d -p 3001:3001 \
  --name uptime-kuma --restart=always \
  -v uptime-kuma:/app/data \
  louislam/uptime-kuma:latest
```

Access at `http://homelab-ip:3001`

Next step: configure Tailscale for remote access in [Homelab Tailscale Configuration](homelab-tailscale-configuration.md).

## Relevant notes

- [Homelab Hardware Build Guide](homelab-hardware-build-guide.md)
- [Homelab Tailscale Configuration](homelab-tailscale-configuration.md)
- [Low-Power Solar Homelab: Executive Summary](../Resources/low-power-solar-homelab-executive-summary.md)
- [Homelab Solar System Build Guide](homelab-solar-system-build-guide.md)
- [Homelab: System Overview](homelab-system-overview.md)