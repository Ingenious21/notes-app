// Function to get the text from the textarea
function getText() {
    let text = document.getElementById('note-input').value;
    return text;
}

// Function to create a note object
function createNote() {
    let title = document.getElementById('note-title').value;
    let text = document.getElementById('note-input').value;

    // Check if title and text are not empty
    if (title.trim() === '' || text.trim() === '') {
        alert('Please enter both title and note text.');
        return null; // Return null if either title or text is empty
    }

    let date = new Date().toLocaleString();
    let note = {
        title: title,
        text: text,
        date: date
    };
    return note;
}

// Event listener for the save button
document.getElementById('note-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Check if both title and text are not empty before proceeding
    let note = createNote();
    if (note) {
        saveNote();
        displayNotes();
        document.getElementById('note-form').reset();
        window.location.href = 'index.html';  // Redirect to home screen
    }
});

// Function to save the note to local storage
function saveNote() {
    let note = createNote();
    let notes = localStorage.getItem('notes');
    if (notes) {
        notes = JSON.parse(notes);
    } else {
        notes = [];
    }
    notes.push(note);
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Function to update the note in local storage
function updateNote(index, updatedNote) {
    let notes = localStorage.getItem('notes');
    if (notes) {
        notes = JSON.parse(notes);
        notes[index] = updatedNote;
        localStorage.setItem('notes', JSON.stringify(notes));
    }
    displayNotes();
}

// Function to display the notes
function displayNotes() {
    let notes = localStorage.getItem('notes');
    if (notes) {
        notes = JSON.parse(notes);
        let displayHTML = '';
        for (let i = 0; i < notes.length; i++) {
            let note = notes[i];
            displayHTML += `<div class="note-card col-md-3 col-sm-2 bg-light ml-5 mr-5 mt-3 mb-3" 
            style="border-radius: 5px; height: 400px; box-sizing: border-box; overflow-y: scroll">
                <div class="card-body" style="height: 200px; max-height:200px; overflow-y: scroll; box-sizing: border-box">
                    <h2 style="font-weight: bolder">${note.title}</h2>
                    <h6>${note.date}</h6>
                    <p>${note.text}</p>
                </div>
                <div class="card-footer d-flex flex-column justify-content-center">
                    <button class="btn btn-info view-btn mb-2" data-note-index="${i}" data-toggle="modal" data-target="#viewModal">View</button>
                    <button class="btn btn-primary edit-btn mb-2" data-note-index="${i}" data-toggle="modal" data-target="#editModal">Edit</button>
                    <button class="btn btn-danger delete-btn mb-2" data-note-index="${i}">Delete</button>
                </div>
            </div>`;
        }
        document.getElementById('notes-display').innerHTML = displayHTML;
    }
}

// Function to delete a note
function deleteNote(index) {
    let notes = localStorage.getItem('notes');
    if (notes) {
        notes = JSON.parse(notes);
        notes.splice(index, 1);
        localStorage.setItem('notes', JSON.stringify(notes));
    }
    displayNotes();
}

// Function to view a note
function viewNoteModal(index) {
    let notes = localStorage.getItem('notes');
    if (notes) {
        notes = JSON.parse(notes);
        let note = notes[index];
        document.getElementById('view-note-title').textContent = note.title;
        document.getElementById('view-note-date').textContent = note.date;
        document.getElementById('view-note-text').textContent = note.text;
            $('#viewModal').modal('hide');
        };
    }


// Function to edit a note
function editNoteModal(index) {
    let notes = localStorage.getItem('notes');
    if (notes) {
        notes = JSON.parse(notes);
        let note = notes[index];
        document.getElementById('edit-note-title').value = note.title;
        document.getElementById('edit-note-input').value = note.text;

        // Add an event listener to the save changes button
        let editForm = document.getElementById('edit-note-form');
        let newEditForm = editForm.cloneNode(true);
        editForm.parentNode.replaceChild(newEditForm, editForm);

        newEditForm.addEventListener('submit', function(event) {
            event.preventDefault();
            let updatedNote = {
                title: document.getElementById('edit-note-title').value,
                text: document.getElementById('edit-note-input').value,
                date: note.date
            };
            updateNote(index, updatedNote);
            $('#editModal').modal('hide');
        });
    }
}

// Event listener for the delete, edit, and view buttons
document.body.addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-btn')) {
        let index = event.target.getAttribute('data-note-index');
        deleteNote(index);
    } else if (event.target.classList.contains('edit-btn')) {
        let index = event.target.getAttribute('data-note-index');
        editNoteModal(index);
    } else if (event.target.classList.contains('view-btn')) {
        let index = event.target.getAttribute('data-note-index');
        viewNoteModal(index);
    }
});

// Initial display of notes
displayNotes();

document.getElementById('currentYear').textContent = new Date().getFullYear();
