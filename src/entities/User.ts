import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { TaskState } from "./TaskState";

@Entity()
export class User {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @OneToMany(() => TaskState, (taskstate) => taskstate.assignedBy, { cascade: true })
  taskStates!: TaskState[];
}