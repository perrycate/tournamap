import dynamic from "next/dynamic";
import { FC, memo, useEffect, useState } from "react";
import { z } from "zod";
const LOCATION_CACHE_KEY = "userLatLng";
const LAT_LNG_SCHEMA = z.tuple([z.number(), z.number()]);
const TOURNAMENT_JSON = z.array(
  z.object({
    end_time: z.number(),
    external_id: z.string(),
    location: z.object({ lat: z.string(), lng: z.string() }),
    name: z.string(),
    start_time: z.number(),
    url: z.string(),
  })
);
export type TournamentType = {
  end_time: number;
  external_id: string;
  location: {
    lat: string;
    lng: string;
  };
  name: string;
  start_time: number;
  url: string;
};

const StatefulMap: FC = () => {
  const MapWithNoSSR = dynamic(() => import("../components/Map"), {
    ssr: false,
  });
  let initial_location = null as [number, number] | null; // Arbitrary fallback.
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
  let [tournaments, setTournaments] = useState<TournamentType[]>([]);
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
      setTournaments(parsedResp.data);
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
                alert(
                  "Please enable the browser to know your location or Geolocation is not supported by this browser."
                );
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
  return <MapWithNoSSR location={location} tournaments={tournaments} />;
};
const StatefulMapMemoized = memo(StatefulMap);
export default StatefulMapMemoized;
