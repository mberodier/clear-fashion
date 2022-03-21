/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sources/dedicatedbrand');
const montlimartbrand = require('./sources/montlimartbrand');
const adresseParisbrand = require('./sources/adresseParisbrand');

//https://www.montlimart.com/pulls-sweats.html
//https://adresse.paris/608-pulls-et-sweatshirts
//https://www.dedicatedbrand.com/en/men/news

async function sandbox (eshop = 'https://www.montlimart.com/pulls-sweats.html') {
  try {
    var products = []
    console.log(`🕵️‍♀️  browsing ${eshop} source`);
    if(eshop.includes('dedicatedbrand')){
      console.log("DEDICATED BRAND")
      products = await dedicatedbrand.scrape(eshop);
    }
    else if(eshop.includes('montlimart')){
      console.log("MONTLIMARD")
      products = await montlimartbrand.scrape(eshop);
    }
    else if(eshop.includes('adresse')){
      console.log("ADRESSE PARIS")
      products = await adresseParisbrand.scrape(eshop);
    }

    console.log(products);
    console.log(products.length)
    process.exit(0);
  } catch (e) {
    console.log("ERROR")
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop] = process.argv;
sandbox(eshop);