import ProtectClient from "./lib/ProtectClient";
import ProtectLegacyClient from "./lib/ProtectLegacyClient";
import Bun from "bun";

const { UNIFI_USERNAME, UNIFI_PASSWORD } = Bun.env;

(async () => {
  let client = new ProtectLegacyClient('https://192.168.0.1', UNIFI_USERNAME, UNIFI_PASSWORD);
  const isLogin = await client.login();
  if (isLogin) {
    let res = await client.searchDetections('smartDetectType:vehicle', 10, 0, 'DESC');
    let events = await res.json();
    console.log(events);
  }
})();
