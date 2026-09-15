//eerst werd the api vanaf hier geroepen, nu wordt het gebruikt als een doorstroom om de key te verstoppen

//anders errors, zou niet moeten though
import { useFetch } from '#imports'

export function WeatherData(location) {
  const { data, pending, error } = useFetch('/api/weather', { query: { location } },)

  return { data, pending, error }
}
