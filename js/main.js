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
  $greenDiv.setAttribute('class', 'green-card column-half border-radius-and-shadow weapons');
  $greenDiv.setAttribute('id', data.id);

  var $rowDiv = document.createElement('div');
  $rowDiv.setAttribute('class', 'row justify-space-between weapons');
  $greenDiv.appendChild($rowDiv);

  var $columnThirdDiv = document.createElement('div');
  $columnThirdDiv.setAttribute('class', 'column-third weapons');
  $rowDiv.appendChild($columnThirdDiv);

  var $img = document.createElement('img');
  $img.setAttribute('class', 'image weapons');
  $img.setAttribute('src', data.image);
  $columnThirdDiv.appendChild($img);

  var $columnHalfDiv = document.createElement('div');
  $columnHalfDiv.setAttribute('class', 'column-always-half weapons');
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
  $paragraphName.setAttribute('class', 'margin-top-five font-size-17 weapon-name weapons');
  $columnHalfDiv.appendChild($paragraphName);

  var $paragraphLocation = document.createElement('p');
  $paragraphLocation.textContent = 'Common Locations';
  $paragraphLocation.setAttribute('class', 'margin-bottom-five font-size-15 weapons');
  $columnHalfDiv.appendChild($paragraphLocation);

  var $ul = document.createElement('ul');
  $ul.setAttribute('class', 'margin-top-five weapons');
  $columnHalfDiv.appendChild($ul);

  if (data.common_locations === null) {
    var $unknownLi = document.createElement('li');
    $unknownLi.textContent = 'unknown';
    $unknownLi.setAttribute('class', 'weapons');
    $ul.appendChild($unknownLi);
  } else {
    for (var locationIndex = 0; locationIndex < data.common_locations.length; locationIndex++) {
      var $li = document.createElement('li');
      $li.textContent = data.common_locations[locationIndex];
      $li.setAttribute('class', 'weapons');
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
    $weaponToBeHidden.classList.add('hidden');
    if (weaponName.includes(inputValue)) {
      $weaponToBeHidden.classList.remove('hidden');
    }
  }
}

$form.addEventListener('submit', searchBar);

var $imageInDetails = document.querySelector('.image-in-details');
var $descriptionInDetails = document.querySelector('.description');
var $commonLocationsInDetails = document.querySelector('.common-locations');
function bringUserToDetailsPage(event) {
  if (event.target.matches('.weapons')) {
    var weaponThatWasClicked = event.target.closest('.green-card');
    var weaponThatWasClickedID = weaponThatWasClicked.getAttribute('id');
    weaponThatWasClickedID = parseInt(weaponThatWasClickedID);
    var dataBOTW = xhr.response.data;
    for (var dataIndex = 0; dataIndex < dataBOTW.length; dataIndex++) {
      if (dataBOTW[dataIndex].id === weaponThatWasClickedID) {
        data.clicked.name = dataBOTW[dataIndex].name;
        data.clicked.image = dataBOTW[dataIndex].image;
        data.clicked.description = dataBOTW[dataIndex].description;
        data.clicked.common_locations = dataBOTW[dataIndex].common_locations;
        data.clicked.id = dataBOTW[dataIndex].id;
        $imageInDetails.setAttribute('src', data.clicked.image);
        $descriptionInDetails.textContent = data.clicked.description;
        $commonLocationsInDetails.textContent = data.clicked.common_locations;
      }
    }
  }

}

document.addEventListener('click', bringUserToDetailsPage);

var $allViews = document.querySelectorAll('.view');

function loopThroughViews(view) {
  for (var viewIndex = 0; viewIndex < $allViews.length; viewIndex++) {
    if ($allViews[viewIndex].getAttribute('data-view') !== view) {
      $allViews[viewIndex].classList.replace('display', 'hidden');
    } else {
      $allViews[viewIndex].classList.replace('hidden', 'display');
      data.view = view;
    }
  }
}

function switchViews(event) {
  if (event.target.matches('.weapons')) {
    loopThroughViews('details');
  }
  if (event.target.matches('.home')) {
    loopThroughViews('home-page');
  }
  if (event.target.matches('.saved-weapon-list')) {
    loopThroughViews('saved');
  }
}
document.addEventListener('click', switchViews);

var $savedWeaponList = document.querySelector('#saved-weapon-list');
function previousDataView(data) {
  for (var viewIndex = 0; viewIndex < $allViews.length; viewIndex++) {
    if (data.view === $allViews[viewIndex].getAttribute('data-view')) {
      $allViews[viewIndex].classList.replace('hidden', 'display');
    }
  }
  $imageInDetails.setAttribute('src', data.clicked.image);
  $descriptionInDetails.textContent = data.clicked.description;
  $commonLocationsInDetails.textContent = data.clicked.common_locations;

  if (data.view === 'saved') {
    for (var i = 0; i < data.saved.length; i++) {
      $savedWeaponList.appendChild(generateDOM(data.saved[i]));
    }
  }
}
previousDataView(data);

function saveWeapon(event) {
  if (event.target.matches('.save-button')) {
    data.saved.push(data.clicked);
    $savedWeaponList.appendChild(generateDOM(data.clicked));
    loopThroughViews('saved');
  }
}
var $saveButton = document.querySelector('.save-button');
$saveButton.addEventListener('click', saveWeapon);
