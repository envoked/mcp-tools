import ProtectLegacyClient from "./lib/ProtectLegacyClient";
import Bun from "bun";

const { UNIFI_USERNAME, UNIFI_PASSWORD } = Bun.env;

(async () => {

  if (!UNIFI_USERNAME|| !UNIFI_PASSWORD) {
    console.error("Please set FISHERIES_USERNAME and FISHERIES_PASSWORD environment variables");
    process.exit(1);
  }
  let client = new ProtectLegacyClient('https://192.168.0.1', UNIFI_USERNAME, UNIFI_PASSWORD);
  const isLogin = await client.login();
  if (isLogin) {
    let res = await client.searchDetections({
      label: 'vehicle',
      limit: 20,
      offset: 0,
      orderDirection: 'DESC',
      timeStart: '2025-05-13',
      timeEnd: '2025-05-14',
      devices: ['66fd86f201bf2903e40022d0'],
    });
    let events = await res.json();
    console.log(events);
  }
})();
