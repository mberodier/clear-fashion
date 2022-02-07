// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// current products on the page
let currentProducts = [];
let currentPagination = {};

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');

/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12) => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};


/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a href="${product.link}">${product.name}</a>
        <span>${product.price}</span>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = pagination;

  spanNbProducts.innerHTML = count;
};

const render = (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination);
};

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 */
selectShow.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, parseInt(event.target.value));

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});


selectPage.addEventListener('change', event => {
  fetchProducts(parseInt(event.target.value), currentPagination.pageSize)
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination));
});

selectBrand.addEventListener('change', event => {
  fetchProducts(currentPagination.currentPage, currentPagination.pageSize)
    .then(setCurrentProducts)
    .then(() => render(currentProducts.filter(product => event.target.value!="all"? product.brand == event.target.value : true), currentPagination));
});

document.addEventListener('DOMContentLoaded', async() =>{
  const products = await fetchProducts();
    setCurrentProducts(products);
    render(currentProducts, currentPagination);
});

/** 
 * Browsing the page*
 * @type {[type]}
*/

selectPage.addEventListener('change', async(event) => {

  var products = await   fetchProducts(parseInt(event.target.value),currentPagination.pageCount)
  setCurrentProducts(products)
    render(currentProducts, currentPagination)


});


document.addEventListener('DOMContentLoaded', async () => {

  const products = await fetchProducts();

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});


 /**
   *  Filter by brands
   * @type {[type]}
   */

  selectBrand.addEventListener('change', async(event) => {

    var products = await   fetchProducts(currentPagination.currentPage,currentPagination.pageCount)
    const b=all_brand.slice(1)
    setCurrentProducts(products)

    if (b.includes(event.target.value)){
      var filtered =currentProducts.filter(function(item,idx){return item.brand==event.target.value});
      render(filtered, currentPagination);
    }

  });

   /**
    * Filter by recent products
    */
    var today = new Date();
    var today = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

selectRecent.addEventListener('change', async(event) => {
    var products = await   fetchProducts(currentPagination.currentPage,currentPagination.pageCount)
    setCurrentProducts(products)
    var filtered =currentProducts.filter(function(item,idx){return new Date(today).getTime()-new Date(item.released).getTime()<=12096e5});
    render(filtered, currentPagination);

   });


   /**
    * Filter by reasonable price
    */

    function sort_By_Price_Asc(currentProducts){
      let products_by_price = currentProducts.sort((a, b) => a.price - b.price);
      sortbrand(products_by_price,selectBrand.value);
    }
    
    
    function sort_By_Price_Desc(currentProducts){
      let products_by_price = currentProducts.sort((a, b) => b.price - a.price);
      sortbrand(products_by_price,selectBrand.value);
    }


    function compare_date_asc(a,b){
      if (a.released < b.released){
        return 1;
      }
      else if (a.released > b.released) {
        return -1;
      }
      else {
        return 0;
      }
    }

    function compare_date_desc(a,b){
      if (a.released>b.released){
        return 1;
      }
      else if (a.released<b.released){
        return -1;
      }
      else {
        return 0;
      }
    }






