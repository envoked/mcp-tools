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

type TempestForecastDaily = {
  air_temp_high: number;
  air_temp_low: number;
  conditions: string;
  day_num: number;
  day_start_local: number;
  icon: string;
  month_num: number;
  precip_icon: string;
  precip_probability: number;
  precip_type: string;
  sunrise: number;
  sunset: number;
};

type TempestForecastHourly = {
  air_temperature: number;
  conditions: string;
  feels_like: number;
  icon: string;
  local_day: number;
  local_hour: number;
  precip: number;
  precip_icon: string;
  precip_probability: number;
  precip_type: string;
  relative_humidity: number;
  sea_level_pressure: number;
  station_pressure: number;
  time: number;
  uv: number;
  wind_avg: number;
  wind_direction: number;
  wind_direction_cardinal: string;
  wind_gust: number;
};

type TempestForecast = {
  daily: TempestForecastDaily[];
  hourly: TempestForecastHourly[];
};

type TempestCurrentConditions = {
  air_density: number;
  air_temperature: number;
  brightness: number;
  conditions: string;
  delta_t: number;
  dew_point: number;
  feels_like: number;
  icon: string;
  is_precip_local_day_rain_check: boolean;
  is_precip_local_yesterday_rain_check: boolean;
  lightning_strike_count_last_1hr: number;
  lightning_strike_count_last_3hr: number;
  lightning_strike_last_distance: number;
  lightning_strike_last_distance_msg: string;
  lightning_strike_last_epoch: number;
  precip_accum_local_day: number;
  precip_accum_local_yesterday: number;
  precip_minutes_local_day: number;
  precip_minutes_local_yesterday: number;
  precip_probability: number;
  pressure_trend: string;
  relative_humidity: number;
  sea_level_pressure: number;
  solar_radiation: number;
  station_pressure: number;
  time: number;
  uv: number;
  wet_bulb_globe_temperature: number;
  wet_bulb_temperature: number;
  wind_avg: number;
  wind_direction: number;
  wind_direction_cardinal: string;
  wind_gust: number;
};

type TempestStation = {
  agl: number;
  elevation: number;
  is_station_online: boolean;
  state: number;
  station_id: number;
};

type TempestUnits = {
  units_air_density: string;
  units_brightness: string;
  units_distance: string;
  units_other: string;
  units_precip: string;
  units_pressure: string;
  units_solar_radiation: string;
  units_temp: string;
  units_wind: string;
};

type TempestWeatherData = {
  current_conditions: TempestCurrentConditions;
  forecast: TempestForecast;
  latitude: number;
  location_name: string;
  longitude: number;
  source_id_conditions: number;
  station: TempestStation;
  status: {
    status_code: number;
    status_message: string;
  };
  timezone: string;
  timezone_offset_minutes: number;
  units: TempestUnits;
};

export type {
  TempestResponse,
  TempestWeatherData,
}
