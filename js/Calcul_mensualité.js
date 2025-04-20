document.getElementById('durée-emprunt').addEventListener('change', calculatemensualité);
document.getElementById('montant-emprunt').addEventListener('input', calculatemensualité);
document.getElementById('taux-assurances').addEventListener('input', calculatemensualité);
document.getElementById('taux-emprunt').addEventListener('input', calculatemensualité);

function calculatemensualité() {
    const duree = parseInt(document.getElementById('durée-emprunt').value) * 12;
    
    // Nettoyer le montant (enlever les espaces)
    const montantEmprunt = document.getElementById('montant-emprunt').value.replace(/\s+/g, '');
    const capital = parseFloat(montantEmprunt) || 0;


      // Remplacer les virgules par des points dans les taux
    const tauxEmprunt = document.getElementById('taux-emprunt').value.replace(',', '.');
    const recupassurance = document.getElementById('taux-assurances').value.replace(',', '.');
    const taux = (parseFloat(tauxEmprunt) || 0) / 100 / 12;
    const tauxassurance = (parseFloat(recupassurance) || 0) / 100;


    if (!duree || !capital || !taux) {
        document.getElementById('mensualité').value = '';
        return;
    }

    const assurance = tauxassurance * capital / 12;
    const mensualite = Math.round((capital * taux / (1 - Math.pow(1 + taux, -duree)) + assurance) * 100) / 100;

    document.getElementById('mensualité').value = `${mensualite.toFixed(2)} €`;

    // Calcul du tableau d’amortissement
    let restant = capital;
    let cumulinteret = 0
    let cumulcapital = 0
    let tableau = '';

    for (let i = 1; i <= duree; i++) {
        let interet = restant * taux;
        let capitalrembourse = mensualite - assurance - interet;
        restant -= capitalrembourse;
        if (restant < 0) restant = 0; // éviter les valeurs négatives

        cumulinteret += interet
        cumulcapital += capitalrembourse
    
        if (i % 12 === 0 || i === duree) { // Affiche seulement les mois multiples de 12, ou le dernier mois
            tableau += `<tr>
                <td>${i/12}</td>
                <td>${cumulinteret.toFixed(0)} €</td>
                <td>${(assurance.toFixed(0))*12} €</td>
                <td>${(cumulcapital.toFixed(0))} €</td>
                <td>${restant.toFixed(0)} €</td>
            </tr>`;
        }
    }  

    document.getElementById('amortissement-body').innerHTML = tableau;
}

calculatemensualité();