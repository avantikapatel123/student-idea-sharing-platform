import React, { useMemo } from 'react';
import { useIdeas } from '../context/IdeaContext';
import IdeaCard from '../components/IdeaCard';

export default function Dashboard() {
    const { ideas } = useIdeas();

    const sortedIdeas = useMemo(() => {
        return [...ideas].sort((a, b) => b.id - a.id);
    }, [ideas]);

    return (
        <section className="dashboard" id="dashboard">
            <h2>Idea Feed 💡</h2>
            {sortedIdeas.length === 0 ? (
                <div className="empty-state" id="empty-state" style={{ display: 'block' }}>
                    <p>No ideas yet. Be the first one to add! 🚀</p>
                </div>
            ) : (
                <div className="feed-container">
                    {sortedIdeas.map(idea => (
                        <IdeaCard key={idea.id} idea={idea} />
                    ))}
                </div>
            )}
        </section>
    );
}