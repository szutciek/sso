# Kanapka Single Sign On

- Based on (simplified) version of OAuth2
- Supports 2 Factor Authentication
- Supports multiple accounts at the same time

This service offers Single Sign On services to apps both on the kanapka.eu domain and other domains.

## Setup

### Populate Config

**Open config in editor, ex:**

nano config.js

**Enter data**

The server info, JWT preferences and database connection details

### Generate Keys

**Initial**

cd keys

**Private**

openssl genpkey -algorithm RSA -out rsa.key -pkeyopt rsa_keygen_bits:4096

**Public**

openssl rsa -pubout -in rsa.key -out rsa.key.pub
