import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  const userRepository = AppDataSource.getRepository(User);

  const existingUser = await userRepository.findOneBy({ email });
  if (existingUser) {
    res.status(409).json({ message: "User already exists" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const newUser = userRepository.create({ 
    name: name,
    email: email.toLowerCase(),
    password: hashedPassword
  });

  await userRepository.save(newUser);
  res.status(201).json({ message: "User registered successfully" });
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  const userRepository = AppDataSource.getRepository(User);

  const user = await userRepository.findOneBy({ email: email.toLowerCase() });
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const token = jwt.sign({ id: user.id, email: user.email.toLowerCase() }, JWT_SECRET, { expiresIn: "24h" });
  res.json({ token });
};

export const updateToken = async (req: Request, res: Response): Promise<void> => {
  const user = req.user as User;
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "24h" });
  res.json({ token });
};