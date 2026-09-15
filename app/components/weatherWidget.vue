<script setup>
const LOCATIONS = [
  { value: 'heerenveen', label: 'Heerenveen' },
  { value: 'amsterdam', label: 'Amsterdam' },
  { value: 'joure', label: 'Joure' },
  { value: 'groningen', label: 'Groningen' },
  { value: 'utrecht', label: 'Utrecht' },
  { value: 'zwolle', label: 'Zwolle' },
  { value: 'london', label: 'London' },
  { value: 'newyork', label: 'New York' },
  { value: 'tokyo', label: 'Tokyo' },
]

const selectedLocation = ref('heerenveen')
const { data, pending, error } = WeatherData(selectedLocation)

const currentValues = computed(() => data.value?.timelines?.minutely?.[0]?.values ?? {})

const currentTemp = computed(() => {
  const temp = currentValues.value.temperature
  return typeof temp === 'number' ? Math.round(temp) : null
})

const weatherCode = computed(() => currentValues.value.weatherCode ?? null)

const currentWind = computed(() => {
  const wind = currentValues.value.windSpeed
  return typeof wind === 'number' ? Math.round(wind) : null
})

const currentHumidity = computed(() => {
  const humidity = currentValues.value.humidity
  return typeof humidity === 'number' ? Math.round(humidity) : null
})

const currentClouds = computed(() => {
  const clouds = currentValues.value.cloudCover
  return typeof clouds === 'number' ? Math.round(clouds) : null
})

const isDay = computed(() => {
  const hour = new Date().getHours()
  return hour >= 6 && hour < 20
})

const iconSrc = computed(() => {
  if (weatherCode.value === null) return null
  return `/icons/${weatherCode.value * 10 + (isDay.value ? 0 : 1)}.png`
})

function onIconError(event) {
  if (weatherCode.value === null) return
  const dayIcon = `/icons/${weatherCode.value * 10}.png`

  if (event.target.src.endsWith(dayIcon)) {
    event.target.style.visibility = 'hidden'
    return
  }

  event.target.src = dayIcon
}

function onDayIconError(event) {
  event.target.style.visibility = 'hidden'
}

const selectedLabel = computed(() => {
  return LOCATIONS.find((loc) => loc.value === selectedLocation.value)?.label ?? selectedLocation.value
})

const dailyForecast = computed(() => {
  const days = data.value?.timelines?.daily ?? []

  return days.slice(1, 7).map((day) => {
    const code = day.values.weatherCodeMax ?? day.values.weatherCodeMin ?? null

    return {
      date: new Date(day.time).toLocaleDateString('nl-NL', { weekday: 'short' }),
      temp: typeof day.values.temperatureAvg === 'number' ? Math.round(day.values.temperatureAvg) : null,
      icon: code !== null ? `/icons/${code * 10}.png` : null,
    }
  })
})
</script>

<template>
  <section class="widget" aria-label="Weersverwachting">
    <div class="widget__topbar">
      <div>
        <span class="widget__eyebrow">WEERSVERWACHTING</span>
        <h2 class="widget__title">Vliegweer</h2>
      </div>

      <label class="location-picker">
        <span class="sr-only">Kies een locatie</span>
        <select v-model="selectedLocation" class="location-picker__select">
          <option v-for="loc in LOCATIONS" :key="loc.value" :value="loc.value">
            {{ loc.label }}
          </option>
        </select>
      </label>
    </div>

    <div v-if="pending" class="status status--loading">
      <span class="status__spinner" aria-hidden="true"></span>
      <span>Weerdata laden...</span>
    </div>

    <div v-else-if="error" class="status status--error">
      <strong>Weerdata niet beschikbaar.</strong>
      <span>Probeer over een moment opnieuw.</span>
    </div>

    <div v-else-if="currentTemp === null" class="status">
      Geen temperatuurdata beschikbaar.
    </div>

    <template v-else>
      <div class="current-weather">
        <div class="current-weather__icon-wrap">
          <img
            v-if="iconSrc"
            :src="iconSrc"
            @error="onIconError"
            alt=""
            class="current-weather__icon"
          />
        </div>

        <div class="current-weather__reading">
          <span class="current-weather__temp">{{ currentTemp }}<sup>°C</sup></span>
          <span class="current-weather__location">
            Nu in <strong>{{ selectedLabel }}</strong>
          </span>
        </div>
      </div>

      <div class="stats" aria-label="Huidige omstandigheden">
        <div class="stat">
          <span class="stat__icon" aria-hidden="true">↗</span>
          <span class="stat__content">
            <strong>{{ currentWind ?? '–' }} m/s</strong>
            <small>Wind</small>
          </span>
        </div>

        <div class="stat">
          <span class="stat__icon" aria-hidden="true">◌</span>
          <span class="stat__content">
            <strong>{{ currentHumidity ?? '–' }}%</strong>
            <small>Vochtigheid</small>
          </span>
        </div>

        <div class="stat">
          <span class="stat__icon" aria-hidden="true">☁</span>
          <span class="stat__content">
            <strong>{{ currentClouds ?? '–' }}%</strong>
            <small>Bewolking</small>
          </span>
        </div>
      </div>

      <div class="forecast">
        <div class="forecast__heading">
          <span>Komende dagen</span>
          <span>Gem. temp.</span>
        </div>

        <div class="forecast__days">
          <div v-for="day in dailyForecast" :key="day.date" class="forecast-day">
            <span class="forecast-day__date">{{ day.date }}</span>

            <span class="forecast-day__icon">
              <img
                v-if="day.icon"
                :src="day.icon"
                @error="onDayIconError"
                alt=""
              />
            </span>

            <strong class="forecast-day__temp">{{ day.temp ?? '–' }}°</strong>
          </div>
        </div>
      </div>
    </template>

    <p class="widget__source">Actuele gegevens via Tomorrow.io</p>
  </section>
</template>

<style lang="scss" scoped>
$primary: #2563eb;
$primary-dark: #1d4ed8;
$ink: #172033;
$muted: #667085;
$border: #e5eaf1;
$surface: #ffffff;
$soft-blue: #eff6ff;

.widget {
  position: relative;
  overflow: hidden;
  width: min(100%, 440px);
  min-height: 430px;
  padding: 1.5rem;
  border: 1px solid rgba(229, 234, 241, 0.9);
  border-radius: 22px;
  background:
    radial-gradient(circle at 85% 10%, rgba(147, 197, 253, 0.42), transparent 30%),
    linear-gradient(145deg, #fff 0%, #f8fbff 100%);
  box-shadow: 0 18px 50px rgba(23, 32, 51, 0.12);
  color: $ink;

  &::before {
    position: absolute;
    top: -80px;
    right: -80px;
    width: 180px;
    height: 180px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.65);
    content: "";
    pointer-events: none;
  }

  &__topbar {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
  }

  &__eyebrow {
    display: block;
    margin-bottom: 0.2rem;
    color: $primary;
    font-size: 0.68rem;
    font-weight: 800;
    letter-spacing: 0.12em;
  }

  &__title {
    margin: 0;
    font-size: 1.35rem;
    line-height: 1.15;
  }

  &__source {
    margin: 1rem 0 0;
    color: #98a2b3;
    font-size: 0.65rem;
    text-align: right;
  }
}

.location-picker {
  flex-shrink: 0;

  &__select {
    min-width: 115px;
    padding: 0.55rem 2rem 0.55rem 0.75rem;
    border: 1px solid $border;
    border-radius: 10px;
    outline: none;
    background: $surface;
    color: $ink;
    cursor: pointer;
    font-size: 0.8rem;
    font-weight: 600;
    transition: border-color 160ms ease, box-shadow 160ms ease;

    &:hover,
    &:focus {
      border-color: rgba($primary, 0.55);
      box-shadow: 0 0 0 3px rgba($primary, 0.1);
    }
  }
}

.current-weather {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem 0 1.5rem;

  &__icon-wrap {
    display: grid;
    width: 94px;
    height: 94px;
    place-items: center;
    border-radius: 28px;
    background: linear-gradient(145deg, #eff6ff, #dbeafe);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
  }

  &__icon {
    width: 76px;
    height: 76px;
    object-fit: contain;
  }

  &__reading {
    display: flex;
    flex-direction: column;
  }

  &__temp {
    font-size: clamp(3.25rem, 12vw, 4.25rem);
    font-weight: 800;
    letter-spacing: -0.07em;
    line-height: 0.9;

    sup {
      margin-left: 0.15rem;
      font-size: 1.35rem;
      font-weight: 700;
      letter-spacing: 0;
      vertical-align: top;
    }
  }

  &__location {
    margin-top: 0.7rem;
    color: $muted;
    font-size: 0.78rem;

    strong {
      color: $ink;
    }
  }
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  overflow: hidden;
  border: 1px solid $border;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.75);

  .stat {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    min-width: 0;
    padding: 0.85rem 0.7rem;

    & + .stat {
      border-left: 1px solid $border;
    }

    &__icon {
      display: grid;
      flex: 0 0 30px;
      width: 30px;
      height: 30px;
      place-items: center;
      border-radius: 9px;
      background: $soft-blue;
      color: $primary;
      font-size: 0.9rem;
      font-weight: 700;
    }

    &__content {
      display: flex;
      min-width: 0;
      flex-direction: column;

      strong {
        overflow: hidden;
        font-size: 0.75rem;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      small {
        margin-top: 0.1rem;
        color: $muted;
        font-size: 0.64rem;
      }
    }
  }
}

.forecast {
  margin-top: 1.15rem;

  &__heading {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.6rem;
    color: $muted;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.03em;
    text-transform: uppercase;
  }

  &__days {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 0.4rem;
  }
}

.forecast-day {
  display: flex;
  min-width: 0;
  flex-direction: column;
  align-items: center;
  padding: 0.65rem 0.2rem;
  border: 1px solid transparent;
  border-radius: 12px;
  transition: background 160ms ease, border-color 160ms ease, transform 160ms ease;

  &:hover {
    transform: translateY(-2px);
    border-color: $border;
    background: rgba(255, 255, 255, 0.8);
  }

  &__date {
    color: $muted;
    font-size: 0.68rem;
    font-weight: 700;
    text-transform: capitalize;
  }

  &__icon {
    display: grid;
    width: 34px;
    height: 34px;
    margin: 0.25rem 0;
    place-items: center;

    img {
      width: 30px;
      height: 30px;
      object-fit: contain;
    }
  }

  &__temp {
    font-size: 0.78rem;
  }
}

.status {
  display: flex;
  min-height: 260px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  color: $muted;
  font-size: 0.85rem;
  text-align: center;

  &--error strong {
    color: #b42318;
  }

  &__spinner {
    width: 28px;
    height: 28px;
    margin-bottom: 0.35rem;
    border: 3px solid #dbeafe;
    border-top-color: $primary;
    border-radius: 50%;
    animation: spin 700ms linear infinite;
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 520px) {
  .widget {
    padding: 1.1rem;
  }

  .current-weather {
    gap: 0.75rem;
    padding-top: 1.5rem;

    &__icon-wrap {
      width: 78px;
      height: 78px;
      border-radius: 22px;
    }

    &__icon {
      width: 64px;
      height: 64px;
    }
  }

  .stats .stat {
    flex-direction: column;
    gap: 0.3rem;
    text-align: center;

    &__content {
      align-items: center;
    }
  }

  .forecast {
    overflow-x: auto;
    padding-bottom: 0.2rem;

    &__days {
      min-width: 360px;
    }
  }
}
</style>
