import { bootstrapApplication } from '@angular/platform-browser'
import { ApplicationConfig, Component } from '@angular/core'
import { provideRouter, RouterOutlet, Routes } from '@angular/router'
import { MainComponent } from './main/main.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
class AppRoot {}

const routes: Routes = [{ path: '', component: MainComponent }]

const appConfig: ApplicationConfig = Object.freeze({
  providers: [provideRouter(routes)],
})

bootstrapApplication(AppRoot, appConfig).catch((err) => console.error(err))
