document.addEventListener("DOMContentLoaded", function () {
    const subtotalPriceElement = document.querySelector(".subtotal-price");
    const totalCartPriceElement = document.querySelector(".total-cart-price");
    const itemRows = document.querySelectorAll(".cart-item");

    // Function to update totals and subtotal
    function updateTotals() {
        let subtotal = 0;

        // Loop through each item row
        itemRows.forEach((row) => {
            const priceElement = row.querySelector(".p-price");
            const quantityElement = row.querySelector(".total-price h5");
            const itemTotalElement = row.querySelector(".item-total");

            // Parse price and quantity
            const price = parseFloat(priceElement.textContent.replace("$", "").replace(",", ""));
            const quantity = parseInt(quantityElement.textContent, 10) || 0;
            const totalForItem = price * quantity;

            // Update item total display
            itemTotalElement.textContent = `$${totalForItem.toFixed(2)}`;

            // Add to subtotal
            subtotal += totalForItem;
        });

        // Update subtotal and total cart price displays
        subtotalPriceElement.textContent = `$${subtotal.toFixed(2)}`;
        totalCartPriceElement.textContent = `$${subtotal.toFixed(2)}`;
    }

    // Function to validate email format
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Function to validate phone number
    function isValidPhoneNumber(phone) {
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phone);
    }

    // Function to check if a field is empty
    function isFieldEmpty(value) {
        return value.trim() === '';
    }

    // Select all save buttons
    document.querySelectorAll('.save-address-btn').forEach(button => {
        button.addEventListener('click', function () {
            const index = this.getAttribute('data-index');
            const userId = document.querySelector(`input[name='firstName_${index}']`).getAttribute('data-id');

            // Collect the data from the form fields for this address section
            const addressData = {
                id: userId,
                firstName: getInputValue(`input[name='firstName_${index}']`),
                lastName: getInputValue(`input[name='lastName_${index}']`),
                email: getInputValue(`input[name='email_${index}']`),
                mobileNo: getInputValue(`input[name='mobileNo_${index}']`),
                address: getInputValue(`input[name='address_${index}']`),
                district: getInputValue(`input[name='district_${index}']`),
                country: document.querySelector(`select[name='country_${index}']`).value,
                city: getInputValue(`input[name='city_${index}']`),
                zipCode: getInputValue(`input[name='zipCode_${index}']`)
            };

            // Validation checks
            if (
                isFieldEmpty(addressData.firstName) ||
                isFieldEmpty(addressData.lastName) ||
                isFieldEmpty(addressData.address) ||
                isFieldEmpty(addressData.district) ||
                isFieldEmpty(addressData.country) ||
                isFieldEmpty(addressData.city) ||
                isFieldEmpty(addressData.zipCode)
            ) {
                alert('All fields are required. Please fill in all fields.');
                return;
            }

            if (!isValidEmail(addressData.email)) {
                alert('Please enter a valid email address.');
                return;
            }

            if (!isValidPhoneNumber(addressData.mobileNo)) {
                alert('Phone number must be 10 digits.');
                return;
            }

            // Send the data to the backend via AJAX
            fetch('/saveAddress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(addressData)
            })
            .then(data => {
                // alert('Address saved successfully!');
                showPopup('Address saved successfully!' ,'success')
            })
            .catch(error => {
                console.error('Error saving address:', error);
                // alert('An error occurred while saving the address. Please try again.');
                showPopup('An error occurred while saving the address. Please try again.' ,'error')
            });
        });
    });
    function showPopup(message, type = "success") {
        const popup = document.getElementById("cart-popup");
        const popupMessage = popup.querySelector(".popup-message");

        popupMessage.textContent = message; // Set the message

        // Add or remove the 'error' class based on type
        if (type === "error") {
            popup.classList.add("error");
        } else {
            popup.classList.remove("error");
        }

        popup.classList.add("show"); // Show the popup

        // Hide popup after 3 seconds
        setTimeout(() => {
            popup.classList.remove("show", "error");
        }, 1000);
   }

    // Function to get input value or use the placeholder if empty
    function getInputValue(selector) {
        const inputElement = document.querySelector(selector);
        return inputElement.value.trim() === '' ? inputElement.placeholder : inputElement.value;
    }

    // Place order functionality
    $(document).ready(function () {
        $('.place-btn').on('click', function (e) {
            e.preventDefault();

            let selectedAddress = $('input[name="selectedAddress"]:checked');

            if (!selectedAddress.length) {
                alert('You need to select a billing address.');
                return;
            }
            
            let selectedAddressID = selectedAddress.attr('id');
            let addressIndex = selectedAddressID ? selectedAddressID.replace('address', '') : undefined;

            let addressData = {
                firstName: $('input[name="firstName_' + addressIndex + '"]').val() || $('input[name="firstName_' + addressIndex + '"]').attr('placeholder'),
                lastName: $('input[name="lastName_' + addressIndex + '"]').val() || $('input[name="lastName_' + addressIndex + '"]').attr('placeholder'),
                email: $('input[name="email_' + addressIndex + '"]').val() || $('input[name="email_' + addressIndex + '"]').attr('placeholder'),
                mobileNo: $('input[name="mobileNo_' + addressIndex + '"]').val() || $('input[name="mobileNo_' + addressIndex + '"]').attr('placeholder'),
                address: $('input[name="address_' + addressIndex + '"]').val() || $('input[name="address_' + addressIndex + '"]').attr('placeholder'),
                district: $('input[name="district_' + addressIndex + '"]').val() || $('input[name="district_' + addressIndex + '"]').attr('placeholder'),
                country: $('select[name="country_' + addressIndex + '"]').val(),
                city: $('input[name="city_' + addressIndex + '"]').val() || $('input[name="city_' + addressIndex + '"]').attr('placeholder'),
                zipCode: $('input[name="zipCode_' + addressIndex + '"]').val() || $('input[name="zipCode_' + addressIndex + '"]').attr('placeholder')
            };

            // Validate the collected address data
            if (
                isFieldEmpty(addressData.firstName) ||
                isFieldEmpty(addressData.lastName) ||
                isFieldEmpty(addressData.address) ||
                isFieldEmpty(addressData.district) ||
                isFieldEmpty(addressData.city) ||
                isFieldEmpty(addressData.zipCode)
            ) {
                alert('All fields are required. Please fill in all fields.');
                return;
            }

            if (!isValidEmail(addressData.email)) {
                alert('Please enter a valid email address.');
                return;
            }

            if (!isValidPhoneNumber(addressData.mobileNo)) {
                alert('Phone number must be 10 digits.');
                return;
            }

            let products = [];
            $('.cart-item').each(function () {
                let product = {
                    id: $(this).find('.cart-title').attr('id'),
                    quantity: $(this).find('.total-price h5').text()
                };
                products.push(product);
            });

            let totalPrice = $('.total-cart-price').text();

            let orderData = {
                address: addressData,
                products: products,
                totalPrice: totalPrice
            };

            $.ajax({
                url: '/place-order',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(orderData),
                success: function (response) {
                    // alert('Order placed successfully!');
                    window.location.href = '/order';
                },
                error: function (xhr, status, error) {
                    alert('There was an error placing the order. Please try again.');
                }
            });
        });
    });

    // Handling address selection
    const radioButtons = document.querySelectorAll('.address-radio');
    const collapsibleElements = document.querySelectorAll('.address-collapse');

    radioButtons.forEach((radio, index) => {
        radio.addEventListener('change', function () {
            collapsibleElements.forEach(collapse => {
                collapse.classList.remove('show');
            });

            if (radio.checked) {
                const targetId = radio.getAttribute('data-target');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.classList.add('show');
                }
            }
        });
    });

    // Call updateTotals on page load
    updateTotals();
});
