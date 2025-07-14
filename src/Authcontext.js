export function saveUserSession(user) {
  sessionStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('user',JSON.stringify(user))
}

export function getUserSession() {
  const user = sessionStorage.getItem('user');
  const userLocal = localStorage.getItem('user')
  if (user && userLocal){
    return JSON.parse(user) || JSON.parse(userLocal);
  }
  else{
    return null;
  } 
}

export function clearUserSession() {
  sessionStorage.removeItem('user');
}

