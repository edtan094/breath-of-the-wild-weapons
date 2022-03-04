var $weaponList = document.querySelector('#weapon-list');
var $loadingSpinner = document.querySelector('#loading-spinner');
var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://botw-compendium.herokuapp.com/api/v2/category/equipment');
xhr.responseType = 'json';
xhr.addEventListener('load', function () {
  if (xhr.status !== 200) {
    $loadingSpinner.classList.replace('display', 'hidden');
    loopThroughViews('network-error');
  } else {
    var data = xhr.response.data;
    for (var i = 0; i < data.length; i++) {
      loopThroughViews('home-page');
      $weaponList.appendChild(generateDOM(data[i]));
      $loadingSpinner.classList.replace('display', 'hidden');
    }
  }
});
xhr.send();

function generateDOM(info) {
  var $greenButton = document.createElement('button');
  $greenButton.setAttribute('class', 'green-card column-half border-radius-and-shadow weapons');
  $greenButton.setAttribute('id', info.id);

  var $rowDiv = document.createElement('div');
  $rowDiv.setAttribute('class', 'row justify-space-between weapons');
  $greenButton.appendChild($rowDiv);

  var $columnThirdDiv = document.createElement('div');
  $columnThirdDiv.setAttribute('class', 'column-third weapons');
  $rowDiv.appendChild($columnThirdDiv);

  var $img = document.createElement('img');
  $img.setAttribute('class', 'image weapons');
  $img.setAttribute('src', info.image);
  $columnThirdDiv.appendChild($img);

  var $columnHalfDiv = document.createElement('div');
  $columnHalfDiv.setAttribute('class', 'column-always-half weapons');
  $rowDiv.appendChild($columnHalfDiv);

  var $paragraphName = document.createElement('p');
  var lowerCasedName = info.name.toLowerCase();
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
  $paragraphName.setAttribute('class', 'margin-top-five font-size-17 weapon-name weapons margin-bottom-0');
  $columnHalfDiv.appendChild($paragraphName);

  var $paragraphLocation = document.createElement('p');
  $paragraphLocation.textContent = 'Common Locations';
  $paragraphLocation.setAttribute('class', 'margin-bottom-5 font-size-15 weapons margin-top-0');
  $columnHalfDiv.appendChild($paragraphLocation);

  var $ul = document.createElement('ul');
  $ul.setAttribute('class', 'margin-top-five weapons margin-bottom-5 max-height-48');
  $columnHalfDiv.appendChild($ul);
  var $deleteButton = document.createElement('button');
  var $divForDeleteButton = document.createElement('div');
  $deleteButton.setAttribute('class', 'delete-button');
  $deleteButton.textContent = 'Delete';
  $divForDeleteButton.setAttribute('class', 'hidden view row justify-end');
  $divForDeleteButton.setAttribute('data-view', 'saved');
  $divForDeleteButton.appendChild($deleteButton);
  $columnHalfDiv.appendChild($divForDeleteButton);

  if (info.common_locations === null) {
    var $unknownLi = document.createElement('li');
    $unknownLi.textContent = 'unknown';
    $unknownLi.setAttribute('class', 'weapons');
    $ul.appendChild($unknownLi);
  } else {
    for (var locationIndex = 0; locationIndex < info.common_locations.length; locationIndex++) {
      var $li = document.createElement('li');
      $li.textContent = info.common_locations[locationIndex];
      $li.setAttribute('class', 'weapons');
      $ul.appendChild($li);
    }
  }
  return $greenButton;

}

var $form = document.querySelector('form');
var $input = document.querySelector('input');
var $noWeaponsFound = document.querySelector('.no-weapons-found');
function searchBar(event) {
  event.preventDefault();
  var $allWeapons = document.querySelectorAll('.weapon-name');
  var inputValue = $input.value.toLowerCase();
  var foundWeaponStatus = false;
  $noWeaponsFound.classList.replace('display', 'hidden');
  for (var nameIndex = 0; nameIndex < $allWeapons.length; nameIndex++) {
    var weaponName = $allWeapons[nameIndex].textContent.toLowerCase();
    var $weaponToBeHidden = $allWeapons[nameIndex].closest('.green-card');
    $weaponToBeHidden.classList.add('hidden');
    if (weaponName.includes(inputValue)) {
      $weaponToBeHidden.classList.remove('hidden');
      foundWeaponStatus = true;
    }
  }
  if (foundWeaponStatus === false) {
    $noWeaponsFound.classList.replace('hidden', 'display');
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
        data.clicked = dataBOTW[dataIndex];
        $imageInDetails.setAttribute('src', data.clicked.image);
        $descriptionInDetails.textContent = data.clicked.description;
        $commonLocationsInDetails.textContent = data.clicked.common_locations;
      }
    }
  }

}

document.addEventListener('click', bringUserToDetailsPage);

function loopThroughViews(view) {
  var $allViews = document.querySelectorAll('.view');
  for (var viewIndex = 0; viewIndex < $allViews.length; viewIndex++) {
    if ($allViews[viewIndex].getAttribute('data-view') !== view) {
      $allViews[viewIndex].classList.replace('display', 'hidden');
    } else {
      $allViews[viewIndex].classList.replace('hidden', 'display');
      data.view = view;
    }
  }
}

var $searchBar = document.querySelector('#search');

function switchViews(event) {
  if (event.target.matches('.weapons')) {
    loopThroughViews('details');
  }
  if (event.target.matches('.home')) {
    loopThroughViews('home-page');
    $searchBar.value = null;
    displayAllWeapons();
  }
  if (event.target.matches('.saved-weapon-list')) {
    loopThroughViews('saved');
    noWeaponsSaved();
    displayAllWeapons();
  }
}
document.addEventListener('click', switchViews);

var $savedWeaponList = document.querySelector('#saved-weapon-list');
function previousDataView(data) {
  var $allViews = document.querySelectorAll('.view');
  for (var viewIndex = 0; viewIndex < $allViews.length; viewIndex++) {
    if (data.view === $allViews[viewIndex].getAttribute('data-view')) {
      $allViews[viewIndex].classList.replace('hidden', 'display');
    }
  }
  $imageInDetails.setAttribute('src', data.clicked.image);
  $descriptionInDetails.textContent = data.clicked.description;
  $commonLocationsInDetails.textContent = data.clicked.common_locations;
  for (var i = 0; i < data.saved.length; i++) {
    $savedWeaponList.appendChild(generateDOM(data.saved[i]));
  }
  loopThroughViews(data.view);
}
previousDataView(data);

function saveWeapon(event) {
  if (event.target.matches('.save-button')) {
    var $allWeapons = document.querySelectorAll('.weapon-name');
    for (var nameIndex = 0; nameIndex < $allWeapons.length; nameIndex++) {
      var $weaponsThatAreHiddenFromSearchBar = $allWeapons[nameIndex].closest('.green-card');
      $weaponsThatAreHiddenFromSearchBar.classList.remove('hidden');
    }
    data.saved.push(data.clicked);
    var $savedWeaponList = document.querySelector('#saved-weapon-list');
    $savedWeaponList.appendChild(generateDOM(data.clicked));
    loopThroughViews('saved');
    noWeaponsSaved();
  }
}
var $saveButton = document.querySelector('.save-button');
$saveButton.addEventListener('click', saveWeapon);

function deleteWeapon(event) {
  if (event.target.matches('.delete-button')) {
    var $weaponToBeDeleted = event.target.closest('.green-card');
    var $weaponToBeDeletedID = parseInt($weaponToBeDeleted.getAttribute('id'));
    for (var savedIndex = 0; savedIndex < data.saved.length; savedIndex++) {
      if (data.saved[savedIndex].id === $weaponToBeDeletedID) {
        data.saved.splice(savedIndex, 1);
        $savedWeaponList.removeChild($weaponToBeDeleted);
        noWeaponsSaved();
      }
    }
  }
}
document.addEventListener('click', deleteWeapon);

var $noWeaponsSavedText = document.querySelector('.no-weapons-saved');
function noWeaponsSaved() {
  if (data.saved.length > 0) {
    $noWeaponsSavedText.classList.replace('display', 'hidden');
  } else if (data.saved.length === 0) {
    $noWeaponsSavedText.classList.replace('hidden', 'display');
  }

}
noWeaponsSaved();

function displayAllWeapons() {
  var $allWeapons = document.querySelectorAll('.green-card');
  for (var i = 0; i < $allWeapons.length; i++) {
    $allWeapons[i].classList.replace('hidden', 'display');
  }
}
