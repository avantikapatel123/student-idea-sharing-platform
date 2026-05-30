import React, { createContext, useContext, useState, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const IdeaContext = createContext();

export function IdeaProvider({ children }) {
    const [ideas, setIdeas] = useLocalStorage('ideas', []);
    const [toast, setToast] = useState({ show: false, message: '' });
    const [loading, setLoading] = useState(true);

    const showToast = useCallback((message) => {
        setToast({ show: true, message });
    }, []);

    const hideToast = useCallback(() => {
        setToast({ show: false, message: '' });
    }, []);

    const addIdea = useCallback((newIdea) => {
        setIdeas((prev) => [
            {
                ...newIdea,
                id: Date.now().toString(),
                likes: 0,
                liked: false,
                comments: [],
                author: "Student Innovator",
                timestamp: new Date().toLocaleString()
            },
            ...prev
        ]);
        showToast("Idea added successfully 🚀");
    }, [setIdeas, showToast]);

    const updateIdea = useCallback((id, updatedFields) => {
        setIdeas((prev) => prev.map(idea => idea.id === id ? { ...idea, ...updatedFields } : idea));
        showToast("Idea updated successfully 📝");
    }, [setIdeas, showToast]);

    const deleteIdea = useCallback((id) => {
        setIdeas((prev) => prev.filter(idea => idea.id !== id));
        showToast("Idea deleted successfully 🗑️");
    }, [setIdeas, showToast]);

    const toggleLike = useCallback((id) => {
        setIdeas((prev) => prev.map(idea => {
            if (idea.id === id) {
                if (!idea.liked) {
                    return { ...idea, likes: idea.likes + 1, liked: true };
                } else {
                    showToast("You've already liked this idea! ❤️");
                }
            }
            return idea;
        }));
    }, [setIdeas, showToast]);

    const addComment = useCallback((id, commentText) => {
        setIdeas((prev) => prev.map(idea => 
            idea.id === id ? { ...idea, comments: [...idea.comments, commentText] } : idea
        ));
    }, [setIdeas]);

    return (
        <IdeaContext.Provider value={{
            ideas, addIdea, updateIdea, deleteIdea, toggleLike, addComment,
            toast, showToast, hideToast, loading, setLoading
        }}>
            {children}
        </IdeaContext.Provider>
    );
}

export const useIdeas = () => useContext(IdeaContext);