// متغير عام لتخزين بيانات المنتجات مؤقتاً
let productsCache = null;

document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  
  if (!productId) {
    // إذا لم يكن هناك معرف منتج، استخدم المنتج الأول أو أعد التوجيه
    window.location.href = "https://hoodexo.github.io/shirt/index.html";
    return;
  }

  loadProductsData(productId);
});

// دالة لتحميل بيانات المنتجات مع التخزين المؤقت
function loadProductsData(productId) {
  // التحقق من وجود بيانات مخزنة مسبقاً
  const cachedData = localStorage.getItem("productsData");
  const cacheTimestamp = localStorage.getItem("productsDataTimestamp");
  const now = Date.now();
  const oneHour = 60 * 60 * 1000; // ساعة واحدة

  if (cachedData && cacheTimestamp && (now - cacheTimestamp) < oneHour) {
    // استخدام البيانات المخزنة إذا كانت حديثة
    productsCache = JSON.parse(cachedData);
    processProducts(productsCache, productId);
  } else {
    // جلب بيانات جديدة من السيرفر
    fetch("products.json")
      .then(response => {
        if (!response.ok) throw new Error('Failed to load products data');
        return response.json();
      })
      .then(data => {
        productsCache = data;
        // تخزين البيانات مع timestamp
        localStorage.setItem("productsData", JSON.stringify(data));
        localStorage.setItem("productsDataTimestamp", now.toString());
        processProducts(data, productId);
      })
      .catch(error => {
        console.error("Error loading products data:", error);
        // محاولة استخدام البيانات المخزنة حتى لو كانت قديمة
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
  // تحسين العنوان لمحركات البحث
  document.title = `${product.title} | Premium Gamer T-Shirt | Gamer Tees`;
  
  // تحديث Meta Description
  updateMetaTag('name', 'description', product.metaDescription);
  
  // تحديث Keywords
  updateMetaTag('name', 'keywords', product.keywords);
  
  // تحديث Open Graph Tags
  updateMetaTag('property', 'og:title', product.title);
  updateMetaTag('property', 'og:description', product.metaDescription);
  updateMetaTag('property', 'og:url', window.location.href);
  updateMetaTag('property', 'og:image', `https://hoodexo.github.io/shirt/${product.image}`);
  updateMetaTag('property', 'og:type', 'product');
  updateMetaTag('property', 'og:site_name', 'Gamer Tees');
  
  // تحديث Twitter Cards
  updateMetaTag('name', 'twitter:title', product.title);
  updateMetaTag('name', 'twitter:description', product.metaDescription);
  updateMetaTag('name', 'twitter:image', `https://hoodexo.github.io/shirt/${product.image}`);
  updateMetaTag('name', 'twitter:card', 'summary_large_image');
  updateMetaTag('name', 'twitter:site', '@GamerTees');
}

// دالة مساعدة لتحديث/إنشاء meta tags
function updateMetaTag(attr, name, content) {
  let meta = document.querySelector(`meta[${attr}="${name}"]`);
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute(attr, name);
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
}

// تحديث Canonical Link
function updateCanonicalLink(productId) {
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = `https://hoodexo.github.io/shirt/product-${productId}.html`;
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
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": window.location.href
    }
  };

  // إزالة الـ Schema القديم إذا وجد
  const oldSchema = document.getElementById('dynamic-product-schema');
  if (oldSchema) oldSchema.remove();

  // إضافة الـ Schema الجديد
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = 'dynamic-product-schema';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

// تحديث محتوى الصفحة
function updatePageContent(product) {
  // العناصر الأساسية
  const elements = {
    'productTitle': product.title,
    'productPrice': `$${product.price}`,
    'productDescription': product.description,
    'breadcrumbProduct': product.title,
    'tabDescription': product.tabDescription || product.description
  };

  for (const [id, content] of Object.entries(elements)) {
    const element = document.getElementById(id);
    if (element) element.textContent = content;
  }

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
  
  // تحديث محتوى الـ SEO الديناميكي
  updateSeoContent(product);
}

// تحديث الصور المصغرة للمنتج
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

  // إضافة مستمع الأحداث للصور المصغرة
  addThumbnailEvents();
}

// إضافة مستمع الأحداث للصور المصغرة
function addThumbnailEvents() {
  document.querySelectorAll('.thumbnail').forEach(thumb => {
    thumb.addEventListener('click', function() {
      // إزالة النشاط من جميع الصور المصغرة
      document.querySelectorAll('.thumbnail').forEach(t => {
        t.classList.remove('active');
      });
      
      // إضافة النشاط للصورة المختارة
      this.classList.add('active');
      
      // تغيير الصورة الرئيسية
      const newImage = this.getAttribute('data-image');
      const newAlt = this.querySelector('img').alt;
      document.getElementById('mainImage').src = newImage;
      document.getElementById('mainImage').alt = newAlt;
    });
  });
}

// تحديث قسم الـ SEO بالمحتوى الفريد لكل منتج
function updateSeoContent(product) {
  const seoContent = document.querySelector('.tab-content#description');
  if (!seoContent) return;

  // تحديث محتوى التبويب
  const descriptionElement = seoContent.querySelector('p');
  if (descriptionElement) {
    descriptionElement.textContent = product.tabDescription || product.description;
  }
}

// تحديث المنتجات ذات الصلة
function updateRelatedProducts(productsData, currentProductId) {
  const relatedProductsGrid = document.getElementById('relatedProducts');
  if (!relatedProductsGrid) return;
  
  // تصفية المنتجات (إزالة المنتج الحالي)
  let availableProducts = productsData.filter(product => product.id !== currentProductId);
  
  // إذا لم يكن هناك منتجات كافية، نعرض جميع المنتجات
  if (availableProducts.length < 4) {
    availableProducts = productsData;
  }
  
  // خلط المنتجات عشوائياً
  const shuffledProducts = [...availableProducts].sort(() => 0.5 - Math.random());
  
  // اختيار 4 منتجات عشوائية
  const selectedProducts = shuffledProducts.slice(0, 4);
  
  // إنشاء HTML للمنتجات ذات الصلة
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
        <a href="https://hoodexo.github.io/shirt/index.html" class="btn btn-primary" style="display:inline-block;margin-top:15px">
          ← Back to All Products
        </a>
      </div>
    `;
  }
}

// إضافة مستمع لأحداث الصفحة
window.addEventListener('load', function() {
  // إضافة أحداث التحكم بالكمية
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

  // إضافة أحداث التبويبات
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function() {
      // إزالة النشاط من جميع التبويبات
      document.querySelectorAll('.tab').forEach(t => {
        t.classList.remove('active');
      });
      
      // إضافة النشاط للتبويب المختار
      this.classList.add('active');
      
      // إخفاء جميع محتويات التبويبات
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });
      
      // إظهار محتوى التبويب المختار
      const tabId = this.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });

  // إضافة أحداث اختيار المقاس
  document.querySelectorAll('.size-option').forEach(size => {
    size.addEventListener('click', function() {
      // إزالة التحديد من جميع المقاسات
      document.querySelectorAll('.size-option').forEach(s => {
        s.classList.remove('selected');
      });
      
      // إضافة التحديد للمقاس المختار
      this.classList.add('selected');
    });
  });
});

// دالة لتفريخ التخزين المؤقت (للاستخدام أثناء التطوير)
function clearProductsCache() {
  localStorage.removeItem("productsData");
  localStorage.removeItem("productsDataTimestamp");
  console.log("Products cache cleared");
  location.reload();
}
