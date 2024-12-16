---
author: Lam
date: 2024-12-15T20:44:47+01:00
title: Useful docker commands to manage containers
tags:
- tech
- docker
---

# 1. Container Lifecycle Management

## `docker run <image_name>`  

Runs a new container from an image. Use `-d` to run in detached mode and `--name` to specify a container name.  

Example:  
```bash
docker run -d --name my_container nginx
```

## `docker stop <container_name_or_id>`  

Stops a running container gracefully.  

Example:  
```bash
docker stop my_container
```

## `docker kill <container_name_or_id>`  

Forces a container to stop immediately.  

Example:  
```bash
docker kill my_container
```

## `docker start <container_name_or_id>`  

Starts a stopped container.  

Example:  
```bash
docker start my_container
```

## `docker restart <container_name_or_id>`  

Restarts a container.  

Example:  
```bash
docker restart my_container
```

## `docker rm <container_name_or_id>`  

Deletes a stopped container. Use `-f` to force-remove a running container.  

Example:  
```bash
docker rm my_container
docker rm -f my_running_container
```

---

# 2. Inspecting Containers

## `docker ps`  

Lists all running containers. Add `-a` to include stopped containers.  

Example:  
```bash
docker ps -a
```

## `docker inspect <container_name_or_id>`  

Shows detailed information about a container (environment variables, mounts, network settings, etc.).  

Example:  
```bash
docker inspect my_container
```

## `docker logs <container_name_or_id>`  

Fetches logs of a container. Use `-f` to follow logs in real-time and `--tail` to display the last few lines.  

Example:  
```bash
docker logs -f --tail 50 my_container
```

## `docker top <container_name_or_id>`  

Displays processes running inside the container.  

Example:  
```bash
docker top my_container
```

## `docker diff <container_name_or_id>`  

Shows changes made to the container’s filesystem (files added, modified, or deleted).  

Example:  
```bash
docker diff my_container
```

## `docker stats <container_name_or_id>`  

Displays real-time resource usage (CPU, memory, I/O) for the container.  

Example:  
```bash
docker stats my_container
```

---

# 3. Accessing a Running Container

## `docker exec -it <container_name_or_id> <command>`  

Runs a command inside a running container (e.g., a shell). Use `/bin/bash` or `/bin/sh` for interactive access.  

Example:  
```bash
docker exec -it my_container /bin/bash
```

## `docker attach <container_name_or_id>`  

Attaches to the container’s standard input, output, and error streams (not recommended for heavy-logging containers).  

Example:  
```bash
docker attach my_container
```

---

# 4. Copying Files

## `docker cp <host_path> <container_name_or_id>:<container_path>`  

Copies files from the host to the container.  

Example:  
```bash
docker cp ./config.json my_container:/app/config.json
```

## `docker cp <container_name_or_id>:<container_path> <host_path>`  

Copies files from the container to the host.  

Example:  
```bash
docker cp my_container:/var/log/app.log ./app.log
```

---

# 5. Networking

## `docker network inspect <network_name>`  

Displays detailed information about the container’s network connections.  

Example:  
```bash
docker network inspect bridge
```

## `docker exec -it <container_name_or_id> ping <target>`  

Tests network connectivity to other containers or external services.  

Example:  
```bash
docker exec -it my_container ping google.com
```

## `docker exec -it <container_name_or_id> curl <url>`  

Verifies HTTP/HTTPS connectivity or API responses from within the container.  

Example:  
```bash
docker exec -it my_container curl http://example.com
```

---

# 6. Debugging

## `docker inspect --format='{{.State.Pid}}' <container_name_or_id>`  

Retrieves the PID of the container process. You can use this with host debugging tools like `strace` or `gdb`.  

Example:  
```bash
docker inspect --format='{{.State.Pid}}' my_container
```

## `docker logs <container_name_or_id>`  

(Repeated here for emphasis) Useful for checking errors or application logs.  

Example:  
```bash
docker logs my_container
```

---

# 7. Monitoring and Cleanup

## `docker stats`  

Displays real-time performance stats for all running containers.  

Example:  
```bash
docker stats
```

## `docker system df`  

Shows disk usage by containers, images, volumes, and build cache.  

Example:  
```bash
docker system df
```

## `docker prune` commands  

Cleans up unused Docker resources:

- `docker container prune`: Removes stopped containers.
- `docker volume prune`: Removes unused volumes.
- `docker network prune`: Removes unused networks.
- `docker system prune`: Removes unused containers, images, networks, and volumes.  

Example:  
```bash
docker system prune -a
```

---

# 8. Container Export and Backup

## `docker export <container_name_or_id> > <file_name.tar>`  

Exports a container’s filesystem as a tar archive.  

Example:  
```bash
docker export my_container > my_container.tar
```

## `docker commit <container_name_or_id> <new_image_name>`  

Creates a new image from a container’s current state.  

Example:  
```bash
docker commit my_container my_image:v1
```

---

# Quick Reference Table

| Command                  | Purpose                                   |
|------------------------------|-----------------------------------------------|
| `docker ps`                  | List running containers                      |
| `docker logs`                | View container logs                          |
| `docker stats`               | Monitor container resource usage             |
| `docker inspect`             | Detailed container information               |
| `docker exec`                | Run commands inside a container              |
| `docker cp`                  | Copy files to/from a container               |
| `docker stop`                | Stop a running container                     |
| `docker restart`             | Restart a container                          |
| `docker rm`                  | Remove a container                           |
| `docker diff`                | View changes in container filesystem         |
