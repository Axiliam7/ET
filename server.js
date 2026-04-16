const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3007;
const HOST = "0.0.0.0";
const ATLAS_URI = process.env.MONGODB_URI || ""; // e.g. mongodb+srv://...
const LOCAL_URI = "mongodb://127.0.0.1:27017/prime_time";

let dbConnected = false;
let progressCache = {};
let ProgressModel = null;

async function connectToMongoWithFallback() {
  let lastError = null;
  let triedLocal = false;
  for (let attempt = 1; attempt <= 3; attempt++) {
    let uri = (!triedLocal && ATLAS_URI) ? ATLAS_URI : LOCAL_URI;
    if (uri === LOCAL_URI) triedLocal = true;
    try {
      console.log(`[DB] Attempting connect to: ${uri}`);
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 7000,
        socketTimeoutMS: 10000,
        tls: uri !== LOCAL_URI,
        ssl: uri !== LOCAL_URI
      });
      dbConnected = true;
      console.log(`[DB] Connected to: ${uri}`);
      ProgressModel = mongoose.model(
        "Progress",
        new mongoose.Schema(
          {
            saveKey: { type: String, required: true, unique: true },
            data: { type: Object, required: true }
          },
          { timestamps: true }
        )
      );
      return;
    } catch (err) {
      lastError = err;
      dbConnected = false;
      console.warn(`[DB] Failed connect (attempt ${attempt}) to ${uri}: ${err.message}`);
      if (attempt === 3 && !dbConnected) {
        console.warn(`[DB] All attempts failed. Running in NO-DB mode.`);
      }
    }
  }
}

// INIT
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[API] ${req.method} ${req.url} @ ${new Date().toISOString()}`);
  next();
});

// ===== HEALTH =====
app.get("/health", (req, res) => {
  res.json({ status: "ok", db: dbConnected ? "connected" : "disconnected" });
});

// ===== API ROUTES =====

// /api/progress/save
app.post("/api/progress/save", async (req, res) => {
  const key = req.body.saveKey || "default";
  const data = req.body.data;
  if (!data) return res.status(400).json({ ok: false, error: "Missing 'data' field" });
  if (dbConnected && ProgressModel) {
    try {
      await ProgressModel.findOneAndUpdate(
        { saveKey: key },
        { saveKey: key, data },
        { upsert: true, new: true }
      );
      console.log(`[PROGRESS][DB] Saved for ${key}`);
      res.json({ ok: true, db: true });
      return;
    } catch (e) {
      console.warn(`[PROGRESS][DB] ERROR for saveKey ${key}: ${e.message}`);
      res.status(500).json({ ok: false, db: true, error: e.message });
      return;
    }
  } else {
    progressCache[key] = data;
    console.log(`[PROGRESS][MEM] Saved for ${key} (NO DB)`);
    res.json({ ok: true, db: false });
  }
});

// /api/progress/load
app.get("/api/progress/load", async (req, res) => {
  const key = req.query.saveKey || "default";
  if (dbConnected && ProgressModel) {
    try {
      const rec = await ProgressModel.findOne({ saveKey: key });
      if (rec) {
        console.log(`[PROGRESS][DB] Loaded for ${key}`);
        res.json({ ok: true, data: rec.data, db: true });
        return;
      } else {
        res.json({ ok: false, error: "Not found", db: true });
        return;
      }
    } catch (e) {
      console.warn(`[PROGRESS][DB] ERROR for load ${key}: ${e.message}`);
      res.status(500).json({ ok: false, db: true, error: e.message });
      return;
    }
  } else {
    if (progressCache[key]) {
      console.log(`[PROGRESS][MEM] Loaded for ${key}`);
      res.json({ ok: true, data: progressCache[key], db: false });
    } else {
      res.json({ ok: false, db: false, error: "Not found" });
    }
  }
});

// ===== FRONTEND SERVE =====
const clientBuildDir = path.join(__dirname, "client/build");
const distDir = path.join(__dirname, "dist");
const frontendDir = fs.existsSync(clientBuildDir) ? clientBuildDir : distDir;

app.use(express.static(frontendDir));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendDir, "index.html"));
});

// ====== LAUNCH ======
app.listen(PORT, HOST, async () => {
  console.log(`\n🚀 Server running at http://${HOST}:${PORT}/`);
  await connectToMongoWithFallback();
});

process.on("SIGINT", async () => {
  if (dbConnected) {
    await mongoose.disconnect();
    console.log("[SIGINT] Mongo disconnected");
  }
  process.exit(0);
});
process.on("SIGTERM", async () => {
  if (dbConnected) {
    await mongoose.disconnect();
    console.log("[SIGTERM] Mongo disconnected");
  }
  process.exit(0);
});
