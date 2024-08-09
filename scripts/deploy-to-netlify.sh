#!/usr/bin/bash
PROJECT_ROOT=$1
STAGE=$2
UPDATE_ENV=$3
ALIAS="develop-branch"

cd $PROJECT_ROOT

# Function to update or add a key-value pair in the .env file
update_env() {
    local ENV_FILE=".env"
    local KEY=$1
    local VALUE=$2

    # Check if correct number of arguments is provided
    if [ "$#" -ne 2 ]; then
        echo "Usage: update_env key value"
        return 1
    fi

    # Check if the .env file exists
    if [ ! -f "$ENV_FILE" ]; then
        touch "$ENV_FILE"
    fi

    # Check if the key exists in the file
    if grep -q "^$KEY=" "$ENV_FILE"; then
        # Key exists, replace the line
         sed -i "s^$KEY=.*^$KEY=$VALUE^" "$ENV_FILE"
    else
        # Key does not exist, append to the file
        echo "" >> "$ENV_FILE"
        echo "$KEY=$VALUE" >> "$ENV_FILE"
    fi

    echo "Updated $ENV_FILE with $KEY=$VALUE"
}

echo "Deploying to Netlify $NETLIFY_SITE_ID"

if [ "$STAGE" == "prod" ];then 
    context="production"
else 
    context="branch-deploy"
fi


if [ "$UPDATE_ENV" == "true" ]; then
    env_vars=$(netlify env:list --json --context $context)
    echo "$env_vars" | jq -r 'to_entries[] | "\(.key): \(.value)"' | while IFS=": " read -r key value; do
       update_env "$key" "$value"
    done
    exit 0
fi

# IF testing locally just comment this out and use netlify login
# [[ -z "$NETLIFY_AUTH_TOKEN" ]] && { echo "Netlify Auth token is empty, please set environment variable NETLIFY_AUTH_TOKEN" ; exit 1; }

echo "Installing dependencies"
pnpm i --no-frozen-lockfile

if [ "$STAGE" == "prod" ];then 
    echo "Deploying to Prod"
    netlify deploy -d "${PROJECT_ROOT}/dist" --build --prod 
else 
    echo "Deploying to Dev"
    netlify deploy -d "${PROJECT_ROOT}/dist" --build --alias $ALIAS
fi
