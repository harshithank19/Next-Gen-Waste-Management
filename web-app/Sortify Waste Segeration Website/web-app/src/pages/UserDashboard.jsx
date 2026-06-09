// src/pages/UserDashboard.jsx
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ThingSpeakData from "../ThingSpeakData.jsx";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { supabase } from "../supabase";
import RewardDashboard from "../RewardDashboard.jsx";

/* ---------- Local helpers ---------- */
const createPinIcon = (emoji = "📍") =>
  L.divIcon({
    html: `<div style="font-size:22px; line-height:1">${emoji}</div>`,
    className: "",
    iconSize: [22, 22],
    iconAnchor: [11, 22],
  });

function ResetView({ center, zoom = 17 }) {
  const map = useMap();
  useEffect(() => {
    if (center && map) map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

function NearbyBinsMap({
  center = [12.9274286, 77.5269078],
  bins = [],
  height = 240,
}) {
  return (
    <div
      className="rounded-lg overflow-hidden border border-slate-700"
      style={{ height }}
    >
      <MapContainer
        center={center}
        zoom={17}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <ResetView center={center} zoom={17} />
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {bins.map((b) => (
          <Marker
            key={b.id}
            position={[b.lat, b.lng]}
            icon={createPinIcon("📍")}
          >
            <Popup>
              <div>
                <strong>{b.name}</strong>
                <div>Distance: {b.distance}</div>
                <div>Fill Level: {b.fillLevel}%</div>
                <div>Type: {b.type}</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

/* ---------- Main Component ---------- */
export default function UserDashboard() {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const { data, error } = await supabase
        .from("feedbacks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) console.error("Error fetching feedbacks:", error);
      else setFeedbacks(data || []);
    };
    fetchFeedbacks();
  }, []);

  const handleSendFeedback = async () => {
    if (!feedbackText.trim()) return alert("Feedback cannot be empty!");

    const { data, error } = await supabase
      .from("feedbacks")
      .insert([{ message: feedbackText.trim(), user_id: "guest" }]);

    if (error) {
      alert("❌ Error: " + error.message);
    } else {
      alert("✅ Feedback submitted successfully!");
      setFeedbackText("");
      setShowFeedback(false);
    }
  };

  const center = { lat: 12.9274286, lng: 77.5269078 };
  const nearbyBins = [
    {
      id: 1,
      name: "Bin A - Main Entrance",
      lat: center.lat + 0.00055,
      lng: center.lng - 0.0004,
      distance: "80 m",
      fillLevel: 35,
      type: "general",
    },
    {
      id: 2,
      name: "Bin B - Library Side",
      lat: center.lat - 0.0004,
      lng: center.lng + 0.0006,
      distance: "120 m",
      fillLevel: 62,
      type: "recyclable",
    },
    {
      id: 3,
      name: "Bin C - Parking Lot",
      lat: center.lat + 0.0002,
      lng: center.lng + 0.0008,
      distance: "150 m",
      fillLevel: 48,
      type: "organic",
    },
  ];

  const videos = [
  {
    id: 1,
    url: "https://youtu.be/JkUCM-9QWPQ?si=NRfqe_8qwV1O2mLI",
    thumbnail: "https://img.youtube.com/vi/JkUCM-9QWPQ/hqdefault.jpg",
  },
  {
    id: 2,
    url: "https://youtu.be/Qyu-fZ8BOnI?si=mJj58FCR4WsJwQN4",
    thumbnail: "https://img.youtube.com/vi/Qyu-fZ8BOnI/hqdefault.jpg",
  },
  {
    id: 3,
    url: "https://youtu.be/nYWgFE5X4yM?si=cL-_PsY4QnxM7zZR",
    thumbnail: "https://img.youtube.com/vi/nYWgFE5X4yM/hqdefault.jpg",
  },
];

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 space-y-16 overflow-y-auto">
      <h1 className="text-4xl font-bold text-center text-green-400 mb-12">
        User Dashboard
      </h1>

      {/* ThingSpeak section */}
      <section>
        <ThingSpeakData />
      </section>

      {/* Map section */}
      <section className="bg-slate-800 p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-semibold mb-4">📍 Nearby Bin</h2>
        <NearbyBinsMap
          center={[center.lat, center.lng]}
          bins={nearbyBins}
          height={320}
        />
      </section>

      {/* 🌟 Featured Videos Section */}
      <section className="bg-slate-800 p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-semibold mb-6">🌟 Featured Videos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videos.map((video) => (
            <a
              key={video.id}
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-lg"
            >
              <img
                src={video.thumbnail}
                alt={`YouTube Video ${video.id}`}
                className="rounded-lg w-full h-56 object-cover"
              />
            </a>
          ))}
        </div>
      </section>

      {/* Rewards section */}
      <section className="bg-slate-800 p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-semibold mb-4">🏆 Rewards</h2>
        <RewardDashboard />
      </section>

      {/* Feedback section */}
      <section className="bg-slate-800 p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-semibold mb-4">💬 Report & Feedback</h2>
        {!showFeedback ? (
          <Button
            className="gradient-bg mt-4"
            onClick={() => setShowFeedback(true)}
          >
            Submit Feedback
          </Button>
        ) : (
          <div className="mt-6 space-y-3">
            <textarea
              className="w-full p-3 rounded-lg bg-slate-700 text-white"
              rows="4"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
            />
            <Button className="gradient-bg" onClick={handleSendFeedback}>
              Send
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
