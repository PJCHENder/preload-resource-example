const imgWithPreload = document.querySelector('#image-with-preload');
const imgWithoutPreload = document.querySelector('#image-without-preload');
const cards = document.querySelectorAll('.card');

cards.forEach(card => {
  let btn = card.querySelector('.btn');
  btn.addEventListener('click', function(){insertImage(card)});
})

function insertImage(element) {
  element.insertAdjacentHTML('afterbegin', `<img class="card-img-top" src="${ element.dataset.image }" >`);
}

window.onload = function() {
  console.log('window onload');
}
