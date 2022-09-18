import { MigrationInterface, QueryRunner } from "typeorm";

export class changeOrgId1663510747117 implements MigrationInterface {
    name = 'changeOrgId1663510747117'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`organisation\` DROP FOREIGN KEY \`FK_7ee9acba0b789bf0e5ef6497c17\``);
        await queryRunner.query(`ALTER TABLE \`organisation\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`organisation\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`organisation\` ADD \`id\` int NOT NULL PRIMARY KEY AUTO_INCREMENT`);
        await queryRunner.query(`ALTER TABLE \`organisation\` ADD CONSTRAINT \`FK_7ee9acba0b789bf0e5ef6497c17\` FOREIGN KEY (\`superId\`) REFERENCES \`organisation\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`organisation\` DROP FOREIGN KEY \`FK_7ee9acba0b789bf0e5ef6497c17\``);
        await queryRunner.query(`ALTER TABLE \`organisation\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`organisation\` ADD \`id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`organisation\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`organisation\` ADD CONSTRAINT \`FK_7ee9acba0b789bf0e5ef6497c17\` FOREIGN KEY (\`superId\`) REFERENCES \`organisation\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
