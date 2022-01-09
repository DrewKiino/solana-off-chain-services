import {CronTask} from "../entities/CronTask";
import {Repository} from "typeorm";
import * as SqlService from './SqlService'

export const upsert = async function(
  cronExpression: string,
  taskIdentifier: string
): Promise<CronTask> {
  const connection = await SqlService.connection()
  const repository: Repository<CronTask> = connection.getRepository(CronTask)
  const findOne = await findByTaskIdentifier(taskIdentifier)
  /// Make sure tasks are unique
  if (findOne) return Promise.resolve(findOne)
  /// Else create a new one
  const cronTask = new CronTask()
  cronTask.cronExpression = cronExpression
  cronTask.taskIdentifier = taskIdentifier
  await repository.save(cronTask)
  return Promise.resolve(cronTask)
}

export const findByTaskIdentifier = async function(
  taskIdentifier: string
): Promise<CronTask | null> {
  const connection = await SqlService.connection()
  const repository = connection.getRepository(CronTask)
  const findOne = await repository.findOne({ taskIdentifier: taskIdentifier })
  /// Make sure tasks are unique
  if (findOne) return Promise.resolve(findOne)
  else return Promise.resolve(null)
}
