document.addEventListener("DOMContentLoaded", function () {
    const updateCartButton = document.querySelector(".up-cart");
    const quantityInputs = document.querySelectorAll('.quantity-input');
    const selectAllCheckbox = document.getElementById('select-all');
    const subtotalPriceElement = document.querySelector('.subtotal-price');
    const totalCartPriceElement = document.querySelector('.total-cart-price');
    const removeLinks = document.querySelectorAll('.ti-close');
    const confirmationModal = document.getElementById('confirmationModal');
    let isChanged = false;

    // Function to update totals and subtotal
    function updateTotals() {
        let subtotal = 0;
        let total = 0;

        const itemCheckboxes = document.querySelectorAll('.item-checkbox');
        itemCheckboxes.forEach((checkbox) => {
            const row = checkbox.closest('tr');
            const priceElement = row.querySelector('.p-price');
            const quantityInput = row.querySelector('.quantity-input');
            const itemTotalElement = row.querySelector('.item-total');

            const price = parseFloat(priceElement.textContent.replace('$', ''));
            const quantity = parseInt(quantityInput.value, 10);
            const totalForItem = price * quantity;

            itemTotalElement.textContent = `$${totalForItem.toFixed(2)}`; // Update item total
            total += totalForItem; // Update total

            if (checkbox.checked) {
                subtotal += totalForItem; // Only add to subtotal if checked
            }
        });

        subtotalPriceElement.textContent = `$${subtotal.toFixed(2)}`; // Update subtotal
        totalCartPriceElement.textContent = `$${subtotal.toFixed(2)}`; // Total is the same as subtotal for selected items
    }

    // Function to save cart
    function saveCart() {
        const cartItems = [];
        const cartItemElements = document.querySelectorAll(".cart-item");

        cartItemElements.forEach((itemElement) => {
            const productId = itemElement.querySelector(".quantity-input").getAttribute("data-id");
            const itemQuantity = itemElement.querySelector(".quantity-input").value;

            if (itemQuantity > 0) {
                cartItems.push({
                    id: parseInt(productId),
                    quantity: parseInt(itemQuantity)
                });
            }
        });

        if (cartItems.length > 0) {
            fetch("/cart/update-cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(cartItems)
            })
            .then(response => {
                return response.json().then(data => {
                    if (response.ok) {
                        // alert(data.message || "Cart updated successfully.");
                        location.reload();
                    } else {
                        alert(`Failed to update the cart: ${data.error || "No message available"}`);
                    }
                });
            })
            .catch(error => {
                console.error("Error updating cart:", error);
                alert("An error occurred. Please try again.");
            });
        }
    }

    // Handle the update cart button click
    if (updateCartButton) {
        updateCartButton.addEventListener("click", function (event) {
            event.preventDefault();
            saveCart(); // Save cart on button click
        });
    }

    // Enable the update button when quantity is changed
    quantityInputs.forEach(input => {
        input.addEventListener('input', function () {
            isChanged = true;
            updateCartButton.disabled = false;
            updateTotals(); // Update totals on quantity change
        });
    });

    // Handle select all checkbox
    selectAllCheckbox.addEventListener('change', function () {
        const itemCheckboxes = document.querySelectorAll('.item-checkbox');
        itemCheckboxes.forEach(checkbox => {
            checkbox.checked = selectAllCheckbox.checked;
        });
        updateTotals(); // Update totals when select all is checked/unchecked
    });

    // Handle individual item checkbox changes
    const itemCheckboxes = document.querySelectorAll('.item-checkbox');
    itemCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            isChanged = true; // Changing checkboxes counts as a change
            updateCartButton.disabled = false;
            updateTotals(); // Update totals on checkbox change
        });
    });

    // Show confirmation modal when navigating away
    function showConfirmationModal() {
        confirmationModal.style.display = 'flex';
    }

    // Handle navigation links
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function (event) {
            if (isChanged) {
                event.preventDefault(); // Prevent navigation
                showConfirmationModal(); // Show the modal
                // Handle confirmation buttons
                document.getElementById('save-cart').onclick = function () {
                    saveCart();
                    confirmationModal.style.display = 'none';
                    setTimeout(() => {
                        window.location.href = link.href; // Navigate after saving
                    }, 500); // Delay to allow save
                };
                document.getElementById('leave-without-saving').onclick = function () {
                    confirmationModal.style.display = 'none';
                    window.location.href = link.href; // Navigate without saving
                };
            }
        });
    });

    // Handle removal of items
    removeLinks.forEach(link => {
        link.addEventListener('click', function () {
            isChanged = true;
            updateCartButton.disabled = false;
            updateTotals(); // Update totals after an item is removed
        });
    });
});
