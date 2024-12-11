document.addEventListener('DOMContentLoaded', function () {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartPopup = document.getElementById('cart-popup');
    const popupMessage = document.getElementById('popup-message');
    const closePopupButton = document.querySelector('.close-popup');

    // Function to show the popup with a message
    function showPopup(message) {
        popupMessage.textContent = message;
        cartPopup.style.display = 'block';

        setTimeout(() => {
            cartPopup.style.display = 'none';  // Hide popup after 3 seconds
        }, 3000);
    }

    // Close popup when the user clicks the 'x' button
    closePopupButton.addEventListener('click', () => {
        cartPopup.style.display = 'none';
    });

    // Add event listeners to all 'Add to Cart' buttons
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();  // Prevent default link behavior

            const productId = button.getAttribute('data-product-id');
            const url = `/cart/add/${productId}`;

            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to add to cart');
                    }
                    return response.json();
                })
                .then(data => {
                    showPopup(data.message);  // Show success message in popup
                })
                .catch(error => {
                    console.error('Error:', error);
                    showPopup('Failed to add product to cart.', 'danger');  // Show error message
                });
        });
    });
});
// function applySorting() {
//     const sortBy = document.getElementById('sorting-dropdown').value;
//     const currentPage = new URLSearchParams(window.location.search).get('page') || 0;
//     const pageSize = new URLSearchParams(window.location.search).get('size') || 12;
//     console.log("sortBy "+sortBy);
//     console.log("currentPage "+currentPage);
//     console.log("pageSize "+pageSize);
//     window.location.href = `/sort?page=${currentPage}&size=${pageSize}&sortBy=${sortBy}`;
// }

