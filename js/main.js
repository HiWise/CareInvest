const handleMobileMenu = () => {
    const navMobileMenu = document.getElementById('navMobileMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuClose = document.getElementById('mobileMenuClose');

    const openMenu = () => {
        mobileMenu.classList.add('mobile-menu--open')
    }

    const closeMenu = () => {
        mobileMenu.classList.remove('mobile-menu--open')
    }

    navMobileMenu.addEventListener('click', openMenu)
    mobileMenuClose.addEventListener('click', closeMenu)
}

const animateMainContent = () => {
    const elementsToAnimate = [
        { selector: ".main__hero-title", transform : false},
        { selector: ".main__hero-description", transform : false},
        { selector: ".main__hero-description-mobile", transform : false},
        { selector: ".main__abstract", transform : false},
        { selector: ".main__hero_subtitles", transform : false},
        { selector: ".main__hero_subtitle-bigscreen", transform : false},
        ...Array.from(document.querySelectorAll(".main__feature")).map((feature) => ({
            element: feature,
            transform: true
        }))
    ]

    const animateElement = (element, delay = 0, transform = false) => {
        setTimeout(() => {
            element.style.opacity = 1;
            if(transform) {
                element.style.transform = "translateY(0)"
            }
        },delay); 
    }

    elementsToAnimate.forEach((item,index) => {
        const element = item.element || document.querySelector(item.selector);

        if(element){
            animateElement(element, index*150, item.transform)
        }
    })
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      }
    });
  }, {
    threshold: 0.9
  });
  
document.querySelectorAll('.autoShow').forEach(el => observer.observe(el));

document.addEventListener('DOMContentLoaded', () => {
    const toggles = document.querySelectorAll('.situation__form__up');
  
    toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
    const section = toggle.closest('.situation__form__section');
    const content = section.querySelector('.situation__form__content');
    const arrow = toggle.querySelector('.arrow-down');

    content.classList.toggle('collapsed');
    arrow.classList.toggle('rotated');
    });
});
});


handleMobileMenu();
animateMainContent();



document.addEventListener('DOMContentLoaded', () => {
    const matrimonialSelect = document.getElementById('matrimonial-select');
    const conjointBox = document.getElementById('conjoint-income-box');
  
    const residenceSelect = document.getElementById('residence-select');
    const loyerBox = document.getElementById('loyer-box');
    const proprietaireFields = document.getElementById('proprietaire-fields'); // les 3 champs à afficher si "Propriétaire"
  
    const financementSelect = document.getElementById('type-financement');
    const detailFinancementSection = document.getElementById('detail-financment-fields');
  
    // Affichage champ revenu conjoint(e)
    matrimonialSelect.addEventListener('change', () => {
      if (matrimonialSelect.value === 'marie') {
        conjointBox.classList.add('visible');
      } else {
        conjointBox.classList.remove('visible');
      }
    });
  
    // Affichage champs résidence (loyer ou bloc propriétaire)
    residenceSelect.addEventListener('change', () => {
      const selectedValue = residenceSelect.value;
  
      // Affiche le champ "Loyer" si locataire
      if (selectedValue === 'Locataire') {
        loyerBox.classList.add('visible');
      } else {
        loyerBox.classList.remove('visible');
      }
  
      // Affiche les champs si propriétaire
      if (selectedValue === 'Proprietaire') {
        proprietaireFields.classList.add('visible');
      } else {
        proprietaireFields.classList.remove('visible');
      }
    });
  
    // Affichage section "Détail financement crédit" si "Crédit en cours"
    financementSelect.addEventListener('change', () => {
      if (financementSelect.value === 'credit') {
        detailFinancementSection.classList.add('visible');
      } else {
        detailFinancementSection.classList.remove('visible');
      }
    });
});



// Attendre que la page soit bien chargée
document.addEventListener("DOMContentLoaded", function () {
    // Initialisation pour la date de naissance
    flatpickr("#date-naissance", {
      dateFormat: "d/m/Y", // Format jour/mois/année
      locale: "fr",        // Langue française
      maxDate: "today",    // On ne peut pas choisir une date future
    });
  
    // Initialisation pour la date d'emprunt
    flatpickr("#date-emprunt", {
      dateFormat: "d/m/Y",
      locale: "fr",
      maxDate: "today", // ou tu peux mettre une autre règle selon le besoin
    });
});


// Formatage de l'affichage du clavier numérique //
function formatTauxChamp(input) {
    input.addEventListener('input', () => {
      let val = input.value.replace(/[^\d,]/g, '');
  
      // remplace plusieurs virgules par une seule
      const parts = val.split(',');
      if (parts.length > 2) {
        val = parts[0] + ',' + parts[1];
      }
  
      // max 2 décimales
      if (val.includes(',')) {
        const [int, dec] = val.split(',');
        val = int + ',' + dec.slice(0, 2);
      }
  
      input.value = val;
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const tauxEmprunt = document.getElementById('taux-emprunt');
    const tauxAssurances = document.getElementById('taux-assurances');
  
    if (tauxEmprunt) formatTauxChamp(tauxEmprunt);
    if (tauxAssurances) formatTauxChamp(tauxAssurances);
});
  






