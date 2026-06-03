

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIdeas } from '../context/IdeaContext';

export default function IdeaForm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { ideas, addIdea, updateIdea, showToast } = useIdeas();

    const isEditMode = Boolean(id);
    const currentIdea = ideas.find((idea) => idea.id === id);

    const [form, setForm] = useState({
        title: '',
        description: '',
        tags: '',
        category: ''
    });

    const [errors, setErrors] = useState({
        title: '',
        description: ''
    });

    useEffect(() => {
        if (isEditMode && currentIdea) {
            setForm({
                title: currentIdea.title,
                description: currentIdea.description,
                tags: currentIdea.tags.join(', '),
                category: currentIdea.category
            });
        }
    }, [id, isEditMode, currentIdea]);

    if (isEditMode && !currentIdea) {
        return (
            <div style={{ textAlign: 'center', margin: '50px' }}>
                <h2>404: Idea Not Found 🚫</h2>
                <p>The idea ID you are trying to edit does not exist.</p>

                <button
                    onClick={() => navigate('/dashboard')}
                    className="add-idea-btn"
                    style={{ marginTop: '20px' }}
                >
                    Back to Feed
                </button>
            </div>
        );
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        let hasError = false;

        const newErrors = {
            title: '',
            description: ''
        };

        // Validation
        if (!form.title.trim()) {
            newErrors.title = 'Idea title cannot be empty!';
            hasError = true;
        }

        if (!form.description.trim()) {
            newErrors.description =
                'Idea description cannot be empty!';
            hasError = true;
        }

        if (hasError) {
            setErrors(newErrors);
            return;
        }

        const parsedTags = form.tags
            .split(',')
            .map((t) => t.trim())
            .filter((t) => t !== '');

        const ideaData = {
            title: form.title.trim(),
            description: form.description.trim(),
            tags: parsedTags,
            category: form.category || 'General'
        };

        // Edit Mode
        if (isEditMode) {
            const isChanged =
                currentIdea.title !== ideaData.title ||
                currentIdea.description !== ideaData.description ||
                currentIdea.category !== ideaData.category ||
                currentIdea.tags.join(',') !== ideaData.tags.join(',');

            // No changes
            if (!isChanged) {
                showToast('No changes made 😐');
                return;
            }

            updateIdea(id, ideaData);
        } else {
            addIdea(ideaData);
        }

        navigate('/dashboard');
    };

    return (
        <section className="idea-form-section">
            <div className="form-card">
                <h2>
                    {isEditMode
                        ? 'Edit Idea 📝'
                        : 'Add New Idea 🚀'}
                </h2>

                <form id="idea-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Title</label>

                        <input
                            type="text"
                            value={form.title}
                            onChange={(e) => {
                                setForm({
                                    ...form,
                                    title: e.target.value
                                });

                                setErrors({
                                    ...errors,
                                    title: ''
                                });
                            }}
                            placeholder="Enter your idea title"
                        />

                        <small className="error-messages">
                            {errors.title}
                        </small>
                    </div>

                    <div className="form-group">
                        <label>Description</label>

                        <textarea
                            value={form.description}
                            onChange={(e) => {
                                setForm({
                                    ...form,
                                    description: e.target.value
                                });

                                setErrors({
                                    ...errors,
                                    description: ''
                                });
                            }}
                            placeholder="Describe your idea"
                        ></textarea>

                        <small className="error-messages">
                            {errors.description}
                        </small>
                    </div>

                    <div className="form-group">
                        <label>Tags (Comma separated)</label>

                        <input
                            type="text"
                            value={form.tags}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    tags: e.target.value
                                })
                            }
                            placeholder="Add tags separated by commas"
                        />
                    </div>

                    <div className="form-group">
                        <label>Category</label>

                        <select
                            value={form.category}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    category: e.target.value
                                })
                            }
                        >
                            <option value="">
                                Select Category
                            </option>

                            <option value="Technology">
                                Technology
                            </option>

                            <option value="Education">
                                Education
                            </option>

                            <option value="Startup">
                                Startup
                            </option>

                            <option value="Business">
                                Business
                            </option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="submit-btn"
                    >
                        {isEditMode
                            ? 'Update Your Idea'
                            : 'Submit Your Idea'}
                    </button>
                </form>
            </div>
        </section>
    );
}

