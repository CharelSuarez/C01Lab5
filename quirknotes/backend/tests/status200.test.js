const SERVER_URL = "http://localhost:4000";

test("1+2=3, empty array is empty", () => {
    expect(1 + 2).toBe(3);
    expect([].length).toBe(0);
});

beforeEach(async () => {
    // Delete all notes before each test
    let response = await fetch(`${SERVER_URL}/deleteAllNotes`, {
        method: "DELETE"
    });
    let body = await response.json();
    expect(response.status).toBe(200);
});

test("/postNote - Post a note", async () => {
    const response = await fetch(`${SERVER_URL}/postNote`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title: "Note title?",
            content: "Consequat proident anim qui reprehenderit commodo magna occaecat adipisicing laborum esse irure.",
        }),
    });

    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.response).toBe("Note added succesfully.");
});

test("/getAllNotes - Return list of zero notes for getAllNotes", async () => {
    // Get all notes
    response = await fetch(`${SERVER_URL}/getAllNotes`, {
        method: "GET"
    });
    body = await response.json();
    expect(response.status).toBe(200);
    expect(body.response).toEqual([]);
});

test("/getAllNotes - Return list of two notes for getAllNotes", async () => {
    // Add Note 1
    const note1 = {
        title: "Note 1!",
        content: "Ea exercitation voluptate laboris id nostrud ad Lorem.",
    }
    let response = await fetch(`${SERVER_URL}/postNote`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(note1),
    });
    let body = await response.json();
    expect(response.status).toBe(200);
    expect(body.response).toBe("Note added succesfully.");

    // Add Note 2
    const note2 = {
        title: "Note 2!",
        content: "Nisi Lorem do culpa non dolore nulla cillum excepteur est adipisicing dolore non.",
    }
    response = await fetch(`${SERVER_URL}/postNote`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(note2),
    });
    body = await response.json();
    expect(response.status).toBe(200);
    expect(body.response).toBe("Note added succesfully.");

    // Get Notes
    response = await fetch(`${SERVER_URL}/getAllNotes`, {
        method: "GET"
    });
    body = await response.json();

    expect(response.status).toBe(200);
    expect(body.response.length).toBe(2);
});

test("/deleteNote - Delete a note", async () => {
    // Add a note
    const note = {
        title: "Wow, a Note!",
        content: "Ea velit aute deserunt occaecat excepteur labore dolor aliqua.",
    }
    let response = await fetch(`${SERVER_URL}/postNote`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(note),
    });
    let body = await response.json();
    expect(response.status).toBe(200);
    expect(body.response).toBe("Note added succesfully.");
    const noteId = body.insertedId;

    // Delete the note
    response = await fetch(`${SERVER_URL}/deleteNote/${noteId}`, {
        method: "DELETE"
    });
    body = await response.json();
    expect(response.status).toBe(200);
    expect(body.response).toBe(`Document with ID ${noteId} deleted.`);
});

test("/patchNote - Patch with content and title", async () => {
    // Add a note
    const note = {
        title: "Another, note! Who could believe it?",
        content: "Sint pariatur tempor minim officia do reprehenderit Lorem minim non.",
    }
    let response = await fetch(`${SERVER_URL}/postNote`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(note),
    });
    let body = await response.json();
    expect(response.status).toBe(200);
    expect(body.response).toBe("Note added succesfully.");
    const noteId = body.insertedId;

    // Patch the note
    const newTitle = "A new title of all time...";
    const newContent = "Culpa aliquip proident Lorem magna adipisicing.";
    response = await fetch(`${SERVER_URL}/patchNote/${noteId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title: newTitle,
            content: newContent,
        }),
    });
    body = await response.json();
    expect(response.status).toBe(200);
    expect(body.response).toBe(`Document with ID ${noteId} patched.`);
});

test("/patchNote - Patch with just title", async () => {
    // Add a note
    const note = {
        title: "I'm only patching the title of this note.",
        content: "Ex officia exercitation sit aliqua quis laborum sunt et do.",
    }
    let response = await fetch(`${SERVER_URL}/postNote`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(note),
    });
    let body = await response.json();
    expect(response.status).toBe(200);
    expect(body.response).toBe("Note added succesfully.");
    const noteId = body.insertedId;

    // Patch the note's title
    const newTitle = "Titles, titles, titles...";
    response = await fetch(`${SERVER_URL}/patchNote/${noteId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title: newTitle
        }),
    });
    body = await response.json();
    expect(response.status).toBe(200);
    expect(body.response).toBe(`Document with ID ${noteId} patched.`);
});

test("/patchNote - Patch with just content", async () => {
    // Add a note
    const note = {
        title: "I'm only patching just the content of this note.",
        content: "Nulla ullamco minim officia commodo eu ipsum aliquip id.",
    }
    let response = await fetch(`${SERVER_URL}/postNote`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(note),
    });
    let body = await response.json();
    expect(response.status).toBe(200);
    expect(body.response).toBe("Note added succesfully.");
    const noteId = body.insertedId;

    // Patch the note's content
    const newContent = "Ad adipisicing est minim fugiat ut non ullamco ut duis.";
    response = await fetch(`${SERVER_URL}/patchNote/${noteId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            content: newContent
        }),
    });
    body = await response.json();
    expect(response.status).toBe(200);
    expect(body.response).toBe(`Document with ID ${noteId} patched.`);
});

test("/deleteAllNotes - Delete one note", async () => {
    // Add a note
    const note = {
        title: "I'm going to delete this note!",
        content: "Minim eiusmod aute cillum mollit adipisicing consectetur eiusmod culpa sunt quis.",
    }
    let response = await fetch(`${SERVER_URL}/postNote`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(note),
    });
    let body = await response.json();
    expect(response.status).toBe(200);
    expect(body.response).toBe("Note added succesfully.");

    // Delete all notes
    response = await fetch(`${SERVER_URL}/deleteAllNotes`, {
        method: "DELETE"
    });
    body = await response.json();
    expect(response.status).toBe(200);
    expect(body.response).toBe("1 note(s) deleted.");
});

test("/deleteAllNotes - Delete three notes", async () => {
    // Add three nodes
    for (let i = 0; i < 3; i++) {
        const note = {
            title: `Thing ${i}!`,
            content: "Velit voluptate ullamco fugiat eiusmod occaecat magna enim amet dolore.",
        }
        let response = await fetch(`${SERVER_URL}/postNote`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(note),
        });
        let body = await response.json();
        expect(response.status).toBe(200);
        expect(body.response).toBe("Note added succesfully.");
    }

    // Delete all notes
    response = await fetch(`${SERVER_URL}/deleteAllNotes`, {
        method: "DELETE"
    });
    body = await response.json();
    expect(response.status).toBe(200);
    expect(body.response).toBe("3 note(s) deleted.");
});

test("/updateNoteColor - Update color of a note to red (#FF0000)", async () => {
    // Add a note
    const note = {
        title: "I need a change of color!",
        content: "Nostrud eiusmod duis excepteur eiusmod deserunt aliquip qui excepteur eu.",
    }
    let response = await fetch(`${SERVER_URL}/postNote`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(note),
    });
    let body = await response.json();
    expect(response.status).toBe(200);
    expect(body.response).toBe("Note added succesfully.");
    const noteId = body.insertedId;

    // Change the note's color
    response = await fetch(`${SERVER_URL}/updateNoteColor/${noteId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            color: "#FF0000"
        }),
    });
    body = await response.json();
    expect(response.status).toBe(200);
    expect(body.response).toBe("Note color updated successfully.");
});