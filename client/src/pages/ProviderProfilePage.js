import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import '../App.css';

// A sub-component for the Review Form
function ReviewForm({ providerId, onReviewSubmit }) {
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.trim() === '' || userName.trim() === '') {
      setError('Please fill out your name and a comment.');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    try {
      const newReview = { userName, rating: Number(rating), comment };
      const updatedProvider = await api.postReview(providerId, newReview);
      onReviewSubmit(updatedProvider); // Pass data up to parent
      setUserName(''); setRating(5); setComment(''); // Reset form
    } catch (err) {
      setError('Failed to submit review. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="profile-review-form">
      <h3 className="profile-section-title">Leave a Review</h3>
      {error && <p className="auth-error">{error}</p>}
      
      <div className="auth-input-group">
        <span className="auth-icon">👤</span>
        <input
          type="text" placeholder="Name" value={userName}
          onChange={(e) => setUserName(e.target.value)} required
        />
      </div>
      
      <div className="auth-input-group">
        <span className="auth-icon">⭐</span>
        <select value={rating} onChange={(e) => setRating(e.target.value)}>
          <option value="5">5 Stars (Excellent)</option>
          <option value="4">4 Stars (Good)</option>
          <option value="3">3 Stars (Average)</option>
          <option value="2">2 Stars (Poor)</option>
          <option value="1">1 Star (Terrible)</option>
        </select>
      </div>

      <div className="auth-input-group">
        <span className="auth-icon" style={{top: '13px'}}>💬</span>
        <textarea
          rows="4" placeholder="Your Review" value={comment}
          onChange={(e) => setComment(e.target.value)} required
        />
      </div>
      
      <button type="submit" className="btn btn-primary w-full auth-button" disabled={isSubmitting}>
        <span>➡️</span>
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}

// Helper component to render stars
function StarRating({ rating }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} 
        className={i <= rating ? 'star-filled' : 'star-empty'} 
      >
        ⭐
      </span>
    );
  }
  return <div className="star-rating">{stars}</div>;
}

// Main Page Component
function ProviderProfilePage() {
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchProvider = async () => {
      setLoading(true);
      try {
        const data = await api.getProviderById(id);
        setProvider(data);
      } catch (error) {
        console.error('Failed to fetch provider:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProvider();
  }, [id]);

  const handleReviewSubmit = (updatedProvider) => {
    setProvider(updatedProvider);
  };

  if (loading) return <div className="loading-spinner"></div>;
  if (!provider) return <div className="profile-section"><p>Provider not found.</p></div>;

  // Calculate average rating
  const avgRating = provider.reviews?.length
    ? (provider.reviews.reduce((acc, r) => acc + r.rating, 0) / provider.reviews.length)
    : 0;

  return (
    <div className="profile-page-container">
      
      {/* --- Profile Header Card --- */}
      <div className="profile-header-card">
        <div className="profile-header-image">
          <img 
            src={provider.profile.imageUrl || `https://placehold.co/180x180/007bff/white?text=${provider.name.charAt(0)}`} 
            alt={provider.name} 
          />
        </div>
        <div className="profile-header-info">
          <h1 className="profile-name">{provider.name}</h1>
          <p className="profile-service-category">{provider.serviceCategory}</p>
          
          <div className="profile-header-rating">
            <StarRating rating={avgRating} />
            <span>{avgRating.toFixed(1)}</span>
            <p>({provider.reviews.length} reviews)</p>
          </div>
          
          {provider.emergencyService && (
            <div className="profile-emergency-badge">
              <span>⚡</span>
              <span>24/7 Emergency Service</span>
            </div>
          )}
        </div>
      </div>

      {/* --- Main Content Grid --- */}
      <div className="profile-content-grid">
        
        {/* Left Column: Details & Reviews */}
        <div className="profile-left-column">
          
          {/* About Section */}
          <div className="profile-section">
            <h2 className="profile-section-title">About {provider.name}</h2>
            <p className="profile-description">
              {provider.profile.description || "No description provided."}
            </p>
          </div>

          {/* Contact Section */}
          <div className="profile-section">
            <h2 className="profile-section-title">Contact Information</h2>
            <div className="profile-contact-info">
              <p><span>📞</span> <span>{provider.profile.phone}</span></p>
              <p><span>✉️</span> <span>{provider.email}</span></p>
              <p><span>📍</span> <span>{provider.location}</span></p>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="profile-section">
            <h2 className="profile-section-title">Reviews</h2>
            <div className="profile-reviews-list">
              {provider.reviews.length > 0 ? (
                provider.reviews.map((review) => (
                  <div key={review._id || review.id} className="review-card">
                    <div className="review-card-header">
                      <div className="review-avatar">
                        <span>👤</span>
                      </div>
                      <div className="review-author-info">
                        <span className="review-author-name">{review.userName}</span>
                        <StarRating rating={review.rating} />
                      </div>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p>No reviews yet. Be the first to leave one!</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Right Column: Review Form */}
        <div className="profile-right-column">
          <ReviewForm 
            providerId={provider._id} 
            onReviewSubmit={handleReviewSubmit} 
          />
        </div>
        
      </div>
    </div>
  );
}

export default ProviderProfilePage;