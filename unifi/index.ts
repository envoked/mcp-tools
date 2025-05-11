import ProtectClient from "./lib/ProtectClient";
(async () => {
  let res = await ProtectClient.getSnapshot('66fd86f201bf2903e40022d0');
  const data = await res.arrayBuffer()
  const base64String = Buffer.from(data).toString('base64');
  console.log(base64String);
})();
