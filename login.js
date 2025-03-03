import { supabaseconfig } from './supabase.js';

document.addEventListener('DOMContentLoaded', async () => {
    const { data: { session } } = await supabaseconfig.auth.getSession();
    if (session) window.location.href = 'dashboard.html';
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        Swal.fire('Warning', 'Please enter both email and password.', 'warning');
        return;
    }

    const loginButton = document.querySelector('.submit-btn');
    loginButton.disabled = true;  
    try {
        const { data, error } = await supabaseconfig.auth.signInWithPassword({ email, password });
        
        if (error) {
            Swal.fire('Error', error.message || 'Login failed.', 'error');
            throw error;
        }

        Swal.fire({
            title: 'Success!',
            text: 'Login successful!',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        }).then(() => {
            window.location.href = 'dashboard.html';
        });

    } catch (err) {
        console.error(err);
    } finally {
        loginButton.disabled = false;  
    }
});
