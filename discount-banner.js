// discount-banner.js
// هذا الملف يحتوي على شعار الخصم الذي سيتم إضافته تلقائياً لجميع الصفحات

(function() {
    // تأكد من تحميل الصفحة أولاً
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addDiscountBanner);
    } else {
        addDiscountBanner();
    }
    
    function addDiscountBanner() {
        // تحديد المكان المناسب لإضافة الشعار
        // يمكنك تغيير المحدد حسب هيكل صفحتك
        const targetSelectors = [
            '.product-details', 
            '.product-price', 
            '.product-description'
        ];
        
        let targetElement = null;
        
        // البحث عن أول عنصر متاح
        for (let selector of targetSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                targetElement = element;
                break;
            }
        }
        
        // إذا لم نجد أي عنصر، نبحث عن body
        if (!targetElement) {
            targetElement = document.body;
        }
        
        // إنشاء شعار الخصم
        const bannerHTML = `
        <style>
            .discount-banner-js {
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                color: white;
                border-radius: 12px;
                padding: 15px;
                margin: 20px 0;
                border: 2px solid #0ea5e9;
                box-shadow: 0 8px 20px rgba(14, 165, 233, 0.2);
                position: relative;
                overflow: hidden;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            
            .discount-banner-js::before {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: radial-gradient(circle, rgba(14, 165, 233, 0.1) 0%, transparent 70%);
                z-index: 0;
            }
            
            .discount-content-js {
                position: relative;
                z-index: 1;
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex-wrap: wrap;
                gap: 10px;
            }
            
            .discount-text-js {
                flex: 1;
                min-width: 200px;
            }
            
            .discount-title-js {
                font-size: 18px;
                font-weight: 700;
                margin-bottom: 5px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .discount-subtitle-js {
                font-size: 14px;
                opacity: 0.9;
                margin-bottom: 8px;
            }
            
            .discount-code-container-js {
                background: rgba(255, 255, 255, 0.1);
                border: 1px dashed rgba(255, 255, 255, 0.3);
                border-radius: 8px;
                padding: 10px 15px;
                display: inline-flex;
                align-items: center;
                gap: 10px;
                backdrop-filter: blur(5px);
            }
            
            .discount-percent-js {
                background: linear-gradient(45deg, #0ea5e9, #3b82f6);
                color: white;
                padding: 4px 12px;
                border-radius: 20px;
                font-weight: 800;
                font-size: 18px;
                animation: pulse 2s infinite;
            }
            
            .discount-code-js {
                font-family: 'Courier New', monospace;
                font-weight: 700;
                font-size: 22px;
                letter-spacing: 2px;
                color: #fbbf24;
            }
            
            .copy-btn-js {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                padding: 6px 12px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.3s;
                display: flex;
                align-items: center;
                gap: 5px;
            }
            
            .copy-btn-js:hover {
                background: rgba(255, 255, 255, 0.3);
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            
            @media (max-width: 768px) {
                .discount-content-js {
                    flex-direction: column;
                    text-align: center;
                }
                
                .discount-text-js {
                    text-align: center;
                }
                
                .discount-title-js {
                    justify-content: center;
                }
            }
        </style>
        
        <div class="discount-banner-js">
            <div class="discount-content-js">
                <div class="discount-text-js">
                    <div class="discount-title-js">
                        <span>🎮</span>
                        <span>Exclusive Gamer Deal!</span>
                    </div>
                    <div class="discount-subtitle-js">
                        Level up your style with this special discount for our GitHub community
                    </div>
                    <div class="discount-code-container-js">
                        <span class="discount-percent-js">25.01% OFF</span>
                        <span>Use Code:</span>
                        <span class="discount-code-js" id="couponCodeJS">2025</span>
                        <button class="copy-btn-js" id="copyBtnJS">
                            <i class="fas fa-copy"></i> Copy
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `;
        
        // إضافة الشعار بعد السعر مباشرة
        const priceElement = document.querySelector('.product-price');
        if (priceElement && priceElement.parentNode) {
            const bannerDiv = document.createElement('div');
            bannerDiv.innerHTML = bannerHTML;
            priceElement.parentNode.insertBefore(bannerDiv, priceElement.nextSibling);
        } else {
            // إذا لم نجد السعر، نضيفه في بداية product-details
            const bannerDiv = document.createElement('div');
            bannerDiv.innerHTML = bannerHTML;
            targetElement.insertBefore(bannerDiv, targetElement.firstChild);
        }
        
        // إضافة دالة النسخ بعد تحميل الشعار
        setTimeout(addCopyFunctionality, 100);
    }
    
    function addCopyFunctionality() {
        const copyBtn = document.getElementById('copyBtnJS');
        if (copyBtn) {
            copyBtn.addEventListener('click', function() {
                const code = document.getElementById('couponCodeJS').textContent;
                navigator.clipboard.writeText(code).then(() => {
                    copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    copyBtn.style.background = '#10b981';
                    
                    setTimeout(() => {
                        copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy';
                        copyBtn.style.background = '';
                    }, 2000);
                });
            });
        }
        
        // إضافة Font Awesome إذا لم تكن موجودة
        if (!document.querySelector('link[href*="font-awesome"]')) {
            const faLink = document.createElement('link');
            faLink.rel = 'stylesheet';
            faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
            document.head.appendChild(faLink);
        }
    }
})();
