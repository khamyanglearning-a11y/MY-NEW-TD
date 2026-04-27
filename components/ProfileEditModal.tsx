import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Save, User as UserIcon, Camera, Mail } from 'lucide-react';
import { StudentProfile } from '../types';

interface ProfileEditModalProps {
  profile: StudentProfile;
  onClose: () => void;
  onSubmit: (data: Partial<StudentProfile>) => void;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ profile, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<Partial<StudentProfile>>({
    name: profile.name,
    email: profile.email || '',
    avatarUrl: profile.avatarUrl || ''
  });

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-ink/60 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden"
      >
        <div className="p-8 border-b border-heritage/5 flex justify-between items-center bg-heritage/5">
          <div>
            <h2 className="text-2xl font-black text-ink tracking-tight">Edit Profile</h2>
            <p className="text-xs font-bold text-heritage/40 uppercase tracking-widest mt-1">Personal Information</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
            <X size={20} className="text-heritage/40" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="flex flex-col items-center gap-4 mb-4">
            <div className="relative group">
              <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white text-3xl font-black shadow-xl overflow-hidden">
                {formData.avatarUrl ? (
                  <img src={formData.avatarUrl} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  profile.name.charAt(0)
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white border border-heritage/10 rounded-xl flex items-center justify-center text-heritage shadow-lg group-hover:scale-110 transition-transform cursor-pointer">
                <Camera size={18} />
              </div>
            </div>
            <p className="text-[10px] font-bold text-heritage/40 uppercase tracking-widest">Tap to change photo</p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-heritage/20" size={18} />
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-12 pr-6 py-4 bg-heritage/5 border-none rounded-2xl focus:ring-2 focus:ring-heritage/20 font-bold text-ink placeholder:text-heritage/20"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-heritage/20" size={18} />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-12 pr-6 py-4 bg-heritage/5 border-none rounded-2xl focus:ring-2 focus:ring-heritage/20 font-bold text-ink placeholder:text-heritage/20"
              />
            </div>

            <div className="relative">
              <Camera className="absolute left-4 top-1/2 -translate-y-1/2 text-heritage/20" size={18} />
              <input
                type="text"
                placeholder="Profile Photo URL"
                value={formData.avatarUrl}
                onChange={e => setFormData({ ...formData, avatarUrl: e.target.value })}
                className="w-full pl-12 pr-6 py-4 bg-heritage/5 border-none rounded-2xl focus:ring-2 focus:ring-heritage/20 font-bold text-ink placeholder:text-heritage/20"
              />
            </div>
          </div>
        </div>

        <div className="p-8 bg-heritage/5 border-t border-heritage/5 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 bg-white text-heritage font-black text-xs uppercase tracking-widest rounded-2xl border border-heritage/10 hover:bg-heritage/5 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(formData)}
            className="flex-1 py-4 bg-heritage text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-heritage/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileEditModal;
