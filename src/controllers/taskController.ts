import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Task } from "../entities/Task";
import { TaskState } from "../entities/TaskState";
import { Project } from "../entities/Project";
import { State } from "../entities/State";
import { prompt } from "../ai";

// Create a new state
export const createTask = async (req: Request, res: Response): Promise<void> => {
    const { name, description, projectId } = req.body;
  
    if (!name || !description || !projectId) {
      res.status(400).json({ message: "Name, description, and projectId are required." }); return;
    }
  
    try {
      const taskRepository = AppDataSource.getRepository(Task);
      const project = await AppDataSource.getRepository(Project).findOneBy({ id: projectId });
      const todoState = await AppDataSource.getRepository(State).findOneBy({ slug: "to-do" });
      
      if (!project) {
        res.status(404).json({ message: "Project not found." });
        return;
      }
  
      // Create the task
      const task = taskRepository.create({
        name,
        description,
        project,
        createdBy: req.user,
      });
      await taskRepository.save(task);

      // Create a initial state for the task
      const taskStateRepository = AppDataSource.getRepository(TaskState);
      const taskState = taskStateRepository.create({
        task: task,
        state: todoState!,
        assignedBy: req.user,
      });
      await taskStateRepository.save(taskState);
  
      res.status(201).json({ message: "Task created successfully.", task });
    } catch (error) {
      res.status(500).json({ message: "Error creating state.", error }); return;
    }
  };

export const generateTaskDescriptionById = async (req: Request, res: Response): Promise<void> => {
  const { taskId } = req.body;

  if ( !taskId ) {
    res.status(400).json({ message: "Task name, description, and projectId are required." });
    return;
  }

  const taskRepository = AppDataSource.getRepository(Task);
  const task = await taskRepository.findOne({
    where: { id: parseInt(taskId) },
    relations: ["project"],
  });

  const projectRepository = AppDataSource.getRepository(Project);
  const project = await projectRepository.findOneBy({ id: task?.project.id });

  req.body.taskName = task?.name;
  req.body.taskDescription = task?.description;
  req.body.projectId = project?.id;

  await generateTaskDescription(req, res);
};
  
export const generateTaskDescription = async (req: Request, res: Response): Promise<void> => {
  const { taskName, taskDescription, projectId } = req.body;
  const modelProvider = (req.headers["modeltype"] || process.env.DEFAULT_MODEL_PROVIDER) as string;

  if (!taskName || !projectId) {
    res.status(400).json({ message: "Task name, description, and projectId are required." });
    return;
  }

  const projectRepository = AppDataSource.getRepository(Project);
  const project = await projectRepository.findOneBy({ id: projectId });

  try {
    const generatedDescription = await prompt(
      `You are a helpful assistant specialized in task management.`,
      `Generate a structured description for a task.
          - The task name is: "${taskName}".
          - This task is in the project: "${project?.name}"
          - This project has the description: "${project?.description}".
          - The first task description was: 
          "${taskDescription}".
          Modify this description so that it follows the following rules:
          - The task's description must be in markdown.
          - The task's description must have ONLY the following sections: done criteria, steps, estimated effort.
          - Be succinct and use only plain topics (no nested topics).
          - Each topic must have only a one sentence text, just like this prompt`,
        modelProvider
    );

    res.status(200).json({
      message: "Task description generated successfully.",
      description: generatedDescription,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        message: "Error generating task description.",
        error: error.message,
      });
    } else {
      res.status(500).json({
        message: "Error generating task description.",
        error: "An unknown error occurred.",
      });
    }
  }
};

export const proposeTask = async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.body;
  const modelProvider = (req.headers["modeltype"] || process.env.DEFAULT_MODEL_PROVIDER) as string;

  // Get the project and it's tasks
  const projectRepository = AppDataSource.getRepository(Project);
  const project = await projectRepository.findOne({
    where: { id: parseInt(projectId) },
    relations: ["tasks"],
  });

  // Get the tasks that are not archived
  const nonArchivedTasks = project?.tasks.filter((task) => !task.isArchived);

  // Build the prompt
  const promptText = `You are working on the project: "${project?.name}".
  This project has the description: "${project?.description}".
  The project has the following tasks:
  ${nonArchivedTasks?.map((task) => `- ${task.name}`).join("\n")}
  What task would you like to propose? Return a json object with the following fields: name, description`;

  try {
    const proposedTaskJSON = await prompt(
      `You are a helpful assistant specialized in task management.`,
      promptText,
      modelProvider
    );

    const proposedTask = JSON.parse(proposedTaskJSON!);

    // Create the task
    const taskRepository = AppDataSource.getRepository(Task);
    const task = taskRepository.create({
      name: proposedTask.name,
      description: proposedTask.description,
      project: project!,
      createdBy: req.user,
    });

    res.status(200).json({
      message: "Task proposed successfully.",
      task,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        message: "Error proposing task.",
        error: error.message,
      });
    } else {
      res.status(500).json({
        message: "Error proposing task.",
        error: "An unknown error occurred.",
      });
    }
  }


}

// List all states
export const listTasksByProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const taskRepository = AppDataSource.getRepository(Task);
    const tasks = await taskRepository.find({
      where: { project: { id: parseInt(req.params.projectId) } },
      relations: ["comments", "comments.user", "taskStates", "taskStates.state"]
    });

    // For each task, get the last state
    var tasksWithCurrentState = [];
    for (const task of tasks) {
      // Sort taskStates by createdAt
      const sortedTaskStates = task.taskStates.sort((a, b) => {
        return a.createdAt.getTime() - b.createdAt.getTime();
      });
      const lastState = sortedTaskStates[task.taskStates.length - 1];
      tasksWithCurrentState.push({...task, currentState: lastState});
    }

    var nonArchivedTasks = tasksWithCurrentState.filter((task) => !task.isArchived);

    // Reverse Sort the task commentaries by createdAt
    for (var task of nonArchivedTasks) {
      task.comments.sort((a, b) => {
        return a.createdAt.getTime() - b.createdAt.getTime();
      });
    }

    res.status(200).json({ tasks: nonArchivedTasks });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving tasks.", error });
    return;
  }
};
// Delete a state
export const archiveTask = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const taskRepository = AppDataSource.getRepository(Task);
    const task = await taskRepository.findOneBy({ id: parseInt(id) });

    if (!task) {
      res.status(404).json({ message: "Task not found." });
      return;
    }

    task.isArchived = true;
    await taskRepository.save(task);
    res.status(200).json({ message: "Task archived successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task.", error }); return;
  }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { taskName, taskDescription } = req.query;

  try {
    const taskRepository = AppDataSource.getRepository(Task);
    const task = await taskRepository.findOneBy({ id: parseInt(id) });

    if (!task) {
      res.status(404).json({ message: "Task not found." });
      return;
    }

    if (taskName){
      task.name = taskName as string;
    }
    if (taskDescription){
      task.description = taskDescription as string;
    }

    await taskRepository.save(task);

    res.status(200).json({ message: "Task updated successfully.", task });
  } catch (error) {
    res.status(500).json({ message: "Error updating task.", error }); return;
  }
};