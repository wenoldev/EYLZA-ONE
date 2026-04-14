import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface AurelianJournalProps {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
}

const AurelianJournal: React.FC<AurelianJournalProps> = ({
  title = "The Aurum Journal",
  description = "Subscribe to receive private invitations to collection previews and stories from the workshop.",
  placeholder = "YOUR EMAIL ADDRESS",
  buttonText = "Join"
}) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribing email:", email);
    alert("Thank you for joining our journal.");
    setEmail('');
  };

  return (
    <section className="py-32 bg-stone-100 border-y border-stone-200">
      <div className="max-w-3xl mx-auto text-center px-6">
        <h2 className="text-4xl font-serif italic mb-6 tracking-tight">{title}</h2>
        <p className="text-stone-500 mb-12 font-sans tracking-wide leading-relaxed">{description}</p>
        <form 
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row gap-0 border-b border-stone-400 max-w-lg mx-auto transition-all focus-within:border-primary"
        >
          <input 
            className="bg-transparent border-none w-full py-4 px-0 focus:ring-0 placeholder:text-stone-300 text-[10px] tracking-[0.3em] font-sans uppercase text-stone-900" 
            placeholder={placeholder} 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button 
            className="py-4 px-8 text-[11px] tracking-[0.4em] font-sans uppercase text-primary font-bold flex items-center gap-2 hover:translate-x-1 transition-transform" 
            type="submit"
          >
            {buttonText}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </section>
  );
};

export default AurelianJournal;
