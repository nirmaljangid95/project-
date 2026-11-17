# Vibe — Angular Frontend

Instagram-style UI for the Node backend (`/api/v1`).

## Setup

```bash
cd frontend
npm install
npm start
```

App runs at [http://localhost:4200](http://localhost:4200).

## Backend CORS

In your backend env file (`env` / `.env`), set:

```
CORE_ORIGIN=http://localhost:4200
```

Restart the Node server (`npm run dev` in project root).

## Features

- **Auth page** — Login / Sign up toggle (register needs avatar)
- **Home feed** — Instagram-style video posts
- **Explore** — Search grid
- **Create** — Upload video + thumbnail, then publish
- **Tweets** — Short posts
- **Profile** — Cover, avatar, posts grid, follow

## API base

Configured in `src/environments/environment.ts`:

```
apiUrl: 'http://localhost:8000/api/v1'
```
