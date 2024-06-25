#!/usr/bin/env bash
# Export env vars
export $(grep -v '^#' package/test/.env | xargs)