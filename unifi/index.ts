import ProtectClient from "./lib/ProtectClient";
import { DeviceResponse } from "./lib/types";
(async () => {
  let res:DeviceResponse = await ProtectClient.getClients('88f7af54-98f8-306a-a1c7-c9349722b1f6');
  console.log(res.data.map(d => (d.name)));
})();
