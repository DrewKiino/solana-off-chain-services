import dotenv from 'dotenv';
import process from 'process';
let config = dotenv.config();
console.log(config);
export default class Config {
    static DB_HOST?:string = process.env.DB_HOST;
    static DB_PASSWORD?:string = process.env.DB_PASSWORD;
    static DB_PORT?:number = Number(process.env.DB_PORT);
    static DB_NAME?:string = process.env.DB_NAME;
    static DB_USERNAME?:string = process.env.DB_USERNAME;

    static CACHE_URL?:string = process.env.CACHE_URL;
    static CACHE_HOST?:string = process.env.CACHE_HOST;
    static CACHE_PORT?:number = Number(process.env.CACHE_PORT);
}

