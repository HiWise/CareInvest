document.getElementById('durée-emprunt').addEventListener('change', calculatemensualité);
document.getElementById('montant-emprunt').addEventListener('input', calculatemensualité);
document.getElementById('taux-assurances').addEventListener('input', calculatemensualité);
document.getElementById('taux-emprunt').addEventListener('input', calculatemensualité);

function calculatemensualité() {
  const n = parseInt(document.getElementById('durée-emprunt').value) * 12;

  // Nettoyer le montant (enlever les espaces)
  const montantEmprunt = document.getElementById('montant-emprunt').value.replace(/\s+/g, '');
  const M = parseFloat(montantEmprunt) || 0;

  // Remplacer les virgules par des points dans les taux
  const tauxEmprunt = document.getElementById('taux-emprunt').value.replace(',', '.');
  const tauxAssurance = document.getElementById('taux-assurances').value.replace(',', '.');

  const t = (parseFloat(tauxEmprunt) || 0) / 100 / 12;
  const a = (parseFloat(tauxAssurance) || 0) / 100;

  if (!n || !M || !t) {
      document.getElementById('mensualité').innerText = '';
      return;
  }

  const assurance = a * M / 12;
  const mensualité = Math.round((M * t / (1 - Math.pow(1 + t, -n)) + assurance) * 100) / 100;

  document.getElementById('mensualité').value = `${mensualité.toFixed(2)} €`;
}
