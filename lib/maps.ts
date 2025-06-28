import { Client } from '@googlemaps/google-maps-services-js'

const mapsClient = new Client({})

export async function optimizeRoute(waypoints: string[]) {
  const response = await mapsClient.directions({
    params: {
      origin: waypoints[0],
      destination: waypoints[waypoints.length - 1],
      waypoints: waypoints.slice(1, -1),
      optimize: true,
      key: process.env.GOOGLE_MAPS_API_KEY!
    }
  })
  
  return response.data
}

export async function calculateDistance(origin: string, destination: string) {
  const response = await mapsClient.distancematrix({
    params: {
      origins: [origin],
      destinations: [destination],
      key: process.env.GOOGLE_MAPS_API_KEY!
    }
  })
  
  return response.data
}