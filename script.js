// script.js

// Function to add product to cart
const addToCart = (title, price) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({ title, price });
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`Added ${title} to cart.`);
};

// Function to fetch products
const fetchProducts = async () => {
    const url = `https://fakestoreapi.com/products`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Product data fetch failed');
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
};

// Function to create product cards
const createProductCard = (product) => {
    const productCard = document.createElement('div');
    productCard.classList.add('col-lg-3', 'col-md-4', 'col-sm-6', 'mb-4', 'card');
    productCard.innerHTML = `
                <img src="${product.image}" class="card-img-top" alt="${product.title}">
                <div class="card-body">
                    <h5 class="card-title">${product.title}</h5>
                    <p class="card-text">$${product.price}</p>
                    <div class="card-buttons">
                        <button onclick="showDetails('${product.title}', '${product.description}', '${product.price}')">Show Details</button>
                        <button onclick="addToCart('${product.title}', ${product.price})">Add to Cart</button>
                    </div>
                </div>
            `;
    return productCard;
};

// Function to display products
const displayProducts = async (products) => {
    const electronicsProducts = document.getElementById('electronics-products');
    const jewelryProducts = document.getElementById('jewelry-products');
    const mensClothingProducts = document.getElementById('mens-clothing-products');
    const womensClothingProducts = document.getElementById('womens-clothing-products');

    // Clear previous results
    clearProducts();

    // Display filtered products
    products.forEach(product => {
        const productCard = createProductCard(product);
        switch (product.category.toLowerCase()) {
            case 'electronics':
                electronicsProducts.appendChild(productCard);
                break;
            case 'jewelery': // Corrected typo in category name
                jewelryProducts.appendChild(productCard);
                break;
            case 'men\'s clothing':
                mensClothingProducts.appendChild(productCard);
                break;
            case 'women\'s clothing':
                womensClothingProducts.appendChild(productCard);
                break;
            default:
                // Handle other categories if needed
                break;
        }
    });
};

// Function to clear products
const clearProducts = () => {
    const electronicsProducts = document.getElementById('electronics-products');
    const jewelryProducts = document.getElementById('jewelry-products');
    const mensClothingProducts = document.getElementById('mens-clothing-products');
    const womensClothingProducts = document.getElementById('womens-clothing-products');

    electronicsProducts.innerHTML = '';
    jewelryProducts.innerHTML = '';
    mensClothingProducts.innerHTML = '';
    womensClothingProducts.innerHTML = '';
};

// Function to filter products by search term
const filterBySearchTerm = (products, term) => {
    term = term.trim().toLowerCase();
    if (!term) return products;
    return products.filter(product => product.title.toLowerCase().includes(term));
};

// Function to filter products by price range
const filterByPriceRange = (products, minPrice, maxPrice) => {
    minPrice = parseFloat(minPrice);
    maxPrice = parseFloat(maxPrice);
    if (isNaN(minPrice) && isNaN(maxPrice)) return products;
    return products.filter(product => {
        const price = parseFloat(product.price);
        return (isNaN(minPrice) || price >= minPrice) && (isNaN(maxPrice) || price <= maxPrice);
    });
};

// Apply filters based on search term and price range
const applyFilters = async (event) => {
    event.preventDefault(); // Prevent form submission and page reload

    const searchTerm = document.getElementById('search').value;
    const minPrice = document.getElementById('min-price').value;
    const maxPrice = document.getElementById('max-price').value;

    try {
        let products = await fetchProducts(); // Fetch products
        let filteredProducts = filterBySearchTerm(products, searchTerm);
        filteredProducts = filterByPriceRange(filteredProducts, minPrice, maxPrice);
        displayProducts(filteredProducts); // Display filtered products
    } catch (error) {
        console.error('Error applying filters:', error);
        alert('Failed to apply filters. Please try again.');
    }
};

// Clear filters and display all products
const clearFilters = async () => {
    document.getElementById('search').value = '';
    document.getElementById('min-price').value = '';
    document.getElementById('max-price').value = '';

    try {
        let products = await fetchProducts(); // Fetch products
        displayProducts(products); // Display all products
    } catch (error) {
        console.error('Error clearing filters:', error);
        alert('Failed to clear filters. Please try again.');
    }
};

// Initial load of products
fetchProducts()
    .then(products => {
        displayProducts(products);
    })
    .catch(error => {
        console.error('Error fetching products:', error);
        alert('Failed to fetch product data. Please try again.');
    });

// Function to show product details
const showDetails = (title, description, price) => {
    alert(`Product: ${title}\nDescription: ${description}\nPrice: $${price}`);
};

// Function to display cart items
const displayCartItems = () => {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = ''; // Clear previous items

    cartItems.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('card', 'col-md-6');
        card.innerHTML = `
        <div class="row g-0">
            <div class="col-md-8">
                <div class="card-body">
                    <h5 class="card-title">${item.title}</h5>
                    <p class="card-text">$${item.price.toFixed(2)}</p>
                </div>
            </div>
        </div>
    `;
        cartItemsContainer.appendChild(card);
    });
};

// Function to clear cart
const clearCart = () => {
    localStorage.removeItem('cart');
    displayCartItems(); // Update UI
};

// Function to initialize cart page
const initCartPage = () => {
    displayCartItems();
    const checkoutBtn = document.getElementById('checkout-btn');
    checkoutBtn.addEventListener('click', () => {
        alert('Redirecting to checkout...');
        // Implement checkout logic here (e.g., redirect to checkout page)
    });

    const clearCartBtn = document.getElementById('clear-cart-btn');
    clearCartBtn.addEventListener('click', () => {
        clearCart();
    });
};

// Initialize cart page
initCartPage();
