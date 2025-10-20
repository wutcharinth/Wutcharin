# Wutcharin Thatan - Professional Portfolio

[![Live Demo](https://img.shields.io/badge/Live-wutcharin.com-06b6d4?style=for-the-badge)](https://wutcharin.com)
[![Deploy with Vercel](https://img.shields.io/badge/Deploy%20with-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Built with React](https://img.shields.io/badge/Built%20with-React-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org)

> Executive Leader in AI, Automation and Analytics | 20+ Years Experience | Bangkok, Thailand

A modern, visually stunning portfolio showcasing 20 years of expertise in AI, automation, and analytics. Built with React, TypeScript, and Vite, featuring infographic-style design, interactive animations, and comprehensive SEO optimization.

![Portfolio Preview](https://img.shields.io/badge/Status-Live-success?style=flat-square)

---

## ✨ Features

### 🎨 Visual Design
- **Infographic-Style Layout** - Modern, engaging design with visual storytelling
- **Animated Components** - Smooth transitions, hover effects, and interactive elements
- **Gradient Accents** - Cyan-to-blue gradient theme throughout
- **Responsive Design** - Perfect on desktop, tablet, and mobile devices
- **Dark Theme** - Professional dark background with cyan accents

### 📊 Key Sections

#### 🏠 Hero Section
- Full-screen landing with animated entrance
- Executive title and location (Bangkok, Thailand)
- 8 key skill pills with hover effects
- Compelling tagline and scroll indicator

#### 👤 Executive Profile
- **Stats Dashboard** with 4 key metrics:
  - 20+ Years Experience
  - 600+ Users Empowered
  - 100+ Dashboards Built
  - 60% Process Reduction
- Highlighted biographical text with colored borders
- Professional summary with emphasis on AI and transformation

#### 🚀 Career Highlights (6 Cards)
- AI-Powered Automation achievements
- End-to-End Analytics Platform deployment
- Machine Learning Models development
- Fundraising success (200M THB)
- Data-Driven Turnaround results
- Elite Team Building experience

#### 💼 Professional Experience
- **Interactive Timeline** with pulsing animations
- 5 Major companies featured:
  - Agoda (Global Travel Tech)
  - Really Cool Airlines (Airline Startup)
  - Thairath Group (Media Conglomerate)
  - Nok Air (Low-Cost Airline)
  - Thai Smile Airways (Regional Airline)
- Role details with visual hierarchy
- Duration pills with clock icons

#### 🎯 Projects
- **Really Cool Airlines** - Aviation startup leadership (Routes World 2023 speaker)
- **SplitBill AI** - 7-day build with Gemini AI (includes LinkedIn article link)
- **LocalGuide** - Startup MVP for booking platform
- Rapid prototyping expertise highlighted

#### 📧 Contact
- LinkedIn integration
- Email contact
- Resume download (PDF)

### 🔧 Technical Features

#### SEO & Discoverability
- **Comprehensive Meta Tags** - Title, description, keywords
- **Open Graph Protocol** - Rich social media previews
- **Twitter Cards** - Enhanced Twitter sharing
- **JSON-LD Schema** - Structured data for search engines
- **AI Search Optimization** - Optimized for ChatGPT, Claude, Perplexity
- **Sitemap & Robots.txt** - Search engine crawling configuration

#### PWA Support
- **Installable** - Add to home screen on mobile
- **Custom Icons** - Branded "WT" logo at multiple sizes
- **Manifest File** - Full Progressive Web App support
- **Offline Ready** - Service worker capabilities

#### Performance
- **Vite Build** - Lightning-fast builds and hot reload
- **Optimized Assets** - Minified JS, CSS, and HTML
- **Lazy Loading** - Components load on demand
- **Fast CDN** - Cloudflare CDN integration

---

## 🛠️ Technologies Used

### Core
- **React 19.2.0** - Modern UI library
- **TypeScript 5.8.2** - Type-safe development
- **Vite 6.2.0** - Next-generation build tool

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Custom Animations** - CSS keyframes and transitions
- **Gradient Effects** - Dynamic color schemes

### Deployment
- **Vercel** - Serverless deployment platform
- **Cloudflare** - DNS and CDN management
- **GoDaddy** - Domain registration

### Development
- **ESLint** - Code quality
- **Git** - Version control
- **npm** - Package management

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/wutcharinth/Wutcharin.git

# Navigate to project directory
cd Wutcharin

# Install dependencies
npm install

# Start development server
npm run dev
```

The site will be available at `http://localhost:3000`

### Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to production
vercel --prod
```

---

## 📁 Project Structure

```
Wutcharin/
├── components/           # React components
│   ├── Hero.tsx         # Landing hero section
│   ├── Header.tsx       # Sticky navigation
│   ├── ExecutiveProfile.tsx  # Profile with stats
│   ├── CareerHighlights.tsx  # Highlighted achievements
│   ├── Experience.tsx   # Work history timeline
│   ├── Projects.tsx     # Portfolio projects
│   ├── Contact.tsx      # Contact section
│   ├── Footer.tsx       # Footer component
│   ├── AnimatedSection.tsx   # Animation wrapper
│   └── icons/           # Custom SVG icons
├── public/              # Static assets
│   ├── Wutcharin_Thatan_Resume.pdf
│   ├── favicon.svg
│   ├── manifest.json
│   ├── robots.txt
│   └── sitemap.xml
├── index.html           # HTML template with SEO
├── index.tsx            # React entry point
├── App.tsx              # Main app component
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript config
└── package.json         # Dependencies
```

---

## 🎨 Design System

### Colors
- **Primary**: Cyan (#06b6d4)
- **Secondary**: Blue (#3b82f6)
- **Background**: Gray-900 (#111827)
- **Text**: Gray-200 to White
- **Accent**: Gradients (Cyan → Blue)

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 400, 500, 600, 700, 800, 900
- **Scale**: Responsive sizing with sm/md/lg breakpoints

### Spacing
- Consistent 4px base unit
- Section padding: py-16 to py-24
- Component gaps: 4, 6, 8, 10, 12

---

## 🌐 Deployment

### Custom Domain Setup (wutcharin.com)

1. **Cloudflare DNS Configuration**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   Proxy: ON
   
   Type: A
   Name: www
   Value: 76.76.21.21
   Proxy: ON
   ```

2. **Cloudflare SSL/TLS**
   - Mode: Full (strict)
   - Always Use HTTPS: ON
   - Automatic HTTPS Rewrites: ON

3. **Vercel Domain Setup**
   - Add domain in Vercel dashboard
   - Automatic SSL certificate generation
   - Production deployment on push to main

---

## 📱 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome)

---

## 📈 Performance

- **Lighthouse Score**: 95+ (Performance)
- **First Contentful Paint**: < 1s
- **Time to Interactive**: < 2s
- **Bundle Size**: ~220KB (gzipped)

---

## 🔒 Security

- HTTPS enforcement via Cloudflare
- Content Security Policy headers
- No sensitive data in frontend code
- Environment variables for API keys

---

## 📝 Content Updates

### Updating Content

1. **Profile Information**: Edit `components/ExecutiveProfile.tsx`
2. **Career Highlights**: Modify `components/CareerHighlights.tsx`
3. **Work Experience**: Update `components/Experience.tsx`
4. **Projects**: Edit `components/Projects.tsx`
5. **Skills**: Modify skill pills in `components/Hero.tsx`

### Updating Resume

Replace `public/Wutcharin_Thatan_Resume.pdf` with your updated PDF file.

### SEO Updates

Edit meta tags in `index.html` for title, description, and keywords.

---

## 🤝 Contributing

This is a personal portfolio, but feedback and suggestions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 About Me

**Wutcharin Thatan**  
Executive Leader in AI, Automation and Analytics  
Bangkok, Thailand

- 🌐 Website: [wutcharin.com](https://wutcharin.com)
- 💼 LinkedIn: [linkedin.com/in/Wutcharin](https://linkedin.com/in/Wutcharin)
- 📧 Email: wutcharin.th@gmail.com
- 📄 Resume: [Download PDF](https://wutcharin.com/Wutcharin_Thatan_Resume.pdf)

### Experience
- 20+ years in data & analytics leadership
- Speaker at Routes World 2023 (Istanbul)
- Featured in Aviation Week
- Built 100+ dashboards empowering 600+ users
- Expert in AI automation and LLM prototyping

---

## 🙏 Acknowledgments

- **React Team** - Amazing frontend framework
- **Vercel** - Excellent deployment platform
- **Tailwind CSS** - Beautiful utility-first styling
- **Cloudflare** - Reliable CDN and security
- **Google Fonts** - Inter font family

---

## 📞 Contact & Support

For inquiries about this portfolio or professional opportunities:

- 🌐 Visit: [wutcharin.com](https://wutcharin.com)
- 💼 Connect: [LinkedIn](https://linkedin.com/in/Wutcharin)
- 📧 Email: wutcharin.th@gmail.com

---

<div align="center">

**Built with ❤️ using React + TypeScript + Vite**

[![Live Demo](https://img.shields.io/badge/View-Live%20Demo-06b6d4?style=for-the-badge)](https://wutcharin.com)

</div>
