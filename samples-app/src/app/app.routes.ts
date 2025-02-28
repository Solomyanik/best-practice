import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import {PromiseSignalRxjsComponent} from './promise-signal-rxjs/promise-signal-rxjs.component'

export const routes: Routes = [
    //{ path: '', redirectTo: '/home', pathMatch: 'full',component: AppComponent  }, // Default route
     { path: 'angular', component: AppComponent, 
        children:[{path: 'promise', component: PromiseSignalRxjsComponent}]
    },
    { path: '', redirectTo: 'angular/promise', pathMatch: 'full' },
    // { path: 'products', component: ProductListComponent },
    // { path: 'products/:id', component: ProductDetailComponent }, // Route with parameter
    // { path: 'login', component: LoginComponent },
    // { path: 'admin',loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),canActivate: [AuthGuard]},
    // { path: '**', component: NotFoundComponent } // Wildcard route for 404
];
