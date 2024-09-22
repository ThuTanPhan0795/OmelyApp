document.addEventListener('DOMContentLoaded', function() {
    const quantityInputs = document.querySelectorAll('.quantity-input');

    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            const productId = this.dataset.productId;
            const quantity = this.value;

            fetch('/cart/updateQuantity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    'productId': productId,
                    'quantity': quantity
                })
            })
            .then(response => response.text())
            .then(result => {
                if (result === 'Success') {
                    // Optionally update total price on client side
                    location.reload(); // Reload to reflect changes
                } else {
                    alert('Error updating quantity');
                }
            })
            .catch(error => {
                console.error('Error updating quantity:', error);
                alert('Error updating quantity');
            });
        });
    });
});
