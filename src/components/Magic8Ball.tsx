import React, { useState, useEffect } from 'react';
import { Sparkles, Zap, Book, Heart, History, X } from 'lucide-react';

export default function Magic8Ball() {
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHands, setShowHands] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('random');
  const [question, setQuestion] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [historyFilter, setHistoryFilter] = useState('all');
  const [theme, setTheme] = useState('cosmic');
  const [shakesRemaining, setShakesRemaining] = useState(3);
  const [isLimited, setIsLimited] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const themes = {
    cosmic: { bg: 'from-slate-900 via-purple-900 to-slate-900', ball: 'from-gray-700 via-black to-gray-900', window: 'from-indigo-600 via-purple-700 to-indigo-900', accent: 'text-yellow-300', particles: 'bg-purple-400', text: 'text-white', secondary: 'text-purple-200' },
    darkOracle: { bg: 'from-black via-gray-900 to-black', ball: 'from-gray-900 via-black to-gray-950', window: 'from-red-900 via-black to-purple-900', accent: 'text-red-400', particles: 'bg-red-500', text: 'text-white', secondary: 'text-gray-400' },
    minimalZen: { bg: 'from-gray-100 via-slate-200 to-gray-100', ball: 'from-gray-400 via-gray-600 to-gray-500', window: 'from-slate-600 via-slate-700 to-slate-800', accent: 'text-slate-700', particles: 'bg-slate-400', text: 'text-gray-900', secondary: 'text-gray-600' }
  };

  const quotes = {
    motivational: ["You are capable of amazing things!", "Today is your day to shine!", "Believe in yourself and magic happens", "Your potential is limitless", "Keep pushing, you're almost there!", "Success starts with self-belief", "You've got the power within you", "Make today count!", "Dream big, achieve bigger", "Your best days are ahead"],
    wordOfTheDay: ["Serendipity: Happy accidents await", "Resilience: Bounce back stronger", "Luminous: Let your light shine", "Ephemeral: Cherish this moment", "Wanderlust: Adventure calls you", "Effervescent: Bubble with joy", "Quintessential: Be authentically you", "Euphoria: Happiness is coming", "Mellifluous: Speak sweetly today", "Incandescent: Radiate brilliance"],
    poetic: ["Like stars, you illuminate darkness", "Rivers flow, so shall you grow", "In every ending, seeds of beginning", "Dance with the wind of change", "Your heart knows the way forward", "Bloom where you are planted", "Mountains bow to persistent streams", "The universe conspires for you", "In stillness, find your thunder", "Paint your sky with bold dreams"]
  };

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('8ball_history') || '[]');
    setHistory(savedHistory);
    const savedTheme = localStorage.getItem('8ball_theme') || 'cosmic';
    setTheme(savedTheme);
    const usageData = JSON.parse(localStorage.getItem('8ball_usage') || '{}');
    const now = Date.now();
    const twoHours = 2 * 60 * 60 * 1000;
    if (usageData.lastReset && now - usageData.lastReset < twoHours) {
      const remaining = 3 - (usageData.count || 0);
      setShakesRemaining(Math.max(0, remaining));
      if (remaining <= 0) setIsLimited(true);
    } else {
      localStorage.setItem('8ball_usage', JSON.stringify({ count: 0, lastReset: now }));
      setShakesRemaining(3);
    }
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const saveToHistory = (text, cat, q) => {
    const entry = { text, category: cat, timestamp: Date.now(), question: q || '' };
    const newHistory = [entry, ...history].slice(0, 20);
    setHistory(newHistory);
    localStorage.setItem('8ball_history', JSON.stringify(newHistory));
  };

  const updateUsage = () => {
    const usageData = JSON.parse(localStorage.getItem('8ball_usage') || '{}');
    const newCount = (usageData.count || 0) + 1;
    localStorage.setItem('8ball_usage', JSON.stringify({ count: newCount, lastReset: usageData.lastReset || Date.now() }));
    const remaining = 3 - newCount;
    setShakesRemaining(remaining);
    if (remaining <= 0) setIsLimited(true);
  };

  const getRandomQuote = (cat) => quotes[cat][Math.floor(Math.random() * quotes[cat].length)];

  const handleShake = () => {
    if (isShaking || isLimited) return;
    setIsShaking(true);
    setShowAnswer(false);
    if (!prefersReducedMotion) setShowHands(true);
    setAnswer('');
    setCurrentQuestion(question);
    if (!prefersReducedMotion) setTimeout(() => setShowHands(false), 800);
    setTimeout(() => {
      setIsShaking(false);
      let chosenCategory = selectedCategory === 'random' ? ['motivational', 'wordOfTheDay', 'poetic'][Math.floor(Math.random() * 3)] : selectedCategory;
      const randomAnswer = getRandomQuote(chosenCategory);
      setAnswer(randomAnswer);
      setCategory(chosenCategory);
      setShowAnswer(true);
      saveToHistory(randomAnswer, chosenCategory, question);
      updateUsage();
      setQuestion('');
    }, prefersReducedMotion ? 300 : 1200);
  };

  const getCategoryIcon = (cat) => cat === 'motivational' ? <Zap className="inline" size={20} /> : cat === 'wordOfTheDay' ? <Book className="inline" size={20} /> : cat === 'poetic' ? <Heart className="inline" size={20} /> : <Sparkles className="inline" size={20} />;
  const getCategoryColor = (cat) => cat === 'motivational' ? 'from-orange-400 to-red-500' : cat === 'wordOfTheDay' ? 'from-blue-400 to-indigo-500' : cat === 'poetic' ? 'from-pink-400 to-purple-500' : 'from-yellow-400 to-orange-400';
  const filteredHistory = historyFilter === 'all' ? history : history.filter(h => h.category === historyFilter);
  const t = themes[theme];
  const isZen = theme === 'minimalZen';

  return (
    <div className={`min-h-screen bg-gradient-to-br ${t.bg} flex items-center justify-center p-8 overflow-hidden relative`}>
      {!prefersReducedMotion && <div className="absolute inset-0 overflow-hidden pointer-events-none">{[...Array(20)].map((_, i) => <div key={i} className={`absolute w-2 h-2 ${t.particles} rounded-full opacity-20`} style={{ left: `${Math.random()*100}%`, top: `${Math.random()*100}%`, animation: `float ${5+Math.random()*10}s ease-in-out infinite ${Math.random()*5}s` }} />)}</div>}
      
      <div className="absolute top-4 right-4 flex gap-2 z-30">
        {['cosmic', 'darkOracle', 'minimalZen'].map((th, i) => <button key={th} onClick={() => { setTheme(th); localStorage.setItem('8ball_theme', th); }} className={`p-3 rounded-full transition-all ${theme === th ? (th === 'cosmic' ? 'bg-purple-600' : th === 'darkOracle' ? 'bg-red-900' : 'bg-slate-600') + ' text-white scale-110' : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'}`}>{['🌌', '🔮', '🧘'][i]}</button>)}
      </div>

      <button onClick={() => setShowHistory(true)} className={`absolute top-4 left-4 p-3 rounded-full transition-all z-30 ${isZen ? 'bg-slate-600 text-white' : 'bg-white bg-opacity-20 text-white'} hover:scale-110`}><History size={24} /></button>

      {showHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className={`${isZen ? 'bg-white' : 'bg-gray-900'} rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col`}>
            <div className={`p-6 border-b ${isZen ? 'border-gray-200' : 'border-gray-700'} flex justify-between items-center`}>
              <h2 className={`text-2xl font-bold ${t.text}`}>📜 Wisdom History</h2>
              <button onClick={() => setShowHistory(false)} className={`p-2 rounded-full ${isZen ? 'hover:bg-gray-200' : 'hover:bg-gray-800'}`}><X className={t.text} size={24} /></button>
            </div>
            <div className="p-6 flex gap-2 flex-wrap border-b border-gray-700">
              {['all', 'motivational', 'wordOfTheDay', 'poetic'].map(f => <button key={f} onClick={() => setHistoryFilter(f)} className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${historyFilter === f ? f === 'all' ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-purple-900' : `bg-gradient-to-r ${getCategoryColor(f)} text-white` : isZen ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-gray-800 text-white hover:bg-gray-700'}`}>{f === 'all' ? 'All' : <>{getCategoryIcon(f)} {f === 'motivational' ? 'Motivational' : f === 'wordOfTheDay' ? 'Word Wisdom' : 'Poetic'}</>}</button>)}
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">{filteredHistory.length === 0 ? <p className={`text-center ${t.secondary} py-8`}>No wisdom yet. Shake the ball to begin!</p> : filteredHistory.map((e, i) => <div key={i} className={`p-4 rounded-xl ${isZen ? 'bg-gray-100 border-gray-200' : 'bg-gray-800 bg-opacity-50 border-gray-700'} border`}><div className="flex items-start justify-between mb-2"><span className={`text-xs font-semibold ${isZen ? 'text-gray-600' : 'text-gray-400'} flex items-center gap-1`}>{getCategoryIcon(e.category)} {e.category === 'motivational' ? 'MOTIVATIONAL' : e.category === 'wordOfTheDay' ? 'WORD WISDOM' : 'POETIC'}</span><span className="text-xs text-gray-500">{new Date(e.timestamp).toLocaleString()}</span></div><p className={`${t.text} font-medium`}>{e.text}</p>{e.question && <p className={`text-sm ${isZen ? 'text-gray-500' : 'text-gray-400'} mt-2 italic`}>Q: {e.question}</p>}</div>)}</div>
          </div>
        </div>
      )}

      <div className="text-center relative z-10 w-full max-w-4xl">
        <div className="mb-8">
          <h1 className={`text-6xl font-bold ${t.text} mb-2 flex items-center justify-center gap-3`}><Sparkles className={`${t.accent} ${!prefersReducedMotion && 'animate-pulse'}`} size={50} />Mystic 8-Ball<Sparkles className={`${t.accent} ${!prefersReducedMotion && 'animate-pulse'}`} size={50} /></h1>
          <p className={`${t.secondary} text-xl`}>Seek wisdom from the cosmic sphere</p>
          <p className={`${t.secondary} text-sm mt-2`}>{isLimited ? 'You\'ve received today\'s wisdom' : `${shakesRemaining} shake${shakesRemaining !== 1 ? 's' : ''} remaining (resets in 2 hours)`}</p>
        </div>

        <div className="mb-6 max-w-md mx-auto"><input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="What's your question? (optional)" disabled={isLimited} className={`w-full px-6 py-3 rounded-full ${isZen ? 'bg-white border-2 border-gray-300 text-gray-900 placeholder-gray-400' : 'bg-white bg-opacity-20 text-white placeholder-gray-300'} backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50`} /></div>

        <div className="mb-8 flex gap-3 justify-center flex-wrap">
          {[['random', 'Random', Sparkles, 'from-yellow-400 to-orange-400'], ['motivational', 'Motivational', Zap, 'from-orange-400 to-red-500'], ['wordOfTheDay', 'Word Wisdom', Book, 'from-blue-400 to-indigo-500'], ['poetic', 'Poetic', Heart, 'from-pink-400 to-purple-500']].map(([cat, label, Icon, grad]) => <button key={cat} onClick={() => setSelectedCategory(cat)} disabled={isLimited} className={`px-6 py-3 rounded-full font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${selectedCategory === cat ? `bg-gradient-to-r ${grad} ${cat === 'random' ? 'text-purple-900' : 'text-white'} scale-110` : isZen ? 'bg-gray-300 text-gray-700 hover:bg-gray-400' : 'bg-white bg-opacity-10 text-white hover:bg-opacity-20'}`}><Icon className="inline mr-2" size={18} />{label}</button>)}
        </div>

        <div className="relative w-96 h-96 mx-auto" style={{perspective: '1000px'}}>
          {showHands && !prefersReducedMotion && <><div className="absolute left-0 top-1/2 -translate-y-1/2 text-8xl z-20" style={{animation: 'handShakeLeft 1s ease-in-out'}}></div><div className="absolute right-0 top-1/2 -translate-y-1/2 text-8xl z-20" style={{animation: 'handShakeRight 1s ease-in-out'}}></div></>}
          <div onClick={handleShake} className={`relative w-full h-full ${!isLimited && 'cursor-pointer hover:scale-105'} transition-all ${isShaking ? prefersReducedMotion ? 'animate-fadeScale' : '' : ''}`} style={{transformStyle: 'preserve-3d', animation: isShaking && !prefersReducedMotion ? 'shake3d 1s ease-in-out' : 'none'}}>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-64 h-8 bg-black opacity-30 rounded-full blur-xl"></div>
            <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${t.ball} shadow-2xl`} style={{boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8), inset 0 -20px 40px rgba(255,255,255,0.1)'}}>
              {!isZen && <div className="absolute top-12 left-16 w-32 h-32 bg-gradient-to-br from-white to-transparent opacity-30 rounded-full blur-2xl"></div>}
              <div className="absolute bottom-12 right-16 w-40 h-40 bg-black opacity-40 rounded-full blur-2xl"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-44 h-44 rounded-full bg-white flex items-center justify-center" style={{boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.3)'}}>{!showAnswer ? isLimited ? <div className="text-center p-4"><p className="text-purple-900 text-sm font-bold leading-tight">You've received today's wisdom. Come back later ✨</p></div> : <span className="text-9xl font-bold text-black" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.2)'}}>8</span> : <div className={`w-36 h-36 rounded-full bg-gradient-to-br ${t.window} flex items-center justify-center p-4 shadow-lg`} style={{animation: prefersReducedMotion ? 'fadeScale 0.5s ease-out' : 'fadeIn 0.6s ease-out'}}><p className="text-white text-center text-xs font-bold leading-tight">{answer}</p></div>}</div>
              {!isZen && <div className="absolute top-8 left-1/4 w-20 h-40 bg-gradient-to-br from-white to-transparent opacity-20 rounded-full blur-xl transform -rotate-45"></div>}
            </div>
          </div>
        </div>

        <div className="mt-16 space-y-4">{!showAnswer && !isLimited && <div className={`${isZen ? 'bg-white border-2 border-gray-300' : 'bg-white bg-opacity-10 border border-white border-opacity-20'} backdrop-blur-md rounded-2xl p-6 max-w-md mx-auto`}><p className={`${t.text} text-lg mb-2`}>💭 Think of your question...</p><p className={t.secondary}>Then click the mystic ball!</p></div>}{showAnswer && <div className={`bg-gradient-to-r ${getCategoryColor(category)} rounded-2xl p-8 max-w-lg mx-auto shadow-2xl transform hover:scale-105 transition-transform`} style={{animation: prefersReducedMotion ? 'fadeScale 0.5s ease-out' : 'fadeIn 0.6s ease-out'}}><div className="text-white text-sm font-semibold mb-3 opacity-90 flex items-center justify-center gap-2">{getCategoryIcon(category)} {category === 'motivational' ? 'MOTIVATIONAL' : category === 'wordOfTheDay' ? 'WORD WISDOM' : 'POETIC INSIGHT'}</div><p className="text-3xl font-bold text-white drop-shadow-lg">✨ {answer} ✨</p>{currentQuestion && <p className="text-sm text-white opacity-60 mt-4 italic">Your question: {currentQuestion}</p>}</div>}</div>
      </div>

      <style>{`
        @keyframes shake3d { 0%,100%{transform:translateX(0) translateY(0) rotateY(0) rotateX(0)} 10%{transform:translateX(-15px) translateY(-10px) rotateY(-15deg) rotateX(10deg)} 20%{transform:translateX(15px) translateY(10px) rotateY(15deg) rotateX(-10deg)} 30%{transform:translateX(-15px) translateY(-10px) rotateY(-15deg) rotateX(10deg)} 40%{transform:translateX(15px) translateY(10px) rotateY(15deg) rotateX(-10deg)} 50%{transform:translateX(-12px) translateY(-8px) rotateY(-12deg) rotateX(8deg)} 60%{transform:translateX(12px) translateY(8px) rotateY(12deg) rotateX(-8deg)} 70%{transform:translateX(-10px) translateY(-5px) rotateY(-10deg) rotateX(5deg)} 80%{transform:translateX(10px) translateY(5px) rotateY(10deg) rotateX(-5deg)} 90%{transform:translateX(-5px) translateY(-3px) rotateY(-5deg) rotateX(3deg)} }
        @keyframes handShakeLeft { 0%{transform:translateX(-100px) translateY(-50%) rotate(0); opacity:0} 20%{opacity:1} 50%{transform:translateX(20px) translateY(-50%) rotate(-10deg)} 100%{transform:translateX(-100px) translateY(-50%) rotate(0); opacity:0} }
        @keyframes handShakeRight { 0%{transform:translateX(100px) translateY(-50%) rotate(0); opacity:0} 20%{opacity:1} 50%{transform:translateX(-20px) translateY(-50%) rotate(10deg)} 100%{transform:translateX(100px) translateY(-50%) rotate(0); opacity:0} }
        @keyframes fadeIn { from{opacity:0; transform:scale(0.8) rotate(-5deg)} to{opacity:1; transform:scale(1) rotate(0)} }
        @keyframes fadeScale { from{opacity:0; transform:scale(0.9)} to{opacity:1; transform:scale(1)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
      `}</style>
    </div>
  );
}
