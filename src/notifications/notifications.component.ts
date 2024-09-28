import { Component, OnInit } from '@angular/core'
import { AppNotification, NotificationsService } from './notifications.service'
import {
  concat,
  concatMap,
  EMPTY,
  from,
  ignoreElements,
  Observable,
  of,
  Subject,
  takeUntil,
  timer,
} from 'rxjs'
import { NgClass } from '@angular/common'

const enum NotificationState {
  enter = 'enter',
  display = 'display',
  leave = 'leave',
}

type StatefulNotification = {
  state: NotificationState
} & AppNotification

const STATE_ORDER: readonly NotificationState[] = Object.freeze([
  NotificationState.enter,
  NotificationState.display,
  NotificationState.leave,
])

const STATE_DELAY = Object.freeze({
  [NotificationState.enter]: 1000,
  [NotificationState.display]: 3000,
  [NotificationState.leave]: 1000,
})

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [NgClass],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
})
export class NotificationsComponent implements OnInit {
  private notificationQueue$: Observable<StatefulNotification | null> = EMPTY
  private closeClick$: Subject<void> = new Subject()
  notification: StatefulNotification | null = null

  constructor(private notifications: NotificationsService) {}

  ngOnInit() {
    this.notificationQueue$ = this.notifications.getNotification().pipe(
      concatMap((notification) => {
        const withState = STATE_ORDER.map(
          (state) =>
            Object.freeze({
              ...notification,
              state,
            }) satisfies StatefulNotification,
        )
        return from([...withState, null]).pipe(
          concatMap((stateful) => {
            if (stateful === null) {
              return of(null)
            }
            const currentDelay = STATE_DELAY[stateful.state]
            return concat(
              of(stateful),
              timer(currentDelay).pipe(
                takeUntil(this.closeClick$),
                ignoreElements(),
              ),
            )
          }),
        )
      }),
    )

    this.notificationQueue$.subscribe((stateful) => {
      this.notification = stateful
    })
  }

  onNotificationClose = () => {
    this.closeClick$.next()
  }
}
