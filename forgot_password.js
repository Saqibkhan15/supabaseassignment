import { supabaseconfig } from './supabase.js';

document.getElementById('forgot-password-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const email = document.getElementById('forgot-password-email').value;

        const { error } = await supabaseconfig.auth.resetPasswordForEmail(email);
        if (error) throw error;

        alert('A password reset link has been sent to your email.');
    } catch (err) {
        alert('Error sending reset email: ' + err.message);
    }
});
