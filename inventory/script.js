/* ============================================================
   NEW LIFE LAPTOPS — Inventory System
   script.js
   ============================================================
   No backend, no APIs, no login required.
   Data is stored in browser localStorage.
   To deploy: upload index.html, style.css, script.js
   ============================================================ */

'use strict';

const STORAGE_KEYS = { devices: 'nll_devices', accessories: 'nll_accessories' };
const DEVICE_STATUSES  = ['Available','Listed Online','Listed on Facebook','Sold','Shipped','Returned','Archived'];
const DEVICE_CONDITIONS = ['Grade A','Grade B','Grade C','For Parts'];
const SALE_PLATFORMS   = ['eBay','Facebook Marketplace','Direct Sale','Other'];
const ACC_CATEGORIES = ['Charger','Power Cord','Cable','Dock','Battery','RAM','SSD/HDD','Screen','Keyboard','Mouse','Bag/Case','Other'];
const CAT_ICONS = {'Charger':'fa-bolt','Power Cord':'fa-power-off','Cable':'fa-ethernet','Dock':'fa-desktop','Battery':'fa-battery-half','RAM':'fa-memory','SSD/HDD':'fa-hard-drive','Screen':'fa-display','Keyboard':'fa-keyboard','Mouse':'fa-computer-mouse','Bag/Case':'fa-briefcase','Other':'fa-box'};

function getDevices()     { return JSON.parse(localStorage.getItem(STORAGE_KEYS.devices) || '[]'); }
function getAccessories() { return JSON.parse(localStorage.getItem(STORAGE_KEYS.accessories) || '[]'); }
function saveDevices(d)   { localStorage.setItem(STORAGE_KEYS.devices, JSON.stringify(d)); }
function saveAccessories(a) { localStorage.setItem(STORAGE_KEYS.accessories, JSON.stringify(a)); }
function generateId() { return 'id_' + Date.now() + '_' + Math.random().toString(36).slice(2,7); }
function nextSku(prefix) {
  const items = prefix === 'NLL-' ? getDevices() : getAccessories();
  const nums = items.map(i => parseInt((i.sku || '').replace(prefix, ''), 10)).filter(n => !isNaN(n));
  const next = nums.length ? Math.max(...nums) + 1 : 1;
  return prefix + String(next).padStart(3, '0');
}

const SAMPLE_DEVICES = [
  {id:'dev_001',sku:'NLL-001',title:'Dell Latitude E7470',brand:'Dell',model:'Latitude E7470',serial:'DL7470A01',processor:'Intel Core i5-6300U',ram:'8GB DDR4',storage:'256GB SSD',display:'14" FHD IPS',battery:'82%',os:'Windows 11 Pro',color:'Black',condition:'Grade A',conditionNotes:'Minor scuff on lid',cost:45,salePrice:249.99,status:'Available',location:'Shelf A-1',notes:'',photos:[],linkedAccessories:['acc_001'],dateAdded:'2026-06-10',dateSold:null,soldPrice:null,buyer:null,trackingNumber:null,platform:null},
  {id:'dev_002',sku:'NLL-002',title:'HP EliteBook 840 G4',brand:'HP',model:'EliteBook 840 G4',serial:'HP840G4B02',processor:'Intel Core i7-7600U',ram:'16GB DDR4',storage:'512GB SSD',display:'14" FHD IPS',battery:'91%',os:'Windows 11 Pro',color:'Silver',condition:'Grade A',conditionNotes:'Excellent',cost:65,salePrice:389.99,status:'Listed Online',location:'Shelf A-2',notes:'',photos:[],linkedAccessories:['acc_002'],dateAdded:'2026-06-12',dateSold:null,soldPrice:null,buyer:null,trackingNumber:null,platform:'eBay'},
  {id:'dev_003',sku:'NLL-003',title:'Lenovo ThinkPad T470',brand:'Lenovo',model:'ThinkPad T470',serial:'LNT470C03',processor:'Intel Core i5-7300U',ram:'8GB DDR4',storage:'256GB SSD',display:'14" FHD IPS',battery:'78%',os:'Windows 11 Home',color:'Black',condition:'Grade A',conditionNotes:'Light wear on keyboard',cost:50,salePrice:199.99,status:'Sold',location:'Shipped',notes:'',photos:[],linkedAccessories:['acc_003'],dateAdded:'2026-06-01',dateSold:'2026-06-20',soldPrice:199.99,buyer:'James W.',trackingNumber:'9400111899221234567890',platform:'Facebook Marketplace'},
  {id:'dev_004',sku:'NLL-004',title:'Dell OptiPlex 7050',brand:'Dell',model:'OptiPlex 7050',serial:'DO7050D04',processor:'Intel Core i7-7700',ram:'16GB DDR4',storage:'256GB SSD',display:'No Display',battery:'N/A',os:'Windows 11 Pro',color:'Black',condition:'Grade A',conditionNotes:'Excellent',cost:55,salePrice:299.99,status:'Available',location:'Shelf B-1',notes:'Desktop',photos:[],linkedAccessories:[],dateAdded:'2026-06-18',dateSold:null,soldPrice:null,buyer:null,trackingNumber:null,platform:null},
  {id:'dev_005',sku:'NLL-005',title:'HP ProBook 450 G5',brand:'HP',model:'ProBook 450 G5',serial:'HP450G5E05',processor:'Intel Core i5-8250U',ram:'8GB DDR4',storage:'256GB SSD',display:'15.6" FHD',battery:'74%',os:'Windows 11 Home',color:'Gray',condition:'Grade B',conditionNotes:'Scratch on bottom',cost:35,salePrice:179.99,status:'Listed on Facebook',location:'Shelf A-3',notes:'',photos:[],linkedAccessories:['acc_002'],dateAdded:'2026-06-22',dateSold:null,soldPrice:null,buyer:null,trackingNumber:null,platform:'Facebook Marketplace'},
  {id:'dev_006',sku:'NLL-006',title:'Lenovo ThinkPad X240',brand:'Lenovo',model:'ThinkPad X240',serial:'LNX240F06',processor:'Intel Core i5-4300U',ram:'4GB DDR3',storage:'128GB SSD',display:'12.5" HD',battery:'35%',os:'Windows 10 Pro',color:'Black',condition:'For Parts',conditionNotes:'Cracked screen',cost:8,salePrice:49.99,status:'Archived',location:'Parts Bin C-1',notes:'For parts only',photos:[],linkedAccessories:[],dateAdded:'2026-05-30',dateSold:null,soldPrice:null,buyer:null,trackingNumber:null,platform:null},
  {id:'dev_007',sku:'NLL-007',title:'Dell Precision 7510',brand:'Dell',model:'Precision 7510',serial:'DP7510G07',processor:'Intel Core i7-6820HQ',ram:'32GB DDR4',storage:'512GB SSD',display:'15.6" FHD IPS',battery:'80%',os:'Windows 11 Pro',color:'Black',condition:'Grade B',conditionNotes:'Light wear on palm rest',cost:85,salePrice:499.99,status:'Available',location:'Shelf B-2',notes:'NVIDIA Quadro GPU',photos:[],linkedAccessories:[],dateAdded:'2026-06-25',dateSold:null,soldPrice:null,buyer:null,trackingNumber:null,platform:null}
];

const SAMPLE_ACCESSORIES = [
  {id:'acc_001',sku:'NLL-A001',title:'Dell 65W Laptop Charger',brand:'Dell',category:'Charger',compatible:'Dell Latitude / Inspiron series',condition:'Good',cost:7,salePrice:24.99,quantity:3,minStock:2,location:'Bin B-1',notes:'Round barrel plug',linkedDevices:['dev_001'],dateAdded:'2026-06-10'},
  {id:'acc_002',sku:'NLL-A002',title:'HP 45W USB-C Charger',brand:'HP',category:'Charger',compatible:'HP EliteBook 800 / ProBook series',condition:'Excellent',cost:9,salePrice:29.99,quantity:2,minStock:2,location:'Bin B-2',notes:'USB-C connection',linkedDevices:['dev_002','dev_005'],dateAdded:'2026-06-12'},
  {id:'acc_003',sku:'NLL-A003',title:'Lenovo ThinkPad 65W Charger',brand:'Lenovo',category:'Charger',compatible:'ThinkPad T/X/L series',condition:'Good',cost:8,salePrice:22.99,quantity:4,minStock:2,location:'Bin B-3',notes:'Slim tip connector',linkedDevices:['dev_003'],dateAdded:'2026-06-01'},
  {id:'acc_004',sku:'NLL-A004',title:'USB-C to USB-A Cable 6ft',brand:'Anker',category:'Cable',compatible:'Universal',condition:'New',cost:3,salePrice:9.99,quantity:8,minStock:3,location:'Bin C-1',notes:'Braided cable',linkedDevices:[],dateAdded:'2026-06-15'},
  {id:'acc_005',sku:'NLL-A005',title:'DisplayPort to HDMI Adapter',brand:'Generic',category:'Cable',compatible:'DisplayPort to HDMI monitors',condition:'New',cost:2,salePrice:7.99,quantity:5,minStock:3,location:'Bin C-2',notes:'4K compatible',linkedDevices:[],dateAdded:'2026-06-15'},
  {id:'acc_006',sku:'NLL-A006',title:'Lenovo ThinkPad Ultra Dock',brand:'Lenovo',category:'Dock',compatible:'ThinkPad T/X series with OneLink+',condition:'Good',cost:20,salePrice:79.99,quantity:1,minStock:1,location:'Shelf C-1',notes:'USB 3.0, DisplayPort, VGA, Ethernet',linkedDevices:[],dateAdded:'2026-06-20'},
  {id:'acc_007',sku:'NLL-A007',title:'8GB DDR4 2666MHz SODIMM',brand:'Samsung',category:'RAM',compatible:'Most laptops DDR4 SODIMM slot',condition:'Pulled — Tested',cost:12,salePrice:29.99,quantity:5,minStock:3,location:'Parts Bin D-1',notes:'All tested',linkedDevices:[],dateAdded:'2026-06-08'},
  {id:'acc_008',sku:'NLL-A008',title:'256GB Samsung 870 EVO SSD',brand:'Samsung',category:'SSD/HDD',compatible:'2.5" SATA III',condition:'New',cost:20,salePrice:44.99,quantity:4,minStock:2,location:'Parts Bin D-2',notes:'New retail',linkedDevices:[],dateAdded:'2026-06-10'},
  {id:'acc_009',sku:'NLL-A009',title:'500GB Crucial MX500 SSD',brand:'Crucial',category:'SSD/HDD',compatible:'2.5" SATA III',condition:'New',cost:28,salePrice:59.99,quantity:2,minStock:2,location:'Parts Bin D-3',notes:'New in packaging',linkedDevices:[],dateAdded:'2026-06-10'},
  {id:'acc_010',sku:'NLL-A010',title:'Dell Laptop Battery 60Wh',brand:'Dell',category:'Battery',compatible:'Dell Latitude E-series',condition:'Used — 80% health',cost:15,salePrice:39.99,quantity:1,minStock:2,location:'Parts Bin E-1',notes:'Low stock — reorder needed',linkedDevices:['dev_001'],dateAdded:'2026-06-05'}
];

function loadSampleData() {
  if (!getDevices().length && !getAccessories().length) {
    saveDevices(SAMPLE_DEVICES);
    saveAccessories(SAMPLE_ACCESSORIES);
  }
}

let currentSection = 'dashboard';
let currentAccCat  = '';
let confirmCallback = null;

function navigateTo(section) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const elS = document.getElementById('section-' + section);
  if (elS) elS.classList.add('active');
  document.querySelectorAll('[data-section="' + section + '"]').forEach(n => n.classList.add('active'));
  currentSection = section;
  closeSidebar();
  switch (section) {
    case 'dashboard':   renderDashboard(); break;
    case 'devices':     renderDevices(); break;
    case 'accessories': renderAccessories(); break;
    case 'sold':        renderSold(); break;
    case 'reports':     renderReports(); break;
  }
  updateNavCounts();
}

function updateNavCounts() {
  const devices = getDevices(), accessories = getAccessories();
  const sold   = devices.filter(d => d.status === 'Sold' || d.status === 'Shipped');
  const active = devices.filter(d => !['Sold','Shipped','Archived'].includes(d.status));
  el('nc-devices').textContent     = active.length || '';
  el('nc-accessories').textContent = accessories.length || '';
  el('nc-sold').textContent        = sold.length || '';
}

function toggleSidebar()  { sidebar().classList.toggle('open'); backdrop().classList.toggle('open'); }
function closeSidebar()   { sidebar().classList.remove('open'); backdrop().classList.remove('open'); }
function sidebar()        { return document.getElementById('sidebar'); }
function backdrop()       { return document.getElementById('sidebarBackdrop'); }
function el(id)           { return document.getElementById(id); }

function renderDashboard() {
  const devices = getDevices(), accessories = getAccessories();
  const totalDevices = devices.length;
  const available    = devices.filter(d => d.status === 'Available').length;
  const listed       = devices.filter(d => ['Listed Online','Listed on Facebook'].includes(d.status)).length;
  const sold         = devices.filter(d => ['Sold','Shipped'].includes(d.status)).length;
  const totalProfit  = devices.filter(d => d.soldPrice).reduce((s,d) => s+((d.soldPrice||0)-(d.cost||0)), 0);
  const estValue     = devices.filter(d => !['Sold','Shipped','Archived'].includes(d.status)).reduce((s,d) => s+(d.salePrice||0), 0);
  const lowStock     = accessories.filter(a => a.quantity <= a.minStock);
  el('statsGrid').innerHTML = [
    {icon:'fa-laptop',cls:'blue',num:totalDevices,label:'Total Devices'},
    {icon:'fa-circle-check',cls:'green',num:available,label:'Available'},
    {icon:'fa-tags',cls:'blue',num:listed,label:'Listed for Sale'},
    {icon:'fa-handshake',cls:'purple',num:sold,label:'Sold'},
    {icon:'fa-dollar-sign',cls:'green',num:'$'+fmt(totalProfit),label:'Total Profit'},
    {icon:'fa-chart-line',cls:'teal',num:'$'+fmt(estValue),label:'Est. Inventory Value'},
    {icon:'fa-plug',cls:'blue',num:accessories.length,label:'Accessories'},
    {icon:'fa-triangle-exclamation',cls:'orange',num:lowStock.length,label:'Low Stock Alerts'},
  ].map(s=>`<div class="stat-card"><div class="stat-icon ${s.cls}"><i class="fas ${s.icon}"></i></div><div><div class="stat-num">${s.num}</div><div class="stat-label">${s.label}</div></div></div>`).join('');
  const alerts = [];
  const outOfStock = accessories.filter(a => a.quantity === 0);
  const veryLow    = accessories.filter(a => a.quantity > 0 && a.quantity < a.minStock);
  if (outOfStock.length) alerts.push(`<div class="alert alert-danger"><i class="fas fa-circle-exclamation"></i> ${outOfStock.length} accessor${outOfStock.length>1?'ies are':'y is'} <strong>out of stock</strong>: ${outOfStock.map(a=>a.title).join(', ')}</div>`);
  if (veryLow.length)    alerts.push(`<div class="alert alert-warning"><i class="fas fa-triangle-exclamation"></i> ${veryLow.length} accessor${veryLow.length>1?'ies are':'y is'} <strong>running low</strong>: ${veryLow.map(a=>a.title).join(', ')}</div>`);
  el('alertsBar').innerHTML = alerts.join('');
  const recent = [...devices].sort((a,b)=>new Date(b.dateAdded)-new Date(a.dateAdded)).slice(0,6);
  el('recentList').innerHTML = recent.length ? recent.map(d=>`<div class="mini-item" onclick="openEditDevice('${d.id}')"><div><div class="mini-item-title">${d.title}</div><div class="mini-item-sub">${d.sku} · ${fmtDate(d.dateAdded)}</div></div><div class="mini-item-right">${statusBadge(d.status)}<div style="font-size:0.7rem;color:var(--text-muted);margin-top:4px">$${fmt(d.salePrice)}</div></div></div>`).join('') : '<div class="mini-item"><div class="mini-item-sub">No devices yet</div></div>';
  el('lowStockList').innerHTML = lowStock.length ? lowStock.map(a=>`<div class="mini-item" onclick="navigateTo('accessories')"><div><div class="mini-item-title">${a.title}</div><div class="mini-item-sub">${a.sku} · ${a.category}</div></div><div class="mini-item-right">${stockBadge(a)}<div style="font-size:0.7rem;color:var(--text-muted);margin-top:4px">${a.quantity} / ${a.minStock} min</div></div></div>`).join('') : '<div class="mini-item"><div class="mini-item-sub" style="color:var(--success)"><i class="fas fa-check"></i> All accessories stocked</div></div>';
}

function renderDevices() {
  const devices = getDevices();
  const search  = (el('deviceSearch')?.value||'').toLowerCase();
  const statusF = el('deviceStatusFilter')?.value||'';
  const condF   = el('deviceCondFilter')?.value||'';
  let filtered  = devices.filter(d => {
    const ms = !search||d.sku.toLowerCase().includes(search)||d.title.toLowerCase().includes(search)||(d.brand||'').toLowerCase().includes(search)||(d.model||'').toLowerCase().includes(search)||(d.serial||'').toLowerCase().includes(search)||(d.location||'').toLowerCase().includes(search);
    return ms && (!statusF||d.status===statusF) && (!condF||d.condition===condF);
  });
  const tbody = el('deviceTableBody'), empty = el('deviceEmpty');
  if (!filtered.length) { tbody.innerHTML=''; empty.style.display=''; return; }
  empty.style.display='none';
  tbody.innerHTML = filtered.map(d=>`<tr><td class="td-sku">${d.sku}</td><td><div class="td-title">${d.title}</div><div class="td-sub">${d.brand} ${d.model}${d.serial?' · S/N: '+d.serial:''}</div></td><td style="font-size:0.76rem;color:var(--text-muted)">${[d.processor,d.ram,d.storage].filter(Boolean).join(' · ')}</td><td>${condBadge(d.condition)}</td><td>${statusBadge(d.status)}</td><td style="color:var(--text-muted)">$${fmt(d.cost)}</td><td style="font-family:'Orbitron',sans-serif;font-size:0.78rem;color:var(--primary)">$${fmt(d.salePrice)}</td><td style="font-size:0.76rem;color:var(--text-muted)">${d.location||'—'}</td><td><div class="action-btns"><button class="btn-icon" onclick="openEditDevice('${d.id}')"><i class="fas fa-pen"></i></button>${!['Sold','Shipped'].includes(d.status)?`<button class="btn-icon success" onclick="openMarkSold('${d.id}')"><i class="fas fa-handshake"></i></button>`:''} ${d.status==='Sold'?`<button class="btn-icon purple" onclick="markShipped('${d.id}')"><i class="fas fa-truck"></i></button>`:''} ${d.status!=='Archived'&&!['Sold','Shipped'].includes(d.status)?`<button class="btn-icon" onclick="archiveDevice('${d.id}')"><i class="fas fa-box-archive"></i></button>`:''}<button class="btn-icon danger" onclick="confirmDelete('device','${d.id}','${d.title.replace(/'/g,"\\'")}')" ><i class="fas fa-trash"></i></button></div></td></tr>`).join('');
}

function openAddDevice() { openModal('Add Device', buildDeviceForm({sku:nextSku('NLL-')},'add')); }
function openEditDevice(id) { const d=getDevices().find(x=>x.id===id); if(!d)return; openModal('Edit Device — '+d.sku, buildDeviceForm(d,'edit')); }

function saveDeviceForm(mode,id) {
  const f=document.getElementById('itemForm');
  const title=f.querySelector('[name=title]').value.trim(), sku=f.querySelector('[name=sku]').value.trim();
  if(!title){toast('Title is required','error');return;} if(!sku){toast('SKU is required','error');return;}
  const linked=[...f.querySelectorAll('[name=linkedAcc]:checked')].map(c=>c.value);
  const status=f.querySelector('[name=status]').value;
  const data={sku,title,brand:f.querySelector('[name=brand]').value,model:f.querySelector('[name=model]').value,serial:f.querySelector('[name=serial]').value,processor:f.querySelector('[name=processor]').value,ram:f.querySelector('[name=ram]').value,storage:f.querySelector('[name=storage]').value,display:f.querySelector('[name=display]').value,battery:f.querySelector('[name=battery]').value,os:f.querySelector('[name=os]').value,color:f.querySelector('[name=color]').value,condition:f.querySelector('[name=condition]').value,conditionNotes:f.querySelector('[name=conditionNotes]').value,cost:parseFloat(f.querySelector('[name=cost]').value)||0,salePrice:parseFloat(f.querySelector('[name=salePrice]').value)||0,status,location:f.querySelector('[name=location]').value,notes:f.querySelector('[name=notes]').value,photos:(f.querySelector('[name=photos]').value||'').split('\n').map(s=>s.trim()).filter(Boolean),linkedAccessories:linked,soldPrice:['Sold','Shipped'].includes(status)?(parseFloat(f.querySelector('[name=soldPrice]')?.value)||null):null,dateSold:['Sold','Shipped'].includes(status)?(f.querySelector('[name=dateSold]')?.value||null):null,buyer:f.querySelector('[name=buyer]')?.value||null,trackingNumber:f.querySelector('[name=trackingNumber]')?.value||null,platform:f.querySelector('[name=platform]')?.value||null};
  const devices=getDevices();
  if(mode==='add'){data.id=generateId();data.dateAdded=new Date().toISOString().split('T')[0];devices.push(data);toast('Device added: '+data.sku);}
  else{const idx=devices.findIndex(d=>d.id===id);if(idx===-1)return;data.id=id;data.dateAdded=devices[idx].dateAdded;devices[idx]=data;toast('Device updated: '+data.sku);}
  updateAccessoryLinks(linked,id);saveDevices(devices);closeModal();renderDevices();updateNavCounts();
  if(currentSection==='dashboard')renderDashboard();
}

function updateAccessoryLinks(linkedAccIds,deviceId){
  const accessories=getAccessories();
  accessories.forEach(a=>{if(!a.linkedDevices)a.linkedDevices=[];if(linkedAccIds.includes(a.id)){if(!a.linkedDevices.includes(deviceId))a.linkedDevices.push(deviceId);}else{a.linkedDevices=a.linkedDevices.filter(id=>id!==deviceId);}});
  saveAccessories(accessories);
}

function openMarkSold(id){const d=getDevices().find(x=>x.id===id);if(!d)return;openModal('Mark as Sold — '+d.title,buildMarkSoldForm(d));}
function saveMarkSold(id){
  const f=document.getElementById('soldForm');
  const soldPrice=parseFloat(f.querySelector('[name=soldPrice]').value);
  if(!soldPrice||soldPrice<=0){toast('Enter a valid sold price','error');return;}
  const devices=getDevices(),idx=devices.findIndex(d=>d.id===id);if(idx===-1)return;
  devices[idx].status='Sold';devices[idx].soldPrice=soldPrice;devices[idx].dateSold=f.querySelector('[name=dateSold]').value||new Date().toISOString().split('T')[0];devices[idx].buyer=f.querySelector('[name=buyer]').value||null;devices[idx].platform=f.querySelector('[name=platform]').value||null;devices[idx].trackingNumber=f.querySelector('[name=trackingNumber]').value||null;
  saveDevices(devices);closeModal();renderDevices();updateNavCounts();
  if(currentSection==='dashboard')renderDashboard();
  toast('Marked as sold — profit: $'+fmt(soldPrice-(devices[idx].cost||0)));
}
function markShipped(id){const devices=getDevices(),idx=devices.findIndex(d=>d.id===id);if(idx===-1)return;devices[idx].status='Shipped';saveDevices(devices);renderDevices();updateNavCounts();if(currentSection==='sold')renderSold();toast('Marked as shipped');}
function archiveDevice(id){const devices=getDevices(),idx=devices.findIndex(d=>d.id===id);if(idx===-1)return;devices[idx].status='Archived';saveDevices(devices);renderDevices();toast('Device archived');}
function deleteDevice(id){let devices=getDevices();const d=devices.find(x=>x.id===id);devices=devices.filter(x=>x.id!==id);const accessories=getAccessories();accessories.forEach(a=>{a.linkedDevices=(a.linkedDevices||[]).filter(lid=>lid!==id);});saveAccessories(accessories);saveDevices(devices);renderDevices();renderDashboard();updateNavCounts();toast('Deleted: '+(d?.title||'device'));}

function renderAccessories(){
  const accessories=getAccessories(),search=(el('accSearch')?.value||'').toLowerCase(),catFilter=currentAccCat;
  let filtered=accessories.filter(a=>{const mc=!catFilter||a.category===catFilter;const ms=!search||a.sku.toLowerCase().includes(search)||a.title.toLowerCase().includes(search)||(a.brand||'').toLowerCase().includes(search)||(a.category||'').toLowerCase().includes(search)||(a.compatible||'').toLowerCase().includes(search);return mc&&ms;});
  const grid=el('accGrid'),empty=el('accEmpty');
  if(!filtered.length){grid.innerHTML='';empty.style.display='';return;}empty.style.display='none';
  grid.innerHTML=filtered.map(a=>`<div class="acc-card"><div class="acc-card-top"><div class="acc-cat-icon"><i class="fas ${CAT_ICONS[a.category]||'fa-box'}"></i></div><div style="flex:1;min-width:0"><div class="acc-title">${a.title}</div><div class="acc-sku">${a.sku}</div><div class="acc-brand">${a.brand||''} · ${a.category}</div></div><div>${stockBadge(a)}</div></div><div class="acc-meta"><div class="acc-stock"><strong>${a.quantity}</strong><span> in stock / min ${a.minStock}</span></div><div class="acc-price">$${fmt(a.salePrice)}<sub> each</sub></div></div>${a.compatible?`<div class="acc-compatible" style="margin-bottom:10px"><i class="fas fa-link" style="color:var(--primary);margin-right:4px;font-size:0.65rem"></i>${a.compatible}</div>`:''}<div class="acc-card-footer"><span style="font-size:0.72rem;color:var(--text-muted)">${a.location||''}</span><div class="action-btns"><button class="btn-icon" onclick="openEditAccessory('${a.id}')"><i class="fas fa-pen"></i></button><button class="btn-icon success" onclick="adjustStock('${a.id}',1)"><i class="fas fa-plus"></i></button><button class="btn-icon danger" onclick="adjustStock('${a.id}',-1)"><i class="fas fa-minus"></i></button><button class="btn-icon danger" onclick="confirmDelete('accessory','${a.id}','${a.title.replace(/'/g,"\\'")}')" ><i class="fas fa-trash"></i></button></div></div></div>`).join('');
}

function buildCategoryPills(){const pills=el('catPills');pills.innerHTML=['','...ACC_CATEGORIES'].map(c=>`<button class="pill ${currentAccCat===c?'active':''}" onclick="setCat('${c}')">${c||'All'}</button>`).join('');}
function buildCategoryPillsReal(){const pills=el('catPills');const cats=['',...ACC_CATEGORIES];pills.innerHTML=cats.map(c=>`<button class="pill ${currentAccCat===c?'active':''}" onclick="setCat('${c}')">${c||'All'}</button>`).join('');}
function setCat(cat){currentAccCat=cat;buildCategoryPillsReal();renderAccessories();}
function openAddAccessory(){openModal('Add Accessory',buildAccessoryForm({sku:nextSku('NLL-A')},'add'));}
function openEditAccessory(id){const a=getAccessories().find(x=>x.id===id);if(!a)return;openModal('Edit Accessory — '+a.sku,buildAccessoryForm(a,'edit'));}
function saveAccessoryForm(mode,id){
  const f=document.getElementById('itemForm');
  const title=f.querySelector('[name=title]').value.trim(),sku=f.querySelector('[name=sku]').value.trim();
  if(!title){toast('Title is required','error');return;} if(!sku){toast('SKU is required','error');return;}
  const linked=[...f.querySelectorAll('[name=linkedDev]:checked')].map(c=>c.value);
  const data={sku,title,brand:f.querySelector('[name=brand]').value,category:f.querySelector('[name=category]').value,compatible:f.querySelector('[name=compatible]').value,condition:f.querySelector('[name=condition]').value,cost:parseFloat(f.querySelector('[name=cost]').value)||0,salePrice:parseFloat(f.querySelector('[name=salePrice]').value)||0,quantity:parseInt(f.querySelector('[name=quantity]').value)||0,minStock:parseInt(f.querySelector('[name=minStock]').value)||1,location:f.querySelector('[name=location]').value,notes:f.querySelector('[name=notes]').value,linkedDevices:linked};
  const accessories=getAccessories();
  if(mode==='add'){data.id=generateId();data.dateAdded=new Date().toISOString().split('T')[0];accessories.push(data);toast('Accessory added: '+data.sku);}
  else{const idx=accessories.findIndex(a=>a.id===id);if(idx===-1)return;data.id=id;data.dateAdded=accessories[idx].dateAdded;accessories[idx]=data;toast('Accessory updated: '+data.sku);}
  saveAccessories(accessories);closeModal();renderAccessories();updateNavCounts();
  if(currentSection==='dashboard')renderDashboard();
}
function adjustStock(id,delta){const accessories=getAccessories(),idx=accessories.findIndex(a=>a.id===id);if(idx===-1)return;const newQty=Math.max(0,(accessories[idx].quantity||0)+delta);accessories[idx].quantity=newQty;saveAccessories(accessories);renderAccessories();if(currentSection==='dashboard')renderDashboard();updateNavCounts();toast(accessories[idx].title+' stock: '+newQty);}
function deleteAccessory(id){let accessories=getAccessories();const a=accessories.find(x=>x.id===id);accessories=accessories.filter(x=>x.id!==id);const devices=getDevices();devices.forEach(d=>{d.linkedAccessories=(d.linkedAccessories||[]).filter(lid=>lid!==id);});saveDevices(devices);saveAccessories(accessories);renderAccessories();renderDashboard();updateNavCounts();toast('Deleted: '+(a?.title||'accessory'));}

function renderSold(){
  const devices=getDevices(),search=(el('soldSearch')?.value||'').toLowerCase(),platF=el('soldPlatformFilter')?.value||'';
  const sold=devices.filter(d=>['Sold','Shipped'].includes(d.status)&&(!search||d.sku.toLowerCase().includes(search)||d.title.toLowerCase().includes(search)||(d.buyer||'').toLowerCase().includes(search))&&(!platF||d.platform===platF)).sort((a,b)=>new Date(b.dateSold||0)-new Date(a.dateSold||0));
  const tbody=el('soldTableBody'),empty=el('soldEmpty');
  if(!sold.length){tbody.innerHTML='';empty.style.display='';return;}empty.style.display='none';
  tbody.innerHTML=sold.map(d=>{const profit=(d.soldPrice||0)-(d.cost||0);return`<tr><td class="td-sku">${d.sku}</td><td><div class="td-title">${d.title}</div><div class="td-sub">${d.brand} ${d.model}${d.buyer?' · '+d.buyer:''}</div></td><td style="font-family:'Orbitron',sans-serif;font-size:0.78rem;color:var(--sold-color)">$${fmt(d.soldPrice)}</td><td style="color:var(--text-muted)">$${fmt(d.cost)}</td><td style="color:${profit>=0?'var(--success)':'var(--danger)'};font-weight:600">${profit>=0?'+':''}$${fmt(profit)}</td><td style="font-size:0.76rem;color:var(--text-muted)">${d.platform||'—'}</td><td style="font-size:0.76rem;color:var(--text-muted)">${fmtDate(d.dateSold)}</td><td>${statusBadge(d.status)}</td><td style="font-size:0.72rem;color:var(--text-muted);font-family:monospace">${d.trackingNumber||'—'}</td><td><div class="action-btns"><button class="btn-icon" onclick="openEditDevice('${d.id}')"><i class="fas fa-pen"></i></button>${d.status==='Sold'?`<button class="btn-icon purple" onclick="markShipped('${d.id}')"><i class="fas fa-truck"></i></button>`:''}</div></td></tr>`;}).join('');
}

function renderReports(){
  const devices=getDevices(),accessories=getAccessories();
  const sold=devices.filter(d=>d.soldPrice);
  const totalRevenue=sold.reduce((s,d)=>s+(d.soldPrice||0),0);
  const totalCost=sold.reduce((s,d)=>s+(d.cost||0),0);
  const totalProfit=totalRevenue-totalCost;
  const avgProfit=sold.length?totalProfit/sold.length:0;
  const estValue=devices.filter(d=>!['Sold','Shipped','Archived'].includes(d.status)).reduce((s,d)=>s+(d.salePrice||0),0);
  const invCost=devices.filter(d=>!['Sold','Shipped'].includes(d.status)).reduce((s,d)=>s+(d.cost||0),0);
  const statusGroups={},condGroups={},catGroups={};
  devices.forEach(d=>{statusGroups[d.status]=(statusGroups[d.status]||0)+1;condGroups[d.condition]=(condGroups[d.condition]||0)+1;});
  accessories.forEach(a=>{catGroups[a.category]=(catGroups[a.category]||0)+a.quantity;});
  el('reportsContent').innerHTML=`<div class="report-grid">${[{num:'$'+fmt(totalRevenue),label:'Total Revenue'},{num:'$'+fmt(totalCost),label:'Cost of Goods Sold'},{num:'$'+fmt(totalProfit),label:'Total Profit'},{num:'$'+fmt(avgProfit),label:'Avg Profit / Device'},{num:sold.length,label:'Devices Sold'},{num:'$'+fmt(estValue),label:'Est. Unsold Value'},{num:'$'+fmt(invCost),label:'Capital in Inventory'},{num:accessories.reduce((s,a)=>s+a.quantity,0),label:'Accessory Units'}].map(r=>`<div class="report-card"><span class="r-num">${r.num}</span><span class="r-label">${r.label}</span></div>`).join('')}</div><div class="card" style="margin-bottom:20px"><div class="card-head"><h3><i class="fas fa-chart-pie"></i> Devices by Status</h3></div><div class="card-body" style="padding:16px"><table class="report-table"><thead><tr><th>Status</th><th>Count</th><th>%</th></tr></thead><tbody>${Object.entries(statusGroups).map(([s,c])=>`<tr><td>${statusBadge(s)}</td><td><strong>${c}</strong></td><td style="color:var(--text-muted)">${Math.round(c/devices.length*100)}%</td></tr>`).join('')}</tbody></table></div></div><div class="card" style="margin-bottom:20px"><div class="card-head"><h3><i class="fas fa-plug"></i> Accessories by Category</h3></div><div class="card-body" style="padding:16px"><table class="report-table"><thead><tr><th>Category</th><th>Units</th><th>SKUs</th></tr></thead><tbody>${Object.entries(catGroups).map(([cat,qty])=>{const items=accessories.filter(a=>a.category===cat).length;return`<tr><td><i class="fas ${CAT_ICONS[cat]||'fa-box'}" style="color:var(--primary);margin-right:8px"></i>${cat}</td><td><strong>${qty}</strong></td><td style="color:var(--text-muted)">${items}</td></tr>`;}).join('')}</tbody></table></div></div>${sold.length?`<div class="card"><div class="card-head"><h3><i class="fas fa-dollar-sign"></i> Recent Sales</h3></div><div class="card-body" style="padding:16px"><table class="report-table"><thead><tr><th>SKU</th><th>Device</th><th>Sold</th><th>Cost</th><th>Profit</th><th>Platform</th><th>Date</th></tr></thead><tbody>${[...sold].sort((a,b)=>new Date(b.dateSold||0)-new Date(a.dateSold||0)).map(d=>{const p=(d.soldPrice||0)-(d.cost||0);return`<tr><td class="td-sku">${d.sku}</td><td>${d.title}</td><td style="color:var(--sold-color)">$${fmt(d.soldPrice)}</td><td style="color:var(--text-muted)">$${fmt(d.cost)}</td><td style="color:${p>=0?'var(--success)':'var(--danger)'};font-weight:600">${p>=0?'+':''}$${fmt(p)}</td><td style="color:var(--text-muted)">${d.platform||'—'}</td><td style="color:var(--text-muted)">${fmtDate(d.dateSold)}</td></tr>`;}).join('')}</tbody></table></div></div>`:''}`;
}

function buildDeviceForm(d,mode){
  d=d||{};const id=d.id||'',isEdit=mode==='edit',accessories=getAccessories(),isSold=['Sold','Shipped'].includes(d.status);
  const linkedChecks=accessories.map(a=>`<label><input type="checkbox" name="linkedAcc" value="${a.id}" ${(d.linkedAccessories||[]).includes(a.id)?'checked':''}>${a.sku} — ${a.title} (${a.category})</label>`).join('');
  return `<form id="itemForm" onsubmit="return false"><div class="form-grid"><div class="form-group"><label>SKU *</label><input name="sku" value="${d.sku||''}" placeholder="NLL-001" required></div><div class="form-group"><label>Title *</label><input name="title" value="${d.title||''}" placeholder="Dell Latitude E7470" required></div><div class="form-group"><label>Brand</label><input name="brand" value="${d.brand||''}" placeholder="Dell"></div><div class="form-group"><label>Model</label><input name="model" value="${d.model||''}" placeholder="Latitude E7470"></div><div class="form-group"><label>Serial Number</label><input name="serial" value="${d.serial||''}" placeholder="ABCD1234"></div><div class="form-group"><label>Color</label><input name="color" value="${d.color||''}" placeholder="Black"></div><div class="form-section-title">Specs</div><div class="form-group"><label>Processor</label><input name="processor" value="${d.processor||''}" placeholder="Intel Core i5-6300U"></div><div class="form-group"><label>RAM</label><input name="ram" value="${d.ram||''}" placeholder="8GB DDR4"></div><div class="form-group"><label>Storage</label><input name="storage" value="${d.storage||''}" placeholder="256GB SSD"></div><div class="form-group"><label>Display</label><input name="display" value="${d.display||''}" placeholder='14&quot; FHD IPS'></div><div class="form-group"><label>Battery</label><input name="battery" value="${d.battery||''}" placeholder="80%"></div><div class="form-group"><label>Operating System</label><input name="os" value="${d.os||''}" placeholder="Windows 11 Pro"></div><div class="form-section-title">Condition &amp; Pricing</div><div class="form-group"><label>Condition</label><select name="condition">${DEVICE_CONDITIONS.map(c=>`<option ${d.condition===c?'selected':''}>${c}</option>`).join('')}</select></div><div class="form-group"><label>Condition Notes</label><input name="conditionNotes" value="${d.conditionNotes||''}" placeholder="Minor scratch on lid"></div><div class="form-group"><label>Cost ($)</label><input name="cost" type="number" step="0.01" min="0" value="${d.cost||0}"></div><div class="form-group"><label>Sale Price ($)</label><input name="salePrice" type="number" step="0.01" min="0" value="${d.salePrice||0}"></div><div class="form-section-title">Status &amp; Location</div><div class="form-group"><label>Status</label><select name="status" onchange="toggleSaleFields(this)">${DEVICE_STATUSES.map(s=>`<option ${d.status===s?'selected':''}>${s}</option>`).join('')}</select></div><div class="form-group"><label>Location</label><input name="location" value="${d.location||''}" placeholder="Shelf A-1"></div><div class="form-group full" id="saleFieldsGroup" style="${isSold?'':'display:none'}"><div class="sale-details"><div style="font-family:'Orbitron',sans-serif;font-size:0.65rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--sold-color);margin-bottom:12px"><i class="fas fa-handshake"></i> Sale Details</div><div class="form-grid"><div class="form-group"><label>Sold Price ($)</label><input name="soldPrice" type="number" step="0.01" min="0" value="${d.soldPrice||''}"></div><div class="form-group"><label>Date Sold</label><input name="dateSold" type="date" value="${d.dateSold||''}"></div><div class="form-group"><label>Buyer Name</label><input name="buyer" value="${d.buyer||''}" placeholder="Optional"></div><div class="form-group"><label>Platform</label><select name="platform"><option value="">— Select —</option>${SALE_PLATFORMS.map(p=>`<option ${d.platform===p?'selected':''}>${p}</option>`).join('')}</select></div><div class="form-group full"><label>Tracking Number</label><input name="trackingNumber" value="${d.trackingNumber||''}" placeholder="Optional"></div></div></div></div><div class="form-group full"><label>Notes</label><textarea name="notes">${d.notes||''}</textarea></div><div class="form-group full"><label>Photo URLs (one per line)</label><textarea name="photos" placeholder="https://i.imgur.com/example.jpg">${(d.photos||[]).join('\n')}</textarea></div>${accessories.length?`<div class="form-group full"><label>Linked Accessories</label><div class="linked-list">${linkedChecks||'<span style="color:var(--text-muted);font-size:0.8rem;padding:4px">No accessories yet</span>'}</div></div>`:''}</div><div class="form-actions"><button class="btn btn-ghost" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="saveDeviceForm('${mode}','${id}')"><i class="fas fa-save"></i> ${isEdit?'Save Changes':'Add Device'}</button></div></form>`;
}

function buildAccessoryForm(a,mode){
  a=a||{};const id=a.id||'',isEdit=mode==='edit',devices=getDevices();
  const deviceChecks=devices.filter(d=>!['Archived'].includes(d.status)).map(d=>`<label><input type="checkbox" name="linkedDev" value="${d.id}" ${(a.linkedDevices||[]).includes(d.id)?'checked':''}>${d.sku} — ${d.title}</label>`).join('');
  return `<form id="itemForm" onsubmit="return false"><div class="form-grid"><div class="form-group"><label>SKU *</label><input name="sku" value="${a.sku||''}" placeholder="NLL-A001" required></div><div class="form-group"><label>Title *</label><input name="title" value="${a.title||''}" placeholder="Dell 65W Charger" required></div><div class="form-group"><label>Brand</label><input name="brand" value="${a.brand||''}" placeholder="Dell"></div><div class="form-group"><label>Category</label><select name="category">${ACC_CATEGORIES.map(c=>`<option ${a.category===c?'selected':''}>${c}</option>`).join('')}</select></div><div class="form-group full"><label>Compatible With</label><input name="compatible" value="${a.compatible||''}" placeholder="Dell Latitude / Inspiron series"></div><div class="form-section-title">Stock &amp; Pricing</div><div class="form-group"><label>Quantity in Stock</label><input name="quantity" type="number" min="0" value="${a.quantity||0}"></div><div class="form-group"><label>Min Stock Level</label><input name="minStock" type="number" min="0" value="${a.minStock||1}"></div><div class="form-group"><label>Cost ($)</label><input name="cost" type="number" step="0.01" min="0" value="${a.cost||0}"></div><div class="form-group"><label>Sale Price ($)</label><input name="salePrice" type="number" step="0.01" min="0" value="${a.salePrice||0}"></div><div class="form-section-title">Details</div><div class="form-group"><label>Condition</label><input name="condition" value="${a.condition||'Good'}" placeholder="Good / New / Tested"></div><div class="form-group"><label>Location / Bin</label><input name="location" value="${a.location||''}" placeholder="Bin B-1"></div><div class="form-group full"><label>Notes</label><textarea name="notes">${a.notes||''}</textarea></div>${devices.length?`<div class="form-group full"><label>Linked Devices</label><div class="linked-list">${deviceChecks||'<span style="color:var(--text-muted);font-size:0.8rem;padding:4px">No devices yet</span>'}</div></div>`:''}</div><div class="form-actions"><button class="btn btn-ghost" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="saveAccessoryForm('${mode}','${id}')"><i class="fas fa-save"></i> ${isEdit?'Save Changes':'Add Accessory'}</button></div></form>`;
}

function buildMarkSoldForm(d){
  const today=new Date().toISOString().split('T')[0];
  return `<form id="soldForm" onsubmit="return false"><p style="color:var(--text-muted);font-size:0.82rem;margin-bottom:20px">Marking <strong style="color:var(--text)">${d.title}</strong> (${d.sku}) as sold.</p><div class="form-grid"><div class="form-group"><label>Sold Price ($) *</label><input name="soldPrice" type="number" step="0.01" min="0" placeholder="${d.salePrice||''}" required></div><div class="form-group"><label>Date Sold</label><input name="dateSold" type="date" value="${today}"></div><div class="form-group"><label>Platform</label><select name="platform"><option value="">— Select —</option>${SALE_PLATFORMS.map(p=>`<option>${p}</option>`).join('')}</select></div><div class="form-group"><label>Buyer Name</label><input name="buyer" placeholder="Optional"></div><div class="form-group full"><label>Tracking Number</label><input name="trackingNumber" placeholder="Optional"></div></div><div style="background:rgba(0,200,100,0.06);border:1px solid rgba(0,200,100,0.15);border-radius:var(--radius-sm);padding:12px;margin-top:12px;font-size:0.78rem;color:var(--text-muted)"><i class="fas fa-info-circle" style="color:var(--success)"></i> Cost: <strong style="color:var(--text)">$${fmt(d.cost)}</strong> &nbsp;·&nbsp; List: <strong style="color:var(--text)">$${fmt(d.salePrice)}</strong></div><div class="form-actions"><button class="btn btn-ghost" onclick="closeModal()">Cancel</button><button class="btn btn-success" onclick="saveMarkSold('${d.id}')"><i class="fas fa-handshake"></i> Mark as Sold</button></div></form>`;
}

function toggleSaleFields(sel){document.getElementById('saleFieldsGroup').style.display=['Sold','Shipped'].includes(sel.value)?'':'none';}

function openModal(title,html){el('modalTitle').textContent=title;el('modalBody').innerHTML=html;el('modalOverlay').classList.add('open');el('modal').classList.add('open');document.body.style.overflow='hidden';setTimeout(()=>{const first=el('modalBody').querySelector('input,select,textarea');if(first)first.focus();},100);}
function closeModal(){el('modalOverlay').classList.remove('open');el('modal').classList.remove('open');document.body.style.overflow='';}
function confirmDelete(type,id,name){el('confirmTitle').textContent='Delete '+(type==='device'?'Device':'Accessory');el('confirmMsg').textContent=`Are you sure you want to delete "${name}"? This cannot be undone.`;el('confirmOverlay').classList.add('open');el('confirmModal').classList.add('open');confirmCallback=()=>{if(type==='device')deleteDevice(id);else deleteAccessory(id);};}
function closeConfirm(){el('confirmOverlay').classList.remove('open');el('confirmModal').classList.remove('open');confirmCallback=null;}

function fmt(n){const num=parseFloat(n)||0;return num.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});}
function fmtDate(dateStr){if(!dateStr)return'—';const d=new Date(dateStr+'T00:00:00');return d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});}
function statusBadge(status){const map={'Available':'badge-available','Listed Online':'badge-listed','Listed on Facebook':'badge-facebook','Sold':'badge-sold','Shipped':'badge-shipped','Returned':'badge-returned','Archived':'badge-archived','For Parts':'badge-parts'};return`<span class="badge ${map[status]||'badge-archived'}">${status}</span>`;}
function condBadge(cond){const map={'Grade A':'badge-grade-a','Grade B':'badge-grade-b','Grade C':'badge-grade-c','For Parts':'badge-for-parts'};return`<span class="badge ${map[cond]||'badge-archived'}">${cond||'—'}</span>`;}
function stockBadge(a){if(a.quantity===0)return`<span class="badge badge-out">Out of Stock</span>`;if(a.quantity<=a.minStock)return`<span class="badge badge-low-stock">Low Stock</span>`;return`<span class="badge badge-in-stock">In Stock</span>`;}
function toast(msg,type='success'){const t=document.createElement('div');t.className=`toast toast-${type}`;t.innerHTML=`<i class="fas ${type==='success'?'fa-circle-check':'fa-circle-exclamation'}"></i> ${msg}`;document.body.appendChild(t);setTimeout(()=>t.remove(),3100);}
function printReport(section){navigateTo(section);setTimeout(()=>window.print(),300);}
function exportData(){const data={exportDate:new Date().toISOString(),version:'1.0',devices:getDevices(),accessories:getAccessories()};const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='nll-inventory-'+new Date().toISOString().split('T')[0]+'.json';a.click();URL.revokeObjectURL(url);toast('Inventory exported as JSON');}

document.addEventListener('DOMContentLoaded',()=>{
  loadSampleData();
  buildCategoryPillsReal();
  document.querySelectorAll('.nav-item[data-section]').forEach(item=>{
    item.addEventListener('click',e=>{e.preventDefault();navigateTo(item.dataset.section);});
  });
  el('confirmOkBtn').addEventListener('click',()=>{if(confirmCallback)confirmCallback();closeConfirm();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal();closeConfirm();}});
  navigateTo('dashboard');
});