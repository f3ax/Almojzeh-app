const getCollection = (key) => JSON.parse(localStorage.getItem(`almojzeh_${key}`) || '[]');
const setCollection = (key, data) => localStorage.setItem(`almojzeh_${key}`, JSON.stringify(data));
const generateId = () => Math.random().toString(36).substring(2, 10);
const today = () => new Date().toISOString().split('T')[0];

// --- Users ---
export function getUsers() { return getCollection('users'); }
export function getUserById(id) { return getUsers().find(u => u.id === id); }
export function getUserByUsername(username) { return getUsers().find(u => u.username === username); }
export function createUser(data) {
  const users = getUsers();
  const user = { id: generateId(), ...data, createdAt: today() };
  users.push(user);
  setCollection('users', users);
  return user;
}
export function updateUser(id, data) {
  const users = getUsers().map(u => u.id === id ? { ...u, ...data } : u);
  setCollection('users', users);
  return users.find(u => u.id === id);
}
export function deleteUser(id) {
  setCollection('users', getUsers().filter(u => u.id !== id));
}

// --- Auth ---
export function authenticate(username, password) {
  const user = getUsers().find(u => u.username === username && u.password === password);
  if (user) {
    localStorage.setItem('almojzeh_currentUser', JSON.stringify(user));
    return user;
  }
  return null;
}
export function getCurrentUser() {
  const data = localStorage.getItem('almojzeh_currentUser');
  return data ? JSON.parse(data) : null;
}
export function logout() {
  localStorage.removeItem('almojzeh_currentUser');
}

// --- Customers ---
export function getCustomers() { return getCollection('customers'); }
export function getCustomerById(id) { return getCustomers().find(c => c.id === id); }
export function getCustomerByUserId(userId) { return getCustomers().find(c => c.userId === userId); }
export function createCustomer(data) {
  const customers = getCustomers();
  const customer = { id: generateId(), ...data, createdAt: today() };
  customers.push(customer);
  setCollection('customers', customers);
  return customer;
}
export function updateCustomer(id, data) {
  const customers = getCustomers().map(c => c.id === id ? { ...c, ...data } : c);
  setCollection('customers', customers);
  return customers.find(c => c.id === id);
}
export function deleteCustomer(id) {
  setCollection('customers', getCustomers().filter(c => c.id !== id));
}

// --- Sites ---
export function getSites() { return getCollection('sites'); }
export function getSiteById(id) { return getSites().find(s => s.id === id); }
export function getSiteByBarcode(barcode) { return getSites().find(s => s.barcode === barcode); }
export function getSitesByCustomerId(customerId) { return getSites().filter(s => s.customerId === customerId); }
export function createSite(data) {
  const sites = getSites();
  const site = { id: generateId(), ...data, barcode: data.barcode || `ALM-${generateId().toUpperCase().slice(0,5)}`, createdAt: today() };
  sites.push(site);
  setCollection('sites', sites);
  return site;
}
export function updateSite(id, data) {
  const sites = getSites().map(s => s.id === id ? { ...s, ...data } : s);
  setCollection('sites', sites);
  return sites.find(s => s.id === id);
}
export function deleteSite(id) {
  setCollection('sites', getSites().filter(s => s.id !== id));
}

// --- Jobs ---
export function getJobs() { return getCollection('jobs'); }
export function getJobById(id) { return getJobs().find(j => j.id === id); }
export function getJobsByCustomerId(customerId) { return getJobs().filter(j => j.customerId === customerId); }
export function getJobsByEmployeeId(employeeId) { return getJobs().filter(j => j.employeeId === employeeId); }
export function getJobsBySiteId(siteId) { return getJobs().filter(j => j.siteId === siteId); }
export function createJob(data) {
  const jobs = getJobs();
  const job = { id: generateId(), ...data, status: data.status || 'scheduled', completedAt: null, createdAt: today() };
  jobs.push(job);
  setCollection('jobs', jobs);
  return job;
}
export function updateJob(id, data) {
  const jobs = getJobs().map(j => j.id === id ? { ...j, ...data } : j);
  setCollection('jobs', jobs);
  return jobs.find(j => j.id === id);
}
export function deleteJob(id) {
  setCollection('jobs', getJobs().filter(j => j.id !== id));
}

// --- Checklists ---
export function getChecklists() { return getCollection('checklists'); }
export function getChecklistByJobId(jobId) { return getChecklists().find(c => c.jobId === jobId); }
export function createChecklist(data) {
  const checklists = getChecklists();
  const checklist = { id: generateId(), ...data, completedAt: today() };
  checklists.push(checklist);
  setCollection('checklists', checklists);
  return checklist;
}
export function updateChecklist(id, data) {
  const checklists = getChecklists().map(c => c.id === id ? { ...c, ...data } : c);
  setCollection('checklists', checklists);
  return checklists.find(c => c.id === id);
}

// --- Invoices ---
export function getInvoices() { return getCollection('invoices'); }
export function getInvoiceById(id) { return getInvoices().find(i => i.id === id); }
export function getInvoicesByCustomerId(customerId) { return getInvoices().filter(i => i.customerId === customerId); }
export function createInvoice(data) {
  const invoices = getInvoices();
  const invoice = { id: generateId(), ...data, createdAt: today() };
  invoices.push(invoice);
  setCollection('invoices', invoices);
  return invoice;
}
export function updateInvoice(id, data) {
  const invoices = getInvoices().map(i => i.id === id ? { ...i, ...data } : i);
  setCollection('invoices', invoices);
  return invoices.find(i => i.id === id);
}

// --- Images ---
export function getImages() { return getCollection('images'); }
export function getImagesByJobId(jobId) { return getImages().filter(i => i.jobId === jobId); }
export function createImage(data) {
  const images = getImages();
  const image = { id: generateId(), ...data, uploadedAt: today() };
  images.push(image);
  setCollection('images', images);
  return image;
}
export function deleteImage(id) {
  setCollection('images', getImages().filter(i => i.id !== id));
}

// --- Helpers ---
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
