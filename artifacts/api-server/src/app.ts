import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes";
import { logger } from "./lib/logger";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api", router);

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  const staticPath = path.resolve(__dirname, "../../clothing-store/dist/public");
  app.use(express.static(staticPath));

  // Catch-all to serve the frontend for any other route (SPA support)
  app.get("*path", (req: Request, res: Response) => {
    // If it's an API route that wasn't matched above, return 404
    if (req.path.startsWith("/api")) {
      return res.status(404).json({ message: "API endpoint not found" });
    }
    return res.sendFile(path.join(staticPath, "index.html"));
  });
}

export default app;
