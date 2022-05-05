# Tournamap

**TODO: Add description**

## Installation and usage

Your system must have Elixir (recommended 1.12 or greater) and Mix installed.

After cloning/downloading the repo and `cd`ing into it:

Install dependencies:

```
mix deps.get
npm install
```

Get a smash.gg auth token by following the instructions [here](https://developer.smash.gg/docs/authentication).
Add your auth token to your environment with the following command (replace the <>s):

```
export SMASH_GG_TOKEN=<your token here>
```

Download tournaments:

```
mix run -e Util.update_tourneys
cp tournaments.json publi/
```

Start the server:

```
npm start
```

By default the server runs on port `4000`, so you can access the site at `http://localhost:4000/index.html`.
Be certain that you're using `localhost` and not `127.0.0.1`.
The tile provider (used for the maps) will only work if the request is coming from "localhost".

## Contributing

Frontend code is located in `priv/static`.
"Backend" (ie the one-off code to download tournaments and save as a json file) is in `lib/`.
Tournament fetching code exists in `lib/util.ex`.

The code is a mess, sorry.
