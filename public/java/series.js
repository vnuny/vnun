// Select all forms on the page
const forms = document.querySelectorAll('form');

// Add a click event listener to each form
forms.forEach(form => {
    form.addEventListener('click', function() {
        // Your code to handle the form click event goes here
        // For example, you can submit the form
        form.submit();
    });
});
