const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Veritabanı bağlantısı
const db = new sqlite3.Database('./aquads.db', (err) => {
    if (err) {
        console.error('Veritabanı bağlantı hatası:', err.message);
    } else {
        console.log('✅ SQLite veritabanına bağlanıldı.');
        initializeDatabase();
    }
});

// Veritabanı tabloları oluşturma
function initializeDatabase() {
    // Paket seçimleri tablosu
    db.run(`
        CREATE TABLE IF NOT EXISTS package_selections (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            package_name TEXT NOT NULL,
            customer_name TEXT,
            email TEXT,
            phone TEXT,
            company TEXT,
            message TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Tablo oluşturma hatası:', err.message);
        } else {
            console.log('✅ package_selections tablosu hazır.');
        }
    });

    // Strateji önerileri tablosu
    db.run(`
        CREATE TABLE IF NOT EXISTS strategy_recommendations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sector TEXT NOT NULL,
            audience TEXT NOT NULL,
            budget TEXT NOT NULL,
            recommended_package TEXT,
            score INTEGER,
            roi TEXT,
            duration TEXT,
            customer_name TEXT,
            email TEXT,
            phone TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Tablo oluşturma hatası:', err.message);
        } else {
            console.log('✅ strategy_recommendations tablosu hazır.');
        }
    });

    // İletişim formları tablosu
    db.run(`
        CREATE TABLE IF NOT EXISTS contact_forms (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            company TEXT,
            message TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Tablo oluşturma hatası:', err.message);
        } else {
            console.log('✅ contact_forms tablosu hazır.');
        }
    });
}

// ========== API ENDPOINT'LERİ ==========

// 1. Paket seçimi kaydetme
app.post('/api/select-package', (req, res) => {
    const { package_name, customer_name, email, phone, company, message } = req.body;

    if (!package_name) {
        return res.status(400).json({ 
            success: false, 
            message: 'Paket adı gerekli!' 
        });
    }

    const query = `
        INSERT INTO package_selections (package_name, customer_name, email, phone, company, message)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.run(query, [package_name, customer_name, email, phone, company, message], function(err) {
        if (err) {
            console.error('Kayıt hatası:', err.message);
            return res.status(500).json({ 
                success: false, 
                message: 'Veritabanı hatası!' 
            });
        }

        res.json({ 
            success: true, 
            message: 'Paket seçiminiz başarıyla kaydedildi!',
            id: this.lastID 
        });
    });
});

// 2. Strateji önerisi kaydetme
app.post('/api/save-recommendation', (req, res) => {
    const { 
        sector, 
        audience, 
        budget, 
        recommended_package, 
        score, 
        roi, 
        duration,
        customer_name,
        email,
        phone 
    } = req.body;

    if (!sector || !audience || !budget) {
        return res.status(400).json({ 
            success: false, 
            message: 'Sektör, hedef kitle ve bütçe bilgileri gerekli!' 
        });
    }

    const query = `
        INSERT INTO strategy_recommendations 
        (sector, audience, budget, recommended_package, score, roi, duration, customer_name, email, phone)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(query, [
        sector, audience, budget, recommended_package, 
        score, roi, duration, customer_name, email, phone
    ], function(err) {
        if (err) {
            console.error('Kayıt hatası:', err.message);
            return res.status(500).json({ 
                success: false, 
                message: 'Veritabanı hatası!' 
            });
        }

        res.json({ 
            success: true, 
            message: 'Strateji öneriniz kaydedildi!',
            id: this.lastID 
        });
    });
});

// 3. İletişim formu kaydetme
app.post('/api/contact', (req, res) => {
    const { name, email, phone, company, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ 
            success: false, 
            message: 'İsim, email ve mesaj alanları zorunludur!' 
        });
    }

    const query = `
        INSERT INTO contact_forms (name, email, phone, company, message)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.run(query, [name, email, phone, company, message], function(err) {
        if (err) {
            console.error('Kayıt hatası:', err.message);
            return res.status(500).json({ 
                success: false, 
                message: 'Veritabanı hatası!' 
            });
        }

        res.json({ 
            success: true, 
            message: 'Mesajınız başarıyla gönderildi!',
            id: this.lastID 
        });
    });
});

// 4. Tüm paket seçimlerini getir (Admin)
app.get('/api/admin/packages', (req, res) => {
    db.all('SELECT * FROM package_selections ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
            console.error('Veri çekme hatası:', err.message);
            return res.status(500).json({ 
                success: false, 
                message: 'Veritabanı hatası!' 
            });
        }
        res.json({ success: true, data: rows });
    });
});

// 5. Tüm strateji önerilerini getir (Admin)
app.get('/api/admin/recommendations', (req, res) => {
    db.all('SELECT * FROM strategy_recommendations ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
            console.error('Veri çekme hatası:', err.message);
            return res.status(500).json({ 
                success: false, 
                message: 'Veritabanı hatası!' 
            });
        }
        res.json({ success: true, data: rows });
    });
});

// 6. Tüm iletişim formlarını getir (Admin)
app.get('/api/admin/contacts', (req, res) => {
    db.all('SELECT * FROM contact_forms ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
            console.error('Veri çekme hatası:', err.message);
            return res.status(500).json({ 
                success: false, 
                message: 'Veritabanı hatası!' 
            });
        }
        res.json({ success: true, data: rows });
    });
});

// 7. İstatistikler (Admin Dashboard)
app.get('/api/admin/stats', (req, res) => {
    const stats = {
        totalPackages: 0,
        totalRecommendations: 0,
        totalContacts: 0
    };

    db.get('SELECT COUNT(*) as count FROM package_selections', [], (err, row) => {
        if (!err) stats.totalPackages = row.count;

        db.get('SELECT COUNT(*) as count FROM strategy_recommendations', [], (err, row) => {
            if (!err) stats.totalRecommendations = row.count;

            db.get('SELECT COUNT(*) as count FROM contact_forms', [], (err, row) => {
                if (!err) stats.totalContacts = row.count;
                res.json({ success: true, stats });
            });
        });
    });
});

// Sunucu başlatma
app.listen(PORT, () => {
    console.log(`🚀 Sunucu http://localhost:${PORT} adresinde çalışıyor...`);
    console.log(`📊 Admin Panel: http://localhost:${PORT}/admin.html`);
});

// Uygulama kapatılırken veritabanını kapat
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Veritabanı bağlantısı kapatıldı.');
        process.exit(0);
    });
});
