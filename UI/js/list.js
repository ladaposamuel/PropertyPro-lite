const recentPosts = document.querySelector('#adverts');
const loader = document.querySelector('.loader');

const url = 'https://serene-eyrie-40109.herokuapp.com/api/v1/';

const setAlert = (value, type) => {
  const alert = document.querySelector('.alert');
  alert.innerHTML = value;
  alert.classList.add(type);
  alert.style.display = 'block';
};

const advertCard = resp => ` <div class="advert-card">
  <img src="${resp.image_url}" alt="">
<div class="price">NGN ${resp.price}</div>
<div class="advert-card-body">
    <div class="title">${resp.type}</div>
    <div class="type"> ${resp.status}</div>
    <hr>
    <div class="location"><img src="./images/icons8-map-24.png" class="map-icon" alt="">
    ${resp.address},
    ${resp.city} ,  
    ${resp.state}
    
    </div>
</div>
<div class="advert-card-footer">
    <button class="button-global advert-card-btn" onclick="viewProperty()">
        View property
    </button>
</div>
 </div> 
  
`;
loader.style.display = 'block';
const advertPosts = response => response.map(advertCard);

const headers = new Headers();
headers.append('Content-Type', 'application/json');
headers.append('x-access-token', localStorage.getItem('token'));

fetch(`${url}property`, {
  method: 'GET',
  headers,
})
  .then(res => res.json())
  .then((response) => {
    if (response.status === 'error') {
      setAlert('Invalid email or password', 'alert-warning');
    }
    if (response.status === 'success' && response.data.length > 0) {
      loader.style.display = 'none';
      recentPosts.insertAdjacentHTML('beforeend', advertPosts(response.data));
    } else {
      setAlert('No properties found', 'alert-warning');
    }
  })
  .catch((error) => {
    console.log(JSON.stringify(error));
  });
