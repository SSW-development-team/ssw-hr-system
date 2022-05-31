import Express from 'express';
import logger from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import { DataSource } from 'typeorm';
import func from './routes/bot';
import dotenv from 'dotenv';
import createError from 'http-errors';
import router from './routes/router';
import cors from 'cors';
import 'reflect-metadata';
import User from './model/User';
import Department from './model/Department';
// envファイルの読み込み
dotenv.config();

const app = Express();

// ミドルウェア設定
app.use(logger('dev'));
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN_URL })); //add multiple cors
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use(compression()); // gzip圧縮して返す

// apiルータへ
app.use('/', router);

// catch 404 and forward to error handler
app.use((req, res, next) => next(createError(404)));

// error handler
app.use((err: any, req: Express.Request, res: Express.Response) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'db',
  port: 3306,
  username: 'root',
  password: 'docker',
  database: 'ssw_hr',
  entities: [User, Department],
  synchronize: true,
  logging: false,
});

// to initialize initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap
AppDataSource.initialize()
  .then(() => {
    // here you can start to work with your database
  })
  .catch((error) => console.log(error));

module.exports = app;
export default app;
