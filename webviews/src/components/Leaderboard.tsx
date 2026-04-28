import React from 'react';
import { Trophy, Medal, User } from 'lucide-react';

interface Props {
  scores: { member: string; score: number }[];
}

const Leaderboard: React.FC<Props> = ({ scores }) => {
  return (
    <div style={{
      width: '100%',
      maxWidth: '440px',
      background: 'rgba(15, 23, 42, 0.4)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '24px',
      borderRadius: '24px',
      fontFamily: 'monospace'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        marginBottom: '24px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        paddingBottom: '16px'
      }}>
        <Trophy style={{ color: '#3b82f6' }} size={20} />
        <h3 style={{
          fontSize: '18px',
          fontWeight: 900,
          letterSpacing: '0.1em',
          color: '#fff',
          textTransform: 'uppercase',
          margin: 0
        }}>Global Rankings</h3>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {scores.length > 0 ? (
          scores.map((s, index) => (
            <div 
              key={`${s.member}-${index}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: '12px',
                background: index === 0 ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                border: `1px solid ${index === 0 ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.05)'}`,
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ 
                  width: '24px', 
                  textAlign: 'center', 
                  fontWeight: 900, 
                  fontSize: '12px',
                  color: index === 0 ? '#3b82f6' : 'rgba(255, 255, 255, 0.3)' 
                }}>
                  {index + 1}.
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {index === 0 ? <Medal size={14} style={{ color: '#3b82f6' }} /> : <User size={14} style={{ color: 'rgba(255, 255, 255, 0.2)' }} />}
                  <span style={{ 
                    fontSize: '13px',
                    fontWeight: index === 0 ? 900 : 700,
                    color: index === 0 ? '#fff' : 'rgba(255, 255, 255, 0.7)'
                  }}>
                    {s.member}
                  </span>
                </div>
              </div>
              <span style={{ 
                fontSize: '14px',
                fontWeight: 900, 
                color: index === 0 ? '#3b82f6' : '#fff'
              }}>
                {s.score.toLocaleString()}
              </span>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '32px', color: 'rgba(255, 255, 255, 0.2)', fontStyle: 'italic', fontSize: '12px' }}>
            Retrieving encrypted data...
          </div>
        )}
      </div>
      
      <div style={{
        marginTop: '24px',
        fontSize: '9px',
        color: 'rgba(255, 255, 255, 0.2)',
        textAlign: 'right',
        textTransform: 'uppercase',
        fontWeight: 900,
        letterSpacing: '0.05em'
      }}>
        Verified by Devvit Redis Grid
      </div>
    </div>
  );
};

export default Leaderboard;
