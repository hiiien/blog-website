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


document.querySelector('#myForm').addEventListener('submit', async (e) =>{
    //try to get e.preventDefault
    try {
        let response = await fetch('/submit-form', {
            method: 'POST',
            body: new FormData(document.getElementById('myForm'))
        })

        if (response.ok) {
            console.log('Form submitted successfully:', await response.json());
            document.querySelector("#myForm").reset();
        } else {
            console.log('Form submission failed:', response.status, await response.text());
        }
        reload();
    } catch (error) {
        console.log(`ERROR: ${error}`);
    }
});


document.querySelectorAll('.delete').forEach(button => {
    button.addEventListener('click', async (e) => {
        e.preventDefault();
        const id = e.target.dataset.id;
        try {
            let response = await fetch(`/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'content-type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

        } catch (error) {
            console.log('Error deleting:', error);
        }
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