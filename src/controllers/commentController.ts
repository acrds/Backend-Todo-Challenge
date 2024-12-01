// src/controllers/commentController.ts
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Comment } from "../entities/Comment";
import { Task } from "../entities/Task";
import { prompt } from "../ai";

// Create a new comment
export const createComment = async (req: Request, res: Response): Promise<void> => {
  const { taskId, text, isFromAI } = req.body;

  if (!taskId || !text) {
    res.status(400).json({ message: "Task ID and text are required." });
    return;
  }

  var creator = req.user;
  if (isFromAI as boolean) {
    creator = null;
  }

  try {
    const taskRepository = AppDataSource.getRepository(Task);
    const task = await taskRepository.findOneBy({ id: taskId });

    if (!task) {
      res.status(404).json({ message: "Task not found." });
      return;
    }

    const commentRepository = AppDataSource.getRepository(Comment);
    const comment = commentRepository.create({
      text,
      task,
      user: creator,
    });

    await commentRepository.save(comment);

    res.status(201).json({ message: "Comment created successfully.", comment });
  } catch (error) {
    res.status(500).json({ message: "Error creating comment.", error });
  }
};

// Update a comment
export const updateComment = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { text } = req.body;

  if (!text) {
    res.status(400).json({ message: "Text is required." });
    return;
  }

  try {
    const commentRepository = AppDataSource.getRepository(Comment);
    const comment = await commentRepository.findOneBy({ id: parseInt(id) });

    if (!comment) {
      res.status(404).json({ message: "Comment not found." });
      return;
    }

    comment.text = text;
    await commentRepository.save(comment);

    res.status(200).json({ message: "Comment updated successfully.", comment });
  } catch (error) {
    res.status(500).json({ message: "Error updating comment.", error });
  }
};

// Delete a comment
export const deleteComment = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const commentRepository = AppDataSource.getRepository(Comment);
    const comment = await commentRepository.findOneBy({ id: parseInt(id) });

    if (!comment) {
      res.status(404).json({ message: "Comment not found." });
      return;
    }

    await commentRepository.remove(comment);

    res.status(200).json({ message: "Comment deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting comment.", error });
  }
};

export const respondComment = async (req: Request, res: Response): Promise<void> => {
  const { commentId } = req.params;
  const modelProvider = (req.headers["modeltype"] || process.env.DEFAULT_MODEL_PROVIDER) as string;

  if (!commentId) {
    res.status(400).json({ message: "commentId is required." });
    return;
  }

  const commentRepository = AppDataSource.getRepository(Comment);
  const taskRepository = AppDataSource.getRepository(Task);

  const comment = await commentRepository.findOne({
    where: { id: commentId as unknown as number}, 
    relations: ["task"]
  });
  if (!comment) {
    res.status(404).json({ message: "Comment not found." });
    return;
  }

  const task = await taskRepository.findOne({
    where: { id: comment.task.id },
    relations: ["comments"]
  });

  if (!task) {
    res.status(404).json({ message: "Task not found." });
    return
  }

  // Create a markdown list of the three most recent comments
  const recentCommentsArray = task!.comments.slice(-3).reverse();
  let recentComments = recentCommentsArray.map(
    comment => `- <start of comment>"${comment.text}"<end of comment>`
  ).join('\n');

  // Generate a response to the user's comment
  try {
    const generatedDescription = await prompt(
      `You are a helpful chat assistant specialized in task management that make short comments with hints and suggestions.`,
      `Generate a comment responding to the following commentary from the user:
      - User said: ${comment.text}

      Context:
      - The comment was made on the task: "${task!.name}"
      - The task has the description: 
      <start of task description>
      ${task!.description}
      <end of task description>
      - The three most recent comments on the task are:
      <start of task recent comments>
      ${recentComments}
      <end of task recent comments>
      `,
      modelProvider
    );
    req.body.taskId = task!.id;
    req.body.text = generatedDescription;
    req.body.isFromAI = true;

    await createComment(req, res);

  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        message: "Error generating Comment response.",
        error: error.message,
      });
    } else {
      res.status(500).json({
        message: "Error generating Comment response.",
        error: "An unknown error occurred.",
      });
    }
  }
};