import { ToasterMessage, ToasterMessages } from '../../../app.model';
import { APP_ROUTER_NAME } from '../../../app.config';

export const TOASTER_MESSAGES: ToasterMessages = {
  notLoggedIn: {
    title: 'Wanna connect with MEGATHON?',
    description: 'Start your journey with ',
    linkedText: 'login',
    url: ['/', APP_ROUTER_NAME.Auth]
  },
  notFilledProfile: {
    title: 'Wanna stand out?',
    description: 'Help others connect with you faster by ',
    linkedText: 'adding more profile details',
    url: ['/', APP_ROUTER_NAME.Main, APP_ROUTER_NAME.ProfileSettings, APP_ROUTER_NAME.Info]
  }
};

export const INITIAL_TOASTER_CONFIG: ToasterMessage = {
  title: '',
  description: '',
  linkedText: '',
  url: ['']
};
