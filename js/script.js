function toggleMenu() { document.getElementById('mobileMenu').classList.toggle('open'); }
function closeMenu() { document.getElementById('mobileMenu').classList.remove('open'); }
document.addEventListener('click', function(e) {
  if (!e.target.closest('nav') && !e.target.closest('#mobileMenu')) closeMenu();
});

document.querySelectorAll('.strip-item').forEach(function(item) {
  item.addEventListener('click', function() {
    document.querySelectorAll('.strip-item.active').forEach(function(activeItem) {
      if (activeItem !== item) activeItem.classList.remove('active');
    });
    item.classList.toggle('active');
  });
});

function openModal(id) {
  var modal = document.getElementById('modal-' + id);
  if (!modal) return false;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  return false;
}
function closeModal(id) {
  var modal = document.getElementById('modal-' + id);
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}
function closeModalOutside(e, id) {
  if (e.target === document.getElementById('modal-' + id)) closeModal(id);
}

function closeContactSuccessModal() {
  closeModal('contact-success');
  var contactSection = document.getElementById('contact');
  if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeModal('privacy');
    closeModal('av');
    closeModal('contact-success');
  }
});

document.addEventListener('DOMContentLoaded', function() {
  var form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    var submitButton = form.querySelector('.form-submit');
    var originalText = submitButton ? submitButton.textContent : '';

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Aanvraag wordt verstuurd...';
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
        openModal('contact-success');
      } else {
        alert('Het formulier kon niet worden verstuurd. Probeer het opnieuw of mail naar hallo@cozycompanystudio.nl.');
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
