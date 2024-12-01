import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Project } from "./entities/Project";
import { Comment } from "./entities/Comment";
import { State } from "./entities/State";
import { Task } from "./entities/Task";
import { TaskState } from "./entities/TaskState";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "./data/database.sqlite",
  synchronize: false,
  logging: false,
  entities: [
    User,
    Task,
    State,
    Comment,
    Project,
    TaskState,
  ],
  subscribers: [],
  migrations: ["./src/migrations/*.ts"],
  migrationsTableName: "migrations",
});

// Inicializar a conexão
AppDataSource.initialize()
  .then(async () => await AppDataSource.query('PRAGMA foreign_keys = ON'))
  .catch((err) => console.error("Error Initializing DB Connection", err));
