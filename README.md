# draw draw ink 2

## Getting Started

### This "v2" of ddi requires the original service running, so get that infrastructure running

- Start the original drawdrawink (It's best to consult that project README directly but this usually works):

```bash
cd ../ddi-legacy
nvm use
npm run dev
```

- Next, start the docker-compose which starts:
  - nginx reverse proxy (this helps avoid CORS issues between the v1 & v2 apps)
  - postgreSQL DB
  - database client (for direct access to DB)

```bash
cd ../ddi-nui
docker-compose up
```

- Next, run the development server:

```bash
nvm use
npm run clean:dev
```

- View app at `localhost`

## Testing

### Run tests

```bash
npm run test:watch
```

### Debug tests

- requires [Playwright Test for VSCode](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)
- add a breakpoint to the test file
- click the `Testing` side menu button (I believe this is added to vs code by the Playwright Test for VSCode extension)
- find the test and click its `Debug Test` button

### Test code generator

- helpful for finding selectors

```bash
npm run test:codegen
```

## **KNOWN BUGS**

- `npm run dev:css` - the postcss cli build's "watch mode" doesn't detect new files being created in `ddi-nui/styles`. Restarting `dev:css` script will detect the new files

## Test Image (Needs updates!)

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
