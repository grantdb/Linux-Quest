import { Devvit } from '@devvit/public-api';

Devvit.configure({
  redditAPI: true,
  redis: true,
});

Devvit.addCustomPostType({
  name: 'Linux Quest',
  height: 'tall',
  render: (context) => {
    const onMessage = async (message: any) => {
      if (message.type === 'READY') {
        const scores = await context.redis.zRange('leaderboard', 0, 4, { by: 'rank', reverse: true });
        const initLeaderboard = scores.map(s => ({ member: s.member, score: s.score }));
        context.ui.webView.postMessage('my-app', { type: 'INITIAL_STATE', data: { leaderboard: initLeaderboard } });
      }
      if (message.type === 'GAME_COMPLETE') {
        const { score } = message.data;
        const user = await context.reddit.getCurrentUser();
        const username = user?.username || 'Guest';
        await context.redis.zAdd('leaderboard', { member: username, score: score });
        const updatedScores = await context.redis.zRange('leaderboard', 0, 4, { by: 'rank', reverse: true });
        const newLeaderboard = updatedScores.map(s => ({ member: s.member, score: s.score }));
        context.ui.webView.postMessage('my-app', { type: 'LEADERBOARD_UPDATE', data: { leaderboard: newLeaderboard } });
        context.ui.showToast(`Installation complete! Score: ${score}`);
      }
    };

    const launchGame = () => {
      context.ui.showWebView({
        url: 'index.html',
        onMessage: (msg) => onMessage(msg),
      });
    };

    return (
      <vstack height="100%" width="100%" alignment="middle center">
        <zstack width="100%" height="100%" alignment="middle center">
            <image
                url="https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&q=80&w=1200"
                imageHeight={800}
                imageWidth={1200}
                height="100%"
                width="100%"
                resizeMode="cover"
            />
            <vstack alignment="middle center" gap="medium" backgroundColor="rgba(0,0,0,0.8)" height="100%" width="100%" padding="large">
                <text size="xxlarge" weight="bold" color="#00ff41" shadow="low">LINUX QUEST</text>
                <text size="large" color="#00ff41">Can you survive the kernel panic?</text>
                <spacer size="medium" />
                <button 
                    appearance="primary" 
                    icon="play-fill"
                    size="large"
                    onPress={launchGame}
                >
                    BOOT SYSTEM
                </button>
            </vstack>
        </zstack>
      </vstack>
    );
  },
});

// Add a menu item to create the game post
Devvit.addMenuItem({
  label: 'Create Linux Quest Post',
  location: 'subreddit',
  onPress: async (_event, context) => {
    const { reddit, ui } = context;
    const subreddit = await reddit.getCurrentSubreddit();
    await reddit.submitPost({
      title: 'Linux Quest: Can you install it?',
      subredditName: subreddit.name,
      preview: (
        <vstack alignment="middle center" height="100%" width="100%" gap="medium">
          <text size="xlarge" weight="bold" color="#00ff41">LINUX QUEST</text>
          <text>Loading virtual machine...</text>
        </vstack>
      ),
    });
    ui.showToast('Linux Quest post created!');
  },
});

export default Devvit;
