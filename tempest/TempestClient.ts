import { fetch } from "bun";
import type { TempestResponse, TempestWeatherData } from "./types";
const { TEMPEST_TOKEN } = process.env;


const BASE_API= "https://swd.weatherflow.com/swd/rest/observations/station";


const headers: Record<string, string> = {
  'user-agent': "tempest-weather/1.0",
  'token': TEMPEST_TOKEN || "",
};

async function getObservations<T>(stationId: number): Promise <TempestResponse | null> {
  try {
    const response = await fetch(`${BASE_API}/${stationId}?token=${TEMPEST_TOKEN}`, {
      headers
    });
      if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as TempestResponse;
  } catch (error) {
    console.error("Error making Tempest request:", error);
    return null;
  }
}

async function getForecast<T>(stationId: number): Promise <TempestWeatherData | null> {
  // For forecast, we need to adjust the API and parameters
  const FORECAST_API = "https://swd.weatherflow.com/swd/rest/better_forecast";

  // Construct GET parameters for forecast
  const params = new URLSearchParams({
    station_id: stationId.toString(),
    token: TEMPEST_TOKEN || "",
    units_temp: "f",      // fahrenheit
    units_wind: "mph",    // miles per hour
    units_pressure: "mb", // millibars
    units_precip: "in",   // inches
    units_distance: "mi"  // miles
  });

  // Adjust the BASE_API to use the forecast endpoint
  const url = `${FORECAST_API}?${params.toString()}`;

  try {
    const response = await fetch(url, {
      headers
    });
      if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as TempestWeatherData;
  } catch (error) {
    console.error("Error making Tempest request:", error);
    return null;
  }
}

export {
  getObservations,
  getForecast,
};
