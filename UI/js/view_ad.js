const advertArea = document.querySelector('.single-advert-card');
const loader = document.querySelector('.loader');

const url = 'https://serene-eyrie-40109.herokuapp.com/api/v1/';

const setAlert = (value, type) => {
  const alert = document.querySelector('.alert');
  alert.innerHTML = value;
  alert.classList.add(type);
  alert.style.display = 'block';
};
const propertyId = localStorage.getItem('propertyId');

const advert = resp => `

<img src="${resp.image_url}" alt="" class="single-advert-img">

<hr>
<div class="single-advert-body">
    <ul>
       <li><b>Price: </b>${resp.price}</li>
        <li><b>Type: </b>${resp.type}</li>
        <li><b>Status: </b>${resp.status}</li>
        <li><b>Owner: </b>${resp.ownerEmail}</li>
        <li><b>City:</b> ${resp.city}</li>
        <li><b>State:</b> ${resp.city}</li>
        <li><b>Address:</b> ${resp.address}</li>
        <li><b>Owner Phone:</b> ${resp.ownerPhoneNumber}</li>
    </ul>
</div>

<a class="button-global mt-40" href="mailto:${resp.ownerEmail}">Send Email to Owner</a>`;

loader.style.display = 'block';

const headers = new Headers();
headers.append('Content-Type', 'application/json');
headers.append('x-access-token', localStorage.getItem('token'));

fetch(`${url}property/${propertyId}`, {
  method: 'GET',
  headers,
})
  .then(res => res.json())
  .then((response) => {
    if (response.status === 'error') {
      setAlert(response.error, 'alert-warning');
    }
    if (response.status === 'success') {
      loader.style.display = 'none';
      advertArea.insertAdjacentHTML('beforeend', advert(response.data));
    } else {
      setAlert('No properties found', 'alert-warning');
    }
  })
  .catch((error) => {
    console.log(JSON.stringify(error));
  });
