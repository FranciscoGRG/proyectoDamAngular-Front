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
        path: '**',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    },
];
