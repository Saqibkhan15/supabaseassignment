import { supabaseconfig } from './supabase.js';

(async () => {
    try {
        const { data: { session } } = await supabaseconfig.auth.getSession();
        if (!session) {
            alert('You must log in first!');
            window.location.href = 'login.html';
        }
    } catch (err) {
        console.error('Session error:', err);
        alert('An error occurred while verifying your session.');
    }
})();

document.getElementById('update-profile-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const name = document.getElementById('update-name').value;
        const email = document.getElementById('update-email').value;
        const profilePic = document.getElementById('profile-pic').files[0];

        const { data, error } = await supabaseconfig.auth.updateUser({ email, data: { name } });
        if (error) throw error;

        if (profilePic) {
            const { data: uploadData, error: uploadError } = await supabaseconfig.storage.from('profile_pictures').upload(`profiles/${data.user.id}`, profilePic, { upsert: true });
            if (uploadError) throw uploadError;

            const { data: publicUrl } = supabaseconfig.storage.from('profile_pictures').getPublicUrl(`profiles/${data.user.id}`);
            await supabaseconfig.auth.updateUser({ data: { profile_url: publicUrl.publicUrl } });
        }

        alert('Profile updated successfully!');
    } catch (err) {
        alert(`Error updating profile: ${err.message}`);
    }
});

document.getElementById('update-password-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const oldPassword = document.getElementById('old-password').value;
        const newPassword = document.getElementById('new-password').value;
        const { data: { user } } = await supabaseconfig.auth.getUser();

        const { error: loginError } = await supabaseconfig.auth.signInWithPassword({ email: user.email, password: oldPassword });
        if (loginError) throw new Error('Old password is incorrect!');

        const { error: updateError } = await supabaseconfig.auth.updateUser({ password: newPassword });
        if (updateError) throw updateError;

        alert('Password updated successfully!');
        document.getElementById('update-password-form').reset();
    } catch (err) {
        alert(`Error updating password: ${err.message}`);
    }
});

document.getElementById('back-to-dashboard').addEventListener('click', () => {
    window.location.href = 'dashboard.html';
});
