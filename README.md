# Tournamap

**TODO: Add description**

## Installation and usage

### Frontend

The frontend comes with a sample tournaments.json file already downloaded/created.
If you are only interested in running frontend and are ok with stale tournament data, here are the steps to get it running.

Your system must have npm installed.

Install dependencies:

```
npm install
```

Start the server:

```
npm start
```

Be certain that you're using `localhost` to access the site in your browser and not `127.0.0.1`.
The tile provider (used for the maps) will only work if the request is coming from "localhost".

### Data Fetching / "Backend"

Your system must have Elixir (recommended 1.12 or greater) and Mix installed.

Install dependencies:

```
mix deps.get
```

Get a smash.gg auth token by following the instructions [here](https://developer.smash.gg/docs/authentication).
Add your auth token to your environment with the following command (replace the <>s):

```
export SMASH_GG_TOKEN=<your token here>
```

Download tournaments:

```
mix run -e Util.update_tourneys
```

If you wish to see the updated data in the frontend, copy the newly-created `tournaments.json` file into the `public` folder before following the frontend setup instructions above:

```
cp tournaments.json public/
```

## Contributing

Static files are located in `/public`, react components are in `/src`.
The "Backend" (ie the one-off code to download tournaments and save as a json file) is in `lib/`.
Tournament fetching code exists in `lib/util.ex`.

The code is a mess, sorry.
