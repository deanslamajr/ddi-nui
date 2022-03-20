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
