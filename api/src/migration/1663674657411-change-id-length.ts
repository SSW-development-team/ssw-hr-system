import { MigrationInterface, QueryRunner } from "typeorm";

export class changeIdLength1663674657411 implements MigrationInterface {
    name = 'changeIdLength1663674657411'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`department\` CHANGE \`id\` \`id\` VARCHAR(19) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`organisation\` CHANGE \`bossRoleId\` \`bossRoleId\` VARCHAR(19) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`organisation\` CHANGE \`memberRoleId\` \`memberRoleId\` VARCHAR(19) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user_departments_department\` CHANGE \`departmentId\` \`departmentId\` VARCHAR(19) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_departments_department\` DROP FOREIGN KEY \`FK_48b0b6e227a1c3fc176657483a2\``);
        await queryRunner.query(`ALTER TABLE \`organisation\` DROP FOREIGN KEY \`FK_aaa334dcba2cb9ce382954bfdfb\``);
        await queryRunner.query(`ALTER TABLE \`organisation\` DROP FOREIGN KEY \`FK_3376626082dce78e48b60914989\``);
        await queryRunner.query(`DROP INDEX \`IDX_48b0b6e227a1c3fc176657483a\` ON \`user_departments_department\``);
        await queryRunner.query(`ALTER TABLE \`user_departments_department\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`user_departments_department\` ADD PRIMARY KEY (\`userId\`)`);
        await queryRunner.query(`ALTER TABLE \`user_departments_department\` DROP COLUMN \`departmentId\``);
        await queryRunner.query(`ALTER TABLE \`user_departments_department\` ADD \`departmentId\` varchar(18) NOT NULL`);
        await queryRunner.query(`CREATE INDEX \`IDX_48b0b6e227a1c3fc176657483a\` ON \`user_departments_department\` (\`departmentId\`)`);
        await queryRunner.query(`ALTER TABLE \`user_departments_department\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`user_departments_department\` ADD PRIMARY KEY (\`userId\`, \`departmentId\`)`);
        await queryRunner.query(`ALTER TABLE \`organisation\` DROP COLUMN \`memberRoleId\``);
        await queryRunner.query(`ALTER TABLE \`organisation\` ADD \`memberRoleId\` varchar(18) NULL`);
        await queryRunner.query(`ALTER TABLE \`organisation\` DROP COLUMN \`bossRoleId\``);
        await queryRunner.query(`ALTER TABLE \`organisation\` ADD \`bossRoleId\` varchar(18) NULL`);
        await queryRunner.query(`ALTER TABLE \`department\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`department\` ADD \`id\` varchar(18) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`department\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`user_departments_department\` ADD CONSTRAINT \`FK_48b0b6e227a1c3fc176657483a2\` FOREIGN KEY (\`departmentId\`) REFERENCES \`department\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`organisation\` ADD CONSTRAINT \`FK_aaa334dcba2cb9ce382954bfdfb\` FOREIGN KEY (\`memberRoleId\`) REFERENCES \`department\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`organisation\` ADD CONSTRAINT \`FK_3376626082dce78e48b60914989\` FOREIGN KEY (\`bossRoleId\`) REFERENCES \`department\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
