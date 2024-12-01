import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Task } from "./Task";
import { State } from "./State";
import { User } from "./User";
  
@Entity()
export class TaskState {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Task, (task) => task.taskStates, { nullable: false, onDelete: "CASCADE" })
  task!: Task;
  
  @ManyToOne(() => State, (state) => state.taskStates, { nullable: false })
  state!: State;

  @ManyToOne(() => User, (user) => user.taskStates, { nullable: false })
  assignedBy!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
