import React from 'react';
import { Trophy, Medal, User } from 'lucide-react';

interface Props {
  scores: { member: string; score: number }[];
}

const Leaderboard: React.FC<Props> = ({ scores }) => {
  return (
    <div className="w-full max-w-md bg-terminal-dim/10 border-2 border-terminal-dim p-6 rounded-lg font-mono">
      <div className="flex items-center justify-center space-x-2 mb-6 border-b border-terminal-dim pb-4">
        <Trophy className="text-terminal-bright w-5 h-5" />
        <h3 className="text-xl font-bold tracking-widest text-terminal-bright uppercase">Global Rankings</h3>
      </div>
      
      <div className="space-y-4">
        {scores.length > 0 ? (
          scores.map((s, index) => (
            <div 
              key={`${s.member}-${index}`}
              className={`flex items-center justify-between p-3 border ${
                index === 0 ? 'border-terminal-bright bg-terminal-bright/5' : 'border-terminal-dim/30'
              }`}
            >
              <div className="flex items-center space-x-4">
                <span className={`w-6 text-center font-bold ${index === 0 ? 'text-terminal-bright' : 'text-terminal-dim'}`}>
                  {index + 1}.
                </span>
                <div className="flex items-center space-x-2">
                  {index === 0 ? <Medal className="w-4 h-4 text-terminal-bright" /> : <User className="w-4 h-4 text-terminal-dim" />}
                  <span className={index === 0 ? 'text-terminal-bright font-bold' : 'text-terminal-green/80'}>
                    {s.member}
                  </span>
                </div>
              </div>
              <span className={`font-bold ${index === 0 ? 'text-terminal-bright' : 'text-terminal-green'}`}>
                {s.score.toLocaleString()}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-terminal-dim italic select-none">
            Retrieving encrypted data...
          </div>
        )}
      </div>
      
      <div className="mt-6 text-[10px] text-terminal-dim text-right uppercase tracking-tighter">
        Verified by Devvit Redis Grid
      </div>
    </div>
  );
};

export default Leaderboard;
