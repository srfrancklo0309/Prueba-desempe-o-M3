import { renderLogin, renderRegister } from './auth.js';
import { showEventsView, showEnrollmentsView, showWelcome } from './views.js';

export const routes = {
  '#login': renderLogin,
  '#register': renderRegister,
  '#events': showEventsView,
  '#enrollments': showEnrollmentsView,
  '#welcome': showWelcome
};