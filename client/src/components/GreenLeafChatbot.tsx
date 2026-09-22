import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, HelpCircle, ChevronRight, RefreshCw, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  options?: string[];
  link?: { label: string; url: string };
}

// Custom Potted Sunflower SVG Icon Component 🌻🪴
export const PottedSunflowerIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Terracotta Pot Base */}
    <path d="M18 42L22 60H42L46 42H18Z" fill="#D97706" />
    <path d="M16 38H48V42H16V38Z" fill="#B45309" rx="1" />
    <ellipse cx="32" cy="40" rx="14" ry="2" fill="#78350F" opacity="0.4" />

    {/* Green Stem & Leaves */}
    <path d="M32 40V24" stroke="#059669" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M32 32C26 30 20 34 20 34C20 34 24 26 32 30" fill="#10B981" />
    <path d="M32 28C38 26 44 30 44 30C44 30 40 22 32 26" fill="#10B981" />

    {/* Golden Sunflower Petals */}
    <g transform="translate(32, 18)">
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
        <ellipse
          key={i}
          cx="0"
          cy="-11"
          rx="3.2"
          ry="7.5"
          fill="#F59E0B"
          transform={`rotate(${angle})`}
        />
      ))}
      {[15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345].map((angle, i) => (
        <ellipse
          key={i}
          cx="0"
          cy="-10"
          rx="2.5"
          ry="6.5"
          fill="#FBBF24"
          transform={`rotate(${angle})`}
        />
      ))}
      {/* Center Seed Core */}
      <circle cx="0" cy="0" r="7" fill="#78350F" />
      <circle cx="0" cy="0" r="5" fill="#451A03" />
      <circle cx="-2" cy="-2" r="1.5" fill="#F59E0B" opacity="0.6" />
    </g>
  </svg>
);

const FAQ_LIST = [
  {
    question: '📍 How do I locate nearby e-waste centers?',
    answer:
      'You can search by city or pincode on our interactive Facilities map! We have over 38 CPCB-certified dismantlers & minor collection hubs across India.',
    link: { label: 'Go to Facilities Map', url: '/facilities' },
  },
  {
    question: '🚚 How does doorstep pickup work?',
    answer:
      'Simply choose your item category, select a preferred date/time slot, and our eco-partner will weigh your items at your doorstep and credit your reward points!',
    link: { label: 'Schedule Doorstep Pickup', url: '/pickup' },
  },
  {
    question: '📱 What should I do before recycling a phone/laptop?',
    answer:
      'Always back up your personal photos, log out of cloud accounts, and perform a factory reset. Our partners also issue Certified Data Sanitization certificates for corporate laptops!',
    link: { label: 'Read Data Privacy Guide', url: '/learn' },
  },
  {
    question: '🎁 How are Eco-Reward Points calculated?',
    answer:
      'Points are awarded based on item category and weight (e.g. 100 points for smartphones, 250 points for laptops). You can redeem them for Amazon vouchers or native tree plantings!',
    link: { label: 'View Reward Catalog', url: '/rewards' },
  },
  {
    question: '🔋 Is lithium battery recycling safe?',
    answer:
      'Yes! Never throw batteries in regular trash. Place swollen or old Li-ion batteries in anti-static bags and hand them directly to our certified handlers to prevent fire hazards.',
    link: { label: 'AI Battery Scanner', url: '/scan' },
  },
];

export const GreenLeafChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: "Hi there! 🌻 I'm **GreenLeaf**, your EcoLocate E-Waste Assistant! How can I help you locate facilities, book pickups, or recycle your old electronics today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    // AI Response Engine Logic
    setTimeout(() => {
      let botReply = "I'm GreenLeaf 🌻! I can help you locate recycling centers, schedule doorstep pickups, calculate reward points, and guide you on e-waste safety.";
      let matchedLink: { label: string; url: string } | undefined = undefined;

      const lowerQuery = query.toLowerCase();

      // Check FAQ matches
      const matchedFaq = FAQ_LIST.find(
        (f) =>
          lowerQuery.includes(f.question.toLowerCase().slice(3, 15)) ||
          (lowerQuery.includes('pickup') && f.question.includes('pickup')) ||
          (lowerQuery.includes('facility') && f.question.includes('locate')) ||
          (lowerQuery.includes('map') && f.question.includes('locate')) ||
          (lowerQuery.includes('reward') && f.question.includes('Reward')) ||
          (lowerQuery.includes('point') && f.question.includes('Reward')) ||
          (lowerQuery.includes('battery') && f.question.includes('battery')) ||
          (lowerQuery.includes('data') && f.question.includes('phone'))
      );

      if (matchedFaq) {
        botReply = matchedFaq.answer;
        matchedLink = matchedFaq.link;
      } else if (lowerQuery.includes('hi') || lowerQuery.includes('hello') || lowerQuery.includes('hey')) {
        botReply = "Hello! 🌻 Glad to see you taking steps toward sustainable e-waste disposal. You can ask me any question or choose an FAQ below!";
      } else if (lowerQuery.includes('ai') || lowerQuery.includes('scan') || lowerQuery.includes('photo')) {
        botReply = "Our AI Scanner uses computer vision to analyze photos of your electronics, estimate gold/copper recovery, and calculate reward points instantly!";
        matchedLink = { label: 'Try AI Photo Scanner', url: '/scan' };
      } else if (lowerQuery.includes('3d') || lowerQuery.includes('globe') || lowerQuery.includes('earth')) {
        botReply = "Explore our interactive 3D Globe in the Home page to visualize circular economy nodes, precious metal recoveries, and nationwide e-waste collection streams in real-time!";
        matchedLink = { label: 'View 3D Interactive Globe', url: '/' };
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        link: matchedLink,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {/* Compact Unobtrusive Chatbot Floating Trigger */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          title="Ask GreenLeaf AI Assistant"
          aria-label="Open GreenLeaf AI Chatbot"
          className="w-12 h-12 rounded-full bg-[#071A21]/90 hover:bg-[#16A6A0] text-[#16A6A0] hover:text-[#071A21] backdrop-blur-md border border-[#16A6A0]/40 shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer group"
        >
          <PottedSunflowerIcon className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
        </button>
      )}

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="w-[340px] sm:w-[380px] h-[520px] bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center p-1 shadow-inner">
                <PottedSunflowerIcon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-black text-sm text-white flex items-center gap-1.5">
                  GreenLeaf AI 🌻
                  <span className="px-1.5 py-0.2 text-[9px] bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 rounded-full">
                    Online
                  </span>
                </h3>
                <p className="text-[10px] text-slate-300 font-medium">Eco Assistant & FAQ Guide</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/60">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center shrink-0 p-0.5 mt-0.5">
                    <PottedSunflowerIcon className="w-5 h-5" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl p-3 text-xs space-y-2 ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white font-medium rounded-br-none shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-xs'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  {msg.link && (
                    <Link
                      to={msg.link.url}
                      onClick={() => setIsOpen(false)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 font-extrabold rounded-lg text-[10px] border border-emerald-200 hover:bg-emerald-100 transition-colors"
                    >
                      <span>{msg.link.label}</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  )}
                  <span
                    className={`block text-[9px] text-right ${
                      msg.sender === 'user' ? 'text-emerald-100' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold p-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                <span>GreenLeaf is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick FAQ Shortcuts Section */}
          <div className="px-3 py-2 bg-slate-100/90 border-t border-slate-200 space-y-1">
            <span className="block text-[9px] font-black uppercase text-slate-400 tracking-wider px-1">
              Quick FAQs:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {FAQ_LIST.map((faq, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(faq.question)}
                  className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200 rounded-full text-[10px] font-bold shrink-0 transition-colors"
                >
                  {faq.question.split(' ')[0]} {faq.question.split(' ').slice(1, 4).join(' ')}...
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask GreenLeaf anything about e-waste..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl shadow-md transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
