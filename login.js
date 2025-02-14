import { supabaseconfig } from './supabase.js';

document.addEventListener('DOMContentLoaded', async () => {
    const { data: { session } } = await supabaseconfig.auth.getSession();
    if (session) window.location.href = 'dashboard.html';
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Validate form fields
    if (!email || !password) {
        alert('Please enter both email and password.');
        return;
    }

    const loginButton = document.querySelector('.btn');
    loginButton.disabled = true; // Disable button during login

    try {
        const { error } = await supabaseconfig.auth.signInWithPassword({ email, password });
        if (error) {
            // Check for specific error messages
            if (error.message.includes("Invalid email or password")) {
                alert("Invalid email or password. Please try again.");
            } else {
                alert('Login failed: ' + error.message);
            }
            throw error;
        }

        window.location.href = 'dashboard.html';
    } catch (err) {
        console.error(err);
    } finally {
        loginButton.disabled = false; // Re-enable button after login attempt
    }
});
