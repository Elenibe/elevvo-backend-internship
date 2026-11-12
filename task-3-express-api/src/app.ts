import express from "express";
import { observability } from "./middleware/observability";
import { requireAPIKey } from "./middleware/requireApiKey";
import { notFound, errorHandler } from "./middleware/errorHandler";
import userRoutes from "./routes/user.routes";

const app = express();

app.use(observability);   
app.use(express.json()); 


app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});


app.use("/api/users", requireAPIKey, userRoutes);

app.use(notFound);      
app.use(errorHandler);  

export default app;