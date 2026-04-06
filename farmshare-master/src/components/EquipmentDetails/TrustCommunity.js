import React from 'react';
import { Star, ThumbsUp, Clock, Wrench, Users } from 'lucide-react';

const TrustCommunity = ({ reviews }) => {

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 p-6 space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-2xl font-bold text-slate-800 flex items-center space-x-2">
          <Users className="w-6 h-6 text-green-600" />
          <span>Trust & Community</span>
        </h4>
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-4 py-2 rounded-full font-bold text-sm">
          {reviews.length} Reviews
        </div>
      </div>

      {/* Reviews - Scrollable */}
      <div className="flex-1 space-y-4 ">
        {/* If there are no reviews */}
        {reviews?.length === 0 ? (
          <div className="bg-gradient-to-r from-slate-50 to-white rounded-xl p-5 border border-slate-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-slate-400 font-bold flex-shrink-0">
                  ?
                </div>
                <div>
                  <p className="font-bold text-slate-400">No reviews yet</p>
                  <p className="text-sm text-slate-400">Be the first to review</p>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-slate-300" />
                ))}
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed italic mb-3">
              "No reviews available at this time"
            </p>

            <p className="text-xs text-slate-400 mt-3">--/--/----</p>
          </div>
        ) : 
       
        ( 
          reviews.map((review, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-slate-50 to-white rounded-xl p-5 border border-slate-200 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-3">
                {/* Reviewer Info */}
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {review.ReviewerFarmer.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{review.ReviewerFarmer.name}</p>
                    <p className="text-sm text-slate-600">{review.ReviewerFarmer.village}</p>
                  </div>
                </div>
                {/* Review Ratings */}
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-slate-300'
                        }`}
                    />
                  ))}
                </div>
              </div>

              {/* Review Comment */}
              <p className="text-slate-700 leading-relaxed italic mb-3">
                "{review.comment}"
              </p>

              {/* Review Tags */}
              {review.tags && (
                <div className="flex flex-wrap gap-2">
                  {review.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold"
                    >
                      ✓ {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Review Date */}
              <p className="text-xs text-slate-500 mt-3">{review.date}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TrustCommunity;