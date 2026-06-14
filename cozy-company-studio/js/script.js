function toggleMenu() { document.getElementById('mobileMenu').classList.toggle('open'); }
  function closeMenu() { document.getElementById('mobileMenu').classList.remove('open'); }
  document.addEventListener('click', function(e) {
    if (!e.target.closest('nav') && !e.target.closest('#mobileMenu')) closeMenu();
  });

  function openModal(id) {
    document.getElementById('modal-' + id).classList.add('open');
    document.body.style.overflow = 'hidden';
    return false;
  }
  function closeModal(id) {
    document.getElementById('modal-' + id).classList.remove('open');
    document.body.style.overflow = '';
  }
  function closeModalOutside(e, id) {
    if (e.target === document.getElementById('modal-' + id)) closeModal(id);
  }
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeModal('privacy'); closeModal('av');
    }
  });
