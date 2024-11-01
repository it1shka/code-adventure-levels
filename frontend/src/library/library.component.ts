import { Component, OnInit } from '@angular/core'
import { Level, ListLevelsService } from './list-levels.service'
import { NotificationsService } from '../notifications/notifications.service'
import { FormsModule } from '@angular/forms'
import {LevelCardComponent} from './level-card.component'
import {NgClass} from '@angular/common'

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [FormsModule, LevelCardComponent, NgClass],
  providers: [ListLevelsService],
  templateUrl: './library.component.html',
  styleUrl: './library.component.scss',
})
export class LibraryComponent implements OnInit {
  private readonly paginationRange = 3
  search = ''
  page = 0
  pageSize = 25
  pageCount: number | null = null
  levels: Level[] = []

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

  get pagination() {
    if (this.pageCount === null) return []
    const output = []
    let page = Math.max(0, this.page - this.paginationRange)
    while (page < this.pageCount && page <= this.page + this.paginationRange) {
      output.push(page)
      page++
    }
    return output
  }
}
