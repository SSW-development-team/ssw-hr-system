# Awesome Project Build with TypeORM

Steps to run this project:

1. Run `npm i` command
2. Setup database settings inside `data-source.ts` file
3. Run `npm start` command

# Migration

1. In docker-compose.yml, comment out `command` and commen in `tty`
1. You have to run following command in api container
   `yarn typeorm migration:generate ./src/migraiton/[hoge]`
1. Add migration file to `data-source.ts`
1. Revert #1 and compose again
