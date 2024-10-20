---
author: Lam
date: 2024-10-20T20:47:10+02:00
title: Zettelkasten with fzf and vim
source: https://chatgpt.com/share/6715531d-7dbc-8006-bb37-7baebf276142
tags:
- command line
---

Starting a Zettelkasten using Vim and FZF (Fuzzy Finder) can be an incredibly powerful and lightweight workflow. The goal is to minimize Vim-specific functions and let external scripts handle the bulk of the Zettelkasten management tasks. In this article, we'll explore how the Zettelkasten note-taking approach is implemented using the script provided, breaking down each section of the code to explain its functionality and how it ties together.

# Overview of the Script

This script implements a simplified version of the Zettelkasten note-taking system using FZF, a fuzzy finder for the command line. The Zettelkasten method involves creating atomic, interconnected notes, which can later be retrieved, searched, and linked. The script allows the user to create new notes, search for existing notes, and organize them into broad categories such as Projects, Areas, Resources, and Archives (based on the PARA method).

Let's break down each part of the script.

---

# 1. **Initialization and Variables**

```sh
PARA="Projects Areas Resources Archives"
DOCS=$([ -z $DOCS ] && echo "~/Documents" || echo "$DOCS")
ROOT=$([ -z $2 ] && echo $DOCS/Cognoscere || echo $2)
PROGNAME=$0
```

Here, four key paths are defined:
- `PARA` refers to broad organizational categories, aligned with the PARA method (Projects, Areas, Resources, Archives).
- `DOCS` defines the default document directory (`~/Documents`). It checks if a `DOCS` environment variable exists; if not, it defaults to `~/Documents`.
- `ROOT` sets the root directory for the notes, defaulting to `~/Documents/Cognoscere` or the second argument passed to the script.
- `PROGNAME` stores the name of the script, used later in the `usage` function.

---

# 2. **Helper Function: Usage**

```sh
usage() {
    cat << EOF >&2
Usage: $PROGNAME [-h] [-n] [-f <dir>] [-s <string>]
-h: Print this help text
-n: Create a new note
-f: Fuzzy find notes from a specified directory, will search ~/Documents by default and if not found will issue '$PROGNAME -n'
-s: Search for tags within notes using the silver searcher (ag)
EOF
    exit 1
}
```

The `usage` function displays a simple help message when the user invokes the script with the `-h` option or uses invalid options. It explains how the script can be used with various command-line flags:
- `-n` for creating a new note,
- `-f` for finding notes using fuzzy search,
- `-s` for searching tags within the notes using `ag` (the silver searcher).

---

# 3. **Set Path for the New Note**

```sh
set_name() {
    TYPE=$(for menu in $PARA; do echo $menu; done | fzf --height=10)

    read -p "Insert topic: " TOPIC
    DATE=$(date +%F)
    TOPIC=$([ -z $TOPIC ] && echo $DATE || echo $TOPIC)
    TITLE=$(echo $TOPIC | sed "s/./\U&/")
    FNAME=$(echo $TOPIC | sed "s/\s/-/g").md

    FPATH=$ROOT/$TYPE/$FNAME
    echo $FPATH
}
```

The `set_name` function constructs a path and name for a new note. Key steps:
1. **Choose a category**: The script uses `fzf` to present a list of categories (`PARA`), allowing the user to select one.
2. **Set the topic**: The user inputs a note topic, which defaults to the current date if left empty.
3. **Format the topic**: The topic is capitalized, and spaces are replaced with hyphens to form a valid filename.
4. **File path**: The path is constructed using the root directory, chosen category, and formatted file name.

This ensures that notes are placed in the correct category folder and given a descriptive name.

---

# 4. **YAML Header and Addendum Functions**

```sh
set_yaml() {
    cat << EOF
---
author: $(whoami | sed "s/./\U&/")
date: $(date +%FT%T%:z)
title: $TITLE
---

EOF
}

set_addendum() {
    cat << EOF

# Addendum by $(whoami | sed "s/./\U&/") on $(date)

EOF
}
```

- **`set_yaml`**: This function generates a YAML front matter, commonly used in markdown-based systems like Jekyll or Hugo. It includes the author’s name, current date, and the title of the note.
- **`set_addendum`**: If the note already exists, this function appends an "addendum" section to the existing note, marking when and by whom additional content was added.

These functions help maintain structure in your notes and record when updates occur.

---

# 5. **Creating a New Note**

```sh
new_note() {
    set_name
    echo "Accessing $ROOT/$TYPE and creating $FNAME"
    [ ! -f $FPATH ] && set_yaml > $FPATH || set_addendum >> $FPATH
}
```

- This function calls `set_name` to determine where the note should be created and its file name.
- It then checks whether the note already exists:
  - If not, it creates a new file with the YAML header.
  - If it does exist, it appends the addendum.

---

# 6. **Fetch Note Path and Name**

```sh
fetch_note_path() {
    NOTE=$(find $ROOT -iname "*md" -type f | fzf)
    echo $NOTE
}

fetch_note_name() {
    NOTE=$(fetch_note_path)
    FNAME=$(echo $NOTE | sed "s/.*\///g")
    echo $FNAME
}
```

These two functions help in locating and retrieving notes:
- **`fetch_note_path`**: Uses the `find` command to search for markdown files (`*.md`) under the root directory and presents them via `fzf` for selection.
- **`fetch_note_name`**: Strips the full path from the note returned by `fetch_note_path` to display just the file name.

---

# 7. **Finding or Creating Notes**

```sh
find_note() {
    NOTE=$(fetch_note_path)
    echo $NOTE
    if [ -z "$NOTE" ]; then
        set_name
        NOTE="$FPATH"
        set_yaml > "$NOTE"
    fi
    $EDITOR "$NOTE"
}
```

- **`find_note`**: First tries to locate an existing note using `fetch_note_path`. If none is found, it prompts the user to create a new note using `set_name` and `set_yaml`.
- The `$EDITOR` environment variable is used to open the note for editing, defaulting to the user's preferred text editor.

---

# 8. **Search for Tags**

```sh
search_tag() {
    echo "Searching for tags"
}
```

This placeholder function is where future functionality could be added to search for tags within notes using `ag`, a powerful code searching tool.

---

# 9. **Command-line Parsing and Default Behavior**

```sh
while getopts ":hnfs:" arg; do
    case $arg in
        h) usage ;;
        n) new_note ;;
        f) find_note ;;
        s) search_tag ;;
        *) usage ;;
    esac
done

if [ $OPTIND -eq 1 ]; then
    find_note
fi
```

The script uses `getopts` to handle command-line options:
- `-h` prints the help text.
- `-n` triggers the creation of a new note.
- `-f` triggers note searching.
- `-s` is meant for searching tags.

If no arguments are passed, the script defaults to calling `find_note`.

---

# Conclusion
This script efficiently implements a Zettelkasten-style note-taking system, with the ability to create, organize, and search notes. Its modularity, reliance on simple command-line tools like `fzf`, and the PARA organization method make it highly adaptable. Whether you're creating new notes or searching for existing ones, this script offers a minimalistic yet powerful workflow for personal knowledge management.
