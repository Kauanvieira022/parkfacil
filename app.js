const vehicles = [
  { ticket: "#1042", region: "BRASIL", plate: "ABC1D23", make: "Toyota", model: "Corolla", type: "Sedan", color: "Prata", sector: "A", box: "A-04", entry: "13:10", stay: "1h 22m", amount: 10 },
  { ticket: "#1041", region: "BRASIL", plate: "BRA2E19", make: "VW", model: "Gol 1.6", type: "Hatch", color: "Branco", sector: "B", box: "B-12", entry: "13:45", stay: "0h 47m", amount: 5 },
  { ticket: "#1040", region: "SP - CAPITAL", plate: "KXZ-9821", make: "Honda", model: "Civic", type: "Sedan", color: "Preto", sector: "A", box: "A-08", entry: "12:30", stay: "2h 02m", amount: 15 },
  { ticket: "#1039", region: "BRASIL", plate: "RIO2A00", make: "Jeep", model: "Compass", type: "SUV", color: "Cinza Grafite", sector: "B", box: "B-02", entry: "11:15", stay: "3h 17m", amount: 20 },
  { ticket: "#1038", region: "MG - BH", plate: "OPO-4582", make: "Fiat", model: "Strada Hard", type: "Picape", color: "Vermelho", sector: "A", box: "A-15", entry: "14:02", stay: "0h 30m", amount: 5 },
  { ticket: "#1037", region: "BRASIL", plate: "FRT4A71", make: "Fiat", model: "Argo", type: "Hatch", color: "Prata", sector: "B", box: "B-09", entry: "12:55", stay: "1h 37m", amount: 10 },
  { ticket: "#1036", region: "SP - CAPITAL", plate: "GHT8C10", make: "Chevrolet", model: "Onix", type: "Hatch", color: "Branco", sector: "A", box: "A-02", entry: "12:48", stay: "1h 44m", amount: 10 },
  { ticket: "#1035", region: "BRASIL", plate: "MNO5D62", make: "Hyundai", model: "HB20", type: "Hatch", color: "Azul", sector: "B", box: "B-05", entry: "12:20", stay: "2h 12m", amount: 15 },
  { ticket: "#1034", region: "MG - BH", plate: "QWE1G30", make: "Renault", model: "Kwid", type: "Hatch", color: "Branco", sector: "A", box: "A-19", entry: "13:36", stay: "0h 56m", amount: 5 },
  { ticket: "#1033", region: "BRASIL", plate: "JKL7F21", make: "Toyota", model: "Etios", type: "Sedan", color: "Cinza", sector: "B", box: "B-14", entry: "12:06", stay: "2h 26m", amount: 15 },
  { ticket: "#1032", region: "SP - CAPITAL", plate: "ABC9H81", make: "Honda", model: "Fit", type: "Hatch", color: "Preto", sector: "A", box: "A-11", entry: "11:58", stay: "2h 34m", amount: 15 },
  { ticket: "#1031", region: "BRASIL", plate: "DEF3J04", make: "Nissan", model: "Kicks", type: "SUV", color: "Prata", sector: "B", box: "B-20", entry: "11:43", stay: "2h 49m", amount: 15 },
  { ticket: "#1030", region: "MG - BH", plate: "GHI6K12", make: "Volkswagen", model: "Polo", type: "Hatch", color: "Vermelho", sector: "A", box: "A-06", entry: "11:22", stay: "3h 10m", amount: 20 },
  { ticket: "#1029", region: "BRASIL", plate: "LMN2M77", make: "Chevrolet", model: "Tracker", type: "SUV", color: "Preto", sector: "B", box: "B-07", entry: "10:55", stay: "3h 37m", amount: 20 },
  { ticket: "#1028", region: "SP - CAPITAL", plate: "OPQ5N39", make: "Fiat", model: "Pulse", type: "SUV", color: "Azul", sector: "A", box: "A-23", entry: "10:34", stay: "3h 58m", amount: 20 },
  { ticket: "#1027", region: "BRASIL", plate: "RST8P54", make: "Jeep", model: "Renegade", type: "SUV", color: "Branco", sector: "B", box: "B-17", entry: "10:19", stay: "4h 13m", amount: 25 },
  { ticket: "#1026", region: "MG - BH", plate: "UVW1Q66", make: "Toyota", model: "Yaris", type: "Sedan", color: "Cinza", sector: "A", box: "A-13", entry: "09:58", stay: "4h 34m", amount: 25 },
  { ticket: "#1025", region: "BRASIL", plate: "XYZ4R88", make: "Hyundai", model: "Creta", type: "SUV", color: "Prata", sector: "B", box: "B-23", entry: "09:41", stay: "4h 51m", amount: 25 },
];

const pageSize = 5;
let page = 1;
let selectedSector = "todos";
let toastTimer;

const rowHost = document.querySelector("#vehicle-rows");
const searchInput = document.querySelector("#vehicle-search");
const emptyState = document.querySelector("#empty-state");
const resultCount = document.querySelector("#result-count");
const pageLabel = document.querySelector("#page-label");
const previousPage = document.querySelector("#previous-page");
const nextPage = document.querySelector("#next-page");

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}

function formatMoney(value) {
  return `R$ ${Number(value).toFixed(2).replace(".", ",")}`;
}

function filteredVehicles() {
  const query = searchInput.value.trim().toLocaleLowerCase("pt-BR");
  return vehicles.filter((vehicle) => {
    const inSector = selectedSector === "todos" || vehicle.sector === selectedSector;
    const searchable = [vehicle.ticket, vehicle.plate, vehicle.make, vehicle.model, vehicle.box].join(" ").toLocaleLowerCase("pt-BR");
    return inSector && (!query || searchable.includes(query));
  });
}

function renderVehicles() {
  const items = filteredVehicles();
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  page = Math.min(page, pageCount);
  const visible = items.slice((page - 1) * pageSize, page * pageSize);
  rowHost.innerHTML = visible.map((vehicle) => `
    <tr>
      <td class="ticket">${escapeHtml(vehicle.ticket)}</td>
      <td><span class="plate"><span class="plate-region">${escapeHtml(vehicle.region)}</span><span class="plate-code">${escapeHtml(vehicle.plate)}</span></span></td>
      <td><span class="vehicle-name"><strong>${escapeHtml(vehicle.make)}<br />${escapeHtml(vehicle.model)}</strong><small>${escapeHtml(vehicle.type)} · ${escapeHtml(vehicle.color)}</small></span></td>
      <td><span class="box-tag">${escapeHtml(vehicle.box)}</span></td>
      <td>${escapeHtml(vehicle.entry)}</td>
      <td>${escapeHtml(vehicle.stay)}</td>
      <td class="amount">${formatMoney(vehicle.amount)}</td>
      <td><span class="parked-pill"><i></i>Estacionado</span></td>
      <td><button class="row-action" type="button" data-action="exit" data-ticket="${escapeHtml(vehicle.ticket)}"><img class="icon" src="./figma-assets/01dd1.svg" alt="" />Saída</button></td>
    </tr>`).join("");
  emptyState.hidden = visible.length !== 0;
  rowHost.closest("table").hidden = visible.length === 0;
  const end = Math.min(page * pageSize, items.length);
  resultCount.textContent = `Exibindo ${end} de ${items.length} veículos em permanência`;
  pageLabel.textContent = `Pág ${page} de ${pageCount}`;
  previousPage.disabled = page <= 1;
  nextPage.disabled = page >= pageCount;
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function setActiveNav(label) {
  document.querySelectorAll(".nav-link").forEach((item) => item.classList.toggle("is-active", item.dataset.nav === label));
}

function openDialog(title, body) {
  document.querySelector("#dialog-title").textContent = title;
  document.querySelector("#dialog-content").innerHTML = body;
  const backdrop = document.querySelector("#modal-backdrop");
  backdrop.hidden = false;
  backdrop.querySelector(".dialog").focus?.();
}

function closeDialog() {
  document.querySelector("#modal-backdrop").hidden = true;
}

function openEntryDialog() {
  openDialog("Registrar entrada", `
    <form class="dialog-form" id="entry-form">
      <label>Placa do veículo<input name="plate" required maxlength="8" placeholder="ABC1D23" autocomplete="off" /></label>
      <label>Marca e modelo<input name="model" required placeholder="Ex.: Toyota Corolla" /></label>
      <label>Setor e vaga<select name="sector"><option value="A">Setor A · Térreo</option><option value="B">Setor B · Piso Superior</option></select></label>
      <div class="dialog-actions"><button class="button button-soft" type="button" data-action="close">Cancelar</button><button class="button button-primary" type="submit">Confirmar entrada</button></div>
    </form>`);
  document.querySelector("#entry-form input[name=plate]").focus();
}

function openExitDialog(ticket = "") {
  const options = vehicles.map((vehicle) => `<option value="${escapeHtml(vehicle.ticket)}" ${vehicle.ticket === ticket ? "selected" : ""}>${escapeHtml(vehicle.ticket)} · ${escapeHtml(vehicle.plate)} · ${escapeHtml(vehicle.box)}</option>`).join("");
  openDialog("Registrar saída", `
    <form class="dialog-form" id="exit-form">
      <label>Veículo<select name="ticket">${options}</select></label>
      <p class="dialog-copy">A tarifa é calculada por hora iniciada após a primeira hora de permanência.</p>
      <div class="dialog-actions"><button class="button button-soft" type="button" data-action="close">Cancelar</button><button class="button button-primary" type="submit">Confirmar saída</button></div>
    </form>`);
}

function openMapDialog() {
  const sector = (label, occupied) => `<div class="map-sector"><strong>${label}</strong><div class="map-spaces">${Array.from({ length: 25 }, (_, index) => `<i class="${index < occupied ? "occupied" : ""}" title="Vaga ${index + 1}"></i>`).join("")}</div></div>`;
  openDialog("Mapa de vagas", `<div class="map-summary">${sector("Setor A · Térreo · 9 ocupadas", 9)}${sector("Setor B · Piso Superior · 9 ocupadas", 9)}</div>`);
}

function handleAction(action, trigger) {
  if (action === "entry") openEntryDialog();
  if (action === "exit") openExitDialog(trigger?.dataset.ticket || "");
  if (action === "map") openMapDialog();
  if (action === "close") closeDialog();
  if (action === "support") openDialog("Suporte operacional", `<p class="dialog-copy">Sistema online. As cancelas 01 e 02 estão comunicando normalmente.</p>`);
  if (action === "account") showToast("Turno A · Carlos · Online");
  if (action === "site") showToast("Estacionamento Central · Pátio Principal");
  if (action === "cash") openDialog("Conferência de sangria e caixa", `<p class="dialog-copy">Turno A aberto.<br />Total arrecadado: <strong>R$ 30,00</strong><br />Saídas finalizadas: 7<br />Previsão do pátio: <strong>R$ 125,00</strong></p>`);
  if (action === "print") window.print();
  if (action === "refresh") {
    renderVehicles();
    showToast("Lista de veículos atualizada");
  }
  if (action === "export") exportReport();
}

function exportReport() {
  const header = ["Ticket", "Placa", "Veículo", "Setor/Box", "Entrada", "Permanência", "Parcial"];
  const lines = filteredVehicles().map((vehicle) => [vehicle.ticket, vehicle.plate, `${vehicle.make} ${vehicle.model}`, vehicle.box, vehicle.entry, vehicle.stay, formatMoney(vehicle.amount)]);
  const csv = [header, ...lines].map((line) => line.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(";")).join("\r\n");
  const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "park-facil-relatorio.csv";
  link.click();
  URL.revokeObjectURL(url);
  showToast("Relatório exportado");
}

document.addEventListener("click", (event) => {
  const actionTarget = event.target.closest("[data-action]");
  if (actionTarget) handleAction(actionTarget.dataset.action, actionTarget);

  const navTarget = event.target.closest("[data-nav]");
  if (navTarget) {
    setActiveNav(navTarget.dataset.nav);
    if (navTarget.dataset.target) document.getElementById(navTarget.dataset.target)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const filterTarget = event.target.closest("[data-filter]");
  if (filterTarget) {
    selectedSector = filterTarget.dataset.filter;
    page = 1;
    document.querySelectorAll(".filter-tab").forEach((tab) => tab.classList.toggle("is-selected", tab === filterTarget));
    renderVehicles();
  }

  if (event.target.id === "modal-backdrop") closeDialog();
});

searchInput.addEventListener("input", () => { page = 1; renderVehicles(); });
previousPage.addEventListener("click", () => { page -= 1; renderVehicles(); });
nextPage.addEventListener("click", () => { page += 1; renderVehicles(); });

document.addEventListener("submit", (event) => {
  if (event.target.id === "entry-form") {
    event.preventDefault();
    const form = new FormData(event.target);
    const [make = "Veículo", ...modelParts] = form.get("model").trim().split(/\s+/);
    const sector = form.get("sector");
    const ticketNum = Math.max(...vehicles.map((vehicle) => Number(vehicle.ticket.slice(1)))) + 1;
    vehicles.unshift({ ticket: `#${ticketNum}`, region: "BRASIL", plate: form.get("plate").toUpperCase(), make, model: modelParts.join(" ") || "Novo veículo", type: "Veículo", color: "—", sector, box: `${sector}-${String(vehicles.filter((vehicle) => vehicle.sector === sector).length + 1).padStart(2, "0")}`, entry: "14:32", stay: "0h 00m", amount: 0 });
    searchInput.value = "";
    selectedSector = "todos";
    document.querySelectorAll(".filter-tab").forEach((tab, index) => tab.classList.toggle("is-selected", index === 0));
    page = 1;
    renderVehicles();
    closeDialog();
    showToast("Entrada registrada");
  }
  if (event.target.id === "exit-form") {
    event.preventDefault();
    const ticket = new FormData(event.target).get("ticket");
    const index = vehicles.findIndex((vehicle) => vehicle.ticket === ticket);
    if (index >= 0) vehicles.splice(index, 1);
    renderVehicles();
    closeDialog();
    showToast("Saída registrada");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeDialog();
  if (event.key === "F2") { event.preventDefault(); openEntryDialog(); }
  if (event.key === "F3") { event.preventDefault(); openExitDialog(); }
});

renderVehicles();
