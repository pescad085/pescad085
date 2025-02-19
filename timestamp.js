let timeParagraph = document.getElementById("copyr");


let date = new Date()
const year = date.getFullYear();
timeParagraph.innerHTML = year;




// navigation bar js code 
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');
mobileMenu.addEventListener('click', ()=> { 
  navLinks.classList.toggle('active');

});

// End Of navigation bar code 