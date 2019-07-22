const url = 'https://serene-eyrie-40109.herokuapp.com/api/v1/';
const newBtn = document.querySelector('.new-btn');

// const price = document.querySelector('.price-field').value;
// const city = document.querySelector('.city-field').value;
// const state = document.querySelector('.state-field').value;
// const PropertyTypeDropDown = document.querySelector('.type-field');
// const PropertyType = PropertyTypeDropDown.options[PropertyTypeDropDown.selectedIndex].value;
// const address = document.querySelector('.address-field').value;

// const file = document.querySelector('.image-field').files[0];

const form = document.querySelector('#new_ad');
// newBtn.addEventListener('click', form.submit());

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

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  newBtn.innerHTML = loader;
  const data = {};
  const myForm = new FormData(form);
  myForm.append('file', form.image.files[0]);
  myForm.delete('image');
  myForm.forEach((value, key) => {
    data[key] = value;
  });
  const headers = new Headers();
  headers.append('x-access-token', localStorage.getItem('token'));
  try {
    const response = await fetch(`${url}property`, {
      method: 'POST',
      mode: 'cors',
      body: new URLSearchParams(myForm),
      headers,
    });
    const result = await response.json();
    if (result.status === 'error') {
      setAlert(result.error, 'alert-warning');
    }
    setAlert('Property Posted successfully', 'alert-success');
    window.setTimeout(() => {
      location.href = './agent_ads.html';
    }, 2000);
    newBtn.innerHTML = 'Submit';
  } catch (err) {
    console.log('TCL: err', err);
  }
});
