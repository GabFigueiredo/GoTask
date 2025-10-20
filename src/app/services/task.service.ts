import { Injectable } from '@angular/core';
import { BehaviorSubject, map, tap } from 'rxjs';
import { IComments, ITask } from '../../interfaces/task.interface';
import { ITaskFormControls } from '../../interfaces/task-form-controls.interface';
import { TaskStatusEnum } from '../../enums/TaskStatus';
import { generateUniqueIdWithTimestamp } from '../../utils/generate-unique-id-with-timestamp';
import { TaskStatus } from '../../types/TaskStatus';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  readonly todoTasks$ = new BehaviorSubject<ITask[]>(
    this.getTaskListByStatus(TaskStatusEnum.TODO),
  );
  readonly todoTasks = this.todoTasks$.asObservable().pipe(
    map((value) => structuredClone(value)),
    tap((tasks) => this.saveTasksOnLocalStorage(TaskStatusEnum.TODO, tasks)),
  );

  readonly doingTasks$ = new BehaviorSubject<ITask[]>(
    this.getTaskListByStatus(TaskStatusEnum.DOING),
  );
  readonly doingTasks = this.doingTasks$.asObservable().pipe(
    map((value) => structuredClone(value)),
    tap((tasks) => this.saveTasksOnLocalStorage(TaskStatusEnum.DOING, tasks)),
  );

  readonly doneTasks$ = new BehaviorSubject<ITask[]>(
    this.getTaskListByStatus(TaskStatusEnum.DONE),
  );
  readonly doneTasks = this.doneTasks$.asObservable().pipe(
    map((value) => structuredClone(value)),
    tap((tasks) => this.saveTasksOnLocalStorage(TaskStatusEnum.DONE, tasks)),
  );

  createNewTask(payload: ITaskFormControls) {
    const newTask: ITask = {
      id: generateUniqueIdWithTimestamp(),
      ...payload,
      status: TaskStatusEnum.TODO,
      comments: [],
    };

    const currentList = this.todoTasks$.getValue();

    this.todoTasks$.next([...currentList, newTask]);
  }

  editTaskNameAndDescription(
    payload: ITaskFormControls,
    taskId: string,
    taskStatus: TaskStatus,
  ) {
    const listToOperate = this.getListByTaskStatus(taskStatus);
    const currentList = listToOperate.getValue();
    const taskIndexToEdit = currentList.findIndex((e) => e.id === taskId);

    if (taskIndexToEdit > -1) {
      currentList[taskIndexToEdit].name = payload.name;
      currentList[taskIndexToEdit].description = payload.description;
    } else {
      throw Error('ID da tarefa não foi encontrado!');
    }

    listToOperate.next(currentList);
  }

  changeTaskStatus(
    taskId: string,
    taskStatus: TaskStatus,
    newTaskStatus: string,
  ) {
    let taskNextStatus: TaskStatus;

    switch (newTaskStatus) {
      case 'to-do-column':
        taskNextStatus = TaskStatusEnum.TODO;
        break;
      case 'doing-column':
        taskNextStatus = TaskStatusEnum.DOING;
        break;
      case 'done-column':
        taskNextStatus = TaskStatusEnum.DONE;
        break;
      default:
        throw Error('Novo status de tarefa não encontrado.');
    }

    const currentTaskList = this.getListByTaskStatus(taskStatus);
    const nextStatusList = this.getListByTaskStatus(taskNextStatus);
    const taskToChangeStatus = currentTaskList.value.find(
      (e) => e.id === taskId,
    );

    if (taskToChangeStatus) {
      taskToChangeStatus.status = taskNextStatus;

      // Remove o item da coluna anterior.
      const currentTaskListNewValue = currentTaskList.value.filter(
        (e) => e.id !== taskId,
      );
      currentTaskList.next(currentTaskListNewValue);

      // Atualiza a lista da nova coluna.
      const nextStatusListNewValue = nextStatusList.value;
      nextStatusListNewValue.push(taskToChangeStatus);
      nextStatusList.next(nextStatusListNewValue);
    } else {
      throw Error('Id da tarefa não foi encontrado');
    }
  }

  deleteTask(taskId: string, taskStatus: TaskStatus) {
    const taskToOperate = this.getListByTaskStatus(taskStatus);
    const currentList = taskToOperate.getValue();
    const newTaskList = currentList.filter((e) => e.id !== taskId);

    taskToOperate.next(newTaskList);
  }

  updateComments(
    taskId: string,
    newComments: IComments[],
    taskStatus: TaskStatus,
  ) {
    const taskToOperate = this.getListByTaskStatus(taskStatus);
    const currentList = taskToOperate.getValue();
    const taskIndexToEdit = currentList.findIndex((e) => e.id === taskId);

    if (taskIndexToEdit > -1) {
      currentList[taskIndexToEdit].comments = newComments;
    } else {
      throw Error('Id da tarefa não encontrada.');
    }

    taskToOperate.next(currentList);
  }

  getListByTaskStatus(taskStatus: TaskStatus) {
    const list = {
      [TaskStatusEnum.TODO]: this.todoTasks$,
      [TaskStatusEnum.DOING]: this.doingTasks$,
      [TaskStatusEnum.DONE]: this.doneTasks$,
    };
    return list[taskStatus];
  }

  private saveTasksOnLocalStorage(key: string, tasks: ITask[]) {
    try {
      localStorage.setItem(key, JSON.stringify(tasks));
    } catch (error) {
      console.log('Erro ao salvar tarefas no LocalStorage', error);
    }
  }

  private getTaskListByStatus(key: string) {
    try {
      const storedTasks = localStorage.getItem(key);
      return storedTasks ? JSON.parse(storedTasks) : [];
    } catch (error) {
      console.error('Erro ao carregar tarefas do localStorage', error);
      return [];
    }
  }
}
