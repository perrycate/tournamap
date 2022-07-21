import { useReducer } from "react";

import About from './About';
import Map from './Map';

function App() {
  const [aboutVisible, toggleAboutVisible] = useReducer(visible => !visible, false)
  return <>
    <nav>
      <ul>
        <li className="navbar"><a href="/index.html">tournamap.gg</a></li>
        <li className="navbar" onClick={toggleAboutVisible}>About</li>
      </ul>
    </nav>
    <div id="main">
      {aboutVisible ? <About /> : null}
      <Map />
    </div>
    {/* Cloudflare Web Analytics */}
    <script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon="{token: 05103a5d8df244d99ffa9c79f09f8a64}"></script>
  </>
}

export default App;
