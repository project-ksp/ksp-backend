#!/bin/sh

if [ "$ENV" = "sit" ]; then
  yarn migrate && yarn seed && yarn start
elif [ "$ENV" = "prod" ]; then
  yarn start
else
  echo "Unknown environment: $ENV"
  exit 1
fi
