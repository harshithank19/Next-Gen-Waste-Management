// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import GaugeChart from "react-gauge-chart";
import { supabase } from "../supabase";
import DriversManager from "./DriversManager";
import { Button } from "@/components/ui/button";

/* ---------- ThingSpeakGauge ---------- */
function ThingSpeakGauge({ channelId, field, label }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://api.thingspeak.com/channels/${channelId}/fields/${field}/last.json?api_key=VYDGXT6JYUZ3IU69`
        );
        const data = await res.json();
        setValue(Number(data[`field${field}`]) || 0);
      } catch (err) {
        console.error("ThingSpeak error:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [channelId, field]);

  return (
    <div className="flex flex-col items-center bg-slate-800 p-4 rounded-2xl shadow-lg w-[260px]">
      <h3 className="text-md mb-2 text-slate-200 font-semibold">{label}</h3>

      <GaugeChart
        id={`gauge-${channelId}-${field}`}
        nrOfLevels={300}
        percent={Math.min(1, Math.max(0, value / 100))}
        colors={["#22c55e", "#facc15", "#ef4444"]}
        arcsLength={[0.5, 0.3, 0.2]}
        arcWidth={0.25}
        textColor="#fff"
        formatTextValue={() => ""}   // 🔥 removed number display
      />
    </div>
  );
}

/* ---------- AdminDashboard ---------- */
export default function AdminDashboard() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loadingFb, setLoadingFb] = useState(true);
  const [errorFb, setErrorFb] = useState("");

  /* Load feedbacks */
  const loadFeedbacks = async () => {
    setLoadingFb(true);
    const { data, error } = await supabase
      .from("feedbacks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading feedbacks:", error);
      setErrorFb(error.message);
    } else {
      setFeedbacks(data || []);
      setErrorFb("");
    }

    setLoadingFb(false);
  };

  useEffect(() => {
    loadFeedbacks();

    // 🔄 Realtime subscription for feedback updates
    const fbSub = supabase
      .channel("feedbacks-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "feedbacks" },
        (payload) => {
          console.log("Feedback change:", payload);
          loadFeedbacks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(fbSub);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 space-y-8">
      <h1 className="text-4xl font-bold text-center text-green-400 mb-6">
        Admin Dashboard
      </h1>

      {/* ---------- Waste Bin Gauges ---------- */}
      <section className="flex flex-wrap justify-center gap-6 mb-10">
        <ThingSpeakGauge channelId="3118429" field={1} label="Dry Waste Bin (%)" />
        <ThingSpeakGauge channelId="3118429" field={2} label="Wet Waste Bin (%)" />
        <ThingSpeakGauge channelId="3118429" field={3} label="Metal Waste Bin (%)" />
      </section>

      {/* ---------- Drivers Management Section ---------- */}
      <section className="bg-slate-800 p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl mb-4 font-semibold text-green-400">
          🚛 Drivers Management
        </h2>
        <DriversManager />
      </section>

      {/* ---------- User Feedback Section ---------- */}
      <section className="bg-slate-800 p-6 rounded-2xl shadow">
        <h2 className="text-2xl mb-4 font-semibold text-green-400">
          📋 User Feedbacks
        </h2>

        {loadingFb && <p className="text-slate-400">Loading feedbacks...</p>}
        {errorFb && <p className="text-red-400">{errorFb}</p>}

        {!loadingFb && feedbacks.length === 0 && (
          <p className="text-slate-400">No feedbacks available</p>
        )}

        <ul className="space-y-3">
          {feedbacks.map((fb) => (
            <li
              key={fb.id}
              className="bg-slate-700 p-4 rounded-lg flex flex-col gap-2"
            >
              <p className="whitespace-pre-wrap">{fb.message}</p>
              <p className="text-xs text-slate-400">
                From: {fb.user_id || "Anonymous"} •{" "}
                {fb.created_at
                  ? new Date(fb.created_at).toLocaleString()
                  : "Unknown date"}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
