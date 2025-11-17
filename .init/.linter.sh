#!/bin/bash
cd /home/kavia/workspace/code-generation/edusphere-learning-platform-256981-257051/edusphere_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

