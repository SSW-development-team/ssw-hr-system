import Bot from './Bot';
import dotenv from 'dotenv';

console.log('hello world');
dotenv.config();
Bot.create().then((instance) => {
  if (instance instanceof Bot) instance.run();
  else console.error(instance);
});

export {};
