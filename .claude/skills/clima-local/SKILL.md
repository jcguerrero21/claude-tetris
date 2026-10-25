---
name: clima-local
description: Obtiene el clima actual y el pronóstico de 3 días de la ubicación local del usuario (detectada por IP) o de una ciudad indicada. Úsala cuando pregunte por el clima, el tiempo, la temperatura, si lloverá o /clima-local.
argument-hint: "[ciudad]"
allowed-tools: Bash(node .claude/skills/clima-local/scripts/clima.js*)
---

# Clima local

Consulta Open-Meteo (gratis, sin API key) con el script incluido.

## Pasos

1. Ejecuta desde la raíz del proyecto:
   - Ubicación por IP: `node .claude/skills/clima-local/scripts/clima.js`
   - Ciudad concreta (si el usuario la menciona o pasa `$ARGUMENTS`): `node .claude/skills/clima-local/scripts/clima.js "<ciudad>"`
2. Resume el resultado en español, breve: condición, temperatura (y sensación), viento, y si va a llover en los próximos días.
3. Si la ubicación por IP no coincide con donde está el usuario (VPN, red corporativa), dilo y ofrece repetir con una ciudad.

## Notas

- Requiere Node 18+ (usa `fetch`) y conexión a internet.
- Si el script falla (`Error: ...`), muestra el mensaje y sugiere indicar la ciudad manualmente.
- Unidades: °C, km/h, mm (por defecto de Open-Meteo).
