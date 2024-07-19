function toggleEditForm(postId) {
    const postContent = document.getElementById(`post-content-${postId}`);
    const editForm = document.getElementById(`edit-form-${postId}`);
    
    if (postContent.style.display === 'none') {
        postContent.style.display = 'block';
        editForm.style.display = 'none';
    } else {
        postContent.style.display = 'none';
        editForm.style.display = 'block';
    }
}

document.querySelectorAll(".edit").forEach(button =>{
    button.addEventListener('click', (e) => {
        toggleEditForm(e.target.dataset.id);
    }) 
});

document.querySelectorAll(".cancel-change").forEach(button => {
    button.addEventListener('click', (e) => {
        toggleEditForm(e.target.dataset.id);
    })
});

document.querySelectorAll(".form-edit").forEach(button => {
    button.addEventListener('submit', async (e) =>{
          toggleEditForm(e.target.dataset.id);
    })
})