const CART_KEY = 'lch_cart';
const POSTS_KEY = 'lch_admin_posts';
const COMMENTS_KEY = 'lch_comments';
const PRODUCTS_KEY = 'lch_products';
const PRODUCT_CATALOG_SELECTOR = '#shop-product-catalog';

let productCatalogCache = null;
let addToCartBound = false;
let productModalBound = false;

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function sanitizeUrl(value) {
  try {
    const url = new URL(String(value || ''), window.location.origin);
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      return url.toString();
    }
  } catch {}

  return '#';
}

function readSeedProducts() {
  if (productCatalogCache) {
    return productCatalogCache;
  }

  const node = document.querySelector(PRODUCT_CATALOG_SELECTOR);
  if (!node) {
    productCatalogCache = [];
    return productCatalogCache;
  }

  try {
    productCatalogCache = JSON.parse(node.textContent || '[]');
  } catch {
    productCatalogCache = [];
  }

  return productCatalogCache;
}

function getAllProducts() {
  return [...readSeedProducts(), ...readProducts()];
}

function getProductById(productId) {
  return getAllProducts().find((product) => product.id === productId) || null;
}

function clearCartState() {
  localStorage.removeItem(CART_KEY);
  updateCartCount();
  renderShopSummary();
  renderCartDrawer();
}

function getCurrentUser() {
  const role = document.body?.dataset.userRole || '';
  const name = document.body?.dataset.userName || '';
  const email = document.body?.dataset.userEmail || '';

  if (!role || !name || !email) {
    return null;
  }

  return { role, name, email };
}

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function readCart() {
  return readJson(CART_KEY, []);
}

function readProducts() {
  return [];
}

function writeCart(items) {
  writeJson(CART_KEY, items);
  updateCartCount();
  renderShopSummary();
  renderCartDrawer();
}

function syncLogoutState() {
  const url = new URL(window.location.href);
  localStorage.removeItem(POSTS_KEY);
  localStorage.removeItem(COMMENTS_KEY);
  localStorage.removeItem(PRODUCTS_KEY);
  if (url.searchParams.get('logged_out') === '1') {
    clearCartState();
    url.searchParams.delete('logged_out');
    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
  }
}

function updateCartCount() {
  const count = readCart().reduce((total, item) => total + item.quantity, 0);
  document.querySelectorAll('[data-cart-count]').forEach((node) => {
    node.textContent = String(count);
    node.toggleAttribute('hidden', count === 0);
  });
}

function bindAddToCart() {
  if (addToCartBound) {
    return;
  }

  addToCartBound = true;

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-add-to-cart]');
    if (!button) {
      return;
    }
    
    event.stopPropagation(); // Evitar que el clic llegue al modal

    const currentUser = getCurrentUser();
    if (!currentUser) {
      const next = encodeURIComponent('/tienda');
      window.location.href = `/auth/login?redirect=${next}&mode=shop`;
      return;
    }

    const {
      id,
      name,
      price,
      priceValue,
      tag,
      copy,
    } = button.dataset;

    const items = readCart();
    const existing = items.find((item) => item.id === id);

    if (existing) {
      existing.quantity += 1;
    } else {
      items.push({
        id,
        name,
        price,
        priceValue: Number(priceValue || 0),
        tag,
        copy,
        quantity: 1,
      });
    }

    writeCart(items);

    const status = document.querySelector('[data-cart-feedback]');
    if (status) {
      status.textContent = `${name} agregado al carrito.`;
    }

    const dialog = button.closest('dialog');
    if (dialog && typeof dialog.close === 'function') {
      dialog.close();
    }

    openCartDrawer();
  });
}

function bindLogoutLinks() {
  document.querySelectorAll('a[href^="/api/auth/logout"]').forEach((link) => {
    link.addEventListener('click', () => {
      clearCartState();
    });
  });
}

function renderCartPage() {
  const container = document.querySelector('[data-cart-page]');
  if (!container) {
    return;
  }

  const items = readCart();
  if (!items.length) {
    container.innerHTML = `
      <div style="text-align:center;padding:4rem 0;">
        <p class="section-eyebrow">Carrito vacío</p>
        <p style="font-size:0.95rem;font-weight:300;color:#666;margin:1rem 0 2rem;">Todavía no elegiste nada para Iris y Rubi.</p>
        <a class="btn btn--orange" href="/tienda">Ir a la tienda</a>
      </div>
    `;
    return;
  }

  const subtotal = items.reduce(
    (total, item) => total + item.priceValue * item.quantity,
    0,
  );

  container.innerHTML = `
    <div class="cp-grid">
      <div class="cp-list">
        ${items
          .map(
            (item) => `
              <div class="cp-item">
                <div class="cp-item__info">
                  <p class="cp-item__tag">${escapeHtml(item.tag)}</p>
                  <p class="cp-item__name">${escapeHtml(item.name)}</p>
                </div>
                <div class="cp-item__right">
                  <span class="cp-item__price">${escapeHtml(item.price)}</span>
                  <div class="cp-qty">
                    <button type="button" data-cart-change="${escapeHtml(item.id)}" data-delta="-1">−</button>
                    <span>${item.quantity}</span>
                    <button type="button" data-cart-change="${escapeHtml(item.id)}" data-delta="1">+</button>
                  </div>
                </div>
              </div>
            `,
          )
          .join('')}
      </div>
      <aside class="cp-summary">
        <p class="section-eyebrow">Resumen</p>
        <div class="cp-summary__row"><span>Subtotal</span><strong>$${subtotal.toFixed(2)}</strong></div>
        <div class="cp-summary__row"><span>Envío</span><strong>Ecuador</strong></div>
        <a class="btn btn--orange" href="/checkout" style="width:100%;justify-content:center;margin-top:1.5rem;">Ir al checkout</a>
        <button type="button" class="btn btn--outline-black" data-clear-cart style="width:100%;justify-content:center;margin-top:0.75rem;">Vaciar carrito</button>
      </aside>
    </div>
  `;

  container.querySelectorAll('[data-cart-change]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.getAttribute('data-cart-change');
      const delta = Number(button.getAttribute('data-delta'));
      const next = readCart()
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item,
        )
        .filter((item) => item.quantity > 0);
      writeCart(next);
      renderCartPage();
    });
  });

  container.querySelector('[data-clear-cart]')?.addEventListener('click', () => {
    writeCart([]);
    renderCartPage();
  });
}

function renderCheckoutPage() {
  const container = document.querySelector('[data-checkout-page]');
  if (!container) {
    return;
  }

  const items = readCart();
  if (!items.length) {
    container.innerHTML = `
      <div style="text-align:center;padding:3rem 0;">
        <p class="section-eyebrow">Sin productos</p>
        <p style="font-size:0.95rem;font-weight:300;color:#666;margin:1rem 0 2rem;">Agrega productos antes de continuar.</p>
        <a class="btn btn--orange" href="/tienda">Ir a la tienda</a>
      </div>
    `;
    return;
  }

  const subtotal = items.reduce(
    (total, item) => total + item.priceValue * item.quantity,
    0,
  );

  container.innerHTML = `
    <div class="ck-wrap">
      <div class="ck-items">
        ${items.map((item) => `
          <div class="ck-item">
            <div class="ck-item__info">
              <p class="ck-item__tag">${escapeHtml(item.tag)}</p>
              <p class="ck-item__name">${escapeHtml(item.name)}</p>
            </div>
            <div class="ck-item__right">
              <span>x${item.quantity}</span>
              <strong>$${(item.priceValue * item.quantity).toFixed(2)}</strong>
            </div>
          </div>
        `).join('')}
        <div class="ck-total">
          <span>Total</span>
          <strong>$${subtotal.toFixed(2)}</strong>
        </div>
      </div>
      <div class="ck-note">
        <p class="section-eyebrow">Pago</p>
        <p style="font-size:0.9rem;font-weight:300;color:#666;margin:0.75rem 0 1.5rem;line-height:1.7;">
          El sistema de pago estará disponible muy pronto. Para coordinar tu pedido escríbenos por WhatsApp.
        </p>
        <a class="btn btn--orange" href="https://wa.me/593960463743" target="_blank" rel="noreferrer">Pedir por WhatsApp</a>
      </div>
    </div>
  `;
}

function renderCartDrawer() {
  const container = document.querySelector('[data-cart-drawer-content]');
  if (!container) {
    return;
  }

  const user = getCurrentUser();
  const items = readCart();
  const subtotal = items.reduce(
    (total, item) => total + item.priceValue * item.quantity,
    0,
  );

  if (!user) {
    container.innerHTML = `
      <div class="cdd-empty">
        <p class="section-eyebrow">Acceso</p>
        <p class="cdd-empty__text">Entra para guardar tu selección y continuar al pago.</p>
        <a class="btn btn--orange" href="/auth/login?redirect=%2Ftienda&mode=shop">Entrar con Google</a>
      </div>
    `;
    return;
  }

  if (!items.length) {
    container.innerHTML = `
      <div class="cdd-empty">
        <p class="section-eyebrow">Vacío</p>
        <p class="cdd-empty__text">Todavía no hay nada aquí. Agrega un producto desde la tienda.</p>
        <a class="btn btn--outline-black" href="/tienda">Ir a la tienda</a>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="cdd-items">
      ${items.map((item) => `
        <div class="cdd-item">
          <div class="cdd-item__info">
            <p class="cdd-item__tag">${escapeHtml(item.tag)}</p>
            <p class="cdd-item__name">${escapeHtml(item.name)}</p>
            <span class="cdd-item__price">${escapeHtml(item.price)}</span>
          </div>
          <div class="cdd-qty">
            <button type="button" data-cart-change="${escapeHtml(item.id)}" data-delta="-1">−</button>
            <span>${item.quantity}</span>
            <button type="button" data-cart-change="${escapeHtml(item.id)}" data-delta="1">+</button>
          </div>
        </div>
      `).join('')}
    </div>
    <div class="cdd-footer">
      <div class="cdd-footer__row"><span>Subtotal</span><strong>$${subtotal.toFixed(2)}</strong></div>
      <a class="btn btn--orange" href="/checkout" style="width:100%;justify-content:center;">Ir al checkout</a>
      <a class="btn btn--outline-black" href="/carrito" style="width:100%;justify-content:center;">Ver carrito</a>
    </div>
  `;

  container.querySelectorAll('[data-cart-change]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.getAttribute('data-cart-change');
      const delta = Number(button.getAttribute('data-delta'));
      const next = readCart()
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item,
        )
        .filter((item) => item.quantity > 0);
      writeCart(next);
    });
  });
}

function openCartDrawer() {
  const drawer = document.querySelector('[data-cart-drawer]');
  if (!drawer) {
    return;
  }

  drawer.setAttribute('data-open', 'true');
  drawer.setAttribute('aria-hidden', 'false');
  document.body.classList.add('cart-drawer-open');
}

function closeCartDrawer() {
  const drawer = document.querySelector('[data-cart-drawer]');
  if (!drawer) {
    return;
  }

  drawer.removeAttribute('data-open');
  drawer.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('cart-drawer-open');
}

function bindCartDrawer() {
  document.addEventListener('click', (event) => {
    const openButton = event.target.closest('[data-open-cart]');
    if (openButton) {
      renderCartDrawer();
      openCartDrawer();
      return;
    }

    const closeButton = event.target.closest('[data-close-cart]');
    if (closeButton) {
      closeCartDrawer();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeCartDrawer();
    }
  });
}

function bindProductModal() {
  const dialog = document.querySelector('[data-product-modal]');
  const content = document.querySelector('[data-product-modal-content]');
  if (!dialog || !content || productModalBound) {
    return;
  }

  productModalBound = true;

  const openModal = (product) => {
    if (!product) {
      return;
    }

    const isOwned = product.source === 'owned';
    const images = (product.images || []).filter(Boolean);
    content.innerHTML = `
      ${images.length ? `
        <div class="product-modal__gallery">
          <img src="${sanitizeUrl(images[0])}" alt="${escapeHtml(product.name)}" style="width:100%;aspect-ratio:1;object-fit:cover;" />
        </div>
      ` : ''}
      <div class="product-modal__copy">
        <p class="section-eyebrow">${escapeHtml(product.tag)}</p>
        <h2 style="font-size:1.4rem;font-weight:800;letter-spacing:-0.02em;margin:0.5rem 0;">${escapeHtml(product.name)}</h2>
        <p style="font-size:1.1rem;font-weight:700;margin-bottom:0.75rem;">${escapeHtml(product.price)}</p>
        <p style="font-size:0.88rem;font-weight:300;color:#555;line-height:1.75;margin-bottom:1rem;">${escapeHtml(product.description || product.copy)}</p>
        ${product.shippingNote ? `<p style="font-size:0.72rem;font-weight:600;letter-spacing:0.08em;color:#888;margin-bottom:1.5rem;">${escapeHtml(product.shippingNote)}</p>` : ''}
        <div style="display:flex;gap:0.75rem;">
          ${isOwned
            ? `<button class="btn btn--orange" type="button" data-add-to-cart
                data-id="${escapeHtml(product.id)}"
                data-name="${escapeHtml(product.name)}"
                data-price="${escapeHtml(product.price)}"
                data-price-value="${product.priceValue}"
                data-tag="${escapeHtml(product.tag)}"
                data-copy="${escapeHtml(product.copy)}">
                Agregar al carrito
              </button>`
            : `<a class="btn btn--orange" href="${sanitizeUrl(product.affiliateUrl)}" target="_blank" rel="noreferrer">
                Comprar en Amazon
              </a>`
          }
        </div>
      </div>
    `;

    dialog.showModal();
  };

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-open-product]');
    if (!button) {
      return;
    }

    const productId = button.getAttribute('data-product-id');
    if (!productId) {
      return;
    }

    openModal(getProductById(productId));
  });

  document.addEventListener('click', (event) => {
    const closeButton = event.target.closest('[data-close-product-modal]');
    if (closeButton) {
      dialog.close();
    }
  });

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });
}

function bindAutoRails() {
  document.querySelectorAll('[data-auto-rail]').forEach((rail) => {
    const cards = rail.querySelectorAll('.product-card');
    if (cards.length < 2) {
      return;
    }

    let index = 0;
    let intervalId = null;

    const move = () => {
      const nextCard = cards[index];
      if (!nextCard) {
        return;
      }

      rail.scrollTo({
        left: nextCard.offsetLeft,
        behavior: 'smooth',
      });

      index = (index + 1) % cards.length;
    };

    const start = () => {
      if (intervalId) {
        return;
      }
      intervalId = window.setInterval(move, 3000);
    };

    const stop = () => {
      if (!intervalId) {
        return;
      }
      clearInterval(intervalId);
      intervalId = null;
    };

    start();
    rail.addEventListener('mouseenter', stop);
    rail.addEventListener('mouseleave', start);
    rail.addEventListener('focusin', stop);
    rail.addEventListener('focusout', start);
  });
}

function bindFloatingCart() {
  const panel = document.querySelector('[data-floating-cart]');
  if (!panel || window.innerWidth < 961) {
    return;
  }

  let target = 0;
  let current = 0;
  let frame = null;

  const tick = () => {
    current += (target - current) * 0.14;
    panel.style.transform = `translateY(${current}px)`;
    if (Math.abs(target - current) > 0.2) {
      frame = requestAnimationFrame(tick);
    } else {
      frame = null;
    }
  };

  const onScroll = () => {
    target = Math.min(42, window.scrollY * 0.055);
    if (!frame) {
      frame = requestAnimationFrame(tick);
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => {
    if (window.innerWidth < 961) {
      panel.style.transform = '';
    }
  });
}

function renderShopSummary() {
  const container = document.querySelector('[data-shop-summary]');
  if (!container) {
    return;
  }

  const user = getCurrentUser();
  const items = readCart();
  const count = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce(
    (total, item) => total + item.priceValue * item.quantity,
    0,
  );

  if (!user) {
    container.innerHTML = `
      <p class="feature-eyebrow">Tu selección</p>
      <h3>Entra para guardar tu compra.</h3>
      <p>Así podrás retomar tu recorrido y continuar con más tranquilidad.</p>
      <a class="button-primary" href="/auth/login?redirect=%2Ftienda&mode=shop">Entrar para comprar</a>
    `;
    return;
  }

  container.innerHTML = `
    <p class="feature-eyebrow">Tu carrito</p>
    <h3>${count} producto${count === 1 ? '' : 's'}</h3>
    <div class="summary-row"><span>Subtotal</span><strong>$${subtotal.toFixed(2)}</strong></div>
    <div class="summary-row"><span>Sesión</span><strong>${user.name}</strong></div>
    <button class="button-primary" type="button" data-open-cart>Abrir carrito</button>
  `;
}

function renderAdminProducts() {
  const container = document.querySelector('[data-admin-product-list]');
  const countNode = document.querySelector('[data-admin-product-count]');
  if (!container || !countNode) {
    return;
  }

  const products = readProducts();
  countNode.textContent = String(products.length);

  if (!products.length) {
    container.innerHTML = `
      <article class="empty-state">
        <p class="feature-eyebrow">Sin productos</p>
        <h3>Aún no hay productos cargados.</h3>
        <a class="button-secondary" href="/admin/products/new">Crear producto</a>
      </article>
    `;
    return;
  }

  container.innerHTML = products
    .map(
      (product) => `
        <article class="admin-post-card">
          <p class="feature-eyebrow">${product.source === 'owned' ? 'Propio' : 'Afiliado'}</p>
          <h3>${escapeHtml(product.name)}</h3>
          <p>${escapeHtml(product.copy)}</p>
          <div class="summary-row"><span>Precio</span><strong>${escapeHtml(product.price)}</strong></div>
        </article>
      `,
    )
    .join('');
}

function bindAdminProductForm() {
  const form = document.querySelector('[data-admin-product-form]');
  if (!form) {
    return;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const source = String(formData.get('source') || 'owned');
    const name = String(formData.get('name') || '').trim();
    const tag = String(formData.get('tag') || '').trim() || (source === 'owned' ? 'Las Chubys' : 'Amazon');
    const price = String(formData.get('price') || '').trim();
    const priceValue = Number(formData.get('priceValue') || 0);
    const copy = String(formData.get('copy') || '').trim();
    const description = String(formData.get('description') || '').trim();
    const images = String(formData.get('images') || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
    const shippingNote = String(formData.get('shippingNote') || '').trim();
    const affiliateUrl = String(formData.get('affiliateUrl') || '').trim();

    if (!name || !price || !copy || !description) {
      const statusNode = form.querySelector('[data-admin-product-status]');
      if (statusNode) {
        statusNode.textContent = 'Completa nombre, precio, texto corto y descripción.';
      }
      return;
    }

    const products = readProducts();
    products.unshift({
      id: crypto.randomUUID(),
      source,
      tag,
      name,
      price,
      priceValue,
      copy,
      description,
      images: images.length ? images : ['Vista 1', 'Vista 2', 'Vista 3'],
      affiliateUrl,
      shippingNote:
        shippingNote ||
        (source === 'owned'
          ? 'Producto propio. Envío nacional por Servientrega dentro de Ecuador.'
          : 'Compra externa en Amazon con link afiliado de Las Chubys.'),
    });

    writeJson(PRODUCTS_KEY, products);
    window.location.href = '/admin';
  });
}

function renderCmsProductsInStore() {
  const ownedContainer = document.querySelector('[data-cms-products]');
  const affiliateContainer = document.querySelector('[data-cms-affiliate-products]');
  if (!ownedContainer && !affiliateContainer) {
    return;
  }

  const renderProducts = (products) =>
    products
      .map(
        (product) => `
        <article class="product-card product-card--rail">
          <div class="product-glow"></div>
          <span class="badge">${escapeHtml(product.tag)}</span>
          <h2>${escapeHtml(product.name)}</h2>
          <strong>${escapeHtml(product.price)}</strong>
          <p>${escapeHtml(product.copy)}</p>
          <div class="product-actions">
            <button
              class="button-secondary"
              type="button"
              data-open-product
              data-product-id="${escapeHtml(product.id)}"
            >
              Ver producto
            </button>
            ${
              product.source === 'owned'
                ? `
                  <button
                    class="button-primary"
                    type="button"
                    data-add-to-cart
                    data-id="${escapeHtml(product.id)}"
                    data-name="${escapeHtml(product.name)}"
                    data-price="${escapeHtml(product.price)}"
                    data-price-value="${product.priceValue}"
                    data-tag="${escapeHtml(product.tag)}"
                    data-copy="${escapeHtml(product.copy)}"
                  >
                    Agregar
                  </button>
                `
                : `
                  <a class="button-primary" href="${sanitizeUrl(product.affiliateUrl)}" target="_blank" rel="noreferrer">
                    Ir a Amazon
                  </a>
                `
            }
          </div>
        </article>
      `,
      )
      .join('');

  const ownedProducts = readProducts().filter((product) => product.source === 'owned');
  const affiliateProducts = readProducts().filter((product) => product.source === 'affiliate');

  if (ownedContainer) {
    ownedContainer.innerHTML = renderProducts(ownedProducts);
  }

  if (affiliateContainer) {
    affiliateContainer.innerHTML = renderProducts(affiliateProducts);
  }
}

function bindAdminForm() {
  const form = document.querySelector('[data-admin-form]');
  if (!form) {
    return;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const title = String(formData.get('title') || '').trim();
    const category = String(formData.get('category') || '').trim();
    const excerpt = String(formData.get('excerpt') || '').trim();
    const content = String(formData.get('content') || '').trim();
    const status = String(formData.get('status') || 'draft');

    if (!title || !excerpt || !content) {
      const statusNode = form.querySelector('[data-admin-status]');
      if (statusNode) {
        statusNode.textContent = 'Completa título, resumen y contenido antes de guardar.';
      }
      return;
    }

    const posts = readJson(POSTS_KEY, []);
    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    posts.unshift({
      id: crypto.randomUUID(),
      slug,
      title,
      category: category || 'Nuevo post',
      excerpt,
      content,
      status,
      createdAt: new Date().toISOString(),
    });

    writeJson(POSTS_KEY, posts);
    window.location.href = '/admin?saved=1';
  });
}

function renderAdminPosts() {
  const container = document.querySelector('[data-admin-post-list]');
  const countNode = document.querySelector('[data-admin-post-count]');
  if (!container || !countNode) {
    return;
  }

  const posts = readJson(POSTS_KEY, []);
  countNode.textContent = String(posts.length);

  if (!posts.length) {
    container.innerHTML = `
      <article class="empty-state">
        <p class="feature-eyebrow">Sin artículos</p>
        <h3>Este espacio está listo para la próxima historia.</h3>
        <a class="button-secondary" href="/admin/posts/new">Crear primer post</a>
      </article>
    `;
    return;
  }

  container.innerHTML = posts
    .map(
      (post) => `
        <article class="admin-post-card">
          <p class="feature-eyebrow">${escapeHtml(post.category)}</p>
          <h3>${escapeHtml(post.title)}</h3>
          <p>${escapeHtml(post.excerpt)}</p>
          <div class="summary-row"><span>Estado</span><strong>${escapeHtml(post.status)}</strong></div>
        </article>
      `,
    )
    .join('');
}

function renderCommunityPosts() {
  const container = document.querySelector('[data-blog-community-posts]');
  if (!container) {
    return;
  }

  const posts = readJson(POSTS_KEY, []).filter((post) => post.status === 'published');
  if (!posts.length) {
    return;
  }

  container.innerHTML = posts
    .map(
      (post) => `
        <article class="blog-list-card blog-list-card--draft">
          <div>
            <p class="feature-eyebrow">${escapeHtml(post.category)}</p>
            <h2>${escapeHtml(post.title)}</h2>
            <p>${escapeHtml(post.excerpt)}</p>
          </div>
          <div class="blog-list-card__meta">
            <span>Publicado</span>
            <span class="inline-link">Blog</span>
          </div>
        </article>
      `,
    )
    .join('');
}

function bindCommentForms() {
  document.querySelectorAll('[data-comment-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const slug = String(formData.get('slug') || '');
      const author = String(formData.get('author') || 'Lectora');
      const body = String(formData.get('body') || '').trim();

      if (!slug || !body) {
        return;
      }

      const allComments = readJson(COMMENTS_KEY, {});
      const list = allComments[slug] || [];
      list.unshift({
        author,
        body,
        date: 'recién',
      });
      allComments[slug] = list;
      writeJson(COMMENTS_KEY, allComments);
      form.reset();
      renderLocalComments(slug);
    });
  });
}

function renderLocalComments(slug) {
  const node = document.querySelector(`[data-local-comments="${slug}"]`);
  if (!node) {
    return;
  }

  const allComments = readJson(COMMENTS_KEY, {});
  const list = allComments[slug] || [];
  node.innerHTML = list
    .map(
      (comment) => `
        <article class="comment-card comment-card--local">
          <div class="comment-meta">
            <strong>${escapeHtml(comment.author)}</strong>
            <span>${escapeHtml(comment.date)}</span>
          </div>
          <p>${escapeHtml(comment.body)}</p>
        </article>
      `,
    )
    .join('');
}

function initLocalComments() {
  document.querySelectorAll('[data-local-comments]').forEach((node) => {
    renderLocalComments(node.getAttribute('data-local-comments'));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  syncLogoutState();
  updateCartCount();
  bindAddToCart();
  bindCartDrawer();
  bindLogoutLinks();
  bindProductModal();
  bindAutoRails();
  bindFloatingCart();
  renderCartDrawer();
  renderShopSummary();
  renderCartPage();
  renderCheckoutPage();
  bindAdminForm();
  bindAdminProductForm();
  bindCommentForms();
});
