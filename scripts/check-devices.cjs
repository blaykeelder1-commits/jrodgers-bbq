const API_KEY = 'UllXUzVETDlSV0xSRTVRSEczRThaU1lBNklBTkE3UDY6SlpLUTJYTkQ5ME5GUUhERzhIUkhBVVdDOElLU0Y2UlA=';
(async () => {
  const resp = await fetch('https://api.eposnowhq.com/api/v4/Device', {
    headers: { 'Authorization': 'Basic ' + API_KEY }
  });
  const devices = await resp.json();
  for (const d of devices) {
    console.log(`ID: ${d.Id} | Name: "${d.Name}" | Description: "${d.Description}"`);
  }
})();
