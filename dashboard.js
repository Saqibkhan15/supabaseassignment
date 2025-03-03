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
        postsContainer.innerHTML = ''; // Clear existing posts
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
        console.error("Error loading posts:", err.message);
    }
}

// Listen for changes to posts in real-time
supabaseconfig
    .channel('posts')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, loadPosts)
    .subscribe();

window.editPost = async (postId) => {
    const newTitle = prompt("Edit Title:");
    const newContent = prompt("Edit Content:");

    if (!newTitle || !newContent) return console.warn("Edit canceled.");

    try {
        const { error } = await supabaseconfig
            .from('posts')
            .update({ title: newTitle, content: newContent })
            .eq('id', postId);

        if (error) throw error;
    } catch (err) {
        console.error("Error editing post:", err.message);
    }
};

window.deletePost = async (postId) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
        const { error } = await supabaseconfig.from('posts').delete().eq('id', postId);
        if (error) throw error;
    } catch (err) {
        console.error("Error deleting post:", err.message);
    }
};

document.getElementById('logout-btn').addEventListener('click', async () => {
    try {
        await supabaseconfig.auth.signOut();
        window.location.href = 'login.html';
    } catch (err) {
        console.error("Error logging out:", err.message);
    }
});

// Handle post submission
document.getElementById('post-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;

    if (!title || !content) return alert("Please fill out both the title and content.");

    try {
        const { error } = await supabaseconfig
            .from('posts')
            .insert([
                { title, content, created_at: new Date().toISOString() }
            ]);

        if (error) throw error;

        loadPosts();  // Reload posts after new one is created
    } catch (err) {
        console.error("Error creating post:", err.message);
    }
});

// Load initial posts when the page loads
loadPosts();
