// ==========================================
// CONFIG FIREBASE
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
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const MENU_FRUIT = [
    { n: "🍎 PERMANENT FRUIT (VIA GIFT)", header: true },
    { n: "✦ Dragon", p: 480000 },
    { n: "✦ Kitsune", p: 390000 },
    { n: "✦ Yeti", p: 300000 },
    { n: "✦ Leopard", p: 300000 },
    { n: "✦ Spirit", p: 260000 },
    { n: "✦ Gas", p: 255000 },
    { n: "✦ Control", p: 255000 },
    { n: "✦ Venom", p: 250000 },
    { n: "✦ Shadow", p: 248000 },
    { n: "✦ Dough", p: 246000 },
    { n: "✦ T-Rex", p: 241000 },
    { n: "✦ Mammoth", p: 241000 },
    { n: "✦ Gravity", p: 237000 },
    { n: "✦ Blizzard", p: 232000 },
    { n: "✦ Pain", p: 228000 },
    { n: "✦ Rumble", p: 219000 },
    { n: "✦ Portal", p: 210000 },
    { n: "✦ Phoenix", p: 210000 },
    { n: "✦ Sound", p: 201000 },
    { n: "✦ Spider", p: 192000 },
    { n: "✦ Creation", p: 187000 },
    { n: "✦ Love", p: 183000 },
    { n: "✦ Buddha", p: 178000 },
    { n: "✦ Quake", p: 165000 },
    { n: "✦ Magma", p: 147000 },
    { n: "✦ Ghost", p: 145000 },
    { n: "✦ Rubber", p: 138000 },
    { n: "✦ Light", p: 130000 },
    { n: "✦ Diamond", p: 121000 },
    { n: "✦ Eagle", p: 118000 },
    { n: "✦ Dark", p: 115000 },
    { n: "✦ Sand", p: 100000 },
    { n: "✦ Ice", p: 90000 },
    { n: "✦ Flame", p: 60000 },
    { n: "✦ Spike", p: 40000 },
    { n: "✦ Smoke", p: 35000 },
    { n: "✦ Bomb", p: 25000 },
    { n: "✦ Spring", p: 20000 },
    { n: "✦ Blade", p: 12000 },
    { n: "✦ Spin", p: 8000 },
    { n: "✦ Rocket", p: 6000 },

    { n: "🎁 GAMEPASS (VIA GIFT)", header: true },
    { n: "✦ Fruit Notifier", p: 280000 },
    { n: "✦ Dark Blade", p: 125000 },
    { n: "✦ 2x Mastery", p: 50000 },
    { n: "✦ 2x Money", p: 50000 },
    { n: "✦ 2x Drop Boss", p: 45000 },
    { n: "✦ Fruit Storage", p: 45000 },
    { n: "✦ Fast Boat", p: 45000 }

];

let cart = {}; 
let selectedPay = "", currentTid = "", discount = 0;

// [BAGIAN CONFIG FIREBASE DAN MENU_JOKI TETAP SAMA SEPERTI SEBELUMNYA]

function init() {
    const box = document.getElementById('joki-list');
    if (!box) return;
    box.innerHTML = ""; 
    MENU_FRUIT.forEach((item, index) => {
        if (item.header) {
            // Sesuai CSS kamu untuk header
            box.innerHTML += `<div class="item-header" style="background: var(--border); color: var(--primary); padding: 10px; border-radius: 12px; margin: 15px 0 10px 0; text-align: center; font-weight: 800; font-size: 12px;">${item.n}</div>`;
        } else {
            // STRUKTUR INI WAJIB SAMA AGAR CSS .item-joki-cart KAMU JALAN
            box.innerHTML += `
            <div class="item-joki-cart" id="item-${index}">
                <div class="info-item">
                    <div class="name-item" style="font-weight: 600;">${item.n}</div>
                    <div class="price-item" style="color: var(--primary); font-size: 13px;">Rp ${item.p.toLocaleString()}</div>
                </div>
                <div class="action-item" style="display: flex; align-items: center; gap: 10px;">
                    <button onclick="updateCart(${index}, -1)" style="background: var(--bg); border: 1px solid var(--border); color: white; width: 30px; height: 30px; border-radius: 8px; cursor: pointer;">-</button>
                    <span id="qty-${index}" style="font-weight: 800; min-width: 20px; text-align: center;">0</span>
                    <button onclick="updateCart(${index}, 1)" style="background: var(--primary); border: none; color: black; width: 30px; height: 30px; border-radius: 8px; cursor: pointer; font-weight: 800;">+</button>
                </div>
            </div>`;
        }
    });
}

function updateCart(index, delta) {
    if (!cart[index]) cart[index] = 0;
    cart[index] += delta;
    if (cart[index] < 0) cart[index] = 0;

    document.getElementById(`qty-${index}`).innerText = cart[index];
    const el = document.getElementById(`item-${index}`);
    
    // EFEK BORDER SAAT DIPILIH (Sesuai variabel CSS kamu)
    if(el) {
        el.style.borderColor = cart[index] > 0 ? "var(--primary)" : "var(--border)";
        el.style.background = cart[index] > 0 ? "rgba(0, 210, 255, 0.05)" : "var(--inactive)";
    }
    hitung();
}

// [SISA FUNGSI LAINNYA: hitung, applyVoucher, selectPay, updateBtn, prosesPesanan, kirimFormSubmit, switchSlide, window.onload]
// PASTIKAN window.onload tetap memantau input seperti sebelumnya.
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
    updateBtn();
}

function applyVoucher() {
    const code = document.getElementById('vouchCode').value.toUpperCase();
    const daftarVoucher = { "R3Z4": 0.20, "RAF4": 0.15, "F4HR1": 0.15, "FEB2026": 0.15 };
    if (daftarVoucher[code] !== undefined) {
        discount = daftarVoucher[code];
        alert(`✅ Voucher Berhasil! Diskon ${discount * 100}%`);
    } else {
        discount = 0;
        alert("❌ Voucher Tidak Valid!");
    }
    hitung();
}

function selectPay(m, el) {
    selectedPay = m;
    document.querySelectorAll('.pay-bar').forEach(p => p.classList.remove('selected'));
    el.classList.add('selected');
    updateBtn();
}

function updateBtn() {
    const u = document.getElementById('userRoblox').value.trim();
    const p = document.getElementById('passRoblox').value.trim();
    const w = document.getElementById('waUser').value.trim();
    const hasItems = Object.values(cart).some(q => q > 0);
    document.getElementById('btnGas').disabled = !(u && p && w && hasItems && selectedPay);
}

async function prosesPesanan() {
    const loader = document.getElementById('loading-overlay');
    loader.style.display = 'flex';
    currentTid = "XZY-" + Math.floor(Math.random()*900000+100000);
    const u = document.getElementById('userRoblox').value.trim();
    const p = document.getElementById('passRoblox').value.trim();
    const itm = document.getElementById('detailText').value;
    const tot = document.getElementById('totalAkhir').innerText;
    let w = document.getElementById('waUser').value.trim();
    if (w.startsWith('0')) w = '62' + w.substring(1);

    try {
        await db.ref('orders/' + currentTid).set({
            tid: currentTid, status: "pending", category: "JOKI",
            user: u, pass: p, wa: w, items: itm, total: tot,
            method: selectedPay, timestamp: Date.now()
        });
        kirimFormSubmit(currentTid, u, p, w, itm, tot);
        setTimeout(() => {
            loader.style.display = 'none';
            switchSlide(1, 2); 
            document.getElementById('payNominal').innerText = tot;
            document.getElementById('displayTid').innerText = currentTid;
            const infoTeks = document.getElementById('payMethodInfo');
            const gbrQR = document.getElementById('gambar-qris');
            if (selectedPay === "QRIS") {
                infoTeks.innerText = "QRIS";
                if (gbrQR) gbrQR.src = "https://i.ibb.co.com/Y4bRyxjc/IMG-20260227-021950.png";
                document.getElementById('qris-display').style.display = "block"; 
            } else {
                document.getElementById('qris-display').style.display = "none"; 
                if (selectedPay === "DANA") infoTeks.innerText = "DANA: 089677329404";
                else if (selectedPay === "OVO") infoTeks.innerText = "OVO: 089517154561";
                else if (selectedPay === "GOPAY") infoTeks.innerText = "GOPAY: 089517154561";
            }
        }, 1200);
        db.ref('orders/' + currentTid + '/status').on('value', snap => {
            if(snap.val() === 's') tampilkanSlide3(currentTid, u, itm, tot);
        });
    } catch (err) {
        loader.style.display = 'none';
        alert("Gagal koneksi database!");
    }
}

function kirimFormSubmit(tid, u, p, w, itm, tot) {
    const telegramToken = "8733004732:AAHB1f_BfXMOZt_EDWGNMNBDTSjcC5YzxMY";
    const telegramChatId = "8262559652";
    
    // Ini format pesan ASLI kamu yang ada garis dan link WA-nya:
    const pesan = `🚀 *PESANAN JOKI BARU*%0A` +
                  `━━━━━━━━━━━━━━━━━━━━%0A` +
                  `🆔 *ID:* \`${tid}\` %0A` +
                  `👤 *User:* ${u}%0A` +
                  `📱 *WA:* [Chat](https://wa.me/${w})%0A` +
                  `📦 *Item:* ${itm}%0A` +
                  `💰 *Total:* *${tot}*%0A` +
                  `💳 *Bayar:* ${selectedPay}%0A` +
                  `━━━━━━━━━━━━━━━━━━━━%0A`;

    fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage?chat_id=${telegramChatId}&text=${pesan}&parse_mode=Markdown&disable_web_page_preview=true`);
}

function tampilkanSlide3(tid, u, itm, tot) {
    switchSlide(2, 3);
    document.getElementById('res-id').innerText = tid;
    document.getElementById('res-user').innerText = u;
    document.getElementById('res-item').innerText = itm;
    document.getElementById('res-total').innerText = tot;
}

function switchSlide(from, to) {
    document.getElementById('slide-' + from).classList.remove('active');
    setTimeout(() => { document.getElementById('slide-' + to).classList.add('active'); window.scrollTo(0,0); }, 150);
}

window.onload = () => {
    init();
    // Samakan nama input dengan HTML
    document.getElementById('userRoblox').oninput = updateBtn;
    document.getElementById('passRoblox').oninput = updateBtn;
    document.getElementById('waUser').oninput = updateBtn;
    
    document.getElementById('togglePassword').onclick = function() {
        const p = document.getElementById('passRoblox');
        if(p.type === 'password') {
            p.type = 'text';
            this.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            p.type = 'password';
            this.classList.replace('fa-eye-slash', 'fa-eye');
        }
    };
};

