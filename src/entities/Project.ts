import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from "typeorm";
import { Task } from "./Task";
import { User } from "./User";

@Entity()
export class Project {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Task, (task) => task.project, { cascade: true, onDelete: 'CASCADE' })
  tasks!: Task[];

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  createdBy!: User;
}