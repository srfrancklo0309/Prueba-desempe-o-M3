import { getEnrollmentsByUser, getEventById, unenrollUser } from './api.js';

export async function renderEnrollmentList(container, user) {
  container.innerHTML = '<div class="text-center my-4">Cargando inscripciones...</div>';
  const enrollments = await getEnrollmentsByUser(user.id);
  if (enrollments.length === 0) {
    container.innerHTML = '<div class="alert alert-info mt-4">No tienes inscripciones activas.</div>';
    return;
  }
  let html = '<h2 class="mb-3">Mis inscripciones</h2>';
  html += '<ul class="list-group">';
  for (const enrollment of enrollments) {
    const event = await getEventById(enrollment.eventId);
    html += `<li class="list-group-item d-flex justify-content-between align-items-center">
      <span><img src="assets/${event.image || 'default.png'}" alt="${event.name}" style="width:32px;height:32px;object-fit:cover;border-radius:6px;" class="me-2"> <b>${event.name}</b> <small class="text-muted">(${new Date(event.date).toLocaleDateString()})</small></span>
      <button class="btn btn-sm btn-danger" id="unenroll-${enrollment.id}">Cancelar</button>
    </li>`;
  }
  html += '</ul>';
  container.innerHTML = html;
  enrollments.forEach(enrollment => {
    const btn = document.getElementById(`unenroll-${enrollment.id}`);
    if (btn) btn.onclick = async () => {
      await unenrollUser(enrollment.id);
      renderEnrollmentList(container, user);
    };
  });
}