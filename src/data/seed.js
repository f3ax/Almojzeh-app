const today = new Date();
const fmt = (d) => d.toISOString().split('T')[0];
const daysAgo = (n) => { const d = new Date(today); d.setDate(d.getDate() - n); return d; };
const daysFromNow = (n) => { const d = new Date(today); d.setDate(d.getDate() + n); return d; };

export const seedUsers = [
  { id: 'u1', name: 'أحمد المدير', nameEn: 'Ahmad Admin', username: 'admin', password: 'demo123', role: 'admin', phone: '0791234567', lang: 'ar', createdAt: fmt(daysAgo(90)) },
  { id: 'u2', name: 'خالد الفني', nameEn: 'Khaled Tech', username: 'tech1', password: 'demo123', role: 'employee', phone: '0797654321', lang: 'ar', createdAt: fmt(daysAgo(60)) },
  { id: 'u3', name: 'سامي الفني', nameEn: 'Sami Tech', username: 'tech2', password: 'demo123', role: 'employee', phone: '0791112233', lang: 'ar', createdAt: fmt(daysAgo(45)) },
  { id: 'u4', name: 'محمد العميل', nameEn: 'Mohammad Customer', username: 'customer1', password: 'demo123', role: 'customer', email: 'mohammad@example.com', phone: '0795556677', lang: 'ar', createdAt: fmt(daysAgo(30)) },
];

export const seedCustomers = [
  { id: 'c1', userId: 'u4', companyName: 'مطعم الريم', contactName: 'محمد العميل', phone: '0795556677', email: 'mohammad@example.com', address: 'عمان - شارع المدينة المنورة', notes: '', createdAt: fmt(daysAgo(30)) },
  { id: 'c2', userId: null, companyName: 'فندق القدس', contactName: 'عمر حسين', phone: '0796667788', email: 'omar@example.com', address: 'عمان - الدوار الخامس', notes: 'عقد سنوي', createdAt: fmt(daysAgo(25)) },
  { id: 'c3', userId: null, companyName: null, contactName: 'فاطمة أحمد', phone: '0792223344', email: '', address: 'إربد - شارع الجامعة', notes: 'منزل سكني', createdAt: fmt(daysAgo(15)) },
];

export const seedSites = [
  { id: 's1', customerId: 'c1', name: 'المطبخ الرئيسي', address: 'عمان - شارع المدينة المنورة', barcode: 'ALM-S001', type: 'commercial', notes: '', createdAt: fmt(daysAgo(30)) },
  { id: 's2', customerId: 'c1', name: 'مخزن المواد', address: 'عمان - شارع المدينة المنورة', barcode: 'ALM-S002', type: 'commercial', notes: 'يحتاج فحص شهري', createdAt: fmt(daysAgo(28)) },
  { id: 's3', customerId: 'c2', name: 'الطابق الأرضي', address: 'عمان - الدوار الخامس', barcode: 'ALM-S003', type: 'commercial', notes: '', createdAt: fmt(daysAgo(25)) },
  { id: 's4', customerId: 'c2', name: 'المطبخ المركزي', address: 'عمان - الدوار الخامس', barcode: 'ALM-S004', type: 'commercial', notes: '', createdAt: fmt(daysAgo(25)) },
  { id: 's5', customerId: 'c3', name: 'المنزل', address: 'إربد - شارع الجامعة', barcode: 'ALM-S005', type: 'residential', notes: '', createdAt: fmt(daysAgo(15)) },
];

export const seedJobs = [
  { id: 'j1', siteId: 's1', customerId: 'c1', employeeId: 'u2', scheduledDate: fmt(daysAgo(28)), scheduledTime: '09:00', status: 'completed', type: 'inspection', notes: 'فحص أولي', completedAt: fmt(daysAgo(28)), createdAt: fmt(daysAgo(30)) },
  { id: 'j2', siteId: 's1', customerId: 'c1', employeeId: 'u2', scheduledDate: fmt(daysAgo(21)), scheduledTime: '10:00', status: 'completed', type: 'treatment', notes: 'رش مبيدات', completedAt: fmt(daysAgo(21)), createdAt: fmt(daysAgo(25)) },
  { id: 'j3', siteId: 's2', customerId: 'c1', employeeId: 'u3', scheduledDate: fmt(daysAgo(20)), scheduledTime: '11:00', status: 'completed', type: 'inspection', notes: '', completedAt: fmt(daysAgo(20)), createdAt: fmt(daysAgo(22)) },
  { id: 'j4', siteId: 's3', customerId: 'c2', employeeId: 'u2', scheduledDate: fmt(daysAgo(14)), scheduledTime: '09:00', status: 'completed', type: 'inspection', notes: 'فحص شامل للطابق الأرضي', completedAt: fmt(daysAgo(14)), createdAt: fmt(daysAgo(20)) },
  { id: 'j5', siteId: 's4', customerId: 'c2', employeeId: 'u3', scheduledDate: fmt(daysAgo(14)), scheduledTime: '11:00', status: 'completed', type: 'treatment', notes: '', completedAt: fmt(daysAgo(14)), createdAt: fmt(daysAgo(18)) },
  { id: 'j6', siteId: 's5', customerId: 'c3', employeeId: 'u2', scheduledDate: fmt(daysAgo(7)), scheduledTime: '10:00', status: 'completed', type: 'inspection', notes: 'فحص منزلي', completedAt: fmt(daysAgo(7)), createdAt: fmt(daysAgo(10)) },
  { id: 'j7', siteId: 's1', customerId: 'c1', employeeId: 'u2', scheduledDate: fmt(daysAgo(3)), scheduledTime: '09:00', status: 'completed', type: 'follow-up', notes: 'متابعة بعد العلاج', completedAt: fmt(daysAgo(3)), createdAt: fmt(daysAgo(7)) },
  { id: 'j8', siteId: 's3', customerId: 'c2', employeeId: 'u3', scheduledDate: fmt(today), scheduledTime: '10:00', status: 'in-progress', type: 'treatment', notes: '', completedAt: null, createdAt: fmt(daysAgo(5)) },
  { id: 'j9', siteId: 's5', customerId: 'c3', employeeId: 'u2', scheduledDate: fmt(daysFromNow(2)), scheduledTime: '09:00', status: 'scheduled', type: 'treatment', notes: 'جلسة علاج أولى', completedAt: null, createdAt: fmt(daysAgo(3)) },
  { id: 'j10', siteId: 's2', customerId: 'c1', employeeId: 'u3', scheduledDate: fmt(daysFromNow(5)), scheduledTime: '11:00', status: 'scheduled', type: 'follow-up', notes: '', completedAt: null, createdAt: fmt(daysAgo(1)) },
];

export const seedChecklists = [
  {
    id: 'cl1', jobId: 'j1', siteId: 's1', completedBy: 'u2', completedAt: fmt(daysAgo(28)),
    items: [
      { id: 'cli1', key: 'perimeter', checked: true, notes: 'لا توجد مشاكل' },
      { id: 'cli2', key: 'kitchen', checked: true, notes: 'تم العثور على صراصير' },
      { id: 'cli3', key: 'bathroom', checked: true, notes: '' },
      { id: 'cli4', key: 'storage', checked: true, notes: 'رطوبة عالية' },
      { id: 'cli5', key: 'gelBait', checked: false, notes: '' },
      { id: 'cli6', key: 'traps', checked: true, notes: 'تم نصب 5 مصائد' },
      { id: 'cli7', key: 'spray', checked: false, notes: '' },
      { id: 'cli8', key: 'safety', checked: true, notes: '' },
      { id: 'cli9', key: 'customerInformed', checked: true, notes: 'تم إبلاغ صاحب المطعم' },
    ],
  },
  {
    id: 'cl2', jobId: 'j2', siteId: 's1', completedBy: 'u2', completedAt: fmt(daysAgo(21)),
    items: [
      { id: 'cli10', key: 'perimeter', checked: true, notes: '' },
      { id: 'cli11', key: 'kitchen', checked: true, notes: 'تحسن ملحوظ' },
      { id: 'cli12', key: 'bathroom', checked: true, notes: '' },
      { id: 'cli13', key: 'storage', checked: true, notes: '' },
      { id: 'cli14', key: 'gelBait', checked: true, notes: 'تم التطبيق' },
      { id: 'cli15', key: 'traps', checked: true, notes: 'تم استبدال المصائد' },
      { id: 'cli16', key: 'spray', checked: true, notes: 'رش شامل' },
      { id: 'cli17', key: 'safety', checked: true, notes: '' },
      { id: 'cli18', key: 'customerInformed', checked: true, notes: '' },
    ],
  },
  {
    id: 'cl3', jobId: 'j4', siteId: 's3', completedBy: 'u2', completedAt: fmt(daysAgo(14)),
    items: [
      { id: 'cli19', key: 'perimeter', checked: true, notes: '' },
      { id: 'cli20', key: 'kitchen', checked: true, notes: '' },
      { id: 'cli21', key: 'bathroom', checked: true, notes: 'نظيف' },
      { id: 'cli22', key: 'storage', checked: false, notes: 'لا يوجد مخزن' },
      { id: 'cli23', key: 'gelBait', checked: true, notes: '' },
      { id: 'cli24', key: 'traps', checked: true, notes: '' },
      { id: 'cli25', key: 'spray', checked: true, notes: '' },
      { id: 'cli26', key: 'safety', checked: true, notes: '' },
      { id: 'cli27', key: 'customerInformed', checked: true, notes: '' },
    ],
  },
  {
    id: 'cl4', jobId: 'j6', siteId: 's5', completedBy: 'u2', completedAt: fmt(daysAgo(7)),
    items: [
      { id: 'cli28', key: 'perimeter', checked: true, notes: 'حديقة تحتاج عناية' },
      { id: 'cli29', key: 'kitchen', checked: true, notes: '' },
      { id: 'cli30', key: 'bathroom', checked: true, notes: '' },
      { id: 'cli31', key: 'storage', checked: true, notes: '' },
      { id: 'cli32', key: 'gelBait', checked: false, notes: '' },
      { id: 'cli33', key: 'traps', checked: true, notes: '' },
      { id: 'cli34', key: 'spray', checked: false, notes: '' },
      { id: 'cli35', key: 'safety', checked: true, notes: '' },
      { id: 'cli36', key: 'customerInformed', checked: true, notes: '' },
    ],
  },
  {
    id: 'cl5', jobId: 'j7', siteId: 's1', completedBy: 'u2', completedAt: fmt(daysAgo(3)),
    items: [
      { id: 'cli37', key: 'perimeter', checked: true, notes: '' },
      { id: 'cli38', key: 'kitchen', checked: true, notes: 'لا توجد حشرات' },
      { id: 'cli39', key: 'bathroom', checked: true, notes: '' },
      { id: 'cli40', key: 'storage', checked: true, notes: 'تم إصلاح مشكلة الرطوبة' },
      { id: 'cli41', key: 'gelBait', checked: true, notes: '' },
      { id: 'cli42', key: 'traps', checked: true, notes: 'المصائد نظيفة' },
      { id: 'cli43', key: 'spray', checked: false, notes: 'لا حاجة للرش' },
      { id: 'cli44', key: 'safety', checked: true, notes: '' },
      { id: 'cli45', key: 'customerInformed', checked: true, notes: 'العميل راضٍ' },
    ],
  },
];

export const seedInvoices = [
  { id: 'inv1', customerId: 'c1', jobId: 'j1', amount: 50, currency: 'JOD', status: 'paid', dueDate: fmt(daysAgo(21)), paidDate: fmt(daysAgo(22)), notes: '', createdAt: fmt(daysAgo(28)) },
  { id: 'inv2', customerId: 'c1', jobId: 'j2', amount: 120, currency: 'JOD', status: 'paid', dueDate: fmt(daysAgo(14)), paidDate: fmt(daysAgo(15)), notes: '', createdAt: fmt(daysAgo(21)) },
  { id: 'inv3', customerId: 'c1', jobId: 'j3', amount: 50, currency: 'JOD', status: 'paid', dueDate: fmt(daysAgo(13)), paidDate: fmt(daysAgo(13)), notes: '', createdAt: fmt(daysAgo(20)) },
  { id: 'inv4', customerId: 'c2', jobId: 'j4', amount: 200, currency: 'JOD', status: 'paid', dueDate: fmt(daysAgo(7)), paidDate: fmt(daysAgo(8)), notes: 'فحص شامل', createdAt: fmt(daysAgo(14)) },
  { id: 'inv5', customerId: 'c2', jobId: 'j5', amount: 150, currency: 'JOD', status: 'pending', dueDate: fmt(daysAgo(1)), paidDate: null, notes: '', createdAt: fmt(daysAgo(14)) },
  { id: 'inv6', customerId: 'c3', jobId: 'j6', amount: 75, currency: 'JOD', status: 'pending', dueDate: fmt(daysFromNow(3)), paidDate: null, notes: '', createdAt: fmt(daysAgo(7)) },
  { id: 'inv7', customerId: 'c1', jobId: 'j7', amount: 40, currency: 'JOD', status: 'pending', dueDate: fmt(daysFromNow(7)), paidDate: null, notes: 'متابعة', createdAt: fmt(daysAgo(3)) },
];

export const seedImages = [
  { id: 'img1', jobId: 'j1', uploadedBy: 'u2', caption: 'صراصير في المطبخ', uploadedAt: fmt(daysAgo(28)) },
  { id: 'img2', jobId: 'j2', uploadedBy: 'u2', caption: 'بعد الرش', uploadedAt: fmt(daysAgo(21)) },
  { id: 'img3', jobId: 'j4', uploadedBy: 'u2', caption: 'الطابق الأرضي - نظيف', uploadedAt: fmt(daysAgo(14)) },
  { id: 'img4', jobId: 'j6', uploadedBy: 'u2', caption: 'حديقة المنزل', uploadedAt: fmt(daysAgo(7)) },
  { id: 'img5', jobId: 'j7', uploadedBy: 'u2', caption: 'فحص المتابعة - ممتاز', uploadedAt: fmt(daysAgo(3)) },
];

export function loadSeedData() {
  const isSeeded = localStorage.getItem('almojzeh_seeded');
  if (isSeeded) return;

  localStorage.setItem('almojzeh_users', JSON.stringify(seedUsers));
  localStorage.setItem('almojzeh_customers', JSON.stringify(seedCustomers));
  localStorage.setItem('almojzeh_sites', JSON.stringify(seedSites));
  localStorage.setItem('almojzeh_jobs', JSON.stringify(seedJobs));
  localStorage.setItem('almojzeh_checklists', JSON.stringify(seedChecklists));
  localStorage.setItem('almojzeh_invoices', JSON.stringify(seedInvoices));
  localStorage.setItem('almojzeh_images', JSON.stringify(seedImages));
  localStorage.setItem('almojzeh_seeded', 'true');
}
