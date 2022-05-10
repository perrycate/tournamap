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
        <ul className="flex text-white space-x-4">
          <li>
            <a href="/">tournamap.gg</a>
          </li>
          <li id="about-btn" onClick={() => setHideAbout((value) => !value)}>
            About
          </li>
        </ul>
      </nav>
      <div id="main" className="flex-1 flex min-h-0 text-sm">
        <article
          id="about"
          hidden={hideAbout}
          className="max-w-lg overflow-y-auto prose p-3"
        >
          <AboutContent />
        </article>
        <StatefulMapMemoized />
      </div>
    </ReactDiv100vh>
  );
};

export default Home;
