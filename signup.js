import { supabaseconfig } from './supabase.js';

document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;

        const { data, error } = await supabaseconfig.auth.signUp({ email, password, options: { data: { name } } });
        if (error) throw error;

        alert('Check your email to verify your account.');
        window.location.href = 'login.html';
    } catch (err) {
        alert('Signup failed: ' + err.message);
    }
});
