// script.js

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBzXrkGb1lm-yLeERu9D62EK4NDru8HLBs",
    authDomain: "dad-sayings-ai-ux-test.firebaseapp.com",
    projectId: "dad-sayings-ai-ux-test",
    storageBucket: "dad-sayings-ai-ux-test.appspot.com",
    messagingSenderId: "106688867459",
    appId: "1:106688867459:web:0963afbbffe100361bbfb6",
    measurementId: "G-XE703VC9XC"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Array of scenarios
const scenarios = [
    {
        prompt: "Things your dad would say when you need help around the house:",
        choices: [
            "Just tighten it a little more. It’s not rocket science.",
            "Let me show you how it's done. Safety first!",
            "Why don’t you watch a video tutorial instead?"
        ]
    },
    {
        prompt: "Things your dad would say when you're fixing a leaky faucet:",
        choices: [
            "Use some plumber's tape and see if that helps.",
            "I’ve got the tools you need. Let me help you.",
            "Isn’t there an app for that?"
        ]
    },
    {
        prompt: "Things your dad would say when you're assembling furniture:",
        choices: [
            "Make sure all the screws are tight.",
            "I remember doing this when I was your age.",
            "Why don’t you hire someone to do it?"
        ]
    },
    {
        prompt: "Things your dad would say when you're painting a room:",
        choices: [
            "Don’t forget to tape the edges properly.",
            "I prefer using oil-based paints for durability.",
            "Just throw some paint on and call it done."
        ]
    },
    {
        prompt: "Things your dad would say when you're mowing the lawn:",
        choices: [
            "Keep the mower level for an even cut.",
            "Let me know if you need any help with the equipment.",
            "Why don’t you let the neighbors handle it?"
        ]
    },
    {
        prompt: "Things your dad would say when you're fixing a car:",
        choices: [
            "Always disconnect the battery before starting.",
            "I can teach you how to change a tire.",
            "Why don’t you just take it to a mechanic?"
        ]
    },
    {
        prompt: "Things your dad would say when you're gardening:",
        choices: [
            "Water the plants early in the morning.",
            "Let me show you how to prune those bushes.",
            "Why don’t you buy pre-planted flowers?"
        ]
    },
    {
        prompt: "Things your dad would say when you're fixing a jammed garbage disposal:",
        choices: [
            "Always turn off the power before reaching in.",
            "I can walk you through the steps.",
            "Why don’t you just call a professional?"
        ]
    }
];

// Variables to track progress and responses
let currentTest = 0;
const totalTests = scenarios.length;
let responses = [];

// Get elements
const privacyNotice = document.querySelector('.privacy-notice');
const acceptPrivacyButton = document.getElementById('accept-privacy');
const mainContent = document.querySelector('.main-content');
const currentTestSpan = document.getElementById('current-test');
const totalTestsSpan = document.getElementById('total-tests');
const questionPrompt = document.getElementById('question-prompt');
const choiceButtons = document.querySelectorAll('.choice-button');
const feedbackModal = document.getElementById('feedback-modal');
const conclusionModal = document.getElementById('conclusion-modal');
const closeButtons = document.querySelectorAll('.close-button');
const feedbackQuestion = document.getElementById('feedback-question');
const submitFeedbackButton = document.getElementById('submit-feedback');
const feedbackResponse = document.getElementById('feedback-response');

// Set total tests in progress indicator
totalTestsSpan.textContent = totalTests;

// Function to load a scenario
function loadScenario(index) {
    if (index < totalTests) {
        currentTestSpan.textContent = index + 1;
        const scenario = scenarios[index];
        questionPrompt.textContent = scenario.prompt;
        choiceButtons.forEach((button, i) => {
            button.textContent = scenario.choices[i];
            button.setAttribute('aria-pressed', 'false');
        });

        // Set focus to the first button for accessibility
        choiceButtons[0].focus();
    } else {
        // All tests completed
        showConclusion();
    }
}

// Function to open modal with a specific question
function openModal(question) {
    feedbackQuestion.textContent = question;
    feedbackModal.style.display = 'block';
    // Set focus to the textarea
    feedbackResponse.focus();
    // Trap focus inside the modal
    trapFocus(feedbackModal);
}

// Function to close modal
function closeModal(modalElement) {
    modalElement.style.display = 'none';
    feedbackResponse.value = ''; // Clear previous feedback
    // Remove focus trap
    removeTrapFocus();
}

// Function to show conclusion modal
function showConclusion() {
    conclusionModal.style.display = 'block';
    // Set focus to the close button
    conclusionModal.querySelector('.close-button').focus();
    // Trap focus inside the conclusion modal
    trapFocus(conclusionModal);
}

// Function to trap focus within a modal
let focusedElementBeforeModal;
function trapFocus(modal) {
    const focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), ' +
        'textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], ' +
        '[contenteditable]';
    const focusableElements = modal.querySelectorAll(focusableElementsString);
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    // Save the element that was focused before the modal was opened
    focusedElementBeforeModal = document.activeElement;

    // Listen for and trap the focus
    function handleFocus(event) {
        if (event.key === 'Tab') {
            if (event.shiftKey) { // Shift + Tab
                if (document.activeElement === firstFocusableElement) {
                    event.preventDefault();
                    lastFocusableElement.focus();
                }
            } else { // Tab
                if (document.activeElement === lastFocusableElement) {
                    event.preventDefault();
                    firstFocusableElement.focus();
                }
            }
        } else if (event.key === 'Escape') { // Allow closing with Escape key
            closeModal(modal);
        }
    }

    modal.addEventListener('keydown', handleFocus);

    // Store the handler to remove it later
    modal.focusHandler = handleFocus;
}

// Function to remove focus trap
function removeTrapFocus() {
    if (feedbackModal.style.display === 'block') {
        feedbackModal.removeEventListener('keydown', feedbackModal.focusHandler);
        if (focusedElementBeforeModal) focusedElementBeforeModal.focus();
    }
    if (conclusionModal.style.display === 'block') {
        conclusionModal.removeEventListener('keydown', conclusionModal.focusHandler);
        if (focusedElementBeforeModal) focusedElementBeforeModal.focus();
    }
}

// Function to handle choice button clicks
choiceButtons.forEach(button => {
    button.addEventListener('click', () => {
        const choice = button.textContent;

        // Store the choice
        responses.push({
            testNumber: currentTest + 1,
            prompt: scenarios[currentTest].prompt,
            selectedChoice: choice
        });

        // Update aria-pressed
        choiceButtons.forEach(btn => btn.setAttribute('aria-pressed', 'false'));
        button.setAttribute('aria-pressed', 'true');

        // Open feedback modal
        openModal('Why did you choose this response?');
    });
});

// Handle close button clicks for all modals
closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Determine which modal to close
        const modal = button.closest('.modal');
        closeModal(modal);
    });
});

// Handle submit feedback
submitFeedbackButton.addEventListener('click', () => {
    const feedback = feedbackResponse.value.trim();
    if (feedback === '') {
        alert('Please provide your feedback before submitting.');
        feedbackResponse.focus();
        return;
    }

    // Add feedback to the last response
    responses[currentTest].feedback = feedback;

    // Save to Firestore
    db.collection('participantResponses').add(responses[currentTest])
        .then(() => {
            console.log('Response successfully recorded!');
        })
        .catch((error) => {
            console.error('Error recording response: ', error);
        });

    // Close feedback modal
    closeModal(feedbackModal);

    // Increment test counter and load next scenario
    currentTest++;
    loadScenario(currentTest);
});

// Handle keyboard accessibility for modals
window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        if (feedbackModal.style.display === 'block') {
            closeModal(feedbackModal);
        }
        if (conclusionModal.style.display === 'block') {
            closeModal(conclusionModal);
        }
    }
});

// Handle privacy consent
acceptPrivacyButton.addEventListener('click', () => {
    privacyNotice.style.display = 'none';
    mainContent.style.display = 'block';
    loadScenario(currentTest);
});
