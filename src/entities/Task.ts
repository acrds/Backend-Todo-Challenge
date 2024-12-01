import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Project } from "./Project";
import { Comment } from "./Comment";
import { User } from "./User";
import { TaskState } from "./TaskState";

@Entity()
export class Task {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column()
  name!: string;

  @Column("text", { nullable: true })
  description?: string;

  @Column({ default: false })
  isArchived!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Comment, (comment) => comment.task, { cascade: true, onDelete: "CASCADE"  })
  comments!: Comment[];

  @OneToMany(() => TaskState, (taskstate) => taskstate.task, { cascade: true, onDelete: "CASCADE" })
  taskStates!: TaskState[];

  @ManyToOne(() => Project, (project) => project.tasks, { onDelete: "CASCADE" })
  project!: Project;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  createdBy!: User;
}