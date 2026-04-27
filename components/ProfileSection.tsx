import React, { useState, useRef } from 'react';
import { User, PublicUser } from '../types';
import { Camera, Edit3, Save, X, MapPin, Phone, Calendar, ShieldCheck, Fingerprint } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProfileSectionProps {
  currentUser: User;
  registeredUsers: PublicUser[];
  onUpdateProfile: (updatedData: Partial<PublicUser>) => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ currentUser, registeredUsers, onUpdateProfile }) => {
  const userDetails = registeredUsers.find(u => u.id === currentUser.id);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(userDetails?.name || currentUser.name);
  const [editPhone, setEditPhone] = useState(userDetails?.phone || currentUser.id);
  const [editAddress, setEditAddress] = useState(userDetails?.address || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const handlePhotoClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image too large. Please use a photo under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        onUpdateProfile({ avatarUrl: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (editName.length < 2) return alert("Name is too short.");
    if (editPhone.length !== 10) return alert("Phone must be 10 digits.");
    
    onUpdateProfile({
      name: editName,
      phone: editPhone,
      address: editAddress
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-serif font-bold text-ink tracking-tight">Community Profile</h2>
        <p className="text-heritage/60 font-medium">Manage your personal identity on TaiHub.</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[40px] p-10 shadow-2xl shadow-heritage/5 border border-heritage/5 flex flex-col items-center relative overflow-hidden"
      >
        {/* Profile Backdrop Decor */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-heritage/5 to-transparent"></div>

        {/* Photo Section */}
        <div className="relative z-10 mb-8">
          <div 
            onClick={handlePhotoClick}
            className={`w-32 h-32 rounded-[32px] flex items-center justify-center text-4xl font-serif font-bold shadow-2xl border-4 border-white transition-all overflow-hidden ${
              isEditing ? 'cursor-pointer hover:brightness-90 hover:scale-105' : ''
            } ${userDetails?.avatarUrl ? 'bg-transparent' : 'bg-heritage text-white'}`}
          >
            {userDetails?.avatarUrl ? (
              <img src={userDetails.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              getInitials(editName)
            )}
            
            {isEditing && (
              <div className="absolute inset-0 bg-ink/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Camera className="text-white" size={32} />
              </div>
            )}
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>

        {/* Form Content */}
        <div className="w-full space-y-6 relative z-10">
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div 
                key="edit"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-heritage/40 uppercase tracking-widest ml-1">Edit Full Name</label>
                  <input 
                    type="text" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-6 py-4 bg-heritage/5 border-2 border-transparent rounded-2xl focus:border-accent focus:bg-white outline-none font-bold text-ink transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-heritage/40 uppercase tracking-widest ml-1">Edit Phone Number</label>
                  <div className="relative">
                     <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-heritage/30">+91</span>
                     <input 
                      type="tel" 
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="w-full pl-14 pr-6 py-4 bg-heritage/5 border-2 border-transparent rounded-2xl focus:border-accent focus:bg-white outline-none font-bold text-ink tracking-widest transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-heritage/40 uppercase tracking-widest ml-1">Edit Address</label>
                  <input 
                    type="text" 
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="w-full px-6 py-4 bg-heritage/5 border-2 border-transparent rounded-2xl focus:border-accent focus:bg-white outline-none font-bold text-ink transition-all"
                  />
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-4 bg-heritage/5 hover:bg-heritage/10 text-heritage/60 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    className="flex-1 py-4 bg-heritage hover:bg-ink text-white rounded-2xl font-bold shadow-xl shadow-heritage/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Save size={18} />
                    Save Changes
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="view"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="text-center space-y-6"
              >
                <div>
                  <h3 className="text-3xl font-serif font-bold text-ink leading-tight">{userDetails?.name || currentUser.name}</h3>
                  <div className="inline-flex items-center gap-2 mt-2 px-4 py-1 bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-widest rounded-full border border-accent/20">
                    <ShieldCheck size={12} />
                    Verified Member
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-heritage/5 p-4 rounded-3xl border border-heritage/5 flex flex-col items-center">
                    <div className="flex items-center gap-1 text-[9px] font-bold text-heritage/40 uppercase tracking-widest mb-1">
                      <Phone size={10} />
                      Mobile
                    </div>
                    <p className="font-bold text-ink">+91 {userDetails?.phone || currentUser.id}</p>
                  </div>
                  <div className="bg-heritage/5 p-4 rounded-3xl border border-heritage/5 flex flex-col items-center">
                    <div className="flex items-center gap-1 text-[9px] font-bold text-heritage/40 uppercase tracking-widest mb-1">
                      <Calendar size={10} />
                      Joined
                    </div>
                    <p className="font-bold text-ink">
                      {userDetails ? new Date(userDetails.registeredAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="bg-heritage/5 p-6 rounded-[32px] border border-heritage/5 text-left">
                  <div className="flex items-center gap-1 text-[9px] font-bold text-heritage/40 uppercase tracking-widest mb-2">
                    <MapPin size={10} />
                    Registered Address
                  </div>
                  <p className="text-sm font-medium text-heritage/60 italic leading-relaxed">
                    "{userDetails?.address || 'Address not set'}"
                  </p>
                </div>

                <button 
                  onClick={() => setIsEditing(true)}
                  className="heritage-button w-full py-5 text-lg flex items-center justify-center gap-3"
                >
                  <Edit3 size={20} />
                  Edit My Profile
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      
      {!isEditing && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-ink border border-white/5 p-8 rounded-[40px] flex items-center gap-6 shadow-2xl"
        >
          <div className="w-16 h-16 bg-white/5 text-accent rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-white/10">
            <Fingerprint size={32} />
          </div>
          <div>
            <h4 className="text-lg font-serif font-bold text-white">Cultural Preservation</h4>
            <p className="text-white/40 font-medium text-sm leading-relaxed">
              Your profile is your digital heritage footprint. By contributing to TaiHub, you ensure the Tai Khamyang culture thrives in the digital era.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProfileSection;
