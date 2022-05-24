# Tournamap

Tournamap.gg is a site for visualizing the location of offline video game tournaments. (Only Smash Ultimate is
supported so far.) Each pin represents an upcoming tournament, click on it for details.

![Image of a map with pins. One of the pins is displaying information about a tournament](/example.png)

### Why did I make this?

~~I was bored idk~~
"Any tournaments happening near **\_**?" is a very common question in my community (NorCal). Some crazy
individuals, in response, handmade and maintained a map showing where the locals are and when they happen. I
thought that was awesome, and decided to try to automate something similar.

### Data Source(s)

Data is pulled from [smash.gg](https://smash.gg/) roughly every half hour. We hope to eventually
support other sources, such as challonge.

### If your tournament isn't listed

Make sure your tournament listing is publicly visible and discoverable. Someone should be able to find the
page from the internet without being logged in.

If your tournament was recently published, try waiting an hour. The data is updated every half hour, but it
may take some time for the updated data to become visible.

If all else fails, email [admin@tournamap.gg]("mailto:admin@tournamap.gg") with a link to your
tournament so we can figure out why it isn't being shown.

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

### Contributing

If you are considering making a change or sending a PR, welcome, we're grateful for the help!
Feel free to open an issue if you have any questions about development or need anything.
**If you are considering making a big change, we suggest opening an issue to discuss it first.
We'd hate for any effort to go to waste if the proposed change isn't compatible for some reason!**

Static files are located in `/public`, react components are in `/src`.
The "Backend" (ie the one-off code to download tournaments and save as a json file) is in `lib/`.
Tournament fetching code exists in `lib/util.ex`.

The code is a mess, sorry.
