// generate-pages.js - النسخة النهائية المحسنة
const fs = require('fs');
const path = require('path');

// دالة لحماية النصوص من مشاكل HTML
function escapeHtml(str = '') {
  if (typeof str !== 'string') return '';
  return str.replace(/[&<>"']/g, m => ({
    '&': '&amp;', 
    '<': '&lt;', 
    '>': '&gt;', 
    '"': '&quot;', 
    "'": '&#39;'
  }[m]));
}

// دالة لإنشاء رابط كامل للصورة
function getFullImageUrl(imagePath) {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `https://hoodexo.github.io/shirt/${imagePath}`;
}

// قراءة ملف products.json
try {
  const productsData = JSON.parse(fs.readFileSync('products.json', 'utf8'));
  const products = productsData.products || productsData;

  console.log(`📊 وجد ${products.length} منتج للمعالجة`);

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
  products.forEach(product => {
    const fullImageUrl = getFullImageUrl(product.image);
    const pageUrl = `https://hoodexo.github.io/shirt/product-${product.id}.html`;
    
    pageUrls.push(pageUrl);

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(product.title)} | Hoodexo - Premium Gamer T-Shirts</title>
  <meta name="description" content="${escapeHtml(product.metaDescription || product.description)}">
  <meta name="keywords" content="${escapeHtml(product.keywords || 'gamer t-shirts, gaming apparel, hoodexo')}">
  <meta name="robots" content="index, follow">
  <meta name="theme-color" content="#6a5af9">
  
  <!-- Canonical URL -->
  <link rel="canonical" href="${pageUrl}">
  
  <!-- Open Graph -->
  <meta property="og:title" content="${escapeHtml(product.title)}">
  <meta property="og:description" content="${escapeHtml(product.metaDescription || product.description)}">
  <meta property="og:image" content="${fullImageUrl}">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:type" content="product">
  <meta property="og:site_name" content="Hoodexo">
  
  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(product.title)}">
  <meta name="twitter:description" content="${escapeHtml(product.metaDescription || product.description)}">
  <meta name="twitter:image" content="${fullImageUrl}">
  <meta name="twitter:site" content="@hoodexo">
  
  <!-- Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "${escapeHtml(product.title)}",
    "description": "${escapeHtml(product.metaDescription || product.description)}",
    "image": "${fullImageUrl}",
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
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "24"
    }
  }
  </script>
  
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="styles.css">
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
            <img src="${product.image}" alt="${escapeHtml(product.imageAlt || product.title)}" loading="lazy">
          </div>
        </div>
        
        <div class="product-details">
          <h1 class="product-title">${escapeHtml(product.title)}</h1>
          <div class="product-price">$${product.price}</div>
          
          <p class="product-description">${escapeHtml(product.description)}</p>
          
          ${product.features && product.features.length > 0 ? `
          <div class="product-features">
            <ul class="feature-list">
              ${product.features.map(feature => 
                `<li><i class="fas fa-check"></i> ${escapeHtml(feature)}</li>`
              ).join('')}
            </ul>
          </div>
          ` : ''}
          
          <a href="${product.buyUrl}" target="_blank" rel="nofollow sponsored" class="btn btn-primary buy-now-btn">
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

  <!-- SEO Content -->
  <section class="seo-content">
    <div class="container">
      <h2>About ${escapeHtml(product.title)}</h2>
      <p>${escapeHtml(product.title)} is part of Hoodexo's premium collection of gaming apparel. Designed for comfort and style, this t-shirt features high-quality materials and durable prints that gamers love.</p>
      
      <div class="highlight-box">
        <p><strong>Why Gamers Love This Shirt:</strong> Perfect for gaming marathons, casual outings, or showing off your gaming personality. The soft cotton fabric and premium print ensure long-lasting comfort and vibrant designs.</p>
      </div>
      
      <h3>Product Details</h3>
      <ul>
        <li><strong>Material:</strong> 100% Premium Cotton</li>
        <li><strong>Fit:</strong> Classic Comfort Fit</li>
        <li><strong>Print:</strong> High-Quality DTG Technology</li>
        <li><strong>Care:</strong> Machine Washable</li>
        <li><strong>Sizes:</strong> S, M, L, XL, XXL</li>
      </ul>
    </div>
  </section>

  <!-- Footer -->
  <footer>
    <div class="container">
      <div class="footer-bottom">
        <p>&copy; 2025 Hoodexo. All rights reserved. | Premium Gaming Apparel</p>
      </div>
    </div>
  </footer>
</body>
</html>
    `;

    const fileName = `product-${product.id}.html`;
    const filePath = path.join('dist', fileName);
    
    fs.writeFileSync(filePath, htmlContent);
    console.log(`✅ تم إنشاء: ${fileName}`);
  });

  // إنشاء ملف sitemap.xml
  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pageUrls.map(url => `
  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url.includes('product-') ? '0.8' : '1.0'}</priority>
  </url>`).join('')}
</urlset>`;

  fs.writeFileSync('dist/sitemap.xml', sitemapContent);
  console.log('🗺️  تم إنشاء ملف sitemap.xml');

  // إنشاء ملف robots.txt
  const robotsContent = `User-agent: *
Allow: /
Disallow: /admin/

Sitemap: https://hoodexo.github.io/shirt/sitemap.xml`;

  fs.writeFileSync('dist/robots.txt', robotsContent);
  console.log('🤖 تم إنشاء ملف robots.txt');

  console.log(`🎉 اكتمل إنشاء ${products.length} صفحة منتج + sitemap.xml + robots.txt`);

} catch (error) {
  console.error('❌ خطأ:', error.message);
  process.exit(1);
}
