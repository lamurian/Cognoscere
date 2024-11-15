---
author: Lam
date: 2024-10-30T08:13:11+01:00
title: Read Zettelkasten link using Python
source:
  - https://chatgpt.com/share/6721dbbb-b510-8006-8432-cb6b532d4540
tags:
  - note-taking
---

# Introduction

To automate the process of extracting links between notes and generating `network.json`, we can create a Python script that scans all markdown files in a specified directory, identifies links, and outputs a JSON file that represents the note network. Here’s how you can set it up:

# Steps for the Python Script

1. **Parse Markdown Files**: The script will scan each markdown file for any links (e.g., `[[20231028-note-title]]`).
2. **Extract Links and Build Relationships**: For each note, extract the links within it, record relationships between notes, and store them as nodes and edges.
3. **Generate the Network JSON**: After processing all files, the script will output a `network.json` file containing the nodes (notes) and edges (links between notes).

# Code: Python Script to Generate `network.json`

Here’s a Python script to achieve this:

```python
import os
import re
import json

# Directory containing your markdown notes
notes_directory = './content/notes'  # Update this path to match your notes location

# Regular expression to match internal Zettelkasten links [[note-id]]
link_pattern = re.compile(r'\[\[([^\]]+)\]\]')

def extract_links(file_path):
    """
    Extracts all unique links (references) from a markdown file.
    """
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
        # Find all matches for the link pattern
        links = link_pattern.findall(content)
    return set(links)  # Use a set to ensure unique links

def generate_network_data(notes_directory):
    """
    Scans the notes directory, extracts links, and builds the network data.
    """
    nodes = []
    edges = []
    node_map = {}  # Dictionary to keep track of nodes with their ids

    # Loop over all markdown files in the directory
    for filename in os.listdir(notes_directory):
        if filename.endswith('.md'):
            note_id = filename.replace('.md', '')
            file_path = os.path.join(notes_directory, filename)

            # Add the current note as a node
            if note_id not in node_map:
                node = {"id": note_id, "label": note_id}
                nodes.append(node)
                node_map[note_id] = node

            # Extract links (references) from the current note
            links = extract_links(file_path)

            # Create edges for each link
            for link in links:
                # Add linked note as a node if not already added
                if link not in node_map:
                    linked_node = {"id": link, "label": link}
                    nodes.append(linked_node)
                    node_map[link] = linked_node

                # Create an edge between the current note and the linked note
                edges.append({"source": note_id, "target": link})

    return {"nodes": nodes, "edges": edges}

def save_network_json(data, output_file='network.json'):
    """
    Saves the network data as a JSON file.
    """
    with open(output_file, 'w', encoding='utf-8') as file:
        json.dump(data, file, indent=2)
    print(f"Network data saved to {output_file}")

# Generate network data and save it to network.json
network_data = generate_network_data(notes_directory)
save_network_json(network_data)
```

# Explanation of Each Step

1. **Extract Links with Regex**:
   - We define a regular expression (`\[\[([^\]]+)\]\]`) to find links in the format `[[note-id]]`.
   - The `extract_links()` function uses this pattern to find all unique links within a given markdown file.

2. **Generate Network Data**:
   - The `generate_network_data()` function iterates over all markdown files in the specified directory.
   - For each file:
     - The note’s identifier (filename without `.md`) is used as the node ID.
     - The script checks for any links within the file, adding each referenced note as a node if it hasn’t already been added.
     - For each link, an edge is created from the current note to the referenced note.

3. **Save JSON Output**:
   - Finally, `save_network_json()` writes the `nodes` and `edges` data to `network.json`, formatted as:
     ```json
     {
       "nodes": [
         {"id": "20231028-note-title", "label": "20231028-note-title"},
         {"id": "20231029-other-note", "label": "20231029-other-note"}
       ],
       "edges": [
         {"source": "20231028-note-title", "target": "20231029-other-note"}
       ]
     }
     ```

# Running the Script

1. Save this script in the root of your Hugo project or wherever convenient.
2. Make sure your markdown notes are in `./content/notes` (or update the path in `notes_directory`).
3. Run the script:
   ```bash
   python generate_network.py
   ```
4. It will create `network.json` in the current directory, containing your notes network.

# Automating the Process

If you want `network.json` to update automatically each time you build your Hugo site, you can add this script to your build pipeline (e.g., as a `prebuild` or `predeploy` script if you’re using npm). Alternatively, include this step in a `Makefile` to regenerate `network.json` before running `hugo`.

# Summary

This script efficiently builds `network.json` by automating link extraction from markdown files, allowing you to visualize your Zettelkasten network without manual entry.
