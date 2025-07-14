import { renderLayout, handleSidebarNav } from './main.js';
import { renderEventList, renderEventForm } from './events.js';
import { createEvent, updateEvent } from './api.js';
import { renderEnrollmentList } from './enrollments.js';

export async function showEventsView(user) {

  renderLayout(user, 'events', '<div class="text-center my-4">Cargando eventos...</div>');
  const container = document.getElementById('mainContent');

  await renderEventList(container, user);
  handleSidebarNav(user);


  window.addEventListener('showEventForm', function handler(e) {
    window.removeEventListener('showEventForm', handler);
    renderEventForm(container, {
      mode: e.detail.mode,
      event: e.detail.event,
      onSave: async (data) => {
        if (e.detail.mode === 'edit') {
          await updateEvent(e.detail.event.id, { ...e.detail.event, ...data });
        } else {
          await createEvent(data);
        }
        await showEventsView(user);
      },
      onCancel: async () => {
        await showEventsView(user);
      }
    });
  });
}

export async function showEnrollmentsView(user) {
  renderLayout(user, 'enrollments', '<div class="text-center my-4">Cargando inscripciones...</div>');
  const container = document.getElementById('mainContent');
  await renderEnrollmentList(container, user);
  handleSidebarNav(user);
}

export function showWelcome(user) {
  renderLayout(user, 'welcome', `
    <div class="d-flex flex-column align-items-center justify-content-center" style="min-height:60vh;">
      <h1 class="mb-3">Bienvenido, ${user.fullName}</h1>
      <p class="mb-4">Rol: <b>${user.role === 'admin' ? 'Administrador' : 'Visitante'}</b></p>
      <div>
        <a href="#events" class="btn btn-primary me-2">Ver eventos</a>
        ${user.role === 'visitor' ? '<a href="#enrollments" class="btn btn-outline-info me-2">Mis inscripciones</a>' : ''}
      </div>
    </div>
  `);
  handleSidebarNav(user);
}

export function showUnauthorizedView() {
  const root = document.getElementById('root');
  root.innerHTML = `
    <div class="d-flex flex-column align-items-center justify-content-center" style="min-height:80vh;">
      <div class="text-center">
        <h2 class="mb-3 text-danger"><i class="bi bi-shield-lock"></i> Acceso no autorizado</h2>
        <p>No tienes permisos para ver esta página.</p>
        <a href="#login" class="btn btn-primary">Ir al login</a>
      </div>
    </div>
  `;
} 