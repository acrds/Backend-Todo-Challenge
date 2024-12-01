import { Router } from "express";
import { createProject, deleteProject, listProjectsByUser, createProjectPlan } from "../controllers/projectController";
import authenticateToken from "../middlewares/authMiddleware";
const router = Router();


/**
 * @swagger
 * /api/projects/:
 *   post:
 *     summary: Create a new project
 *     description: Creates a new task project for a user.
 *     tags:
 *       - Projects
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                  type: string
 *               description:
 *                  type: string
 *             example:
 *               name: "My project"
 *               description: "This is a project description."
 *     responses:
 *       201:
 *         description: Project created successfully.
 *       400:
 *         description: Missing required fields.
 */
router.post("/", authenticateToken, createProject);


/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Delete a project
 *     description: Deletes a project by its ID.
 *     tags:
 *       - Projects
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The project ID.
 *     responses:
 *       200:
 *         description: project deleted successfully.
 *       404:
 *         description: project not found.
 */
router.delete("/:id", authenticateToken, deleteProject);

/**
 * @swagger
 * /api/projects/:
 *   get:
 *     summary: List projects for the user
 *     description: Retrieves all projects created by a specific user.
 *     tags:
 *       - Projects
 *     responses:
 *       200:
 *         description: List of projects.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: No projects found for the user.
 */
router.get("/", authenticateToken, listProjectsByUser);

/**
 * @swagger
 * /api/projects/plan/{id}:
 *   get:
 *     summary: Generate a project plan
 *     description: Creates a plan for a specific project by selecting tasks to work on based on current states.
 *     tags:
 *       - Projects
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the project
 *         required: true
 *         schema:
 *           type: integer
 *       - name: ModelType
 *         in: header
 *         description: Type of the model to be used for generating the plan.
 *         required: true
 *         schema:
 *           type: string
 *           example: "ibm-watson"
 *     responses:
 *       200:
 *         description: Successfully generated the project plan.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 planAnnotated:
 *                   type: object
 *                   properties:
 *                     dayTitle:
 *                       type: string
 *                       description: Title of the day's plan.
 *                     daySummary:
 *                       type: string
 *                       description: Summary of the day's plan.
 *                     tasks:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             description: ID of the task.
 *                           name:
 *                             type: string
 *                             description: Name of the task.
 *                           currentState:
 *                             type: string
 *                             description: Current state of the task.
 *       400:
 *         description: Project has no tasks.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Project has no tasks.
 *       404:
 *         description: Project not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Project not found.
 *       500:
 *         description: Error occurred while generating the project plan.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error retrieving project plan.
 *                 error:
 *                   type: string
 */
router.get("/plan/:id", authenticateToken, createProjectPlan);

export default router;