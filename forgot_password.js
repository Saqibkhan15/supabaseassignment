import { supabaseconfig } from './supabase.js';

document.getElementById('forgot-password-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const email = document.getElementById('forgot-password-email').value;

        const { error } = await supabaseconfig.auth.resetPasswordForEmail(email);
        if (error) throw error;

        Swal.fire('Success', 'A password reset link has been sent to your email.', 'success');
    } catch (err) {
        Swal.fire('Error', 'Error sending reset email: ' + err.message, 'error');
    }
});
