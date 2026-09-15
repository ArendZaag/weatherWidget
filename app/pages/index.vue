<script setup>
const { data, pending, error } = WeatherData()

const currentTemp = computed(() => {
  const temp = data.value?.timelines?.minutely?.[0]?.values?.temperature
  return typeof temp === 'number' ? Math.round(temp) : null
})

const dailyForecast = computed(() => {
  const days = data.value?.timelines?.daily ?? []
  return days.slice(0, 6).map((day) => ({
    date: new Date(day.time).toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'short' }),
    temp: Math.round(day.values.temperatureAvg),
    wind: Math.round(day.values.windSpeedAvg),
    humidity: Math.round(day.values.humidityAvg),
    clouds: Math.round(day.values.cloudCoverAvg),
  }))
})
</script>

<template>
  <main class="layout">
    <section class="content">
      <h1>Ballonvaarten in Nederland</h1>
      <p>Vertrek vanaf aller soorten plekken en geniet van een vlucht boven het Nederlandse landschap.</p>
      <p>output van de weather api als test:</p>

      <div class="map-box">
        <img src="/kaart.png" alt="Kaart van Nederland" />
        <p class="map-caption">doe alsof dit de plekken aangeeft (het gaat om de widget)</p>
      </div>

      <!-- <div class="api-debug">
        <p v-if="pending">Data wordt geladen...</p>
        <p v-else-if="error">Fout bij ophalen: {{ error.message }}</p>
        <template v-else>
          <p class="current-temp">Nu: <strong>{{ currentTemp }}°C</strong></p>

          <table class="forecast-table">
            <thead>
              <tr>
                <th>Dag</th>
                <th>Temp (gem.)</th>
                <th>Wind (gem.)</th>
                <th>Vochtigheid (gem.)</th>
                <th>Bewolking (gem.)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="day in dailyForecast" :key="day.date">
                <td>{{ day.date }}</td>
                <td>{{ day.temp }}°C</td>
                <td>{{ day.wind }} m/s</td>
                <td>{{ day.humidity }}%</td>
                <td>{{ day.clouds }}%</td>
              </tr>
            </tbody>
          </table>
        </template>
      </div>
      <div>
        <pre> {{ data }}</pre>
      </div> -->
    </section>

    <aside class="widget-slot">
      <WeatherWidget />
    </aside>
  </main>
</template>

<style lang="scss" scoped>
.layout {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(340px, 0.8fr);
  gap: 2.5rem;
  width: min(1180px, calc(100% - 3rem));
  margin: 0 auto;
  padding: 3.5rem 0;

  .content {
    min-width: 0;

    h1 {
      max-width: 720px;
      margin: 0 0 0.75rem;
      font-size: clamp(2.2rem, 5vw, 4rem);
      line-height: 1.05;
      letter-spacing: -0.045em;
    }

    > p {
      max-width: 680px;
      margin: 0.45rem 0;
      color: #667085;
    }
  }
}

.map-box {
  margin-top: 2rem;

  img {
    display: block;
    width: min(100%, 620px);
    height: auto;
    border: 1px solid #e5eaf1;
    border-radius: 18px;
    box-shadow: 0 12px 32px rgba(23, 32, 51, 0.08);
  }

  .map-caption {
    margin: 0.65rem 0 0;
    color: #98a2b3;
    font-size: 0.8rem;
    font-style: italic;
  }
}

.api-debug {
  margin-top: 2rem;

  .current-temp {
    font-size: 1.15rem;
  }
}

.forecast-table {
  width: 100%;
  max-width: 760px;
  overflow: hidden;
  border-collapse: separate;
  border-spacing: 0;
  border: 1px solid #e5eaf1;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(23, 32, 51, 0.05);

  th,
  td {
    padding: 0.75rem 0.9rem;
    border-bottom: 1px solid #eef1f5;
    text-align: left;
  }

  th {
    background: #f8fafc;
    color: #475467;
    font-size: 0.78rem;
  }

  td {
    color: #344054;
    font-size: 0.82rem;
  }

  tr:last-child td {
    border-bottom: 0;
  }
}

.widget-slot {
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

pre {
  max-width: 100%;
  overflow: auto;
  padding: 1rem;
  border-radius: 12px;
  background: #111827;
  color: #d1d5db;
  font-size: 0.7rem;
}

@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
    width: min(700px, calc(100% - 2rem));
    padding: 2rem 0;
  }

  .widget-slot {
    justify-content: stretch;

    :deep(.widget) {
      width: 100%;
      margin: 0 auto;
    }
  }
}

@media (max-width: 600px) {
  .layout {
    width: min(100% - 1.25rem, 700px);
  }

  .forecast-table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
}
</style>