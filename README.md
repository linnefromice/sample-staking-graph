# sample-staking-protocol

## For Developer

**Setup & Deploy**

- Prerequisites
  - deployed contracts to have dependency in local network
    - https://github.com/linnefromice/sample-staking-protocol
  - docker is running (ex: Docker for mac)

```bash
docker-compose -f docker/docker-compose-localhost.yml up
yarn codegen && yarn build
yarn create-local # first time only
yarn deploy-local
```
