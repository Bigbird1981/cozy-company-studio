function intakeSetCheckedByValue(name, values) {
  values.forEach(function(value) {
    var input = document.querySelector('input[name="' + name + '[]"][value="' + value + '"]');
    if (input) input.checked = true;
  });
}

function intakeUpdateCollageLinks() {
  var orgField = document.getElementById('orgName');
  var grid = document.getElementById('collageGrid');
  if (!orgField || !grid) return;

  var org = (orgField.value || 'organisatie').trim() || 'organisatie';
  var queries = [
    ['Gebouw & gevel', org + ' gebouw gevel locatie'],
    ['Werkplekken', org + ' kantoor werkplek interieur'],
    ['Producten', org + ' product dienst verpakking'],
    ['Kleding', org + ' medewerker uniform werkkleding'],
    ['Voertuigen', org + ' voertuig wagen bus trein'],
    ['Logo & stijl', org + ' logo huisstijl brandbook']
  ];

  grid.innerHTML = '';
  queries.forEach(function(item) {
    var tile = document.createElement('a');
    tile.className = 'collage-tile';
    tile.href = 'https://www.google.com/search?tbm=isch&q=' + encodeURIComponent(item[1]);
    tile.target = '_blank';
    tile.rel = 'noopener noreferrer';
    tile.innerHTML = '<strong>' + item[0] + '</strong><span>Open publieke beelden</span>';
    grid.appendChild(tile);
  });
}

function intakeApplyPublicSuggestions() {
  var org = document.getElementById('orgName');
  var website = document.getElementById('orgWebsite');
  var text = ((org ? org.value : '') + ' ' + (website ? website.value : '')).toLowerCase();

  intakeSetCheckedByValue('herkenbaarheid', ['Gebouwen en gevels', 'Werkplekken', 'Logo subtiel gebruiken', 'Dagelijkse routines']);
  intakeSetCheckedByValue('scene_type', ['Mensen aan het werk', 'Gebouw of ruimte', 'Achter de schermen']);

  if (/zorg|care|hospital|ziekenhuis|clinic|kliniek|medisch|medical/.test(text)) {
    intakeSetCheckedByValue('gevoelige_context', ['Strenge hygiene', 'Geen dieren passend', 'Geen herkenbare personen']);
    intakeSetCheckedByValue('herkenbaarheid', ['Uniformen of werkkleding']);
  }

  if (/food|voeding|restaurant|catering|bakker|keuken|fresh|vers/.test(text)) {
    intakeSetCheckedByValue('gevoelige_context', ['Strenge hygiene', 'Geen dieren passend']);
    intakeSetCheckedByValue('herkenbaarheid', ['Producten of verpakkingen']);
  }

  if (/industrie|tech|machine|factory|fabriek|logistiek|transport|rail|bouw/.test(text)) {
    intakeSetCheckedByValue('gevoelige_context', ['Veiligheidszones', 'Vertrouwelijke processen']);
    intakeSetCheckedByValue('herkenbaarheid', ['Voertuigen', 'Producten of verpakkingen']);
  }

  if (/school|onderwijs|university|universiteit|college|academy/.test(text)) {
    intakeSetCheckedByValue('doelgroep', ['Kinderen en families', 'Medewerkers']);
    intakeSetCheckedByValue('herkenbaarheid', ['Lokale omgeving']);
  }

  intakeUpdateCollageLinks();
}

document.addEventListener('DOMContentLoaded', function() {
  var params = new URLSearchParams(window.location.search);
  var fieldMap = {
    org: 'orgName',
    organisatie: 'orgName',
    website: 'orgWebsite',
    email: 'email',
    contactpersoon: 'contactpersoon'
  };

  Object.keys(fieldMap).forEach(function(paramName) {
    var value = params.get(paramName);
    var field = document.getElementById(fieldMap[paramName]) || document.querySelector('[name="' + fieldMap[paramName] + '"]');
    if (value && field) field.value = value;
  });

  var orgField = document.getElementById('orgName');
  if (orgField) orgField.addEventListener('input', intakeUpdateCollageLinks);

  var prefillButton = document.getElementById('prefillButton');
  if (prefillButton) prefillButton.addEventListener('click', intakeApplyPublicSuggestions);

  intakeUpdateCollageLinks();

  var form = document.getElementById('intakeForm');
  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    var submitButton = form.querySelector('.form-submit');
    var originalText = submitButton ? submitButton.textContent : '';

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Intake wordt verstuurd...';
    }

    try {
      var formData = new FormData(form);
      var response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });
      var result = await response.json();

      if (response.ok && result.success) {
        form.reset();
        intakeUpdateCollageLinks();
        openModal('intake-success');
      } else {
        alert('De intake kon niet worden verstuurd. Probeer het opnieuw of mail naar hallo@cozycompanystudio.nl.');
      }
    } catch (error) {
      alert('Er ging iets mis bij het versturen. Probeer het opnieuw of mail naar hallo@cozycompanystudio.nl.');
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      }
    }
  });
});
