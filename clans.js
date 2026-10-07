const fs = require("fs");
const path = require("path");
const config = require("./config");
const log = require("./logger");

let cache = null;
let cacheAt = 0;
const TTL = 60_000;

function normalize(s) {
  return String(s || "")
    .normalize("NFKC")
    .replace(/[\u200B-\u200D\uFEFF\uFE0E\uFE0F]/g, "")
    .trim();
}

function loadClans() {
  const now = Date.now();
  if (cache && now - cacheAt < TTL) return cache;
  const file = path.join(config.paths.data, "clans.json");
  try {
    cache = JSON.parse(fs.readFileSync(file, "utf8"));
    if (!Array.isArray(cache.clans)) cache.clans = [];
  } catch (e) {
    log.warn(`clans.json not loaded: ${e.message}`);
    cache = { clans: [] };
  }
  cacheAt = now;
  return cache;
}

function saveClans(data) {
  const file = path.join(config.paths.data, "clans.json");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, file);
  cache = data;
  cacheAt = Date.now();
}

function matchName(displayName) {
  if (!displayName || typeof displayName !== "string") return [];
  const name = normalize(displayName);
  const { clans } = loadClans();
  const matches = [];
  for (const clan of clans) {
    if (!clan?.tag) continue;
    const tag = normalize(clan.tag);
    if (tag && name.includes(tag)) matches.push({ ...clan, method: "exact" });
  }
  return matches;
}

function confidence(matches) {
  if (!matches.length) return 0;
  return matches.some(m => m.method === "exact") ? 98 : 0;
}

function addClan(clan) {
  if (!clan?.name || !clan?.tag) throw new Error("Clan name and tag are required.");
  const data = loadClans();
  data.clans = data.clans.filter(c => normalize(c.tag) !== normalize(clan.tag));
  data.clans.push({
    name: String(clan.name).trim(),
    tag: String(clan.tag).trim(),
    description: String(clan.description || "").trim(),
    members: Number.isFinite(Number(clan.members)) ? Number(clan.members) : 0,
    age: clan.age || "unknown",
    threat: clan.threat || "UNKNOWN",
  });
  saveClans(data);
}

function removeClan(tag) {
  const data = loadClans();
  data.clans = data.clans.filter(c => normalize(c.tag) !== normalize(tag));
  saveClans(data);
}

function listClans() { return loadClans().clans; }

module.exports = { matchName, confidence, addClan, removeClan, listClans, loadClans };
