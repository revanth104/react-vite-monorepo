#!/usr/bin/bash
PROJECT_ROOT=$1
cd $PROJECT_ROOT
cd ..
cd src
echo "Building src..."
pnpm c set node-linker=hoisted --location=project       
pnpm c set recursive-install=false --location=project      
pnpm c set save-workspace-protocol=false --location=project              
pnpm c set shared-workspace-lockfile=false --location=project                 
pnpm c set save-workspace-protocol=rolling --location=project                
rm -rf node_modules && pnpm i -no-frozen-lockfile

cd ..
cd scheduler
echo "Building scheduler..."
pnpm c set node-linker=hoisted --location=project       
pnpm c set recursive-install=false --location=project      
pnpm c set save-workspace-protocol=false --location=project              
pnpm c set shared-workspace-lockfile=false --location=project                 
pnpm c set save-workspace-protocol=rolling --location=project                
rm -rf node_modules && pnpm i -no-frozen-lockfile