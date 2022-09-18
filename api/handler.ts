import serverless from 'serverless-http';
import app from './src/app';

// デフォルトexportだと、handlerを見つけられなくなる
export const myhandler = serverless(app);
