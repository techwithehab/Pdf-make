const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  try {
    console.log('🚀 بدء عملية التحويل...');

    // 1. تشغيل المتصفح بإعدادات خاصة لسيرفرات جيت هب
    const browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox'] // ضروري جداً ليعمل على GitHub Action
    });

    const page = await browser.newPage();

    // 2. تحديد مسار الملف (تأكد أن اسم ملفك هنا صحيح)
    // سنفترض أن اسم ملفك index.html
    const htmlFile = path.resolve(__dirname, 'index.html');

    if (!fs.existsSync(htmlFile)) {
      throw new Error(`❌ لم يتم العثور على الملف: ${htmlFile} \n تأكد من رفع الملف وتسميته بشكل صحيح.`);
    }

    // 3. فتح الملف
    console.log(`📂 فتح الملف: ${htmlFile}`);
    await page.goto(`file://${htmlFile}`, { waitUntil: 'networkidle0' });

    // 4. الطباعة إلى PDF
    console.log('🖨️ جاري الطباعة...');
    await page.pdf({
      path: 'output_document.pdf', // اسم الملف الناتج
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10mm',
        bottom: '10mm',
        left: '10mm',
        right: '10mm'
      }
    });

    console.log('✅ تم إنشاء ملف PDF بنجاح!');
    await browser.close();

  } catch (error) {
    console.error('❌ حدث خطأ:', error);
    process.exit(1);
  }
})();