import { saveUserSession } from './Authcontext.js';

export function renderLogin(container, onLoginSuccess) {
  container.innerHTML = `
    <div class="row justify-content-center mt-5">
      <div class="col-md-4">
        <div class="card p-4 shadow">
          <h2 class="mb-3 text-center">Login</h2>
          <form id="loginForm">
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input type="email" class="form-control" id="email" required />
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Contraseña</label>
              <input type="password" class="form-control" id="password" required />
            </div>
            <button type="submit" class="btn btn-primary w-100">Log in</button>
            <div class="mt-3 text-center">
              <a href="#register" id="goRegister">¿No tienes cuenta? Regístrate</a>
            </div>
            <div id="loginError" class="text-danger mt-2"></div>
          </form>
        </div>
      </div>
    </div>
  `;

  const form = document.getElementById('loginForm');
  const errorDiv = document.getElementById('loginError');

  form.onsubmit = async (e) => {
    e.preventDefault();
    errorDiv.textContent = '';
    const email = form.email.value.trim();
    const password = form.password.value.trim();
    if (!email.includes('.') || !email.includes('@')) {
      errorDiv.textContent = 'El email debe contener un arroba (@) y un punto (.)';
      return;
    }
    try {
      const res = await fetch(`http://localhost:3001/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
      const users = await res.json();
      if (users.length === 1) {
        saveUserSession(users[0]);
        onLoginSuccess && onLoginSuccess(users[0]);
      } else {
        errorDiv.textContent = 'Credenciales incorrectas.';
      }
    } catch (err) {
      errorDiv.textContent = 'Error de conexión.';
    }
  };
}

export function renderRegister(container, onRegisterSuccess) {
  container.innerHTML = `
    <div class="row justify-content-center mt-5">
      <div class="col-md-4">
        <div class="card p-4 shadow">
          <h2 class="mb-3 text-center">Register</h2>
          <form id="registerForm">
            <div class="mb-3">
              <label for="fullName" class="form-label">Nombre completo</label>
              <input type="text" class="form-control" id="fullName" required />
            </div>
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input type="email" class="form-control" id="email" required />
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Contraseña</label>
              <input type="password" class="form-control" id="password" required />
            </div>
            <div class="mb-3">
              <label for="confirmPassword" class="form-label">Confirmar contraseña</label>
              <input type="password" class="form-control" id="confirmPassword" required />
            </div>
            <button type="submit" class="btn btn-success w-100">Register</button>
            <div class="mt-3 text-center">
              <a href="#login" id="goLogin">¿Ya tienes cuenta? Inicia sesión</a>
            </div>
            <div id="registerError" class="text-danger mt-2"></div>
          </form>
        </div>
      </div>
    </div>
  `;

  const form = document.getElementById('registerForm');
  const errorDiv = document.getElementById('registerError');

  form.onsubmit = async (e) => {
    e.preventDefault();
    errorDiv.textContent = '';
    const fullName = form.fullName.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value.trim();
    const confirmPassword = form.confirmPassword.value.trim();
    if (!fullName || !email || !password || !confirmPassword) {
      errorDiv.textContent = 'Todos los campos son obligatorios.';
      return;
    }
    if (!email.includes('.') || !email.includes('@')) {
      errorDiv.textContent = 'El email debe contener un arroba (@) y un punto (.)';
      return;
    }
    if (password !== confirmPassword) {
      errorDiv.textContent = 'Las contraseñas no coinciden.';
      return;
    }
    try {
      const res = await fetch(`http://localhost:3001/users?email=${encodeURIComponent(email)}`);
      const users = await res.json();
      if (users.length > 0) {
        errorDiv.textContent = 'El email ya está registrado.';
        return;
      }
      const newUser = { fullName, email, password, role: 'visitor' };
      const createRes = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      if (createRes.ok) {
        onRegisterSuccess && onRegisterSuccess();
      } else {
        errorDiv.textContent = 'Error al registrar usuario.';
      }
    } catch (err) {
      errorDiv.textContent = 'Error de conexión.';
    }
  };
}