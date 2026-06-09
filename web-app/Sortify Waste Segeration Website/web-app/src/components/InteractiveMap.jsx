
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { motion } from 'framer-motion';
import { Trash2, Recycle, Leaf, AlertTriangle, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom bin icons
const createBinIcon = (type, fillLevel) => {
  const getColor = () => {
    if (fillLevel >= 80) return '#ef4444'; // red
    if (fillLevel >= 60) return '#f59e0b'; // amber
    return '#22c55e'; // green
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'recycling': return '♻️';
      case 'organic': return '🌱';
      case 'general': return '🗑️';
      default: return '🗑️';
    }
  };

  return L.divIcon({
    html: `
      <div class="relative">
        <div class="w-8 h-8 rounded-full flex items-center justify-center text-lg shadow-lg border-2 border-white" 
             style="background-color: ${getColor()}">
          ${getTypeIcon()}
        </div>
        <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-slate-800 rounded-full flex items-center justify-center text-xs text-white font-bold border border-white">
          ${fillLevel}
        </div>
      </div>
    `,
    className: 'bin-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
};

const mockBins = [
  { id: 1, lat: 51.505, lng: -0.09, type: 'general', fillLevel: 45, name: 'Main Street Bin #1', lastEmptied: '2 hours ago' },
  { id: 2, lat: 51.51, lng: -0.1, type: 'recycling', fillLevel: 78, name: 'Park Avenue Recycling', lastEmptied: '1 day ago' },
  { id: 3, lat: 51.515, lng: -0.08, type: 'organic', fillLevel: 23, name: 'Green Square Organic', lastEmptied: '3 hours ago' },
  { id: 4, lat: 51.508, lng: -0.11, type: 'general', fillLevel: 89, name: 'Shopping Center Bin', lastEmptied: '2 days ago' },
  { id: 5, lat: 51.512, lng: -0.095, type: 'recycling', fillLevel: 34, name: 'Library Recycling Point', lastEmptied: '5 hours ago' },
  { id: 6, lat: 51.507, lng: -0.085, type: 'organic', fillLevel: 67, name: 'Market Square Organic', lastEmptied: '1 day ago' },
  { id: 7, lat: 51.513, lng: -0.105, type: 'general', fillLevel: 12, name: 'City Hall Bin', lastEmptied: '1 hour ago' },
  { id: 8, lat: 51.509, lng: -0.092, type: 'recycling', fillLevel: 91, name: 'Station Recycling Hub', lastEmptied: '3 days ago' },
];

function MapUpdater({ selectedFilter }) {
  const map = useMap();
  
  useEffect(() => {
    // Animate map when filter changes
    map.setView([51.505, -0.09], 13, { animate: true, duration: 1 });
  }, [selectedFilter, map]);

  return null;
}

function InteractiveMap({ selectedFilter }) {
  const [filteredBins, setFilteredBins] = useState(mockBins);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedFilter === 'all') {
      setFilteredBins(mockBins);
    } else {
      setFilteredBins(mockBins.filter(bin => bin.type === selectedFilter));
    }
  }, [selectedFilter]);

  const handleGetDirections = (bin) => {
    toast({
      title: "🗺️ Navigation",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  const handleReportIssue = (bin) => {
    toast({
      title: "📝 Report Issue",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
    });
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'recycling': return 'Recycling';
      case 'organic': return 'Organic Waste';
      case 'general': return 'General Waste';
      default: return 'Unknown';
    }
  };

  const getStatusColor = (fillLevel) => {
    if (fillLevel >= 80) return 'text-red-400';
    if (fillLevel >= 60) return 'text-amber-400';
    return 'text-green-400';
  };

  const getStatusText = (fillLevel) => {
    if (fillLevel >= 80) return 'Nearly Full';
    if (fillLevel >= 60) return 'Half Full';
    return 'Available';
  };

  return (
    <div className="h-96 w-full rounded-2xl overflow-hidden shadow-2xl">
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater selectedFilter={selectedFilter} />
        
        {filteredBins.map((bin) => (
          <Marker
            key={bin.id}
            position={[bin.lat, bin.lng]}
            icon={createBinIcon(bin.type, bin.fillLevel)}
          >
            <Popup className="custom-popup">
              <div className="p-2 min-w-[250px]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg text-green-400">{bin.name}</h3>
                  <span className={`text-sm font-medium ${getStatusColor(bin.fillLevel)}`}>
                    {getStatusText(bin.fillLevel)}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Type:</span>
                    <span className="text-sm font-medium">{getTypeLabel(bin.type)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Fill Level:</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-slate-600 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            bin.fillLevel >= 80 ? 'bg-red-500' : 
                            bin.fillLevel >= 60 ? 'bg-amber-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${bin.fillLevel}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{bin.fillLevel}%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Last Emptied:</span>
                    <span className="text-sm">{bin.lastEmptied}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => handleGetDirections(bin)}
                  >
                    <Navigation className="w-3 h-3 mr-1" />
                    Directions
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 border-amber-500 text-amber-400 hover:bg-amber-500/20"
                    onClick={() => handleReportIssue(bin)}
                  >
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Report
                  </Button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default InteractiveMap;
