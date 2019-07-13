const navbar = document.getElementById('myTopnav');

const mobileMenu = () => {
  if (navbar.className === 'topnav') {
    navbar.className += ' responsive';
  } else {
    navbar.className = 'topnav';
  }
};

const viewProperty = () => {
  location.href = './view_ad.html';
};

navbar.addEventListener('click', mobileMenu);
