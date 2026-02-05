# PWA Laporan Koramil - Full Stack Application

Aplikasi Progressive Web App (PWA)

## 📁 Struktur File
koramil-pwa/
├── index.html # Frontend PWA
├── sw.js # Service Worker
├── manifest.json # PWA Manifest
├── Code.gs # Google Apps Script Backend
└── README.md # Dokumentasi

## 🚀 Fitur Utama

### Frontend (PWA)
- ✅ Work offline dengan Service Worker
- ✅ Installable sebagai aplikasi native
- ✅ Notifikasi push
- ✅ Background sync
- ✅ IndexedDB untuk penyimpanan offline
- ✅ Responsive design
- ✅ Auto-save & auto-generate

### Backend (Google Apps Script)
- ✅ RESTful API endpoints
- ✅ CRUD operations ke Google Sheets
- ✅ Auto-backup ke Google Drive
- ✅ PDF export
- ✅ User management (basic)
- ✅ Logging system
- ✅ Bulk operations
- ✅ Validation & statistics

## 🔧 Setup

### 1. Frontend (Github Pages)
1. Upload semua file ke repository GitHub
2. Aktifkan GitHub Pages
3. Akses di: `https://[username].github.io/[repo]`

### 2. Backend (Google Apps Script)
1. Buka script.google.com
2. Buat project baru
3. Copy paste `Code.gs`
4. Deploy sebagai Web App
   - Execute as: Me
   - Who has access: Anyone
5. Dapatkan URL Web App
6. Update URL di frontend (index.html baris ~669)

### 3. Konfigurasi Spreadsheet
1. Buat Google Spreadsheet baru
2. Share ke email service account
3. Dapatkan Spreadsheet ID
4. Update di `Code.gs` baris 4

### 4. Konfigurasi Folder Drive
1. Buat folder di Google Drive
2. Share ke email service account
3. Dapatkan Folder ID
4. Update di `Code.gs` baris 5

## 📱 PWA Features

### Installation
1. Buka website di Chrome/Edge
2. Klik "Install" di address bar
3. Atau klik tombol install di prompt

### Offline Mode
- Bekerja tanpa koneksi internet
- Data disimpan di IndexedDB
- Auto-sync saat online kembali

### Background Sync
- Service Worker menangani sync
- Queue system untuk pending reports
- Retry mechanism

## 🔗 API Endpoints

### POST Endpoints
- `/save` - Simpan laporan baru
- `/sync` - Sync dari mobile
- `/bulk` - Bulk import
- `/template` - Simpan template
- `/export` - Export ke PDF
- `/backup` - Buat backup

### GET Endpoints
- `/get` - Ambil laporan
- `/stats` - Statistik
- `/count` - Jumlah laporan
- `/health` - Health check
- `/info` - API info

## 🛡️ Security

### Frontend
- Input validation
- XSS prevention
- Secure localStorage usage
- HTTPS only

### Backend
- API key validation (optional)
- Rate limiting
- Input sanitization
- Activity logging

## 📊 Database Schema

### Google Sheets
- `Timestamp` - Waktu submit
- `Report Date` - Tanggal laporan
- `Report Time` - Waktu laporan
- `Haljol` - Hal penting
- `Top DSPP` - Data personel
- `Nyata` - Personel nyata
- `Kurang` - Kekurangan
- `Siap Ops` - Siap operasi
- `Keterangan` - Detail
- `Kegiatan` - Aktivitas
- `Full Report` - Laporan lengkap
- `Status` - Status data
- `Sync ID` - ID sinkronisasi

## 🔄 Workflow

1. User mengisi form di PWA
2. Data divalidasi di frontend
3. Jika online → langsung save ke Google Sheets
4. Jika offline → simpan ke IndexedDB
5. Service Worker sync saat online
6. Backup otomatis ke Google Drive
7. Notifikasi jika ada error/success

## 🚨 Error Handling

### Frontend
- User-friendly error messages
- Auto-retry mechanism
- Fallback to localStorage
- Progressive enhancement

### Backend
- Try-catch blocks
- Detailed error logging
- Graceful degradation
- Email notifications (optional)

## 📈 Monitoring

### Google Sheets
- Activity log sheet
- Error tracking
- Usage statistics
- Backup logs

### Google Analytics (optional)
- Page views
- User interactions
- Performance metrics
- Error tracking

## 🔧 Development

### Local Development
1. Clone repository
2. Serve dengan local server
3. Test dengan ngrok untuk PWA features

### Testing
- Unit tests untuk fungsi utama
- Integration tests untuk API
- PWA testing dengan Lighthouse
- Cross-browser testing

### Deployment
1. Update version di Service Worker
2. Update manifest jika diperlukan
3. Deploy backend scripts
4. Update frontend URLs
5. Test semua fitur

## 📞 Support

### Issues
1. Check error logs di Google Sheets
2. Check console di browser
3. Check Network tab untuk API calls
4. Check Application tab untuk PWA

### Debugging
- `chrome://serviceworker-internals`
- `chrome://inspect/#service-workers`
- Google Apps Script logs
- Browser developer tools

## 📄 License

Internal use only - Koramil 1609-05/Sukasada

## 🎯 Roadmap

### Phase 1 (Current)
- Basic PWA functionality
- Google Sheets integration
- Offline support
- Basic reporting

### Phase 2 (Next)
- User authentication
- Advanced analytics
- Report templates
- Batch operations

### Phase 3 (Future)
- Mobile apps (React Native)
- Real-time collaboration
- AI-powered suggestions
- Integration with other systems

Ringkasan Fitur:
✅ 1. PWA Lengkap:
Service Worker untuk offline
Installable sebagai aplikasi
Push notifications
Background sync
IndexedDB storage
✅ 2. Backend Komprehensif:
11 API endpoints lengkap
Auto-backup sistem
PDF export
User management
Logging & monitoring
Bulk operations
Validation & statistics

✅ 3. Fitur Frontend:
Tombol hybrid 1-click
Unlimited kegiatan items
Auto-generate & auto-save
History & templates
Offline-first design
Progressive enhancement

✅ 4. Developer-Friendly:
API dokumentasi lengkap
Error handling robust
Testing endpoints
Setup script
Monitoring tools
Cara Deploy:
Frontend: Upload ke GitHub Pages
Backend: Deploy Google Apps Script sebagai Web App
Spreadsheet: Buat Google Sheet & dapatkan ID
Drive Folder Buat folder backup & dapatkan ID
Sistem ini siap production dengan architecture yang scalable dan maintainable!
