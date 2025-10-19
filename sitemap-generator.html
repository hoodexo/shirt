// ملف لتوليد sitemap ديناميكي من بيانات products.json
async function generateSitemap() {
    try {
        console.log('🔄 جاري إنشاء Sitemap...');
        
        const response = await fetch('products.json');
        const data = await response.json();
        
        let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  
  <!-- الصفحة الرئيسية -->
  <url>
    <loc>https://hoodexo.github.io/shirt/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- صفحة المنتجات الرئيسية -->
  <url>
    <loc>https://hoodexo.github.io/shirt/index.html</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;

        // إضافة كل منتج إلى sitemap
        data.products.forEach(product => {
            const productUrl = `https://hoodexo.github.io/shirt/product.html?id=${product.id}`;
            
            sitemapContent += `
  
  <!-- ${product.title} -->
  <url>
    <loc>${productUrl}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>https://hoodexo.github.io/shirt/${product.image}</image:loc>
      <image:title>${product.title.replace(/&/g, '&amp;')}</image:title>
      <image:caption>${product.metaDescription.replace(/&/g, '&amp;')}</image:caption>
    </image:image>`;
            
            // إضافة الصورة الخلفية إذا كانت موجودة
            if (product.backImage) {
                sitemapContent += `
    <image:image>
      <image:loc>https://hoodexo.github.io/shirt/${product.backImage}</image:loc>
      <image:title>${product.title.replace(/&/g, '&amp;')} - Back View</image:title>
    </image:image>`;
            }
            
            sitemapContent += `
  </url>`;
        });

        sitemapContent += '\n</urlset>';
        
        console.log('✅ Sitemap تم إنشاؤه بنجاح!');
        console.log(`📊 عدد الصفحات: ${data.products.length + 2}`);
        
        return sitemapContent;
        
    } catch (error) {
        console.error('❌ خطأ في إنشاء Sitemap:', error);
        return null;
    }
}

// دالة لتحميل Sitemap إلى الموقع
async function uploadSitemap() {
    const sitemapContent = await generateSitemap();
    
    if (sitemapContent) {
        // في بيئة GitHub Pages، يمكنك حفظ الملف يدوياً
        console.log('📝 انسخ محتوى Sitemap التالي واحفظه في ملف sitemap.xml:');
        console.log('=' .repeat(50));
        console.log(sitemapContent);
        console.log('=' .repeat(50));
        
        // إنشاء ملف للتحميل
        downloadSitemapFile(sitemapContent);
    }
}

// دالة لتحميل الملف
function downloadSitemapFile(content) {
    const blob = new Blob([content], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// تشغيل التوليد عند الطلب
window.generateSitemap = generateSitemap;
window.uploadSitemap = uploadSitemap;
