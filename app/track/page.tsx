"use client";
import { useState } from "react";

export default function TrackBookingPage() {
  const [awb, setAwb] = useState("");
  const [parcel, setParcel] = useState<any>(null);
  const [error, setError] = useState("");

  const handleTrack = async () => {
    setError("");
    setParcel(null);
    const res = await fetch(`/api/track/${awb}`);
    if (res.ok) {
      const data = await res.json();
      setParcel(data.parcel || data); // backend response ke hisab se
    } else {
      setError("Parcel not found!");
    }
  };

  return (
    <div className="max-w-xl mx-auto py-16">
      <h1 className="text-3xl font-bold mb-6">Track Your Parcel</h1>
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter AWB/Tracking Number"
          value={awb}
          onChange={(e) => setAwb(e.target.value)}
          className="border px-4 py-2 rounded w-full"
        />
        <button
          onClick={handleTrack}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Track
        </button>
      </div>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {parcel && (
        <div className="bg-white rounded shadow p-4">
          <div className="font-semibold mb-2">
            Status: {parcel.currentStatus || parcel.status}
          </div>
          <div className="mb-2">
            From: {parcel.origin} → To: {parcel.destination}
          </div>
          <div className="mb-2">AWB: {parcel.awb}</div>
          <div className="font-semibold mt-4 mb-2">Status History:</div>
          <ul className="list-disc pl-5">
            {(parcel.statusHistory || []).map((s: any, i: number) => (
              <li key={i}>
                <span className="font-medium">{s.status}</span> at{" "}
                <span>{s.location}</span> —{" "}
                <span className="text-xs text-gray-500">
                  {new Date(s.timestamp).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}