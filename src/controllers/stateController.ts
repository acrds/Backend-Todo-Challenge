// src/controllers/stateController.ts
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { State } from "../entities/State";

// Create a new state
export const createState = async (req: Request, res: Response): Promise<void> => {
  const { name, color, slug } = req.body;

  if (!name || !color || !slug) {
    res.status(400).json({ message: "Name, color, and slug are required." }); return;
  }

  try {
    const stateRepository = AppDataSource.getRepository(State);
    const state = stateRepository.create({ name, color, slug });
    await stateRepository.save(state);

    res.status(201).json({ message: "State created successfully.", state });
  } catch (error) {
    res.status(500).json({ message: "Error creating state.", error }); return;
  }
};

// List all states
export const listStates = async (_req: Request, res: Response): Promise<void> => {
  try {
    const stateRepository = AppDataSource.getRepository(State);
    const states = await stateRepository.find();

    res.status(200).json({ states });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving states.", error }); return;
  }
};

export const deleteState = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const stateRepository = AppDataSource.getRepository(State);
    const state = await stateRepository.findOneBy({ id: parseInt(id) });

    if (!state) {
      res.status(404).json({ message: "State not found." });
      return;
    }

    if (!state) {
      res.status(404).json({ message: "State not found." });
    }

    await stateRepository.remove(state);
    res.status(200).json({ message: "State deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting state.", error }); return;
  }
};

