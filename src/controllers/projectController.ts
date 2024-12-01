import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Project } from "../entities/Project";
import { User } from "../entities/User";
import { Task } from "../entities/Task";
import { prompt } from "../ai"


export const createProject = async (req: Request, res: Response): Promise<void> => {
  const { name, description } = req.body;
  const userId = req.user?.id;

  if (!name || !userId) {
    res.status(400).json({ message: "Name and userId are required." });
    return;
  }

  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: userId });

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    const projectRepository = AppDataSource.getRepository(Project);
    const project = projectRepository.create({ name, description, createdBy: user });
    await projectRepository.save(project);

    res.status(201).json({ message: "project created successfully.", project });
  } catch (error) {
    res.status(500).json({ message: "Error creating project.", error });
  }
};

// Delete a project
export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const projectRepository = AppDataSource.getRepository(Project);
    const project = await projectRepository.findOneBy({ id: parseInt(id) });

    if (!project) {
      console.error("Project not found.");
      res.status(404).json({ message: "project not found." });
      return;
    }

    await projectRepository.remove(project);
    console.log("Project deleted successfully.");
    res.status(200).json({ message: "project deleted successfully." });
  } catch (error) {
    console.error("Error deleting project.", error);
    res.status(500).json({ message: "Error deleting project.", error });
  }
};

// List projects by user
export const listProjectsByUser = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;

  try {
    const projectRepository = AppDataSource.getRepository(Project);
    const projects = await projectRepository.find({
      where: { createdBy: { id: parseInt(userId) } },
      relations: ["tasks", "tasks.taskStates", "tasks.taskStates.state"], 
    });

    function getCurrentTaskStateSlug(task: Task) {
      if (task.taskStates.length === 0){
        return 'to-do';
      }
      return task.taskStates.sort(
        (a, b) => a.id - b.id
      ).reverse()[0].state.slug;
    }

    const response = projects.map((project) => {
      return {
        id: project.id,
        name: project.name,
        description: project.description,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        tasksMetrics: {
          todoCount: project.tasks.filter(
            (task) => getCurrentTaskStateSlug(task) === 'to-do'
          ).length,
          doingCount: project.tasks.filter(
            (task) => getCurrentTaskStateSlug(task) === 'doing'
          ).length,
          doneCount: project.tasks.filter(
            (task) => getCurrentTaskStateSlug(task) === 'done'
          ).length
        }
      };
    });

    res.status(200).json({ response });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving projects.", error });
  }
};

// Create A Project Plan: recomendation of tasks for a work day
export const createProjectPlan = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const modelProvider = (req.headers["modeltype"] || process.env.DEFAULT_MODEL_PROVIDER) as string;

  const projectRepository = AppDataSource.getRepository(Project);
  const project = await projectRepository.findOne({
    where: { id: parseInt(id) },
    relations: ["tasks", "tasks.taskStates", "tasks.taskStates.state"],
  });

  if (!project) {
    res.status(404).json({ message: "Project not found." });
    return;
  }

  if (project.tasks.length === 0) {
    res.status(400).json({ message: "Project has no tasks." });
    return;
  }

  var tasksWithCurrentState = [];
  for (const task of project.tasks) {
    if (task.isArchived){ continue; }

    // Sort taskStates by createdAt
    const sortedTaskStates = task.taskStates.sort((a, b) => {
      return a.createdAt.getTime() - b.createdAt.getTime();
    });
    const lastState = sortedTaskStates[task.taskStates.length - 1];
    tasksWithCurrentState.push({...task, currentState: lastState});
  }

  try {
    const planAsJSON = await prompt(
      `You are an helpful assistant to support the choice of tasks for today.`,
      `# Command
      - Create a plan by selecting a few of the existing tasks to work on today. 
      - Return a JSON in the format of the following example, but change freely the fields values to match the plan you created. 
      <start of json_format>
      { 
        "dayTitle": "Keep up the good work!",
        "daySummary": "Today is a great day for learning about databases and applying new things. Here are some tasks to work on today.",
        "tasksIds": [1, 2, 3] 
      }
      <end of json_format>

      # Context
      - Project Name: "${project.name}"
      - Project Description: "${project.description}"
      - Tasks List With States:
      ${tasksWithCurrentState.map((task) => `    - [id=${task.id}] "${task.name}" (state=${task.currentState.state.name})`).join('\n')}
      - Therefore, you can only choose tasks with the following IDs: ${tasksWithCurrentState.map((task) => task.id).join(', ')}

      # Constraints
      - You can only choose tasks that already exist. You can't create new tasks or give IDs that don't exist.
      - You can only work up to 3 tasks per day.
      - You can't work on tasks that are already done.
      - Respond ONLY with the JSON, don't add any additional information (even markdown)
      `,
      modelProvider
    )

    const plan = JSON.parse(planAsJSON!);
    const selectedTasks = tasksWithCurrentState.filter((task) => plan.tasksIds.includes(task.id));
    const planAnnotated = {
      dayTitle: plan.dayTitle,
      daySummary: plan.daySummary,
      tasks: selectedTasks.map((task) => {
        return {
          id: task.id,
          name: task.name,
          currentState: task.currentState.state.name
        }
      })
    }

    res.status(200).json({ planAnnotated });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving project plan.", error });
  }
}
