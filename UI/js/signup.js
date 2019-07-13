const url = 'https://serene-eyrie-40109.herokuapp.com/api/v1/';
const signUpBtn = document.querySelector('.register-btn');

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

const signUpUser = (e) => {
  e.preventDefault();
  signUpBtn.innerHTML = loader;
  const email = document.querySelector('.email-field').value;
  const password = document.querySelector('.password-field').value;
  const firstName = document.querySelector('.firstname-field').value;
  const lastName = document.querySelector('.lastname-field').value;
  const phoneNumber = document.querySelector('.phone-field').value;
  const address = document.querySelector('.address-field').value;
  const isAgent = document.querySelector('#agent').checked;

  if (
    firstName.length === 0
    || email.length === 0
    || password.length === 0
    || lastName.length === 0
    || phoneNumber.length === 0
    || address.length === 0
  ) {
    setAlert('Please enter the required fields for signup', 'alert-warning');
    signUpBtn.innerHTML = 'Submit';
    return false;
  }
  const data = JSON.stringify({
    firstName,
    lastName,
    email,
    phoneNumber,
    address,
    password,
    isAgent: isAgent === true ? 1 : 0,
  });
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  fetch(`${url}auth/signup`, {
    method: 'POST',
    body: data,
    headers,
  })
    .then(res => res.json())
    .then((response) => {
      signUpBtn.innerHTML = 'Submit';
      if (response.status === 'error') {
        setAlert(response.error, 'alert-warning');
      }
      if (response.status === 'success') {
        setAlert('Signup successful', 'alert-success');
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

signUpBtn.addEventListener('click', signUpUser);
