"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newTransactionQueue = void 0;
var bee_queue_1 = __importDefault(require("bee-queue"));
var config_1 = __importDefault(require("../config"));
exports.newTransactionQueue = new bee_queue_1.default('newTransactionQueue', {
    redis: {
        host: config_1.default.CACHE_HOST,
        port: config_1.default.CACHE_PORT ? config_1.default.CACHE_PORT : 6379,
    },
    getEvents: false,
    isWorker: false
});
