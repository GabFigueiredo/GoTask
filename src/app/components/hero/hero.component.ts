import { Component, inject } from '@angular/core';
import { ModalControllerService } from '../../services/modal-controller.service';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.component.html',
})
export class HeroComponent {
  private readonly _dialogService = inject(ModalControllerService);
  private readonly _taskService = inject(TaskService);

  openNewTaskModal() {
    const dialogRef = this._dialogService.openNewTaskModal();

    dialogRef.closed.subscribe((taskForm) => {
      if (taskForm) {
        this._taskService.createNewTask(taskForm);
      }
    });
  }
}
