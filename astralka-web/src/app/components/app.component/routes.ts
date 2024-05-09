import {Routes} from "@angular/router";
import {AstralkaChartComponent} from "../chart.component/chart.component";
import {AstralkaLoginComponent} from "../login.component/login.component";
import {AstralkaSignUpComponent} from "../signup.component/signup.component";

const routerConfig: Routes = [
  {
    path: '',
    component: AstralkaLoginComponent,
    title: 'Astralka Login'
  },
  {
    path: 'signup',
    component: AstralkaSignUpComponent,
    title: 'Astralka SignUp Page'
  },
  {
    path: 'astralka',
    component: AstralkaChartComponent,
    title: 'Astralka Main Page'
  }
];

export default routerConfig;
