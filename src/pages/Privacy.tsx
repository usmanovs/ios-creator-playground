import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-10">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Introduction</h2>
            <p>
              Classic Games ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we handle information when you use our mobile application ("App"), which includes Pacman, Hangman, Snake, and Tetris.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Information We Collect</h2>
            <p>
              Our App is designed with your privacy in mind. We do <strong className="text-foreground">not</strong> collect, store, or share any personal information. The App does not require account creation, login, or any form of registration.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Data Storage</h2>
            <p>
              All game data, including scores and preferences, is stored locally on your device. We do not transmit any data to external servers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Third-Party Services</h2>
            <p>
              The App does not integrate any third-party analytics, advertising, or tracking services. We do not share any information with third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Children's Privacy</h2>
            <p>
              Our App does not collect personal information from anyone, including children under 13. The App is safe for users of all ages.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be reflected on this page with an updated revision date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <ul className="mt-2 space-y-1">
              <li>
                Email: <a href="mailto:support@getforce.org" className="text-primary hover:underline">support@getforce.org</a>
              </li>
              <li>
                Website: <a href="https://ios.getforce.org/support" className="text-primary hover:underline">ios.getforce.org/support</a>
              </li>
            </ul>
          </section>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-16">
          © {new Date().getFullYear()} Classic Games. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Privacy;
