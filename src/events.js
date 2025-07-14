import { getEvents, getEnrollmentsByUser, enrollUser, unenrollUser, deleteEvent, getEnrollmentsByEvent } from './api.js';

// Funciones para los botones de acción
function getAdminActions(event) {
  return `
    <button class="btn btn-outline-primary btn-sm me-2" id="edit-${event.id}"><i class="bi bi-pencil"></i></button>
    <button class="btn btn-outline-danger btn-sm" id="delete-${event.id}"><i class="bi bi-trash"></i></button>
  `;
}

function getVisitorActions(event, isEnrolled, isFull) {
  if (isEnrolled) {
    return `<button class="btn btn-warning btn-sm" id="unenroll-${event.id}">Cancelar</button>`;
  } else if (isFull) {
    return `<button class="btn btn-secondary btn-sm" disabled>Sold out</button>`;
  } else {
    return `<button class="btn btn-success btn-sm" id="enroll-${event.id}">Inscribirse</button>`;
  }
}

// Renderiza la tarjeta de evento
export function renderEventCard(event, options = {}) {
  const { isEnrolled, isFull, isAdmin } = options;

  let actions;
  if (isAdmin) {
    actions = getAdminActions(event);
  } else {
    actions = getVisitorActions(event, isEnrolled, isFull);
  }

  return `
    <div class="card mb-3 shadow-sm event-card" style="border-radius:18px; transition:box-shadow .2s;">
      <div class="row g-0 align-items-center">
        <div class="col-md-2 d-flex align-items-center justify-content-center">
          <img src="assets/${event.image || 'default.png'}" class="rounded-3" alt="${event.name}" style="max-height:70px; max-width:90px; object-fit:cover;">
        </div>
        <div class="col-md-7">
          <div class="card-body py-3">
            <h5 class="card-title mb-1">${event.name}</h5>
            <div class="text-muted small mb-1">${event.description}</div>
            <div class="d-flex gap-3 small">
              <span><i class="bi bi-people"></i> ${event.capacity}</span>
              <span><i class="bi bi-calendar"></i> ${new Date(event.date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div class="col-md-3 d-flex align-items-center justify-content-end pe-4">
          ${actions}
        </div>
      </div>
    </div>
  `;
}

export function renderEventForm(container, { mode, event = {}, onSave, onCancel }) {
  container.innerHTML = `
    <div class="card mb-4">
      <div class="card-body">
        <h4 class="mb-3">${mode === 'edit' ? 'Editar evento' : 'Nuevo evento'}</h4>
        <form id="eventForm">
          <div class="mb-3">
            <label class="form-label">Nombre</label>
            <input type="text" class="form-control" id="name" value="${event.name || ''}" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Descripción</label>
            <textarea class="form-control" id="description" required>${event.description || ''}</textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Cupo</label>
            <input type="number" class="form-control" id="capacity" min="1" value="${event.capacity || 1}" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Fecha</label>
            <input type="date" class="form-control" id="date" value="${event.date ? event.date.substring(0,10) : ''}" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Imagen (URL)</label>
            <div class="input-group">
              <span class="input-group-text">URL</span>
              <input type="text" class="form-control" id="imageUrl" placeholder="https://..." value="${event.image || ''}" />
            </div>
            <div class="form-text">Ingresa la URL de una imagen para el evento.</div>
          </div>
          <div class="d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-secondary" id="cancelBtn">Cancelar</button>
            <button type="submit" class="btn btn-primary">${mode === 'edit' ? 'Guardar cambios' : 'Crear evento'}</button>
          </div>
          <div id="eventFormError" class="text-danger mt-2"></div>
        </form>
      </div>
    </div>
  `;
  const form = document.getElementById('eventForm');
  const errorDiv = document.getElementById('eventFormError');
  const imageUrlInput = document.getElementById('imageUrl');

  document.getElementById('cancelBtn').onclick = () => {
    onCancel && onCancel();
  };

  form.onsubmit = async (e) => {
    e.preventDefault();
    errorDiv.textContent = '';
    const name = form.name.value.trim();
    const description = form.description.value.trim();
    const capacity = parseInt(form.capacity.value, 10);
    const date = form.date.value;
    const image = imageUrlInput.value.trim();

    // Validación de campos obligatorios
    if (!name || !description || !capacity || !date) {
      errorDiv.textContent = 'Todos los campos obligatorios deben estar completos.';
      return;
    }
    // Validación de cupo
    if (isNaN(capacity) || capacity <= 0) {
      errorDiv.textContent = 'El cupo debe ser un número mayor a 0.';
      return;
    }
    // Validación de fecha
    const today = new Date();
    today.setHours(0,0,0,0);
    const selectedDate = new Date(date);
    if (selectedDate < today) {
      errorDiv.textContent = 'La fecha no puede ser anterior a hoy.';
      return;
    }
    // Solo usar la URL de la imagen
    onSave && onSave({ name, description, capacity, date, image });
  };
}

export async function renderEventList(container, user) {
  container.innerHTML = '<div class="text-center my-4">Cargando eventos...</div>';
  const events = await getEvents();
  let enrollments = [];
  if (user.role === 'visitor') {
    enrollments = await getEnrollmentsByUser(user.id);
  }
  container.innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2>Eventos</h2>
      ${user.role === 'admin' ? '<button class="btn btn-success" id="addEventBtn">Nuevo evento</button>' : ''}
    </div>
    <div id="eventList"></div>
  `;
  const eventListDiv = document.getElementById('eventList');
  eventListDiv.innerHTML = '';

  for (const event of events) {
    let isEnrolled = false;
    let isFull = false;
    if (user.role === 'visitor') {
      isEnrolled = enrollments.some(e => e.eventId === event.id);
      const eventEnrollments = await getEnrollmentsByEvent(event.id);
      isFull = eventEnrollments.length >= event.capacity;
    }
    eventListDiv.innerHTML += renderEventCard(event, {
      isAdmin: user.role === 'admin',
      isEnrolled,
      isFull
    });
  }
  
  if (user.role === 'admin') {
    document.getElementById('addEventBtn').onclick = () => {
      window.dispatchEvent(new CustomEvent('showEventForm', { detail: { mode: 'create' } }));
    };
    events.forEach(event => {
      const editBtn = document.getElementById(`edit-${event.id}`);
      const deleteBtn = document.getElementById(`delete-${event.id}`);
      if (editBtn) editBtn.onclick = () => {
        window.dispatchEvent(new CustomEvent('showEventForm', { detail: { mode: 'edit', event } }));
      };
      if (deleteBtn) deleteBtn.onclick = async () => {
        if (confirm('¿Seguro que deseas eliminar este evento?')) {
          await deleteEvent(event.id);
          renderEventList(container, user);
        }
      };
    });
  } else {
    // Listeners para visitante
    events.forEach(event => {
      const enrollBtn = document.getElementById(`enroll-${event.id}`);
      const unenrollBtn = document.getElementById(`unenroll-${event.id}`);
      if (enrollBtn) enrollBtn.onclick = async () => {
        await enrollUser(user.id, event.id);
        renderEventList(container, user);
      };
      if (unenrollBtn) {
        const enrollment = enrollments.find(e => e.eventId === event.id);
        unenrollBtn.onclick = async () => {
          if (enrollment) {
            await unenrollUser(enrollment.id);
            renderEventList(container, user);
          }
        };
      }
    });
  }
}