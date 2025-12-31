document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('access_token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user) {
        window.location.href = '/index.html';
        return;
    }

    document.getElementById('userName').textContent = user.name;

    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        window.location.href = '/index.html';
    });

    let selectedUserId = user.id;

    const usersListEl = document.getElementById('usersList');
    const postsListEl = document.getElementById('postsList');
    const postsTitleEl = document.getElementById('postsTitle');
    const createPostForm = document.getElementById('createPostForm');

    async function loadUsers() {
        try {
            const response = await ApiService.getUsers();
            const users = response.data;
            usersListEl.innerHTML = '';

            users.forEach(u => {
                const div = document.createElement('div');
                div.style.padding = '8px';
                div.style.borderRadius = '6px';
                div.style.cursor = 'pointer';
                div.style.backgroundColor = u.id === selectedUserId ? 'var(--bg-color)' : 'transparent';
                div.textContent = u.name;
                
                div.addEventListener('click', () => {
                    selectedUserId = u.id;
                    postsTitleEl.textContent = u.id === user.id ? 'My Posts' : `${u.name}'s Posts`;
                    
                    const createPostContainer = document.getElementById('createPostContainer');
                    if (u.id === user.id) {
                        createPostContainer.style.display = 'block';
                    } else {
                        createPostContainer.style.display = 'none';
                    }

                    loadPosts(u.id);
                    document.querySelectorAll('#usersList > div').forEach(d => d.style.backgroundColor = 'transparent');
                    div.style.backgroundColor = 'var(--bg-color)';
                });

                usersListEl.appendChild(div);
            });
        } catch (error) {
            usersListEl.textContent = 'Failed to load users.';
            console.error(error);
        }
    }

    function timeAgo(date) {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) {
             const years = Math.floor(interval);
             return years === 1 ? '1 year ago' : `${years} years ago`;
        }
        interval = seconds / 2592000;
        if (interval > 1) {
            const months = Math.floor(interval);
            return months === 1 ? '1 month ago' : `${months} months ago`;
        }
        interval = seconds / 86400;
        if (interval > 1) {
            const days = Math.floor(interval);
            return days === 1 ? '1 day ago' : `${days} days ago`;
        }
        interval = seconds / 3600;
        if (interval > 1) {
             const hours = Math.floor(interval);
             return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
        }
        interval = seconds / 60;
        if (interval > 1) {
             const minutes = Math.floor(interval);
             return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
        }
        return 'Just now';
    }

    async function loadPosts(userId) {
        postsListEl.innerHTML = 'Loading...';
        try {
            const response = await ApiService.getPosts(userId);
            const posts = response.data;
            
            if (posts.length === 0) {
                postsListEl.innerHTML = '<p style="color: var(--text-secondary);">No posts yet.</p>';
                return;
            }

            postsListEl.innerHTML = '';
            posts.forEach(post => {
                const div = document.createElement('div');
                div.className = 'post';
                
                const isMyPost = post.userId === user.id;
                
                div.innerHTML = `
                    <div class="post-header">
                        <span>${timeAgo(post.createdAt)}</span>
                        ${isMyPost ? '<button class="delete-btn">Delete</button>' : ''}
                    </div>
                `;
                
                const contentDiv = document.createElement('div');
                contentDiv.className = 'post-content clamped';
                contentDiv.textContent = post.content;
                div.appendChild(contentDiv);

                const checkOverflow = () => {
                    if (contentDiv.scrollHeight > contentDiv.clientHeight) {
                        const showMoreBtn = document.createElement('button');
                        showMoreBtn.className = 'show-more-btn';
                        showMoreBtn.textContent = 'Show more';
                        
                        showMoreBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            if (contentDiv.classList.contains('clamped')) {
                                contentDiv.classList.remove('clamped');
                                showMoreBtn.textContent = 'Show less';
                            } else {
                                contentDiv.classList.add('clamped');
                                showMoreBtn.textContent = 'Show more';
                            }
                        });
                        
                        contentDiv.parentNode.insertBefore(showMoreBtn, contentDiv.nextSibling);
                    }
                };

                if (isMyPost) {
                    div.querySelector('.delete-btn').addEventListener('click', () => {
                        const modal = document.getElementById('deleteModal');
                        const confirmBtn = document.getElementById('confirmDeleteBtn');
                        const cancelBtn = document.getElementById('cancelDeleteBtn');
                        
                        modal.classList.remove('hidden');

                        const newConfirmBtn = confirmBtn.cloneNode(true);
                        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
                        
                        const newCancelBtn = cancelBtn.cloneNode(true);
                        cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

                        newConfirmBtn.addEventListener('click', async () => {
                            try {
                                await ApiService.deletePost(post.id);
                                modal.classList.add('hidden');
                                loadPosts(selectedUserId);
                            } catch (e) {
                                alert(e.message);
                                modal.classList.add('hidden');
                            }
                        });

                        newCancelBtn.addEventListener('click', () => {
                           modal.classList.add('hidden'); 
                        });
                        
                        modal.addEventListener('click', (e) => {
                            if (e.target === modal) {
                                modal.classList.add('hidden');
                            }
                        });
                    });
                }

                postsListEl.appendChild(div);
                
                checkOverflow();
            });
        } catch (error) {
            postsListEl.innerHTML = 'Failed to load posts.';
            console.error(error);
        }
    }

    createPostForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const content = document.getElementById('postContent').value;
        
        if (!Validators.isNotEmpty(content)) return;

        try {
            await ApiService.createPost(content);
            document.getElementById('postContent').value = '';
            
            if (selectedUserId === user.id) {
                loadPosts(user.id);
            } else {
                
                 selectedUserId = user.id;
                 postsTitleEl.textContent = 'My Posts';
                 document.getElementById('createPostContainer').style.display = 'block';
                 loadPosts(user.id);
                 
                 loadUsers();
            }
        } catch (error) {
            alert(error.message);
        }
    });

    await loadUsers();
    await loadPosts(selectedUserId);
});
