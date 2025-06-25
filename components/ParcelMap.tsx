import { GoogleMap, Marker, Polyline, useJsApiLoader } from "@react-google-maps/api";

export function ParcelMap({ locations }: { locations: { lat: number, lng: number }[] }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  const { isLoaded } = useJsApiLoader({ 
    googleMapsApiKey: apiKey || ""
  });
  
  // If no API key, show placeholder
  if (!apiKey) {
    return (
      <div className="w-full h-[300px] bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 mb-2">📍 Map View</div>
          <div className="text-sm text-gray-400">Google Maps API key not configured</div>
          <div className="text-xs text-gray-400 mt-1">Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to .env.local</div>
        </div>
      </div>
    );
  }

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <GoogleMap center={locations[0]} zoom={5} mapContainerStyle={{ width: "100%", height: "300px" }}>
      {locations.map((loc, i) => (
        <Marker key={i} position={loc} />
      ))}
      <Polyline path={locations} options={{ strokeColor: "#1976D2" }} />
    </GoogleMap>
  );
}