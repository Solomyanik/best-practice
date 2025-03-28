import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import {PromiseSignalRxjsComponent} from './promise-signal-rxjs/promise-signal-rxjs.component';
import {AboutComponent} from './about/about.component';
import { SubjectSamplesComponent } from './subject-samples/subject-samples.component';
import {RxjssamplesComponent} from './rxjssamples/rxjssamples.component'
import {GeminiComponent} from './gem-app/src/app/gemini/gemini.component'
import { provideHttpClient } from '@angular/common/http';


export const routes: Routes = [
    //{ path: '', redirectTo: '/home', pathMatch: 'full',component: AppComponent  }, // Default route
    { path: 'angular', component: AppComponent, 
        children:[
            {path: 'promise', component: PromiseSignalRxjsComponent},
            {path: 'subject', component:SubjectSamplesComponent},
            {path:'rxjs',component:RxjssamplesComponent},
            {path:'gemini',component:GeminiComponent,providers:[provideHttpClient()]}
        ]
    },
    { path: '', redirectTo: 'about', pathMatch: 'full' },
    { path: 'about', component: AboutComponent },
    // { path: 'products/:id', component: ProductDetailComponent }, // Route with parameter
    // { path: 'login', component: LoginComponent },
    // { path: 'admin',loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),canActivate: [AuthGuard]},
    // { path: '**', component: NotFoundComponent } // Wildcard route for 404
];
