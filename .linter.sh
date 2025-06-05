#!/bin/bash
cd /home/kavia/workspace/code-generation/melodyexplorer-31170-f36a91d2/melodyexplorer
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

