import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  ShieldCheck,
  Star,
  Truck,
  Navigation,
  CheckCircle2,
  MessageSquare,
  ArrowLeft,
  Share2,
} from 'lucide-react';
import { api } from '../services/api';
import { Facility } from '../types';
import { useAuth } from '../context/AuthContext';

export const FacilityDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [facility, setFacility] = useState<Facility | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Review Form state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchFacility = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await api.getFacilityById(id);
      if (res.success) {
        setFacility(res.data);
      } else {
        setError(res.message || 'Facility not found.');
      }
    } catch (err) {
      console.error('Failed to load facility details:', err);
      setError('Error loading facility details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacility();
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (!user) {
      alert('Please log in to submit a review.');
      navigate(`/login?redirect=/facilities/${id}`);
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await api.addReview(id, rating, comment);
      if (res.success) {
        setShowReviewModal(false);
        setComment('');
        fetchFacility();
      } else {
        alert(res.message || 'Failed to submit review.');
      }
    } catch (err) {
      console.error('Review submit error:', err);
      alert('Network error submitting review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-3">
        <div className="w-8 h-8 border-4 border-[#16A6A0] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-bold text-[#5e777f]">Loading facility specifications...</p>
      </div>
    );
  }

  if (error || !facility) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-xl font-bold text-[#071A21] font-['Outfit']">Facility Not Found</h2>
        <p className="text-xs text-[#5e777f]">{error || 'The requested facility record does not exist.'}</p>
        <Link
          to="/facilities"
          className="btn-press inline-flex items-center gap-1.5 px-4 py-2 bg-[#071A21] hover:bg-[#16A6A0] text-white font-bold text-xs rounded-xl transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Facilities Map</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back Link */}
      <Link
        to="/facilities"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16A6A0] hover:underline"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Facilities Directory</span>
      </Link>

      {/* Main Header Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#D1DEDF] shadow-card space-y-5">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black text-[#071A21] font-['Outfit']">
                {facility.name}
              </h1>
              {facility.isVerified && (
                <span className="text-[10px] font-bold bg-[#16A6A0]/10 text-[#16A6A0] px-2.5 py-1 rounded-md border border-[#16A6A0]/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#16A6A0]" />
                  CPCB Authorized
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-[#5e777f] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#16A6A0] shrink-0" />
              <span>{facility.address}, {facility.city}, {facility.state} - {facility.pincode}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${facility.latitude},${facility.longitude}`}
              target="_blank"
              rel="noreferrer"
              className="btn-press px-4 py-2.5 bg-[#F5F7F4] hover:bg-[#16A6A0]/10 border border-[#D1DEDF] text-[#071A21] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Get Directions</span>
            </a>

            <Link
              to={`/pickup?facilityId=${facility.id}`}
              className="btn-press px-4 py-2.5 bg-[#071A21] hover:bg-[#16A6A0] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
            >
              <Truck className="w-3.5 h-3.5 text-[#38D9E8]" />
              <span>Book Doorstep Pickup</span>
            </Link>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-[#F5F7F4] p-4 rounded-xl border border-[#D1DEDF] space-y-1">
            <span className="block text-[10px] font-bold text-[#5e777f] uppercase">Operating Hours</span>
            <div className="flex items-center gap-1.5 font-bold text-[#071A21]">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{facility.openingHours}</span>
            </div>
          </div>

          <div className="bg-[#F5F7F4] p-4 rounded-xl border border-[#D1DEDF] space-y-1">
            <span className="block text-[10px] font-bold text-[#5e777f] uppercase">Helpline / Contact</span>
            <div className="flex items-center gap-1.5 font-bold text-[#071A21]">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{facility.phone}</span>
            </div>
          </div>

          <div className="bg-[#F5F7F4] p-4 rounded-xl border border-[#D1DEDF] space-y-1">
            <span className="block text-[10px] font-bold text-[#5e777f] uppercase">Dismantling Capacity</span>
            <div className="flex items-center gap-1.5 font-bold text-[#071A21]">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{facility.capacity}</span>
            </div>
          </div>
        </div>

        {/* Accepted Items & Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="bg-[#F5F7F4] p-4 rounded-xl border border-[#D1DEDF] space-y-1.5">
            <span className="font-bold text-xs text-[#071A21] uppercase tracking-wide block">
              Accepted Electronic Categories:
            </span>
            <p className="text-xs text-[#5e777f] leading-relaxed">{facility.acceptedCategories}</p>
          </div>

          <div className="bg-[#F5F7F4] p-4 rounded-xl border border-[#D1DEDF] space-y-1.5">
            <span className="font-bold text-xs text-[#071A21] uppercase tracking-wide block">
              Certified Recycling Services:
            </span>
            <p className="text-xs text-[#5e777f] leading-relaxed">{facility.recyclingServices}</p>
          </div>
        </div>

      </div>

      {/* Citizen Reviews & Feedback Section */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#D1DEDF] shadow-card space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-[#071A21] font-['Outfit']">
              Citizen Reviews & Verified Feedback
            </h3>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              {facility.rating.toFixed(1)} / 5.0
            </span>
          </div>

          <button
            onClick={() => setShowReviewModal(true)}
            className="btn-press px-3.5 py-1.5 bg-[#F5F7F4] hover:bg-[#16A6A0]/10 border border-[#D1DEDF] text-[#071A21] hover:text-[#16A6A0] font-bold text-xs rounded-lg transition-all"
          >
            + Write a Review
          </button>
        </div>

        {facility.reviews && facility.reviews.length > 0 ? (
          <div className="space-y-3">
            {facility.reviews.map((r) => (
              <div key={r.id} className="p-4 bg-[#F5F7F4] rounded-xl border border-[#D1DEDF] space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#071A21]">{r.user?.name || 'Verified Recycler'}</span>
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-[#5e777f]">{r.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#5e777f] text-center py-4">
            No reviews submitted yet. Be the first to share your recycling experience with this center!
          </p>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-modal border border-[#D1DEDF]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-[#071A21] font-['Outfit']">Write Review for {facility.name}</h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#071A21] mb-1">Rating (1 to 5 Stars)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setRating(num)}
                      className={`p-2 rounded-lg border text-xs font-bold transition-all ${
                        rating >= num ? 'bg-amber-50 border-amber-300 text-amber-800' : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      ★ {num}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#071A21] mb-1">Your Review & Comments</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Share details about weigh-in accuracy, staff response, and facility ease..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-2.5 bg-[#F5F7F4] border border-[#D1DEDF] rounded-xl text-xs text-[#071A21] focus:bg-white focus:border-[#16A6A0]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="btn-press px-4 py-2 bg-[#F5F7F4] text-[#071A21] hover:bg-[#16A6A0]/10 border border-[#D1DEDF] font-bold rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="btn-press px-4 py-2 bg-[#071A21] hover:bg-[#16A6A0] text-white font-bold rounded-lg shadow-xs transition-all"
                >
                  {submittingReview ? 'Submitting...' : 'Post Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
