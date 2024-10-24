document.addEventListener("DOMContentLoaded", function () {
    const updateCartButton = document.querySelector(".up-cart");

    if (updateCartButton) {
        updateCartButton.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent the default anchor click behavior

            // Collect all selected items from the cart
            const cartItems = []; // Create an array to hold cart items
            const cartItemElements = document.querySelectorAll(".cart-item"); // Select all cart item elements

            cartItemElements.forEach((itemElement) => {
                const productId = itemElement.querySelector(".quantity-input").getAttribute("data-id");
                const itemQuantity = itemElement.querySelector(".quantity-input").value;

                // Log for debugging
                console.log(`Product ID : ${productId}, Quantity: ${itemQuantity}`);
                // Push the item details into the cartItems array
                if (itemQuantity > 0) { // Only include items with a quantity greater than 0
                    cartItems.push({
                        id: parseInt(productId),// Change to 'productId' if needed
                        quantity: parseInt(itemQuantity) // Ensure quantity is an integer
                    });
                }
            });

            // Check if there are items to update
            if (cartItems.length === 0) {
                alert("No items selected to update the cart.");
                return; // Exit the function if there are no items
            }

            // Send a POST request to update the cart
            fetch("/cart/update-cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(cartItems) // Convert the cartItems array to JSON
            })
            .then((response) => {
                return response.json().then((data) => {
                    if (response.ok) {
                        // Show success message and reload the page if the update was successful
                        alert(data.message || "Cart updated successfully.");
                        location.reload();
                    } else {
                        // Show an error message from the server response
                        alert(`Failed to update the cart: ${data.error || "No message available"}`);
                    }
                });
            })
            .catch((error) => {
                console.error("Error updating cart:", error);
                alert("An error occurred. Please try again.");
            });
        });
    }
});
// Function to update total and subtotal
function updateTotals() {
    const quantityInputs = document.querySelectorAll('.quantity-input');
    let subtotal = 0;

    quantityInputs.forEach(input => {
        const row = input.closest('tr');
        const price = parseFloat(row.querySelector('.p-price').textContent.replace('$', ''));
        const quantity = parseInt(input.value);
        const totalCell = row.querySelector('.item-total');

        // Update the total for this row
        const total = price * quantity;
        totalCell.textContent = total.toFixed(2); // Update the total cell

        // Update subtotal
        subtotal += total;
    });

    // Update subtotal and total cart price
    document.querySelector('.subtotal-price').textContent = subtotal.toFixed(2);
    document.querySelector('.total-cart-price').textContent = subtotal.toFixed(2);
}

// Add event listeners for quantity inputs
document.querySelectorAll('.quantity-input').forEach(input => {
    input.addEventListener('input', updateTotals);
});

// Initial calculation on page load
updateTotals();

