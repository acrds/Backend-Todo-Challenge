import express from "express";
import dotenv from "dotenv";
dotenv.config();

import swaggerUi from "swagger-ui-express";
import { AppDataSource } from "./src/data-source";
import { swaggerSpecs } from "./src/swagger";

import userRoutes from "./src/routes/userRoutes";
import projectRoutes from "./src/routes/projectRoutes";
import stateRoutes from "./src/routes/stateRoutes";
import taskRoutes from "./src/routes/taskRoutes";
import commentRoutes from "./src/routes/commentRoutes";
import taskStateRoutes from "./src/routes/taskStateRoutes";


const app = express();
const PORT = process.env.PORT || 3005;

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/states", stateRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/taskstates", taskStateRoutes);

// Start Server
AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is available. Use it on http://localhost:${PORT}/docs/`);
    });
  })
  .catch((error) => console.error("Error initializing Data Source", error));

// Export app for testing
export default app;