import { supabaseconfig } from './supabase.js';


(async () => {
    try {
        const { data, error } = await supabaseconfig.auth.getSession();
        if (error) throw error;

        const { session } = data;
        if (!session) {
            window.location.href = 'login.html';
            return;
        }

        const user = session.user;
        document.getElementById('user-name').textContent = user.user_metadata.full_name || 'User';
        
        // Fetch profile picture
        const { data: profileData, error: profileError } = await supabaseconfig
            .from('profiles')
            .select('profile_picture')
            .eq('id', user.id)
            .single();
        
        if (!profileError && profileData.profile_picture) {
            document.getElementById('profile-pic').src = profileData.profile_picture;
        }
    } catch (err) {
        console.error("Error checking session:", err.message);
        window.location.href = 'login.html';
    }
})();

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
                <div class="post-item">
                    <h3>${post.title}</h3>
                    <p>${post.content}</p>
                    <small>By ${post.author_name} | ${new Date(post.created_at).toLocaleString()}</small>
                    <button onclick="editPost(${post.id})" class="btn">Edit</button>
                    <button onclick="deletePost(${post.id})" class="btn">Delete</button>
                </div>
            `;
        });
    } catch (err) {
        console.error("Error loading posts:", err.message);
    }
}


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

document.getElementById('post-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;

    if (!title || !content) return alert("Please fill out both the title and content.");

    try {
        const { error } = await supabaseconfig
            .from('posts')
            .insert([
                { title, content, author_name: 'User', created_at: new Date().toISOString() }
            ]);

        if (error) throw error;

        loadPosts();  // Reload posts after new one is created
    } catch (err) {
        console.error("Error creating post:", err.message);
    }
});

// Load Initial Posts
loadPosts();
