
const products = [
  { name: "Coca-Cola 12x1L", unit: "Kiste" },
  { name: "Coca-Cola Einzelflasche", unit: "Flasche" },
  { name: "Fanta 12x1L", unit: "Kiste" },
  { name: "Sprite 12x1L", unit: "Kiste" },
  { name: "Bier 50L Fass", unit: "Fass" },
  { name: "Radler 30L Fass", unit: "Fass" },
  { name: "Red Bull Tray (24x)", unit: "Tray" },
  { name: "Red Bull Einzel", unit: "Dose" },
  { name: "0,3L Becher (Kiste)", unit: "Kiste" },
  { name: "0,4L Becher (Kiste)", unit: "Kiste" },
  { name: "0,5L Becher (Kiste)", unit: "Kiste" },
  { name: "0,3L Becher (Einzeln)", unit: "Stück" },
  { name: "0,5L Becher (Einzeln)", unit: "Stück" },
  { name: "Leergut AFG", unit: "Kiste" },
  { name: "Leergut Bier", unit: "Kiste" },
  { name: "Leere Becher", unit: "Stück" }
];

let userData = {};
let dataStore = { anfang: {}, nach: {}, abgabe: {}, ende: {} };
let currentType = "";

function startApp() {
  userData.barleiter = document.getElementById("barleiter").value;
  userData.barname = document.getElementById("barname").value;
  userData.zeitpunkt = document.getElementById("zeitpunkt").value;
  document.getElementById("setup").style.display = "none";
  document.getElementById("menu").style.display = "block";
}

function navigate(type) {
  currentType = type;
  document.getElementById("menu").style.display = "none";
  document.getElementById("entrySection").style.display = "block";
  document.getElementById("entryTitle").innerText = {
    anfang: "📦 Anfangsbestand",
    nach: "➕ Nachlieferung",
    abgabe: "➖ Abgabe",
    ende: "📉 Endbestand"
  }[type];
  renderInputs(type);
}

function renderInputs(type) {
  const container = document.getElementById("productInputs");
  container.innerHTML = "";
  products.forEach(p => {
    const val = dataStore[type][p.name] || 0;
    container.innerHTML += `
      <div>
        ${p.name} (${p.unit}): 
        <input type="number" id="input-${p.name}" value="${val}" />
      </div>`;
  });
}

function saveEntry() {
  products.forEach(p => {
    const val = +document.getElementById("input-" + p.name).value || 0;
    dataStore[currentType][p.name] = val;
  });
  document.getElementById("entrySection").style.display = "none";
  document.getElementById("menu").style.display = "block";
}

function exportCSV() {
  let csv = "Produkt,Einheit,Anfang,Nachlieferung,Abgabe,Endbestand,Verkauf
";
  products.forEach(p => {
    const a = dataStore.anfang[p.name] || 0;
    const n = dataStore.nach[p.name] || 0;
    const g = dataStore.abgabe[p.name] || 0;
    const e = dataStore.ende[p.name] || 0;
    const verkauft = a + n - g - e;
    csv += `${p.name},${p.unit},${a},${n},${g},${e},${verkauft}
`;
  });
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `Inventur_${userData.barname}_${userData.zeitpunkt}.csv`;
  a.click();
}

function mailtoSend() {
  let body = `Inventurbericht%0A%0ABar: ${userData.barname}%0ABarleiter: ${userData.barleiter}%0AZeit: ${userData.zeitpunkt}%0A%0A`;
  products.forEach(p => {
    const a = dataStore.anfang[p.name] || 0;
    const n = dataStore.nach[p.name] || 0;
    const g = dataStore.abgabe[p.name] || 0;
    const e = dataStore.ende[p.name] || 0;
    const verkauft = a + n - g - e;
    body += `${p.name}: Anfang=${a}, Nach=${n}, Abgabe=${g}, Ende=${e}, Verkauf=${verkauft}%0A`;
  });
  const mailto = `mailto:?subject=Inventurbericht ${userData.barname}&body=${body}`;
  window.location.href = mailto;
}
