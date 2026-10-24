const totalProductsEl = document.getElementById('total-products');
const totalItemsEl = document.getElementById('total-items');
const totalValueEl = document.getElementById('total-value');
const addBtn = document.getElementById('addBtn');
const taskInput = document.getElementById('taskInput');
const taskInput2 = document.getElementById('taskInput2');
const taskInput3 = document.getElementById('taskInput3'); 
const taskInput4 = document.getElementById('taskInput4');
const taskInput5 = document.getElementById('taskInput5');
const searchInput = document.getElementById('searchInput');
const searcInput = document.getElementById('searcInput');
const tasksList = document.getElementById('tasksList');
const mstExportBtn = document.getElementById('mst-export-btn');
const mstImportBtn = document.getElementById('mst-import-btn');

let tasks = [];
try {
    const savedData = localStorage.getItem('tasks');
    tasks = JSON.parse(savedData);
    if (!Array.isArray(tasks)) {
        tasks = []; 
    }
} catch (e) {
    tasks = []; 
}
if (searcInput && tasksList) {
    searcInput.addEventListener('input', function () {
        let query = searcInput.value.trim(); 
        const items = tasksList.querySelectorAll('li'); 
        items.forEach(m => {
            let taskNameEl = m.querySelector('.taskName');
            if (!taskNameEl) return; 
            let fullText = taskNameEl.innerText;
            let parts = fullText.split(' , '); 
            let isMatch = false;
            if (query !== '') {
                if (parts && parts.includes(query)) {
                    isMatch = true;
                }
            }
            if (query !== '' && isMatch) {
                m.style.display = 'flex'; 
                m.style.backgroundColor = '#645b4fc2'; 
                m.style.borderColor = '#caf0f8';
                m.style.color = '#002b42cc';
            } else if (query === '') {
                m.style.display = 'flex';
                m.style.backgroundColor = '#ffe4c4c2'; 
                m.style.borderColor = '#00b4d84d';
                m.style.color = '#0096e6cd';  
            } else {
                m.style.display = 'none'; 
            }
        });
    });
}
if (searchInput && tasksList) {
    searchInput.addEventListener('input', function () {
        let query = searchInput.value.toLowerCase();
        const items = tasksList.querySelectorAll('li');  
        items.forEach(x => {
            let text = x.innerText.toLowerCase();
            if (query !== '' && text.includes(query)) {
                x.style.display = 'flex'; 
                x.style.backgroundColor = '#645b4fc2'; 
                x.style.borderColor = '#caf0f8';
                x.style.color = '#002b42cc';
            } else if (query === '') {
                x.style.display = 'flex'; 
                x.style.backgroundColor = '#ffe4c4c2'; 
                x.style.borderColor = '#00b4d84d';
                x.style.color = '#0096e6cd'; 
            } else {
                x.style.display = 'none'; 
            }
        });
    });
}
function showTasks() {
    if (!tasksList) return;
    tasksList.innerHTML = '';
    let totalProducts = Array.isArray(tasks) ? tasks.length : 0;
    let totalItems = 0;
    let totalValue = 0;
    
    tasks.forEach((task, index) => {
        if (!task || !task.text) return; 
        let parts = task.text.split(' , ');
        let price = Number(parts[4]) || 0; 
        let quantity = Number(parts[2]) || 0; 
        totalItems += quantity;
        totalValue += (price * quantity);

        let li = document.createElement('li');
        li.classList.add('item');
        li.innerHTML = `
            <span class="taskName ${task.done ? 'completed' : ''}">${task.text}</span>
            <div>
                <button class="plus">➕</button>
                <button class="minus">➖</button>
                <button class="delete" onclick="deleteProduct(${index})">Delete</button>
            </div>
        `;
        
        li.querySelector('.plus').addEventListener('click', function() {
            let parts = tasks[index].text.split(' , '); 
            let currentCount = Number(parts[2]) || 0;
            let newCount = currentCount + 1;
            parts[2] = newCount; 
            tasks[index].text = parts.join(' , ');
            updateLocalStorage();
        });
        
        li.querySelector('.minus').addEventListener('click', function() {
            let parts = tasks[index].text.split(' , ');
            let currentCount = Number(parts[2]) || 0;
            let minLimit = Number(parts[3]) || 0;
            if (currentCount > 0) {
                let newCount = currentCount - 1;
                parts[2] = newCount; 
                tasks[index].text = parts.join(' , ');
                if (newCount === minLimit) {
                    alert(`M S T😎:⚠️تنبيه: عدد القطع تساوى مع الحد الأدنى (${minLimit}) للصنف: ${parts[0]}`);
                }
                updateLocalStorage();
            }
        });
        
        tasksList.appendChild(li);
    });
    
    if (totalProductsEl) totalProductsEl.innerText = totalProducts;
    if (totalItemsEl) totalItemsEl.innerText = totalItems;
    if (totalValueEl) totalValueEl.innerText = totalValue + ' L.E';
}
function updateLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    showTasks();
}
function handleAddTask() {
    if (!taskInput || !taskInput2 || !taskInput3 || !taskInput4 || !taskInput5) return;
    let taskText = taskInput.value.trim();
    let taskText2 = taskInput2.value.trim();
    let taskText3 = taskInput3.value.trim();
    let taskText4 = taskInput4.value.trim();
    let taskText5 = taskInput5.value.trim();
    
    if (taskText == '' || taskText2 == '' || taskText3 == '' || taskText4 == '' || taskText5 == '') {
        alert('😎 M S T 😎: Please fill all fields!');
        return;
    }
    if (Number(taskText3) === Number(taskText4)) {
        alert(`M S T😎: ⚠️ تنبيه عند الإضافة: عدد القطع مساوٍ تماماً للحد الأدنى (${taskText4})!`);
    }
    tasks.push({ text: `${taskText} , ${taskText2} , ${taskText3} , ${taskText4} , ${taskText5}` });
    updateLocalStorage();
    taskInput.value = '';
    taskInput2.value = '';
    taskInput3.value = '';
    taskInput4.value = '';
    taskInput5.value = '';
}
if (addBtn) addBtn.addEventListener('click', handleAddTask);
if (taskInput) {
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') handleAddTask();
    });
}
function deleteProduct(index) {
    if(confirm("هل أنت متأكد من حذف هذا الصنف من السجلات الرسمية لميجا تك؟ :😎M S T")) {
        tasks.splice(index, 1);
        updateLocalStorage();
    }
}
mstExportBtn.addEventListener('click', () => {
    const savedData = localStorage.getItem('tasks');
    if (localStorage.length === 0 || !savedData || savedData === '[]') {
        alert('😎 M S T 😎: ❌ المخازن فارغه ليس هناك شئ لتحميله ❌');
        return;
    }
    const dataStr = JSON.stringify(localStorage);
    const blob = new Blob([dataStr], { type: 'application/json;charset=utf-8' });
    const dataUri = URL.createObjectURL(blob);
    const exportFileDefaultName = `MEGA TECH-${new Date().toISOString().slice(0, 10)}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    URL.revokeObjectURL(dataUri);
});
mstImportBtn.addEventListener('click', () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                localStorage.clear();
                Object.keys(importedData).forEach(key => {
                    localStorage.setItem(key, importedData[key]);
                });
                alert(' 🎉 : تم استرجاع النسخة الاحتياطية بنجاح! : M S T 😎');
                location.reload();
            } catch (error) {
                alert(' ❌ : فشل استرجاع الملف. تأكد من أنه ملف صحيح. : M S T 😎');
            }
        };
        reader.readAsText(file);
    });
    fileInput.click();
});
showTasks();