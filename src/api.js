const API_URL = 'http://localhost:3001';

// Eventos
export async function getEvents() {
  const res = await fetch(`${API_URL}/events`);
  return await res.json();
}

export async function getEventById(id) {
  const res = await fetch(`${API_URL}/events/${id}`);
  return await res.json();
}

export async function createEvent(event) {
  const res = await fetch(`${API_URL}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event)
  });
  return await res.json();
}

export async function updateEvent(id, event) {
  const res = await fetch(`${API_URL}/events/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event)
  });
  return await res.json();
}

export async function deleteEvent(id) {
  await fetch(`${API_URL}/events/${id}`, { method: 'DELETE' });
}

// Inscripciones
export async function getEnrollmentsByUser(userId) {
  const res = await fetch(`${API_URL}/enrollments?userId=${userId}`);
  return await res.json();
}

export async function getEnrollmentsByEvent(eventId) {
  const res = await fetch(`${API_URL}/enrollments?eventId=${eventId}`);
  return await res.json();
}

export async function enrollUser(userId, eventId) {
  const res = await fetch(`${API_URL}/enrollments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, eventId })
  });
  return await res.json();
}

export async function unenrollUser(enrollmentId) {
  await fetch(`${API_URL}/enrollments/${enrollmentId}`, { method: 'DELETE' });
}

// Usuarios inscritos a un evento
export async function getUsersByEvent(eventId) {
  const enrollments = await getEnrollmentsByEvent(eventId);
  const userIds = enrollments.map(e => e.userId);
  if (userIds.length === 0) return [];
  const res = await fetch(`${API_URL}/users?id=${userIds.join('&id=')}`);
  return await res.json();
}