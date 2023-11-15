// onload functions:

chrome.storage.local.get(['url', 'enabled'], function (items) {
  // onload...
  setPlaceHolder(items.url);
  document.getElementById("enabled").checked = items.enabled;
});

// active functions:

document.getElementById("help").addEventListener('click', () => {
  alert("New-tab-custom-url changes the default URL of a newly opened tab in Chrome!\r\n \r\nThis project is open source. Find the code at: https://github.com/JakeGinesin/new-tab-custom-url");
});

document.getElementById("change").addEventListener('click', () => {
  updateUrl();
});

document.addEventListener("keydown", event => {
  if (event.keyCode === 13 && document.getElementById("url").value !== "") { //activates on enter
    updateUrl();
  }
});

document.getElementById("enable-box").addEventListener('click', () => {
  document.getElementById("enabled").checked = !document.getElementById("enabled").checked;
  check();
});

document.getElementById("enabled").addEventListener('change', function () {
  check();
});

function check() {
  chrome.storage.local.set({ "enabled": document.getElementById("enabled").checked }, function () {
    //random callback lol
  });
}

function setPlaceHolder(url) {
  document.getElementById("url").setAttribute("placeholder", url);
}

function updateUrl() {
  let change = document.getElementById("url").value;
  chrome.storage.local.set({ "url": change }, function () {
    setPlaceHolder(change);
    // Trigger the event to update the URL without focusing on the address bar
    window.dispatchEvent(new CustomEvent('url:loaded', { 'detail': change }));
  });

  document.getElementById("url").value = '';
}

// Fetch URL from storage
var getUrlFromStorage = function () {
  chrome.storage.sync.get("url", function (items) {
    if (!chrome.runtime.error && items.url)
      window.dispatchEvent(
        new CustomEvent('url:loaded', { 'detail': items.url })
      );
  });
}

// Clear URL from storage
var clearUrl = function () {
  chrome.storage.sync.remove('url', function () {
    window.dispatchEvent(
      new CustomEvent('url:loaded', { 'detail': false })
    );
  });
}

// Write URL to storage
var writeUrl = function (newUrl) {
  chrome.storage.sync.set({ "url": newUrl }, function () {
    if (chrome.extension.lastError) {
      alert('Can not save URL: ' + chrome.extension.lastError.message);
    } else {
      window.dispatchEvent(
        new CustomEvent('url:loaded', { 'detail': newUrl })
      );
    }
  });
}

// Update UI
var updateUrlUi = function (storedUrl) {
  document.getElementById('inputUrl').value = storedUrl ?
    storedUrl : "";
  document.getElementById("clearUrl").style.visibility = storedUrl ?
    "visible" : "hidden";
}

window.addEventListener('load', function (evt) {

  // load the URL from storage and update the UI...
  getUrlFromStorage();

  // listen for URL updates...
  window.addEventListener('url:loaded', function (e) {
    console.log('got url loaded... ' + e.detail);
    console.log(e);
    updateUrlUi(e.detail);
  });

  // Handle save
  document.getElementById('buttonSave').addEventListener(
    'click',
    function (e) {
      writeUrl(document.getElementById('inputUrl').value);
    }
  );

  // Handle clear
  document.getElementById('buttonClear').addEventListener(
    'click',
    clearUrl
  );

});
