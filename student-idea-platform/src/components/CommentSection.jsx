import React, { useState, useRef, useEffect } from 'react';
import { useIdeas } from '../context/IdeaContext';

export default function CommentSection({ ideaId, comments }) {
    const [commentText, setCommentText] = useState('');
    const { addComment } = useIdeas();
    const inputRef = useRef(null);

   
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        
        addComment(ideaId, commentText.trim());
        setCommentText(''); 
    };

    return (
        <div className="comment-section">
            <form className="comment-form" onSubmit={handleSubmit}>
                <input 
                    ref={inputRef}
                    type="text" 
                    placeholder="Write a comment..." 
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    required
                />
                <button type="submit">Post</button>
            </form>
            <div className="comments-list">
                {comments.map((comment, index) => (
                    <div key={index} className="comment-item">{comment}</div>
                ))}
            </div>
        </div>
    );
}