import { MigrationInterface, QueryRunner } from "typeorm";

export class orgTree1663515249193 implements MigrationInterface {
    name = 'orgTree1663515249193'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`organisation\` ADD \`nsleft\` int NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`organisation\` ADD \`nsright\` int NOT NULL DEFAULT '2'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`organisation\` DROP COLUMN \`nsright\``);
        await queryRunner.query(`ALTER TABLE \`organisation\` DROP COLUMN \`nsleft\``);
    }

}
