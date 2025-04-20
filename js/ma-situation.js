document.addEventListener('DOMContentLoaded', () => {
    // === Sélecteurs principaux ===
    const matrimonialSelect = document.getElementById('matrimonial-select');
    const conjointBox = document.getElementById('conjoint-income-box');

    const residenceSelect = document.getElementById('residence-select');
    const loyerBox = document.getElementById('loyer-box');
    const proprietaireFields = document.getElementById('proprietaire-fields');

    const financementSelect = document.getElementById('type-financement');
    const detailFinancementSection = document.getElementById('detail-financment-fields');

    // === Utilitaire : toggle class "visible" selon condition ===
    const toggleVisible = (el, condition) => {
        el.classList.toggle('visible', condition);
    };

    // === 1. Affichage champ revenu conjoint ===
    matrimonialSelect.addEventListener('change', () => {
        toggleVisible(conjointBox, matrimonialSelect.value === 'marie');
    });

    // === 2. Affichage champs résidence (loyer ou bloc propriétaire) ===
    residenceSelect.addEventListener('change', () => {
        const value = residenceSelect.value;
        toggleVisible(loyerBox, value === 'Locataire');
        toggleVisible(proprietaireFields, value === 'Proprietaire');

        if (value !== 'Proprietaire') {
            financementSelect.value = "";
            detailFinancementSection.classList.remove('visible');
        }
        
    });

    // === 3. Affichage section détail financement ===
    financementSelect.addEventListener('change', () => {
        toggleVisible(detailFinancementSection, financementSelect.value === 'credit');
    });

    // === 4. Initialisation des dates ===
    const dateConfig = {
        dateFormat: "d/m/Y",
        locale: "fr",
        maxDate: "today",
        allowInput: true,
        disableMobile: true
    };
    flatpickr("#date-naissance", dateConfig);
    flatpickr("#date-emprunt", dateConfig);

    // === 5. Appliquer les formats aux inputs ===
    document.querySelectorAll('.taux-input').forEach(formatTauxInput);
    document.querySelectorAll('.euro-input').forEach(formatEuroInput);
});

// === Formatage des taux (%) ===
function formatTauxInput(input) {
    input.addEventListener('input', () => {
        let val = input.value.replace(/[^\d.,]/g, '').replace('.', ',');
        const parts = val.split(',');
        if (parts.length > 2) val = parts[0] + ',' + parts[1];
        if (val.includes(',')) {
            const [int, dec] = val.split(',');
            val = int + ',' + dec.slice(0, 2);
        }
        input.value = val + ' %';
        input.setSelectionRange(input.value.length - 2, input.value.length - 2);
    });

    input.addEventListener('focus', () => {
        input.value = input.value.replace(/[^\d.,]/g, '').replace('.', ',');
    });

    input.addEventListener('blur', () => {
        const val = input.value.replace(/[^\d,]/g, '');
        if (val) input.value = val + ' %';
    });
}

// === Formatage des montants (€) ===
function formatEuroInput(input) {
    input.addEventListener('input', () => {
        const val = input.value.replace(/\D/g, '');
        if (val === '') {
            input.value = '';
            return;
        }
        input.value = parseInt(val, 10).toLocaleString('fr-FR') + ' €';
        input.setSelectionRange(input.value.length - 2, input.value.length - 2);
    });

    input.addEventListener('focus', () => {
        input.value = input.value.replace(/\D/g, '');
    });

    input.addEventListener('blur', () => {
        const val = input.value.replace(/\D/g, '');
        if (val) {
            input.value = parseInt(val, 10).toLocaleString('fr-FR') + ' €';
        }
    });
}

// === Extraction propre des valeurs numériques pour calculs ===
/**
 * Extrait proprement la valeur numérique d’un input formaté (€ ou %).
 * @param {string|HTMLElement} input - ID ou élément <input>.
 * @param {Object} options
 * @param {boolean} [options.percentage=false] - Divise par 100 si c’est un pourcentage.
 * @param {boolean} [options.allowDecimals=true] - Autorise les décimales.
 * @returns {number}
 */
function getNumericValue(input, { percentage = false, allowDecimals = true } = {}) {
    const el = typeof input === 'string' ? document.getElementById(input) : input;
    if (!el) return 0;

    let value = el.value
        .replace(/\s/g, '')
        .replace(/[€%]/g, '')
        .replace(',', '.');

    value = allowDecimals ? parseFloat(value) : parseInt(value, 10);
    if (isNaN(value)) return 0;

    return percentage ? value / 100 : value;
}

let previousMensualite = '';

setInterval(() => {
    const mensualiteInput = document.getElementById('mensualité');
    const amortissementTable = document.querySelector('.amortissement');
    const value = mensualiteInput.value.trim();

    if (value !== previousMensualite) {
        previousMensualite = value;

        const num = getNumericValue(mensualiteInput);
        const shouldShow = num > 0;

        amortissementTable.classList.toggle('visible', shouldShow);
    }
}, 300);

function formatNombre(nombre) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(nombre);
}

function formaterTableauAmortissement() {
    const lignes = document.querySelectorAll('#amortissement-body tr');

    lignes.forEach(ligne => {
        const cellules = ligne.querySelectorAll('td');

        // On commence à 1 pour éviter de toucher à la colonne "Année"
        for (let i = 1; i < cellules.length; i++) {
            const contenu = cellules[i].textContent.replace(/[^\d]/g, '');
            if (!isNaN(contenu) && contenu !== '') {
                cellules[i].textContent = `${formatNombre(contenu)} €`;
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // attendre que le tableau soit rempli
    const observer = new MutationObserver(() => {
        formaterTableauAmortissement();
    });

    const amortissementBody = document.getElementById('amortissement-body');
    if (amortissementBody) {
        observer.observe(amortissementBody, { childList: true });
    }
});


