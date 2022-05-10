import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { FC, memo, useEffect, useState } from "react";
import { z } from "zod";

const LOCATION_CACHE_KEY = "userLatLng";
const LAT_LNG_SCHEMA = z.tuple([z.number(), z.number()]);
const TOURNAMENT_JSON = z.array(
  z.object({
    location: z.object({
      lat: z.string(),
      lng: z.string(),
    }),
  })
);

const StatefulMap: FC = () => {
  const MapWithNoSSR = dynamic(() => import("../components/Map"), {
    ssr: false,
  });
  let initial_location = [51.505, -0.09] as [number, number]; // Arbitrary fallback.
  if (typeof window !== "undefined") {
    let cached_location_str = localStorage.getItem(LOCATION_CACHE_KEY);
    if (cached_location_str === null) {
      console.log("User location is not set in local storage");
    } else {
      let parsedLocation;
      try {
        parsedLocation = JSON.parse(cached_location_str);
      } catch {}
      const result = LAT_LNG_SCHEMA.safeParse(parsedLocation);
      if (result.success) {
        initial_location = result.data;
      } else {
        console.log(
          "Error while attemping to parse cached location from local storage"
        );
        console.log(result.error);
        localStorage.clear();
        console.log("Local storage cleared");
      }
    }
  }
  let [markers, setMarkers] = useState([initial_location]);
  let [location, setLocation] = useState(initial_location);
  useEffect(() => {
    const fetchData = async () => {
      const resp = await fetch("tournaments.json");
      const respJson = await resp.json();
      const parsedResp = TOURNAMENT_JSON.safeParse(respJson);
      if (!parsedResp.success) {
        console.log(respJson);
        return;
      }
      const newMarkers = parsedResp.data.map((tourney): [number, number] => {
        const { lat, lng } = tourney.location;
        return [Number(lat), Number(lng)];
      });
      console.log("new markers", newMarkers);
      setMarkers(newMarkers);
    };
    const fetchLocation = async () => {
      const positionPromise = new Promise<[number, number]>(
        (resolve, reject) => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (resp) => {
                resolve([resp.coords.latitude, resp.coords.longitude]);
              },
              (error) => {
                reject(error);
              }
            );
          } else {
            alert(
              "Please enable the browser to know your location or Geolocation is not supported by this browser."
            );
            reject();
          }
        }
      );
      const position = await positionPromise;
      const stringifiedPosition = JSON.stringify(position);
      localStorage.setItem(LOCATION_CACHE_KEY, stringifiedPosition);
      setLocation(position);
    };
    fetchData();
    fetchLocation();
  }, []);
  return <MapWithNoSSR location={location} markers={markers} />;
};

const StatefulMapMemoized = memo(StatefulMap);

const AboutContent: FC = () => {
  return (
    <>
      <h2>About this Site</h2>
      <p>
        Tournamap.gg is a site for visualizing the location of offline video
        game tournaments. (Only Smash Ultimate is supported so far.) Each pin
        represents an upcoming tournament, click on it for details.
      </p>
      <h2>Why did I make this?</h2>
      <p>
        <s>I was bored idk</s>
        "Any tournaments happening near _____?" is a very common question in my
        community (NorCal). Some crazy individuals, in response, handmade and
        maintained a map showing where the locals are and when they happen. I
        thought that was awesome, and decided to try to automate something
        similar.
      </p>
      <h2>Data Source(s)</h2>
      <p>
        Data is pulled from <a href="https://smash.gg/">smash.gg</a> roughly
        every half hour. We hope to eventually support other sources, such as
        challonge.
      </p>
      <h2>If your tournament isn't listed</h2>
      <ol>
        <li>
          Make sure your tournament listing is publicly visible and
          discoverable. Someone should be able to find the page from the
          internet without being logged in.
        </li>
        <li>
          If your tournament was recently published, try waiting an hour. The
          data is updated every half hour, but it may take some time for the
          updated data to become visible.
        </li>
        <li>
          If all else fails, email{" "}
          <a href="mailto:admin@tournamap.gg">admin@tournamap.gg </a> with a
          link to your tournament so we can figure out why it isn't being shown.
        </li>
      </ol>
      <h2>How to contribute</h2>
      The source code for the project can be found{" "}
      <a href="https://github.com/perrycate/tournamap">on GitHub</a>. All forms
      of contribution (code, comments, etc) are welcome!
      <br />
      <br />I stream most Mondays, Wednesdays, and Fridays around 6:30 Pacific /
      9:30 Eastern while working on the site.
      <a href="https://twitch.tv/graviddd">
        Come watch and/or chat and/or help!
      </a>
      {/* TODO once we have a feedback form, mention it here. */}
    </>
  );
};

const Home: NextPage = () => {
  const [hideAbout, setHideAbout] = useState(true);
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Tournamap</title>
        <link rel="icon" type="image/x-icon" href="icon-cropped.png" />
      </Head>
      <nav className="bg-teal-900">
        <ul className="flex text-white space-x-4">
          <li>
            <a href="/">tournamap.gg</a>
          </li>
          <li id="about-btn" onClick={() => setHideAbout((value) => !value)}>
            About
          </li>
        </ul>
      </nav>
      <div id="main" className="flex">
        <section id="about" hidden={hideAbout} className="max-w-lg p-2">
          <AboutContent />
        </section>
        <StatefulMapMemoized />
      </div>
    </>
  );
};

export default Home;
