import React, { useEffect, useRef } from "react";

let tvScriptLoadingPromise;

export default function TradingViewWidget({ symbol = "ETHUSDT" }) {
  const onLoadScriptRef = useRef();

  useEffect(() => {
    onLoadScriptRef.current = createWidget;

    if (!tvScriptLoadingPromise) {
      tvScriptLoadingPromise = new Promise((resolve) => {
        const script = document.createElement("script");
        script.id = "tradingview-widget-loading-script";
        script.src = "https://s3.tradingview.com/tv.js";
        script.type = "text/javascript";
        script.onload = resolve;
        document.head.appendChild(script);
      });
    }

    tvScriptLoadingPromise.then(() => onLoadScriptRef.current && onLoadScriptRef.current());

    return () => (onLoadScriptRef.current = null);

    function createWidget() {
      if (document.getElementById("tradingview-widget") && "TradingView" in window) {
        new window.TradingView.widget({
          autosize: true,
          symbol: `BINANCE:${symbol}`,
          interval: "30",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          container_id: "tradingview-widget",
        });
      }
    }
  }, [symbol]);

  return <div id="tradingview-widget" style={{ width: "100%", height: "100%" }} />;
}
