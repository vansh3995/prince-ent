import { GoogleMap, Marker, Polyline, useJsApiLoader } from "@react-google-maps/api";

export function ParcelMap({ locations }: { locations: { lat: number, lng: number }[] }) {
  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY" });

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