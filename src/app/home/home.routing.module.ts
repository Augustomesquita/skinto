import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeLayoutComponent } from './home-layout.component';
import { HomeComponent } from './home.component';


// A rota de login para cair neste children primeiro, o valor do children
// deve ser o mesmo valor do path.
const homeRoutes: Routes = [
    {
        path: '', component: HomeLayoutComponent,
        children: [
            { path: '', component: HomeComponent }]
    }
]

@NgModule({
    imports: [RouterModule.forChild(homeRoutes)],
    exports: [RouterModule]
})
export class HomeRoutingModule { }
