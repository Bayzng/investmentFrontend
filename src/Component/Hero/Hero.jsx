import React from "react";
import celo from "../../assets/celo.png"
import arbitrum from "../../assets/arbitrum-logo.png"
import avalanche from "../../assets/avalanche.png"
import ethereum from "../../assets/ethereum.png"
import polkadot from "../../assets/Polkadot-Logo.png"
import "./Hero.css"
// import { directive } from "../../../node_modules/@babel/types/lib/index-legacy.d";

const Hero = () => {
  return (
    <div>
      <div class="brands">
        <img src={arbitrum} alt="ethereum" />
        <img
          src={ethereum}
          alt="arbitrum"
        />
        <img
          src={celo}
          alt="celo"
        />
        <img
          src={avalanche}
          alt="riotinto"
        />
        <img
          src={polkadot}
          alt="heroku"
        />
      </div>
    </div>
  );
};

export default Hero;
