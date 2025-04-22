document.getElementById('durée-emprunt').addEventListener('change', calculatemensualité);
document.getElementById('montant-emprunt').addEventListener('input', calculatemensualité);
document.getElementById('taux-assurances').addEventListener('input', calculatemensualité);
document.getElementById('taux-emprunt').addEventListener('input', calculatemensualité);
document.getElementById('date-emprunt').addEventListener('input', calculatemensualité);

// Préremplissage automatique de la date si vide
window.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('date-emprunt');
    if (!dateInput.value) {
        const now = new Date();
        const jour = '01';
        const mois = '01';
        const annee = now.getFullYear();
        dateInput.value = `${jour}/${mois}/${annee}`;
    }
});


// A supprimer c'est pour afficher le tableau directement pour les test, flemme de remettre des valeurs tout le temps
window.addEventListener('DOMContentLoaded', () => {
    const Asupprimer1 = document.getElementById('montant-emprunt');
    if (!Asupprimer1.value) {
        Asupprimer1.value = 265660
    }
});

// A supprimer c'est pour afficher le tableau directement pour les test, flemme de remettre des valeurs tout le temps
window.addEventListener('DOMContentLoaded', () => {
    const Asupprimer2 = document.getElementById('durée-emprunt');
    if (!Asupprimer2.value) {
        Asupprimer2.value = 25
    }
});

// A supprimer c'est pour afficher le tableau directement pour les test, flemme de remettre des valeurs tout le temps
window.addEventListener('DOMContentLoaded', () => {
    const Asupprimer3 = document.getElementById('taux-emprunt');
    if (!Asupprimer3.value) {
        Asupprimer3.value = 2.35
    }
});

function calculatemensualité() {
    const duree = parseInt(document.getElementById('durée-emprunt').value) * 12;

    const montantEmprunt = document.getElementById('montant-emprunt').value.replace(/\s+/g, '');
    const capital = parseFloat(montantEmprunt) || 0;

    const tauxEmprunt = document.getElementById('taux-emprunt').value.replace(',', '.');
    const recupassurance = document.getElementById('taux-assurances').value.replace(',', '.');
    const taux = (parseFloat(tauxEmprunt) || 0) / 100 / 12;
    const tauxassurance = (parseFloat(recupassurance) || 0) / 100;

    if (!duree || !capital || !taux) {
        document.getElementById('mensualité').value = '';
        return;
    }

    const assurance = tauxassurance * capital / 12;
    const mensualiteSansAssurance = capital * taux / (1 - Math.pow(1 + taux, -duree));
    const mensualite = mensualiteSansAssurance + assurance;

    document.getElementById('mensualité').value = `${mensualite.toFixed(2)} €`;

    const dateStr = document.getElementById("date-emprunt").value; // format jj/mm/aaaa
    const [jour, mois, annee] = dateStr.split("/").map(Number);
    const dateDebut = new Date(annee, mois - 1, jour);

    let restant = capital;
    let cumulinteret = 0;
    let cumulcapital = 0;
    let cumulassurance = 0;
    let interetPeriode = 0;
    let tableau = '';
    let anneeCounter = 1;

    let moisActuel = dateDebut.getMonth();
    let anneeActuelle = dateDebut.getFullYear();

    const moisNoms = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    const tableauLignesMois = {}; // Pour stocker les lignes mensuelles par année
    tableau = "";

    for (let i = 1; i <= duree; i++) {
        let interet = restant * taux;
        let capitalrembourse = mensualite - assurance - interet;
        restant -= capitalrembourse;
        if (restant < 0) restant = 0;

        cumulinteret += interet;
        interetPeriode += interet;
        cumulcapital += capitalrembourse;
        cumulassurance += assurance;

        const nomMois = moisNoms[moisActuel];
        const classeMois = `mois-annee-${anneeCounter}`;
        const ligneMois = `<tr class="${classeMois}" style="background-color: #f9f9f9; display: none; transition: all 0.3s ease-in-out;">
            <td>${nomMois}</td>
            <td>${mensualite.toFixed(0)} €</td>
            <td>${capitalrembourse.toFixed(0)} €</td>
            <td>${interet.toFixed(0)} €</td>
            <td>${assurance.toFixed(0)} €</td>
            <td>${restant.toFixed(0)} €</td>
        </tr>`;

        if (!tableauLignesMois[anneeCounter]) tableauLignesMois[anneeCounter] = [];
        tableauLignesMois[anneeCounter].push(ligneMois);

        moisActuel++;
        if (moisActuel === 12) {
            moisActuel = 0;
            anneeActuelle++;
        }

        const moisDepuisDebut = i - 1;
        const moisDansPremiereAnnee = 12 - dateDebut.getMonth();
        const estFinPremiereAnnee = moisDepuisDebut === (moisDansPremiereAnnee - 1);
        const estFinAnneeComplete = (moisDepuisDebut > moisDansPremiereAnnee) && ((moisDepuisDebut - moisDansPremiereAnnee + 1) % 12 === 0);
        const estDernierMois = i === duree;

        if (estFinPremiereAnnee || estFinAnneeComplete || estDernierMois) {
            const nbMoisDansAnnee = (estFinPremiereAnnee ? moisDansPremiereAnnee : 12);
            const annuiteTotale = mensualite * nbMoisDansAnnee;

            tableau += `<tr class="ligne-annee" data-target="mois-annee-${anneeCounter}" style="background-color:rgb(245, 243, 240); font-weight: bold; cursor: pointer;">
                <td><span class="arrow">▸</span> ${anneeCounter}</td>
                <td>${annuiteTotale.toFixed(0)} €</td>
                <td>${cumulcapital.toFixed(0)} €</td>
                <td>${interetPeriode.toFixed(0)} €</td>
                <td>${cumulassurance.toFixed(0)} €</td>
                <td>${restant.toFixed(0)} €</td>
            </tr>`;

            tableau += tableauLignesMois[anneeCounter].join('');

            interetPeriode = 0;
            cumulassurance = 0;
            cumulcapital = 0;
            anneeCounter++;
        }
    }

    document.getElementById('amortissement-body').innerHTML = tableau;

    setTimeout(() => {
        document.querySelectorAll('.ligne-annee').forEach(ligne => {
            ligne.addEventListener('click', () => {
                const target = ligne.dataset.target;
                const lignesMois = document.querySelectorAll(`.${target}`);

                const estOuvert = lignesMois[0].style.display !== 'none';

                // Fermer toutes les autres lignes ouvertes
                document.querySelectorAll('[class^="mois-annee-"]').forEach(ligneMois => {
                    ligneMois.style.display = 'none';
                });

                document.querySelectorAll('.ligne-annee .arrow').forEach(arrow => {
                    arrow.textContent = '▸';
                });

                if (!estOuvert) {
                    lignesMois.forEach(mois => {
                        mois.style.display = 'table-row';
                    });
                    const arrow = ligne.querySelector('.arrow');
                    arrow.textContent = '▾';
                }
            });
        });
    }, 0);


    
}


calculatemensualité();