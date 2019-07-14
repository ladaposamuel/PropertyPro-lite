const signoutButton = document.getElementById('signout');
const signout = (e) => {
  e.preventDefault();
  localStorage.removeItem('token');
  localStorage.removeItem('name');
  window.location.replace('./index.html');
};
signoutButton.addEventListener('click', signout);
