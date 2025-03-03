import { supabaseconfig } from './supabase.js';

document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;

        if (!name || !email || !password) {
            Swal.fire('Warning', 'Please fill in all fields.', 'warning');
            return;
        }

        const signupButton = document.querySelector('.btn');
        signupButton.disabled = true; // Disable button during signup

        const { data, error } = await supabaseconfig.auth.signUp({
            email,
            password,
            options: { data: { name } }
        });

        if (error) throw error;

        Swal.fire({
            title: 'Success!',
            text: 'Check your email to verify your account.',
            icon: 'success',
            timer: 3000,
            showConfirmButton: false
        }).then(() => {
            window.location.href = 'login.html';
        });

    } catch (err) {
        Swal.fire('Error', 'Signup failed: ' + err.message, 'error');
    } finally {
        document.querySelector('.btn').disabled = false; // Re-enable button
    }
});
