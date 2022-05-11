import dynamic from "next/dynamic";
import { FC, memo, useEffect, useState } from "react";
import { z } from "zod";
import LoadingMap from "./LoadingMap";

const INITIAL_LOCATION = [51.505, -0.09] as [number, number]; // Arbitrary fallback.
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
    loading: () => <LoadingMap />,
  });
  const [tournaments, setTournaments] = useState<TournamentType[]>([]);
  const [location, setLocation] = useState<[number, number] | null>(null);
  useEffect(() => {
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
        setLocation(result.data);
      } else {
        console.log(
          "Error while attemping to parse cached location from local storage"
        );
        console.log(result.error);
        localStorage.clear();
        console.log("Local storage cleared");
      }
    }
  }, []);
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
    fetchData();
  }, []);
  useEffect(() => {
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
    fetchLocation();
  }, []);
  const locationCacheHit = location !== null;
  return (
    <MapWithNoSSR
      location={location === null ? INITIAL_LOCATION : location}
      tournaments={tournaments}
    >
      {!locationCacheHit && <LoadingMap />}
    </MapWithNoSSR>
  );
};
const StatefulMapMemoized = memo(StatefulMap);
export default StatefulMapMemoized;
