import React, { useState } from 'react';
import { X, Star, User, Tractor, Send } from 'lucide-react';
import { showError } from '../../utils/toast';

// Farmer Review Modal
export const FarmerReviewModal = ({ rental, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const farmerTags = [
    "Polite",
    "Professional",
    "Helpful",
    "On-Time",
    "Late",
    "Responsive",
    "Unresponsive",
    "Trustworthy",
    "Overpriced"
  ];

  const handleTagToggle = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      showError('Please select a rating');
      return;
    }
    
    if (selectedTags.length === 0) {
      showError('Please select at least one tag');
      return;
    }

    if (!comment.trim()) {
      showError('Please write a comment');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit({
        rating,
        comment,
        tags: selectedTags,
        farmerId: rental.farmer._id || rental.farmer.id,
        rentalId: rental._id || rental.id
      });
      onClose();
    } catch (err) {
      showError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-500 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-3 rounded-xl">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="text-white">
                <h2 className="text-2xl font-bold">Review Farmer</h2>
                <p className="text-white/90">{rental.farmer.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-xl transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-lg font-bold text-slate-800 mb-3">
              How would you rate {rental.farmer.name}? *
            </label>
            <div className="flex items-center justify-center space-x-2 py-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transform hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-12 h-12 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-slate-600 font-semibold">
                {rating === 5 ? 'Excellent!' : rating === 4 ? 'Good!' : rating === 3 ? 'Average' : rating === 2 ? 'Below Average' : 'Poor'}
              </p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-lg font-bold text-slate-800 mb-3">
              Select tags that describe your experience *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {farmerTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-4 py-3 rounded-xl border-2 font-medium transition-all ${
                    selectedTags.includes(tag)
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-slate-200 hover:border-green-300 text-slate-700'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-lg font-bold text-slate-800 mb-3">
              Share your experience *
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others about your experience with this farmer..."
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-green-500 focus:outline-none transition-colors resize-none"
              rows={5}
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-slate-500">Maximum 500 characters</span>
              <span className="text-sm text-slate-600 font-medium">{comment.length}/500</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 bg-slate-200 text-slate-700 py-4 rounded-xl font-semibold hover:bg-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || rating === 0 || selectedTags.length === 0 || !comment.trim()}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Submit Review</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Equipment Review Modal
export const EquipmentReviewModal = ({ rental, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const equipmentTags = [
    "Well Maintained",
    "Clean",
    "Smooth",
    "Fuel Efficient",
    "Old",
    "Breakdown",
    "Poor Condition",
    "Worth Price",
    "Overpriced"
  ];

  const handleTagToggle = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    
    if (selectedTags.length === 0) {
      alert('Please select at least one tag');
      return;
    }

    if (!comment.trim()) {
      alert('Please write a comment');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit({
        rating,
        comment,
        tags: selectedTags,
        equipmentId: rental.equipment._id || rental.equipment.id,
        rentalId: rental._id || rental.id
      });
      onClose();
    } catch (err) {
      showError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-500 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-3 rounded-xl">
                <Tractor className="w-6 h-6 text-white" />
              </div>
              <div className="text-white">
                <h2 className="text-2xl font-bold">Review Equipment</h2>
                <p className="text-white/90">{rental.equipment.equipmentName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-xl transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Equipment Image Preview */}
          {rental.equipment.image && (
            <div className="rounded-xl overflow-hidden border-2 border-slate-200">
              <img
                src={rental.equipment.image}
                alt={rental.equipment.equipmentName}
                className="w-full h-48 object-cover"
              />
            </div>
          )}

          {/* Rating */}
          <div>
            <label className="block text-lg font-bold text-slate-800 mb-3">
              How would you rate this equipment? *
            </label>
            <div className="flex items-center justify-center space-x-2 py-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transform hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-12 h-12 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-slate-600 font-semibold">
                {rating === 5 ? 'Excellent!' : rating === 4 ? 'Good!' : rating === 3 ? 'Average' : rating === 2 ? 'Below Average' : 'Poor'}
              </p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-lg font-bold text-slate-800 mb-3">
              Select tags that describe the equipment *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {equipmentTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-4 py-3 rounded-xl border-2 font-medium transition-all ${
                    selectedTags.includes(tag)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 hover:border-blue-300 text-slate-700'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-lg font-bold text-slate-800 mb-3">
              Share your experience with this equipment *
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others about the condition, performance, and overall experience with this equipment..."
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-colors resize-none"
              rows={5}
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-slate-500">Maximum 500 characters</span>
              <span className="text-sm text-slate-600 font-medium">{comment.length}/500</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 bg-slate-200 text-slate-700 py-4 rounded-xl font-semibold hover:bg-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || rating === 0 || selectedTags.length === 0 || !comment.trim()}
              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Submit Review</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};