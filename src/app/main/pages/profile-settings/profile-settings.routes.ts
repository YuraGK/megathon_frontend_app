import { APP_ROUTER_NAME, HEADER_CONFIG_LIST, HEADER_CONFIG_NAME } from '../../../app.config';
import { ProfileSettingsComponent } from './profile-settings.component';
import { canDeactivateGuard } from '../../../services/guards/can-deactivate.guard';

export default [
  {
    path: '',
    children: [
      {
        path: '',
        component: ProfileSettingsComponent,
        data: HEADER_CONFIG_LIST[HEADER_CONFIG_NAME.profileSettings]
      },
      {
        path: APP_ROUTER_NAME.Details,
        loadComponent: () => import('../details/details.component'),
        data: HEADER_CONFIG_LIST[HEADER_CONFIG_NAME.accountDetails],
        title: 'MEGATHON | Account Details'
      },
      {
        path: APP_ROUTER_NAME.ChangePassword,
        loadComponent: () => import('../change-password/change-password.component'),
        data: HEADER_CONFIG_LIST[HEADER_CONFIG_NAME.changePassword],
        title: 'MEGATHON | Account Details'
      },
      {
        path: APP_ROUTER_NAME.Info,
        loadComponent: () => import('../info/info.component'),
        canDeactivate: [canDeactivateGuard],
        data: HEADER_CONFIG_LIST[HEADER_CONFIG_NAME.profileDetails],
        title: 'MEGATHON | Profile Info'
      },
      {
        path: APP_ROUTER_NAME.Privacy,
        loadComponent: () => import('../privacy/privacy.component'),
        data: HEADER_CONFIG_LIST[HEADER_CONFIG_NAME.privacy],
        title: 'MEGATHON | Privacy'
      }
    ]
  }
];
