#!/bin/bash

# Find all folders in the current directory
folders=$(find . -type d)

# Loop through each folder
for folder in $folders; do
    # Check if .env.example exists in the folder
    if [ -f "$folder/.env.example" ]; then
        # Copy .env.example to .env
        cp "$folder/.env.example" "$folder/.env"
        echo "Copied .env.example to .env in $folder"
    fi
done

