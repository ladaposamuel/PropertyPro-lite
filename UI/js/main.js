const navbar = document.getElementById('myTopnav');
// const viewAdBtn = document.querySelector('.advert-card-btn');
// console.log('TCL: viewAdBtn', viewAdBtn);

const mobileMenu = () => {
  if (navbar.className === 'topnav') {
    navbar.className += ' responsive';
  } else {
    navbar.className = 'topnav';
  }
};


navbar.addEventListener('click', mobileMenu);
