// ============================================
// MK FOODIE - COMPLETE JAVASCRIPT
// HOURS 1 TO 10
// ============================================


// ============================================
// 1. SWIPER INITIALIZATION
// ============================================

if (
    typeof Swiper !== 'undefined' &&
    document.querySelector('.mySwiper')
) {
    new Swiper('.mySwiper', {
        loop: true,
        navigation: {
            nextEl: '#next',
            prevEl: '#prev'
        }
    });
}


// ============================================
// 2. SELECT HTML ELEMENTS
// ============================================

const cartIcon = document.querySelector('.cart-icon');
const cartTab = document.querySelector('.cart-tab');
const closeBtn = document.querySelector('.close-btn');

const cardList = document.querySelector('.card-list');
const cartList = document.querySelector('.cart-list');

const cartTotal = document.querySelector('.cart-total');
const cartValue = document.querySelector('.cart-value');

const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const menuIcon = document.querySelector('.menu-icon');

const searchInput = document.querySelector('#search-input');
const searchBtn = document.querySelector('#search-btn');
const searchResult = document.querySelector('#search-result');

const categoryButtons = document.querySelectorAll('.category-btn');
const sortPrice = document.querySelector('#sort-price');

const checkoutBtn = document.querySelector('.checkout-btn');
const checkoutModal = document.querySelector('.checkout-modal');
const checkoutForm = document.querySelector('#checkout-form');
const cancelCheckout = document.querySelector('.cancel-checkout');

const ordersContainer = document.querySelector('#orders-container');
const adminOrdersContainer = document.querySelector('#admin-orders-container');


// ============================================
// 3. PRODUCT AND CART DATA
// ============================================

let productList = [];
let cartproduct = [];


// ============================================
// 4. PRICE CONVERSION FUNCTION
// ============================================

const getNumericPrice = (price) => {

    const numericPrice = Number.parseFloat(
        String(price).replace(/[^0-9.-]/g, '')
    );

    return Number.isFinite(numericPrice) ? numericPrice : 0;

};


// ============================================
// 5. MOBILE MENU
// ============================================

if (hamburger && mobileMenu) {

    hamburger.addEventListener('click', (e) => {

        e.preventDefault();

        mobileMenu.classList.toggle('mobile-menu-active');

        if (menuIcon) {

            const isOpen = mobileMenu.classList.contains(
                'mobile-menu-active'
            );

            menuIcon.classList.toggle('fa-bars', !isOpen);
            menuIcon.classList.toggle('fa-xmark', isOpen);

        }

    });

    mobileMenu.querySelectorAll('a').forEach(link => {

        link.addEventListener('click', () => {

            mobileMenu.classList.remove('mobile-menu-active');

            if (menuIcon) {

                menuIcon.classList.remove('fa-xmark');
                menuIcon.classList.add('fa-bars');

            }

        });

    });

}


// ============================================
// 6. OPEN AND CLOSE CART
// ============================================

if (cartIcon && cartTab) {

    cartIcon.addEventListener('click', (e) => {

        e.preventDefault();

        cartTab.classList.add('cart-tab-active');

    });

}


if (closeBtn && cartTab) {

    closeBtn.addEventListener('click', (e) => {

        e.preventDefault();

        cartTab.classList.remove('cart-tab-active');

    });

}


// ============================================
// 7. UPDATE CART TOTALS
// ============================================

const updateTotals = () => {

    let totalPrice = 0;
    let totalQuantity = 0;

    if (cartList) {

        cartList.querySelectorAll('.item').forEach(item => {

            const quantityElement = item.querySelector(
                '.quantity-value'
            );

            const totalElement = item.querySelector(
                '.item-total'
            );

            if (!quantityElement || !totalElement) return;

            totalQuantity +=
                Number.parseInt(quantityElement.textContent, 10) || 0;

            totalPrice += getNumericPrice(
                totalElement.textContent
            );

        });

    }

    if (cartTotal) {

        cartTotal.textContent = `$${totalPrice.toFixed(2)}`;

    }

    if (cartValue) {

        cartValue.textContent = totalQuantity;

    }

};


// ============================================
// 8. DISPLAY PRODUCT CARDS
// ============================================

const showCards = (products = productList) => {

    if (!cardList) {

        console.error('Product container .card-list not found.');

        return;

    }

    cardList.innerHTML = '';

    if (!products || products.length === 0) {

        cardList.innerHTML = '<h3>No food items found!</h3>';

        return;

    }

    products.forEach(product => {

        const orderCard = document.createElement('div');

        orderCard.classList.add('order-card');

        orderCard.innerHTML = `
            <div class="card-image">
                <img src="${product.image}" alt="${product.name}">
            </div>

            <h4>${product.name}</h4>

            <h4 class="price">${product.price}</h4>

            <a href="#" class="btn card-btn">Add to Cart</a>
        `;

        cardList.appendChild(orderCard);

        orderCard.querySelector('.card-btn').addEventListener(
            'click',
            (e) => {

                e.preventDefault();

                addToCart(product);

            }
        );

    });

};


// ============================================
// 9. SEARCH + CATEGORY + PRICE SORTING
// ============================================

const searchProducts = () => {

    const searchTerm = searchInput
        ? searchInput.value.toLowerCase().trim()
        : '';

    const activeButton = document.querySelector(
        '.category-btn.active'
    );

    const selectedCategory = activeButton
        ? activeButton.dataset.category || 'All'
        : 'All';

    let filteredProducts = productList.filter(product => {

        const productName = String(
            product.name || ''
        ).toLowerCase();

        const productCategory = String(
            product.category || ''
        ).toLowerCase();

        const matchesSearch = productName.includes(searchTerm);

        const matchesCategory =
            selectedCategory.toLowerCase() === 'all' ||
            productCategory === selectedCategory.toLowerCase();

        return matchesSearch && matchesCategory;

    });

    const sortValue = sortPrice
        ? sortPrice.value
        : 'default';

    if (sortValue === 'low-high') {

        filteredProducts.sort((a, b) =>
            getNumericPrice(a.price) -
            getNumericPrice(b.price)
        );

    } else if (sortValue === 'high-low') {

        filteredProducts.sort((a, b) =>
            getNumericPrice(b.price) -
            getNumericPrice(a.price)
        );

    }

    showCards(filteredProducts);

    if (searchResult) {

        searchResult.textContent = searchTerm
            ? `${filteredProducts.length} products found for "${searchTerm}"`
            : '';

    }

};


// ============================================
// 10. SEARCH EVENTS
// ============================================

if (searchBtn && searchInput) {

    searchBtn.addEventListener('click', () => {

        searchInput.classList.toggle('active');

        if (searchInput.classList.contains('active')) {

            searchInput.focus();

        } else {

            searchInput.value = '';

            searchProducts();

        }

    });

    searchInput.addEventListener('input', searchProducts);

    searchInput.addEventListener('keydown', (e) => {

        if (e.key === 'Enter') {

            e.preventDefault();

            searchProducts();

            document.querySelector('#menu')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

        }

    });

}


// ============================================
// 11. CATEGORY FILTER
// ============================================

categoryButtons.forEach(button => {

    button.addEventListener('click', () => {

        categoryButtons.forEach(btn => {

            btn.classList.remove('active');

        });

        button.classList.add('active');

        searchProducts();

    });

});


// ============================================
// 12. PRICE SORTING EVENT
// ============================================

if (sortPrice) {

    sortPrice.addEventListener('change', searchProducts);

}


// ============================================
// 13. ADD PRODUCTS TO CART
// ============================================

const addToCart = (product) => {

    if (!cartList) return;

    const existingCartItem = Array.from(
        cartList.querySelectorAll('.item')
    ).find(item =>
        item.dataset.productId === String(product.id)
    );

    if (existingCartItem) {

        existingCartItem.querySelector('.plus')?.click();

        cartTab?.classList.add('cart-tab-active');

        return;

    }

    const price = getNumericPrice(product.price);

    let quantity = 1;

    const cartItem = document.createElement('div');

    cartItem.classList.add('item');

    cartItem.dataset.productId = product.id;

    cartItem.innerHTML = `
        <div class="item-image">
            <img src="${product.image}" alt="${product.name}">
        </div>

        <div class="detail">
            <h4>${product.name}</h4>

            <h4 class="item-total">$${price.toFixed(2)}</h4>
        </div>

        <div class="flex">

            <a href="#" class="quantity-btn minus">
                <i class="fa-solid fa-minus"></i>
            </a>

            <h4 class="quantity-value">${quantity}</h4>

            <a href="#" class="quantity-btn plus">
                <i class="fa-solid fa-plus"></i>
            </a>

        </div>
    `;

    cartList.appendChild(cartItem);

    cartproduct.push(product);

    const plusBtn = cartItem.querySelector('.plus');
    const minusBtn = cartItem.querySelector('.minus');

    const quantityValue = cartItem.querySelector(
        '.quantity-value'
    );

    const itemTotal = cartItem.querySelector('.item-total');


    // INCREASE QUANTITY

    plusBtn.addEventListener('click', (e) => {

        e.preventDefault();

        quantity++;

        quantityValue.textContent = quantity;

        itemTotal.textContent =
            `$${(price * quantity).toFixed(2)}`;

        updateTotals();

    });


    // DECREASE QUANTITY

    minusBtn.addEventListener('click', (e) => {

        e.preventDefault();

        if (quantity > 1) {

            quantity--;

            quantityValue.textContent = quantity;

            itemTotal.textContent =
                `$${(price * quantity).toFixed(2)}`;

            updateTotals();

            return;

        }

        cartItem.remove();

        cartproduct = cartproduct.filter(
            item => String(item.id) !== String(product.id)
        );

        updateTotals();

    });

    updateTotals();

    cartTab?.classList.add('cart-tab-active');

};


// ============================================
// 14. CHECKOUT MODAL
// ============================================

if (checkoutBtn && checkoutModal && checkoutForm && cartList) {

    checkoutBtn.addEventListener('click', () => {

        if (cartList.querySelectorAll('.item').length === 0) {

            alert('Your cart is empty!');

            return;

        }

        checkoutModal.classList.add('active');

    });

}


if (cancelCheckout && checkoutModal) {

    cancelCheckout.addEventListener('click', () => {

        checkoutModal.classList.remove('active');

    });

}


if (checkoutModal) {

    checkoutModal.addEventListener('click', (e) => {

        if (e.target === checkoutModal) {

            checkoutModal.classList.remove('active');

        }

    });

}


// ============================================
// 15. HOUR 7 - LOCALSTORAGE FUNCTIONS
// ============================================

const getSavedOrders = () => {

    try {

        const savedOrders = localStorage.getItem('mkFoodieOrders');

        const orders = savedOrders
            ? JSON.parse(savedOrders)
            : [];

        return Array.isArray(orders) ? orders : [];

    } catch (error) {

        console.error('Error reading saved orders:', error);

        return [];

    }

};


const saveOrder = (order) => {

    try {

        const existingOrders = getSavedOrders();

        existingOrders.push(order);

        localStorage.setItem(
            'mkFoodieOrders',
            JSON.stringify(existingOrders)
        );

        return true;

    } catch (error) {

        console.error('Error saving order:', error);

        alert('Unable to save order. Please try again.');

        return false;

    }

};


const getOrderItems = () => {

    const orderItems = [];

    if (!cartList) return orderItems;

    cartList.querySelectorAll('.item').forEach(item => {

        const productId = item.dataset.productId;

        const productName = item.querySelector(
            '.detail h4'
        )?.textContent || '';

        const quantity = Number(
            item.querySelector('.quantity-value')?.textContent || 0
        );

        const itemTotal = getNumericPrice(
            item.querySelector('.item-total')?.textContent || 0
        );

        orderItems.push({

            productId: productId,

            productName: productName,

            quantity: quantity,

            itemTotal: itemTotal

        });

    });

    return orderItems;

};


// ============================================
// 16. PLACE ORDER
// ============================================

if (checkoutForm) {

    checkoutForm.addEventListener('submit', (e) => {

        e.preventDefault();

        if (!checkoutForm.reportValidity()) return;

        const customerName = document.querySelector(
            '#customer-name'
        )?.value.trim() || '';

        const customerPhone = document.querySelector(
            '#customer-phone'
        )?.value.trim() || '';

        const customerAddress = document.querySelector(
            '#customer-address'
        )?.value.trim() || '';

        const paymentMethod = document.querySelector(
            '#payment-method'
        )?.value || '';

        if (
            !customerName ||
            !customerPhone ||
            !customerAddress ||
            !paymentMethod
        ) {

            alert('Please fill in all details.');

            return;

        }

        if (!/^[0-9]{10}$/.test(customerPhone)) {

            alert('Please enter a valid 10-digit mobile number.');

            return;

        }

        const orderItems = getOrderItems();

        if (orderItems.length === 0) {

            alert('Your cart is empty!');

            return;

        }

        const order = {

            orderId: 'MK' + Date.now(),

            customerName: customerName,

            customerPhone: customerPhone,

            customerAddress: customerAddress,

            paymentMethod: paymentMethod,

            items: orderItems,

            totalAmount: getNumericPrice(
                cartTotal?.textContent || '$0.00'
            ),

            orderDate: new Date().toLocaleString(),

            status: 'Order Placed'

        };

        const isSaved = saveOrder(order);

        if (!isSaved) return;

        alert(
            `Order Placed Successfully!\n\n` +
            `Order ID: ${order.orderId}\n` +
            `Customer: ${order.customerName}\n` +
            `Mobile: ${order.customerPhone}\n` +
            `Payment: ${order.paymentMethod}\n` +
            `Total: $${order.totalAmount.toFixed(2)}`
        );

        cartList.innerHTML = '';

        cartproduct = [];

        updateTotals();

        checkoutForm.reset();

        checkoutModal?.classList.remove('active');

        cartTab?.classList.remove('cart-tab-active');

        displayMyOrders();

        displayAdminOrders();

    });

}


// ============================================
// 17. HOUR 9 - ORDER TRACKING
// ============================================

const orderStatuses = [
    'Order Placed',
    'Order Confirmed',
    'Preparing',
    'Out for Delivery',
    'Delivered'
];


const updateOrderStatus = (orderId, newStatus) => {

    if (!orderStatuses.includes(newStatus)) {

        return;

    }

    const orders = getSavedOrders();

    const updatedOrders = orders.map(order => {

        if (order.orderId === orderId) {

            return {
                ...order,
                status: newStatus
            };

        }

        return order;

    });

    try {

        localStorage.setItem(
            'mkFoodieOrders',
            JSON.stringify(updatedOrders)
        );

        displayMyOrders();

        displayAdminOrders();

    } catch (error) {

        console.error('Unable to update order status:', error);

        alert('Unable to update order status. Please try again.');

    }

};


// CREATE ORDER TRACKING TIMELINE

const createTrackingTimeline = (order) => {

    const currentIndex = orderStatuses.indexOf(
        order.status || 'Order Placed'
    );

    const trackingContainer = document.createElement('div');

    trackingContainer.classList.add('tracking-container');

    const title = document.createElement('h4');

    title.classList.add('tracking-title');

    title.textContent = 'Track Your Order';

    trackingContainer.appendChild(title);

    orderStatuses.forEach((status, index) => {

        const step = document.createElement('div');

        step.classList.add('tracking-step');

        if (currentIndex >= 0 && index <= currentIndex) {

            step.classList.add('completed');

        }

        const icon = document.createElement('div');

        icon.classList.add('tracking-icon');

        icon.textContent =
            currentIndex >= 0 && index <= currentIndex
                ? '✓'
                : '○';

        const info = document.createElement('div');

        info.classList.add('tracking-info');

        const heading = document.createElement('h4');

        heading.textContent = status;

        const description = document.createElement('p');

        description.textContent =
            currentIndex >= 0 && index <= currentIndex
                ? 'Completed'
                : 'Waiting for update';

        info.appendChild(heading);

        info.appendChild(description);

        step.appendChild(icon);

        step.appendChild(info);

        trackingContainer.appendChild(step);

    });

    return trackingContainer;

};


// ============================================
// 18. HOUR 8 - DISPLAY MY ORDERS
// ============================================

const displayMyOrders = () => {

    if (!ordersContainer) return;

    const savedOrders = getSavedOrders();

    ordersContainer.innerHTML = '';

    if (savedOrders.length === 0) {

        ordersContainer.innerHTML = `
            <div class="no-orders">
                <h3>No Orders Found!</h3>
                <p>You haven't placed any orders yet.</p>
            </div>
        `;

        return;

    }

    [...savedOrders].reverse().forEach(order => {

        const orderCard = document.createElement('div');

        orderCard.classList.add('order-card');

        const orderHeader = document.createElement('div');

        orderHeader.classList.add('order-header');

        const orderId = document.createElement('h3');

        orderId.textContent = `Order ID: ${order.orderId}`;

        const orderStatus = document.createElement('span');

        orderStatus.classList.add('order-status');

        orderStatus.textContent = order.status || 'Order Placed';

        orderHeader.appendChild(orderId);

        orderHeader.appendChild(orderStatus);

        const orderDate = document.createElement('p');

        orderDate.textContent = `Date: ${order.orderDate || ''}`;

        const customerDetails = document.createElement('p');

        customerDetails.textContent =
            `Customer: ${order.customerName || ''}`;

        const customerPhone = document.createElement('p');

        customerPhone.textContent =
            `Mobile: ${order.customerPhone || ''}`;

        const customerAddress = document.createElement('p');

        customerAddress.textContent =
            `Address: ${order.customerAddress || ''}`;

        const payment = document.createElement('p');

        payment.textContent =
            `Payment: ${order.paymentMethod || ''}`;

        const itemsContainer = document.createElement('div');

        itemsContainer.classList.add('order-items');

        const itemsHeading = document.createElement('h4');

        itemsHeading.textContent = 'Ordered Items';

        itemsContainer.appendChild(itemsHeading);

        (Array.isArray(order.items) ? order.items : []).forEach(item => {

            const itemRow = document.createElement('div');

            itemRow.classList.add('order-item');

            const itemName = document.createElement('span');

            itemName.textContent =
                `${item.productName} × ${item.quantity}`;

            const itemPrice = document.createElement('span');

            itemPrice.textContent =
                `$${Number(item.itemTotal || 0).toFixed(2)}`;

            itemRow.appendChild(itemName);

            itemRow.appendChild(itemPrice);

            itemsContainer.appendChild(itemRow);

        });

        const total = document.createElement('h3');

        total.classList.add('order-total');

        total.textContent =
            `Total: $${Number(order.totalAmount || 0).toFixed(2)}`;

        orderCard.appendChild(orderHeader);

        orderCard.appendChild(orderDate);

        orderCard.appendChild(customerDetails);

        orderCard.appendChild(customerPhone);

        orderCard.appendChild(customerAddress);

        orderCard.appendChild(payment);

        orderCard.appendChild(itemsContainer);

        orderCard.appendChild(total);

        orderCard.appendChild(
            createTrackingTimeline(order)
        );

        ordersContainer.appendChild(orderCard);

    });

};


// ============================================
// 19. HOUR 10 - ADMIN DASHBOARD
// ============================================


// UPDATE ADMIN STATISTICS

const updateAdminStats = (orders) => {

    const totalOrders = orders.length;

    const pendingOrders = orders.filter(
        order => (order.status || 'Order Placed') === 'Order Placed'
    ).length;

    const preparingOrders = orders.filter(
        order => order.status === 'Preparing'
    ).length;

    const deliveredOrders = orders.filter(
        order => order.status === 'Delivered'
    ).length;

    const totalElement = document.querySelector('#total-orders');

    const pendingElement = document.querySelector('#pending-orders');

    const preparingElement = document.querySelector('#preparing-orders');

    const deliveredElement = document.querySelector('#delivered-orders');

    if (totalElement) {

        totalElement.textContent = totalOrders;

    }

    if (pendingElement) {

        pendingElement.textContent = pendingOrders;

    }

    if (preparingElement) {

        preparingElement.textContent = preparingOrders;

    }

    if (deliveredElement) {

        deliveredElement.textContent = deliveredOrders;

    }

};


// DISPLAY ALL ADMIN ORDERS

const displayAdminOrders = () => {

    if (!adminOrdersContainer) return;

    const orders = getSavedOrders();

    adminOrdersContainer.innerHTML = '';

    updateAdminStats(orders);

    if (orders.length === 0) {

        adminOrdersContainer.innerHTML = `
            <div class="no-orders">
                <h3>No Customer Orders Found!</h3>
            </div>
        `;

        return;

    }

    [...orders].reverse().forEach(order => {

        const orderCard = document.createElement('div');

        orderCard.classList.add('admin-order-card');

        const header = document.createElement('div');

        header.classList.add('admin-order-header');

        const orderId = document.createElement('h3');

        orderId.textContent = `Order ID: ${order.orderId || 'Unknown'}`;

        const currentStatus = order.status || 'Order Placed';

        const statusLabel = document.createElement('span');

        statusLabel.textContent = currentStatus;

        header.appendChild(orderId);

        header.appendChild(statusLabel);

        const customer = document.createElement('p');

        customer.textContent =
            `Customer: ${order.customerName || ''}`;

        const phone = document.createElement('p');

        phone.textContent =
            `Phone: ${order.customerPhone || ''}`;

        const address = document.createElement('p');

        address.textContent =
            `Address: ${order.customerAddress || ''}`;

        const payment = document.createElement('p');

        payment.textContent =
            `Payment: ${order.paymentMethod || ''}`;

        const date = document.createElement('p');

        date.textContent =
            `Date: ${order.orderDate || ''}`;

        const itemsContainer = document.createElement('div');

        itemsContainer.classList.add('admin-order-items');

        const itemsHeading = document.createElement('h4');

        itemsHeading.textContent = 'Ordered Products';

        itemsContainer.appendChild(itemsHeading);

        (Array.isArray(order.items) ? order.items : []).forEach(item => {

            const itemRow = document.createElement('p');

            itemRow.textContent =
                `${item.productName || 'Product'} x ${Number(item.quantity || 0)} - $${Number(item.itemTotal || 0).toFixed(2)}`;

            itemsContainer.appendChild(itemRow);

        });

        const total = document.createElement('h3');

        total.textContent =
            `Total: $${Number(order.totalAmount || 0).toFixed(2)}`;

        const statusSelect = document.createElement('select');

        statusSelect.classList.add('admin-status-select');

        statusSelect.setAttribute(
            'aria-label',
            `Update status for ${order.orderId || 'order'}`
        );

        orderStatuses.forEach(orderStatus => {

            const option = document.createElement('option');

            option.value = orderStatus;

            option.textContent = orderStatus;

            option.selected = orderStatus === currentStatus;

            statusSelect.appendChild(option);

        });

        statusSelect.addEventListener('change', () => {

            updateOrderStatus(order.orderId, statusSelect.value);

        });

        orderCard.appendChild(header);

        orderCard.appendChild(customer);

        orderCard.appendChild(phone);

        orderCard.appendChild(address);

        orderCard.appendChild(payment);

        orderCard.appendChild(date);

        orderCard.appendChild(itemsContainer);

        orderCard.appendChild(total);

        orderCard.appendChild(statusSelect);

        adminOrdersContainer.appendChild(orderCard);

    });

};


// ============================================
// 20. LOAD PRODUCTS FROM JSON
// ============================================

const initApp = async () => {

    if (!cardList) {

        console.error(
            'Product container .card-list was not found in HTML.'
        );

        return;

    }

    try {

        const response = await fetch('./products.json');

        if (!response.ok) {

            throw new Error(
                `Unable to load products.json. Status: ${response.status}`
            );

        }

        const data = await response.json();

        if (!Array.isArray(data)) {

            throw new Error(
                'products.json must contain an array of products.'
            );

        }

        productList = data;

        searchProducts();

        console.log(
            'Products loaded successfully:',
            productList.length
        );

    } catch (error) {

        console.error('Product loading error:', error);

        cardList.innerHTML = `
            <h3>Unable to load food products.</h3>
            <p>Check products.json and the browser console.</p>
        `;

    }

};


// ============================================
// 21. START APPLICATION
// ============================================

initApp();


// ============================================
// 22. DISPLAY SAVED ORDERS ON PAGE LOAD
// ============================================

displayMyOrders();

displayAdminOrders();


// ============================================
// END OF MK FOODIE JAVASCRIPT
// HOURS 1 TO 10 COMPLETE
// ============================================