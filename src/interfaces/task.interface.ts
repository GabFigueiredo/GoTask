import { TaskStatus } from '../types/TaskStatus';

export interface IComments {
  id: string;
  text: string;
  created_at: string;
}

export interface ITask {
  id: string;
  name: string;
  description: string;
  comments: IComments[];
  status: TaskStatus;
}
