const fs = require('fs');
const path = require('path');
const pathCart = path.join(__dirname, 'cart.json');

class CartService {
    constructor() {
        this.carts = [];
        this.path = pathCart;

        if (!fs.existsSync(this.path)) {
            fs.writeFileSync(this.path, '[]');
        }

        try {
            this.carts = JSON.parse(fs.readFileSync(this.path, 'utf-8'));
        } catch (error) {
            this.carts = [];
        }

        CartService.id = this.carts.reduce((prev, curr) => (
            curr.id >= prev ? curr.id : prev
        ), 0);
    }

    getAllCarts(){
        try{
            return this.carts;
        }catch(error) {
            console.log(error);
        }
    }

    async createCart() {
        try {
            const id = ++CartService.id;
            const newCart = {
                id,
                products: []
            };
    
            this.carts.push(newCart);
            await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));
        } catch (error) {
            console.log(`[ERROR] -> ${error}`);
        }
    }
    

    async getProducts(cartId) {
        try {
            const cart = this.carts.find(cart => cart.id === cartId);

            if (!cart) {
                throw new Error('Carrito no encontrado');
            }

            return cart.products;
        } catch (error) {
            console.log(`[ERROR] -> ${error}`);
        }
    }

    async addProduct(cartId, productId) {
        try {
            const selectedCartIndex = this.carts.findIndex(cart => cart.id === cartId);

            if (selectedCartIndex === -1) {
                throw new Error('Carrito no encontrado');
            }

            const selectedCart = this.carts[selectedCartIndex];

            const selectedProduct = selectedCart.products.find(cart => cart.product === productId);


            if (selectedProduct) {
                selectedProduct.quantity += 1;
                console.log(selectedProduct)
            }else{
                    selectedCart.products.push({ product: productId, quantity: 1 });
            }
                this.carts[selectedCartIndex] = selectedCart;
                await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));
        } catch (error) {
            console.log(`[ERROR] -> ${error}`);
        }
    }
}

const cartService = new CartService();

module.exports = cartService;
