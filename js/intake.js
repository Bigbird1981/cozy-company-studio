document.addEventListener('DOMContentLoaded', function() {
  var params = new URLSearchParams(window.location.search);
  ['organisatie', 'website', 'email', 'contactpersoon', 'publieke_samenvatting'].forEach(function(id) {
    var field = document.getElementById(id);
    var value = params.get(id);
    if (field && value) field.value = value;
  });

  var orgField = document.getElementById('organisatie');
  var sourceLinks = document.getElementById('sourceLinks');
  function renderSourceLinks() {
    if (!sourceLinks) return;
    var org = orgField && orgField.value ? orgField.value : 'organisatie';
    sourceLinks.innerHTML = '<span class="compact-note">Zoek publiek naar: website, afbeeldingen, nieuws, LinkedIn, kernwaarden en logo van ' + org.replace(/[<>]/g, '') + '.</span>';
  }
  renderSourceLinks();
  if (orgField) orgField.addEventListener('input', renderSourceLinks);

  var grid = document.getElementById('collageGrid');
  if (grid) {
    var photos = [];
    for (var i = 1; i <= 6; i += 1) {
      var photo = params.get('photo' + i) || params.get('foto' + i);
      if (photo) photos.push(photo);
    }
    if (photos.length) {
      grid.innerHTML = '';
      photos.slice(0, 6).forEach(function(url, index) {
        var tile = document.createElement('div');
        tile.className = 'collage-tile';
        var img = document.createElement('img');
        img.src = url;
        img.alt = 'Publieke collagefoto ' + (index + 1);
        tile.appendChild(img);
        grid.appendChild(tile);
      });
    }
  }

  var form = document.getElementById('intakeForm');
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      var button = form.querySelector('.form-submit');
      var oldText = button ? button.textContent : '';
      if (button) {
        button.disabled = true;
        button.textContent = 'Intake wordt verstuurd...';
      }
      try {
        var response = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } });
        var result = await response.json();
        if (response.ok && result.success) {
          form.reset();
          openModal('intake-success');
        } else {
          alert('De intake kon niet worden verstuurd. Probeer het opnieuw of mail naar hallo@cozycompanystudio.nl.');
        }
      } catch (error) {
        alert('Er ging iets mis bij het versturen. Probeer het opnieuw of mail naar hallo@cozycompanystudio.nl.');
      } finally {
        if (button) {
          button.disabled = false;
          button.textContent = oldText;
        }
      }
    });
  }

  var copyButton = document.getElementById('copyPrefillLink');
  if (copyButton) {
    copyButton.addEventListener('click', function() {
      var url = new URL(window.location.origin + window.location.pathname);
      ['organisatie', 'website', 'publieke_samenvatting'].forEach(function(id) {
        var field = document.getElementById(id);
        if (field && field.value) url.searchParams.set(id, field.value);
      });
      window.prompt('Kopieer deze voorinvullink:', url.toString());
    });
  }
});
