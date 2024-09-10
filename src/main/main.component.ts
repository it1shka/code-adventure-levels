import { NgClass, NgOptimizedImage } from '@angular/common'
import { Component, HostListener } from '@angular/core'
import { Router, RouterLink } from '@angular/router'

interface Link {
  href: string
  title: string
  description?: string
  icon?: string
  external?: boolean
}

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    RouterLink, 
    NgClass,
    NgOptimizedImage,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {
  constructor (private router: Router) {}

  links: readonly Link[] = Object.freeze([
    {
      href: '/level/new',
      title: 'New Level',
      icon: '/create.png',
      description: 'Start creating your own level',
    },
    {
      href: '/library',
      title: 'Library',
      icon: '/library.png',
      description: 'Collection of levels created by other users',
    },
    {
      href: 'https://github.com/it1shka/code-adventure',
      title: 'GitHub',
      icon: '/github.png',
      description: 'Project page on the GitHub. Give it a star!',
      external: true,
    },
  ])

  activeLinkIndex = 0

  openExternalLink = (event: MouseEvent) => {
    event.preventDefault()
    if (event.target === null) return
    if ('href' in event.target && typeof event.target.href === 'string') {
      const { href } = event.target
      window.open(href, '_blank')
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboard = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'Enter': {
        const { href, external } = this.links[this.activeLinkIndex]
        if (external) {
          window.open(href, '_blank')
        } else {
          this.router.navigate([href])
        }
        break
      }
      case 'ArrowUp': {
        this.activeLinkIndex--
        if (this.activeLinkIndex < 0) {
          this.activeLinkIndex = this.links.length - 1
        }
        break
      }
      case 'ArrowDown': {
        this.activeLinkIndex++
        if (this.activeLinkIndex >= this.links.length) {
          this.activeLinkIndex = 0
        }
        break
      }
    }
  }
}
