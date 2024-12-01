import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { TaskState } from "./TaskState";

@Entity()
export class State {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column()
  name!: string;

  @Column()
  color!: string;

  @Column({ unique: true })
  slug!: string;

  @OneToMany(() => TaskState, (taskstate) => taskstate.state, { cascade: true })
  taskStates!: TaskState[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}