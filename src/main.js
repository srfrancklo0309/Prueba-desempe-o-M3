import { getUserSession, clearUserSession } from './Authcontext.js';
import { renderSidebar, renderNavbar } from './layout.js';
import { routes } from './routes.js';
import { showUnauthorizedView } from './views.js';

const root = document.getElementById('root');

export function renderLayout(user, activeView, contentHtml) {
  root.innerHTML = `
    <div class="d-flex" style="min-height:100vh;">
      <aside style="width:240px;">
        ${renderSidebar(user, activeView)}
      </aside>
      <main class="flex-grow-1 bg-light" style="min-height:100vh;">
        ${renderNavbar(
          activeView === 'events' ? 'Eventos' :
          activeView === 'enrollments' ? 'Mis inscripciones' :
          'Bienvenido'
        )}
        <div class="container-fluid px-4" id="mainContent">
          ${contentHtml}
        </div>
      </main>
    </div>
  `;
}

export function handleSidebarNav(user) {
  document.querySelector('a[href="#logout"]').onclick = (e) => {
    e.preventDefault();
    clearUserSession();
    location.hash = '#login';
    router();
  };

  document.querySelector('a[href="#events"]').onclick = (e) => {
    e.preventDefault();
    location.hash = '#events';
    router();
  };

  if (user.role === 'visitor') {
    const enrollLink = document.querySelector('a[href="#enrollments"]');
    if (enrollLink) {
      enrollLink.onclick = (e) => {
        e.preventDefault();
        location.hash = '#enrollments';
        router();
      };
    }
  }
}

function router() {
  const user = getUserSession();
  const hash = location.hash || '#login';
  console.log(hash);
  
  if (!user) {
    if (routes[hash] && (hash === '#login' || hash === '#register')) {

      if (hash === '#register') {
        routes[hash](root, () => {
          location.hash = '#login';
          router();
        });
        document.getElementById('goLogin').onclick = (e) => {
          e.preventDefault();
          location.hash = '#login';
          router();
        };
      } else {
        routes[hash](root, () => {
          router();
        });
        document.getElementById('goRegister').onclick = (e) => {
          e.preventDefault();
          location.hash = '#register';
          router();
        };
      }
    } else if (hash !== '#login' && hash !== '#register') {

      showUnauthorizedView();
    } else {

      routes['#login'](root, () => {
        router();
      });
      document.getElementById('goRegister').onclick = (e) => {
        e.preventDefault();
        location.hash = '#register';
        router();
      };
    }
  } else {

    if (routes[hash]) {
      if (hash === '#enrollments' && user.role !== 'visitor') {

        showUnauthorizedView();
      } else if (hash === '#login' || hash === '#register') {

        routes['#welcome'](user);
      } else {

        routes[hash](user);
      }
    } else {

      routes['#welcome'](user);
    }
  }
}

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);