#!/usr/bin/bash
PROJECT_ROOT=$1
STAGE=$2
UPDATE_ENV=$3
ALIAS="develop-branch"

cd $PROJECT_ROOT

if [ "$STAGE" == "prod" ];then 
    context="production"
else 
    context="branch-deploy"
fi


if [ "$UPDATE_ENV" == "true" ]; then
    echo "Updating environment variables for $NETLIFY_SITE_ID"
    env_vars=$(netlify env:list --json --context $context)
    cd ../../../scripts
    node updateEnvFile.mjs "../$PROJECT_ROOT/.env" "$env_vars"
    exit 0
fi

echo "Deploying to Netlify $NETLIFY_SITE_ID"

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
