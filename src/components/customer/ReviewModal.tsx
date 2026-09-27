import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Star, CheckCircle2 } from 'lucide-react';

export const ReviewModal: React.FC = () => {
  const { 
    isReviewModalOpen, 
    setIsReviewModalOpen, 
    selectedBookingForReview, 
    addReview 
  } = useApp();

  const [vehicleRating, setVehicleRating] = useState(5);
  const [driverRating, setDriverRating] = useState(5);
  const [onTimeRating, setOnTimeRating] = useState(5);
  const [overallRating, setOverallRating] = useState(5);
  const [comment, setComment] = useState('');

  if (!isReviewModalOpen || !selectedBookingForReview) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    addReview(selectedBookingForReview.id, {
      vehicleRating,
      driverRating,
      onTimeRating,
      overallRating,
      comment,
      createdAt: new Date().toISOString().split('T')[0]
    });
  };

  const renderStars = (current: number, setVal: (n: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => setVal(star)}
            className="p-1 text-neutral-600 hover:text-amber-400 focus:outline-none transition-colors"
          >
            <Star
              className={`w-5 h-5 ${
                star <= current ? 'fill-amber-400 text-amber-400' : 'text-neutral-600'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-neutral-100">
        
        {/* Close Button */}
        <button
          onClick={() => setIsReviewModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="border-b border-neutral-800 pb-4 mb-6">
          <div className="text-xs font-bold text-amber-400 tracking-wider">VERIFIED TRIP FEEDBACK</div>
          <h2 className="text-xl font-bold text-white tracking-tight">Review Equipment & Service</h2>
          <p className="text-xs text-neutral-400 mt-1">
            Booking ID: <span className="font-mono text-neutral-200">{selectedBookingForReview.id}</span> · {selectedBookingForReview.vehicleName}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Rating Criteria */}
          <div className="space-y-3 bg-neutral-950 p-4 rounded-xl border border-neutral-800">
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-300">Vehicle Mechanical Condition</span>
              {renderStars(vehicleRating, setVehicleRating)}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-300">Driver Behavior & Safety</span>
              {renderStars(driverRating, setDriverRating)}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-300">On-Time Arrival to Site</span>
              {renderStars(onTimeRating, setOnTimeRating)}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
              <span className="text-xs font-bold text-white">Overall Experience</span>
              {renderStars(overallRating, setOverallRating)}
            </div>

          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Written Feedback for Contractor Community
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe vehicle condition, driver punctuality, and overall satisfaction on site..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsReviewModalOpen(false)}
              className="flex-1 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-xl text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs transition-colors shadow-md shadow-amber-500/20"
            >
              Submit Review
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
