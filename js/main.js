let card_list = document.querySelector('.items')

function getCookieValue(cookieName) {
    // Розділяємо всі куки на окремі частини
    const cookies = document.cookie.split(';')
    // Шукаємо куки з вказаним ім'ям
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim() // Видаляємо зайві пробіли
        // Перевіряємо, чи починається поточне кукі з шуканого імені
        if (cookie.startsWith(cookieName + '=')) {
            // Якщо так, повертаємо значення кукі
            return cookie.substring(cookieName.length + 1) // +1 для пропуску символу
            "="
        }
    }
    // Якщо кукі з вказаним іменем не знайдено, повертаємо порожній рядок або можна
    return ''
}



async function getProducts() {
    // Виконуємо запит до файлу "store_db.json" та очікуємо на відповідь
    const response = await fetch("https://api.zerosheets.com/v1/kpk", {
        method: "GET",
        headers: {
            Authorization: "Bearer oJIbVKUTfJfnUxRpvLB9haTGT3NJj0FE"
        }
    });
    // Очікуємо на отримання та розпакування JSON-даних з відповіді
    let products = await response.json()
    // Повертаємо отримані продукти
    return products
};

function getCardHtml(item) {
    return `<div class="my-card" style="width: 18rem;">
        <img src="img/${item.image}">
        <h5 class="text-my-card">${item.title}</h5>
        <p class="description-card">
        ${item.description}
       </p>
        <p class="price-card">
      ${item.price}
       </p>
        <button type="button" class="btn btn-secondary add-to-cart"
                     data-product='${JSON.stringify(item)}'>
        Додати в кошик</button>
    </div>`
}

class ShoppingCart {
    constructor() {
        this.items = {}
        this.loadCartFromCookies()
        console.log(this.items)
    }
    addItem(product) {
        if (this.items[product.title]) {
            this.items[product.title].quantity += 1
        } else {
            this.items[product.title] = product
            this.items[product.title].quantity = 1
        }
        this.saveCartToCookies()
    }
    // Зберігання кошика в кукі
    saveCartToCookies() {
        let cartJSON = JSON.stringify(this.items);
        document.cookie = `cart=${cartJSON}; max-age=${60 * 60 * 24 * 14}; path=/`;
    }

    // Завантаження кошика з кукі
    loadCartFromCookies() {
        let cartCookie = getCookieValue('cart');
        if (cartCookie && cartCookie !== '') {
            this.items = JSON.parse(cartCookie);
        }
    }

}

let cart = new ShoppingCart()

function addToCart(event) {
    let productData = event.target.getAttribute('data-product')
    let product = JSON.parse(productData)
    // тут буде додавання в кошик
    cart.addItem(product)
}


getProducts().then(function (products) {
    products.forEach(function (product) {
        card_list.innerHTML += getCardHtml(product)
    })

    // Отримуємо всі кнопки "Додати в кошик" на сторінці
    let buyButtons = document.querySelectorAll('.add-to-cart');
    // Навішуємо обробник подій на кожну кнопку "Купити"
    if (buyButtons) {
        buyButtons.forEach(function (button) {
            button.addEventListener('click', addToCart)
        });
    }
})


 function getCartItem(item){
    return `<div class="my-card" style="width: 18rem;">
        <img src="img/${item.image}">
        <h5 class="text-my-card">${item.title}</h5>
        <p class="description-card">
        ${item.description}
       </p>
        <p class="price-card">
      ${item.price}
       </p>
         <p class="price-card">
      Кількість: ${item.quantity}
       </p>
      
    </div>`
 }
let cart_list = document.querySelector('.cart-items-list')
if (cart_list){
    cart_list.innerHTML = ''
    for (let title in cart.items){
        cart_list.innerHTML+= getCartItem(cart.items[title])
    }
}
