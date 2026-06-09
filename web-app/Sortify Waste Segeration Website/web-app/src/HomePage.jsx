// src/HomePage.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Play, Trash2, Recycle, AlertTriangle } from "lucide-react";
import { Button } from "./components/ui/button"; // adjust path if needed
import LeafletMap from "./LeafletMap";

function FeatureCard({ feature, index }) {
  const IconComponent = feature.icon;

  const handleClick = () => {
    if (feature.title === "User Dashboard") window.location.href = "/login";
    else if (feature.title === "Admin Dashboard") window.location.href = "/admin-login";
    else if (feature.title === "Driver Dashboard") window.location.href = "/driver-login";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="group cursor-pointer"
      onClick={handleClick}
    >
      <div className="glass-effect rounded-2xl p-8 border border-slate-700/50 hover:border-green-500/50 transition-all duration-300 h-full">
        <div
          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6`}
        >
          <IconComponent className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-green-400 transition-colors">
          {feature.title}
        </h3>
        <p className="text-slate-300 group-hover:text-slate-200 transition-colors">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
}

// Default place (college location)
const place = {
  name: "Global Academy of Technology",
  lat: 12.927018166134173,
  lng: 77.5265430195918,
  mapsUrl:
    "https://www.google.com/maps/place/Global+Academy+of+Technology/@12.9274286,77.5269078,496m/",
};

export default function HomePage() {
  const features = [
    {
      icon: Trash2,
      title: "User Dashboard",
      description: "Report waste issues and keep your neighborhood clean.",
      color: "from-purple-500 to-violet-600",
    },
    {
      icon: Play,
      title: "Admin Dashboard",
      description: "Administrative dashboard for system management.",
      color: "from-pink-500 to-red-600",
    },
    {
      icon: AlertTriangle,
      title: "Driver Dashboard",
      description: "Driver dashboard for collection & tracking.",
      color: "from-teal-500 to-green-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <style jsx>{`
        .glass-effect {
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
      `}</style>

      {/* Header Section */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden"
      >
        <div className="relative container mx-auto px-6 py-8">
          {/* Navbar */}
          <nav className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Recycle className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                Sortify
              </span>
            </div>
          </nav>

          {/* Hero Section */}
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-white via-green-200 to-emerald-300 bg-clip-text text-transparent">
                Smart waste app
              </span>
              <br />
              <span className="text-green-400">for every city</span>
            </motion.h1>

            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto"
            >
              See bins, their fill-level, find the nearest one, and report issues.
            </motion.p>
          </div>
        </div>
      </motion.header>

      {/* Map Section */}
      <section className="container mx-auto px-6 py-6">
        <div className="bg-slate-800 p-6 rounded-2xl shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">
              🗺 Map — {place.name}
            </h2>
            <div className="text-sm text-slate-400">
              Coordinates: {place.lat.toFixed(6)}, {place.lng.toFixed(6)}
            </div>
          </div>

          <div className="relative rounded-lg overflow-hidden border border-slate-700">
            <LeafletMap place={place} height={384} />
            <div className="absolute left-4 bottom-4 bg-slate-900/70 backdrop-blur-md p-3 rounded-md flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                📍
              </div>
              <div>
                <div className="text-sm font-medium text-white">
                  {place.name}
                </div>
                <div className="text-xs text-slate-300">
                  Tap marker to interact •{" "}
                  <a
                    href={place.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Open in Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <motion.section className="container mx-auto px-6 py-16">
        <motion.h2
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent"
        >
          Features
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((f, idx) => (
            <FeatureCard key={idx} feature={f} index={idx} />
          ))}
        </div>
      </motion.section>
    </div>
  );
}
