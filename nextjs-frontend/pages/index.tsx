import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";

const Home: NextPage = () => {
  const [hideAbout, setHideAbout] = useState(true)
  return (
    <div>
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Tournamap</title>
        <link rel="icon" type="image/x-icon" href="/icon-cropped.png" />
      </Head>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <nav>
        <ul>
          <li>
            <a href="/">tournamap.gg</a>
          </li>
          <li id="about-btn" onClick={() => setHideAbout((value) => !value)}>About</li>
        </ul>
      </nav>
      <div id="main">
      <section id="about" hidden={hideAbout}>
        <h2>About this Site</h2>
        <p>
          Tournamap.gg is a site for visualizing the location of offline video game tournaments. (Only Smash Ultimate is
          supported so far.) Each pin represents an upcoming tournament, click on it for details.
        </p>
        <h2>Why did I make this?</h2>
        <p>
          <s>I was bored idk</s>
          "Any tournaments happening near _____?" is a very common question in my community (NorCal). Some crazy
          individuals, in response, handmade and maintained a map showing where the locals are and when they happen. I
          thought that was awesome, and decided to try to automate something similar.
        </p>
        <h2>Data Source(s)</h2>
        <p>
          Data is pulled from <a href="https://smash.gg/">smash.gg</a> roughly every half hour. We hope to eventually
          support other sources, such as challonge.
        </p>
        <h2>If your tournament isn't listed</h2>
        <ol>
          <li>
            Make sure your tournament listing is publicly visible and discoverable. Someone should be able to find the
            page from the internet without being logged in.
          </li>
          <li>
            If your tournament was recently published, try waiting an hour. The data is updated every half hour, but it
            may take some time for the updated data to become visible.
          </li>
          <li>
            If all else fails, email <a href="mailto:admin@tournamap.gg">admin@tournamap.gg </a> with a link to your
            tournament so we can figure out why it isn't being shown.
          </li>
        </ol>
        <h2>How to contribute</h2>
        The source code for the project can be found <a href="https://github.com/perrycate/tournamap">on GitHub</a>. All
        forms of contribution (code, comments, etc) are welcome!
        <br />
        <br />
        I stream most Mondays, Wednesdays, and Fridays around 6:30 Pacific / 9:30 Eastern while working on the site.
        <a href="https://twitch.tv/graviddd">Come watch and/or chat and/or help!</a>
        {/* TODO once we have a feedback form, mention it here. */}
      </section>
      <section id="map">
        <a href="http://mapbox.com/about/maps" className="mapbox-logo" target="_blank">Mapbox</a>
      </section>
      </div>
    </div>
  );
};

export default Home;
