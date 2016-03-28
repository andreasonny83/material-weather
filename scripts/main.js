(function() {
  'use strict';

  var refreshBtn = document.getElementById('refresh-btn');

  refreshBtn.addEventListener('click', findMe);

  // find the user and retrive the relative weather info
  findMe();
}());
