import { Router } from "express";
import { createTaskState } from "../controllers/taskStateController";
import authenticateToken from "../middlewares/authMiddleware";

const router = Router();

/**
 * @swagger
 * /api/taskstates/:
 *   post:
 *     summary: Create a new TaskState
 *     description: Records a state change for a task. The user is inferred from the JWT.
 *     tags:
 *       - Task States
 *     security:
 *       - bearerAuth: []
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
 *               stateId:
 *                 type: integer
 *                 example: 2
 *             required:
 *               - taskId
 *               - stateId
 *     responses:
 *       201:
 *         description: TaskState created successfully.
 *       400:
 *         description: Missing required fields.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Task or State not found.
 *       500:
 *         description: Server error.
 */
router.post("/", authenticateToken, createTaskState);

export default router;
