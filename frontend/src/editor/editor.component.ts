import { Component, HostListener, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RandomizeNamesService } from './randomize-names.service'
import { NotificationsService } from '../notifications/notifications.service'
import brushes, { Brush } from './brushes'
import { NgClass, NgOptimizedImage } from '@angular/common'
import { CursorComponent } from './cursor.component'
import { CreateLevelService, Level } from './create-level.service'
import { catchError, tap, throwError } from 'rxjs'
import { Router } from '@angular/router'

type LevelField = { [position: string]: Brush }

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [FormsModule, NgOptimizedImage, NgClass, CursorComponent],
  providers: [RandomizeNamesService, CreateLevelService],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss',
})
export class EditorComponent implements OnInit {
  readonly brushes = brushes
  readonly minSize = 5
  readonly maxSize = 20
  readonly minScale = 20
  readonly maxScale = 60

  levelName = ''
  authorName = ''
  levelWidth = 10
  levelHeight = 10
  scale = 40
  brushPointer = 0
  levelField: LevelField = {}
  private isDrawing = false
  private previousFieldStates: LevelField[] = []

  constructor(
    private randomize: RandomizeNamesService,
    private createLevel: CreateLevelService,
    private notifications: NotificationsService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.randomize.error$.subscribe(() => {
      this.notifications.pushNotification({
        title: 'Error',
        message: 'Failed to randomize',
        variant: 'error',
      })
    })
  }

  publishLevel = () => {
    if (!this.isLevelSizeValid) {
      this.notifications.pushNotification({
        variant: 'error',
        title: 'Error',
        message: this.levelSizeErrorMessage,
      })
      return
    }
    if (this.levelName.length <= 4 || this.authorName.length <= 4) {
      this.notifications.pushNotification({
        variant: 'error',
        title: 'Error',
        message:
          'Level name and author name should be at least 4 characters long',
      })
      return
    }
    const level: Level = {
      title: this.levelName,
      author: this.authorName,
      field: this.createLevel.buildLevel(
        this.levelWidth,
        this.levelHeight,
        this.levelField,
      ),
    }
    this.createLevel
      .createLevel(level)
      .pipe(
        tap(() => {
          this.notifications.pushNotification({
            variant: 'success',
            title: 'Success',
            message: 'Level was published',
          })
          this.router.navigate(['/'])
        }),
        catchError((error) => {
          this.notifications.pushNotification({
            variant: 'error',
            title: 'Error',
            message:
              error instanceof Error ? error.message : 'Failed to create level',
          })
          return throwError(() => new Error('Failed to create level'))
        }),
      )
      .subscribe()
  }

  randomizeLevelName = () => {
    this.randomize.randomLevelName().subscribe((newLevelName) => {
      this.levelName = newLevelName
    })
  }

  randomizeAuthorName = () => {
    this.randomize.randomAuthorName().subscribe((newAuthorName) => {
      this.authorName = newAuthorName
    })
  }

  randomizeNames = () => {
    this.randomize.randomizeBothNames().subscribe(({ level, author }) => {
      this.levelName = level
      this.authorName = author
    })
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardClick = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowLeft': {
        this.brushPointer =
          this.brushPointer <= 0
            ? this.brushes.length - 1
            : this.brushPointer - 1
        break
      }
      case 'ArrowRight': {
        this.brushPointer =
          this.brushPointer + 1 >= this.brushes.length
            ? 0
            : this.brushPointer + 1
        break
      }
      case 'z':
        if (!event.metaKey) break
        const prevState = this.previousFieldStates.pop()
        if (prevState === undefined) break
        this.levelField = prevState
        break
      default: {
        if (!event.ctrlKey) return
        if (event.key < '1' || event.key > '9') return
        const idx = Number(event.key) - 1
        if (!Number.isFinite(idx)) return
        if (idx >= this.brushes.length) return
        event.preventDefault()
        this.brushPointer = idx
      }
    }
  }

  get isLevelSizeValid() {
    if (
      !Number.isFinite(this.levelWidth) ||
      !Number.isFinite(this.levelHeight)
    ) {
      return false
    }
    if (this.levelWidth < this.minSize || this.levelWidth > this.maxSize) {
      return false
    }
    if (this.levelHeight < this.minSize || this.levelHeight > this.maxSize) {
      return false
    }
    return true
  }

  get levelSizeErrorMessage() {
    if (
      !Number.isFinite(this.levelWidth) ||
      !Number.isFinite(this.levelHeight)
    ) {
      return 'Level width or height are not numbers'
    }
    if (this.levelWidth < this.minSize || this.levelWidth > this.maxSize) {
      return `Level width should be between ${this.minSize} and ${this.maxSize}`
    }
    if (this.levelHeight < this.minSize || this.levelHeight > this.maxSize) {
      return `Level height should be between ${this.minSize} and ${this.maxSize}`
    }
    return 'Everything is alright'
  }

  get cellSizeStyle() {
    const actualScale = Math.max(
      this.minScale,
      Math.min(this.maxScale, this.scale),
    )
    return Object.freeze({
      width: `${actualScale}px`,
      height: `${actualScale}px`,
    })
  }

  get brushIcon() {
    const brush = this.brushes[this.brushPointer]
    return brush.icon
  }

  getIconAt = (row: number, column: number) => {
    const position = `${row};${column}`
    if (!(position in this.levelField)) {
      return null
    }
    const brush = this.levelField[position]
    if (brush.icon === undefined) {
      return null
    }
    return brush.icon
  }

  private colorCell = (row: number, column: number) => {
    const brush = this.brushes[this.brushPointer]
    const position = `${row};${column}`
    this.levelField[position] = brush
  }

  startDraw = (row: number, column: number) => {
    const clone = JSON.parse(JSON.stringify(this.levelField))
    this.previousFieldStates.push(clone as LevelField)
    this.isDrawing = true
    this.colorCell(row, column)
  }

  handleDragBrush = (row: number, column: number) => {
    if (!this.isDrawing) return
    this.colorCell(row, column)
  }

  @HostListener('document:mouseup')
  finishDraw = () => {
    this.isDrawing = false
  }
}
