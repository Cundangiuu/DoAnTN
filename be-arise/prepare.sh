#!/bin/bash

# Define output file names
OUTPUT_FILE1="client_secret.json"
OUTPUT_FILE2="service_user.json"

# Write the first JSON file (web config)
cat <<EOF >$OUTPUT_FILE1
{
  "web": {
    "client_id": "${CLIENT_ID}",
    "project_id": "${PROJECT_ID}",
    "auth_uri": "${AUTH_URI}",
    "token_uri": "${TOKEN_URI}",
    "auth_provider_x509_cert_url": "${AUTH_PROVIDER_X509_CERT_URL}",
    "client_secret": "${CLIENT_SECRET}",
    "redirect_uris": [
      "${REDIRECT_URI_1}"
    ],
    "javascript_origins": [
      "${JS_ORIGIN_1}"
    ]
  }
}
EOF

# Write the second JSON file (service account)
cat <<EOF >$OUTPUT_FILE2
{
  "type": "service_account",
  "project_id": "${PROJECT_ID}",
  "private_key_id": "${PRIVATE_KEY_ID}",
  "private_key": "${PRIVATE_KEY}",
  "client_email": "${CLIENT_EMAIL}",
  "client_id": "${SERVICE_ACCOUNT_CLIENT_ID}",
  "auth_uri": "${AUTH_URI}",
  "token_uri": "${TOKEN_URI}",
  "auth_provider_x509_cert_url": "${AUTH_PROVIDER_X509_CERT_URL}",
  "client_x509_cert_url": "${CLIENT_X509_CERT_URL}",
  "universe_domain": "${UNIVERSE_DOMAIN}"
}
EOF

echo "JSON configurations written to $OUTPUT_FILE1 and $OUTPUT_FILE2"
