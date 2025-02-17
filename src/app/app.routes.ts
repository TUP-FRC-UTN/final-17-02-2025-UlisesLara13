import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { GameComponent } from './game/game.component';
import { ScoresComponent } from './scores/scores.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: 'game', component: GameComponent, canActivate: [AuthGuard] }, 
    { path: 'scores', component: ScoresComponent, canActivate: [AuthGuard]}, 
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' }
];
