import { TaskStatusEnum } from '../enums/TaskStatus';

export type TaskStatus =
  | TaskStatusEnum.TODO
  | TaskStatusEnum.DOING
  | TaskStatusEnum.DONE;
