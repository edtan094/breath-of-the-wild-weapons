var $weaponList = document.querySelector('#weapon-list');
var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://botw-compendium.herokuapp.com/api/v2/category/equipment');
xhr.responseType = 'json';
xhr.addEventListener('load', function () {
  var data = xhr.response.data;
  for (var i = 0; i < data.length; i++) {

    $weaponList.appendChild(generateDOM(data[i]));
  }
});
xhr.send();

function generateDOM(data) {
  var $greenDiv = document.createElement('div');
  $greenDiv.setAttribute('class', 'green-card column-half');

  var $rowDiv = document.createElement('div');
  $rowDiv.setAttribute('class', 'row justify-space-between');
  $greenDiv.appendChild($rowDiv);

  var $columnThirdDiv = document.createElement('div');
  $columnThirdDiv.setAttribute('class', 'column-third');
  $rowDiv.appendChild($columnThirdDiv);

  var $img = document.createElement('img');
  $img.setAttribute('class', 'image');
  $img.setAttribute('src', data.image);
  $columnThirdDiv.appendChild($img);

  var $columnHalfDiv = document.createElement('div');
  $columnHalfDiv.setAttribute('class', 'column-always-half');
  $rowDiv.appendChild($columnHalfDiv);

  var $paragraphName = document.createElement('p');
  var lowerCasedName = data.name.toLowerCase();
  var properName = '';
  properName += lowerCasedName[0].toUpperCase();
  for (var i = 1; i < lowerCasedName.length; i++) {
    if (lowerCasedName[i - 1] === ' ') {
      properName += lowerCasedName[i].toUpperCase();
    } else if (lowerCasedName[i - 1] !== ' ') {
      properName += lowerCasedName[i];
    }
  }
  $paragraphName.textContent = properName;
  $paragraphName.setAttribute('class', 'margin-top-five font-size-name weapon-name');
  $columnHalfDiv.appendChild($paragraphName);

  var $paragraphLocation = document.createElement('p');
  $paragraphLocation.textContent = 'Common Locations';
  $paragraphLocation.setAttribute('class', 'margin-bottom-five font-size-common');
  $columnHalfDiv.appendChild($paragraphLocation);

  var $ul = document.createElement('ul');
  $ul.setAttribute('class', 'margin-top-five');
  $columnHalfDiv.appendChild($ul);

  if (data.common_locations === null) {
    var $unknownLi = document.createElement('li');
    $unknownLi.textContent = 'unknown';
    $ul.appendChild($unknownLi);
  } else {
    for (var locationIndex = 0; locationIndex < data.common_locations.length; locationIndex++) {
      var $li = document.createElement('li');
      $li.textContent = data.common_locations[locationIndex];
      $ul.appendChild($li);
    }
  }
  return $greenDiv;

}

var $form = document.querySelector('form');
var $input = document.querySelector('input');
function searchBar(event) {
  event.preventDefault();
  var $allWeapons = document.querySelectorAll('.weapon-name');
  var inputValue = $input.value.toLowerCase();
  for (var nameIndex = 0; nameIndex < $allWeapons.length; nameIndex++) {
    var weaponName = $allWeapons[nameIndex].textContent.toLowerCase();
    var $weaponToBeHidden = $allWeapons[nameIndex].closest('.green-card');
    $weaponToBeHidden.classList.add('display-hidden');
    if (weaponName.includes(inputValue)) {
      $weaponToBeHidden.classList.remove('display-hidden');
    }
  }
}

$form.addEventListener('submit', searchBar);
