// app.js
//Definicion URL API REST 

const API_BASE = 'https://blockchainticketapi-production.up.railway.app/api_rest/v1/WEB3_Ticketer';

// 1. Definición de los esquemas de tabla (idéntico a tu versión original)
const tableSchemas = {
  bands: [
    { name: 'id', type: 'number', primary: true, editable: false },
    { name: 'band_name', type: 'text', required: true },
    { name: 'genre_id', type: 'select', relation: 'music_genres', relationLabel: 'genre_name' }
  ],
  cities: [
    { name: 'id', type: 'number', primary: true, editable: false },
    { name: 'city_name', type: 'text', required: true },
    { name: 'country_id', type: 'select', relation: 'countries', relationLabel: 'country_name' }
  ],
  countries: [
    { name: 'id', type: 'number', primary: true, editable: false },
    { name: 'country_name', type: 'text', required: true }
  ],
  music_genres: [
    { name: 'id', type: 'number', primary: true, editable: false },
    { name: 'genre_name', type: 'text', required: true }
  ],
  stadiums: [
    { name: 'id', type: 'number', primary: true, editable: false },
    { name: 'stadium_name', type: 'text', required: true },
    { name: 'city_id', type: 'select', relation: 'cities', relationLabel: 'city_name' }
  ],
  ticket_categories: [
    { name: 'id', type: 'number', primary: true, editable: false },
    { name: 'category_name', type: 'text', required: true },
    { name: 'base_price', type: 'number', required: true }
  ],
  tickets: [
    { name: 'id', type: 'number', primary: true, editable: false },
    { name: 'band_id', type: 'select', relation: 'bands', relationLabel: 'band_name' },
    { name: 'stadium_id', type: 'select', relation: 'stadiums', relationLabel: 'stadium_name' },
    { name: 'eventDate', type: 'datetime-local', required: true },
    { name: 'category_id', type: 'select', relation: 'ticket_categories', relationLabel: 'category_name' }
  ]
};

// 2. Datos de ejemplo (mockData) para cada tabla
const mockData = {
  bands: [
    { id: 1, band_name: "The Rolling Stones", genre_id: 1 },
    { id: 2, band_name: "Shakira", genre_id: 4 },
    { id: 3, band_name: "Miles Davis Quintet", genre_id: 3 },
    { id: 4, band_name: "Metallica", genre_id: 6 },
    { id: 5, band_name: "Coldplay", genre_id: 2 }
  ],
  cities: [
    { id: 1, city_name: "New York", country_id: 1 },
    { id: 2, city_name: "Bogotá", country_id: 2 },
    { id: 3, city_name: "Berlin", country_id: 3 },
    { id: 4, city_name: "Buenos Aires", country_id: 4 },
    { id: 5, city_name: "Mexico City", country_id: 5 }
  ],
  countries: [
    { id: 1, country_name: "USA" },
    { id: 2, country_name: "Colombia" },
    { id: 3, country_name: "Germany" },
    { id: 4, country_name: "Argentina" },
    { id: 5, country_name: "Mexico" }
  ],
  music_genres: [
    { id: 1, genre_name: "Rock" },
    { id: 2, genre_name: "Pop" },
    { id: 3, genre_name: "Jazz" },
    { id: 4, genre_name: "Reggaeton" },
    { id: 5, genre_name: "Hip Hop" },
    { id: 6, genre_name: "Metal" }
  ],
  stadiums: [
    { id: 1, stadium_name: "Yankee Stadium", city_id: 1 },
    { id: 2, stadium_name: "El Campín", city_id: 2 },
    { id: 3, stadium_name: "Olympiastadion", city_id: 3 },
    { id: 4, stadium_name: "Estadio Monumental", city_id: 4 },
    { id: 5, stadium_name: "Estadio Azteca", city_id: 5 }
  ],
  ticket_categories: [
    { id: 1, category_name: "General", base_price: 50.00 },
    { id: 2, category_name: "VIP", base_price: 120.00 },
    { id: 3, category_name: "Preferencial", base_price: 80.00 },
    { id: 4, category_name: "Platinum", base_price: 200.00 },
    { id: 5, category_name: "Gold", base_price: 150.00 }
  ],
  tickets: [
    { id: 1, band_id: 1, stadium_id: 1, event_date: "2025-06-15T20:00", category_id: 2 },
    { id: 2, band_id: 2, stadium_id: 2, event_date: "2025-07-10T19:30", category_id: 1 },
    { id: 3, band_id: 3, stadium_id: 3, event_date: "2025-08-01T18:00", category_id: 5 },
    { id: 4, band_id: 4, stadium_id: 4, event_date: "2025-05-20T21:00", category_id: 4 },
    { id: 5, band_id: 5, stadium_id: 5, event_date: "2025-09-12T20:00", category_id: 3 }
  ]
};

// 3. Referencias a elementos del DOM
const tableSelector    = document.getElementById('table-selector');
const currentTableName = document.getElementById('current-table-name');
const tableHeaders     = document.getElementById('table-headers');
const tableBody        = document.getElementById('table-body');
const mobileCards      = document.getElementById('mobile-cards');
const createBtn        = document.getElementById('create-btn');
const recordForm       = document.getElementById('record-form');
const saveRecordBtn    = document.getElementById('save-record-btn');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
const loadingSpinner   = document.getElementById('loading-spinner');

let currentTable   = 'bands';
let currentRecord  = null;
let currentAction  = 'create';
let deleteRecordId = null;

// Bootstrap modals
const recordModal = new bootstrap.Modal(document.getElementById('record-modal'));
const deleteModal = new bootstrap.Modal(document.getElementById('delete-modal'));

// 4. Inicialización
function init() {
  // Carga inicial
  loadTableData(currentTable);

  // Listeners
  tableSelector.addEventListener('change', () => {
    currentTable = tableSelector.value;
    currentTableName.textContent = formatTableName(currentTable);
    loadTableData(currentTable);
  });
  createBtn.addEventListener('click', () => {
    currentAction = 'create';
    currentRecord = null;
    showRecordModal();
  });
  saveRecordBtn.addEventListener('click', saveRecord);
  confirmDeleteBtn.addEventListener('click', deleteRecord);
}

document.addEventListener('DOMContentLoaded', init);

// 5. Carga de datos y renderizado
async function loadTableData(tableName) {
  showLoading();

  try {
    // Hacemos GET a /{tableName}, p.ej. /bands, /cities, etc.
    const endpoint = tableName.replace(/_/g, '-');
    const url = `${API_BASE}/${tableName}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    // La API devuelve un Page<Entidad>, con .content para los registros
    const json = await res.json();
    const data = Array.isArray(json.content) ? json.content : [];
    renderTable(data, tableSchemas[tableName]);
  } catch (err) {
    console.error('Error cargando datos de', tableName, err);
    showToast(`Error cargando ${formatTableName(tableName)}: ${err.message}`, 'error');
    // Caída de back-off a mockData para no romper la UI
    const fallback = mockData[tableName] || [];
    renderTable(fallback, tableSchemas[tableName]);
  } finally {
    hideLoading();
  }
}

// Función única para renderizar encabezados + filas + tarjetas
function renderTable(data, schema) {
  generateTableHeaders(schema);
  generateTableRows(data, schema);
  generateMobileCards(data, schema);
}

// 6. Generadores de UI (idénticos a tu versión original)
function generateTableHeaders(schema) {
  tableHeaders.innerHTML = '';
  schema.forEach(field => {
    if (field.name !== 'id' || field.visible) {
      const th = document.createElement('th');
      th.textContent = formatFieldName(field.name);
      tableHeaders.appendChild(th);
    }
  });
  const actionsHeader = document.createElement('th');
  actionsHeader.textContent = 'Actions';
  actionsHeader.style.width = '120px';
  tableHeaders.appendChild(actionsHeader);
}

function generateTableRows(data, schema) {
  tableBody.innerHTML = '';
  data.forEach(record => {
    const tr = document.createElement('tr');

    schema.forEach(field => {
      const td = document.createElement('td');
      let displayValue = record[field.name];

      if (field.type === 'select') {
        const val = record[field.name];
        if (val && typeof val === 'object') {
          displayValue = val[field.relationLabel];
        } else {
          const rel = mockData[field.relation];
          const relRec = rel?.find(r => r.id === val);
          displayValue = relRec ? relRec[field.relationLabel] : '';
        }
      } else if (field.type === 'datetime-local') {
        const raw = record[field.name]; // form "dd/MM/yyyy HH:mm:ss"
        const [datePart, timePart] = raw.split(' ');
        const [dd, MM, yyyy] = datePart.split('/');
        const [HH, mm, ss] = timePart.split(':');
        const parsed = new Date(yyyy, Number(MM)-1, dd, HH, mm, ss);
        displayValue = isNaN(parsed)
          ? 'Invalid Date'
          : parsed.toLocaleString();
      } else if (field.name === 'base_price') {
        displayValue = '$' + parseFloat(record[field.name]).toFixed(2);
      }

      td.textContent = displayValue || '';
      tr.appendChild(td);
    });
    // Actions
    const actionsTd = document.createElement('td');
    // Edit
    const editBtn = document.createElement('button');
    editBtn.className = 'action-btn edit-btn';
    editBtn.innerHTML = '<i class="fas fa-pencil-alt"></i>';
    editBtn.addEventListener('click', () => {
      currentAction = 'edit';
      currentRecord = record;
      showRecordModal();
    });
    actionsTd.appendChild(editBtn);
    // Delete
    const delBtn = document.createElement('button');
    delBtn.className = 'action-btn delete-btn';
    delBtn.innerHTML = '<i class="fas fa-trash"></i>';
    delBtn.addEventListener('click', () => {
      deleteRecordId = record.id;
      deleteModal.show();
    });
    actionsTd.appendChild(delBtn);

    tr.appendChild(actionsTd);
    tableBody.appendChild(tr);
  });
}

function generateMobileCards(data, schema) {
  mobileCards.innerHTML = '';

  data.forEach(record => {
    const card = document.createElement('div');
    card.className = 'data-card';

    // Título de la tarjeta
    const titleField = schema.find(f => f.name !== 'id') || { name: 'id' };
    const cardTitle = document.createElement('div');
    cardTitle.className = 'data-card-title';
    cardTitle.textContent = record[titleField.name];
    card.appendChild(cardTitle);

    // Campos de la tarjeta
    schema.forEach(field => {
      if (field.name !== 'id' && field.name !== titleField.name) {
        const fieldRow = document.createElement('div');
        fieldRow.className = 'data-card-field';

        const label = document.createElement('div');
        label.className = 'data-card-label';
        label.textContent = formatFieldName(field.name);
        fieldRow.appendChild(label);

        const value = document.createElement('div');
        let displayValue = record[field.name];
        if (field.type === 'select' && field.relation) {
          const relData = mockData[field.relation] || [];
          const relRec = relData.find(r => r.id === record[field.name]);
          displayValue = relRec ? relRec[field.relationLabel] : '';
        } else if (field.type === 'datetime-local') {
          displayValue = new Date(record[field.name]).toLocaleString();
        } else if (field.name === 'base_price') {
          displayValue = '$' + parseFloat(record[field.name]).toFixed(2);
        }
        value.textContent = displayValue || '';
        fieldRow.appendChild(value);

        card.appendChild(fieldRow);
      }
    });

    // Acciones (edit + delete)
    const actions = document.createElement('div');
    actions.className = 'data-card-actions';

    // Botón Editar
    const editBtn = document.createElement('button');
    editBtn.className = 'action-btn edit-btn';
    editBtn.innerHTML = '<i class="fas fa-pencil-alt"></i>';
    editBtn.addEventListener('click', () => {
      currentAction = 'edit';
      currentRecord = record;
      showRecordModal();
    });
    actions.appendChild(editBtn);

    // Botón Eliminar
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'action-btn delete-btn';
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.addEventListener('click', () => {
      deleteRecordId = record.id;
      deleteModal.show();
    });
    actions.appendChild(deleteBtn);

    card.appendChild(actions);
    mobileCards.appendChild(card);
  });
}

// 7. Modal form dinámico (idéntico al original)
function showRecordModal() {
  const schema = tableSchemas[currentTable];
  const titleEl = document.getElementById('modal-title');
  titleEl.textContent = currentAction === 'create'
    ? `Create New ${formatTableName(currentTable, false)}`
    : `Edit ${formatTableName(currentTable, false)}`;
  recordForm.innerHTML = '';
  schema.forEach(field => {
    if (field.name === 'id' && currentAction === 'create') return;
    const formGroup = document.createElement('div');
    formGroup.className = 'mb-3';
    const label = document.createElement('label');
    label.className = 'form-label';
    label.textContent = formatFieldName(field.name);
    label.setAttribute('for', `field-${field.name}`);
    formGroup.appendChild(label);
    let input;
    if (field.type === 'select') {
      input = document.createElement('select');
      input.className = 'form-select';
      const emptyOpt = document.createElement('option');
      emptyOpt.value = ''; emptyOpt.textContent = `-- Select ${formatTableName(field.relation)} --`;
      input.appendChild(emptyOpt);
      (mockData[field.relation] || []).forEach(opt => {
        const o = document.createElement('option');
        o.value = opt.id; o.textContent = opt[field.relationLabel];
        if (currentAction === 'edit' && currentRecord[field.name] === opt.id) o.selected = true;
        input.appendChild(o);
      });
    } else {
      input = document.createElement('input');
      input.type = field.type === 'number' ? 'number' : field.type;
      input.className = 'form-control';
      if (field.type === 'datetime-local' && currentAction === 'edit') {
        input.value = new Date(currentRecord[field.name]).toISOString().slice(0,16);
      } else if (currentAction === 'edit') {
        input.value = currentRecord[field.name] || '';
      }
      if (field.name === 'base_price') {
        input.step = '0.01'; input.min = '0';
      }
    }
    input.id = `field-${field.name}`;
    input.name = field.name;
    if (field.editable === false) {
      input.readOnly = true; input.classList.add('bg-light');
    }
    if (field.required) input.required = true;
    formGroup.appendChild(input);
    recordForm.appendChild(formGroup);
  });
  recordModal.show();
}

// 8. Guardar y eliminar registros (usando mockData)
function saveRecord() {
  if (!validateForm()) {
    showToast('Please fill in all required fields', 'error');
    return;
  }
  showLoading();
  const formData = {};
  tableSchemas[currentTable].forEach(field => {
    const input = document.getElementById(`field-${field.name}`);
    if (input) {
      formData[field.name] = field.type === 'number'
        ? parseFloat(input.value) : input.value;
    }
  });
  setTimeout(() => {
    if (currentAction === 'create') {
      const maxId = Math.max(0, ...mockData[currentTable].map(r => r.id));
      formData.id = maxId + 1;
      mockData[currentTable].push(formData);
      showToast(`New ${formatTableName(currentTable,false)} created!`, 'success');
    } else {
      const idx = mockData[currentTable].findIndex(r => r.id === currentRecord.id);
      mockData[currentTable][idx] = { ...formData };
      showToast(`${formatTableName(currentTable,false)} updated!`, 'success');
    }
    loadTableData(currentTable);
    recordModal.hide();
    hideLoading();
  }, 500);
}

function deleteRecord() {
  showLoading();
  setTimeout(() => {
    const idx = mockData[currentTable].findIndex(r => r.id === deleteRecordId);
    if (idx !== -1) mockData[currentTable].splice(idx,1);
    showToast(`${formatTableName(currentTable,false)} deleted!`, 'success');
    loadTableData(currentTable);
    deleteModal.hide();
    hideLoading();
  }, 500);
}

// 9. Validaciones, toasts y helpers
function validateForm() {
  let valid = true;
  tableSchemas[currentTable].forEach(field => {
    if (field.required) {
      const inp = document.getElementById(`field-${field.name}`);
      if (inp && !inp.value) {
        inp.classList.add('is-invalid');
        valid = false;
      }
    }
  });
  return valid;
}

function showLoading() { loadingSpinner.style.display = 'flex'; }
function hideLoading() { loadingSpinner.style.display = 'none'; }

function showToast(msg, type='info') {
  const bg = type==='success'? '#10b981' : type==='error'? '#ef4444' : '#3b82f6';
  Toastify({ text: msg, duration: 3000, gravity: "top", position: "right",
    style: { background: bg, borderRadius: "8px", fontWeight: "500" }
  }).showToast();
}

function formatTableName(name, plural=true) {
  let f = name.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
  if (!plural && f.endsWith('s')) f=f.slice(0,-1);
  return f;
}

function formatFieldName(fn) {
  if (fn==='id') return 'ID';
  if (fn.endsWith('_id')) fn=fn.slice(0,-3);
  return fn.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
}
