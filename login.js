import { supabaseconfig } from './supabase.js';

document.addEventListener('DOMContentLoaded', async () => {
    const { data: { session } } = await supabaseconfig.auth.getSession();
    if (session) window.location.href = 'dashboard.html';
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        const { error } = await supabaseconfig.auth.signInWithPassword({ email, password });
        if (error) throw error;

        window.location.href = 'dashboard.html';
    } catch (err) {
        alert('Login failed: ' + err.message);
    }
});
