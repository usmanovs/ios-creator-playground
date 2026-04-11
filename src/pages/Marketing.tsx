import { Gamepad2, Ghost, Skull, Bug, Blocks, Zap, Feather, Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const games = [
  { name: 'Pacman', icon: Ghost, color: 'text-yellow-400', desc: 'Navigate the maze, eat the dots, and avoid the ghosts.' },
  { name: 'Hangman', icon: Skull, color: 'text-blue-400', desc: 'Guess the word before time runs out — a classic word game.' },
  { name: 'Snake', icon: Bug, color: 'text-green-400', desc: 'Grow your snake and chase the high score without hitting the walls.' },
  { name: 'Tetris', icon: Blocks, color: 'text-purple-400', desc: 'Stack and clear lines in the ultimate puzzle challenge.' },
];

const features = [
  { icon: Gamepad2, title: '4 Classic Games', desc: 'All your favorites in one app' },
  { icon: Zap, title: 'Simple Controls', desc: 'Intuitive touch-based gameplay' },
  { icon: Feather, title: 'Lightweight & Fast', desc: 'No bloat, instant load times' },
  { icon: Clock, title: 'Quick Play Sessions', desc: 'Perfect for anytime, anywhere' },
];

const Marketing = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-16">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Hero */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6">
            <Gamepad2 className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Classic Games</h1>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto mb-8">
            Rediscover the games you grew up with — now in your pocket.
          </p>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Enjoy a collection of timeless classics all in one place. Four iconic games designed for quick fun and simple gameplay.
          </p>
        </div>

        {/* Games */}
        <section className="mb-20">
          <h2 className="text-2xl font-semibold text-center mb-8">The Games</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {games.map((game) => (
              <div key={game.name} className="p-6 rounded-xl border border-border hover:bg-secondary/30 transition-colors">
                <game.icon className={`w-8 h-8 ${game.color} mb-3`} />
                <h3 className="text-lg font-semibold mb-1">{game.name}</h3>
                <p className="text-sm text-muted-foreground">{game.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mb-20">
          <h2 className="text-2xl font-semibold text-center mb-8">Features</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((f) => (
              <div key={f.title} className="text-center p-4">
                <f.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="font-medium text-sm mb-1">{f.title}</div>
                <div className="text-xs text-muted-foreground">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center mb-16">
          <a
            href="https://apps.apple.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            Download on the App Store
          </a>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} Classic Games. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Marketing;
