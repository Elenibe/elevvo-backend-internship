import express from "express";
import helmet from "helmet";
import cors from "cors";
import { config } from "./config";
import { observability } from "./middleware/observability";
import { apiLimiter } from "./middleware/rateLimiters";
import { authenticateToken } from "./middleware/authenticateToken";
import { authorizeRole } from "./middleware/authorizeRole";
import { notFound, errorHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";

const app = express();

app.use(observability);
app.use(helmet()); 


app.use(
  cors({
    origin: (origin, callback) => {
     
      if (!origin || config.corsOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(Object.assign(new Error("Not allowed by CORS"), { status: 403 }));
    },
  })
);

app.use(express.json({ limit: "10kb" })); 
app.use("/api", apiLimiter);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);


app.use("/api/admin", authenticateToken, authorizeRole("ADMIN"), adminRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;