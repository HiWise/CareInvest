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

document.addEventListener('DOMContentLoaded', () => {
  const matrimonialSelect = document.getElementById('matrimonial-select');
  const conjointBox = document.getElementById('conjoint-income-box');

  const residenceSelect = document.getElementById('residence-select');
  const loyerBox = document.getElementById('loyer-box');
  const proprietaireFields = document.getElementById('proprietaire-fields'); // les 3 champs à afficher si "Propriétaire"

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
});



  
  
handleMobileMenu();
animateMainContent();


