#!/bin/bash

# Get admin token
TOKEN=$(curl -s -X POST https://phuketkeys-api.onrender.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin1","password":"password123"}' | jq -r '.accessToken')

echo "Got token: $TOKEN"

# Call reset API
echo "Calling reset API..."
curl -X POST https://phuketkeys-api.onrender.com/api/admin/reset-properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" | jq .

echo -e "\n\nChecking properties..."
curl -X GET 'https://phuketkeys-api.onrender.com/api/admin/properties' \
  -H "Authorization: Bearer $TOKEN" | jq 'length'

echo " properties found"
