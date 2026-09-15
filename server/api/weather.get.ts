import { ofetch } from 'ofetch'
import type { H3Event } from 'h3'
import { useRuntimeConfig, defineCachedEventHandler, getQuery, createError } from '#imports'

const THIRTY_MINUTES = 60 * 30

// Hardcoded plaatsen, moet handmatig meer worden
// elke locatie moet eigen 30 min timer hebben. (als niemand joure opzoekt hoeft ook geen call)
const LOCATIONS = {
  heerenveen: { lat: 52.9606, lon: 5.9205 },
  amsterdam: { lat: 52.3676, lon: 4.9041 },
  joure: { lat: 52.9656, lon: 5.8022 },
  groningen: { lat: 53.2194, lon: 6.5665 },
  utrecht: { lat: 52.0907, lon: 5.1214 },
  zwolle: { lat: 52.5168, lon: 6.0830 },
  london: { lat: 51.5074, lon: -0.1278 },
  newyork: { lat: 40.7128, lon: -74.0060 },
  tokyo: { lat: 35.6762, lon: 139.6503 },
} as const

type LocationKey = keyof typeof LOCATIONS
const DEFAULT_LOCATION: LocationKey = 'heerenveen'

function resolveLocationKey(event: H3Event): LocationKey {
  const raw = getQuery(event).location
  const key = typeof raw === 'string' ? raw.toLowerCase() : DEFAULT_LOCATION
  if (!(key in LOCATIONS)) {
    throw createError({ statusCode: 400, statusMessage: `Unknown location "${key}"` })
  }
  return key as LocationKey
}

export default defineCachedEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { lat, lon } = LOCATIONS[resolveLocationKey(event)]

  const data = await ofetch(
    `https://api.tomorrow.io/v4/weather/forecast?location=${lat},${lon}&apikey=${config.tomorrowApiKey}`
  )

  return data
}, {
    //dynamies gemaakt, dus geen hard code
  maxAge: THIRTY_MINUTES,
  name: 'weather-forecast',
  getKey: (event) => resolveLocationKey(event),
})
