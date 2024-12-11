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
                const sortingDropdown = document.querySelector('[id^="sorting-dropdown"]');
                const sortBy = sortingDropdown.value;

                if (page !== null) {
                    loadProducts(page, sortBy);
                }
            });
        });
    }

    // Initial setup for sorting dropdown
    const sortingDropdown = document.querySelector('[id^="sorting-dropdown"]');
    sortingDropdown.addEventListener("change", function () {
        const page = 0; // Start from the first page when sorting changes
        const sortBy = sortingDropdown.value;

        loadProducts(page, sortBy);
    });

    // Set up pagination links for the first load
    setupPaginationLinks();
});
