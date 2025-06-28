"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

export default function LiveAnalytics() {
  const router = useRouter()
  
  type Alert = {
    id: string | number;
    type: string;
    message: string;
    timestamp: string | number | Date;
  };

  type LiveData = {
    currentBookings: { today: number; thisHour: number; trend: string };
    activeShipments: { inTransit: number; outForDelivery: number; delivered: number; delayed: number };
    liveRevenue: { today: number; target: number; percentage: number };
    systemHealth: Record<string, number>;
    alerts: Alert[];
    loading: boolean;
  };

  const [liveData, setLiveData] = useState<LiveData>({
    currentBookings: { today: 0, thisHour: 0, trend: 'stable' },
    activeShipments: { inTransit: 0, outForDelivery: 0, delivered: 0, delayed: 0 },
    liveRevenue: { today: 0, target: 50000, percentage: 0 },
    systemHealth: {},
    alerts: [],
    loading: true
  })

  useEffect(() => {
    fetchLiveData()
    
    // Update every 30 seconds
    const interval = setInterval(fetchLiveData, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const fetchLiveData = async () => {
    try {
      const response = await fetch('/api/admin/analytics/real-time')
      const data = await response.json()
      
      setLiveData({
        ...data,
        loading: false
      })
    } catch (error) {
      console.error('Failed to fetch live data:', error)
      setLiveData(prev => ({ ...prev, loading: false }))
    }
  }

  // Determine color classes based on health value
  const getHealthColorClass = (value: number) => {
    if (value >= 90) return styles.healthBarGreen;
    if (value >= 70) return styles.healthBarYellow;
    return styles.healthBarRed;
  };

  if (liveData.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className={styles.loadingSpinner}></div>
          <p className="mt-4 text-gray-600">Loading Live Data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🔴 Live Analytics</h1>
            <p className="text-gray-600 mt-2">Real-time business monitoring</p>
          </div>
          <div className="flex space-x-4">
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              🟢 Live - Updates every 30s
            </div>
            <button
              onClick={() => router.push('/admin/analytics')}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back to Analytics
            </button>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Today's Bookings */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Bookings</p>
                <p className="text-3xl font-bold text-gray-900">{liveData.currentBookings.today}</p>
                <p className="text-sm text-gray-500">This hour: {liveData.currentBookings.thisHour}</p>
              </div>
              <div className="text-3xl">📦</div>
            </div>
          </div>

          {/* Live Revenue */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Revenue</p>
                <p className="text-3xl font-bold text-gray-900">₹{(liveData.liveRevenue.today / 1000).toFixed(1)}K</p>
                <p className="text-sm text-gray-500">{liveData.liveRevenue.percentage}% of target</p>
              </div>
              <div className="text-3xl">💰</div>
            </div>
          </div>

          {/* In Transit */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Transit</p>
                <p className="text-3xl font-bold text-gray-900">{liveData.activeShipments.inTransit}</p>
                <p className="text-sm text-gray-500">Out for delivery: {liveData.activeShipments.outForDelivery}</p>
              </div>
              <div className="text-3xl">🚚</div>
            </div>
          </div>

          {/* Delivered Today */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Delivered Today</p>
                <p className="text-3xl font-bold text-gray-900">{liveData.activeShipments.delivered}</p>
                <p className="text-sm text-gray-500">Delayed: {liveData.activeShipments.delayed}</p>
              </div>
              <div className="text-3xl">✅</div>
            </div>
          </div>
        </div>

        {/* System Health & Live Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* System Health */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">🔧 System Health</h3>
            <div className="space-y-4">
              {Object.entries(liveData.systemHealth).map(([system, health]) => {
                const healthValue = typeof health === 'number' ? health : Number(health) || 0;
                
                return (
                  <div key={system} className="flex items-center justify-between">
                    <span className="capitalize text-sm font-medium">
                      {system.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <div className="flex items-center">
                      <div className={styles.healthBarContainer}>
                        <div 
                          className={`${styles.healthBar} ${getHealthColorClass(healthValue)} ${styles[`width${Math.round(healthValue)}`]}`}
                        />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">
                        {healthValue}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Alerts */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">🚨 Live Alerts</h3>
            <div className="space-y-3">
              {liveData.alerts && liveData.alerts.length > 0 ? (
                liveData.alerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className={`p-3 rounded-lg border-l-4 ${
                      alert.type === 'warning' 
                        ? 'bg-yellow-50 border-yellow-500' 
                        : alert.type === 'error'
                        ? 'bg-red-50 border-red-500'
                        : 'bg-blue-50 border-blue-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">
                          {alert.type === 'warning' ? '⚠️' : alert.type === 'error' ? '🚨' : 'ℹ️'}
                        </span>
                        <p className="font-medium text-sm">{alert.message}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">✅</div>
                  <p className="text-gray-500">No active alerts</p>
                  <p className="text-xs text-gray-400 mt-1">All systems operating normally</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Auto Refresh Indicator */}
        <div className="mt-8 flex justify-center">
          <div className="bg-white rounded-lg shadow-sm border px-4 py-2 flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Auto-refreshing every 30 seconds</span>
            <button
              onClick={fetchLiveData}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Refresh Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}