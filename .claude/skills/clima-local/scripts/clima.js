#!/usr/bin/env node
// Consulta el clima actual y el pronóstico de 3 días con Open-Meteo (sin API key).
// Uso: node clima.js [ciudad]   -> sin ciudad, se localiza por IP.

const WMO = {
  0: 'Despejado', 1: 'Mayormente despejado', 2: 'Parcialmente nublado', 3: 'Nublado',
  45: 'Niebla', 48: 'Niebla con escarcha',
  51: 'Llovizna ligera', 53: 'Llovizna moderada', 55: 'Llovizna intensa',
  56: 'Llovizna helada ligera', 57: 'Llovizna helada intensa',
  61: 'Lluvia ligera', 63: 'Lluvia moderada', 65: 'Lluvia intensa',
  66: 'Lluvia helada ligera', 67: 'Lluvia helada intensa',
  71: 'Nevada ligera', 73: 'Nevada moderada', 75: 'Nevada intensa', 77: 'Granos de nieve',
  80: 'Chubascos ligeros', 81: 'Chubascos moderados', 82: 'Chubascos violentos',
  85: 'Chubascos de nieve ligeros', 86: 'Chubascos de nieve intensos',
  95: 'Tormenta', 96: 'Tormenta con granizo ligero', 99: 'Tormenta con granizo fuerte',
};

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} en ${new URL(url).host}`);
  return res.json();
}

async function ubicacion(ciudad) {
  if (ciudad) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(ciudad)}&count=1&language=es`;
    const r = (await getJson(url)).results?.[0];
    if (!r) throw new Error(`No se encontró la ciudad "${ciudad}"`);
    return { lat: r.latitude, lon: r.longitude, nombre: [r.name, r.admin1, r.country].filter(Boolean).join(', ') };
  }
  const ip = await getJson('https://ipwho.is/');
  if (!ip.success) throw new Error('No se pudo localizar por IP; indica una ciudad como argumento');
  return { lat: ip.latitude, lon: ip.longitude, nombre: [ip.city, ip.region, ip.country].filter(Boolean).join(', ') + ' (por IP)' };
}

function direccion(grados) {
  const pts = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
  return pts[Math.round(grados / 45) % 8];
}

async function main() {
  const ciudad = process.argv.slice(2).join(' ').trim();
  const { lat, lon, nombre } = await ubicacion(ciudad);
  const url = 'https://api.open-meteo.com/v1/forecast'
    + `?latitude=${lat}&longitude=${lon}&timezone=auto&forecast_days=3`
    + '&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,wind_direction_10m'
    + '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max';
  const d = await getJson(url);
  const c = d.current, u = d.current_units;

  console.log(`Clima en ${nombre}  [${lat.toFixed(2)}, ${lon.toFixed(2)}]`);
  console.log(`Ahora (${c.time.replace('T', ' ')}): ${WMO[c.weather_code] ?? 'Código ' + c.weather_code}`);
  console.log(`  Temperatura: ${c.temperature_2m}${u.temperature_2m} (sensación ${c.apparent_temperature}${u.apparent_temperature})`);
  console.log(`  Humedad: ${c.relative_humidity_2m}${u.relative_humidity_2m}`);
  console.log(`  Viento: ${c.wind_speed_10m} ${u.wind_speed_10m} del ${direccion(c.wind_direction_10m)}`);
  console.log(`  Precipitación: ${c.precipitation} ${u.precipitation}`);
  console.log('Próximos días:');
  d.daily.time.forEach((dia, i) => {
    console.log(`  ${dia}: ${WMO[d.daily.weather_code[i]] ?? '?'}, `
      + `${d.daily.temperature_2m_min[i]}–${d.daily.temperature_2m_max[i]}${d.daily_units.temperature_2m_max}, `
      + `lluvia ${d.daily.precipitation_probability_max[i]}%`);
  });
}

main().catch((e) => { console.error(`Error: ${e.message}`); process.exit(1); });
