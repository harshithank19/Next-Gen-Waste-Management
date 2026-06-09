// src/pages/DriverDashboard.jsx
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import GaugeChart from "react-gauge-chart"; // npm install react-gauge-chart

export default function DriverDashboard() {
  const [binData, setBinData] = useState([]);
  const [loading, setLoading] = useState(true);

  const channelID = "3118429";
  const readAPIKey = "LSE8AZBHV7WFC691";
  const writeAPIKey = "VYDGXT6JYUZ3IU69";

  // Fetch live bin data dynamically from ThingSpeak
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.thingspeak.com/channels/${channelID}/feeds.json?api_key=${readAPIKey}&results=1`
        );
        const data = await response.json();

        if (!data.feeds || data.feeds.length === 0) {
          setBinData([]);
          setLoading(false);
          return;
        }

        const latest = data.feeds[0];
        const fields = Object.keys(latest)
          .filter((key) => key.startsWith("field"))
          .map((key, index) => ({
            id: key,
            name: data.channel[`field${index + 1}`] || `Bin ${index + 1}`,
            level: parseFloat(latest[key]) || 0,
          }));

        setBinData(fields);
      } catch (err) {
        console.error("Error fetching ThingSpeak data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 20000); // refresh every 20s
    return () => clearInterval(interval);
  }, []);

  // Reset bin value on ThingSpeak (mark as collected)
  const markCollected = async (fieldId) => {
    try {
      await fetch(
        `https://api.thingspeak.com/update?api_key=${writeAPIKey}&${fieldId}=0`
      );
      alert(`${fieldId.toUpperCase()} marked as collected!`);
    } catch (err) {
      console.error("Error updating ThingSpeak:", err);
    }
  };

  if (loading) return <p className="p-4 text-gray-600">Fetching live data...</p>;
  if (binData.length === 0)
    return <p className="p-4 text-gray-600">No bin data available.</p>;

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <h1 className="text-2xl mb-8 font-semibold text-center">
        Driver Dashboard — Garbage Collection
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {binData.map((bin) => (
          <div
            key={bin.id}
            className="bg-gray-900 shadow-lg rounded-2xl p-6 flex flex-col items-center justify-between w-80"
          >
            <h2 className="text-lg font-semibold mb-4 capitalize text-gray-200">
              {bin.name}
            </h2>

            <GaugeChart
              id={`gauge-${bin.id}`}
              nrOfLevels={30}
              colors={["#00FF00", "#FFFF00", "#FF0000"]} // green → yellow → red
              percent={bin.level / 100}
              arcWidth={0.3}
              textColor="#fff"
              needleColor="#E5E7EB"
              needleBaseColor="#E5E7EB"
              animate={true}
              formatTextValue={() => ""}   // 🔥 REMOVED NUMBER DISPLAY
            />

            <p
              className={`mt-4 text-sm font-medium ${
                bin.level > 80
                  ? "text-red-400"
                  : bin.level > 50
                  ? "text-yellow-400"
                  : "text-green-400"
              }`}
            >
              {bin.level > 80
                ? "Needs Collection"
                : bin.level > 50
                ? "Moderate"
                : "Normal"}
            </p>

            <div className="mt-4">
              {bin.level > 80 ? (
                <Button size="sm" onClick={() => markCollected(bin.id)}>
                  Mark as Collected
                </Button>
              ) : (
                <Button size="sm" variant="secondary" disabled>
                  Collected
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
