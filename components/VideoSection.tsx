import React from 'react';
import { Video as VideoType, User } from '../types';
import { Youtube, Plus, Trash2, VideoOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VideoSectionProps {
  videos: VideoType[];
  user: User | null;
  onAddClick: () => void;
  onDeleteClick: (id: string) => void;
}

const VideoSection: React.FC<VideoSectionProps> = ({ videos, user, onAddClick, onDeleteClick }) => {
  const canManage = user?.role === 'owner' || user?.permissions?.videos;

  const getEmbedUrl = (url: string) => {
    try {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      const videoId = (match && match[2].length === 11) ? match[2] : null;
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    } catch (e) {
      return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-ink tracking-tight">Tai TV & Media</h2>
          <p className="text-heritage/60 font-medium">Educational videos and cultural documentaries from YouTube.</p>
        </div>
        {canManage && (
          <button 
            onClick={onAddClick}
            className="heritage-button flex items-center justify-center gap-2 px-8 py-4 w-full md:w-auto"
          >
            <Plus size={20} />
            Add YouTube Video
          </button>
        )}
      </div>

      {videos.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-24 bg-white rounded-[32px] border-2 border-dashed border-heritage/10 shadow-inner"
        >
          <div className="w-24 h-24 bg-white border border-heritage/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <VideoOff className="text-heritage/20" size={40} />
          </div>
          <p className="text-heritage/40 text-xl font-serif font-bold">No videos yet.</p>
          <p className="text-heritage/30 text-sm mt-1">Staff can start adding cultural videos from YouTube here.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence>
            {videos.map((video, idx) => (
              <motion.div 
                key={video.id} 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-heritage/5 flex flex-col hover:shadow-2xl transition-all duration-500"
              >
                <div className="relative aspect-video bg-ink">
                  {getEmbedUrl(video.youtubeUrl) ? (
                    <iframe 
                      className="w-full h-full"
                      src={getEmbedUrl(video.youtubeUrl)!}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-heritage/40">Invalid YouTube URL</div>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-ink mb-2 line-clamp-2">{video.title}</h3>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-heritage/5">
                    <span className="text-[9px] font-bold text-heritage/30 uppercase tracking-widest">Added by {video.addedBy}</span>
                    {canManage && (
                      <button 
                        onClick={() => onDeleteClick(video.id)}
                        className="p-3 text-heritage/20 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default VideoSection;
