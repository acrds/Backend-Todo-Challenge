import { Router } from "express";
import { createComment, updateComment, deleteComment, respondComment } from "../controllers/commentController";
import authenticateToken from "../middlewares/authMiddleware";

const router = Router();

/**
 * @swagger
 * /api/comments:
 *   post:
 *     summary: Create a new comment
 *     description: Adds a comment to a specific task. The user is inferred from the JWT.
 *     tags:
 *       - Comments
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
 *               text:
 *                 type: string
 *                 example: "This is a comment."
 *             required:
 *               - taskId
 *               - text
 *     responses:
 *       201:
 *         description: Comment created successfully.
 *       400:
 *         description: Missing required fields.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Task not found.
 *       500:
 *         description: Server error.
 */
router.post("/", authenticateToken, createComment);

/**
 * @swagger
 * /api/comments/{id}:
 *   put:
 *     summary: Update a comment
 *     description: Updates the text of a specific comment.
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the comment to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 example: "Updated comment text."
 *             required:
 *               - text
 *     responses:
 *       200:
 *         description: Comment updated successfully.
 *       400:
 *         description: Missing required fields.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Comment not found.
 *       500:
 *         description: Server error.
 */
router.put("/:id", authenticateToken, updateComment);

/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     summary: Delete a comment
 *     description: Deletes a specific comment.
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the comment to delete.
 *     responses:
 *       200:
 *         description: Comment deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Comment not found.
 *       500:
 *         description: Server error.
 */
router.delete("/:id", authenticateToken, deleteComment);


/**
 * @swagger
 * /api/comments/{commentId}/respond:
 *   get:
 *     summary: Respond a comment
 *     description: Responds to a specific comment.
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the comment to respond.
 *       - name: ModelType
 *         in: header
 *         description: Type of the model to be used for generating the plan.
 *         required: true
 *         schema:
 *           type: string
 *           example: "ibm-watson"
 *     responses:
 *       200:
 *         description: Comment responded successfully.
 *       400:
 *         description: Missing required fields.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Comment not found.
 */
router.get("/:commentId/respond", authenticateToken, respondComment);

export default router;
