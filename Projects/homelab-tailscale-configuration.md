---
title: Homelab Tailscale Configuration
description: Step-by-step guide to setting up Tailscale for SSH access and secure service exposure to the homelab.
author: pi
editor: lam
date: 2026-06-16T10:40:48.647Z
tags:
  - homelab
  - tailscale
  - security
  - practical
  - tutorial
---
## Step 1: Install Tailscale on the Homelab

```bash
curl -fsSL https://tailscale.com/install.sh | sudo sh
sudo tailscale up
```

Follow the browser link to authenticate with your Tailscale account. The homelab will appear in your tailnet with a 100.x.x.x IP address.

## Step 2: Verify Connection

```bash
tailscale status
# You should see your homelab listed
```

## Step 3: SSH via Tailscale (From Your Laptop)

```bash
# From any device with Tailscale running
ssh user@homelab-tailscale-ip
# Or use MagicDNS (if enabled):
ssh user@homelab
```

## Step 4: Enable Tailscale SSH (Optional)

Tailscale can manage SSH keys so you don't need to distribute keys manually:

```bash
sudo tailscale up --ssh
```

Now SSH from any device in your tailnet without pre-configuring keys. Only devices in your tailnet can connect.

## Step 5: Expose Docker Web UIs via Tailscale Serve

Access Portainer, Immich, and other services through Tailscale rather than exposing ports publicly:

```bash
# Serve portainer on the tailnet
sudo tailscale serve --bg --https 9443 localhost:9443
# Serve another service
sudo tailscale serve --bg --https 9444 localhost:8080
```

Access each service at `https://homelab:PORT` from any device in your tailnet.

## Step 6: Lock Down the Homelab

Since all access goes through Tailscale, close public-facing attack surface:

```bash
# Disable password SSH auth
sudo sed -i 's/^#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo systemctl restart sshd

# Basic firewall — allow only Tailscale
sudo apt install ufw
sudo ufw default deny incoming
sudo ufw allow in on tailscale0
sudo ufw --force enable
```

Now only Tailscale peer traffic can reach the homelab. The machine is invisible from the public internet.

## Next Steps

Your homelab is now accessible from anywhere via SSH. Proceed to [Homelab Solar System Build Guide](homelab-solar-system-build-guide.md) to set up the solar power system, or start deploying your Docker services.

## Relevant notes

- [Homelab Software Setup Guide](homelab-software-setup-guide.md)
- [Low-Power Solar Homelab: Executive Summary](../Resources/low-power-solar-homelab-executive-summary.md)
- [Homelab: System Overview](homelab-system-overview.md)
- [Homelab Hardware Build Guide](homelab-hardware-build-guide.md)
- [Homelab Solar System Build Guide](homelab-solar-system-build-guide.md)