"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
var process_1 = __importDefault(require("process"));
var config = dotenv_1.default.config();
console.log(config);
var Config = /** @class */ (function () {
    function Config() {
    }
    Config.DB_HOST = process_1.default.env.DB_HOST;
    Config.DB_PASSWORD = process_1.default.env.DB_PASSWORD;
    Config.DB_PORT = Number(process_1.default.env.DB_PORT);
    Config.DB_NAME = process_1.default.env.DB_NAME;
    Config.DB_USERNAME = process_1.default.env.DB_USERNAME;
    Config.CACHE_URL = process_1.default.env.CACHE_URL;
    Config.CACHE_HOST = process_1.default.env.CACHE_HOST;
    Config.CACHE_PORT = Number(process_1.default.env.CACHE_PORT);
    return Config;
}());
exports.default = Config;
