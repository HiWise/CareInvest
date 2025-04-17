document.getElementById('durée-emprunt').addEventListener('change', calculatemensualité);
document.getElementById('montant-emprunt').addEventListener('input', calculatemensualité);
document.getElementById('taux-assurances').addEventListener('input', calculatemensualité);
document.getElementById('taux-emprunt').addEventListener('input', calculatemensualité);

function calculatemensualité() {
    const n = parseInt(document.getElementById('durée-emprunt').value) * 12;
    const M = parseFloat(document.getElementById('montant-emprunt').value) || 0;
    const t = (parseFloat(document.getElementById('taux-emprunt').value) || 0) / 100 / 12;
    const a = (parseFloat(document.getElementById('taux-assurances').value) || 0) / 100;

    const assurance = a * M / 12;
    const mensualité = Math.round((M * t / (1 - Math.pow(1 + t, -n)) + assurance) * 100) / 100;

    document.getElementById('mensualité').value = `${mensualité.toFixed(2)} €`;

}
