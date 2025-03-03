import { supabaseconfig } from './supabase.js';

const darkModeToggle = document.getElementById('dark-mode-toggle');
if (darkModeToggle) {
    const isDarkMode = localStorage.getItem('dark-mode') === 'enabled';
    if (isDarkMode) document.body.classList.add('dark-mode');

    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('dark-mode', document.body.classList.contains('dark-mode') ? 'enabled' : 'disabled');
    });
}

async function loadPosts() {
    try {
        document.getElementById('loading-message').textContent = 'Loading posts...';

        const { data: posts, error } = await supabaseconfig.from('posts').select('*');
        if (error) throw error;

        const postsContainer = document.getElementById('posts-container');
        postsContainer.innerHTML = '';
        document.getElementById('loading-message').style.display = 'none';

        posts.forEach(post => {
            postsContainer.innerHTML += `
                <tr class="post-item">
                    <td>${post.title}</td>
                    <td>${post.content}</td>
                    <td>${new Date(post.created_at).toLocaleString()}</td>
                    <td>
                        <button onclick="editPost(${post.id})" class="btn">Edit</button>
                        <button onclick="deletePost(${post.id})" class="btn">Delete</button>
                    </td>
                </tr>
            `;
        });
    } catch (err) {
        Swal.fire('Error', err.message, 'error');
    }
}

supabaseconfig
    .channel('posts')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, loadPosts)
    .subscribe();

window.editPost = async (postId) => {
    const { value: formValues } = await Swal.fire({
        title: 'Edit Post',
        html: `
            <input id="swal-title" class="swal2-input" placeholder="New Title">
            <textarea id="swal-content" class="swal2-textarea" placeholder="New Content"></textarea>
        `,
        focusConfirm: false,
        preConfirm: () => {
            return {
                title: document.getElementById('swal-title').value,
                content: document.getElementById('swal-content').value
            };
        }
    });

    if (!formValues.title || !formValues.content) return;

    try {
        const { error } = await supabaseconfig
            .from('posts')
            .update({ title: formValues.title, content: formValues.content })
            .eq('id', postId);

        if (error) throw error;
    } catch (err) {
        Swal.fire('Error', err.message, 'error');
    }
};

window.deletePost = async (postId) => {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!'
    });

    if (!result.isConfirmed) return;

    try {
        const { error } = await supabaseconfig.from('posts').delete().eq('id', postId);
        if (error) throw error;
    } catch (err) {
        Swal.fire('Error', err.message, 'error');
    }
};

document.getElementById('logout-btn').addEventListener('click', async () => {
    try {
        await supabaseconfig.auth.signOut();
        Swal.fire('Logged Out', 'You have been logged out successfully.', 'success').then(() => {
            window.location.href = 'login.html';
        });
    } catch (err) {
        Swal.fire('Error', err.message, 'error');
    }
});

document.getElementById('post-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;

    if (!title || !content) {
        return Swal.fire('Warning', 'Please fill out both the title and content.', 'warning');
    }

    try {
        const { error } = await supabaseconfig
            .from('posts')
            .insert([{ title, content, created_at: new Date().toISOString() }]);

        if (error) throw error;

        Swal.fire('Success', 'Post created successfully.', 'success');
        loadPosts();
    } catch (err) {
        Swal.fire('Error', err.message, 'error');
    }
});

loadPosts();
