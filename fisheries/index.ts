import Bun from "bun";
import { FisheriesClient } from "./lib/FisheriesClient";
const { FISHERIES_USERNAME, FISHERIES_PASSWORD } = Bun.env;

(async () => {
  if (!FISHERIES_USERNAME || !FISHERIES_PASSWORD) {
    console.error("Please set FISHERIES_USERNAME and FISHERIES_PASSWORD environment variables");
    process.exit(1);
  }

  try {
    // Import and initialize the FisheriesClient
    const client = new FisheriesClient();

    // Login with credentials from environment variables
    console.log("Logging in to Fisheries service...");
    await client.login({ email: FISHERIES_USERNAME, password: FISHERIES_PASSWORD });

    // Get orders
    console.log("Fetching orders...");
    const orders = await client.getOrders();

    // Display the orders
    console.log(`Retrieved ${orders.length} orders:`);
    console.log(JSON.stringify(orders, null, 2));
    // Get order details
    const  orderNumber = orders[0]?.orderNumber;
    console.log(`Retrieving details for orderNumber: ${orderNumber}`);
  if (orderNumber) {
    const orderDetails = await client.getOrderDetails(orderNumber);
    console.log(orderDetails);
  }




  } catch (error) {
    console.error("Error:", error.message);
  }
})();
