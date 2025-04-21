document.addEventListener('DOMContentLoaded', () => {
    // === Sélecteurs principaux ===
    const matrimonialSelect = document.getElementById('matrimonial-select');
    const conjointBox = document.getElementById('conjoint-income-box');

    const residenceSelect = document.getElementById('residence-select');
    const loyerBox = document.getElementById('loyer-box');
    const proprietaireFields = document.getElementById('proprietaire-fields');

    const financementSelect = document.getElementById('type-financement');
    const detailFinancementSection = document.getElementById('detail-financment-fields');

    const mensualiteInput = document.getElementById('mensualité');
    const amortissementSection = document.getElementById('amortissement-section');
    const amortissementContent = amortissementSection.querySelector('.situation__form__content');
    const amortissementArrow = amortissementSection.querySelector('.arrow-down');
    const amortissementTable = amortissementSection.querySelector('.amortissement');
    const header = amortissementSection.querySelector('.situation__form__up');

    // === Utilitaire : toggle class "visible" selon condition ===
    const toggleVisible = (el, condition) => {
        el.classList.toggle('visible', condition);
    };

    // === 1. Affichage champ revenu conjoint ===
    matrimonialSelect.addEventListener('change', () => {
        toggleVisible(conjointBox, matrimonialSelect.value === 'marie');
    });

    // === 2. Affichage champs résidence ===
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

    // === 6. Toggle affichage section amortissement via flèche ===
    document.getElementById('amortissement-toggle').addEventListener('click', () => {
        amortissementContent.classList.toggle('collapsed');
        amortissementArrow.classList.toggle('rotated');
    });

    // === 7. Observer remplissage tableau amortissement ===
    const observer = new MutationObserver(() => {
        formaterTableauAmortissement();
    });

    const amortissementBody = document.getElementById('amortissement-body');
    if (amortissementBody) {
        observer.observe(amortissementBody, { childList: true });
    }

    // === 8. Affichage automatique du tableau si mensualité > 0 ===
    let previousMensualite = '';

    setInterval(() => {
        const value = mensualiteInput.value.trim();
        const num = getNumericValue(mensualiteInput);

        if (value !== previousMensualite) {
            previousMensualite = value;

            const isProprietaire = residenceSelect.value === 'Proprietaire';
            const isCredit = financementSelect.value === 'credit';
            const shouldShow = num > 0 && isProprietaire && isCredit;
            

            amortissementSection.classList.toggle('visible', shouldShow);
            amortissementTable.classList.remove('visible'); // reste replié par défaut
            amortissementArrow.classList.toggle('rotated', !shouldShow);

        }

    }, 300);

    // === 9. Toggle repli / dépli du tableau ===
    header.addEventListener('click', () => {
        if (!amortissementSection.classList.contains('visible')) return;
        amortissementTable.classList.toggle('visible');
        amortissementArrow.classList.toggle('rotated');
    });

    // Appel initial
    toggleAmortissementVisibility();
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

// === Extraction propre des valeurs numériques ===
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

// === Formattage des cellules du tableau d’amortissement ===
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
        for (let i = 1; i < cellules.length; i++) {
            const contenu = cellules[i].textContent.replace(/[^\d]/g, '');
            if (!isNaN(contenu) && contenu !== '') {
                cellules[i].textContent = `${formatNombre(contenu)} €`;
            }
        }
    });
}

const toggleAmortissementVisibility = () => {
    const num = getNumericValue(mensualiteInput);
    const isProprietaire = residenceSelect.value === 'Proprietaire';
    const isCredit = financementSelect.value === 'credit';

    const shouldShow = num > 0 && isProprietaire && isCredit;

    amortissementSection.classList.toggle('visible', shouldShow);
};

// Partie qui permet de faire disparaitre le tableau si changement section parent
document.addEventListener('DOMContentLoaded', () => {
    // === Sélecteurs principaux ===
    const residenceSelect = document.getElementById('residence-select');
    const financementSelect = document.getElementById('type-financement');
    const mensualiteInput = document.getElementById('mensualité');
    const amortissementSection = document.getElementById('amortissement-section');
    
    // === 1. Affichage du tableau d'amortissement selon les conditions ===
    const toggleAmortissementVisibility = () => {
        const mensualiteValue = parseFloat(mensualiteInput.value.replace(' €', '').replace(' ', '').replace(',', '.'));
        const isProprietaire = residenceSelect.value === 'Proprietaire';
        const isCredit = financementSelect.value === 'credit';

        // Vérifier les 3 conditions
        const shouldShow = mensualiteValue > 0 && isProprietaire && isCredit;

        amortissementSection.classList.toggle('visible', shouldShow);
    };

    // === 2. Mise à jour de la visibilité du tableau d'amortissement lorsqu'une valeur change ===
    residenceSelect.addEventListener('change', () => {
        toggleAmortissementVisibility();
    });

    financementSelect.addEventListener('change', () => {
        toggleAmortissementVisibility();
    });

    mensualiteInput.addEventListener('input', () => {
        toggleAmortissementVisibility();
    });

    // === 3. Initialisation de la visibilité du tableau au chargement de la page ===
    toggleAmortissementVisibility();
});

document.querySelectorAll('input, select, textarea').forEach((field, index, fields) => {
    field.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // évite de soumettre le formulaire ou autre effet par défaut
            const nextField = fields[index + 1];
            if (nextField) nextField.focus();
        }
    });
});