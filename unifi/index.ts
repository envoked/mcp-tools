import ProtectClient from "./lib/ProtectClient";
import ProtectLegacyClient from './lib/ProtectLegacyClient';

const { UNIFI_USERNAME, UNIFI_PASSWORD } = process.env;

(async () => {
  let client = new ProtectLegacyClient('https://192.168.0.1', UNIFI_USERNAME, UNIFI_PASSWORD);
  const isLogin = await client.login();
  if (isLogin) {
    let res = await client.searchDetections('smartDetectType:vehicle', 10, 0, 'DESC');
    let events = await res.json();
    console.log(events);
  }
})();
