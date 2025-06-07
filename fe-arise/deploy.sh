#!/bin/bash

# Define the prefix for filtering
PREFIX="APP_"

# Declare an associative array (map)
declare -A env_map

# Process command-line arguments for --PREFIX_* overrides
while [[ $# -gt 0 ]]; do
    arg="$1"
    if [[ $arg == --"$PREFIX"* ]]; then
        # Extract the key and get the value from the next argument
        key="${arg#--}"
        shift
        value="$1"
        # Add to the map
        env_map["$key"]="$value"
    fi
    shift
done

# Process environment variables
while IFS='=' read -r key value; do
    # Check if the key starts with the prefix
    if [[ $key == "$PREFIX"* ]]; then
        # Add to the map only if not already set by arguments
        if [[ -z "${env_map[$key]}" ]]; then
            env_map["$key"]="$value"
        fi
    fi
done < <(env)

# Clear or create the .env file
>.env

# Process the .env.template file and handle missing variables
while IFS= read -r line; do
    IFS='='
    read -ra kv <<<"$line"
    key="${kv[0]}" # The key from the template

    # Remove the PREFIX from the key
    stripped_key="${PREFIX}${key}"

    # Check if the key exists in env_map (either through arguments or environment)
    if [[ -n "${env_map[$stripped_key]}" ]]; then
        value="${env_map[$stripped_key]}"
    else
        # If the key is in the template but not provided, throw an error
        echo "ERROR: Required variable '$key' (without prefix '$PREFIX') is missing!"
        exit 1
    fi

    # Write the stripped key and the value to the .env file
    if [[ -n "$key" ]]; then
        echo "$key=$value" >>.env
    fi
done <.env.template

# Print success message
echo "Values have been written to .env."
