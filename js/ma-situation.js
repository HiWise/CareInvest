
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
  


