"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ScatterChart, Scatter, FunnelChart, Funnel, LabelList
} from 'recharts'

export default function AdvancedAnalytics() {
  const router = useRouter()
  const [analytics, setAnalytics] = useState({
    revenueGrowth: [],
    routeEfficiency: [],
    customerSatisfaction: [],
    predictiveInsights: [],
    performanceMetrics: [],
    conversionFunnel: [],
    loading: true
  })

  useEffect(() => {
    fetchAdvancedAnalytics()
  }, [])

  const fetchAdvancedAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics/advanced')
      const data = await response.json()
      
      setAnalytics({
        revenueGrowth: data.revenueGrowth || [],
        routeEfficiency: data.routeEfficiency || [],
        customerSatisfaction: data.customerSatisfaction || [],
        predictiveInsights: data.predictiveInsights || [],
        performanceMetrics: data.performanceMetrics || [],
        conversionFunnel: data.conversionFunnel || [],
        loading: false
      })
    } catch (error) {
      console.error('Failed to fetch advanced analytics:', error)
      setAnalytics(prev => ({ ...prev, loading: false }))
    }
  }

  if (analytics.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading Advanced Analytics...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics</h1>
            <p className="text-gray-600 mt-2">Deep insights and predictive analysis</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => router.push('/admin/analytics')}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Basic Analytics
            </button>
            <button
              onClick={() => window.print()}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Export Report
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Revenue Growth</h3>
            <p className="text-3xl font-bold">+23.5%</p>
            <p className="text-sm opacity-90">vs last quarter</p>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Customer Satisfaction</h3>
            <p className="text-3xl font-bold">4.8/5</p>
            <p className="text-sm opacity-90">average rating</p>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Route Efficiency</h3>
            <p className="text-3xl font-bold">94.2%</p>
            <p className="text-sm opacity-90">optimal routes</p>
          </div>
        </div>

        {/* Advanced Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue Growth & Prediction */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Revenue Growth & Prediction</h3>
            {analytics.revenueGrowth && analytics.revenueGrowth.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={analytics.revenueGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="actual" fill="#8884d8" name="Actual Revenue" />
                  <Line type="monotone" dataKey="predicted" stroke="#ff7300" strokeWidth={3} name="Predicted" strokeDasharray="5 5" />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500 py-20">No revenue growth data available.</p>
            )}
          </div>

          {/* Route Efficiency Radar */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Route Performance Metrics</h3>
            {analytics.performanceMetrics && analytics.performanceMetrics.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <RadarChart data={analytics.performanceMetrics}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar name="Performance" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500 py-20">No performance metrics data available.</p>
            )}
          </div>

          {/* Customer Satisfaction Trend */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Customer Satisfaction Trend</h3>
            {analytics.customerSatisfaction && analytics.customerSatisfaction.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={analytics.customerSatisfaction}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="rating" stroke="#00C49F" fill="#00C49F" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="nps" stroke="#FF8042" fill="#FF8042" fillOpacity={0.4} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-500 py-20">No customer satisfaction data available.</p>
            )}
          </div>

          {/* Conversion Funnel */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Booking Conversion Funnel</h3>
              {analytics.conversionFunnel && analytics.conversionFunnel.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <FunnelChart>
                    <Tooltip />
                    <Funnel
                      dataKey="value"
                      data={analytics.conversionFunnel}
                      isAnimationActive
                    >
                      <LabelList position="center" fill="#fff" stroke="none" />
                    </Funnel>
                  </FunnelChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-gray-500 py-20">No conversion funnel data available.</p>
              )}
          </div>
        </div>

        {/* Predictive Insights */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-6">🤖 AI-Powered Insights & Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <span className="text-blue-600 text-xl mr-2">📈</span>
                <h4 className="font-semibold text-blue-900">Growth Opportunity</h4>
              </div>
              <p className="text-sm text-blue-800">Delhi-Mumbai route shows 35% potential for increased bookings. Consider promotional campaigns.</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <span className="text-green-600 text-xl mr-2">🎯</span>
                <h4 className="font-semibold text-green-900">Route Optimization</h4>
              </div>
              <p className="text-sm text-green-800">Optimize Bangalore-Chennai route to reduce delivery time by 12 hours and costs by 8%.</p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <span className="text-yellow-600 text-xl mr-2">⚠️</span>
                <h4 className="font-semibold text-yellow-900">Capacity Alert</h4>
              </div>
              <p className="text-sm text-yellow-800">Peak season demand predicted to increase by 40%. Consider expanding fleet capacity.</p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <span className="text-purple-600 text-xl mr-2">💰</span>
                <h4 className="font-semibold text-purple-900">Pricing Strategy</h4>
              </div>
              <p className="text-sm text-purple-800">Dynamic pricing could increase revenue by 15% during high-demand periods.</p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <span className="text-red-600 text-xl mr-2">🚨</span>
                <h4 className="font-semibold text-red-900">Risk Alert</h4>
              </div>
              <p className="text-sm text-red-800">Kolkata region showing increased delivery delays. Investigate infrastructure issues.</p>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <span className="text-indigo-600 text-xl mr-2">🤝</span>
                <h4 className="font-semibold text-indigo-900">Customer Retention</h4>
              </div>
              <p className="text-sm text-indigo-800">Implement loyalty program - 73% of customers likely to increase booking frequency.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}