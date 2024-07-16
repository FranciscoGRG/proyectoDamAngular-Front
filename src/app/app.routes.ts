import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component'),
        children: [
        
        ]
    },
    {
        path: 'login',
        loadComponent: () => import('./login/login.component'),
        children: [
        
        ]
    },
    {
        path: 'register',
        loadComponent: () => import('./register/register.component'),
        children: [
        
        ]
    },
    {
        path: 'createRoute',
        loadComponent: () => import('./Route/create-route/create-route.component'),
        children: [
        
        ]
    },
    {
        path: 'getRoutes',
        loadComponent: () => import('./Route/show-route/show-route.component'),
        children: [
        
        ]
    },
    {
        path: 'getCreatedRoutes',
        loadComponent: () => import('./Route/show-createdroute/show-createdroute.component'),
        children: [
        
        ]
    },
    {
        path: 'joinedRoutes',
        loadComponent: () => import('./Route/joined-routes/joined-routes.component'),
        children: [
        
        ]
    },
    {
        path: 'updateProfileImage',
        loadComponent: () => import('./Profile/update-image/update-image.component'),
        children: [
        
        ]
    },
    {
        path: '**',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    },
];
