const resetBtn = document.querySelector('#resetBtn');
const url = 'https://serene-eyrie-40109.herokuapp.com/api/v1/';

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

const ResetUser = (e) => {
  e.preventDefault();
  resetBtn.innerHTML = loader;
  const email = document.querySelector('.email-field').value;

  if (email.length === 0) {
    setAlert('Please enter your email or password', 'alert-warning');
    resetBtn.innerHTML = 'Submit';
    return false;
  }
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  fetch(`${url}auth/${email}/reset_password`, {
    method: 'POST',
    headers,
  })
    .then((response) => {
      resetBtn.innerHTML = 'Submit';
      if (response.status === 'error') {
        setAlert(response.error, 'alert-warning');
      }
      if (response.status === 204) {
        setAlert('Password successfully reset, Please check your email inbox', 'alert-success');
      }
    })
    .catch((error) => {
      console.log('TCL: error', error);
      console.log(JSON.stringify(error));
    });
};

resetBtn.addEventListener('click', ResetUser);
