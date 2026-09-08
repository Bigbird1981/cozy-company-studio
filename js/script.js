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
  var layoutStyle = document.createElement('style');
  layoutStyle.textContent = '.hero-subtitle,.section-intro{max-width:none;width:100%;}.hero-left{max-width:none;}.contact-left .section-title{max-width:none;}@media(min-width:901px){.hero-subtitle{max-width:760px;}.section-intro{max-width:900px;}#pricing .section-intro{max-width:900px;}.pricing-footer-note{max-width:720px;}}';
  document.head.appendChild(layoutStyle);
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

document.addEventListener('DOMContentLoaded', function() {
  var heroRight = document.querySelector('.hero-right');
  if (!heroRight) return;

  var style = document.createElement('style');
  style.textContent = '.hero-right.has-hero-video{padding:0;align-items:stretch;justify-content:stretch}.hero-video-wrap{width:100%;height:100%;min-height:400px;display:flex;background:#EBF0EB;overflow:hidden}.hero-video{width:100%;height:100%;object-fit:cover;display:block}';
  document.head.appendChild(style);

  var video = document.createElement('video');
  video.className = 'hero-video';
  video.autoplay = true;
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = 'metadata';
  video.setAttribute('aria-label', 'Cozy Company Studio videopreview');

  var source = document.createElement('source');
  source.src = 'videos/cozy-company-studio.mp4';
  source.type = 'video/mp4';
  video.appendChild(source);

  var videoWrap = document.createElement('div');
  videoWrap.className = 'hero-video-wrap';
  videoWrap.appendChild(video);

  video.addEventListener('loadeddata', function() {
    heroRight.classList.add('has-hero-video');
    heroRight.innerHTML = '';
    heroRight.appendChild(videoWrap);
    video.play().catch(function() {});
  });
});
