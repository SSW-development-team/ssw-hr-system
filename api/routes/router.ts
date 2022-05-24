import express from 'express';
import ErrorResponse from '../ErrorResponse';

const router = express.Router();

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN ?? 'AUTH0_DOMAIN';
const AUTH0_FQDN = `https://${AUTH0_DOMAIN}/`;
const WHITELIST_NAME = 'auto-unfollow-whitelist'; // ホワイトリスト用に使用するリストの名前

const CONSUMER_KEYSET = {
  appKey: process.env.TWITTER_CONSUMER_KEY ?? 'TWITTER_CONSUMER_KEY',
  appSecret: process.env.TWITTER_CONSUMER_SECRET ?? 'TWITTER_CONSUMER_SECRET',
};

// Root Endpoint
router.get('/', (req, res) => {
  res.status(200).send('Welcome to SSW HR System API server!');
});

export default router;
