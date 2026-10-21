import React, { useState } from 'react';
import { Star, CheckCircle, MessageSquarePlus, X } from 'lucide-react';
import { Product, Review } from '../../types';
import { RatingStars } from '../common/RatingStars';

interface ProductReviewsProps {
  product: Product;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({ product }) => {
  const [reviewsList, setReviewsList] = useState<Review[]>(product.reviews || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !title || !comment) return;

    const newRev: Review = {
      id: Math.random().toString(),
      author: name,
      location: location || 'United Kingdom',
      rating,
      date: 'Today',
      title,
      comment,
      verifiedPurchase: true,
    };

    setReviewsList([newRev, ...reviewsList]);
    setSubmittedMessage(true);
    setTimeout(() => {
      setSubmittedMessage(false);
      setIsModalOpen(false);
      setName('');
      setLocation('');
      setTitle('');
      setComment('');
    }, 1500);
  };

  return (
    <section id="customer-reviews" className="mt-14 sm:mt-20 pt-10 border-t border-brand-border">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-brand-primary">
            Feedback
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-brand-charcoal mt-1">
            Verified Customer Reviews
          </h2>
          <p className="text-xs text-brand-muted mt-1">
            Genuine experiences from verified CarePlus Health Shop shoppers.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-brand-dark hover:bg-brand-primary text-white text-xs font-semibold px-5 py-2.5 rounded-brand transition-colors inline-flex items-center gap-2 self-start md:self-auto shadow-sm"
        >
          <MessageSquarePlus size={15} />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Review Metrics Card */}
      <div className="bg-white p-6 sm:p-8 rounded-brand-xl border border-brand-border shadow-subtle grid grid-cols-1 md:grid-cols-12 gap-8 items-center mb-8">
        <div className="md:col-span-4 text-center md:text-left md:border-r border-brand-borderLight md:pr-8">
          <div className="text-5xl font-bold font-display text-brand-dark">
            {product.rating.toFixed(1)}
          </div>
          <div className="my-2">
            <RatingStars rating={product.rating} reviewCount={reviewsList.length} size="md" />
          </div>
          <p className="text-xs text-brand-muted">
            Based on {reviewsList.length} customer reviews
          </p>
          <div className="inline-flex items-center gap-1.5 text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full mt-3 font-medium">
            <CheckCircle size={12} className="text-emerald-600" />
            <span>98% would recommend this product</span>
          </div>
        </div>

        {/* Rating Bars Breakdown */}
        <div className="md:col-span-8 space-y-2">
          {[
            { star: 5, pct: 88 },
            { star: 4, pct: 10 },
            { star: 3, pct: 2 },
            { star: 2, pct: 0 },
            { star: 1, pct: 0 },
          ].map((item) => (
            <div key={item.star} className="flex items-center gap-3 text-xs">
              <span className="w-12 text-brand-charcoal font-medium">
                {item.star} stars
              </span>
              <div className="flex-1 bg-brand-surface h-2 rounded-full overflow-hidden border border-brand-border/40">
                <div
                  className="bg-amber-400 h-full rounded-full"
                  style={{ width: `${item.pct}%` }}
                />
              </div>
              <span className="w-10 text-right text-brand-subtle">{item.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviewsList.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-brand-lg border border-brand-border p-6 text-xs text-brand-muted">
            There are no written reviews yet. Be the first to share your experience!
          </div>
        ) : (
          reviewsList.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-6 rounded-brand-lg border border-brand-border shadow-subtle space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <RatingStars rating={rev.rating} showCountText={false} />
                    <span className="text-xs font-bold text-brand-charcoal">
                      {rev.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-brand-muted mt-1">
                    <span className="font-semibold text-brand-dark">{rev.author}</span>
                    <span>•</span>
                    <span>{rev.location}</span>
                    <span>•</span>
                    <span>{rev.date}</span>
                  </div>
                </div>

                {rev.verifiedPurchase && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                    <CheckCircle size={12} className="text-emerald-700" /> Verified UK Buyer
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-brand-charcoal leading-relaxed">
                {rev.comment}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Write a Review Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-brand-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-brand-xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl border border-brand-border">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-brand-subtle hover:text-brand-charcoal"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <h3 className="font-display font-bold text-lg text-brand-charcoal mb-1">
              Review: {product.name}
            </h3>
            <p className="text-xs text-brand-muted mb-6">
              Share your feedback to assist fellow CarePlus shoppers.
            </p>

            {submittedMessage ? (
              <div className="bg-emerald-50 text-emerald-900 p-6 rounded-brand text-center space-y-2">
                <CheckCircle size={32} className="text-brand-primary mx-auto" />
                <h4 className="text-sm font-bold">Review Published!</h4>
                <p className="text-xs">Thank you for helping our UK health community.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-brand-charcoal mb-1">
                    Your Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          size={24}
                          className={`${
                            star <= rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-brand-charcoal mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah M."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border border-brand-border rounded-brand px-3 py-2 text-xs focus:outline-none focus:border-brand-primary"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-brand-charcoal mb-1">
                      Location (UK)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Manchester, UK"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full border border-brand-border rounded-brand px-3 py-2 text-xs focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-brand-charcoal mb-1">
                    Review Headline
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Highly effective and fast dispatch"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border border-brand-border rounded-brand px-3 py-2 text-xs focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-brand-charcoal mb-1">
                    Your Feedback
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe how this product fit into your routine..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full border border-brand-border rounded-brand px-3 py-2 text-xs focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-dark hover:bg-brand-primary text-white font-semibold py-3 rounded-brand transition-colors text-xs shadow-sm"
                >
                  Submit Review
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
