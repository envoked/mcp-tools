const miio = require('miio');

(async () => {
  try {
    const device = await miio.device({ address: '192.168.0.250' });
    console.log(device);
  } catch (error) {
    console.error('Error connecting to the device:', error);
  }
})();
