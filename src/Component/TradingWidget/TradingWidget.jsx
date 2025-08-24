// src/components/TradingWidget/TradingWidget.jsx
import React, { useEffect, useState } from "react";
import "./TradingWidget.css";

const colors = [
  "#FFD700",
  "#B4ECF3",
  "#456F96",
  "#D4AF37",
  "#D4AF37",
  "#432E77",
];
const crypto = [
  "bitcoin",
  "solana",
  "ethereum",
  "pancakeswap",
  "binance-coin",
  "illuvium",
];

const TradingWidget = () => {
  const [visibleDiv] = useState(null);

  // Random padding updater
  useEffect(() => {
    const foo = () => {
      const paddingT = Math.floor(Math.random() * 44);
      const main = document.getElementById("main");
      const nav = document.getElementById("nav");
      if (main && nav) {
        main.style.margin = `${paddingT}px`;
        main.style.padding = `${paddingT}px`;
        nav.style.paddingLeft = `${paddingT}px`;
      }
      setTimeout(foo, 69000);
    };
    foo();
  }, []);

  // Inject TradingView
  useEffect(() => {
    const container = document.getElementById("tradingview_voo");
    if (!container) return;
    container.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: "AMEX:BTC",
      width: "100%",
      colorTheme: "light",
      isTransparent: false,
      locale: "en",
    });
    container.appendChild(script);
  }, []);

  // Crypto Converter
  useEffect(() => {
    if (document.getElementById("crypto-converter-widget-script")) return;
    const s = document.createElement("script");
    s.id = "crypto-converter-widget-script";
    s.src =
      "https://cdn.jsdelivr.net/gh/dejurin/crypto-converter-widget/dist/latest.min.js";
    s.async = true;
    document.body.appendChild(s);
  }, []);

  // CodePen embed loader
  useEffect(() => {
    if (document.getElementById("codepen-embed-script")) return;
    const s = document.createElement("script");
    s.id = "codepen-embed-script";
    s.src = "https://codepen.io/assets/embed/ei.js";
    s.async = true;
    document.body.appendChild(s);
  }, []);

  return (
    <div className="trading-pages">
      {/* TradingView Widget */}
      <div className="tradingview-widget-container">
        <div id="tradingview_voo"></div>
      </div>

      {/* Crypto Converter */}
      <div className="m-3 columns is-multiline" id="main">
        {crypto.map((c, i) => (
          <div key={c} className="column is-4">
            <crypto-converter-widget
              background-color={colors[i]}
              live="true"
              shadow="true"
              symbol="true"
              crypto={c}
            ></crypto-converter-widget>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <nav id="nav">
        {/* <button onClick={() => setVisibleDiv(visibleDiv === "aiToolDiv" ? null : "aiToolDiv")}>TBD</button>
        <button onClick={() => setVisibleDiv(visibleDiv === "bitcoinDiv" ? null : "bitcoinDiv")}>Star Atlas</button>
        <button onClick={() => setVisibleDiv(visibleDiv === "bestCompanyDiv" ? null : "bestCompanyDiv")}>Lunarians</button> */}
        <p className="nft">NFTs Collection Available soon</p>
        {/* <button onClick={() => setVisibleDiv(visibleDiv === "dealerRaterDiv" ? null : "dealerRaterDiv")}>Meerkats</button> */}
        {/* <button>Rogue Sharks</button> */}
        {/* <button onClick={() => setVisibleDiv(visibleDiv === "healthGradesDiv" ? null : "healthGradesDiv")}>Future</button>
        <button onClick={() => setVisibleDiv(visibleDiv === "merchantCircleDiv" ? null : "merchantCircleDiv")}>Lorem</button> */}
      </nav>

      {/* Hidden Panels with CodePen embeds */}
      <div
        id="aiToolDiv"
        className={`hiddendivs ${visibleDiv === "aiToolDiv" ? "show" : ""}`}
      >
        <p
          data-height="500"
          data-theme-id="1228"
          data-slug-hash="PobJzKM"
          data-user="micahhowe"
          data-default-tab="result"
          className="codepen"
        ></p>
      </div>
      <div
        id="bitcoinDiv"
        className={`hiddendivs ${visibleDiv === "bitcoinDiv" ? "show" : ""}`}
      >
        <p
          data-height="500"
          data-theme-id="1228"
          data-slug-hash="eYRWKoq"
          data-user="micahhowe"
          data-default-tab="result"
          className="codepen"
        ></p>
      </div>
      <div
        id="bestCompanyDiv"
        className={`hiddendivs ${
          visibleDiv === "bestCompanyDiv" ? "show" : ""
        }`}
      >
        <p
          data-height="500"
          data-theme-id="1228"
          data-slug-hash="rNWNXOO"
          data-user="micahhowe"
          data-default-tab="result"
          className="codepen"
        ></p>
      </div>
      <div
        id="bbbDiv"
        className={`hiddendivs ${visibleDiv === "bbbDiv" ? "show" : ""}`}
      >
        <p
          data-height="500"
          data-theme-id="1228"
          data-slug-hash="zYzQwzg"
          data-user="micahhowe"
          data-default-tab="result"
          className="codepen"
        ></p>
      </div>

      {/* Horizontal Scrolling NFT Images */}
      <div className="block">
        <div className="animation">
          <img
            src="https://data.solanart.io/img/degenape/9209.jpg"
            alt="gold monke"
          />
          <img
            src="https://data.solanart.io/img/degenape/3229.jpg"
            alt="wizard monke"
          />
          <img
            src="https://data.solanart.io/img/degenape/9941.jpg"
            alt="Golden Teeth monke"
          />
          {/* … include all the rest of your NFT <img> here … */}
        </div>
      </div>

      {/* CoinGecko Widgets */}
      <coingecko-coin-price-chart-widget
        currency="usd"
        coin-id="marinade"
        locale="en"
        height="300"
      ></coingecko-coin-price-chart-widget>
      <coingecko-coin-price-chart-widget
        currency="usd"
        coin-id="shiba-inu"
        locale="en"
        height="300"
      ></coingecko-coin-price-chart-widget>
    </div>
  );
};

export default TradingWidget;
