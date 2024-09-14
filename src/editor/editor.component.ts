import { Component, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import {RandomizeNamesService} from './randomize-names.service'

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [FormsModule],
  providers: [RandomizeNamesService],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss',
})
export class EditorComponent implements OnInit {
  levelName = ''
  authorName = ''

  constructor (private randomize: RandomizeNamesService) {}

  ngOnInit() {
    this.randomize.error$.subscribe(error => {
      // TODO: show notification
    })
  }

  randomizeLevelName = () => {
    this.randomize.randomLevelName().subscribe(newLevelName => {
      this.levelName = newLevelName
    })
  }

  randomizeAuthorName = () => {
    this.randomize.randomAuthorName().subscribe(newAuthorName => {
      this.authorName = newAuthorName
    })
  }

  randomizeNames = () => {
    this.randomize.randomizeBothNames().subscribe(({ level, author }) => {
      this.levelName = level
      this.authorName = author
    })
  }
}
