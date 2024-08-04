import { Injectable } from '@angular/core';
import { ToastService } from 'angular-toastify';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private temporaryMessage: string | null = null;

  constructor(private _toastService: ToastService) { }

  showSuccess(message: string) {
    this._toastService.success(message);
  }

  showError(message: string) {
    this._toastService.error(message);
  }

  setTemporaryMessage(message: string) {
    this.temporaryMessage = message;
  }

  getTemporaryMessage(): string | null {
    const message = this.temporaryMessage;
    this.temporaryMessage = null; // Clear the message after retrieving
    return message;
  }
}
