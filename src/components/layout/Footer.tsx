// ========================================
// Footer Component
// ========================================
import { Link } from 'react-router-dom';
import { BookOpen, ExternalLink, MessageCircle, Mail, Heart } from 'lucide-react';

export function Footer() {
  const footerLinks = {
    Product: [
      { label: 'Browse Papers', path: '/browse' },
      { label: 'Upload', path: '/upload' },
      { label: 'Trending', path: '/browse?sort=trending' },
      { label: 'Categories', path: '/browse' },
    ],
    Resources: [
      { label: 'Help Center', path: '#' },
      { label: 'Guidelines', path: '#' },
      { label: 'API Docs', path: '#' },
      { label: 'Status', path: '#' },
    ],
    Company: [
      { label: 'About', path: '#' },
      { label: 'Blog', path: '#' },
      { label: 'Careers', path: '#' },
      { label: 'Contact', path: '#' },
    ],
    Legal: [
      { label: 'Privacy', path: '#' },
      { label: 'Terms', path: '#' },
      { label: 'Cookies', path: '#' },
      { label: 'DMCA', path: '#' },
    ],
  };

  return (
    <footer className="border-t border-themed mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-[#64D2FF] flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-primary">
                Study<span className="text-accent">Stack</span>
              </span>
            </Link>
            <p className="text-sm text-secondary leading-relaxed mb-4">
              The premium platform for students to find, share, and access study materials.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="p-2 rounded-lg text-tertiary hover:text-primary hover:bg-[var(--color-bg-tertiary)] transition-colors">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg text-tertiary hover:text-primary hover:bg-[var(--color-bg-tertiary)] transition-colors">
                <ExternalLink className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg text-tertiary hover:text-primary hover:bg-[var(--color-bg-tertiary)] transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-primary mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-sm text-secondary hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-themed flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-tertiary">
            © {new Date().getFullYear()} StudyStack. All rights reserved.
          </p>
          <p className="text-xs text-tertiary flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-[var(--color-error)] fill-current" /> for students everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
