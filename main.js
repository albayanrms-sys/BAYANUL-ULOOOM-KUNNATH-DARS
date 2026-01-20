document.addEventListener('DOMContentLoaded', () => {
    const admissionForm = document.getElementById('admissionForm');
    const successMessage = document.getElementById('successMessage');
    const container = document.querySelector('.container');

    admissionForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Show loading state on button
        const submitBtn = admissionForm.querySelector('.submit-btn');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Submitting...</span>';

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Get form data
        const formData = new FormData(admissionForm);
        const data = Object.fromEntries(formData.entries());
        data.timestamp = new Date().toISOString();

        // Persist to LocalStorage
        const submissions = JSON.parse(localStorage.getItem('admissions') || '[]');
        submissions.push(data);
        localStorage.setItem('admissions', JSON.stringify(submissions));

        console.log('Application saved:', data);

        // Transition to success state
        admissionForm.classList.add('hidden');
        successMessage.classList.remove('hidden');

        // Update header if visible
        const header = document.querySelector('.header');
        if (header) header.style.opacity = '0.5';
    });
});

function resetForm() {
    const admissionForm = document.getElementById('admissionForm');
    const successMessage = document.getElementById('successMessage');
    const header = document.querySelector('.header');

    admissionForm.reset();
    admissionForm.classList.remove('hidden');
    successMessage.classList.add('hidden');
    if (header) header.style.opacity = '1';
}
