import { Component, inject, Input } from '@angular/core';
import { ModalControllerService } from '../../services/modal-controller.service';
import { TaskService } from '../../services/task.service';
import { ITask } from '../../../interfaces/task.interface';

@Component({
  selector: 'app-task',
  imports: [],
  templateUrl: './task-card.component.html',
})
export class TaskCardComponent {
  private readonly _modalController = inject(ModalControllerService);
  private readonly _taskService = inject(TaskService);
  @Input() task!: ITask;

  openEditModal() {
    const dialogRef = this._modalController.openEditModal(this.task);

    dialogRef.closed.subscribe((taskForm) => {
      if (taskForm) {
        this._taskService.editTaskNameAndDescription(
          taskForm,
          this.task.id,
          this.task.status,
        );
      }
    });
  }

  openCommentsModal() {
    const dialogRef = this._modalController.openCommentsModal(this.task);

    dialogRef.closed.subscribe((hasChanged) => {
      if (hasChanged) {
        this._taskService.updateComments(
          this.task.id,
          this.task.comments,
          this.task.status,
        );
      }
    });
  }

  deleteTask() {
    this._taskService.deleteTask(this.task.id, this.task.status);
  }
}
