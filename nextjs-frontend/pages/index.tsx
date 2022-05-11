import { readFileSync } from "fs";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import ReactDiv100vh from "react-div-100vh";
import StatefulMapMemoized from "../components/StatefulMapMemoized";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";

interface Props {
  aboutMdxSource: MDXRemoteSerializeResult<Record<string, unknown>>;
}
export const getStaticProps: GetStaticProps<Props> = async () => {
  const aboutText = readFileSync("./assets/about.mdx", {
    encoding: "utf8",
  });
  const aboutMdxSource = await serialize(aboutText);
  return { props: { aboutMdxSource } };
};

const Home: NextPage<Props> = ({ aboutMdxSource }) => {
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
        <ul className="flex items-center leading-7 text-white leading-0">
          <li className="flex items-center hover:bg-teal-800">
            <a href="/" className="flex-1 px-2">
              tournamap.gg
            </a>
          </li>
          <li
            id="about-btn"
            onClick={() => setHideAbout((value) => !value)}
            className="px-2 cursor-pointer select-none hover:bg-teal-800"
          >
            About
          </li>
        </ul>
      </nav>
      <div id="main" className="flex flex-1 min-h-0 text-sm">
        <article
          id="about"
          hidden={hideAbout}
          className="max-w-[30rem] p-3 overflow-y-auto leading-5 prose-sm prose prose-headings:my-2 prose-p:my-2 first:prose-headings:mt-0 prose-blue"
        >
          <MDXRemote {...aboutMdxSource} />
        </article>
        <div className="relative flex flex-1">
          <StatefulMapMemoized />
        </div>
      </div>
    </ReactDiv100vh>
  );
};

export default Home;
