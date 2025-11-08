import { useState } from 'react';
import { FaQuestionCircle } from 'react-icons/fa';
import './styles.css';

export default function AiDisclaimer() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <button 
                className="ai-disclaimer-open-button" 
                onClick={() => setIsOpen(true)}
                aria-label="Open AI Disclaimer"
            >
                <FaQuestionCircle />
            </button>
            {isOpen && (
                <div className="ai-disclaimer-modal" onClick={() => setIsOpen(false)}>
                    <div className="ai-disclaimer-content" onClick={(e) => e.stopPropagation()}>
                        <button 
                            className="ai-disclaimer-close-x" 
                            onClick={() => setIsOpen(false)}
                            aria-label="Close"
                        >
                            ×
                        </button>
                        <h2>About This Tool</h2>
                        <div className="ai-disclaimer-text">
                            <p>
                                This is an algorithm trained to detect the realness of webpages through text analysis. 
                                You can input any content and it will return a result.
                            </p>
                            <p>
                                Due to the limitations of algorithms and mathematics, <strong>results are not guaranteed 
                                to be correct</strong> and you should never take what this says at face value.
                            </p>
                            <p className="ai-disclaimer-emphasis">
                                Instead, take some time to think about what the actual meaning of text and words are, 
                                and consider how this model was trained.
                            </p>
                        </div>
                        <button className="ai-disclaimer-close-button" onClick={() => setIsOpen(false)}>
                            Got It
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}