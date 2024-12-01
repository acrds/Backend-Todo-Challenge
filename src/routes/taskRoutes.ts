import { Router } from "express";
import { 
    createTask, listTasksByProject, archiveTask, 
    generateTaskDescription, generateTaskDescriptionById, 
    updateTask,proposeTask
} from "../controllers/taskController";
import authenticateToken from "../middlewares/authMiddleware";

const router = Router();

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     description: Creates a new task associated with a project. The user creator is inferred from the JWT.
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "My Task"
 *               description:
 *                 type: string
 *                 example: "This is a task description."
 *               projectId:
 *                 type: integer
 *                 example: 1
 *             required:
 *               - name
 *               - projectId
 *     responses:
 *       201:
 *         description: Task created successfully.
 *       400:
 *         description: Missing required fields.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Server error.
 */
router.post("/", authenticateToken, createTask);

/**
 * @swagger
 * /api/tasks/gen-description-by-id:
 *   post:
 *     summary: Generate a task description
 *     description: Uses OpenAI GPT to generate a detailed description for a task based on its name.
 *     tags:
 *       - Tasks
 *     parameters:
 *       - name: ModelType
 *         in: header
 *         description: Type of the model to be used for generating the plan.
 *         required: true
 *         schema:
 *           type: string
 *           example: "ibm-watson"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taskId:
 *                 type: integer
 *                 example: 1
 *             required:
 *               - taskId
 *     responses:
 *       200:
 *         description: Task description generated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Task description generated successfully."
 *                 description:
 *                   type: string
 *                   example: "Set up the database to store user data efficiently."
 *       400:
 *         description: Task id is missing.
 *       500:
 *         description: Server error.
 */
router.post("/gen-description-by-id", authenticateToken, generateTaskDescriptionById);

/**
 * @swagger
 * /api/tasks/gen-description:
 *   post:
 *     summary: Generate a task description
 *     description: Uses OpenAI GPT to generate a detailed description for a task based on its name and context.
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: ModelType
 *         in: header
 *         description: Type of the model to be used for generating the plan.
 *         required: true
 *         schema:
 *           type: string
 *           example: "ibm-watson"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taskName:
 *                 type: string
 *                 example: "My Task"
 *               taskDescription:
 *                 type: string
 *                 example: "This is a task description."
 *               projectId:
 *                 type: integer
 *                 example: 1
 *             required:
 *               - taskName
 *               - projectId
 *     responses:
 *       200:
 *         description: Task description generated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Task description generated successfully."
 *                 description:
 *                   type: string
 *                   example: "Set up the database to store user data efficiently."
 *       400:
 *         description: Task id is missing.
 *       500:
 *         description: Server error.
 */
router.post("/gen-description", authenticateToken, generateTaskDescription);

/**
 * @swagger
 * /api/tasks/project/{projectId}:
 *   get:
 *     summary: List tasks of a project
 *     description: Retrieves all tasks associated with a specific project.
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the project.
 *     responses:
 *       200:
 *         description: A list of tasks.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "My Task"
 *                   description:
 *                     type: string
 *                     example: "This is a task description."
 *                   isArchived:
 *                     type: boolean
 *                     example: false
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: Project not found.
 *       500:
 *         description: Server error.
 */
router.get("/project/:projectId", authenticateToken, listTasksByProject);

/**
 * @swagger
 * /api/tasks/{id}/archive:
 *   patch:
 *     summary: Archive a task
 *     description: Archives a task by setting its archived flag to true.
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the task to archive.
 *     responses:
 *       200:
 *         description: Task archived successfully.
 *       404:
 *         description: Task not found.
 *       500:
 *         description: Server error.
 */
router.patch("/:id/archive", authenticateToken, archiveTask);

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task
 *     description: Updates the name and/or description of an existing task.
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the task to update.
 *       - in: query
 *         name: taskName
 *         required: false
 *         schema:
 *           type: string
 *         description: The new name of the task.
 *       - in: query
 *         name: taskDescription
 *         required: false
 *         schema:
 *           type: string
 *         description: The new description of the task.
 *     responses:
 *       200:
 *         description: Task updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Task updated successfully."
 *                 task:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Updated Task Name"
 *                     description:
 *                       type: string
 *                       example: "Updated description for the task."
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Invalid input or missing required fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid input or missing required fields."
 *       404:
 *         description: Task not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Task not found."
 *       500:
 *         description: Error updating task.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error updating task."
 *                 error:
 *                   type: object
 *                   additionalProperties: true
 */
router.put("/:id", authenticateToken, updateTask);

/**
 * @swagger
 * /api/tasks/propose:
 *   post:
 *     summary: Propose a task
 *     description: Propose a task using AI.
 *     tags:
 *       - Tasks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: ModelType
 *         in: header
 *         description: Type of the model to be used for generating the plan.
 *         required: true
 *         schema:
 *           type: string
 *           example: "ibm-watson"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projectId:
 *                  type: integer
 *             example:
 *               projectId: 1
 *     responses:
 *       200:
 *         description: Task updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Task updated successfully."
 *                 task:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Updated Task Name"
 *                     description:
 *                       type: string
 *                       example: "Updated description for the task."
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 */
router.post("/propose", authenticateToken, proposeTask);

export default router;
