const url = 'https://serene-eyrie-40109.herokuapp.com/api/v1/';
const loginBtn = document.querySelector('.login-btn');

const loader = `
<img src="./images/loader.gif" alt="" style="
  width: 9%;
  padding: 0;
  margin: 0;
">
`;

const setAlert = (value, type) => {
  const alert = document.querySelector('.alert');
  alert.innerHTML = value;
  alert.classList.add(type);
  alert.style.display = 'block';
};

const loginUser = (e) => {
  e.preventDefault();
  loginBtn.innerHTML = loader;
  const email = document.querySelector('.email-field').value;
  const password = document.querySelector('.password-field').value;
  if (email.length === 0 || password.length === 0) {
    setAlert('Please enter your email or password', 'alert-warning');
    loginBtn.innerHTML = 'Submit';
    return false;
  }
  const data = JSON.stringify({
    email,
    password,
  });
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  fetch(`${url}auth/signin`, {
    method: 'POST',
    body: data,
    headers,
  })
    .then(res => res.json())
    .then((response) => {
      loginBtn.innerHTML = 'Submit';
      if (response.status === 'error') {
        setAlert('Invalid email or password', 'alert-warning');
      }
      if (response.status === 'success') {
        setAlert('Login successful', 'alert-success');
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('name', response.data.first_name);
        window.setTimeout(() => {
          location.href = './landing_page.html';
        }, 2000);
      }
    })
    .catch((error) => {
      console.log(JSON.stringify(error));
    });
};

loginBtn.addEventListener('click', loginUser);
