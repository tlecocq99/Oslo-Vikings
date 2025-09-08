# Oslo Vikings - Norwegian American Football Team Website

A modern, responsive website for the Oslo Vikings American Football team built with Next.js 14 and TypeScript

## 🏈 Features

- **Modern Next.js 14 Application** with App Router and TypeScript
- **Responsive Design** optimized for desktop, tablet, and mobile
- **Norwegian Viking-themed Design** with authentic color scheme
- **Complete Team Management** with player profiles and roster
- **News & Blog System** for team updates and game recaps
- **Game Schedule & Results** tracking
- **SEO Optimized** with Next.js metadata API
- **Accessibility Compliant** (WCAG 2.1 AA standards)

## 🎨 Design System

### Color Palette
- **Viking Red**: `#C41E3A` - Primary brand color
- **Viking Red Dark**: `#8B1538` - Darker variant for depth
- **Viking Gold**: `#FFD700` - Accent color for highlights
- **Viking Gold Dark**: `#B8860B` - Darker gold variant
- **Viking Silver**: `#C0C0C0` - Secondary accent
- **Viking Charcoal**: `#1F2937` - Text and contrast color

### Typography
- **Primary Font**: Inter (Google Fonts)
- **Display**: Bold weights for headings
- **Body**: Regular and medium weights for content

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd oslo-vikings-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
oslo-vikings-website/
├── app/                          # Next.js App Router
│   ├── components/              # App components
│   │   ├── Hero.tsx            # Hero section component
│   │   ├── PlayerCard.tsx      # Player profile cards
│   │   ├── NewsCard.tsx        # News article cards
│   │   ├── GameCard.tsx        # Game schedule cards
│   │   ├── Page.tsx            # Page wrapper component
│   │   ├── Navigation.tsx      # Site navigation
│   │   └── Footer.tsx          # Site footer
│   ├── lib/                    # Utility functions    
│   ├── about/                  # About page
│   ├── contact/                # Contact page
│   ├── news/                   # News listing page
│   ├── schedule/               # Schedule page
│   ├── team/                   # Team roster page
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│
├── components/ui/               # shadcn/ui components
├── lib/                        # Shared utilities
│   └── utils.ts               # Utility functions
├── public/                     # Static assets
├── tailwind.config.ts          # Tailwind configuration
├── next.config.js              # Next.js configuration
└── package.json                # Dependencies
```


### Content Types

1. **Page** - Basic page structure
2. **Hero** - Hero section with title, subtitle, and CTA
3. **Player Card** - Individual player profiles
4. **News Card** - News articles and blog posts
5. **Game Card** - Game schedules and results

### Component Mapping

```typescript
const components = {
  page: Page,
  hero: Hero,
  player_card: PlayerCard,
  news_card: NewsCard,
  game_card: GameCard,
};


## 🎨 Styling & Theming

### Tailwind CSS Configuration

Custom colors and utilities are defined in `tailwind.config.ts`:

```typescript
colors: {
  viking: {
    red: '#C41E3A',
    'red-dark': '#8B1538',
    gold: '#FFD700',
    'gold-dark': '#B8860B',
    silver: '#C0C0C0',
    charcoal: '#1F2937',
  }
}
```

### Custom CSS Classes

- `.oslo-gradient` - Viking-themed gradient background
- `.norse-pattern` - Subtle Nordic pattern overlay
- `.hero-text-shadow` - Text shadow for hero sections
- `.animate-fadeInUp` - Fade-in animation

## 📱 Responsive Design

The website is fully responsive with breakpoints:
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: 1024px+

Key responsive features:
- Collapsible navigation menu
- Flexible grid layouts
- Optimized typography scaling
- Touch-friendly interactive elements

## ♿ Accessibility

The website follows WCAG 2.1 AA standards:
- Semantic HTML structure
- Proper heading hierarchy
- Alt text for images
- Keyboard navigation support
- Sufficient color contrast ratios
- Screen reader compatibility

## 🔧 Performance Optimizations

- **Next.js Image Optimization** for automatic image optimization
- **Static Generation** for improved loading times
- **Code Splitting** with dynamic imports
- **Lazy Loading** for images and components
- **Font Optimization** with Google Fonts

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Add environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

Build command: `npm run build`
Output directory: `.next`

## 🎮 Content Management

### Adding New Content

1. **Log into Googlesheets**
2. **Fill in content** fields
3. **Will automatically** go live on website

### Content Types Guide

#### Player Cards
- **Name**: Player's full name
- **Position**: Playing position
- **Number**: Jersey number
- **Height/Weight**: Physical stats
- **Bio**: Player description
- **Photo**: Player image (optional)

#### News Articles
- **Title**: Article headline
- **Excerpt**: Brief summary
- **Author**: Article author
- **Date**: Publication date
- **Category**: Article category
- **Image**: Featured image
- **Slug**: URL slug for article

#### Game Cards
- **Home Team**: Home team name
- **Away Team**: Away team name
- **Date/Time**: Game date and time
- **Location**: Venue location
- **Status**: upcoming/live/completed
- **Scores**: Final scores (if completed)

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Customizing Styles

1. **Update** `tailwind.config.ts` for theme changes
2. **Modify** `globals.css` for global styles
3. **Use** Tailwind classes in components

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🏈 About Oslo Vikings

The Oslo Vikings are Norway's premier American Football team, representing Norwegian values of teamwork, perseverance, and community excellence. Founded in 2010, the team has grown to become a championship-winning organization dedicated to promoting American football in Norway.

## 📞 Support

For technical support or questions about the website:
- **Email**: tech@oslovikings.no
- **Next.js Docs**: [Next.js Documentation](https://nextjs.org/docs)

---

**Built with ❤️ for the Oslo Vikings community**