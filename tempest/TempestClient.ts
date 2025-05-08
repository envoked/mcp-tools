import { fetch } from "bun";
import type { TempestResponse } from "./types";
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

export {
  getObservations
};
