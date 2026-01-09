const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  try {
    console.log('🚀 بدء عملية المعالجة...');

    // 1. تشغيل المتصفح
    const browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // تعيين حجم شاشة كبير لضمان دقة الصور
    await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });

    // 2. تحديد مسار الملف
    const htmlFile = path.resolve(__dirname, '6.html');
    if (!fs.existsSync(htmlFile)) {
      throw new Error(`❌ لم يتم العثور على الملف: ${htmlFile}`);
    }

    // 3. فتح الملف
    console.log(`📂 فتح الملف: ${htmlFile}`);
    await page.goto(`file://${htmlFile}`, { waitUntil: 'networkidle0' });

    // == هام جداً: انتظار اكتمال الأنيميشن الخاص بالرسوم البيانية ==
    console.log('⏳ انتظار اكتمال تحميل الرسوم البيانية...');
    await new Promise(r => setTimeout(r, 2000)); 

    // 4. إنشاء مجلد لحفظ الصور
    const outputDir = path.resolve(__dirname, 'extracted_charts');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    // 5. استخراج الصور (سكرين شوت لكل كانفاس)
    console.log('📸 بدء استخراج الصور...');
    
    // الحصول على كل عناصر الكانفاس في الصفحة
    const canvases = await page.$$('canvas');

    for (let i = 0; i < canvases.length; i++) {
      const canvas = canvases[i];
      
      // محاولة جلب الـ ID الخاص بالكانفاس لتسمية الصورة به
      const id = await page.evaluate(el => el.id, canvas);
      const filename = id ? `${id}.png` : `chart_${i + 1}.png`;
      const savePath = path.join(outputDir, filename);

      // أخذ لقطة للعنصر فقط
      await canvas.screenshot({ path: savePath });
      console.log(`✅ تم حفظ الصورة: ${filename}`);
    }

    // 6. طباعة ملف PDF (اختياري إذا كنت ما زلت تريده)
    console.log('🖨️ جاري إنشاء ملف PDF الشامل...');
    await page.pdf({
      path: 'output_document.pdf',
      format: 'A4',
      printBackground: true,
      margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' }
    });

    await browser.close();
    console.log('🎉 تمت العملية بنجاح!');

  } catch (error) {
    console.error('❌ حدث خطأ:', error);
    process.exit(1);
  }
})();
