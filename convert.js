const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('⏳ جاري تشغيل المتصفح الوهمي...');

  // 1. تشغيل المتصفح (بإعدادات خاصة ليعمل داخل Codespaces)
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // 2. تحديد مسار ملف الـ HTML (تأكد أن اسم الملف هنا يطابق ملفك)
  // سنفترض أن اسم ملفك هو index.html وموجود بجوار هذا السكريبت
  const filePath = path.join(__dirname, 'index.html');
  
  console.log(`📄 جاري فتح الملف: ${filePath}`);
  
  // تحميل الملف كأنه رابط محلي
  await page.goto(`file:${filePath}`, { waitUntil: 'networkidle0' });

  // 3. تحويل الصفحة إلى PDF
  console.log('🖨️ جاري الطباعة إلى PDF...');
  
  await page.pdf({
    path: 'my_document.pdf', // اسم الملف الناتج
    format: 'A4',            // حجم الورقة
    printBackground: true,   // طباعة الألوان والخلفيات
    margin: {                // الهوامش
      top: '10mm',
      bottom: '10mm',
      left: '10mm',
      right: '10mm'
    },
    displayHeaderFooter: false // إلغاء ترويسة المتصفح الافتراضية
  });

  console.log('✅ تم الانتهاء! الملف جاهز باسم my_document.pdf');

  await browser.close();
})();