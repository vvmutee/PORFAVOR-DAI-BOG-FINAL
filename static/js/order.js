// order.js
document.addEventListener('DOMContentLoaded', () => {
  const sel = document.getElementById('selectedProduct');
  const stored = localStorage.getItem('porfavor_selected');
  let product = stored ? JSON.parse(stored) : {title:'PORFAVOR TEE', price:2000, img:'static/images/look1.jpg'};
  if(sel) sel.innerHTML = `<div style="display:flex;gap:12px;align-items:center"><img src="${product.img}" style="width:96px;height:96px;object-fit:cover;border-radius:6px"><div><strong>${product.title}</strong><div style="color:#777">${product.price} ₽</div></div></div>`;

  const cities = ["Москва","Санкт-Петербург","Екатеринбург","Казань","Новосибирск","Ростов-на-Дону","Воронеж","Краснодар","Самара","Нижний Новгород"];
  const citySelect = document.getElementById('citySelect');
  if(citySelect){
    cities.forEach(c => {
      const opt = document.createElement('option'); opt.value = c; opt.textContent = c; citySelect.appendChild(opt);
    });
  }
  const pvzList = document.getElementById('pvzList');
  const mapEl = document.getElementById('cdekMap');

  async function loadPvz(cityName){
    if(!pvzList || !mapEl) return;
    pvzList.innerHTML = 'Загрузка пунктов выдачи...';
    mapEl.textContent = 'Загрузка...';
    try{
      const res = await fetch(`https://api.cdek.ru/v2/pvz?cityName=${encodeURIComponent(cityName)}`, {mode:'cors'});
      if(!res.ok) throw new Error('CDEK API error');
      const data = await res.json();
      if(!Array.isArray(data)) { pvzList.innerHTML='ПВЗ не найдены'; mapEl.textContent=''; return; }
      pvzList.innerHTML = '';
      data.forEach(p => {
        const div = document.createElement('div'); div.className='pvz-item';
        div.innerHTML = `<strong>${p.name}</strong><div>${p.address}, ${p.workTime || ''}</div>`;
        div.addEventListener('click', ()=> {
          document.querySelectorAll('.pvz-item').forEach(x=>x.style.background='');
          div.style.background='#f4f4f4';
          localStorage.setItem('porfavor_selected_pvz', JSON.stringify(p));
        });
        pvzList.appendChild(div);
      });
      mapEl.textContent = `Найдено ${data.length} пунктов выдачи. Выберите в списке слева.`;
    }catch(err){
      console.error(err);
      pvzList.innerHTML = 'Не удалось загрузить пункты выдачи. Возможно, CORS блокирует запрос. Используйте прокси или deploy на сервер (Vercel).';
      mapEl.textContent = '';
    }
  }

  if(citySelect){
    citySelect.addEventListener('change', ()=> loadPvz(citySelect.value));
    if(citySelect.value) loadPvz(citySelect.value);
  }

  const payCard = document.getElementById('payCard');
  if(payCard) payCard.addEventListener('click', async ()=>{
    alert('Кнопка Оплатить картой должна вызывать серверный endpoint для создания Stripe Checkout session.');
  });

  const form = document.getElementById('orderForm');
  if(form) form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const phone = document.getElementById('phone').value;
    if(!/^\+7\d{10}$/.test(phone)) { alert('Введите телефон в формате +7XXXXXXXXXX'); return; }
    alert('Заказ сформирован (локально). Для отправки на сервер реализуйте endpoint /orders.');
  });
});
