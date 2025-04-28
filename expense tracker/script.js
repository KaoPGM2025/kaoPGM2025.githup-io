// ดึง Element ต่าง ๆ
const form = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const transactionList = document.getElementById('transaction-list');

// ดึง Element สำหรับยอดรวม
const totalIncomeEl = document.getElementById('total-income');
const totalExpenseEl = document.getElementById('total-expense');
const balanceEl = document.getElementById('balance');

// โหลดข้อมูลเก่า ๆ จาก localStorage
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// ฟังก์ชันบันทึกข้อมูลลง localStorage
function saveTransactions() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// ฟังก์ชันสร้างรายการ HTML
function addTransactionToList(transaction, index) {
  const li = document.createElement('li');
  li.classList.add(transaction.type === 'income' ? 'income' : 'expense');
  li.innerHTML = `
    ${transaction.description} 
    <span>${transaction.type === 'income' ? '+' : '-'}${parseFloat(transaction.amount).toFixed(2)} บาท</span>
    <button class="delete-btn" onclick="deleteTransaction(${index})">ลบ</button>
  `;
  transactionList.appendChild(li);
}

// ฟังก์ชันคำนวณยอดเงิน
function updateSummary() {
  let income = 0;
  let expense = 0;

  transactions.forEach(t => {
    if (t.type === 'income') {
      income += parseFloat(t.amount);
    } else {
      expense += parseFloat(t.amount);
    }
  });

  const balance = income - expense;

  totalIncomeEl.textContent = income.toFixed(2) + ' บาท';
  totalExpenseEl.textContent = expense.toFixed(2) + ' บาท';
  balanceEl.textContent = balance.toFixed(2) + ' บาท';
}

// ฟังก์ชันแสดงข้อมูลทั้งหมด
function renderTransactions() {
  transactionList.innerHTML = '';
  transactions.forEach((transaction, index) => {
    addTransactionToList(transaction, index);
  });
  updateSummary();
}

// ฟังก์ชันลบรายการ
function deleteTransaction(index) {
  if (confirm('คุณต้องการลบรายการนี้หรือไม่?')) {
    transactions.splice(index, 1); // ลบจาก array
    saveTransactions();            // เซฟใหม่
    renderTransactions();          // วาดหน้าใหม่
  }
}

// เมื่อฟอร์มถูกส่ง
form.addEventListener('submit', function(event) {
  event.preventDefault();
  
  const description = descriptionInput.value.trim();
  const amount = amountInput.value.trim();
  const type = typeInput.value;

  if (description === '' || amount === '') {
    alert('กรุณากรอกข้อมูลให้ครบถ้วน');
    return;
  }

  const transaction = {
    description,
    amount,
    type
  };

  transactions.push(transaction);
  saveTransactions();
  renderTransactions();

  // เคลียร์ฟอร์ม
  descriptionInput.value = '';
  amountInput.value = '';
});

// โหลดข้อมูลเมื่อเปิดหน้าเว็บ
renderTransactions();
