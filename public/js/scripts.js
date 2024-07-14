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


document.querySelector('#myForm').addEventListener('submit', (e) =>{
    fetch('/submit-form', {
        method: 'POST',
        body: new FormData(document.getElementById('myForm'))
    })
    .then(data =>{
        console.log('Form submitted:', data);
        document.querySelector("#myForm").classList.add("hidden");
    })
    .catch(error => console.log('Error', error));
});

document.querySelector('#make-post').addEventListener("click", (e) => {
    console.log("button was pressed");
    e.preventDefault(); //prevents the form from resubmitting
    const form = document.querySelector("#myForm");
    form.classList.toggle("hidden");
});

document.querySelectorAll('.delete').forEach(button =>{
    button.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        fetch(`/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json',
            },
        })

        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Handle success or update UI as needed
            window.location.reload();
        })
        .catch(error => console.error('Error deleting:', error));
    });
});


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

document.querySelectorAll(".post > form").forEach(button => {
    button.addEventListener('submit', async (e) =>{
        e.preventDefault();
        const id = e.target.querySelector('.edit-submit').dataset.id;
        try{
            const response = await fetch (`/edit/${id}`, {
                method: 'PUT',
                body: new FormData(e.target)
            })
            if (!response.ok) {
                throw new Error('Network response was not ok');
              }

        } catch (error) {
            console.error('Fetch error:', error);
            res.status(500).send('Internal Server Error');
          }
          toggleEditForm(id);
    })
})