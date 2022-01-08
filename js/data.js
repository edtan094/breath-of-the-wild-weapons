/* exported data */
var data = {
  view: 'home-page',
  saved: [],
  entry: null
};

var previousEntriesJSON = localStorage.getItem('entry');
if (previousEntriesJSON !== null) {
  data = JSON.parse(previousEntriesJSON);
}

window.addEventListener('beforeunload', function () {
  var savedData = JSON.stringify(data);
  localStorage.setItem('entry', savedData);
});
