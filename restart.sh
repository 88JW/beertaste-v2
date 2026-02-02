#!/bin/bash
set -e

# Kill background processes
pkill -f generate_icons.py || true
fuser -k 3000/tcp || true
sleep 2

# Load NVM and rebuild
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

cd /home/wojciech/projects/beertaste-v2

echo "Building client..."
pnpm --filter client build --webpack

echo "Starting server..."
cd client
node .next/standalone/client/server.js
