document.addEventListener('DOMContentLoaded', function () {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const header = document.querySelector('header');

    // Ajoutez un gestionnaire d'événement click au bouton mobile-toggle
    mobileToggle.addEventListener('click', function () {
        // Basculez la classe .show sur l'en-tête
        header.classList.toggle('show');
        console.log('ee')
    });
});
