import {createConnection, Connection} from "typeorm";
import {CronTask} from "../entities/CronTask";
import {TokenSnapshotEntity} from "../entities/TokenSnapshotEntity";
import {TransactionEntity} from '../entities/TransactionEntity';
import {TokenAccountEntity} from '../entities/TokenAccountEntity';
import {AccountEntity} from '../entities/AccountEntity';
import {TransactionToAccountEntity} from '../entities/TransactionToAccountEntity';
import Config from '../config';
import {TokenInfoEntity} from '../entities/TokenInfoEntity';
let _connection: Connection | undefined

export async function connection(): Promise<Connection> {
  if (_connection) { return _connection }

  console.log("attempting to connect to db...");

  _connection = await createConnection({
    type: "mysql",
    host: Config.DB_HOST,
    port: 3306,
    username: Config.DB_USERNAME,
    password: Config.DB_PASSWORD,
    database: Config.DB_NAME,
    synchronize: false,
    logging: false,
    entities: [
      CronTask,
      AccountEntity,
      TransactionEntity,
      TransactionToAccountEntity,
      TokenSnapshotEntity,
      TokenAccountEntity,
      TokenInfoEntity
    ]
  })
  return _connection
}