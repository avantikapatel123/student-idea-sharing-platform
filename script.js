// ==========================
// SELECT ELEMENTS
// ==========================
const ideaForm = document.getElementById("idea-form");
const titleInput = document.getElementById("idea-title");
const descriptionInput = document.getElementById("description");
const tagsInput = document.getElementById("tags");
const categoryInput = document.getElementById("category");

const feedContainer = document.getElementById("feed-container");
const emptyState = document.getElementById("empty-state");

const toast = document.getElementById("toast");
const loaderContainer = document.getElementById("loader-container");

// Navbar / Scroll hooks
const addIdeaBtn = document.getElementById("add-idea-btn");
const getStartedBtn = document.getElementById("get-started-btn");
const homeLink = document.getElementById("home-link");
const exploreLink = document.getElementById("explore-link");
const formHeading = document.querySelector(".form-card h2");
const submitBtn = document.querySelector(".submit-btn");

// ==========================
// VARIABLES & STATE
// ==========================
let ideas = JSON.parse(localStorage.getItem("ideas")) || [];
let editIdeaId = null;

// ==========================
// LOADER ANIMATION (300-500ms delay)
// ==========================
window.addEventListener("load", () => {
    setTimeout(() => {
        loaderContainer.style.opacity = "0";
        setTimeout(() => {
            loaderContainer.style.display = "none";
        }, 300);
        renderIdeas();
    }, 450);
});

// ==========================
// TOAST NOTIFICATIONS (Auto Dismiss)
// ==========================
function showToast(message) {
    toast.textContent = message;
    toast.style.display = "block";

    setTimeout(() => {
        toast.style.display = "none";
    }, 3000);
}

// ==========================
// LOCAL STORAGE MANAGEMENT
// ==========================
function saveToLocalStorage() {
    localStorage.setItem("ideas", JSON.stringify(ideas));
}

// ==========================
// FORM VALIDATION & INLINE ERROR CLEANING
// ==========================
function clearErrors() {
    document.querySelectorAll(".error-messages").forEach(el => el.textContent = "");
}

// ==========================
// FORM SUBMIT ACTION
// ==========================
ideaForm.addEventListener("submit", function (e) {
    e.preventDefault();
    clearErrors();

    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    const tags = tagsInput.value
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag !== "");
    const category = categoryInput.value || "General";

    let hasError = false;

    // Strict Non-empty Validation & Inline Error Render
    if (title === "") {
        titleInput.nextElementSibling.textContent = "Idea title cannot be empty!";
        hasError = true;
    }
    if (description === "") {
        descriptionInput.nextElementSibling.textContent = "Idea description cannot be empty!";
        hasError = true;
    }

    if (hasError) return;

    // EDIT MODE
    if (editIdeaId) {
        ideas = ideas.map((idea) => {
            if (idea.id === editIdeaId) {
                return { ...idea, title, description, tags, category };
            }
            return idea;
        });
        editIdeaId = null;
        formHeading.textContent = "Add new Idea 🚀";
        submitBtn.textContent = "Submit your idea";
        showToast("Idea updated successfully 🚀");
    } 
    // ADD MODE
    else {
        const newIdea = {
            id: Date.now(), // Unique ID generation
            title,
            description,
            tags,
            category,
            likes: 0,
            liked: false, // Prevents session double liking
            comments: [],
            author: "Student Innovator",
            timestamp: new Date().toLocaleString()
        };
        ideas.unshift(newIdea); // Add on top of the feed array
        showToast("Idea added successfully 🚀");
    }

    saveToLocalStorage();
    renderIdeas();
    ideaForm.reset();
    document.getElementById("dashboard").scrollIntoView({ behavior: "smooth" });
});

// ==========================
// PURE DOM RENDERING (No innerHTML)
// ==========================
function renderIdeas() {
    feedContainer.textContent = ""; // Clear existing elements safely

    if (ideas.length === 0) {
        emptyState.style.display = "block";
        return;
    }
    emptyState.style.display = "none";

    ideas.forEach((idea) => {
        // Main Card element
        const card = document.createElement("article");
        card.classList.add("idea-card");
        card.dataset.id = idea.id;

        // Top Row Category Badge
        const topRow = document.createElement("div");
        topRow.classList.add("card-top-row");
        const categoryBadge = document.createElement("span");
        categoryBadge.classList.add("category-badge");
        categoryBadge.textContent = idea.category;
        topRow.appendChild(categoryBadge);
        card.appendChild(topRow);

        // Title Element
        const title = document.createElement("h3");
        title.textContent = idea.title;
        card.appendChild(title);

        // Description Element
        const desc = document.createElement("p");
        desc.textContent = idea.description;
        card.appendChild(desc);

        // Tags Group
        const tagsContainer = document.createElement("div");
        tagsContainer.classList.add("tags-container");
        idea.tags.forEach((tag) => {
            const tagElement = document.createElement("span");
            tagElement.classList.add("tag");
            tagElement.textContent = `#${tag}`;
            tagsContainer.appendChild(tagElement);
        });
        card.appendChild(tagsContainer);

        // Meta Info Block
        const info = document.createElement("div");
        info.classList.add("idea-info");
        info.textContent = `${idea.author} • ${idea.timestamp}`;
        card.appendChild(info);

        // Action Trigger Row
        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("card-buttons");

        const likeBtn = document.createElement("button");
        likeBtn.classList.add("like-btn");
        likeBtn.textContent = `Like (${idea.likes}) ${idea.liked ? '❤️' : '🤍'}`;

        const commentBtn = document.createElement("button");
        commentBtn.classList.add("comment-btn");
        commentBtn.textContent = `Comments (${idea.comments.length})`;

        const editBtn = document.createElement("button");
        editBtn.classList.add("edit-btn");
        editBtn.textContent = "Edit 💛";

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");
        deleteBtn.textContent = "Delete ❤️";

        buttonContainer.appendChild(likeBtn);
        buttonContainer.appendChild(commentBtn);
        buttonContainer.appendChild(editBtn);
        buttonContainer.appendChild(deleteBtn);
        card.appendChild(buttonContainer);

        // Dynamic Embedded Comments Node Box
        const commentSection = document.createElement("div");
        commentSection.classList.add("comment-section");
        commentSection.style.display = "none"; // Closed by default

        const commentForm = document.createElement("form");
        commentForm.classList.add("comment-form");

        const commentInput = document.createElement("input");
        commentInput.type = "text";
        commentInput.placeholder = "Write a comment...";
        commentInput.required = true;

        const commentSubmitBtn = document.createElement("button");
        commentSubmitBtn.type = "submit";
        commentSubmitBtn.textContent = "Post";

        commentForm.appendChild(commentInput);
        commentForm.appendChild(commentSubmitBtn);
        commentSection.appendChild(commentForm);

        const commentsList = document.createElement("div");
        commentsList.classList.add("comments-list");
        idea.comments.forEach(commentText => {
            const commentItem = document.createElement("div");
            commentItem.classList.add("comment-item");
            commentItem.textContent = commentText;
            commentsList.appendChild(commentItem);
        });
        commentSection.appendChild(commentsList);
        card.appendChild(commentSection);

        feedContainer.appendChild(card);
    });
}

// ==========================
// EVENT DELEGATION (Single Listener)
// ==========================
feedContainer.addEventListener("click", function (e) {
    const target = e.target;
    const card = target.closest(".idea-card");
    if (!card) return;

    const ideaId = parseInt(card.dataset.id);
    const ideaIndex = ideas.findIndex(i => i.id === ideaId);
    if (ideaIndex === -1) return;

    // 1. LIKE TOGGLE (Session Multi-Click Protection)
    if (target.classList.contains("like-btn")) {
        if (!ideas[ideaIndex].liked) {
            ideas[ideaIndex].likes += 1;
            ideas[ideaIndex].liked = true;
            saveToLocalStorage();
            renderIdeas();
        } else {
            showToast("You've already liked this idea in this session! ❤️");
        }
    }

    // 2. DELETE ACTION
    else if (target.classList.contains("delete-btn")) {
        ideas.splice(ideaIndex, 1);
        showToast("Idea deleted successfully 🗑️");
        saveToLocalStorage();
        renderIdeas();
    }

    // 3. EDIT ACTION (Pre-populates Form & Form Re-use)
    else if (target.classList.contains("edit-btn")) {
        const idea = ideas[ideaIndex];
        editIdeaId = idea.id;

        titleInput.value = idea.title;
        descriptionInput.value = idea.description;
        tagsInput.value = idea.tags.join(", ");
        categoryInput.value = idea.category;

        formHeading.textContent = "Edit Idea 📝";
        submitBtn.textContent = "Update your idea";
        clearErrors();

        document.querySelector(".idea-form-section").scrollIntoView({ behavior: "smooth" });
    }

    // 4. COMMENTS COLLAPSIBLE DRAWER TOGGLE
    else if (target.classList.contains("comment-btn")) {
        const commentSection = card.querySelector(".comment-section");
        const isHidden = commentSection.style.display === "none";
        commentSection.style.display = isHidden ? "block" : "none";
    }
});

// Dynamic Comment Form Submission handling via Event Delegation
feedContainer.addEventListener("submit", function(e) {
    if (e.target.classList.contains("comment-form")) {
        e.preventDefault();
        const form = e.target;
        const input = form.querySelector("input");
        const commentText = input.value.trim();
        
        if (commentText === "") return;

        const card = form.closest(".idea-card");
        const ideaId = parseInt(card.dataset.id);
        const ideaIndex = ideas.findIndex(i => i.id === ideaId);

        ideas[ideaIndex].comments.push(commentText);
        saveToLocalStorage();
        renderIdeas(); // Dynamic Re-render without refreshing page
    }
});

// ==========================
// UX / UI LINKS INTERACTION
// ==========================
addIdeaBtn.addEventListener("click", () => {
    ideaForm.reset();
    editIdeaId = null;
    formHeading.textContent = "Add new Idea 🚀";
    submitBtn.textContent = "Submit your idea";
    clearErrors();
    document.querySelector(".idea-form-section").scrollIntoView({ behavior: "smooth" });
});

if (getStartedBtn) {
    getStartedBtn.addEventListener("click", () => {
        document.querySelector(".idea-form-section").scrollIntoView({ behavior: "smooth" });
    });
}

homeLink.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("hero").scrollIntoView({ behavior: "smooth" });
});

exploreLink.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("dashboard").scrollIntoView({ behavior: "smooth" });
});