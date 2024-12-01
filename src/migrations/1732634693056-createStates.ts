import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateStates1732634693056 implements MigrationInterface {
    name = 'CreateStates1732634693056'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO state (name, color, slug) VALUES
            ('To Do', '#10a5e5', 'to-do'),
            ('Doing', '#f0a628', 'doing'),
            ('Done', '#156d08', 'done');
          `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM state WHERE slug IN ('to-do', 'doing', 'done');
          `);
    }

}
