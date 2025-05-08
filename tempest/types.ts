type TempestObservation = {
  air_density: number;
  air_temperature: number;
  barometric_pressure: number;
  brightness: number;
  delta_t: number;
  dew_point: number;
  feels_like: number;
  heat_index: number;
  lightning_strike_count: number;
  lightning_strike_count_last_1hr: number;
  lightning_strike_count_last_3hr: number;
  lightning_strike_last_distance: number;
  lightning_strike_last_epoch: number;
  precip: number;
  precip_accum_last_1hr: number;
  precip_accum_local_day: number;
  precip_accum_local_day_final: number;
  precip_accum_local_yesterday: number;
  precip_accum_local_yesterday_final: number;
  precip_analysis_type_yesterday: number;
  precip_minutes_local_day: number;
  precip_minutes_local_yesterday: number;
  precip_minutes_local_yesterday_final: number;
  pressure_trend: string;
  relative_humidity: number;
  sea_level_pressure: number;
  solar_radiation: number;
  station_pressure: number;
  timestamp: number;
  uv: number;
  wet_bulb_globe_temperature: number;
  wet_bulb_temperature: number;
  wind_avg: number;
  wind_chill: number;
  wind_direction: number;
  wind_gust: number;
  wind_lull: number;
};

type TempestResponse = {
  status: {
    status_code: number;
    status_message: string;
  };
  elevation: number;
  is_public: boolean;
  latitude: number;
  longitude: number;
  obs: TempestObservation[];
  outdoor_keys: string[];
  public_name: string;
  station_id: number;
  station_name: string;
  station_units: {
    units_direction: string;
    units_distance: string;
    units_other: string;
    units_precip: string;
    units_pressure: string;
    units_temp: string;
    units_wind: string;
  };
  timezone: string;
};

export type {
  TempestResponse
}
