import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'

export interface AppNotification {
  title: string
  message: string
  variant: 'success' | 'info' | 'warning' | 'error'
}

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  notification$ = new Subject<AppNotification>()

  pushNotification = (notification: AppNotification) => {
    this.notification$.next(notification)
  }

  getNotification = () => {
    return this.notification$.asObservable()
  }
}
