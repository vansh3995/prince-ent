"use client";
import { useState } from "react";

// Enhanced TypeScript interfaces
interface TrackingEvent {
  id: string;
  timestamp: string;
  status: string;
  location: string;
  description: string;
}

interface ParcelData {
  awb: string;
  status: 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'exception';
  sender: {
    name: string;
    address: string;
    phone?: string;
  };
  recipient: {
    name: string;
    address: string;
    phone?: string;
  };
  package: {
    weight: number;
    dimensions?: string;
    contents?: string;
  };
  estimatedDelivery?: string;
  actualDelivery?: string;
  currentLocation?: string;
  events: TrackingEvent[];
  createdAt: string;
}

interface ApiResponse {
  success: boolean;
  parcel?: ParcelData;
  message?: string;
}

export default function TrackBookingPage() {
  const [awb, setAwb] = useState<string>("");
  const [parcel, setParcel] = useState<ParcelData | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Enhanced tracking function with better error handling
  const handleTrack = async (): Promise<void> => {
    if (!awb.trim()) {
      setError("Please enter a tracking number");
      return;
    }

    // Basic AWB format validation
    if (awb.length < 8) {
      setError("Tracking number should be at least 8 characters long");
      return;
    }

    setError("");
    setParcel(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/track/${encodeURIComponent(awb.trim())}`);
      const data: ApiResponse = await res.json();
      
      if (res.ok && data.success && data.parcel) {
        setParcel(data.parcel);
      } else {
        setError(data.message || "Parcel not found! Please check your tracking number.");
      }
    } catch (err) {
      console.error('Tracking error:', err);
      setError("Unable to connect to tracking service. Please check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && !loading) {
      handleTrack();
    }
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const getStatusColor = (status: string): string => {
      switch (status.toLowerCase()) {
        case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
        case 'out_for_delivery': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'in_transit': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'picked_up': return 'bg-purple-100 text-purple-800 border-purple-200';
        case 'exception': return 'bg-red-100 text-red-800 border-red-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(status)}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  // Format date helper
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Track Your Parcel
          </h1>
          <p className="text-lg text-gray-600">
            Enter your AWB/Tracking number to get real-time updates
          </p>
        </div>

        {/* Tracking Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Enter AWB/Tracking Number (e.g., PE123456789)"
              value={awb}
              onChange={(e) => setAwb(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              disabled={loading}
              maxLength={20}
            />
            <button
              onClick={handleTrack}
              disabled={loading || !awb.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 min-w-[120px] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Tracking...
                </div>
              ) : (
                "Track Parcel"
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
            <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Enhanced Tracking Result */}
        {parcel && (
          <div className="space-y-6">
            {/* Parcel Overview */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Tracking Details</h2>
                <StatusBadge status={parcel.status} />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">AWB Number</h3>
                    <p className="text-lg font-mono font-semibold text-gray-900">{parcel.awb}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Current Location</h3>
                    <p className="text-gray-900">{parcel.currentLocation || 'Processing Center'}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Package Details</h3>
                    <p className="text-gray-900">Weight: {parcel.package.weight}kg</p>
                    {parcel.package.dimensions && (
                      <p className="text-gray-900">Dimensions: {parcel.package.dimensions}</p>
                    )}
                    {parcel.package.contents && (
                      <p className="text-gray-900">Contents: {parcel.package.contents}</p>
                    )}
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Sender</h3>
                    <p className="text-gray-900 font-medium">{parcel.sender.name}</p>
                    <p className="text-gray-600 text-sm">{parcel.sender.address}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Recipient</h3>
                    <p className="text-gray-900 font-medium">{parcel.recipient.name}</p>
                    <p className="text-gray-600 text-sm">{parcel.recipient.address}</p>
                  </div>

                  {parcel.estimatedDelivery && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        {parcel.status === 'delivered' ? 'Delivered On' : 'Estimated Delivery'}
                      </h3>
                      <p className="text-gray-900">
                        {formatDate(parcel.actualDelivery || parcel.estimatedDelivery)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Tracking History</h3>
              
              <div className="space-y-4">
                {parcel.events.map((event, index) => (
                  <div key={event.id} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`w-4 h-4 rounded-full ${index === 0 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{event.status}</p>
                        <p className="text-sm text-gray-500">{formatDate(event.timestamp)}</p>
                      </div>
                      <p className="text-sm text-gray-600">{event.location}</p>
                      <p className="text-sm text-gray-500">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Need Help?</h3>
              <div className="grid sm:grid-cols-2 gap-4 text-blue-800">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                  <span>support@princeent.com</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                  </svg>
                  <span>+91-XXXXX-XXXXX</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        {!parcel && !error && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">How to Track:</h3>
            <ul className="text-blue-800 space-y-2">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                Enter your AWB/Tracking number in the field above
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                Click "Track Parcel" or press Enter to search
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                View real-time status and detailed tracking history
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                Contact support if you need additional assistance
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}