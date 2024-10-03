import {NgOptimizedImage} from "@angular/common";
import {Component, HostListener, Input} from "@angular/core";

type MousePosition = Readonly<{
  x: number
  y: number
}>

@Component({
  selector: 'app-cursor',
  imports: [NgOptimizedImage],
  standalone: true,
  template: `
    @if (cursorIcon) {
      <aside 
        class="artificial-cursor"
        [style]="cursorStyle"
      >
        <img
          [ngSrc]="cursorIcon"
          width="25"
          height="25"
        />
      </aside>
    }
  `,
})
export class CursorComponent {
  @Input() cursorIcon?: string
  mousePosition: MousePosition = Object.freeze({ x: 0, y: 0 })

  @HostListener('document:mousemove', ['$event'])
  handleMouseMove = ({ clientX, clientY }: MouseEvent) => {
    this.mousePosition = Object.freeze({
      x: clientX,
      y: clientY,
    })
  }

  get cursorStyle() {
    const offset = 10
    return Object.freeze({
      position: 'fixed',
      'z-index': 100,
      top: `${this.mousePosition.y + offset}px`,
      left: `${this.mousePosition.x + offset}px`,
    })
  }
}
