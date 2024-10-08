import { conexionDB } from "./conexionDB.js";
import { createPagination } from "./pagination.js";
import { handleDeleteButtonClick } from "./deleteProducts.js"; // Importar la función

const ulList = document.querySelector("[data-list]");
const itemsPerPage = 6; // Número de productos por página
let currentPage = 1; // Página actual

// Función para crear una tarjeta de producto
export default function createProductCard(productName, productPrice, productUrl, productId) {
    const product = document.createElement('li');
    product.className = "product-list__item";

    product.innerHTML = `
        <img src="${productUrl}" alt="Product 1 - Description of product" class="product-list__image" itemprop="image">
        <h3 class="product-list__name" itemprop="name">${productName}</h3>
        <hr class="card-divider">
        <p class="card-footer" itemprop="offers" itemscope itemtype="http://schema.org/Offer">
            <span itemprop="price" content="USD">$${productPrice}</span>
            <a href="" class="delete-button" data-id="${productId}">
                <i class="fas fa-trash-can"></i>
            </a>
        </p>
    `;

    return product;
}

// Función para renderizar los productos de acuerdo a la página
export async function renderProducts(page = 1) {
    const data = await conexionDB.listProducts(page, itemsPerPage); // Obtenemos los productos para la página solicitada

    ulList.innerHTML = ""; // Limpiar la lista antes de renderizar

    // Renderizar cada producto
    data.products.forEach(productItem => {
        const productCard = createProductCard(
            productItem.productName, 
            productItem.productPrice, 
            productItem.productUrl,
            productItem.id // Asegúrate de pasar el ID del producto
        );

        // Añadir evento de clic al botón de eliminar para pasar el productId a la función de eliminar
        const deleteButton = productCard.querySelectorAll(".delete-button");

        deleteButton.forEach((button) => {
            button.addEventListener("click", (event) => {
                event.preventDefault();  // Prevenir la acción predeterminada
                handleDeleteButtonClick(productItem.id);// Llamar a la función con el ID del producto

            });
        });


        ulList.appendChild(productCard); // Añadir la tarjeta del producto a la lista
    });

    // Llamar a la función de paginación
    createPagination(data.totalItems, itemsPerPage, page, (newPage) => {
        currentPage = newPage;
        renderProducts(currentPage); // Actualizar la lista de productos con la nueva página
    });
}

// Llamar a la función para renderizar los productos en la primera página
renderProducts(currentPage);
