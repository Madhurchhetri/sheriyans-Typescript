import React, { useState, useRef, useEffect } from 'react';
import { MessageItem } from '../components/MessageItem';
import { ChatInput } from '../components/ChatInput';

const generateDummyResponse = (prompt) => {
  return {
    id: Date.now(),
    problem: prompt,
    solution_1: `Here is a straightforward functional approach using modern syntax:\n\n\`\`\`javascript\nconst processData = (data) => {\n  return data.filter(item => item.active)\n             .map(item => ({...item, updated: true}));\n};\n\`\`\`\n\nThis uses built-in array methods which makes it declarative and easy to read.`,
    solution_2: `An alternative approach, using a \`for\` loop which can be faster for very large datasets:\n\n\`\`\`javascript\nfunction processData(data) {\n  const result = [];\n  for (let i = 0; i < data.length; i++) {\n    if (data[i].active) {\n      result.push({\n        ...data[i],\n        updated: true\n      });\n    }\n  }\n  return result;\n}\n\`\`\`\n\nThis is slightly more imperative but avoids creating intermediate arrays.`,
    judge: {
      solution_1_score: 9,
      solution_2_score: 7,
      solution_1_reasoning: "Solution 1 acts as a highly idiomatic React/JS snippet emphasizing readability. The `filter` and `map` methods properly encapsulate the logic cleanly.",
      solution_2_reasoning: "Solution 2 is technically sound and might squeeze out better performance, but it's overly verbose for modern codebases unless proven to be a bottleneck."
    }
  };
};

const App = () => {
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const bottomRef = useRef(null);

  const handleSendMessage = (prompt) => {
    setIsProcessing(true);
    // Simulate network delay
    setTimeout(() => {
      const response = generateDummyResponse(prompt);
      setMessages(prev => [...prev, response]);
      setIsProcessing(false);
    }, 1500);
  };

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isProcessing]);

  return (
    <div className="min-h-screen relative pb-32">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-surface/80 backdrop-blur-xl border-b border-surface-dim px-8 py-5">
        <h1 className="text-xl font-extrabold text-primary flex items-center gap-2">
          <span>Intelligent Canvas</span>
        </h1>
      </header>
      
      {/* Messages */}
      <main className="px-6 sm:px-12 md:px-24">
        {messages.length === 0 ? (
          <div className="h-[70vh] flex items-center justify-center flex-col text-center opacity-60">
            <h2 className="text-3xl font-display font-semibold mb-4 text-primary">Ready for Evaluation</h2>
            <p className="text-text-sub max-w-md mx-auto line-height-relaxed">
              Enter your problem or prompt below. The system will synthesize two competing solutions and offer a judicial recommendation.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-8 pb-12">
            {messages.map((msg) => (
              <MessageItem key={msg.id} message={msg} />
            ))}
            {isProcessing && (
              <div className="w-full max-w-6xl mx-auto py-12 flex justify-center opacity-50">
                 <div className="animate-pulse flex items-center gap-2 text-primary font-medium tracking-widest uppercase text-sm">
                   <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
                   <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-75"></div>
                   <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-150"></div>
                   <span className="ml-2">Analyzing models...</span>
                 </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </main>

      <ChatInput onSendMessage={handleSendMessage} isProcessing={isProcessing} />
    </div>
  );
}

export default App;