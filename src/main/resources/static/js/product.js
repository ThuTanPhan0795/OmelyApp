
// document.addEventListener("DOMContentLoaded", function () {
//     // Function to handle page changes via AJAX
//     function applySorting(page) {
//         const currentUrl = new URL(window.location.href);
//         const currentPage = page;
//         console.log(currentPage);
//         const sortingDropdown = document.querySelector('[id^="sorting-dropdown"]');
//         console.log(sortingDropdown);
//         const selectedOption = sortingDropdown.value;
//         console.log(selectedOption);
    
//         // Update the URL parameters
//         if (selectedOption) {
//             currentUrl.searchParams.set('sortBy', selectedOption);
//         } else {
//             currentUrl.searchParams.delete('sortBy');
//         }
//         currentUrl.searchParams.set('page', currentPage); // Keep the current page in the URL
    
//         // Redirect to the updated URL
//         window.location.href = currentUrl.toString();
//     }

//     // Add event listeners to pagination links
//     document.querySelectorAll(".pagination .page-link").forEach(link => {
//         link.addEventListener("click", function (event) {
//             event.preventDefault(); // Prevent default link behavior

//             // Get the page number from the data-page attribute
//             const page = this.getAttribute("data-page");
//             console.log(page);
//             if (page !== null) {
//                 applySorting(page); // Load the selected page
//             }
//         });
//     });
// });
document.addEventListener("DOMContentLoaded", function () {
    // Function to handle page changes via AJAX
    function loadProducts(page, sortBy) {
        const xhr = new XMLHttpRequest();
        const url = `/shop?page=${page}&sortBy=${sortBy}`;

        xhr.open("GET", url, true);
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        console.log("xhr " + xhr.status);
        xhr.onload = function () {
            if (xhr.status === 200) {
                // Replace the content inside the product list with the new content
                console.log("ok1");
                console.log(document.querySelector("#product-list"));
                document.querySelector("#product-list").innerHTML = xhr.responseText;
                console.log("ok2");
                // Update pagination links
                setupPaginationLinks();
            } else {
                console.error("Error " + xhr.status + ": " + xhr.responseText);
            }
        };
        xhr.send();
    }

    // Function to set up event listeners for pagination links
    function setupPaginationLinks() {
        document.querySelectorAll(".pagination .page-link").forEach(link => {
            link.addEventListener("click", function (event) {
                event.preventDefault(); // Prevent default link behavior

                const page = this.getAttribute("data-page");
                sortingdropdown(page);
            });
        });
    }

    // Initial setup for sorting dropdown
    const sortingDropdown = document.querySelector('[id^="sorting-dropdown"]');
    sortingDropdown.addEventListener("change", function () {
        sortingdropdown(0);
    });
    const categorySortingDropdown = document.querySelector('#category-sorting-dropdown select');
    categorySortingDropdown.addEventListener("change", function () {
        sortingdropdown(0);
    });
    const priceSortingDropdown = document.querySelector('#price-sorting-dropdown select');
    priceSortingDropdown.addEventListener("change", function () {
        sortingdropdown(0);
    });

    function sortingdropdown(pageNumber){
        const page = pageNumber; // Start from the first page when sorting changes
        const sortingValue = sortingDropdown ? sortingDropdown.value : null;
        const categoryValue = categorySortingDropdown ? categorySortingDropdown.value : null;
        const priceValue = priceSortingDropdown ? priceSortingDropdown.value : null;
        let minPrice = '';
        let maxPrice = '';

        if (priceValue && priceValue.includes('-')) {
            const [min, max] = priceValue.split('-').map(Number); // Convert to numbers
            minPrice = min;
            maxPrice = max;
        } else if (priceValue) {
            minPrice = Number(priceValue); // For "Higher 100" case, where only minPrice is defined
            maxPrice = ''; // No max price
        }
        console.log("sortBy "+ sortingValue);
        console.log("categoryValue "+ categoryValue);
        console.log("minPrice "+ minPrice);
        console.log("maxPrice "+ maxPrice);
        filterProducts(page, sortingValue, categoryValue, minPrice, maxPrice);

    }

    // Set up pagination links for the first load
    setupPaginationLinks();

    // Filter button click handler
    document.querySelector(".filter-btn").addEventListener("click", function () {
        const page = 0; // Start from the first page when applying the filter
        const sortingDropdown = document.querySelector('[id^="sorting-dropdown"]');
        const sortBy = sortingDropdown.value;

        // Get selected categories
        const selectedCategories = [];
        document.querySelectorAll('.filter-widget input[type="checkbox"]:checked').forEach(checkbox => {
            selectedCategories.push(checkbox.value);
        });

        // Get the min and max price
        const minPrice = document.querySelector('#minamount').value;
        const maxPrice = document.querySelector('#maxamount').value;

        filterProducts(page, sortBy, selectedCategories, minPrice, maxPrice);
    });

    function filterProducts(page, sortBy, selectedCategories, minPrice, maxPrice) {
        // Remove '€' and '$' symbols from price values before passing
        // minPrice = minPrice.replace('€', '').replace('$', '').trim();
        // maxPrice = maxPrice.replace('€', '').replace('$', '').trim();

        const xhr = new XMLHttpRequest();
        const params = new URLSearchParams();
        params.append("page", page);
        params.append("sortBy", sortBy);

        if (selectedCategories !== null) params.append("categories", selectedCategories);
        if (minPrice !== null) params.append("minPrice", minPrice);
        if (maxPrice !== null) params.append("maxPrice", maxPrice);

        const url = `/shop_filter?${params.toString()}`;
        console.log("url "+ url);
        xhr.open("GET", url, true);
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        console.log("xhr " + xhr.status);
        xhr.onload = function () {
            if (xhr.status === 200) {
                // Replace the content inside the product list with the new content
                console.log("ok1");
                document.querySelector("#product-list").innerHTML = xhr.responseText;
                console.log("ok2");
                // Update pagination links
                setupPaginationLinks();
            } else {
                console.error("Error " + xhr.status + ": " + xhr.responseText);
            }
        };
        xhr.send();
    }

    const filters = document.querySelectorAll(".filter-item select"); // All dropdowns
    const filterCount = document.querySelector(".filter-count"); // Filter count badge
    const resetButton = document.querySelector(".reset-button"); // Reset button

    /**
     * Update the filter count based on selected filters.
     */
    function updateFilterCount() {
        let count = 0;
        filters.forEach(filter => {
            if (filter.value && filter.value !== filter.options[0].value) {
                count++;
            }
        });

        // Update the badge
        filterCount.textContent = count;

        // Show or hide the badge based on count
        filterCount.style.display = count > 0 ? "inline-block" : "none";
    }

    /**
     * Reset all filters to their default state.
     */
    function resetFilters() {
        filters.forEach(filter => {
            filter.selectedIndex = 0; // Reset dropdown to the first option
        });
        updateFilterCount(); // Refresh filter count
        filterProducts(0,"newest",null,null,null);
    }

    // Add change event listeners to all dropdowns
    filters.forEach(filter => {
        filter.addEventListener("change", updateFilterCount);
    });

    // Add click event listener to the reset button
    resetButton.addEventListener("click", resetFilters);

    // Initialize the filter count on page load
    updateFilterCount();
});
