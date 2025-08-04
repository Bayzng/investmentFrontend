import React from "react";
import "./Hero.css"
// import { directive } from "../../../node_modules/@babel/types/lib/index-legacy.d";

const Hero = () => {
  return (
    <div>
      <div>
        <div class="img">
          {/* <img
            src="https://cdn.prod.website-files.com/682d1c6b3c16bb956eafd6aa/682d1c6b3c16bb956eafdbb9_3d-tb-education.png"
            alt=""
          /> */}
        </div>
      </div>
      <div class="brands">
        <img src="https://pngimg.com/d/google_PNG19644.png" alt="google" />
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Slack_Technologies_Logo.svg/2560px-Slack_Technologies_Logo.svg.png"
          alt="slack"
        />
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Agworld_Logo.svg/2560px-Agworld_Logo.svg.png"
          alt="Agworld"
        />
        <img
          src="https://download.logo.wine/logo/Rio_Tinto_(corporation)/Rio_Tinto_(corporation)-Logo.wine.png"
          alt="riotinto"
        />
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Heroku_logo.svg/2560px-Heroku_logo.svg.png"
          alt="heroku"
        />
      </div>
    </div>
  );
};

export default Hero;
