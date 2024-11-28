function cancelOrder(orderId) {
    // Confirm action with the user
    if (!confirm('Are you sure you want to cancel this order?')) return;

    // Send AJAX request to cancel the order
    $.ajax({
        url: '/cancel-order', // Backend endpoint to handle cancellation
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ id: orderId }),
        success: function (response) {
            // Update the status dynamically
            const orderStatus = document.getElementById(`order-status-${orderId}`);
            const statusTextElement = document.getElementById('order-status-text-' + orderId);
            orderStatus.innerHTML = `
                <a href="#" class="btn btn-primary" onclick="deleteOrder(${orderId})">Delete</a>
            `;
            statusTextElement.textContent = 'Cancelled';
        },
        error: function (xhr, status, error) {
            alert('Failed to cancel the order. Your order is not available or order status has been changed !');
            window.location.href = '/order';
        }
    });
}

function deleteOrder(orderId) {
    if (!confirm('Are you sure you want to delete this order?')) return;
    // Send AJAX request to delete the order
    $.ajax({
        url: '/delete-order', // Backend endpoint to handle deletion
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ id: orderId }),
        success: function (response) {
            // Remove the row from the table dynamically
            const orderRow = document.getElementById(`order-row-${orderId}`);
            if (orderRow) {
                orderRow.remove();
            }
        },
        error: function (xhr, status, error) {
            alert('Failed to delete the order. Your order is not available or order status has been changed !');
            window.location.href = '/order';
        }
    });
    
}
function updateOrderStatus(orderId) {
    // Get the dropdown element by its ID
    const dropdown = document.getElementById(`status-dropdown-${orderId}`);

    // Get the selected status value
    const selectedStatus = dropdown.value;

    // Define the URL for updating the order status
    const url = `/update-order-status/${orderId}/${selectedStatus}`;

    // Send the POST request to the server
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (response.ok) {
            return response.text();
        } else {
            throw new Error(`Error updating order status: ${response.status}`);
        }
    })
    .then(data => {
        // Display a success message or perform other actions
        console.log(data);
    })
    .catch(error => {
        // Handle any errors
        console.error(error);
        alert(`Failed to update order status for Order ${orderId}`);
    });
}

