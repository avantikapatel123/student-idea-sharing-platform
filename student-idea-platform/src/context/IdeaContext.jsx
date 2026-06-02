import React, {
    createContext,
    useContext,
    useState,
    useCallback
} from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const IdeaContext = createContext();

export function IdeaProvider({ children }) {
    const [ideas, setIdeas] = useLocalStorage('ideas', []);
    const [toast, setToast] = useState({
        show: false,
        message: ''
    });
    const [loading, setLoading] = useState(true);

    // Show Toast
    const showToast = useCallback((message) => {
        setToast({
            show: true,
            message
        });
    }, []);

    // Hide Toast
    const hideToast = useCallback(() => {
        setToast({
            show: false,
            message: ''
        });
    }, []);

    // Add Idea
    const addIdea = useCallback((newIdea) => {
        setIdeas((prev) => [
            {
                ...newIdea,
                id: Date.now().toString(),
                likes: 0,
                liked: false,
                comments: [],
                author: 'Student Innovator',
                timestamp: new Date().toLocaleString()
            },
            ...prev
        ]);

        showToast('Idea added successfully 🚀');
    }, [setIdeas, showToast]);

    // Update Idea
    const updateIdea = useCallback((id, updatedFields) => {
        setIdeas((prev) =>
            prev.map((idea) =>
                idea.id === id
                    ? { ...idea, ...updatedFields }
                    : idea
            )
        );

        showToast('Idea updated successfully 📝');
    }, [setIdeas, showToast]);

    // Delete Idea
    const deleteIdea = useCallback((id) => {
        setIdeas((prev) =>
            prev.filter((idea) => idea.id !== id)
        );

        showToast('Idea deleted successfully 🗑️');
    }, [setIdeas, showToast]);

    // Toggle Like / Unlike
    const toggleLike = useCallback((id) => {
        setIdeas((prev) =>
            prev.map((idea) => {
                if (idea.id === id) {
                    const updatedIdea = {
                        ...idea,
                        liked: !idea.liked,
                        likes: idea.liked
                            ? idea.likes - 1
                            : idea.likes + 1
                    };

                    showToast(
                        idea.liked
                            ? 'Idea unliked 🤍'
                            : 'Idea liked ❤️'
                    );

                    return updatedIdea;
                }

                return idea;
            })
        );
    }, [setIdeas, showToast]);

    // Add Comment
    const addComment = useCallback((id, commentText) => {
        setIdeas((prev) =>
            prev.map((idea) =>
                idea.id === id
                    ? {
                          ...idea,
                          comments: [
                              ...idea.comments,
                              commentText
                          ]
                      }
                    : idea
            )
        );
    }, [setIdeas]);

    return (
        <IdeaContext.Provider
            value={{
                ideas,
                addIdea,
                updateIdea,
                deleteIdea,
                toggleLike,
                addComment,
                toast,
                showToast,
                hideToast,
                loading,
                setLoading
            }}
        >
            {children}
        </IdeaContext.Provider>
    );
}

export const useIdeas = () => useContext(IdeaContext);