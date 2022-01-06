var $weaponList = document.querySelector('#weapon-list');
var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://botw-compendium.herokuapp.com/api/v2/category/equipment');
xhr.responseType = 'json';
xhr.addEventListener('load', function () {
  console.log('status of xhr: ', xhr.status);
  console.log('response of xhr: ', xhr.response);
  var $newLi = document.createElement('li');
  $newLi.textContent = xhr.response.data[0].name;
  $weaponList.appendChild($newLi);
  console.log(xhr.response.data[0].name);
  console.log($weaponList);
});
xhr.send();
