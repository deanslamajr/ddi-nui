# draw draw ink 2

## Getting Started

- First, ensure we're using the correct version of node.js

```bash
nvm use
```

### This "v2" of ddi requires the original service running, so get that infrastructure running

- Start the original drawdrawink (It's best to consult that project README directly but this usually works):

```bash
cd ./path/to/ddi-v1>
docker-compose up
nvm use
npm run dev
```

- Next, start the nginx reverse proxy (this helps avoid CORS issues between the v1 & v2 apps):

```bash
cd ./path/to/ddi-v2>
docker-compose up
```

- Next, run the development server:

```bash
nvm use
npm run dev
```

- View app at `localhost`

## Test Image

- (if image to test wasn't the most recently built image) `npm run image:build`
- make sure `image-test.env` exists and has valid values for the container
  - e.g. references to PORT and localhost will be different (e.g. LEGACY_DDI_BACKEND_URL_WITH_PROTOCOL)
- `npm run image:start`
- app should be accessible at `localhost:1234`
  - the port number is the first number in the package.json command `image:start`, e.g. `docker run -p 1234:8080/tcp`

### to start a command line on running container

- follow the instructions in `Test Image` section to get the app container running
- `npm run image:bash`

- `npm run image:bash`
