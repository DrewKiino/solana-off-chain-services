import * as DotEnv from 'dotenv';
DotEnv.config();
import express, { Application, Request, Response } from "express";
import * as CronTaskService from "./services/CronTaskService";
import * as Cors from 'cors'
import * as TokenSnapshotService from './services/TokenSnapshotService'
import * as TokenInfoService from './services/TokenInfoService'
import * as AccountRepository from './repositories/AccountRepository'
import {ScheduledTask} from "node-cron";
import * as Cron from "node-cron";
import Web3 from "@solana/web3.js";
import {toPublicKey} from "./constants/ids";
import {SOLANA_CONNECTION} from "./services/SolanaWeb3Service";
import {TokenSnapshotEntity} from "./entities/TokenSnapshotEntity";
import {findMostRecentSnapshot} from "./services/TokenSnapshotService";

const app: Application = express();
const port = 8080

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(Cors.default({origin:true,credentials: true}));

app.get(
  "/",
  async (req: Request, res: Response): Promise<Response> => {
    return res.status(200).send({
      message: "Hello World!",
    });
  }
)

app.get(
  "/token-snapshot",
  async (req: Request, res: Response): Promise<Response> => {
    const query = req.query
    const tokenAddress = query['token_address'] as string
    if (!tokenAddress) return res.status(404).json({ error: "Token address not supplied."})
    const snapshots = await TokenSnapshotService.listByAccountAddress(
      tokenAddress
    )
    return res.status(200).json({
      items: snapshots
    })
  }
)

app.get(
  "/token-info",
  async (req: Request, res: Response): Promise<Response> => {
    const query = req.query
    const tokenAddress = query['token_address'] as string
    if (!tokenAddress) return res.status(404).json({ error: "Token address not supplied."})
    const tokenInfo = await TokenInfoService.getTokenInfo(tokenAddress)
    return res.status(200).json(tokenInfo)
  }
)

// try {
//   app.listen(port, (): void => {
//     console.log(`Connected successfully on port ${port}`);
//     (async () => {
//       await serverDidLoad()
//     })()
//   });
// } catch (error) {
//   console.error(`Error occurred: ${error}`);
// }

// async function serverDidLoad() {
//   await startCronJobs()
// }

// async function startCronJobs() {
//   const cronExpression = '*/30 * * * * *'
//   const cron: ScheduledTask = Cron.schedule(cronExpression, () => {
//     (async () => {
//       const allBridgeToken = 'a11bdAAuV8iB2fu7X6AxAvDTo1QZ8FXB3kk5eecdasp'
//       const allBridgeMarketAddress = 'FrR9FBmiBjm2GjLZbfnCcgkbueUJ78NbBx1qcQKPUQe8'
//       const snapshot = await TokenSnapshotService.takeSnapshot(
//         SOLANA_CONNECTION,
//         allBridgeToken,
//         allBridgeMarketAddress
//       )
//     })()
//   })
// }

