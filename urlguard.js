const dns = require("dns").promises;
const net = require("net");

function isPrivateIp(ip) {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split(".").map(Number);
    return a === 10 || a === 127 || a === 0 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168);
  }
  if (net.isIPv6(ip)) {
    const x = ip.toLowerCase();
    return x === "::1" || x === "::" || x.startsWith("fc") || x.startsWith("fd") || x.startsWith("fe80:");
  }
  return true;
}

async function assertSafeUrl(raw) {
  let u;
  try { u = new URL(raw); } catch { throw new Error("Invalid URL."); }
  if (!/^https?:$/.test(u.protocol)) throw new Error("Only http:// and https:// URLs are allowed.");
  if (u.username || u.password) throw new Error("URLs with embedded credentials are not allowed.");
  const host = u.hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local")) {
    throw new Error("Local/private hosts are not allowed.");
  }
  if (net.isIP(host)) {
    if (isPrivateIp(host)) throw new Error("Private/local IP addresses are not allowed.");
    return u;
  }
  let records;
  try { records = await dns.lookup(host, { all: true }); }
  catch { throw new Error("Host could not be resolved."); }
  if (!records.length || records.some(r => isPrivateIp(r.address))) {
    throw new Error("Host resolves to a private/local address and was blocked.");
  }
  return u;
}

module.exports = { assertSafeUrl };
