import { Component, OnInit } from '@angular/core'
import { Level, ListLevelsService } from './list-levels.service'
import { NotificationsService } from '../notifications/notifications.service'
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [FormsModule],
  providers: [ListLevelsService],
  templateUrl: './library.component.html',
  styleUrl: './library.component.scss',
})
export class LibraryComponent implements OnInit {
  search = ''
  page = 0
  pageSize = 25
  pageCount: number | null = null
  levels: Level[] | null = null

  constructor(
    private listLevels: ListLevelsService,
    private notifications: NotificationsService,
  ) {}

  ngOnInit(): void {
    this.listLevels.error$.subscribe((error) => {
      this.notifications.pushNotification({
        variant: 'error',
        title: 'Error',
        message:
          error instanceof Error
            ? error.message
            : 'Failed to get data from server',
      })
    })

    this.fetchPageCount()
    this.fetchLevels()
  }

  private fetchPageCount = () => {
    this.listLevels.fetchPageCount(this.pageSize).subscribe((pageCount) => {
      this.pageCount = pageCount
    })
  }

  private fetchLevels = () => {
    this.listLevels
      .fetchPage({
        page: this.page,
        pageSize: this.pageSize,
        search: this.search,
      })
      .subscribe((levels) => {
        this.levels = levels
      })
  }
}
