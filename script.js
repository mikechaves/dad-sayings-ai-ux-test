// script.js

// Store participant responses
let responses = [];

// Get elements
const choiceButtons = document.querySelectorAll('.choice-button');
const modal = document.getElementById('feedback-modal');
const closeButton = document.querySelector('.close-button');
const feedbackQuestion = document.getElementById('feedback-question');
const submitFeedbackButton = document.getElementById('submit-feedback');
const feedbackResponse = document.getElementById('feedback-response');

// Current choice
let currentChoice = {};

// Function to open modal with a specific question
function openModal(question) {
    feedbackQuestion.textContent = question;
    modal.style.display = 'block';
}

// Function to close modal
function closeModal() {
    modal.style.display = 'none';
    feedbackResponse.value = ''; // Clear previous feedback
}

// Handle choice button clicks
choiceButtons.forEach(button => {
    button.addEventListener('click', () => {
        const choice = button.getAttribute('data-choice');
        const responseText = button.textContent;

        // Store the choice
        currentChoice = { choice, responseText };
        responses.push(currentChoice);

        // Open feedback modal
        openModal('Why did you choose this response?');
    });
});

// Handle close button click
closeButton.addEventListener('click', closeModal);

// Handle submit feedback
submitFeedbackButton.addEventListener('click', () => {
    const feedback = feedbackResponse.value.trim();
    if (feedback === '') {
        alert('Please provide your feedback before submitting.');
        return;
    }

    // Add feedback to current choice
    currentChoice.feedback = feedback;

    // Log responses to console (you can modify this to send to a server)
    console.log('Participant Responses:', responses);

    // Close modal
    closeModal();

    // Optionally, proceed to the next part of the test or thank the participant
    alert('Thank you for your feedback!');
    // Here you can redirect or reset the test
    // For example, reset responses and allow re-taking the test
    // responses = [];
});
