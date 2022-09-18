import { MigrationInterface, QueryRunner } from "typeorm";

export class addOrg1663509124858 implements MigrationInterface {
    name = 'addOrg1663509124858'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`organisation\` (\`id\` int NOT NULL, \`name\` varchar(255) NOT NULL, \`bossRoleId\` varchar(18) NULL, \`memberRoleId\` varchar(18) NULL, \`superId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`organisation\` ADD CONSTRAINT \`FK_3376626082dce78e48b60914989\` FOREIGN KEY (\`bossRoleId\`) REFERENCES \`department\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`organisation\` ADD CONSTRAINT \`FK_aaa334dcba2cb9ce382954bfdfb\` FOREIGN KEY (\`memberRoleId\`) REFERENCES \`department\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`organisation\` ADD CONSTRAINT \`FK_7ee9acba0b789bf0e5ef6497c17\` FOREIGN KEY (\`superId\`) REFERENCES \`organisation\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`organisation\` DROP FOREIGN KEY \`FK_7ee9acba0b789bf0e5ef6497c17\``);
        await queryRunner.query(`ALTER TABLE \`organisation\` DROP FOREIGN KEY \`FK_aaa334dcba2cb9ce382954bfdfb\``);
        await queryRunner.query(`ALTER TABLE \`organisation\` DROP FOREIGN KEY \`FK_3376626082dce78e48b60914989\``);
        await queryRunner.query(`DROP TABLE \`organisation\``);
    }

}
