/**
 * =============================================================================
 *                    SCRIPT.JS - Client-Side JavaScript
 * =============================================================================
 *
 * 📚 WHAT IS THIS FILE?
 * ---------------------
 * Client-side JavaScript that runs in the browser.
 * Currently handles Bootstrap form validation.
 *
 * 🔗 HOW IT WORKS:
 * ---------------
 * 1. Loads after page loads (script tag at bottom of body)
 * 2. Finds all forms with class 'needs-validation'
 * 3. Adds submit event listeners to prevent invalid submissions
 * 4. Shows Bootstrap validation styles on invalid fields
 *
 * 📌 JAVASCRIPT CONCEPTS:
 * ----------------------
 * - IIFE: (() => { })() - Immediately Invoked Function Expression
 * - 'use strict': Enables strict mode for safer code
 * - querySelectorAll: Select multiple elements
 * - forEach: Loop over elements
 * - addEventListener: Handle events
 * - event.preventDefault(): Stop form submission
 * - classList.add(): Add CSS classes dynamically
 *
 * 📖 INTERVIEW TIP:
 * ----------------
 * "I used Bootstrap's form validation with JavaScript to provide instant
 * feedback to users. The IIFE pattern keeps variables scoped and prevents
 * global namespace pollution."
 *
 * =============================================================================
 */

// Bootstrap Form Validation Script
// Source: Bootstrap Documentation
// https://getbootstrap.com/docs/5.3/forms/validation/

(() => {
  'use strict'

  /**
   * Find all forms that need validation
   * '.needs-validation' is a Bootstrap class for custom validation
   */
  const forms = document.querySelectorAll('.needs-validation')

  /**
   * Add validation to each form
   * - Prevents submission if form is invalid
   * - Adds 'was-validated' class to show validation styles
   */
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      // Check if form is valid using HTML5 validation API
      if (!form.checkValidity()) {
        // Stop form from submitting
        event.preventDefault()
        // Stop event from bubbling up
        event.stopPropagation()
      }

      // Add Bootstrap class to show validation feedback
      form.classList.add('was-validated')
    }, false) // false = event bubbles (default behavior)
  })
})()