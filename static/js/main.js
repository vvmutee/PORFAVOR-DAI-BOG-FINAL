// main.js — header/menu, modal product, order flow, swipe minimal
document.addEventListener('DOMContentLoaded', () => {
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  burger && burger.addEventListener('click', () => {
    const open = mobileMenu.getAttribute('aria-hidden') === 'false';
    mobileMenu.setAttribute('aria-hidden', open ? 'true' : 'false');
    mobileMenu.style.display = open ? 'none' : 'block';
  });

  const productModal = document.getElementById('productModal');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalPrice = document.getElementById('modalPrice');
  const modalDesc = document.getElementById('modalDesc');
  const sizeButtons = document.querySelectorAll('.size');
  const toOrderBtn = document.getElementById('toOrder');
  const closeModalBtn = document.querySelector('.close-modal');

  function openProductModal(product){
    modalImage.src = product.img;
    modalTitle.textContent = product.title;
    modalPrice.textContent = product.price + ' ₽';
    modalDesc.textContent = product.desc || "Короткое описание товара.";
    productModal.setAttribute('aria-hidden','false');
    productModal.style.display = 'flex';
    sizeButtons.forEach(s => s.classList.remove('active'));
    const defaultSize = Array.from(sizeButtons).find(s=>s.dataset.size==='M');
    if(defaultSize) defaultSize.classList.add('active');
    localStorage.setItem('porfavor_selected', JSON.stringify(product));
  }

  function closeProductModal(){
    productModal.setAttribute('aria-hidden','true');
    productModal.style.display = 'none';
  }

  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => {
      const product = {
        id: card.dataset.id,
        title: card.dataset.title || 'PORFAVOR TEE',
        price: card.dataset.price || '2000',
        img: card.dataset.img || card.querySelector('img').src,
        desc: card.dataset.desc || ''
      };
      openProductModal(product);
    });
  });

  document.querySelectorAll('.order-now').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const product = JSON.parse(btn.dataset.product);
      openProductModal(product);
    });
  });

  closeModalBtn && closeModalBtn.addEventListener('click', closeProductModal);
  productModal && productModal.addEventListener('click', (e)=>{
    if(e.target === productModal) closeProductModal();
  });

  sizeButtons.forEach(s => s.addEventListener('click', () => {
    sizeButtons.forEach(x=>x.classList.remove('active'));
    s.classList.add('active');
  }));

  toOrderBtn && toOrderBtn.addEventListener('click', ()=>{
    window.location.href = 'order.html';
  });

  (function addSwipe() {
    const grid = document.getElementById('productGrid');
    if(!grid) return;
    let startX=0, currentX=0, isDown=false;
    grid.addEventListener('pointerdown', e=>{
      isDown=true; startX = e.clientX;
    });
    window.addEventListener('pointermove', e=>{
      if(!isDown) return;
      currentX = e.clientX;
    });
    window.addEventListener('pointerup', e=>{
      if(!isDown) return;
      const dx = e.clientX - startX;
      if(Math.abs(dx) > 60){
        grid.scrollBy({left: -dx*1.5, behavior: 'smooth'});
      }
      isDown=false;
    });
  })();

  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();
});
