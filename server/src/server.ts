import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { init, all, create, get, update, remove } from "./db";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: ORIGIN }));
app.use(express.json());

init(); // initialize DB

app.get("/api/health", (_: Request, res: Response) => res.json({ ok: true }));

app.get("/api/entries", async (_: Request, res: Response) => {
  try {
    res.json(await all());
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/api/entries", async (req: Request, res: Response) => {
  try {
    const { id, name, pucks, tier, notes } = req.body;
    if (!id || !name || typeof pucks !== "number" || pucks < 0 || !tier) {
      return res
        .status(400)
        .json({ error: "id, name, pucks (>=0), and tier are required." });
    }
    const created = await create({ id, name, pucks, tier, notes });
    res.status(201).json(created);
  } catch (e: any) {
    const isUnique = /SQLITE_CONSTRAINT/.test(e.message);
    res
      .status(isUnique ? 409 : 500)
      .json({ error: isUnique ? "Id already exists" : e.message });
  }
});

app.get("/api/entries/:id", async (req: Request, res: Response) => {
  try {
    const row = await get(req.params.id);
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json(row);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.put("/api/entries/:id", async (req: Request, res: Response) => {
  try {
    const { name, pucks, tier, notes } = req.body;
    if (!name || typeof pucks !== "number" || pucks < 0 || !tier) {
      return res
        .status(400)
        .json({ error: "name, pucks (>=0), and tier are required." });
    }
    const existing = await get(req.params.id);
    if (!existing) return res.status(404).json({ error: "Not found" });
    await update(req.params.id, { name, pucks, tier, notes });
    const updated = await get(req.params.id);
    res.json(updated);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.delete("/api/entries/:id", async (req: Request, res: Response) => {
  try {
    const existing = await get(req.params.id);
    if (!existing) return res.status(404).json({ error: "Not found" });
    await remove(req.params.id);
    res.status(204).end();
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () =>
  console.log(`API listening on http://localhost:${PORT}`)
);
