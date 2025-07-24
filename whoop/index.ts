import { getWorkouts } from "./WhoopClient";

(async () => {
  const res = await getWorkouts();
  console.log(res);
})();
