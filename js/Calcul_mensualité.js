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
    let interetPeriode = 0
    let tableau = '';

    let moisActuel = dateDebut.getMonth();
    let anneeActuelle = dateDebut.getFullYear();

    let anneeCounter = 1;

    for (let i = 1; i <= duree; i++) {
        let interet = restant * taux;
        let capitalrembourse = mensualite - assurance - interet;
        restant -= capitalrembourse;
        if (restant < 0) restant = 0;

        cumulinteret += interet;
        interetPeriode += interet;
        cumulcapital += capitalrembourse;
        cumulassurance += assurance;
       

        moisActuel++;
        if (moisActuel === 12) {
            moisActuel = 0;
            anneeActuelle++;
        }

        const moisDepuisDebut = i - 1;
        const moisDansPremiereAnnee = 12 - dateDebut.getMonth();
        const estFinPremiereAnnee = moisDepuisDebut === (moisDansPremiereAnnee - 1);
        const estFinAnneeComplete = (moisDepuisDebut > moisDansPremiereAnnee) && ((moisDepuisDebut - (moisDansPremiereAnnee) + 1) % 12 === 0);
        const estDernierMois = i === duree;

        if (estFinPremiereAnnee || estFinAnneeComplete || estDernierMois) { 

            tableau += `<tr>
                <td>${anneeCounter}</td>
                <td>${interetPeriode.toFixed(0)} €</td>
                <td>${cumulassurance.toFixed(0)} €</td>
                <td>${cumulcapital.toFixed(0)} €</td>
                <td>${restant.toFixed(0)} €</td>
            </tr>`;

            interetPeriode = 0
            cumulassurance = 0;
            anneeCounter++;
        }
    }

    document.getElementById('amortissement-body').innerHTML = tableau;
}

calculatemensualité();
