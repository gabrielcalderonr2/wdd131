// Footer Year & Last Modified (format nicely)
document.getElementById("year").textContent = new Date().getFullYear();
const lastModDate = new Date(document.lastModified);
document.getElementById("lastModified").textContent = isNaN(lastModDate)
  ? document.lastModified
  : lastModDate.toLocaleString();

// Weather & Wind Chill (static values shown on page)
const temp = parseFloat(document.getElementById("temp").textContent);
const wind = parseFloat(document.getElementById("wind").textContent);

function calculateWindChill(t, w) {
  // Celsius wind chill formula (single-line return)
  return (13.12 + 0.6215 * t - 11.37 * Math.pow(w, 0.16) + 0.3965 * t * Math.pow(w, 0.16)).toFixed(1);
}

let chill = "N/A";
if (temp <= 10 && wind > 4.8) {
  chill = calculateWindChill(temp, wind) + " °C";
}
document.getElementById("chill").textContent = chill;
