const fs = require('fs');
const path = './products.json';

class ProductManager {
    static id = 0;

    constructor() {
        this.props = ['title', 'description', 'price', 'code', 'stock'];
        this.path = path;
        try {
            this.products = JSON.parse(fs.readFileSync(this.path, 'utf-8'));
        } catch (error) {
            this.products = [];
        }
        ProductManager.id = this.products.reduce((prev, curr) => (
            curr.id >= prev ? curr.id : prev
        ), 0);
    }

    async getProducts() {
        try {
            return this.products;
        } catch (error) {
            console.log(error);
        }
    }

    isValidateCode(product) {
        return this.products.some(item => item.code === product.code);
    }

    async addProduct(product) {
        try {
            for (let prop of this.props) {
                if (!product.hasOwnProperty(prop) || this.isValidateCode(product)) {
                    return 'Producto inválido!';
                }
            }

            const id = ++ProductManager.id;
            const newProduct = {
                id,
                status: true,
                thumbnails: [],
                ...product
            };

            this.products.push(newProduct);
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
        } catch (error) {
            console.log(error);
        }
    }

    async getProductById(id) {
        try {
            const product = this.products.find(product => product.id === id);
            return product ?? 'Producto no encontrado';
        } catch (error) {
            console.log(error);
        }
    }

    async updateProduct(id, field, newValue) {
        try {
            const product = this.products.find(product => product.id === id);
            if (product) {
                product[field] = newValue;
                await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
            }
        } catch (error) {
            console.log(error);
        }
    }

    async deleteProduct(id) {
        try {
            this.products = this.products.filter(product => product.id !== id);
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
        } catch (error) {
            console.log(error);
        }
    }
}

const productManager = new ProductManager();

module.exports = productManager;