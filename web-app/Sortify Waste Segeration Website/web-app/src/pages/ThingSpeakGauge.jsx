// ThingSpeakGauge.jsx
import React, { useEffect, useState } from "react";

const ThingSpeakGauge = ({ channelId, field, label }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await fetch(
          `https://api.thingspeak.com/channels/${channelId}/fields/${field}/last.json`
        );
        const data = await resp.json();
        if (data && data[`field${field}`]) {
          setValue(parseFloat(data[`field${field}`]));
        }
      } catch (err) {
        console.error("ThingSpeak fetch error", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 15000); // update every 15s
    return () => clearInterval(interval);
  }, [channelId, field]);

  const normalized = Math.min(100, Math.max(0, value)); // 0–100 range for gauge
  const rotation = (normalized / 100) * 180 - 90;

  return (
    <div className="bg-slate-800 rounded-xl p-4 shadow-md flex flex-col items-center w-full">
      <h3 className="text-lg font-semibold mb-2 text-green-400">{label}</h3>
      <div className="relative w-40 h-20 overflow-hidden">
        <div className="absolute w-full h-full flex justify-center items-end origin-bottom">
          <div
            className="w-1 h-20 bg-red-500 rounded-full transform origin-bottom transition-transform duration-500"
            style={{ transform: `rotate(${rotation}deg)` }}
          ></div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 text-center text-xl font-bold text-white">
          {isNaN(value) ? "—" : value.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default ThingSpeakGauge;
