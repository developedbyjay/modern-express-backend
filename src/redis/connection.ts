import { logger } from '@src/lib/winston';
import { createClient } from 'redis';

let redisClient = createClient();

const initializeRedisConnection = async () => {
  try {
    await redisClient.connect();
    logger.info('Reddis Successfully Connected');
  } catch (error) {
    logger.error('Redis connection error:', error);
  }
};
export { initializeRedisConnection };
