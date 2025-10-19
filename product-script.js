<script>
// متغير عام لتخزين بيانات المنتجات مؤقتاً
let productsCache = null;

document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  
  if (!productId) {
    window.location.href = "https://hoodexo.github.io/shirt/index.html";
    return;
  }

  loadProductsData(productId);
});

// دالة لتحميل بيانات المنتجات مع التخزين المؤقت
function loadProductsData(productId) {
  const cachedData = localStorage.getItem("productsData");
  const cacheTimestamp = localStorage.getItem("productsDataTimestamp");
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;

  if (cachedData && cacheTimestamp && (now - parseInt(cacheTimestamp)) < oneHour) {
    productsCache = JSON.parse(cachedData);
    processProducts(productsCache, productId);
  } else {
    fetch("products.json")
      .then(response => {
        if (!response.ok) throw new Error('Failed to load products data');
        return response.json();
      })
      .then(data => {
        productsCache = data;
        localStorage.setItem("productsData", JSON.stringify(data));
        localStorage.setItem("productsDataTimestamp", String(now));
        processProducts(data, productId);
      })
      .catch(error => {
        console.error("Error loading products data:", error);
        if (cachedData) {
          productsCache = JSON.parse(cachedData);
          processProducts(productsCache, productId);
        } else {
          showErrorState();
        }
      });
  }
}

// دالة معالجة البيانات بعد التحميل
function processProducts(data, productId) {
  // البيانات تأتي مباشرة كمصفوفة products وليس ككائن
  const product = data.products.find(p => p.id === productId);
  if (!product) {
    showProductNotFound();
    return;
  }

  updateAllMetaTags(product);
  updateStructuredData(product);
  updatePageContent(product);
  updateRelatedProducts(data.products, productId);
  updateCanonicalLink(productId);
}

// دالة لتحديث جميع الـ Meta Tags
function updateAllMetaTags(product) {
  // 1. تحديث Title
  const uniqueTitle = `${product.title} | Premium Gamer T-Shirt | Gamer Tees`;
  document.title = uniqueTitle;
  document.getElementById('dynamicTitle').textContent = uniqueTitle;
  
  // 2. تحديث Meta Description
  document.getElementById('dynamicDescription').setAttribute('content', product.metaDescription);
  document.getElementById('dynamicOgDescription').setAttribute('content', product.metaDescription);
  document.getElementById('dynamicTwitterDescription').setAttribute('content', product.metaDescription);
  
  // 3. تحديث Keywords
  document.getElementById('dynamicKeywords').setAttribute('content', product.keywords);
  
  // 4. تحديث Open Graph
  document.getElementById('dynamicOgTitle').setAttribute('content', product.title);
  document.getElementById('dynamicOgImage').setAttribute('content', `https://hoodexo.github.io/shirt/${product.image}`);
  document.getElementById('dynamicOgUrl').setAttribute('content', window.location.href);
  
  // 5. تحديث Twitter Cards
  document.getElementById('dynamicTwitterTitle').setAttribute('content', product.title);
  document.getElementById('dynamicTwitterImage').setAttribute('content', `https://hoodexo.github.io/shirt/${product.image}`);
}

// تحديث Canonical Link
function updateCanonicalLink(productId) {
  const canonical = document.getElementById('dynamicCanonical');
  if (canonical) {
    canonical.href = `https://hoodexo.github.io/shirt/product.html?id=${productId}`;
  }
}

// تحديث Structured Data
function updateStructuredData(product) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "description": product.metaDescription,
    "url": window.location.href,
    "image": `https://hoodexo.github.io/shirt/${product.image}`,
    "sku": product.id,
    "brand": {
      "@type": "Brand",
      "name": "Gamer Tees"
    },
    "offers": {
      "@type": "Offer",
      "url": window.location.href,
      "priceCurrency": "USD",
      "price": product.price,
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "128"
    }
  };

  const schemaElement = document.getElementById('dynamicSchema');
  if (schemaElement) {
    schemaElement.textContent = JSON.stringify(schema);
  }
}

// تحديث محتوى الصفحة
function updatePageContent(product) {
  // العناصر الأساسية
  document.getElementById('productTitle').textContent = product.title;
  document.getElementById('productPrice').textContent = `$${product.price}`;
  document.getElementById('productDescription').textContent = product.description;
  document.getElementById('breadcrumbProduct').textContent = product.title;
  document.getElementById('tabDescription').textContent = product.tabDescription || product.description;

  // تحديث الصورة الرئيسية
  const mainImage = document.getElementById('mainImage');
  if (mainImage) {
    mainImage.src = product.image;
    mainImage.alt = product.imageAlt || product.title;
  }

  // تحديث زر الشراء
  const buyButton = document.getElementById('buyButton');
  if (buyButton) {
    buyButton.href = product.buyUrl;
  }

  // تحديث الميزات
  const featureList = document.getElementById('featureList');
  if (featureList) {
    featureList.innerHTML = '';
    product.features.forEach(feature => {
      const li = document.createElement('li');
      li.innerHTML = `<i class="fas fa-check"></i> ${feature}`;
      featureList.appendChild(li);
    });
  }

  // تحديث الصور المصغرة
  updateProductThumbnails(product);
}

// تحديث الصور المصغرة
function updateProductThumbnails(product) {
  const thumbnailsContainer = document.getElementById('imageThumbnails');
  if (!thumbnailsContainer) return;

  thumbnailsContainer.innerHTML = '';
  
  // الصورة الأمامية
  const frontThumb = document.createElement('div');
  frontThumb.className = 'thumbnail active';
  frontThumb.setAttribute('data-image', product.image);
  frontThumb.innerHTML = `<img src="${product.image}" alt="${product.imageAlt || `${product.title} - Front View`}">`;
  thumbnailsContainer.appendChild(frontThumb);
  
  // الصورة الخلفية إذا كانت موجودة
  if (product.backImage) {
    const backThumb = document.createElement('div');
    backThumb.className = 'thumbnail';
    backThumb.setAttribute('data-image', product.backImage);
    backThumb.innerHTML = `<img src="${product.backImage}" alt="${product.imageAlt || `${product.title} - Back View`}">`;
    thumbnailsContainer.appendChild(backThumb);
  }

  // إضافة أحداث النقر للصور المصغرة
  addThumbnailEvents();
}

// إضافة أحداث للصور المصغرة
function addThumbnailEvents() {
  document.querySelectorAll('.thumbnail').forEach(thumb => {
    thumb.addEventListener('click', function() {
      document.querySelectorAll('.thumbnail').forEach(t => {
        t.classList.remove('active');
      });
      this.classList.add('active');
      
      const newImage = this.getAttribute('data-image');
      const newAlt = this.querySelector('img').alt;
      document.getElementById('mainImage').src = newImage;
      document.getElementById('mainImage').alt = newAlt;
    });
  });
}

// تحديث المنتجات ذات الصلة
function updateRelatedProducts(productsData, currentProductId) {
  const relatedProductsGrid = document.getElementById('relatedProducts');
  if (!relatedProductsGrid) return;
  
  let availableProducts = productsData.filter(product => product.id !== currentProductId);
  
  if (availableProducts.length < 4) {
    availableProducts = productsData;
  }
  
  const shuffledProducts = [...availableProducts].sort(() => 0.5 - Math.random());
  const selectedProducts = shuffledProducts.slice(0, 4);
  
  let productsHTML = '';
  
  selectedProducts.forEach(product => {
    productsHTML += `
      <div class="product-card" onclick="window.location.href='product.html?id=${product.id}'">
        <div class="product-card-img">
          <img src="${product.image}" alt="${product.imageAlt || product.title}" 
               onerror="this.onerror=null; this.src='https://hoodexo.github.io/shirt/images/default-product.jpg';"
               loading="lazy">
        </div>
        <div class="product-card-info">
          <h3 class="product-card-title">${product.title}</h3>
          <div class="product-card-price">$${product.price}</div>
        </div>
      </div>
    `;
  });
  
  relatedProductsGrid.innerHTML = productsHTML;
}

// إضافة الأحداث التفاعلية
function addUserInteractions() {
  // أحداث التحكم بالكمية
  const decreaseBtn = document.getElementById('decreaseQty');
  const increaseBtn = document.getElementById('increaseQty');
  const quantityInput = document.getElementById('quantity');

  if (decreaseBtn && increaseBtn && quantityInput) {
    decreaseBtn.addEventListener('click', function() {
      let currentValue = parseInt(quantityInput.value);
      if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
      }
    });

    increaseBtn.addEventListener('click', function() {
      let currentValue = parseInt(quantityInput.value);
      if (currentValue < 10) {
        quantityInput.value = currentValue + 1;
      }
    });
  }

  // أحداث اختيار المقاس
  document.querySelectorAll('.size-option').forEach(size => {
    size.addEventListener('click', function() {
      document.querySelectorAll('.size-option').forEach(s => {
        s.classList.remove('selected');
      });
      this.classList.add('selected');
    });
  });

  // أحداث التبويبات
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.tab').forEach(t => {
        t.classList.remove('active');
      });
      this.classList.add('active');
      
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });
      
      const tabId = this.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });
}

// عرض رسالة عندما لا يكون المنتج موجوداً
function showProductNotFound() {
  document.title = "Product Not Found | Gamer Tees";
  
  const productContainer = document.querySelector('.product-container');
  if (productContainer) {
    productContainer.innerHTML = `
      <div class="loading" style="text-align:center;padding:50px;grid-column:1/-1">
        <div style="font-size:4rem;margin-bottom:20px">👕</div>
        <h2 style="margin-bottom:15px;color:var(--primary)">Product Not Found</h2>
        <p style="margin-bottom:25px;font-size:1.1rem">The product you're looking for doesn't exist or may have been removed.</p>
        <a href="https://hoodexo.github.io/shirt/index.html" class="btn btn-primary" style="display:inline-block;margin-top:15px">
          ← Back to All Products
        </a>
      </div>
    `;
  }
}

// عرض حالة الخطأ
function showErrorState() {
  const productContainer = document.querySelector('.product-container');
  if (productContainer) {
    productContainer.innerHTML = `
      <div class="loading" style="text-align:center;padding:50px;grid-column:1/-1">
        <div style="font-size:4rem;margin-bottom:20px">⚠️</div>
        <h2 style="margin-bottom:15px;color:var(--primary)">Connection Error</h2>
        <p style="margin-bottom:25px;font-size:1.1rem">Unable to load product data. Please check your connection and try again.</p>
        <button onclick="location.reload()" class="btn btn-primary" style="display:inline-block;margin-top:15px">
          🔄 Try Again
        </button>
      </div>
    `;
  }
}

// إضافة الأحداث بعد تحميل المحتوى
setTimeout(addUserInteractions, 1000);

// دالة لتفريخ التخزين المؤقت
function clearProductsCache() {
  localStorage.removeItem("productsData");
  localStorage.removeItem("productsDataTimestamp");
  console.log("Products cache cleared");
  location.reload();
}

window.clearProductsCache = clearProductsCache;
</script>
