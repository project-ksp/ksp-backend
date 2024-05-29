#!/bin/sh

YELLOW='\033[1;33m'
NC='\033[0m'

if [ "$ENV" = "sit" ]; then
  echo -e "${YELLOW}Running in SIT mode${NC}"
  yarn migrate && yarn seed && yarn start
elif [ "$ENV" = "prod" ]; then
  echo -e "${YELLOW}Running in PROD mode${NC}"
  yarn start
else
  echo "Unknown environment: $ENV"
  exit 1
fi
