// generate-pages.js - النسخة المصححة
const fs = require('fs');
const path = require('path');

// دالة لحماية النصوص من مشاكل HTML
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[&<>"']/g, function(m) {
    return {
      '&': '&amp;', 
      '<': '&lt;', 
      '>': '&gt;', 
      '"': '&quot;', 
      "'": '&#39;'
    }[m];
  });
}

// قراءة ملف products.json
try {
  const productsData = JSON.parse(fs.readFileSync('products.json', 'utf8'));
  const products = productsData.products || productsData;

  console.log('📊 وجد ' + products.length + ' منتج للمعالجة');

  // إنشاء مجلد dist إذا لم يكن موجوداً
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
    console.log('📁 تم إنشاء مجلد dist');
  }

  // مصفوفة لحفظ روابط الصفحات لملف sitemap
  const pageUrls = [
    'https://hoodexo.github.io/shirt/index.html'
  ];

  // توليد صفحة لكل منتج
  products.forEach(function(product) {
    const pageUrl = 'https://hoodexo.github.io/shirt/dist/product-' + product.id + '.html';
    pageUrls.push(pageUrl);

    // معالجة الميزات إذا كانت موجودة
    let featuresHTML = '';
    if (product.features && product.features.length > 0) {
      featuresHTML = product.features.map(function(feature) {
        return '<li><i class="fas fa-check"></i> ' + escapeHtml(feature) + '</li>';
      }).join('');
    }

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(product.title)} | Hoodexo</title>
  <meta name="description" content="${escapeHtml(product.metaDescription || product.description)}">
  <meta name="keywords" content="${escapeHtml(product.keywords || 'gamer t-shirts, hoodexo')}">
  <meta name="robots" content="index, follow">
  
  <!-- Canonical URL -->
  <link rel="canonical" href="${pageUrl}">
  
  <!-- Open Graph -->
  <meta property="og:title" content="${escapeHtml(product.title)}">
  <meta property="og:description" content="${escapeHtml(product.metaDescription || product.description)}">
  <meta property="og:image" content="https://hoodexo.github.io/shirt/${product.image}">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:type" content="product">
  
  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(product.title)}">
  <meta name="twitter:description" content="${escapeHtml(product.metaDescription || product.description)}">
  <meta name="twitter:image" content="https://hoodexo.github.io/shirt/${product.image}">
  
  <!-- Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "${escapeHtml(product.title)}",
    "description": "${escapeHtml(product.metaDescription || product.description)}",
    "image": "https://hoodexo.github.io/shirt/${product.image}",
    "sku": "${escapeHtml(product.id)}",
    "brand": {
      "@type": "Brand",
      "name": "Hoodexo"
    },
    "offers": {
      "@type": "Offer",
      "url": "${pageUrl}",
      "priceCurrency": "USD",
      "price": "${product.price}",
      "availability": "https://schema.org/InStock"
    }
  }
  </script>
  
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../styles.css">
</head>
<body>
  <!-- Header -->
  <header>
    <div class="container header-container">
      <div class="logo">
        <i class="fas fa-gamepad"></i>
        <span>Hoodexo</span>
      </div>
      <nav>
        <ul>
          <li><a href="../index.html">Home</a></li>
          <li><a href="../index.html#products">Shop</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <!-- Breadcrumb -->
  <div class="container">
    <div class="breadcrumb">
      <a href="../index.html">Home</a> <span>/</span>
      <a href="../index.html#products">Shop</a> <span>/</span>
      <span>${escapeHtml(product.title)}</span>
    </div>
  </div>

  <!-- Product Section -->
  <section class="product-section">
    <div class="container">
      <div class="product-container">
        <div class="product-gallery">
          <div class="product-badge">In Stock</div>
          <div class="main-image">
            <img src="../${product.image}" alt="${escapeHtml(product.imageAlt || product.title)}">
          </div>
        </div>
        
        <div class="product-details">
          <h1 class="product-title">${escapeHtml(product.title)}</h1>
          <div class="product-price">$${product.price}</div>
          
          <p class="product-description">${escapeHtml(product.description)}</p>
          
          ${featuresHTML ? `
          <div class="product-features">
            <ul class="feature-list">
              ${featuresHTML}
            </ul>
          </div>
          ` : ''}
          
          <a href="${product.buyUrl}" target="_blank" rel="nofollow" class="btn btn-primary buy-now-btn">
            <i class="fas fa-bolt"></i> Get It Now
          </a>

          <div class="product-meta">
            <div class="meta-item">
              <i class="fas fa-truck"></i> Free shipping on orders over $50
            </div>
            <div class="meta-item">
              <i class="fas fa-undo"></i> 30-day easy returns
            </div>
            <div class="meta-item">
              <i class="fas fa-shield-alt"></i> 1-year warranty on prints
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer>
    <div class="container">
      <div class="footer-bottom">
        <p>&copy; 2025 Hoodexo. All rights reserved.</p>
      </div>
    </div>
  </footer>
</body>
</html>`;

    const fileName = 'product-' + product.id + '.html';
    const filePath = path.join('dist', fileName);
    
    fs.writeFileSync(filePath, htmlContent);
    console.log('✅ تم إنشاء: ' + fileName);
  });

  // إنشاء ملف sitemap.xml
  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pageUrls.map(function(url) {
    return `
  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url.includes('product-') ? '0.8' : '1.0'}</priority>
  </url>`;
  }).join('')}
</urlset>`;

  fs.writeFileSync('dist/sitemap.xml', sitemapContent);
  console.log('🗺️  تم إنشاء ملف sitemap.xml');

  console.log('🎉 اكتمل إنشاء ' + products.length + ' صفحة منتج + sitemap.xml');

} catch (error) {
  console.error('❌ خطأ: ' + error.message);
  process.exit(1);
}
