export function renderNavbar(title) {
  return `
    <nav class="navbar navbar-light bg-white shadow-sm mb-4">
      <div class="container-fluid">
        <span class="navbar-brand mb-0 h4">${title}</span>
      </div>
    </nav>
  `;
}

export function renderSidebar(user, activeView) {

  return `
    <div class="d-flex flex-column bg-white shadow-sm h-100 p-3">
      <div class="mb-4 text-center">
        <img src="../src/images/avatar.svg" alt="avatar" class="rounded-circle mb-2" width="80" height="80">
        <h5 class="mb-0">${user.fullName}</h5>
        <small class="text-muted">${user.role === 'admin' ? 'Administrador' : 'Visitante'}</small>
      </div>
      <nav class="nav flex-column gap-2">
        <a href="#events" class="nav-link ${activeView}"><i class="bi bi-calendar-event"></i> Eventos</a>
        ${user.role === 'visitor' ? `<a href="#enrollments" class="nav-link ${activeView}"><i class="bi bi-list-check"></i> Mis inscripciones</a>` : ''}
        <a href="#logout" class="nav-link text-danger"><i class="bi bi-box-arrow-right"></i> Cerrar sesión</a>
      </nav>
    </div>
  `;
}