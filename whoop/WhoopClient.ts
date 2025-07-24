import { fetch } from "bun";
import type { WhoopUserResponse, WhoopRecoveryResponse, WhoopWorkoutResponse, WhoopSleepResponse } from "./types";

const { WHOOP_TOKEN } = process.env;

const BASE_API = "https://api.prod.whoop.com/developer/v2";

const headers: Record<string, string> = {
  'User-Agent': "mcp-tools-whoop/1.0",
  'Authorization': `Bearer ${WHOOP_TOKEN || ""}`,
  'Content-Type': 'application/json',
};

async function getUser(): Promise<WhoopUserResponse | null> {
  try {
    const response = await fetch(`${BASE_API}/user/profile/basic`, {
      headers
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return (await response.json()) as WhoopUserResponse;
  } catch (error) {
    console.error("Error making Whoop user request:", error);
    return null;
  }
}

async function getRecovery(start?: string, end?: string, limit: number = 25): Promise<WhoopRecoveryResponse | null> {
  const params = new URLSearchParams({
    limit: limit.toString(),
  });

  if (start) params.append('start', start);
  if (end) params.append('end', end);

  try {
    const response = await fetch(`${BASE_API}/recovery?${params.toString()}`, {
      headers
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return (await response.json()) as WhoopRecoveryResponse;
  } catch (error) {
    console.error("Error making Whoop recovery request:", error);
    return null;
  }
}

async function getWorkouts(start?: string, end?: string, limit: number = 25): Promise<WhoopWorkoutResponse | null> {
  const params = new URLSearchParams({
    limit: limit.toString(),
  });

  if (start) params.append('start', start);
  if (end) params.append('end', end);

  try {
    const response = await fetch(`${BASE_API}/activity/workout?${params.toString()}`, {
      headers
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return (await response.json()) as WhoopWorkoutResponse;
  } catch (error) {
    console.error("Error making Whoop workout request:", error);
    return null;
  }
}

async function getSleep(start?: string, end?: string, limit: number = 25): Promise<WhoopSleepResponse | null> {
  const params = new URLSearchParams({
    limit: limit.toString(),
  });

  if (start) params.append('start', start);
  if (end) params.append('end', end);

  try {
    const response = await fetch(`${BASE_API}/activity/sleep?${params.toString()}`, {
      headers
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return (await response.json()) as WhoopSleepResponse;
  } catch (error) {
    console.error("Error making Whoop sleep request:", error);
    return null;
  }
}

async function getCycles(start?: string, end?: string, limit: number = 25): Promise<any | null> {
  const params = new URLSearchParams({
    limit: limit.toString(),
  });

  if (start) params.append('start', start);
  if (end) params.append('end', end);

  try {
    const response = await fetch(`${BASE_API}/cycle?${params.toString()}`, {
      headers
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error making Whoop cycles request:", error);
    return null;
  }
}

export {
  getUser,
  getRecovery,
  getWorkouts,
  getSleep,
  getCycles
};
