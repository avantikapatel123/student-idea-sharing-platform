import React, { useEffect } from 'react';
import { useIdeas } from '../context/IdeaContext';

export default function Toast() {
    const { toast, hideToast } = useIdeas();
    
    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => hideToast(), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast.show, hideToast]);

    if (!toast.show) return null;

    return (
        <div className="toast-container">
            <div className="toast" style={{ display: 'block' }}>
                {toast.message}
            </div>
        </div>
    );
}