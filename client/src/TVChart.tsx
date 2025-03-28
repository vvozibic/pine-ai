import { useEffect, useRef } from "react";

export default function TVChart() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;

    script.onload = () => {
      if ((window as any).TradingView) {
        new (window as any).TradingView.widget({
          autosize: true,
          symbol: "BINANCE:BTCUSDT",
          interval: "15",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          container_id: "tv_chart_container",
        });
      }
    };

    containerRef.current.appendChild(script);
  }, []);

  return (
    <div
      id="tv_chart_container"
      ref={containerRef}
      style={{ height: "100%", width: "100%" }}
    />
  );
}
