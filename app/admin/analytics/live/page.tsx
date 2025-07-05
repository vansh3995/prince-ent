"use client"

import { useState, useEffect } from 'react'
import { Truck, Package, DollarSign, TrendingUp, Users, MapPin } from 'lucide-react'

interface AnalyticsData {
  totalBookings: number
  activeShipments: number
  revenue: number
  growthRate: number
  onlineUsers: number
  recentBookings: Array<{
    id: string
    origin: string
    destination: string
    status: string
    timestamp: string
  }>
  systemHealth: {
    cpu: number
    memory: number
    storage: number
    network: number
  }
}

export default function LiveAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData>({
    totalBookings: 0,
    activeShipments: 0,
    revenue: 0,
    growthRate: 0,
    onlineUsers: 0,
    recentBookings: [],
    systemHealth: {
      cpu: 0,
      memory: 0,
      storage: 0,
      network: 0
    }
  })
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => ({
        ...prevData,
        totalBookings: Math.floor(Math.random() * 1000) + 500,
        activeShipments: Math.floor(Math.random() * 50) + 25,
        revenue: Math.floor(Math.random() * 100000) + 50000,
        growthRate: Math.floor(Math.random() * 20) + 5,
        onlineUsers: Math.floor(Math.random() * 100) + 50,
        recentBookings: [
          { id: 'BK001', origin: 'Mumbai', destination: 'Delhi', status: 'In Transit', timestamp: '2 min ago' },
          { id: 'BK002', origin: 'Bangalore', destination: 'Chennai', status: 'Delivered', timestamp: '5 min ago' },
          { id: 'BK003', origin: 'Pune', destination: 'Hyderabad', status: 'Picked Up', timestamp: '8 min ago' },
          { id: 'BK004', origin: 'Kolkata', destination: 'Guwahati', status: 'Pending', timestamp: '12 min ago' },
        ],
        systemHealth: {
          cpu: Math.floor(Math.random() * 50) + 30,
          memory: Math.floor(Math.random() * 40) + 40,
          storage: Math.floor(Math.random() * 30) + 20,
          network: Math.floor(Math.random() * 20) + 70
        }
      }))
      setIsConnected(true)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const getHealthBarClasses = (value: number): string => {
    if (value < 50) return 'bg-green-500'
    if (value < 80) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const StatCard = ({ title, value, icon: Icon, color, change }: {
    title: string
    value: string | number
    icon: React.ComponentType<{ className?: string }>
    color: string
    change?: string
  }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  )

  const HealthBar = ({ label, value }: { label: string; value: number }) => {
    const widthPercentage = Math.min(value, 100)
    const barClasses = getHealthBarClasses(value)
    
    return (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm text-gray-500">{value}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full transition-all duration-500 ${barClasses} health-bar`}
            data-width={widthPercentage}
          ></div>
        </div>
      </div>
    )
  }

  return (
    <>
      <style jsx>{`
        .health-bar {
          width: ${data.systemHealth.cpu}%;
        }
        .health-bar[data-width] {
          width: attr(data-width, %);
        }
      `}</style>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Live Analytics</h1>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Bookings"
            value={data.totalBookings.toLocaleString()}
            icon={Package}
            color="bg-blue-500"
            change="+12%"
          />
          <StatCard
            title="Active Shipments"
            value={data.activeShipments}
            icon={Truck}
            color="bg-green-500"
            change="+8%"
          />
          <StatCard
            title="Revenue"
            value={`₹${data.revenue.toLocaleString()}`}
            icon={DollarSign}
            color="bg-yellow-500"
            change="+15%"
          />
          <StatCard
            title="Growth Rate"
            value={`${data.growthRate}%`}
            icon={TrendingUp}
            color="bg-purple-500"
            change="+3%"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
            <div className="space-y-4">
              <HealthBar label="CPU Usage" value={data.systemHealth.cpu} />
              <HealthBar label="Memory Usage" value={data.systemHealth.memory} />
              <HealthBar label="Storage Usage" value={data.systemHealth.storage} />
              <HealthBar label="Network Usage" value={data.systemHealth.network} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-time Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">Online Users</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">{data.onlineUsers}</span>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Activity</h4>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    New booking from Mumbai to Delhi
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    Shipment delivered in Bangalore
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                    Payment received for order #12345
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.recentBookings.map((booking, index) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {booking.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                        {booking.origin} → {booking.destination}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        booking.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        booking.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                        booking.status === 'Picked Up' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {booking.timestamp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}