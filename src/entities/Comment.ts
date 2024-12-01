import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Task } from "./Task";
import { User } from "./User";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column("text")
  text!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Task, (task) => task.comments, { onDelete: "CASCADE" })
  task!: Task;

  @ManyToOne(() => User, { onDelete: "SET NULL" })
  user: User;
}
