const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  try {
    console.log('🚀 بدء عملية التحويل...');

    const browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // 1. ضبط حجم الشاشة ليحاكي ورقة A4 بدقة عالية لضمان عدم تداخل العناصر
    await page.setViewport({
      width: 1240, // عرض A4 بالبكسل عند دقة عالية
      height: 1754,
      deviceScaleFactor: 2 // لزيادة دقة الصور والنصوص
    });

    const htmlFile = path.resolve(__dirname, 'index.html');
    if (!fs.existsSync(htmlFile)) {
      throw new Error(`❌ لم يتم العثور على الملف: ${htmlFile}`);
    }

    // 2. فتح الملف
    console.log(`📂 فتح الملف: ${htmlFile}`);
    await page.goto(`file://${htmlFile}`, { 
      waitUntil: 'networkidle0', // انتظار تحميل كل الشبكات
      timeout: 60000 
    });

    // 3. (هام جداً) إجبار المتصفح على عرض ألوان الشاشة وتجاهل تنسيقات الطباعة الباهتة
    await page.emulateMediaType('screen');

    // 4. انتظار إضافي بسيط لضمان رسم الرسوم البيانية (Charts) بالكامل
    // لأن الشارتات تأخذ وقتاً في الانميشن
    await new Promise(r => setTimeout(r, 2000));

    // 5. الطباعة
    console.log('🖨️ جاري الطباعة...');
    await page.pdf({
      path: 'output_document.pdf',
      format: 'A4',
      printBackground: true, // طباعة الخلفيات والألوان
      margin: {
        top: '10mm',
        bottom: '10mm',
        left: '10mm',
        right: '10mm'
      },
      // هذا الخيار يساعد في تقليل مشاكل القص
      preferCSSPageSize: true 
    });

    console.log('✅ تم إنشاء ملف PDF بنجاح!');
    await browser.close();

  } catch (error) {
    console.error('❌ حدث خطأ:', error);
    process.exit(1);
  }
})();
