import React, { useState } from 'react';
import { Star, ThumbsUp } from 'lucide-react';
import { useEffect } from 'react';
import api from '../../api/axios';
import { showError, showSuccess } from "./../../utils/toast";


const ReviewsTrust = ({ currentEquipmentId, ownerTrustScore }) => {

  const [reviews, setReviews] = useState([]);
  const [avgRating,setAvgRating]=useState(0);

  //for fetching equipments
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get(`/api/equipment/${currentEquipmentId}/review`);
        setReviews(response.data.reviews);
      } catch (err) {
      showError(err.response?.data?.message || "Something went wrong");
      }
    };
    fetchReviews();
  }, []);

  useEffect(() => {
    const fetchAvgRating = async () => {
      try {
        const response = await api.get(`/api/equipment/rating/${currentEquipmentId}`);
        setAvgRating(response.data.avgRating);
      } catch (err) {
      showError(err.response?.data?.message || "Something went wrong");
      }
    };
    fetchAvgRating();
  }, []);

  

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Reviews & Community Trust</h2>
          <p className="text-slate-600">What other farmers say</p>
        </div>
        <div className="text-center">
          <div className="flex items-center space-x-2 mb-1">
            <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            <span className="text-3xl font-bold text-slate-800">{avgRating}</span>
          </div>
          <p className="text-sm text-slate-600">{reviews.length} reviews</p>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {/* If there are no reviews */}
        {reviews.length === 0 ? (
          <div className="bg-gradient-to-r from-slate-50 to-white rounded-xl p-5 border border-slate-200">
            <div className="flex items-start space-x-4">
              <div className="flex-1">
                {/* Name & Rating */}
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-bold text-slate-400">No reviews yet</p>
                    <p className="text-xs text-slate-400">--/--/----</p>
                  </div>
                  <div className="flex space-x-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-slate-300" />
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <p className="text-slate-400 text-sm leading-relaxed mb-3">
                  No reviews available at this time
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  <span className="bg-slate-100 text-slate-400 px-3 py-1 rounded-full text-xs font-semibold">
                    No tags
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : 
        (
          reviews.map((review, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-slate-50 to-white rounded-xl p-5 border border-slate-200 hover:shadow-lg transition-all">
              <div className="flex items-start space-x-4">
                <div className="flex-1">
                  {/* Name & Rating */}
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-bold text-slate-800">{review.ReviewerFarmer?.name || "Anonymous Farmer"}</p>
                      <p className="text-xs text-slate-500">{review.date}</p>
                    </div>
                    <div className="flex space-x-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < review.rating
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-slate-300'
                            }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <p className="text-slate-700 text-sm leading-relaxed mb-3">
                    {review.comment}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {review.tags?.map((tag, i) => (
                      <span
                        key={i}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold"
                      >
                        ✓ {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewsTrust;