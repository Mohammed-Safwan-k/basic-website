const hamburgerButton = document.getElementById("hamburgerBtn");
const dropdownMenu = document.getElementById("dropdownMenu");

const viewToggle = document.getElementById("view-toggle");
const mobilePhone = document.getElementById("mobile-phone");
const mobileView = document.getElementById("mobile-view");
const fullPage = document.getElementById("full-page");

hamburgerButton.addEventListener("click", () => {
  if (dropdownMenu.style.display === "block") {
    dropdownMenu.style.display = "none";
  } else {
    dropdownMenu.style.display = "block";
  }
});

// Function to sync toggle state inside the iframe
function syncToggleState(checked) {
  const iframeDocument =
    mobileView.contentDocument || mobileView.contentWindow.document;
  const iframeToggle = iframeDocument.getElementById("view-toggle");
  if (iframeToggle) {
    iframeToggle.checked = checked;
  }
}

viewToggle.addEventListener("change", function () {
  if (this.checked) {
    const doc = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="stylesheet" href="styles.css" />
      </head>
      <body>
        ${fullPage.innerHTML}
        <script src="script.js"></script>
        <script>
          const iframeToggle = document.getElementById('view-toggle');
          iframeToggle.addEventListener('change', function() {
            window.parent.postMessage({toggleChecked: this.checked}, '*');
          });
        </script>
      </body>
    </html>`;
    mobileView.srcdoc = doc; // Inject the content into the iframe
    mobilePhone.classList.remove("hidden"); // Show mobile phone div
    fullPage.classList.add("hidden"); // Hide full page

    mobileView.onload = () => syncToggleState(true); // Sync toggle state to iframe when it loads
  } else {
    mobilePhone.classList.add("hidden"); // Hide mobile phone div
    fullPage.classList.remove("hidden"); // Show full page

    syncToggleState(false); // Sync toggle state to iframe if unchecked
  }
});

// Initial check to ensure iframe toggle is synced on page load
mobileView.onload = () => syncToggleState(viewToggle.checked);

// Listen for messages from the iframe
window.addEventListener('message', function(event) {
    if (event.data.toggleChecked === false) {
      // User toggled back to full screen inside the iframe
      viewToggle.checked = false;
      mobilePhone.classList.add("hidden"); // Hide mobile phone div
      fullPage.classList.remove("hidden"); // Show full page
    }
  });