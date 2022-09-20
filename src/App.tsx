import { useReducer, useEffect } from "react";

import About from './About';
import Map from './Map';
import VisibleTournaments from "components/VisibleTournaments";

import VisibleTournamentsProvider from 'providers/VisibleTournamentsProvider';

const aboutHash = "#about";

function App() {
  // State to toggle visibility of the about section. Initial value depends on url.
  const [aboutVisible, toggleAboutVisible] = useReducer(visible => !visible, (window.location.hash === aboutHash));

  // Browser fragment identifier ("hash") should change when about section is visible.
  useEffect(() => {
    window.location.hash = (aboutVisible ? aboutHash : "")
  }, [aboutVisible]);

  return <>
    <nav>
      <ul>
        <li className="navbar"><a href="/index.html">tournamap.gg</a></li>
        <li className="navbar" onClick={toggleAboutVisible}>about</li>
      </ul>
    </nav>
    <div id="main">
      <VisibleTournamentsProvider>
        {aboutVisible ? <About /> : <VisibleTournaments />}
        <Map />
      </VisibleTournamentsProvider>
    </div>
    {/* Cloudflare Web Analytics */}
    <script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon="{token: 05103a5d8df244d99ffa9c79f09f8a64}"></script>
  </>
}

export default App;
