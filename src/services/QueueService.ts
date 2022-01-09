import BeeQueue from 'bee-queue';
import redis from 'redis';
import Config from '../config';

export const newTransactionQueue = new BeeQueue('newTransactionQueue',{
    redis: {
        host: Config.CACHE_HOST,
        port: Config.CACHE_PORT ? Config.CACHE_PORT : 6379,
    },
    getEvents: false,
    isWorker: true
});
