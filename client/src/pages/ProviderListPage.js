import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api'; 
import '../App.css'; 

function ProviderListPage() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');

  useEffect(() => {
    const fetchProviders = async () => {
      setLoading(true);
      try {
        const data = await api.getProviders(category); 
        setProviders(data);
      } catch (error) {
        console.error('Failed to fetch providers:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProviders();
  }, [category]); // Re-fetch if the category changes

  const title = category ? `${category}s` : 'All Providers';

  if (loading) {
    // The "loading-spinner" class was not defined, so it is removed.
    return <div>Loading...</div>;
  }

  return (
    
    <div className="profile-section" style={{ maxWidth: '100%', margin: 0 }}>
      <h2 className="profile-section-title" style={{ textAlign: 'center' }}>{title}</h2>
      
      {providers.length > 0 ? (
        
        <div>
          {providers.map((provider) => (
            <ProviderCard key={provider._id} provider={provider} />
          ))}
        </div>
      ) : (
        <p style={{ textAlign: 'center' }}>No providers found for this category.</p>
      )}
    </div>
  );
}

// Sub-component for displaying a single provider card
function ProviderCard({ provider }) {
  // Calculate average rating
  const avgRating = provider.reviews?.length
    ? (provider.reviews.reduce((acc, r) => acc + r.rating, 0) / provider.reviews.length)
    : 0;

  return (
    
    <div>
      <img 
        src={provider.profile.imageUrl || `https://placehold.co/400x220/007bff/white?text=${provider.name}`}
        alt={provider.name}
        
      />
     
      <div>
        
        <div>
          
          <h3>{provider.name}</h3>
          {provider.emergencyService && (
            
            <span>⚡ 24/7</span>
          )}
        </div>
        
        <p>{provider.serviceCategory}</p>
        <p>{provider.email}</p>
        <p>
          {provider.profile.description?.substring(0, 100)}...
        </p>
        
        <div>
          
          <div>
            <span>⭐ {avgRating.toFixed(1)}</span> ({provider.reviews.length} reviews)
          </div>
          
          <Link to={`/providers/${provider._id}`} className="btn btn-outline">
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProviderListPage;