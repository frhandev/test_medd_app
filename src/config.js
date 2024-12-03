export const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "add your theia server side url";
console.log("API_URL :", API_URL);
