document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('openFoodhub').addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0] && tabs[0].url) {
        var currentUrl = encodeURIComponent(tabs[0].url);
        var newUrl = 'https://foodhub.appelent.nl/app/recipes/my/new?url=' + currentUrl;
        chrome.tabs.create({ url: newUrl });
      }
    });
  });
});
