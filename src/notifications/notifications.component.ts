import { Component, OnInit } from '@angular/core'
import { AppNotification, NotificationsService } from './notifications.service'
import { concatMap, delay, EMPTY, from, Observable, of } from 'rxjs'

const enum NotificationState {
  enter = 'enter',
  display = 'display',
  leave = 'leave',
}

interface StatefulNotification {
  notification: AppNotification
  state: NotificationState
}

const STATE_ORDER: readonly NotificationState[] = Object.freeze([
  NotificationState.enter,
  NotificationState.display,
  NotificationState.leave,
])

const STATE_DELAY = Object.freeze({
  [NotificationState.enter]: 500,
  [NotificationState.display]: 1500,
  [NotificationState.leave]: 500,
})

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
})
export class NotificationsComponent implements OnInit {
  private notificationQueue$: Observable<StatefulNotification | null> = EMPTY
  notification: StatefulNotification | null = null

  constructor(private notifications: NotificationsService) {}

  ngOnInit() {
    this.notificationQueue$ = this.notifications.getNotification().pipe(
      concatMap((notification) => {
        const withState = STATE_ORDER.map(
          (state) =>
            Object.freeze({
              notification,
              state,
            }) satisfies StatefulNotification,
        )
        return from([...withState, null]).pipe(
          concatMap((stateful) => {
            if (stateful === null) {
              return of(null)
            }
            const currentDelay = STATE_DELAY[stateful.state]
            return of(stateful).pipe(delay(currentDelay))
          }),
        )
      }),
    )

    this.notificationQueue$.subscribe((stateful) => {
      console.log(stateful)
      this.notification = stateful
    })
  }
}
