const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const ExcelJS = require('exceljs');
const path = require('path');

// server conf
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/scrape', async (req, res) => {
  const category = req.body.category;
  const url = `https://pchubonline.com/products?category=${category}`;
  
  try {
    const response = await axios.get(url);
    console.log('Page fetched successfully.');

    const $ = cheerio.load(response.data);
    
    const products = [];
        $('div.text-center').each((i, elem) => {
        const productName = $(elem).find('[class*="title"]').text().trim();

        const productPrice = $(elem).find('[id*="product_price"], [class*="product_price"]').text().trim();

        if (productName && productPrice) {
            products.push({ name: productName, price: productPrice });
        }
    });

    // prints number of data scrapped
    console.log(`${products.length} products found.`);

    if (products.length === 0) {
      return res.status(404).send('No products found for this category.');
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Products');
    worksheet.columns = [
      { header: 'Product Name', key: 'name', width: 30 },
      { header: 'Price', key: 'price', width: 15 },
    ];
    worksheet.addRows(products);

    console.log('Excel file being prepared.');

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=products.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error during scraping or Excel generation:', error);
    res.status(500).send('Error occurred while processing your request.');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
