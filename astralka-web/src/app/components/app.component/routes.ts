import {Routes} from "@angular/router";
import {AstralkaComponent} from "../astralka.main.component/astralka.component";
import {AstralkaLoginComponent} from "../login.component/login.component";

const routerConfig: Routes = [
  {
    path: '',
    component: AstralkaLoginComponent,
    title: 'Astralka Login'
  },
  {
    path: 'astralka',
    component: AstralkaComponent,
    title: 'Astralka Main Page'
  }
];

export default routerConfig;
