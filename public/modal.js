document.addEventListener('DOMContentLoaded', function() {
  var modal = document.getElementById('myModal');
  var closeModal = document.getElementById('closeModal');
  var howToUse = document.getElementById('howToUse');

  howToUse.onclick = function() {
    modal.style.display = 'block';
  }

  closeModal.onclick = function() {
    modal.style.display = 'none';
  }

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  }
});
