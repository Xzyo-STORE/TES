// ==========================================
// CONFIG FIREBASE (Gaya Compat)
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyAOU2RNedLbO5QpKm9gEHF7KQC9XFACMdc",
    authDomain: "xzyo-s.firebaseapp.com",
    databaseURL: "https://xzyo-s-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "xzyo-s", 
    storageBucket: "xzyo-s.firebasestorage.app",
    messagingSenderId: "949339875672", 
    appId: "1:949339875672:web:b5d751452bf5875a445d2d"
};

// Inisialisasi
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ==========================================
// DATA MENU FRUIT & GAMEPASS
// ==========================================
const MENU_FRUIT = [
    { n: "🍎 PERMANENT FRUIT (VIA GIFT)", header: true },
    { n: "✦ Dragon", p: 480000 },
    { n: "✦ Kitsune", p: 390000 },
    { n: "✦ Leopard", p: 300000 },
    { n: "✦ Dough", p: 246000 },
    { n: "✦ Buddha", p: 178000 },
    { n: "✦ Magma", p: 147000 },
    { n: "✦ Light", p: 130000 },
    { n: "✦ Ice", p: 90000 },
    
    { n: "🎁 GAMEPASS (VIA GIFT)", header: true },
    { n: "✦ Fruit Notifier", p: 280000 },
    { n: "✦ Dark Blade", p: 125000 },
    { n: "✦ 2x Mastery", p: 50000 },
    { n: "✦ 2x Money", p: 50000 },
    { n: "✦ Fruit Storage", p: 45000 },
    { n: "✦ Fast Boat", p: 45000 }
];

let cart = {}; 
let selectedPay = "", currentTid = "", discount = 0;

// 1. Munculkan Daftar ke HTML
function init() {
    const box = document.getElementById('joki-list');
    if(!box) return;
    box.innerHTML = ""; 

    MENU_FRUIT.forEach((item, index) => {
        if (item.header) {
            box.innerHTML += `<div class="item-header" style="background:#1c2128; color:#00d2ff; padding:10px; margin-top:15px; font-weight:800; border-radius:12px; text-align:center; font-size:12px; border: 1px solid #30363d;">${item.n}</div>`;
        } else {
            box.innerHTML += `
            <div class="item-joki-cart" id="item-${index}" style="display:flex; justify-content:space-between; align-items:center; padding:12px; background:rgba(255,255,255,0.02); margin-bottom:8px; border-radius:15px; border:1px solid #30363d;">
                <div style="flex:1">
                    <div style="font-weight:600; font-size:14px; color:white;">${item.n}</div>
                    <div style="color:#00d2ff; font-size:12px; font-weight:800;">Rp ${item.p.toLocaleString()}</div>
                </div>
                <div style="display:flex; align-items:center; gap:10px;">
                    <button onclick="updateCart(${index}, -1)" class="btn-vouch" style="padding: 5px 12px;">-</button>
                    <span id="qty-${index}" style="font-weight:800; min-width:15px; text-align:center; color:white;">0</span>
                    <button onclick="updateCart(${index}, 1)" class="btn-vouch" style="padding: 5px 12px; background:#00d2ff; color:black;">+</button>
                </div>
            </div>`;
        }
    });
}

// 2. Update Keranjang
function updateCart(index, delta) {
    if (!cart[index]) cart[index] = 0;
    cart[index] += delta;
    if (cart[index] < 0) cart[index] = 0;

    document.getElementById(`qty-${index}`).innerText = cart[index];
    const el = document.getElementById(`item-${index}`);
    if(el) {
        el.style.borderColor = cart[index] > 0 ? "#00d2ff" : "#30363d";
        el.style.background = cart[index] > 0 ? "rgba(0, 210, 255, 0.05)" : "rgba(255,255,255,0.02)";
    }
    hitung();
}

// 3. Hitung Total & Validasi
function hitung() {
    let txt = ""; let subtotal = 0;
    MENU_FRUIT.forEach((item, index) => {
        if (cart[index] > 0) {
            txt += `${item.n} (${cart[index]}x), `;
            subtotal += (item.p * cart[index]);
        }
    });
    let finalTotal = subtotal - (subtotal * discount);
    document.getElementById('detailText').value = txt.slice(0, -2);
    document.getElementById('totalAkhir').innerText = "Rp " + finalTotal.toLocaleString();
    validasi();
}

// 4. Pilih Pembayaran
function selectPay(m, el) {
    selectedPay = m;
    document.querySelectorAll('.pay-bar').forEach(p => p.classList.remove('selected'));
    el.classList.add('selected');
    validasi();
}

// 5. Validasi Tombol
function validasi() {
    const u = document.getElementById('userRoblox').value.trim();
    const w = document.getElementById('waUser').value.trim();
    const hasItems = Object.values(cart).some(q => q > 0);
    document.getElementById('btnGas').disabled = !(u && w && hasItems && selectedPay);
}

// 6. Proses Pesanan
async function prosesPesanan() {
    const loader = document.getElementById('loading-overlay');
    loader.style.display = 'flex';

    currentTid = "XZY-FRUIT-" + Math.floor(Math.random()*900000+100000);
    const u = document.getElementById('userRoblox').value.trim();
    
    let w = document.getElementById('waUser').value.trim();
    if (w.startsWith('0')) w = '62' + w.substring(1);

    const itm = document.getElementById('detailText').value;
    const tot = document.getElementById('totalAkhir').innerText;

    try {
        // Simpan ke Firebase
        await db.ref('orders/' + currentTid).set({
            tid: currentTid,
            status: "pending",
            category: "GAMEPASS/FRUIT",
            user: u,
            wa: w,
            items: itm,
            total: tot,
            method: selectedPay,
            timestamp: Date.now()
        });

        // Kirim Telegram
        const token = "8733004732:AAHB1f_BfXMOZt_EDWGNMNBDTSjcC5YzxMY";
        const chatid = "8262559652";
        const pesan = `🍎 *PESANAN GAMEPASS/FRUIT*%0AID: ${currentTid}%0AUser: ${u}%0AWA: ${w}%0AItems: ${itm}%0ATotal: ${tot}%0AMetode: ${selectedPay}`;
        fetch(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatid}&text=${pesan}&parse_mode=Markdown`);

        setTimeout(() => {
            loader.style.display = 'none';
            switchSlide(1, 2);
            document.getElementById('displayTid').innerText = currentTid;
            document.getElementById('payNominal').innerText = tot;
            document.getElementById('payMethodInfo').innerText = selectedPay;

            const qrisBox = document.getElementById('qris-display');
            if (selectedPay === "QRIS") {
                document.getElementById('gambar-qris').src = "https://i.ibb.co.com/Y4bRyxjc/IMG-20260227-021950.png";
                qrisBox.style.display = "block";
            } else {
                qrisBox.style.display = "none";
            }
        }, 1500);

        // Pantau Status Approve Admin
        db.ref('orders/' + currentTid + '/status').on('value', snap => {
            if(snap.val() === 's') {
                switchSlide(2, 3);
                document.getElementById('res-id').innerText = currentTid;
                document.getElementById('res-user').innerText = u;
                document.getElementById('res-item').innerText = itm;
                document.getElementById('res-total').innerText = tot;
            }
        });

    } catch (err) {
        loader.style.display = 'none';
        alert("Gagal Terhubung ke Database!");
    }
}

// 7. Slide Switcher
function switchSlide(from, to) {
    document.getElementById('slide-' + from).classList.remove('active');
    setTimeout(() => { 
        document.getElementById('slide-' + to).classList.add('active'); 
        window.scrollTo(0,0);
    }, 150);
}

// 8. Voucher
function applyVoucher() {
    const code = document.getElementById('vouchCode').value.toUpperCase();
    if (code === "XZYOFRUIT") {
        discount = 0.10;
        alert("✅ Diskon 10% Berhasil!");
    } else {
        discount = 0;
        alert("❌ Kode Salah!");
    }
    hitung();
}

window.onload = init;
