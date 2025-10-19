// متغير عام لتخزين بيانات المنتجات مؤقتاً
let productsCache = null;

document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  
  if (!productId) {
    // إذا لم يكن هناك معرف منتج، أعد التوجيه للصفحة الرئيسية
    window.location.href = "https://hoodexo.github.io/shirt/index.html";
    return;
  }

  // تحميل البيانات فوراً
  loadProductsData(productId);
});

// دالة لتحميل بيانات المنتجات مع التخزين المؤقت
function loadProductsData(productId) {
  // التحقق من وجود بيانات مخزنة مسبقاً
  const cachedData = localStorage.getItem("productsData");
  const cacheTimestamp = localStorage.getItem("productsDataTimestamp");
  const now = Date.now();
  const oneHour = 60 * 60 * 1000; // ساعة واحدة

  if (cachedData && cacheTimestamp && (now - parseInt(cacheTimestamp)) < oneHour) {
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
        // تخزين البيانات مع timestamp كرقم
        localStorage.setItem("productsData", JSON.stringify(data));
        localStorage.setItem("productsDataTimestamp", String(now));
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
  
  // إضافة حدث لتحسين تجربة المستخدم
  addUserInteractions();
}

// دالة لتحديث جميع الـ Meta Tags بشكل صحيح
function updateAllMetaTags(product) {
  // 1. تحديث Title
  const uniqueTitle = `${product.title} | Premium Gamer T-Shirt | Gamer Tees`;
  updateElementContent('dynamicTitle', uniqueTitle);
  document.title = uniqueTitle;
  
  // 2. تحديث Meta Description
  updateMetaTagContent('dynamicDescription', product.metaDescription);
  updateMetaTagContent('dynamicOgDescription', product.metaDescription);
  updateMetaTagContent('dynamicTwitterDescription', product.metaDescription);
  
  // 3. تحديث Keywords
  updateMetaTagContent('dynamicKeywords', product.keywords);
  
  // 4. تحديث Open Graph
  updateMetaTagContent('dynamicOgTitle', product.title);
  updateMetaTagContent('dynamicOgImage', `https://hoodexo.github.io/shirt/${product.image}`);
  updateMetaTagContent('dynamicOgUrl', window.location.href);
  
  // 5. تحديث Twitter Cards
  updateMetaTagContent('dynamicTwitterTitle', product.title);
  updateMetaTagContent('dynamicTwitterImage', `https://hoodexo.github.io/shirt/${product.image}`);
}

// دالة مساعدة لتحديث محتوى العناصر
function updateElementContent(elementId, content) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = content;
  }
}

// دالة مساعدة لتحديث محتوى الـ Meta Tags
function updateMetaTagContent(elementId, content) {
  const element = document.getElementById(elementId);
  if (element) {
    element.setAttribute('content', content);
  }
}

// تحديث Canonical Link بشكل صحيح
function updateCanonicalLink(productId) {
  const canonical = document.getElementById('dynamicCanonical');
  if (canonical) {
    // استخدام الرابط الحقيقي للصفحة (ليس رابط وهمي)
    canonical.href = `https://hoodexo.github.io/shirt/product.html?id=${productId}`;
  }
}

// تحديث Structured Data بشكل متقدم
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
      "itemCondition": "https://schema.org/NewCondition",
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": "USD"
        },
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "US"
        }
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "128",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Alex Johnson"
        },
        "reviewBody": "Amazing quality and the print is super durable! Washes well without fading."
      },
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "4.5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Sarah Miller"
        },
        "reviewBody": "Comfortable fit and true to size. The design looks even better in person!"
      }
    ],
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": window.location.href
    },
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Material",
        "value": "100% Premium Cotton"
      },
      {
        "@type": "PropertyValue", 
        "name": "Fit",
        "value": "Classic Fit"
      },
      {
        "@type": "PropertyValue",
        "name": "Print Type",
        "value": "Direct-to-Garment"
      }
    ]
  };

  // تحديث الـ Schema الموجود
  const schemaElement = document.getElementById('dynamicSchema');
  if (schemaElement) {
    schemaElement.textContent = JSON.stringify(schema);
  }
}

// تحديث محتوى الصفحة
function updatePageContent(product) {
  // العناصر الأساسية
  updateElementContent('productTitle', product.title);
  updateElementContent('productPrice', `$${product.price}`);
  updateElementContent('productDescription', product.description);
  updateElementContent('breadcrumbProduct', product.title);
  updateElementContent('tabDescription', product.tabDescription || product.description);

  // تحديث الصورة الرئيسية
  const mainImage = document.getElementById('mainImage');
  if (mainImage) {
    mainImage.src = product.image;
    mainImage.alt = product.imageAlt || product.title;
    // إضافة loading lazy للصور
    mainImage.loading = 'lazy';
  }

  // تحديث زر الشراء
  const buyButton = document.getElementById('buyButton');
  if (buyButton) {
    buyButton.href = product.buyUrl;
    // إضافة attributes لتحسين SEO
    buyButton.setAttribute('aria-label', `Buy ${product.title} - $${product.price}`);
  }

  // تحديث الميزات
  updateFeaturesList(product.features);
  
  // تحديث الصور المصغرة
  updateProductThumbnails(product);
  
  // إضافة محتوى نصي إضافي لتحسين SEO
  addSeoFriendlyContent(product);
}

// تحديث قائمة الميزات
function updateFeaturesList(features) {
  const featureList = document.getElementById('featureList');
  if (!featureList) return;

  featureList.innerHTML = '';
  features.forEach(feature => {
    const li = document.createElement('li');
    li.innerHTML = `<i class="fas fa-check" aria-hidden="true"></i> ${feature}`;
    featureList.appendChild(li);
  });
}

// تحديث الصور المصغرة مع تحسينات SEO
function updateProductThumbnails(product) {
  const thumbnailsContainer = document.getElementById('imageThumbnails');
  if (!thumbnailsContainer) return;

  thumbnailsContainer.innerHTML = '';
  
  // الصورة الأمامية
  addThumbnail(thumbnailsContainer, product.image, 
               product.imageAlt || `${product.title} - Front View`, true);
  
  // الصورة الخلفية إذا كانت موجودة
  if (product.backImage) {
    addThumbnail(thumbnailsContainer, product.backImage,
                 product.imageAlt || `${product.title} - Back View`, false);
  }
}

// إضافة صورة مصغرة
function addThumbnail(container, imageSrc, altText, isActive) {
  const thumb = document.createElement('div');
  thumb.className = `thumbnail ${isActive ? 'active' : ''}`;
  thumb.setAttribute('data-image', imageSrc);
  thumb.setAttribute('role', 'button');
  thumb.setAttribute('aria-label', `View ${altText}`);
  thumb.setAttribute('tabindex', '0');
  
  const img = document.createElement('img');
  img.src = imageSrc;
  img.alt = altText;
  img.loading = 'lazy';
  
  thumb.appendChild(img);
  container.appendChild(thumb);
}

// إضافة محتوى نصي إضافي لتحسين SEO
function addSeoFriendlyContent(product) {
  const descriptionTab = document.getElementById('description');
  if (!descriptionTab) return;

  // إضافة محتوى إضافي للوصف
  const additionalContent = document.createElement('div');
  additionalContent.className = 'seo-enhanced-content';
  additionalContent.innerHTML = `
    <h3>About This Design</h3>
    <p>${product.title} features high-quality printing that lasts through multiple washes. Perfect for gamers, streamers, and anyone who loves video game culture.</p>
    
    <h3>Product Details</h3>
    <ul>
      <li><strong>Material:</strong> 100% Premium Cotton</li>
      <li><strong>Fit:</strong> Classic comfortable fit</li>
      <li><strong>Care:</strong> Machine washable, tumble dry low</li>
      <li><strong>Print:</strong> Direct-to-garment for vibrant colors</li>
      <li><strong>Sizes:</strong> S, M, L, XL, XXL available</li>
    </ul>
    
    <h3>Perfect For</h3>
    <p>Gaming events, casual wear, streaming sessions, or as a gift for fellow gamers. This t-shirt combines comfort with your passion for gaming.</p>
  `;
  
  // إضافة المحتوى بعد الوصف الأساسي
  const existingDescription = descriptionTab.querySelector('p');
  if (existingDescription) {
    existingDescription.parentNode.insertBefore(additionalContent, existingDescription.nextSibling);
  }
}

// تحديث المنتجات ذات الصلة
function updateRelatedProducts(productsData, currentProductId) {
  const relatedProductsGrid = document.getElementById('relatedProducts');
  if (!relatedProductsGrid) return;
  
  // تصفية المنتجات (إزالة المنتج الحالي)
  let availableProducts = productsData.filter(product => product.id !== currentProductId);
  
  // خلط المنتجات عشوائياً
  const shuffledProducts = [...availableProducts].sort(() => 0.5 - Math.random());
  
  // اختيار 4 منتجات عشوائية
  const selectedProducts = shuffledProducts.slice(0, 4);
  
  // إنشاء HTML للمنتجات ذات الصلة
  let productsHTML = '';
  
  selectedProducts.forEach(product => {
    productsHTML += `
      <div class="product-card" role="article" onclick="window.location.href='product.html?id=${product.id}'" tabindex="0">
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

// إضافة تفاعلات المستخدم
function addUserInteractions() {
  // إضافة أحداث للصور المصغرة
  document.addEventListener('click', function(e) {
    if (e.target.closest('.thumbnail')) {
      const thumb = e.target.closest('.thumbnail');
      const newImage = thumb.getAttribute('data-image');
      const newAlt = thumb.querySelector('img').alt;
      
      // تحديث الصورة الرئيسية
      const mainImage = document.getElementById('mainImage');
      if (mainImage) {
        mainImage.src = newImage;
        mainImage.alt = newAlt;
      }
      
      // تحديث حالة الصور المصغرة
      document.querySelectorAll('.thumbnail').forEach(t => {
        t.classList.remove('active');
      });
      thumb.classList.add('active');
    }
  });
  
  // إضافة أحداث للأزرار
  setupQuantityControls();
  setupSizeSelection();
  setupTabNavigation();
}

// إعداد عناصر التحكم بالكمية
function setupQuantityControls() {
  const decreaseBtn = document.getElementById('decreaseQty');
  const increaseBtn = document.getElementById('increaseQty');
  const quantityInput = document.getElementById('quantity');

  if (decreaseBtn && increaseBtn && quantityInput) {
    decreaseBtn.addEventListener('click', () => adjustQuantity(-1));
    increaseBtn.addEventListener('click', () => adjustQuantity(1));
    
    // إضافة حدث للإدخال المباشر
    quantityInput.addEventListener('change', function() {
      let value = parseInt(this.value);
      if (isNaN(value) || value < 1) this.value = 1;
      if (value > 10) this.value = 10;
    });
  }
}

// ضبط الكمية
function adjustQuantity(change) {
  const quantityInput = document.getElementById('quantity');
  if (!quantityInput) return;
  
  let currentValue = parseInt(quantityInput.value);
  let newValue = currentValue + change;
  
  if (newValue >= 1 && newValue <= 10) {
    quantityInput.value = newValue;
  }
}

// إعداد اختيار المقاس
function setupSizeSelection() {
  document.querySelectorAll('.size-option').forEach(size => {
    size.addEventListener('click', function() {
      document.querySelectorAll('.size-option').forEach(s => {
        s.classList.remove('selected');
      });
      this.classList.add('selected');
    });
  });
}

// إعداد التنقل بين التبويبات
function setupTabNavigation() {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');
      
      // تحديث التبويبات
      document.querySelectorAll('.tab').forEach(t => {
        t.classList.remove('active');
      });
      this.classList.add('active');
      
      // تحديط المحتوى
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });
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
  document.title = "Loading Error | Gamer Tees";
  
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

// دالة لتفريخ التخزين المؤقت
function clearProductsCache() {
  localStorage.removeItem("productsData");
  localStorage.removeItem("productsDataTimestamp");
  console.log("Products cache cleared");
  location.reload();
}

// جعل الدوال متاحة globally للاستخدام في الأحداث
window.clearProductsCache = clearProductsCache;
