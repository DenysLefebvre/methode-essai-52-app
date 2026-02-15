const DATA_URL = "../data/bb-degradations.json"; // web/ -> data/

let dataset = null;

function el(id) { return document.getElementById(id); }

function showStep(html) {
  el("step").innerHTML = html;
  el("result").style.display = "none";
}

function showResult(d) {
  el("result").style.display = "block";
  el("result").innerHTML = `
    <h2>${d.name} <span class="pill">ME52 ${d.code_me52}</span></h2>
    <p><span class="pill">Urgence: ${d.urgence}</span>
       <span class="pill">Danger immédiat: ${d.danger_immediate ? "oui" : "non"}</span>
       <span class="pill">Type: ${d.type_principal}</span>
    </p>
    <div class="card">
      <b>Description</b>
      <p>${d.description_courte}</p>
      <b>Action immédiate</b>
      <p>${d.action_immediate}</p>
      <b>Remédiation durable</b>
      <p>${d.remediation_durable}</p>
      <b>Cause(s) probable(s)</b>
      <ul>${d.causes_probables.map(x => `<li>${x}</li>`).join("")}</ul>
      <b>Risque si non traité</b>
      <p>${d.risque_si_non_traite}</p>
    </div>
    <button class="primary" onclick="start()">Recommencer</button>
  `;
}

function findById(id) {
  return dataset.degradations.find(d => d.id === id);
}

// Arbre terrain (version B) -> mapping vers fiches
function start() {
  showStep(`
    <h2>Étape 1 – Danger immédiat ?</h2>
    <button class="primary" onclick="goDanger(true)">Oui (trou/cavité)</button>
    <button onclick="goDanger(false)">Non</button>
  `);
}

function goDanger(yes) {
  if (yes) return showResult(findById(56)); // Nid de poule
  showStep(`
    <h2>Étape 2 – Perte de matière ?</h2>
    <button class="primary" onclick="goLoss(true)">Oui</button>
    <button onclick="goLoss(false)">Non</button>
  `);
}

function goLoss(yes) {
  if (!yes) {
    return showStep(`
      <h2>Étape 3 – Déformation visible (bandes de roulement) ?</h2>
      <button class="primary" onclick="goDeformation(true)">Oui</button>
      <button onclick="goDeformation(false)">Non</button>
    `);
  }
  showStep(`
    <h2>Étape 2b – Granulats se détachent massivement ?</h2>
    <button class="primary" onclick="showResult(findById(54))">Oui (désenrobage)</button>
    <button onclick="showResult(findById(55))">Non (pelade)</button>
  `);
}

function goDeformation(yes) {
  if (yes) return showResult(findById(52)); // Ornière
  showStep(`
    <h2>Étape 4 – Fissures ?</h2>
    <button class="primary" onclick="showResult(findById(57))">Réseau maillé serré (faïençage)</button>
    <button onclick="showResult(findById(53))">Au droit d’un joint (fissure de joint)</button>
    <button onclick="showResult(findById(58))">Rayonnantes localisées (étoile)</button>
    <button onclick="showResult(findById(51))">Surface lisse/brillante (glaçage)</button>
  `);
}

async function boot() {
  const res = await fetch(DATA_URL, { cache: "no-store" });
  dataset = await res.json();
  start();
}

boot().catch(err => {
  showStep(`<h2>Erreur</h2><pre>${String(err)}</pre>`);
});
