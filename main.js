document.addEventListener('DOMContentLoaded', () => {
    const admissionForm = document.getElementById('admissionForm');
    const successMessage = document.getElementById('successMessage');
    const container = document.querySelector('.container');

    let submitted = false;
    const hiddenIframe = document.getElementById('hidden_iframe');

    admissionForm.addEventListener('submit', (e) => {
        // We do NOT preventDefault() so the form submits to the iframe
        submitted = true;

        // Show loading state on button
        const submitBtn = admissionForm.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Submitting...</span>';

        // Update header if visible
        const header = document.querySelector('.header');
        if (header) header.style.opacity = '0.5';
    });

    const successOverlay = document.getElementById('successOverlay');

    hiddenIframe.onload = () => {
        if (submitted) {
            // Show success popup
            successOverlay.classList.remove('hidden');
            setTimeout(() => {
                successOverlay.classList.add('active');
            }, 10); // Small delay to allow CSS transition

            // Reset button state
            const submitBtn = admissionForm.querySelector('.submit-btn');
            submitBtn.innerHTML = '<span>Submitted</span>';

            console.log('Google Form response received.');
        }
    };
});

function resetForm() {
    const admissionForm = document.getElementById('admissionForm');
    const successOverlay = document.getElementById('successOverlay');
    const header = document.querySelector('.header');
    const submitBtn = admissionForm.querySelector('.submit-btn');

    // Close popup
    successOverlay.classList.remove('active');
    setTimeout(() => {
        successOverlay.classList.add('hidden');
    }, 400); // Wait for transition

    // Reset form
    admissionForm.reset();
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span>Submit Application</span>';
    submitBtn.appendChild(createGlowElement()); // Re-add glow effect element if it was lost, or just reset text

    if (header) header.style.opacity = '1';
}

function createGlowElement() {
    const div = document.createElement('div');
    div.className = 'btn-glow';
    return div;
}
