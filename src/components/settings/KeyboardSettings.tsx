
import React from 'react';

const KeyboardSettings = () => {
    return (
        <div className="space-y-4">
            <div className="text-sm">
            <p className="mb-2"><strong>Keyboard shortcuts:</strong></p>
            <ul className="space-y-1">
                <li>→ / Space: Next slide</li>
                <li>←: Previous slide</li>
                <li>D: Toggle dark mode</li>
                <li>S: Toggle settings</li>
                <li>Esc: Exit presentation</li>
            </ul>
            </div>
        </div>
    );
};

export default KeyboardSettings;
