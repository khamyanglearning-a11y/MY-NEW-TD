import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, User as UserIcon, MessageSquare, Reply } from 'lucide-react';
import { Message, User } from '../types';
import { db } from '../services/database';

interface MessageModalProps {
  user: User;
  onClose: () => void;
}

const MessageModal: React.FC<MessageModalProps> = ({ user, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await db.messages.fetchForUser(user.id);
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [user.id]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    setSending(true);
    try {
      const msg: Message = {
        id: Date.now().toString(),
        senderId: user.id,
        senderName: user.name || user.username,
        receiverId: 'admin', // Default to admin for public users
        text: newMessage,
        timestamp: Date.now(),
        isRead: false,
        status: 'sent'
      };
      await db.messages.send(msg);
      // Re-fetch messages to get the updated list with IDs
      const data = await db.messages.fetchForUser(user.id);
      setMessages(data);
      setNewMessage('');
    } catch (error) {
      alert('Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-ink/60 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col h-[600px]"
      >
        <div className="p-6 border-b border-heritage/5 flex justify-between items-center bg-heritage/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-heritage text-white rounded-xl flex items-center justify-center">
              <MessageSquare size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-ink tracking-tight">Direct Support</h2>
              <p className="text-[10px] font-bold text-heritage/40 uppercase tracking-widest">Chat with Staff</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
            <X size={20} className="text-heritage/40" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-paper/50">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="w-8 h-8 border-4 border-heritage border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-bold text-heritage/40 uppercase tracking-widest">Loading messages...</p>
            </div>
          ) : messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.senderId === user.id ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium ${
                    msg.senderId === user.id
                      ? 'bg-heritage text-white rounded-tr-none'
                      : 'bg-white text-ink border border-heritage/10 rounded-tl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] font-bold text-heritage/30 uppercase tracking-widest mt-1 px-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-20">
              <MessageSquare size={48} className="text-heritage" />
              <p className="text-sm font-bold text-heritage uppercase tracking-widest">No messages yet.<br/>Send a message to start chatting.</p>
            </div>
          )}
        </div>

        <div className="p-6 bg-white border-t border-heritage/5">
          <div className="relative">
            <input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="w-full pl-6 pr-16 py-4 bg-heritage/5 border-none rounded-2xl focus:ring-2 focus:ring-heritage/20 font-medium text-ink placeholder:text-heritage/20"
            />
            <button
              onClick={handleSend}
              disabled={sending || !newMessage.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-heritage text-white rounded-xl shadow-lg shadow-heritage/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MessageModal;
