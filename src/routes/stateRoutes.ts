import { Router } from "express";
import { createState, listStates, deleteState } from "../controllers/stateController";
import authenticateToken from "../middlewares/authMiddleware";

const router = Router();

/**
 * @swagger
 * /api/states:
 *   post:
 *     summary: Create a new state
 *     description: Adds a new state to the system.
 *     tags:
 *       - States
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "In Progress"
 *               color:
 *                 type: string
 *                 example: "#FF5733"
 *               slug:
 *                 type: string
 *                 example: "in-progress"
 *             required:
 *               - name
 *               - color
 *               - slug
 *     responses:
 *       201:
 *         description: State created successfully.
 *       400:
 *         description: Missing required fields.
 *       500:
 *         description: Server error.
 */
router.post("/", authenticateToken, createState);

/**
 * @swagger
 * /api/states:
 *   get:
 *     summary: List all states
 *     description: Retrieves all states in the system.
 *     tags:
 *       - States
 *     responses:
 *       200:
 *         description: A list of states.
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
 *                     example: "In Progress"
 *                   color:
 *                     type: string
 *                     example: "#FF5733"
 *                   slug:
 *                     type: string
 *                     example: "in-progress"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Server error.
 */
router.get("/", authenticateToken, listStates);

/**
 * @swagger
 * /api/states/{id}:
 *   delete:
 *     summary: Delete a state
 *     description: Deletes a state by its ID.
 *     tags:
 *       - States
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the state to delete.
 *     responses:
 *       200:
 *         description: State deleted successfully.
 *       404:
 *         description: State not found.
 *       500:
 *         description: Server error.
 */
router.delete("/:id", authenticateToken, deleteState);


export default router;
