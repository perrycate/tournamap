import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import ReactDiv100vh from "react-div-100vh";
import AboutContent from "../components/AboutContent";
import StatefulMapMemoized from "../components/StatefulMapMemoized";

const Home: NextPage = () => {
  const [hideAbout, setHideAbout] = useState(true);
  return (
    <ReactDiv100vh className="flex flex-col">
      <Head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Tournamap</title>
        <link rel="icon" type="image/x-icon" href="icon-cropped.png" />
      </Head>
      <nav className="bg-teal-900">
        <ul className="flex items-center text-white">
          <li className="flex hover:bg-teal-800">
            <a href="/" className="flex-1 px-2 py-1">
              tournamap.gg
            </a>
          </li>
          <li
            id="about-btn"
            onClick={() => setHideAbout((value) => !value)}
            className="px-2 py-1 cursor-pointer select-none hover:bg-teal-800"
          >
            About
          </li>
        </ul>
      </nav>
      <div id="main" className="flex flex-1 min-h-0 text-sm">
        <article
          id="about"
          hidden={hideAbout}
          className="max-w-lg p-3 overflow-y-auto prose prose-blue"
        >
          <AboutContent />
        </article>
        <div className="relative flex flex-1">
          <StatefulMapMemoized />
        </div>
      </div>
    </ReactDiv100vh>
  );
};

export default Home;
