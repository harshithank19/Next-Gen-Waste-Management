// src/ThingSpeakData.js
import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const channelId = "3118429"; // your ThingSpeak channel ID
const apiKey = "LSE8AZBHV7WFC691"; // replace with your READ API key

export default function ThingSpeakData() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const res = await fetch(
        `https://api.thingspeak.com/channels/3118429/feeds.json?api_key=LSE8AZBHV7WFC691&results=2`
      );
      const result = await res.json();
      setData(result.feeds || []);
    } catch (err) {
      console.error("Error fetching ThingSpeak data:", err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // auto-refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const parsedData = data.map((entry) => ({
    time: new Date(entry.created_at).toLocaleTimeString(),
    dry: parseFloat(entry.field1),
    wet: parseFloat(entry.field2),
    metal: parseFloat(entry.field3),
  }));

  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-green-400">
        ♻️ Live Bin Fill-Level Data
      </h2>
      {parsedData.length === 0 ? (
        <p className="text-slate-400">Fetching live data from ThingSpeak...</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={parsedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="dry" stroke="#10b981" name="Dry Waste" />
            <Line type="monotone" dataKey="wet" stroke="#3b82f6" name="Wet Waste" />
            <Line type="monotone" dataKey="metal" stroke="#f59e0b" name="Metal Waste" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
