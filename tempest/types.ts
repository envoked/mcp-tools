// Common status type
type TempestStatus = {
  status_code: number;
  status_message: string;
};

// Common location type
type TempestLocation = {
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_offset_minutes: number;
};

// Common precipitation type
type TempestPrecipitation = {
  precip: number;
  precip_accum_local_day: number;
  precip_accum_local_yesterday: number;
  precip_minutes_local_day: number;
  precip_minutes_local_yesterday: number;
};

// Common wind type
type TempestWind = {
  wind_avg: number;
  wind_direction: number;
  wind_gust: number;
  wind_lull?: number;
};

// Common pressure type
type TempestPressure = {
  station_pressure: number;
  sea_level_pressure: number;
  pressure_trend: string;
};

// Observation type
type TempestObservation = TempestPrecipitation &
  TempestWind &
  TempestPressure & {
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
    relative_humidity: number;
    solar_radiation: number;
    timestamp: number;
    uv: number;
    wet_bulb_globe_temperature: number;
    wet_bulb_temperature: number;
    wind_chill: number;
  };

// Current conditions type
type TempestCurrentConditions = TempestPrecipitation &
  TempestWind &
  TempestPressure & {
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
    precip_probability: number;
    relative_humidity: number;
    solar_radiation: number;
    time: number;
    uv: number;
    wet_bulb_globe_temperature: number;
    wet_bulb_temperature: number;
    wind_direction_cardinal: string;
  };

// Forecast types
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

type TempestForecastHourly = TempestWind &
  TempestPressure & {
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
    time: number;
    uv: number;
    wind_direction_cardinal: string;
  };

type TempestForecast = {
  daily: TempestForecastDaily[];
  hourly: TempestForecastHourly[];
};

// Units type
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

// Weather data type
type TempestWeatherData = TempestLocation & {
  current_conditions: TempestCurrentConditions;
  forecast: TempestForecast;
  source_id_conditions: number;
  station: TempestStation;
  status: TempestStatus;
  units: TempestUnits;
  location_name: string;
};

// Device-related types
type TempestDeviceMeta = {
  agl: number;
  environment: 'indoor' | 'outdoor';
  name: string;
  wifi_network_name: string;
};

type TempestDeviceSettings = {
  show_precip_final: boolean;
};

type TempestDevice = {
  device_id: number;
  device_meta: TempestDeviceMeta;
  device_settings?: TempestDeviceSettings;
  device_type: string;
  firmware_revision: string;
  hardware_revision: string;
  location_id: number;
  serial_number: string;
};

// Station-related types
type TempestStation = {
  agl: number;
  elevation: number;
  is_station_online: boolean;
  state: number;
  station_id: number;
};

type TempestStationItem = {
  device_id: number;
  item: string;
  location_id: number;
  location_item_id: number;
  sort?: number;
  station_id: number;
  station_item_id: number;
};

type TempestStationMeta = {
  elevation: number;
  share_with_wf: boolean;
  share_with_wu: boolean;
};

type TempestStationInfo = TempestLocation & {
  created_epoch: number;
  devices: TempestDevice[];
  is_local_mode: boolean;
  last_modified_epoch: number;
  location_id: number;
  name: string;
  public_name: string;
  state: number;
  station_id: number;
  station_items: TempestStationItem[];
  station_meta: TempestStationMeta;
};

type TempestStationsResponse = {
  stations: TempestStationInfo[];
  status: TempestStatus;
};

// Response types
type TempestResponse = TempestLocation & {
  status: TempestStatus;
  elevation: number;
  is_public: boolean;
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
};

export type {
  TempestResponse,
  TempestWeatherData,
  TempestStationsResponse,
};
