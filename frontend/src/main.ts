import { bootstrapApplication } from '@angular/platform-browser'
import { ApplicationConfig, Component } from '@angular/core'
import { provideRouter, RouterOutlet, Routes } from '@angular/router'
import { MainComponent } from './main/main.component'
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'
import { LibraryComponent } from './library/library.component'
import { EditorComponent } from './editor/editor.component'
import { NotificationsComponent } from './notifications/notifications.component'
import { provideHttpClient, withFetch } from '@angular/common/http'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NotificationsComponent],
  template: `
    <router-outlet />
    <app-notifications />
  `,
})
class AppRoot {}

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'library', component: LibraryComponent },
  {
    path: 'level',
    children: [{ path: 'new', component: EditorComponent }],
  },
]

const appConfig: ApplicationConfig = Object.freeze({
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
  ],
})

bootstrapApplication(AppRoot, appConfig).catch((err) => console.error(err))
