$(document).ready(function() {
    // Update API endpoints for Magic Loops per new Loop IDs
    const apiEndpoints = {
        // Using StudySummary Loop for Note Summarizer:
        summarize: 'https://magicloops.dev/api/loop/62affb5d-2d7f-4649-a056-fd5c373b8f83/run',
        // Using QuizMaker Loop for Quiz Generation:
        quiz: 'https://magicloops.dev/api/loop/6602943e-4f4e-4b0c-b0ac-28621aa3482b/run',
        // Using FlashCardGen for Flashcards creation:
        flashcards: 'https://magicloops.dev/api/loop/f0bc3275-073b-4c56-b186-2ef824141aac/run',
        // Using StudyQA Loop for the Chatbot:
        chatbot: 'https://magicloops.dev/api/loop/f9dd8d93-3d6c-4874-a3d7-6b0821a0e877/run',
        // Using PDFTextExtract Loop for PDF Processing:
        pdf: 'https://magicloops.dev/api/loop/53ae357d-d8e1-47f3-8845-291d30f638ab/run'
    };

    // Navigation and View Management
    function showView(viewId) {
        $('.view').removeClass('active').hide();
        $('#' + viewId + '-view').addClass('active').show();
        
        // For dashboard view, show the first dashboard tab
        if (viewId === 'dashboard') {
            $('.dashboard-view').removeClass('active').hide();
            $('#dashboard-home-view').addClass('active').show();
            
            // Update sidebar active link
            $('.sidebar-link').removeClass('active');
            $('[data-dashboard-view="dashboard-home"]').addClass('active');
        }
    }
    
    // Handle view navigation
    $('[data-view]').click(function(e) {
        e.preventDefault();
        const viewId = $(this).data('view');
        showView(viewId);
        // Close sidebar on mobile when a link is clicked
        if (window.innerWidth < 992) {
            $('#sidebar').removeClass('show');
            $('#sidebar-overlay').removeClass('show');
        }
    });
    
    // Close mobile navigation menu when a nav link is clicked
    $('.navbar-nav .nav-link').click(function() {
        // Check if navbar is expanded (mobile view)
        if (window.innerWidth < 992 && $('#navbarContent').hasClass('show')) {
            // Collapse the navbar by simulating a click on the navbar toggler
            $('.navbar-toggler').click();
            // Alternative approach if the above doesn't work reliably:
            // $('#navbarContent').removeClass('show');
            // $('.navbar-toggler').attr('aria-expanded', 'false');
        }
    });

    // Dashboard sub-view navigation - improved version
    $('[data-dashboard-view]').click(function(e) {
        e.preventDefault();
        const dashboardViewId = $(this).data('dashboard-view');
        
        // Hide all dashboard views first
        $('.dashboard-view').removeClass('active').hide();
        
        // Show only the selected view with a fade-in effect
        $('#' + dashboardViewId + '-view').addClass('active').fadeIn(300);
        
        // Update sidebar active link with enhanced styling
        $('.sidebar-link').removeClass('active');
        $(this).addClass('active');
        
        // Close sidebar on mobile when a link is clicked
        if (window.innerWidth < 992) {
            $('#sidebar').removeClass('show');
            $('#sidebar-overlay').removeClass('show');
        }
    });
    
    // Mobile sidebar toggle
    $('#mobile-toggle').click(function() {
        $('#sidebar').toggleClass('show');
        $('#sidebar-overlay').toggleClass('show');
    });
    
    $('#sidebar-overlay').click(function() {
        $('#sidebar').removeClass('show');
        $('#sidebar-overlay').removeClass('show');
    });
    
    // Theme toggle
    let darkMode = localStorage.getItem('darkMode') === 'true';
    
    // Update theme toggle for better visual indication in dark mode
    function updateTheme() {
        if (darkMode) {
            $('body').addClass('dark-mode');
            $('#theme-toggle i').removeClass('bi-moon-fill').addClass('bi-sun-fill');
            $('#settings-dark-mode').addClass('active');
            $('.navbar').addClass('navbar-dark');
        } else {
            $('body').removeClass('dark-mode');
            $('#theme-toggle i').removeClass('bi-sun-fill').addClass('bi-moon-fill');
            $('#settings-dark-mode').removeClass('active');
            $('.navbar').removeClass('navbar-dark');
        }
    }
    
    updateTheme();
    
    $('#theme-toggle, #settings-dark-mode').click(function() {
        darkMode = !darkMode;
        localStorage.setItem('darkMode', darkMode);
        updateTheme();
    });
    
    // Login / Signup Forms
    $('#login-form').submit(function(e) {
        e.preventDefault();
        const email = $('#login-email').val();
        const password = $('#login-password').val();
        
        // Validate form
        if (!email || !password) {
            alert('Please fill in all fields.');
            return;
        }
        
        // This is just simulating login - in a real app, this would call an API
        const userInfo = {
            name: email.split('@')[0],
            email: email,
            isLoggedIn: true
        };
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        
        updateLoginState(true);
        showView('dashboard');
    });
    
    $('#signup-form').submit(function(e) {
        e.preventDefault();
        const name = $('#signup-name').val();
        const email = $('#signup-email').val();
        const password = $('#signup-password').val();
        const confirmPassword = $('#signup-confirm-password').val();
        
        if (!name || !email || !password || !confirmPassword) {
            alert('Please fill in all fields.');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        const userInfo = {
            name: name,
            email: email,
            isLoggedIn: true
        };
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        
        updateLoginState(true);
        showView('dashboard');
    });
    
    $('#logout-link').click(function(e) {
        e.preventDefault();
        localStorage.removeItem('userInfo');
        updateLoginState(false);
        showView('landing');
    });
    
    function updateLoginState(isLoggedIn) {
        if (isLoggedIn) {
            $('#login-nav-item, #signup-nav-item').addClass('d-none');
            $('#dashboard-nav-item, #logout-nav-item').removeClass('d-none');
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            $('#user-name').text(userInfo.name);
            $('#settings-name').val(userInfo.name);
            $('#settings-email').val(userInfo.email);
        } else {
            $('#login-nav-item, #signup-nav-item').removeClass('d-none');
            $('#dashboard-nav-item, #logout-nav-item').addClass('d-none');
        }
    }
    
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
        const parsedUserInfo = JSON.parse(userInfo);
        if (parsedUserInfo && parsedUserInfo.isLoggedIn) {
            updateLoginState(true);
        }
    }
    
    $('.dashboard-view:not(.active)').hide();
    
    $('[data-view="dashboard"]').click(function() {
        $('.dashboard-view').hide();
        $('#dashboard-home-view').show().addClass('active');
        $('.sidebar-link').removeClass('active');
        $('[data-dashboard-view="dashboard-home"]').addClass('active');
    });
    
    // Summarizer Tool modifications:
    $('#generate-summary-btn').click(function() {
        const text = $('#summarizer-input').val();
        const summaryLength = $('#summary-length').val();
        
        if (!text.trim()) {
            alert('Please enter some text to summarize.');
            return;
        }
        
        const button = $(this);
        button.prop('disabled', true);
        button.html('<span class="loading-spinner me-2"></span> Generating...');
        
        fetch(apiEndpoints.summarize, {
            method: 'POST',
            body: JSON.stringify({ "content": text })
        })
        .then(res => res.json())
        .then(responseJson => {
            $('#summary-result').html(`<p>${responseJson.summary}</p>`);
            $('#summary-result-card').show();
            button.prop('disabled', false);
            button.html('Generate Summary');
        })
        .catch(error => {
            alert("Failed to generate summary. Please try again.");
            button.prop('disabled', false);
            button.html('Generate Summary');
        });
    });
    
    $('#copy-summary-btn').click(function() {
        const summaryText = $('#summary-result').text();
        navigator.clipboard.writeText(summaryText).then(() => {
            const originalText = $(this).html();
            $(this).html('<i class="bi bi-check"></i> Copied!');
            setTimeout(() => {
                $(this).html(originalText);
            }, 2000);
        });
    });
    
    $('#download-summary-btn').click(function() {
        const summaryText = $('#summary-result').text();
        const blob = new Blob([summaryText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'summary.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
    
    $('#generate-quiz-btn').click(function () {
const topic = $('#quiz-topic').val();
const content = $('#quiz-content').val();
const count = $('#quiz-count').val();
const difficulty = $('#quiz-difficulty').val();

if (!topic.trim() || !content.trim()) {
alert('Please enter a topic and study content.');
return;
}

const button = $(this);
button.prop('disabled', true);
button.html('<span class="loading-spinner me-2"></span> Generating...');

fetch(apiEndpoints.quiz, {
method: 'POST',
body: JSON.stringify({ "content": content })
})
.then(res => res.json())
.then(responseJson => {
const quizHtml = responseJson.quiz.map((q, index) => `
    <div class="quiz-question" data-question-index="${index}" data-answer="${escapeHtml(q.answer)}">
        <h5 class="quiz-question-text">${index + 1}. ${q.question}</h5>
        <div class="mt-3 quiz-options">
            ${q.options.map(opt => `
                <div class="quiz-option py-1 px-2 border rounded mb-2" data-option="${escapeHtml(opt)}">
                    <input type="radio" name="question-${index}" class="me-2"> <span class="quiz-option-text">${opt}</span>
                </div>
            `).join('')}
        </div>
        <div class="mt-2">
            <button class="btn btn-sm btn-outline-primary reveal-answer-btn">Show Answer</button>
            <div class="quiz-answer text-muted mt-1" style="display:none;">
                Correct Answer: <strong>${escapeHtml(q.answer)}</strong>
            </div>
        </div>
    </div>
`).join('');

$('#quiz-container').html(`
    <h5 class="mb-3">Your Quiz</h5>
    <div class="card mb-4">
        <div class="card-body">
            ${quizHtml}
        </div>
    </div>
`);

$('#quiz-container').show();
button.prop('disabled', false);
button.html('Generate Quiz');
})
.catch(error => {
alert("Failed to generate quiz. Please try again.");
button.prop('disabled', false);
button.html('Generate Quiz');
});
});

// 🟢 Handle "Show Answer"
$(document).on('click', '.reveal-answer-btn', function () {
const questionBlock = $(this).closest('.quiz-question');
const correctAnswer = questionBlock.data('answer');

// Reveal answer section
questionBlock.find('.quiz-answer').slideDown();
$(this).prop('disabled', true).html('Answer Shown');

// Disable option selection
questionBlock.find('input[type="radio"]').prop('disabled', true);

// Highlight selected and correct option
questionBlock.find('.quiz-option').each(function () {
const optionText = $(this).data('option');
const isSelected = $(this).find('input[type="radio"]').is(':checked');

if (optionText === correctAnswer) {
$(this).addClass('bg-success text-white');
} else if (isSelected) {
$(this).addClass('bg-danger text-white');
} else {
// Avoid bg-light in dark mode
$(this).addClass('quiz-option-neutral');
}
});
});
    
    function sendChatMessage() {
        const message = $('#chat-input').val();
        
        if (!message.trim()) return;
        
        $('#chat-messages').append(`
            <div class="message user-message">
                <p class="mb-0">${escapeHtml(message)}</p>
            </div>
        `);
        
        $('#chat-input').val('');
        scrollChatToBottom();
        
        $('#chat-messages').append(`
            <div class="message bot-message" id="typing-indicator">
                <p class="mb-0"><i>Typing...</i></p>
            </div>
        `);
        
        scrollChatToBottom();
        
        fetch(apiEndpoints.chatbot, {
            method: 'POST',
            body: JSON.stringify({
                "question": message,
                "context": "User initiated question via chatbot"
            })
        })
        .then(res => res.json())
        .then(responseJson => {
            $('#typing-indicator').remove();
            $('#chat-messages').append(`
                <div class="message bot-message">
                    <p class="mb-0">${escapeHtml(responseJson.answer)}</p>
                </div>
            `);
            scrollChatToBottom();
        })
        .catch(error => {
            $('#typing-indicator').remove();
            $('#chat-messages').append(`
                <div class="message bot-message">
                    <p class="mb-0">Sorry, I'm having trouble responding right now. Please try again later.</p>
                </div>
            `);
            scrollChatToBottom();
        });
    }
    
    $('#chat-send-btn').click(function() {
        sendChatMessage();
    });
    
    $('#chat-input').keypress(function(e) {
        if (e.which === 13) {
            sendChatMessage();
            e.preventDefault();
        }
    });
    
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    
    function scrollChatToBottom() {
        const chatMessages = $('#chat-messages');
        chatMessages.scrollTop(chatMessages[0].scrollHeight);
    }
    
    $('#chat-upload-btn').click(function() {
        $('#chat-file-input').click();
    });
    
    $('#chat-file-input').change(function() {
        if (this.files.length > 0) {
            const fileName = this.files[0].name;
            $('#chat-messages').append(`
                <div class="message bot-message">
                    <p class="mb-0">File "${escapeHtml(fileName)}" uploaded successfully. You can now ask questions about this document.</p>
                </div>
            `);
            scrollChatToBottom();
        }
    });
    
    $('#generate-flashcards-btn').click(function() {
        const topic = $('#flashcard-topic').val();
        const content = $('#flashcard-content').val();
        const count = $('#flashcard-count').val();
        
        if (!topic.trim() || !content.trim()) {
            alert('Please enter a topic and study content.');
            return;
        }
        
        const button = $(this);
        button.prop('disabled', true);
        button.html('<span class="loading-spinner me-2"></span> Generating...');
        
        fetch(apiEndpoints.flashcards, {
            method: 'POST',
            body: JSON.stringify({ "content": content })
        })
        .then(res => res.json())
        .then(responseJson => {
            const flashcardsHtml = responseJson.flashCards.map(card => `
                <div class="col-md-4">
                    <div class="flashcard">
                        <div class="flashcard-inner">
                            <div class="flashcard-front">
                                <h5>${card.question}</h5>
                                <p class="small">(Click to flip)</p>
                            </div>
                            <div class="flashcard-back">
                                <p>${card.answer}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
            $('#flashcards-deck').html(flashcardsHtml);
            $('#flashcards-container').show();
            button.prop('disabled', false);
            button.html('Generate Flashcards');
        })
        .catch(error => {
            alert("Failed to generate flashcards. Please try again.");
            button.prop('disabled', false);
            button.html('Generate Flashcards');
        });
    });
    
    $(document).on('click', '.flashcard', function() {
        $(this).toggleClass('flipped');
    });
    
    $('#dashboard-dropzone').click(function() {
        $('#dashboard-file-input').click();
    });
    
    $('#dashboard-file-input').change(function() {
        if (this.files.length > 0) {
            $('.dashboard-view').removeClass('active').hide();
            $('#pdf-view').addClass('active').show();
            $('.sidebar-link').removeClass('active');
            $('[data-dashboard-view="pdf"]').addClass('active');
            
            const fileName = this.files[0].name;
            $('#pdf-filename').text(fileName);
            $('#pdf-info').show();
            $('#pdf-actions').show();
        }
    });
    
    $('#pdf-file-input').change(function() {
        if (this.files.length > 0) {
            const file = this.files[0];
            const fileName = file.name;
            $('#pdf-filename').text(fileName);
            $('#pdf-info').show();
            $('#pdf-actions').show();
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const fileData = e.target.result;
                fetch(apiEndpoints.pdf, {
                    method: 'POST',
                    body: JSON.stringify({ "pdfFile": fileData })
                })
                .then(res => res.json())
                .then(responseJson => {
                    console.log("Extracted PDF Content:", responseJson);
                })
                .catch(error => {
                    console.error("PDF extraction failed", error);
                });
            };
            reader.readAsDataURL(file);
        }
    });
    
    $('#pdf-summarize-btn').click(function() {
        $('.dashboard-view').removeClass('active').hide();
        $('#summarizer-view').addClass('active').show();
        $('.sidebar-link').removeClass('active');
        $('[data-dashboard-view="summarizer"]').addClass('active');
    });
    
    $('#pdf-chat-btn').click(function() {
        $('.dashboard-view').removeClass('active').hide();
        $('#chatbot-view').addClass('active').show();
        $('.sidebar-link').removeClass('active');
        $('[data-dashboard-view="chatbot"]').addClass('active');
        
        const fileName = $('#pdf-filename').text();
        $('#chat-messages').append(`
            <div class="message bot-message">
                <p class="mb-0">PDF "${escapeHtml(fileName)}" has been loaded. You can now ask questions about this document.</p>
            </div>
        `);
        scrollChatToBottom();
    });
    
    $('#pdf-flashcards-btn').click(function() {
        $('.dashboard-view').removeClass('active').hide();
        $('#flashcards-view').addClass('active').show();
        $('.sidebar-link').removeClass('active');
        $('[data-dashboard-view="flashcards"]').addClass('active');
    });
    
    $('#pdf-quiz-btn').click(function() {
        $('.dashboard-view').removeClass('active').hide();
        $('#quiz-view').addClass('active').show();
        $('.sidebar-link').removeClass('active');
        $('[data-dashboard-view="quiz"]').addClass('active');
    });
    
    $('#save-account-settings').click(function() {
        const name = $('#settings-name').val();
        const email = $('#settings-email').val();
        
        if (!name.trim() || !email.trim()) {
            alert('Please enter your name and email.');
            return;
        }
        
        const button = $(this);
        button.prop('disabled', true);
        button.html('<span class="loading-spinner me-2"></span> Saving...');
        
        setTimeout(() => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                userInfo.name = name;
                userInfo.email = email;
                localStorage.setItem('userInfo', JSON.stringify(userInfo));
                
                $('#user-name').text(name);
                alert('Settings saved successfully!');
            } catch (error) {
                alert('An error occurred while saving settings. Please try again.');
            } finally {
                button.prop('disabled', false);
                button.html('Save Changes');
            }
        }, 1000);
    });
    
   // Handle the "Clear Storage" button (unchanged)
$('#clear-storage-btn').click(function() {
    if (confirm('Are you sure you want to clear all stored data? This cannot be undone.')) {
        alert('This is a prototype. In the full version, this would clear your saved data.');
    }
});

// Enable "Browse File" button to open hidden input
document.getElementById('browse-pdf-btn').addEventListener('click', function() {
    document.getElementById('pdf-file-input').click();
});

// Handle file selection from browse input
document.getElementById('pdf-file-input').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        uploadFile(file);
    }
});

// Dropzone handling
['pdf-dropzone'].forEach(id => {
    const dropzone = document.getElementById(id);

    if (dropzone) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            dropzone.addEventListener(eventName, () => dropzone.classList.add('border-primary'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, () => dropzone.classList.remove('border-primary'), false);
        });

        dropzone.addEventListener('drop', handleDrop, false);

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;

            if (files.length > 0) {
                uploadFile(files[0]);
            }
        }
    }
});

    function callApi(endpoint, data, successCallback, errorCallback) {
        console.log(`API call to ${endpoint} with data:`, data);
        setTimeout(() => {
            try {
                const response = {
                    success: true,
                    message: "This is a prototype. The full functionality will be available after connecting to the API."
                };
                if (successCallback) {
                    successCallback(response);
                }
            } catch (error) {
                console.error("API Error:", error);
                if (errorCallback) {
                    errorCallback(error);
                } else {
                    alert("An error occurred. Please try again.");
                }
            }
        }, 1500);
    }
});

//voice input
function createSpeechHandler(targetId) {
    let recognition;
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            document.getElementById(targetId).value += transcript + ' ';
        };

        recognition.onerror = function(event) {
            alert('Speech recognition error: ' + event.error);
        };

        recognition.start();
    } else {
        alert('Your browser does not support voice input.');
    }
}

// For Note Summarizer
function startSpeechToText() {
    createSpeechHandler('summarizer-input');
}

// For Study Chatbot
function startSpeechToChat() {
    createSpeechHandler('chat-input');
}