import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
        children: []
    },
    {
        path: 'login',
        loadComponent: () => import('./login/login.component').then(m => m.LoginComponent),
        children: []
    },
    {
        path: 'register',
        loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent),
        children: []
    },
    {
        path: 'createRoute',
        loadComponent: () => import('./Route/create-route/create-route.component').then(m => m.CreateRouteComponent),
        children: []
    },
    {
        path: 'getRoutes',
        loadComponent: () => import('./Route/show-route/show-route.component').then(m => m.ShowRouteComponent),
        children: []
    },
    {
        path: 'getCreatedRoutes',
        loadComponent: () => import('./Route/show-createdroute/show-createdroute.component').then(m => m.ShowCreatedrouteComponent),
        children: []
    },
    {
        path: 'joinedRoutes',
        loadComponent: () => import('./Route/joined-routes/joined-routes.component').then(m => m.JoinedRoutesComponent),
        children: []
    },
    {
        path: 'updateProfileImage',
        loadComponent: () => import('./Profile/update-image/update-image.component').then(m => m.UpdateImageComponent),
        children: []
    },
    {
        path: 'showRouteDetails/:id',
        loadComponent: () => import('./Route/show-route-details/show-route-details.component').then(m => m.ShowRouteDetailsComponent),
        children: []
    },
    {
        path: 'editRoute/:id',
        loadComponent: () => import('./Route/edit-route/edit-route.component').then(m => m.EditRouteComponent),
        children: []
    },
    {
        path: 'pruebaCreate',
        loadComponent: () => import('./Route/prueba-create/prueba-create.component').then(m => m.PruebaCreateComponent),
        children: []
    },
    {
        path: '**',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    },
];
