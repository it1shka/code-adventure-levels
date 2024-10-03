import { Component, HostListener, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RandomizeNamesService } from './randomize-names.service'
import { NotificationsService } from '../notifications/notifications.service'
import brushes, { Brush } from './brushes'
import { NgClass, NgOptimizedImage } from '@angular/common'
import { CursorComponent } from './cursor.component'

type LevelField = { [position: string]: Brush }

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [FormsModule, NgOptimizedImage, NgClass, CursorComponent],
  providers: [RandomizeNamesService],
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
  brushPointer = 0
  levelWidth = 10
  levelHeight = 10
  scale = 40
  levelField: LevelField = {}

  constructor(
    private randomize: RandomizeNamesService,
    private notifications: NotificationsService,
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

  handleBrushClick = (row: number, column: number) => {
    const brush = this.brushes[this.brushPointer]
    const position = `${row};${column}`
    this.levelField[position] = brush
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
}
