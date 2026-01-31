// ดึง Element ต่างๆ จาก DOM
const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

/**
 * 1. ดึงข้อมูลจาก LocalStorage
 * - ใช้ JSON.parse เพื่อแปลง String กลับมาเป็น Array
 * - ถ้าในเครื่องไม่มีข้อมูลเลย (null) ให้เริ่มที่อาเรย์ว่าง [ ]
 */
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// ฟังก์ชันเพิ่มธุรกรรมลงใน List
function addTransaction(e) {
    e.preventDefault();

    if (text.value.trim() === '' || amount.value.trim() === '') {
        alert('กรุณาระบุชื่อธุรกรรมและจำนวนเงิน');
    } else {
        const transaction = {
            id: generateID(),
            text: text.value,
            amount: +amount.value // แปลง string เป็น number
        };

        transactions.push(transaction);
        addTransactionDOM(transaction);
        updateValues();
        
        // 2. บันทึกลง LocalStorage ทุกครั้งที่มีการเพิ่มข้อมูลใหม่
        updateLocalStorage();

        text.value = '';
        amount.value = '';
    }
}

// สุ่มไอดีธุรกรรม
function generateID() {
    return Math.floor(Math.random() * 100000000);
}

// แสดงผลธุรกรรมในหน้าเว็บ
function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');

    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

    item.innerHTML = `
        ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    `;

    list.appendChild(item);
}

// อัปเดตยอดคงเหลือ, รายรับ และรายจ่าย
function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);
    const expense = (
        amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1
    ).toFixed(2);

    balance.innerText = `฿${total}`;
    money_plus.innerText = `฿${income}`;
    money_minus.innerText = `฿${expense}`;
}

// ลบธุรกรรม
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    
    // 3. บันทึกลง LocalStorage อีกครั้งหลังจากลบข้อมูล
    updateLocalStorage();
    
    init();
}

/**
 * 4. ฟังก์ชันบันทึกข้อมูลลงเครื่อง
 * - ต้องใช้ JSON.stringify เพราะ LocalStorage เก็บได้เฉพาะข้อมูลประเภท String
 */
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// เริ่มต้นโปรแกรม
function init() {
    list.innerHTML = '';
    // ดึงข้อมูลจากอาเรย์ transactions (ที่ได้จาก LocalStorage) มาแสดงผล
    transactions.forEach(addTransactionDOM);
    updateValues();
}

init();

// Event Listener
form.addEventListener('submit', addTransaction);