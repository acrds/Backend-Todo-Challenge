import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1732634677327 implements MigrationInterface {
    name = 'Init1732634677327'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "project" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "description" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "createdById" integer)`);
        await queryRunner.query(`CREATE TABLE "comment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "text" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "taskId" integer, "userId" integer)`);
        await queryRunner.query(`CREATE TABLE "task" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "description" text, "isArchived" boolean NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "projectId" integer, "createdById" integer)`);
        await queryRunner.query(`CREATE TABLE "state" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "color" varchar NOT NULL, "slug" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_67cfe181c5e7fc1c4fadd57084c" UNIQUE ("slug"))`);
        await queryRunner.query(`CREATE TABLE "task_state" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "taskId" integer NOT NULL, "stateId" integer NOT NULL, "assignedById" integer NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "temporary_project" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "description" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "createdById" integer, CONSTRAINT "FK_678acfe7017fe8a25fe7cae5f18" FOREIGN KEY ("createdById") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_project"("id", "name", "description", "createdAt", "updatedAt", "createdById") SELECT "id", "name", "description", "createdAt", "updatedAt", "createdById" FROM "project"`);
        await queryRunner.query(`DROP TABLE "project"`);
        await queryRunner.query(`ALTER TABLE "temporary_project" RENAME TO "project"`);
        await queryRunner.query(`CREATE TABLE "temporary_comment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "text" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "taskId" integer, "userId" integer, CONSTRAINT "FK_9fc19c95c33ef4d97d09b72ee95" FOREIGN KEY ("taskId") REFERENCES "task" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE SET NULL ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_comment"("id", "text", "createdAt", "updatedAt", "taskId", "userId") SELECT "id", "text", "createdAt", "updatedAt", "taskId", "userId" FROM "comment"`);
        await queryRunner.query(`DROP TABLE "comment"`);
        await queryRunner.query(`ALTER TABLE "temporary_comment" RENAME TO "comment"`);
        await queryRunner.query(`CREATE TABLE "temporary_task" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "description" text, "isArchived" boolean NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "projectId" integer, "createdById" integer, CONSTRAINT "FK_3797a20ef5553ae87af126bc2fe" FOREIGN KEY ("projectId") REFERENCES "project" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_91d76dd2ae372b9b7dfb6bf3fd2" FOREIGN KEY ("createdById") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_task"("id", "name", "description", "isArchived", "createdAt", "updatedAt", "projectId", "createdById") SELECT "id", "name", "description", "isArchived", "createdAt", "updatedAt", "projectId", "createdById" FROM "task"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`ALTER TABLE "temporary_task" RENAME TO "task"`);
        await queryRunner.query(`CREATE TABLE "temporary_task_state" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "taskId" integer NOT NULL, "stateId" integer NOT NULL, "assignedById" integer NOT NULL, CONSTRAINT "FK_36a65a1c7422b2193c6184b45a6" FOREIGN KEY ("taskId") REFERENCES "task" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_cff40b358bde7b7e9e36b99a10d" FOREIGN KEY ("stateId") REFERENCES "state" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_ab4884cbe6f471e23f5fa0b4bb4" FOREIGN KEY ("assignedById") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_task_state"("id", "createdAt", "updatedAt", "taskId", "stateId", "assignedById") SELECT "id", "createdAt", "updatedAt", "taskId", "stateId", "assignedById" FROM "task_state"`);
        await queryRunner.query(`DROP TABLE "task_state"`);
        await queryRunner.query(`ALTER TABLE "temporary_task_state" RENAME TO "task_state"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_state" RENAME TO "temporary_task_state"`);
        await queryRunner.query(`CREATE TABLE "task_state" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "taskId" integer NOT NULL, "stateId" integer NOT NULL, "assignedById" integer NOT NULL)`);
        await queryRunner.query(`INSERT INTO "task_state"("id", "createdAt", "updatedAt", "taskId", "stateId", "assignedById") SELECT "id", "createdAt", "updatedAt", "taskId", "stateId", "assignedById" FROM "temporary_task_state"`);
        await queryRunner.query(`DROP TABLE "temporary_task_state"`);
        await queryRunner.query(`ALTER TABLE "task" RENAME TO "temporary_task"`);
        await queryRunner.query(`CREATE TABLE "task" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "description" text, "isArchived" boolean NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "projectId" integer, "createdById" integer)`);
        await queryRunner.query(`INSERT INTO "task"("id", "name", "description", "isArchived", "createdAt", "updatedAt", "projectId", "createdById") SELECT "id", "name", "description", "isArchived", "createdAt", "updatedAt", "projectId", "createdById" FROM "temporary_task"`);
        await queryRunner.query(`DROP TABLE "temporary_task"`);
        await queryRunner.query(`ALTER TABLE "comment" RENAME TO "temporary_comment"`);
        await queryRunner.query(`CREATE TABLE "comment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "text" text NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "taskId" integer, "userId" integer)`);
        await queryRunner.query(`INSERT INTO "comment"("id", "text", "createdAt", "updatedAt", "taskId", "userId") SELECT "id", "text", "createdAt", "updatedAt", "taskId", "userId" FROM "temporary_comment"`);
        await queryRunner.query(`DROP TABLE "temporary_comment"`);
        await queryRunner.query(`ALTER TABLE "project" RENAME TO "temporary_project"`);
        await queryRunner.query(`CREATE TABLE "project" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "description" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "createdById" integer)`);
        await queryRunner.query(`INSERT INTO "project"("id", "name", "description", "createdAt", "updatedAt", "createdById") SELECT "id", "name", "description", "createdAt", "updatedAt", "createdById" FROM "temporary_project"`);
        await queryRunner.query(`DROP TABLE "temporary_project"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "task_state"`);
        await queryRunner.query(`DROP TABLE "state"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`DROP TABLE "comment"`);
        await queryRunner.query(`DROP TABLE "project"`);
    }

}
