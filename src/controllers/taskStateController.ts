import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { TaskState } from "../entities/TaskState";
import { Task } from "../entities/Task";
import { State } from "../entities/State";

// Create a new TaskState
export const createTaskState = async (req: Request, res: Response): Promise<void> => {
  const { taskId, stateId } = req.body;

  if (!taskId || !stateId) {
    res.status(400).json({ message: "Task ID and State ID are required." });
    return;
  }

  try {
    const taskRepository = AppDataSource.getRepository(Task);
    const stateRepository = AppDataSource.getRepository(State);
    const taskStateRepository = AppDataSource.getRepository(TaskState);

    // Find the task by ID
    const task = await taskRepository.findOneBy({ id: taskId });
    if (!task) {
      res.status(404).json({ message: "Task not found." });
      return;
    }

    // Find the state by ID
    const state = await stateRepository.findOneBy({ id: stateId });
    if (!state) {
      res.status(404).json({ message: "State not found." });
      return;
    }

    // Create and save the TaskState
    const taskState = taskStateRepository.create({
      task,
      state,
      assignedBy: req.user,
    });

    await taskStateRepository.save(taskState);

    res.status(201).json({ message: "TaskState created successfully.", taskState });
  } catch (error) {
    res.status(500).json({ message: "Error creating TaskState.", error });
  }
};
