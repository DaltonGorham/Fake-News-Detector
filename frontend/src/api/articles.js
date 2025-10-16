// import apiClient from './client'; // Commented out until backend is ready

// Mock data with realistic-looking responses
const mockArticles = [
  {
    id: '1',
    url: 'https://example.com/article1',
    title: 'Example Article 1',
    analysis: {
      credibility_score: 0.85,
      classification: 'reliable',
      confidence: 0.92,
      analyzed_at: '2025-10-16T10:30:00Z'
    }
  },
  {
    id: '2',
    url: 'https://example.com/article2',
    title: 'Example Article 2',
    analysis: {
      credibility_score: 0.32,
      classification: 'unreliable',
      confidence: 0.88,
      analyzed_at: '2025-10-16T09:15:00Z'
    }
  }
];

export const articleApi = {
  // Submit article for analysis
  analyzeArticle: async (url) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      data: {
        id: Date.now().toString(),
        url,
        title: 'Mock Article Title',
        analysis: {
          credibility_score: Math.random(),
          classification: Math.random() > 0.5 ? 'reliable' : 'unreliable',
          confidence: 0.8 + (Math.random() * 0.2), // Random between 0.8 and 1.0
          analyzed_at: new Date().toISOString()
        }
      },
      error: null
    };
  },

  // Get analysis history
  getHistory: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: mockArticles,
      error: null
    };
  },

  // Get specific article analysis
  getAnalysis: async (articleId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const article = mockArticles.find(a => a.id === articleId);
    
    if (!article) {
      return {
        data: null,
        error: 'Article not found'
      };
    }
    
    return {
      data: article,
      error: null
    };
  },

  // Save article analysis result
  saveAnalysis: async (articleData) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      data: {
        url: articleData.url,
        title: articleData.title,
        analysis: articleData.analysis,
        id: Date.now().toString(),
        saved_at: new Date().toISOString()
      },
      error: null
    };
  }
};