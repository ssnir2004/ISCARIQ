import "dotenv/config";
import "express-async-errors";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { authRouter } from "./routes/auth.js";
import { requireAuth } from "./middleware/auth.js";
import { rfqRouter } from "./routes/rfqs.js";
import { projectRouter } from "./routes/projects.js";
import { drawingRouter } from "./routes/drawings.js";
import { orderRouter, productionOrderRouter } from "./routes/orders.js";
import { advisorRouter } from "./routes/advisor.js";
import {
  branchRouter,
  departmentRouter,
  teamRouter,
  materialRouter,
  problemTagRouter,
  insertRouter,
  cuttingConditionRouter,
  insertProblemMatchRouter,
} from "./routes/reference.js";

const app = express();
const PORT = Number(process.env.PORT ?? 4000);
const WEB_ORIGIN = process.env.WEB_ORIGIN ?? "http://localhost:5173";

app.use(cors({ origin: WEB_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRouter);

// Everything below requires an authenticated session.
app.use("/api", requireAuth);

app.use("/api/branches", branchRouter);
app.use("/api/departments", departmentRouter);
app.use("/api/teams", teamRouter);
app.use("/api/materials", materialRouter);
app.use("/api/problem-tags", problemTagRouter);
app.use("/api/inserts", insertRouter);
app.use("/api/cutting-conditions", cuttingConditionRouter);
app.use("/api/insert-problem-matches", insertProblemMatchRouter);

app.use("/api/rfqs", rfqRouter);
app.use("/api/projects", projectRouter);
app.use("/api/drawings", drawingRouter);
app.use("/api/orders", orderRouter);
app.use("/api/production-orders", productionOrderRouter);

app.use("/api/advisor", advisorRouter);

app.use("/api", (_req, res) => res.status(404).json({ error: "Not found" }));

// Serve the built web app (if present) so a single service can host both API and frontend.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WEB_DIST = path.resolve(__dirname, "../../web/dist");
if (fs.existsSync(WEB_DIST)) {
  app.use(express.static(WEB_DIST));
  app.get("*", (_req, res) => res.sendFile(path.join(WEB_DIST, "index.html")));
}

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`ISCARIQ API listening on http://localhost:${PORT}`);
});
