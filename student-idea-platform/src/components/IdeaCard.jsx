import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIdeas } from '../context/IdeaContext';
import CommentSection from './CommentSection';

export default function IdeaCard({ idea }) {
    const { toggleLike, deleteIdea } = useIdeas();
    const [showComments, setShowComments] = useState(false);
    const navigate = useNavigate();

    return (
        <article className="idea-card">
            <div className="card-top-row">
                <span className="category-badge">{idea.category}</span>
            </div>
            <h3>{idea.title}</h3>
            <p>{idea.description}</p>
            <div className="tags-container">
                {idea.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                ))}
            </div>
            <div className="idea-info">
                {idea.author} • {idea.timestamp}
            </div>
            <div className="card-buttons">
                <button className="like-btn" onClick={() => toggleLike(idea.id)}>
                    Like ({idea.likes}) {idea.liked ? '❤️' : '🤍'}
                </button>
                <button className="comment-btn" onClick={() => setShowComments(!showComments)}>
                    Comments ({idea.comments.length})
                </button>
                <button className="edit-btn" onClick={() => navigate(`/idea/${idea.id}/edit`)}>
                    Edit 💛
                </button>
                <button className="delete-btn" onClick={() => deleteIdea(idea.id)}>
                    Delete ❤️
                </button>
            </div>

            {showComments && <CommentSection ideaId={idea.id} comments={idea.comments} />}
        </article>
    );
}



