import { Component, HostListener, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RandomizeNamesService } from './randomize-names.service'
import { NotificationsService } from '../notifications/notifications.service'
import brushes from './brushes'
import { NgClass, NgOptimizedImage } from '@angular/common'

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [FormsModule, NgOptimizedImage, NgClass],
  providers: [RandomizeNamesService],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss',
})
export class EditorComponent implements OnInit {
  readonly brushes = brushes
  levelName = ''
  authorName = ''
  brushPointer = 0

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
    }
  }
}
