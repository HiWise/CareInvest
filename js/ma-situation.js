
document.addEventListener('DOMContentLoaded', () => {
    const matrimonialSelect = document.getElementById('matrimonial-select');
    const conjointBox = document.getElementById('conjoint-income-box');
    
    const residenceSelect = document.getElementById('residence-select');
    const loyerBox = document.getElementById('loyer-box');
    const proprietaireFields = document.getElementById('proprietaire-fields');
    
    const financementSelect = document.getElementById('type-financement');
    const detailFinancementSection = document.getElementById('detail-financment-fields');
    
    // 🔁 1. Affichage champ revenu conjoint(e)
    matrimonialSelect.addEventListener('change', () => {
      if (matrimonialSelect.value === 'marie') {
        conjointBox.classList.add('visible');
      } else {
        conjointBox.classList.remove('visible');
      }
    });
    
    // 🏡 2. Affichage champs résidence (loyer ou bloc propriétaire)
    residenceSelect.addEventListener('change', () => {
      const selectedValue = residenceSelect.value;
    
      if (selectedValue === 'Locataire') {
        loyerBox.classList.add('visible');
      } else {
        loyerBox.classList.remove('visible');
      }
    
      if (selectedValue === 'Proprietaire') {
        proprietaireFields.classList.add('visible');
      } else {
        proprietaireFields.classList.remove('visible');
    
        // Réinitialise le champ financement
        financementSelect.value = "";
    
        // Cache les détails financement
        detailFinancementSection.classList.remove('visible');
      }
    });
    
    // 💸 3. Affichage section "Détail financement crédit"
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

flatpickr("#date-naissance", {
    dateFormat: "d/m/Y",
    locale: "fr",
    allowInput: true,
    disableMobile: true // <== Forcer le style même sur iOS / Android
});
  
  flatpickr("#date-emprunt", {
    dateFormat: "d/m/Y",
    locale: "fr",
    allowInput: true,
    disableMobile: true
});
  


// Formatage de l'affichage des Taux //
function formatTauxInput(input) {
    input.addEventListener('input', () => {
        let val = input.value
            .replace(/[^\d.,]/g, '') // autorise chiffres, virgule et point
            .replace('.', ',');      // remplace le point par une virgule

        // Empêche plusieurs virgules
        const parts = val.split(',');
        if (parts.length > 2) {
            val = parts[0] + ',' + parts[1];
        }

        // Max deux décimales
        if (val.includes(',')) {
            const [int, dec] = val.split(',');
            val = int + ',' + dec.slice(0, 2);
        }

        input.value = val + ' %';

        // Replace le curseur juste avant le %
        const pos = input.value.length - 2;
        input.setSelectionRange(pos, pos);
    });

    input.addEventListener('focus', () => {
        // Enlève tout sauf chiffres et virgule
        input.value = input.value
            .replace(/[^\d.,]/g, '')
            .replace('.', ','); // standardise la virgule
    });

    input.addEventListener('blur', () => {
        let val = input.value
            .replace(/[^\d,]/g, '');

        if (val) {
            input.value = val + ' %';
        }
    });
}

// Appliquer à tous les champs de taux
document.querySelectorAll('.taux-input').forEach((input) => {
    formatTauxInput(input);
});



// Formatafe de l'affichage des Euros
function formatEuroInput(input) {
    input.addEventListener('input', () => {
        const val = input.value.replace(/\D/g, '');

        if (val === '') {
            input.value = '';
            return;
        }

        const formatted = parseInt(val, 10).toLocaleString('fr-FR') + ' €';
        input.value = formatted;

        // Place le curseur avant l'espace et €
        input.setSelectionRange(input.value.length - 2, input.value.length - 2);
    });

    input.addEventListener('focus', () => {
        const raw = input.value.replace(/\D/g, '');
        input.value = raw;
    });

    input.addEventListener('blur', () => {
        const raw = input.value.replace(/\D/g, '');
        if (raw !== '') {
            input.value = parseInt(raw, 10).toLocaleString('fr-FR') + ' €';
        }
    });
}

// Appliquer à tous les champs avec la classe euro-input
document.querySelectorAll('.euro-input').forEach((input) => {
    formatEuroInput(input);
});


  