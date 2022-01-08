/* exported data */
var data = {
  view: 'home-page',
  clicked: {},
  saved: [],
  entry: null
};

debugger;
var previousEntriesJSON = localStorage.getItem('entry');
if (previousEntriesJSON !== null) {
  data = JSON.parse(previousEntriesJSON);
}

window.addEventListener('beforeunload', function () {
  var savedData = JSON.stringify(data);
  localStorage.setItem('entry', savedData);
});
