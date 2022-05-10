import type { NextPage } from "next";
import Head from "next/head";
import { FC } from "react";

const Home: NextPage = () => {
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
    </div>
  );
};

export default Home;
