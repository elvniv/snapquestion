import React, { useState } from 'react';
import { Analytics } from "@vercel/analytics/react";

// Constants
const CUSTOM_CURSOR_STYLE = {
  cursor: 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTI1IDI1TDcgN003IDdIMjVNNyA3VjI1IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K") 16 16, auto'
};

const PRICING_PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 199,
    yearlyPrice: 2148, // 10% off annually
    storage: '1,000 resolutions/month',
    description: 'Perfect for getting started',
    features: [
      'Widget + email triage',
      'Basic AI responses',
      'Text-only support',
      'Standard support'
    ],
    buttonText: 'Try Your Manual Now',
    buttonStyle: 'bg-gray-600 text-white hover:bg-gray-700',
    cardStyle: 'bg-gray-100/50 backdrop-blur-sm border border-gray-300',
    isPopular: false,
    isAvailable: true
  },
  {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 499,
    yearlyPrice: 5390, // 10% off annually  
    storage: '10,000 resolutions/month',
    description: 'Most Popular - for growing teams',
    features: [
      'Screenshot/photo support',
      'All integrations (Zendesk, Intercom, Slack)',
      'Advanced analytics',
      'Priority support'
    ],
    buttonText: 'Try Your Manual Now',
    buttonStyle: 'bg-blue-600 text-white hover:bg-blue-500',
    cardStyle: 'bg-gradient-to-b from-blue-600/20 to-blue-800/20 backdrop-blur-sm border border-blue-500 transform scale-105',
    isPopular: true,
    isAvailable: true
  },
  {
    id: 'scale',
    name: 'Scale',
    monthlyPrice: 1500,
    yearlyPrice: 16200, // 10% off annually
    storage: 'Custom limits',
    description: 'For enterprise teams',
    features: [
      'White-label options',
      'SSO integration',
      'Custom SLAs',
      'Priority support & success manager'
    ],
    buttonText: 'Scale Your Support',
    buttonStyle: 'bg-gray-600 text-white hover:bg-gray-700',
    cardStyle: 'bg-gray-100/50 backdrop-blur-sm border border-gray-300',
    isPopular: false,
    isAvailable: true
  }
];

const FLOATING_ELEMENTS = [
  {
    id: 'support1',
    content: '📊',
    alt: 'Analytics dashboard',
    className: 'absolute top-20 left-6 w-16 h-20 sm:w-32 sm:h-40 md:top-24 md:left-8 md:w-56 md:h-72 rotate-6 sm:rotate-3 z-10 opacity-30 sm:opacity-8 md:opacity-22',
    animation: 'float1 8s ease-in-out infinite',
    delay: '0s',
    icon: 'check'
  },
  {
    id: 'chat',
    content: '💬',
    alt: 'Chat support',
    className: 'absolute top-12 right-8 w-20 h-14 sm:w-40 sm:h-24 md:top-16 md:right-4 md:w-64 md:h-40 -rotate-4 sm:-rotate-2 z-10 opacity-30 sm:opacity-8 md:opacity-18',
    animation: 'float2 10s ease-in-out infinite',
    delay: '2s',
    icon: 'play'
  },
  {
    id: 'ai',
    content: '🤖',
    alt: 'AI assistant',
    className: 'absolute top-[18rem] left-4 w-14 h-18 sm:w-28 sm:h-36 md:top-[22rem] md:left-2 md:w-52 md:h-64 rotate-3 sm:rotate-1 z-10 opacity-35 sm:opacity-15 md:opacity-22',
    animation: 'float3 12s ease-in-out infinite',
    delay: '4s',
    icon: 'heart'
  },
  {
    id: 'docs',
    content: '📚',
    alt: 'Documentation',
    className: 'absolute top-[19rem] right-6 w-16 h-10 sm:w-36 sm:h-20 md:top-[24rem] md:right-4 md:w-60 md:h-36 rotate-4 sm:rotate-2 z-10 opacity-35 sm:opacity-15 md:opacity-16',
    animation: 'float4 9s ease-in-out infinite',
    delay: '1s',
    icon: 'camera'
  },
  {
    id: 'integration',
    content: '🔗',
    alt: 'Integrations',
    className: 'absolute bottom-16 left-1/2 transform -translate-x-1/2 translate-x-8 w-12 h-16 sm:w-28 sm:h-36 md:bottom-20 md:translate-x-16 md:w-48 md:h-60 -rotate-5 sm:-rotate-3 z-10 opacity-25 sm:opacity-8 md:opacity-17',
    animation: 'float5 11s ease-in-out infinite',
    delay: '3s',
    icon: 'palette'
  }
];

const scrollToPricing = (e) => {
  e.preventDefault();
  document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' });
};

// Utility functions - SQ logo
const ArrowDots = ({ size = 'text-xs', color = 'text-gray-900' }) => (
  <div className={`${size} ${color} font-bold bg-gray-200/50 backdrop-blur-sm rounded-full w-6 h-6 flex items-center justify-center`}>
    SQ
  </div>
);

const IconComponent = ({ type, className = "w-6 h-6 text-gray-900" }) => {
  const icons = {
    check: (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
    play: (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z"/>
      </svg>
    ),
    heart: (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
      </svg>
    ),
    camera: (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 9a2 2 0 012-2h.93l.82-1.64A2 2 0 018.93 4h6.14a2 2 0 011.98 1.36L17.07 7H18a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V9z"/>
        <path d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
    ),
    palette: (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3H5v10h2V3zM19 21a2 2 0 01-2-2V5a4 4 0 014-4v2a2 2 0 00-2 2v12a2 2 0 002 2v2z"/>
      </svg>
    )
  };
  return icons[type] || icons.check;
};

const FloatingElement = ({ element }) => (
  <div 
    className={element.className} 
    style={{ 
      animation: element.animation,
      animationDelay: element.delay
    }}
  >
    <div className="relative w-full h-full bg-gray-200 rounded-lg overflow-hidden shadow-2xl">
      <div className="w-full h-full flex items-center justify-center text-4xl md:text-6xl">
        {element.content}
      </div>
      <div className="absolute inset-0 bg-white/20 sm:bg-white/10 md:bg-white/5"></div>
      
      <div className="absolute top-1 right-1 sm:top-2 sm:right-2 md:top-4 md:right-4">
        <IconComponent type={element.icon} />
      </div>
    </div>
  </div>
);

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Mobile Logo */}
        <div className="md:hidden bg-gray-200/50 backdrop-blur-sm rounded-full px-4 py-2">
          <span className="text-sm font-medium text-gray-900">S N A P Q U E S T I O N</span>
        </div>
        
        {/* Desktop Logo */}
        <div className="hidden md:flex items-center space-x-2 bg-gray-200/50 backdrop-blur-sm rounded-full px-6 py-2">
          <span className="text-lg font-medium tracking-[0.15em] text-gray-900">S N A P Q U E S T I O N</span>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-full bg-gray-200/50 backdrop-blur-sm text-gray-900"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Desktop Navigation */}
        <div 
          className="hidden md:flex bg-gray-200/50 backdrop-blur-sm rounded-full px-8 py-3 items-center space-x-8"
          style={{
            animation: 'navFloat2 8s ease-in-out infinite',
            animationDelay: '1s'
          }}
        >
          <ArrowDots />
          <a href="#demo" className="text-gray-700 hover:text-gray-900 transition-colors">Demo</a>
          <a href="#how-it-works" className="text-gray-700 hover:text-gray-900 transition-colors">How It Works</a>
          <a href="#pricing" className="text-gray-700 hover:text-gray-900 transition-colors" onClick={scrollToPricing}>Pricing</a>
          <button 
            onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
            className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-500 transition-colors"
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-4 right-4 mt-2 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-6 space-y-2">
            <a 
              href="#demo" 
              className="block text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all py-3 px-4 rounded-xl"
              onClick={() => setMobileMenuOpen(false)}
            >
              Demo
            </a>
            <a 
              href="#how-it-works" 
              className="block text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all py-3 px-4 rounded-xl"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </a>
            <a 
              href="#pricing" 
              className="block text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all py-3 px-4 rounded-xl"
              onClick={(e) => { 
                scrollToPricing(e); 
                setMobileMenuOpen(false); 
              }}
            >
              Pricing
            </a>
            <div className="pt-2 mt-2 border-t border-gray-200">
              <button 
                onClick={() => {
                  document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
                  setMobileMenuOpen(false);
                }}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-500 transition-colors font-medium"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

const HeroSection = () => (
  <section className="min-h-[90vh] sm:min-h-[85vh] md:min-h-screen pt-24 sm:pt-28 md:pt-32 pb-4 sm:pb-8 md:pb-16 px-4 sm:px-6 md:px-8 relative">
    <div className="max-w-7xl mx-auto relative">
      {FLOATING_ELEMENTS.map(element => (
        <FloatingElement key={element.id} element={element} />
      ))}

      <div className="text-center z-30 relative pt-12 sm:pt-24 md:pt-40">
        <p className="text-gray-900 text-xs sm:text-base md:text-lg mb-3 sm:mb-4 md:mb-6 px-4 font-medium tracking-wider" style={{ textShadow: '0 0 20px rgba(0, 0, 0, 0.1)' }}>
          S N A P Q U E S T I O N
        </p>
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light tracking-tight mb-4 sm:mb-6 lg:mb-8 px-2 leading-tight" style={{ textShadow: '0 0 40px rgba(0, 0, 0, 0.1)' }}>
          Your Support Team, <br className="sm:hidden" />
          Supercharged by AI
        </h1>
        <div className="max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto mb-6 sm:mb-8 md:mb-10 lg:mb-12 px-4">
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed" style={{ textShadow: '0 0 16px rgba(0, 0, 0, 0.1)' }}>
            Cut repetitive support tickets by 70% without hiring more agents.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center space-y-3 px-4">
          <button 
            className="w-full max-w-xs sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white rounded-full text-base sm:text-lg hover:bg-blue-500 transition-colors font-medium" 
            style={{ boxShadow: '0 0 30px rgba(37, 99, 235, 0.7)' }}
            onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
          >
            Upload Your Docs, Be Live Tomorrow
          </button>
          <p className="text-xs sm:text-sm text-gray-600">no credit card required</p>
        </div>
      </div>

      <FloatingAnimationStyles />
    </div>
  </section>
);

const HowItWorksSection = () => (
  <section id="how-it-works" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 bg-gray-50" aria-labelledby="how-it-works-title">
    <div className="max-w-6xl mx-auto text-center">
      <h2 id="how-it-works-title" className="text-2xl sm:text-3xl md:text-4xl font-light mb-8">How Snap Question Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="text-gray-900 font-medium mb-1">1. Upload your knowledge</h3>
          <p className="text-gray-700 text-sm">Drop in PDFs, manuals, product guides, and sample screenshots.</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="text-gray-900 font-medium mb-1">2. Connect your channels</h3>
          <p className="text-gray-700 text-sm">Add our widget to your site or plug into Zendesk, Intercom, Slack, or email.</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="text-gray-900 font-medium mb-1">3. Let AI handle the routine</h3>
          <p className="text-gray-700 text-sm">Customers type a question or upload a photo and AI finds the answer from your own content.</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="text-gray-900 font-medium mb-1">4. Escalate when needed</h3>
          <p className="text-gray-700 text-sm">If AI can't answer, it routes the ticket (with context) to your human agents.</p>
        </div>
      </div>
    </div>
  </section>
);

const BenefitsSection = () => (
  <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8">
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="text-3xl font-bold text-blue-600 mb-2">70%</div>
          <div className="text-gray-900 font-medium mb-1">Deflect tickets with AI</div>
          <div className="text-gray-600 text-sm">trained on your docs</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="text-3xl font-bold text-blue-600 mb-2">5 sec</div>
          <div className="text-gray-900 font-medium mb-1">Answer text & screenshots</div>
          <div className="text-gray-600 text-sm">in seconds, not hours</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="text-3xl font-bold text-blue-600 mb-2">24 hrs</div>
          <div className="text-gray-900 font-medium mb-1">Go live in under 24 hours</div>
          <div className="text-gray-600 text-sm">no complex setup</div>
        </div>
      </div>
    </div>
  </section>
);

const AudienceSection = () => (
  <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 bg-gray-50" aria-labelledby="audience-title">
    <div className="max-w-6xl mx-auto">
      <h2 id="audience-title" className="text-2xl sm:text-3xl md:text-4xl font-light text-center mb-8">Who Snap Question Is For</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="text-gray-900 font-medium">Field service companies</h3>
          <div className="text-gray-700 text-sm">HVAC, generators, commercial kitchens</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="text-gray-900 font-medium">Industrial/parts distributors</h3>
          <div className="text-gray-700 text-sm">Complex product catalogs and technical specifications</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="text-gray-900 font-medium">Complex B2B SaaS teams</h3>
          <div className="text-gray-700 text-sm">Multi-feature platforms with extensive documentation</div>
        </div>
      </div>
    </div>
  </section>
);

const PricingToggle = ({ billingCycle, setBillingCycle }) => (
  <div className="flex items-center justify-center mb-6 sm:mb-8 md:mb-10 lg:mb-12 px-4">
    <div className="bg-gray-200/50 backdrop-blur-sm rounded-full p-1 border border-gray-300 w-full max-w-sm sm:w-auto">
      <div className="flex">
        <button 
          onClick={() => setBillingCycle('annual')}
          className={`flex-1 sm:flex-none px-3 sm:px-4 md:px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
            billingCycle === 'annual' 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
          style={billingCycle === 'annual' ? { boxShadow: '0 0 20px rgba(37, 99, 235, 0.5)' } : {}}
        >
          <span className="hidden sm:inline">Annual (Save ~20%)</span>
          <span className="sm:hidden">Annual</span>
        </button>
        <button 
          onClick={() => setBillingCycle('monthly')}
          className={`flex-1 sm:flex-none px-3 sm:px-4 md:px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
            billingCycle === 'monthly' 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
          style={billingCycle === 'monthly' ? { boxShadow: '0 0 20px rgba(37, 99, 235, 0.5)' } : {}}
        >
          Monthly
        </button>
      </div>
    </div>
  </div>
);

const PricingCard = ({ plan, billingCycle }) => (
  <div className={`${plan.cardStyle} rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 relative overflow-hidden`}>
    {plan.isPopular && (
      <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
        <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">Popular</span>
      </div>
    )}
    <div className="relative z-10">
      <h3 className="text-lg sm:text-xl font-light mb-3 sm:mb-4 text-gray-900">{plan.name}</h3>
      <div className="mb-4 sm:mb-5 md:mb-6">
        <div className="flex items-baseline">
          <span className="text-2xl sm:text-3xl font-light text-gray-900">
            ${billingCycle === 'annual' ? Math.round((plan.yearlyPrice / 12) * 100) / 100 : plan.monthlyPrice}
          </span>
          <span className="text-gray-600 ml-1 text-sm sm:text-base">/mo</span>
        </div>
        {billingCycle === 'annual' ? (
          <div>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">${plan.yearlyPrice} billed yearly</p>
            {plan.monthlyPrice > 0 && (
              <p className="text-xs sm:text-sm text-green-600 mt-1">Save ${((plan.monthlyPrice * 12) - plan.yearlyPrice).toFixed(2)}/year ({Math.round(((plan.monthlyPrice * 12 - plan.yearlyPrice) / (plan.monthlyPrice * 12)) * 100)}% off)</p>
            )}
          </div>
        ) : (
          <p className="text-xs sm:text-sm text-gray-600 mt-1">Billed monthly</p>
        )}
      </div>
      <div className="mb-4 sm:mb-5 md:mb-6">
        <div className="text-blue-500 text-xl sm:text-2xl font-light mb-1">{plan.storage}</div>
        <p className="text-gray-600 text-xs sm:text-sm">{plan.description}</p>
      </div>
      <ul className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-5 md:mb-6 text-gray-700 text-xs sm:text-sm">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      {plan.isAvailable ? (
        <button 
          className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 md:py-2 rounded-full text-xs sm:text-sm transition-colors ${plan.buttonStyle} font-medium whitespace-nowrap`}
          style={plan.isPopular ? { boxShadow: '0 0 20px rgba(37, 99, 235, 0.5)' } : {}}
        >
          {plan.buttonText}
        </button>
      ) : (
        <div className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 md:py-2 rounded-full text-xs sm:text-sm text-center font-medium ${plan.buttonStyle} whitespace-nowrap`}>
          {plan.buttonText}
        </div>
      )}
    </div>
  </div>
);

const PricingSection = () => {
  const [billingCycle, setBillingCycle] = useState('annual');

  return (
    <section id="pricing" className="py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 md:px-8 bg-gray-100 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-12 md:mb-16 lg:mb-20">
          <div className="flex items-center justify-center mb-3 sm:mb-4 md:mb-6">
            <ArrowDots size="w-1.5 h-1.5" color="bg-blue-500" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light mb-4 sm:mb-6 md:mb-8 leading-tight px-2" style={{ textShadow: '0 0 40px rgba(0, 0, 0, 0.1)' }}>
            Pricing
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed px-4" style={{ textShadow: '0 0 16px rgba(0, 0, 0, 0.1)' }}>
            Public & Simple. Start free - upgrade when you're ready.
          </p>
        </div>

        <PricingToggle billingCycle={billingCycle} setBillingCycle={setBillingCycle} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10 md:mb-12">
          {PRICING_PLANS.map(plan => (
            <PricingCard key={plan.id} plan={plan} billingCycle={billingCycle} />
          ))}
        </div>

        <div className="flex justify-center mb-20">
          <div className="flex flex-col justify-center items-center text-center py-4">
            <h3 className="text-xl font-light mb-2" style={{ textShadow: '0 0 20px rgba(0, 0, 0, 0.1)' }}>Questions?</h3>
            <p className="text-gray-700 mb-2">Contact us at</p>
            <a 
              href="mailto:support@snapquestion.com" 
              className="text-blue-500 hover:text-blue-400 transition-colors font-medium"
              style={{ textShadow: '0 0 20px rgba(37, 99, 235, 0.7)' }}
            >
              support@snapquestion.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const ProductDemoSection = () => {
  const [currentStep, setCurrentStep] = useState('question');
  const [chatMessages, setChatMessages] = useState([
    {
      type: 'user',
      message: "My HVAC unit isn't cooling properly. The compressor seems to be running but no cold air is coming out.",
      timestamp: '2:34 PM'
    }
  ]);

  const demoSteps = {
    question: {
      title: 'Customer Question',
      description: 'Customer submits question via widget, email, or uploads a photo'
    },
    processing: {
      title: 'AI Processing',
      description: 'AI searches through your knowledge base and manuals'
    },
    response: {
      title: 'Instant Response',
      description: 'AI provides detailed answer with relevant manual sections'
    }
  };

  const handleDemoStep = (step) => {
    setCurrentStep(step);
    if (step === 'processing') {
      setTimeout(() => setCurrentStep('response'), 2000);
    }
    if (step === 'response') {
      setChatMessages([
        ...chatMessages,
        {
          type: 'ai',
          message: 'I found the solution in your HVAC manual. This sounds like a refrigerant issue or a blocked evaporator coil.',
          timestamp: '2:34 PM',
          source: 'HVAC_Manual_Section_4.2.pdf',
          confidence: '94%',
          suggestions: [
            'Check refrigerant levels',
            'Inspect evaporator coils for ice buildup',
            'Verify thermostat settings'
          ]
        }
      ]);
    }
  };

  return (
    <section id="demo" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 bg-gray-50" aria-labelledby="demo-title">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 id="demo-title" className="text-2xl sm:text-3xl md:text-4xl font-light mb-4">Watch the Magic ✨</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Customer uploads screenshot, AI finds answer in your docs, ticket resolved
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Demo Widget */}
          <div className="order-2 lg:order-1">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
              {/* Widget Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 sm:px-6 py-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">SQ</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-sm sm:text-base">S N A P Q U E S T I O N</h3>
                      <p className="text-xs text-blue-100">AI Support Assistant</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-xs text-blue-100">Online</span>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="h-64 sm:h-80 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs sm:max-w-sm lg:max-w-xs xl:max-w-sm ${
                      msg.type === 'user' 
                        ? 'bg-blue-600 text-white rounded-l-xl rounded-tr-xl' 
                        : 'bg-white border border-gray-200 text-gray-900 rounded-r-xl rounded-tl-xl shadow-sm'
                    } px-3 sm:px-4 py-2 sm:py-3`}>
                      <p className="text-xs sm:text-sm leading-relaxed">{msg.message}</p>
                      {msg.type === 'ai' && msg.source && (
                        <div className="mt-2 pt-2 border-t border-gray-100">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Source: {msg.source}</span>
                            <span className="text-green-600 font-medium">{msg.confidence}</span>
                          </div>
                          {msg.suggestions && (
                            <div className="mt-2">
                              <p className="text-xs font-medium text-gray-700 mb-1">Next Steps:</p>
                              <ul className="space-y-1">
                                {msg.suggestions.map((suggestion, i) => (
                                  <li key={i} className="text-xs text-gray-600 flex items-start">
                                    <span className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                                    {suggestion}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="text-xs opacity-75 mt-1">{msg.timestamp}</div>
                    </div>
                  </div>
                ))}
                
                {currentStep === 'processing' && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-r-xl rounded-tl-xl px-3 sm:px-4 py-2 sm:py-3 shadow-sm">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className="text-xs text-gray-500">AI is searching your knowledge base...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 p-3 sm:p-4 bg-white">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <input
                    type="text"
                    placeholder="Type your question or upload an image..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled
                  />
                  <button className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                    </svg>
                  </button>
                  <button className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Demo Controls */}
          <div className="order-1 lg:order-2">
            <div className="space-y-6">
              {Object.entries(demoSteps).map(([key, step], index) => (
                <div
                  key={key}
                  className={`p-4 sm:p-6 rounded-xl border-2 transition-all cursor-pointer ${
                    currentStep === key 
                      ? 'bg-blue-50 border-blue-500 shadow-md' 
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleDemoStep(key)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep === key 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 sm:p-6 bg-gray-100/50 backdrop-blur-sm border border-gray-200 rounded-xl">
              <h4 className="font-medium text-gray-900 mb-3">Key Features</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span>Understands text and image queries</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span>Sources answers from your documents</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span>Shows confidence scores</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span>Escalates complex issues</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ContactFormSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    companySize: '',
    currentTicketVolume: '',
    primaryChallenge: '',
    interestedIntegrations: [],
    timeline: ''
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        interestedIntegrations: checked 
          ? [...prev.interestedIntegrations, value]
          : prev.interestedIntegrations.filter(item => item !== value)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Thank you! We\'ll be in touch soon to schedule a demo.');
  };

  return (
    <section id="contact" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light mb-4">Get Started</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Tell us about your support challenges so we can show you exactly how Snap Question can help.
          </p>
        </div>
        
        <div className="bg-gray-50/50 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 sm:p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                  Work Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                  placeholder="john@company.com"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-900 mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  required
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                  placeholder="Acme Corp"
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-900 mb-2">
                  Your Role *
                </label>
                <select
                  id="role"
                  name="role"
                  required
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                >
                  <option value="">Select your role</option>
                  <option value="ceo">CEO/Founder</option>
                  <option value="cto">CTO</option>
                  <option value="support-manager">Support Manager</option>
                  <option value="customer-success">Customer Success</option>
                  <option value="operations">Operations</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label htmlFor="companySize" className="block text-sm font-medium text-gray-900 mb-2">
                  Company Size *
                </label>
                <select
                  id="companySize"
                  name="companySize"
                  required
                  value={formData.companySize}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                >
                  <option value="">Select company size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="500+">500+ employees</option>
                </select>
              </div>
              <div>
                <label htmlFor="currentTicketVolume" className="block text-sm font-medium text-gray-900 mb-2">
                  Monthly Support Tickets *
                </label>
                <select
                  id="currentTicketVolume"
                  name="currentTicketVolume"
                  required
                  value={formData.currentTicketVolume}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                >
                  <option value="">Select ticket volume</option>
                  <option value="<100">Less than 100</option>
                  <option value="100-500">100-500</option>
                  <option value="500-1000">500-1,000</option>
                  <option value="1000-5000">1,000-5,000</option>
                  <option value="5000+">5,000+</option>
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="primaryChallenge" className="block text-sm font-medium text-gray-900 mb-2">
                Primary Support Challenge *
              </label>
              <select
                id="primaryChallenge"
                name="primaryChallenge"
                required
                value={formData.primaryChallenge}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
              >
                <option value="">Select your biggest challenge</option>
                <option value="repetitive-questions">Too many repetitive questions</option>
                <option value="slow-response-times">Slow response times</option>
                <option value="complex-product-docs">Complex product documentation</option>
                <option value="image-based-support">Customers sending screenshots/photos</option>
                <option value="scaling-support-team">Scaling support team</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Interested Integrations (check all that apply)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {['Zendesk', 'Intercom', 'Slack', 'Email', 'Website Widget', 'API'].map((integration) => (
                  <label key={integration} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      name="interestedIntegrations"
                      value={integration}
                      checked={formData.interestedIntegrations.includes(integration)}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{integration}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="timeline" className="block text-sm font-medium text-gray-900 mb-2">
                Implementation Timeline
              </label>
              <select
                id="timeline"
                name="timeline"
                value={formData.timeline}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
              >
                <option value="">Select timeline</option>
                <option value="asap">As soon as possible</option>
                <option value="1-3-months">1-3 months</option>
                <option value="3-6-months">3-6 months</option>
                <option value="6-12-months">6-12 months</option>
                <option value="just-exploring">Just exploring</option>
              </select>
            </div>
            
            <div className="text-center pt-4">
              <button
                type="submit"
                className="px-6 py-4 bg-blue-600 text-white rounded-full text-base hover:bg-blue-500 transition-colors font-medium shadow-lg whitespace-nowrap"
                style={{ boxShadow: '0 0 30px rgba(37, 99, 235, 0.7)' }}
              >
                Book Your Demo Call
              </button>
              <p className="text-sm text-gray-600 mt-3">
                We'll reach out within 24 hours to schedule your personalized demo
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

const FinalCTASection = () => (
  <section className="py-20 px-4 sm:px-6 md:px-8 bg-blue-600 text-white">
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-4xl md:text-5xl font-light mb-6">
        Stop wasting time on repetitive tickets.
      </h2>
      <p className="text-xl mb-8 opacity-90">
        Let AI handle the routine so your team can focus on what matters.
      </p>
      <button 
        className="px-6 py-4 bg-white text-blue-600 rounded-full text-base hover:bg-gray-100 transition-colors font-medium shadow-lg whitespace-nowrap"
        style={{ boxShadow: '0 0 30px rgba(255, 255, 255, 0.7)' }}
      >
        Try Your Manual Now
      </button>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-gray-50 border-t border-gray-200 relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
      <div className="text-center mb-8 sm:mb-12 md:mb-16">
        <div className="flex items-center justify-center mb-3 sm:mb-4 md:mb-6">
          <ArrowDots size="w-1.5 h-1.5" />
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light mb-4 sm:mb-6 md:mb-8 leading-tight px-2">
          S N A P Q U E S T I O N is the solution<br />
          you've been searching for.
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-12 mb-8 sm:mb-12">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center space-x-3">
            <ArrowDots size="w-1.5 h-1.5" />
            <span className="text-lg font-medium text-gray-900">S N A P Q U E S T I O N</span>
          </div>
        </div>

        <div>
          <h3 className="text-gray-900 font-semibold mb-6 text-sm tracking-wider">USEFUL</h3>
          <div className="space-y-4">
            <a href="#how-it-works" className="block text-gray-600 hover:text-gray-900 transition-colors">How It Works</a>
            <a href="#pricing" onClick={scrollToPricing} className="block text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
          </div>
        </div>

        <div>
          <h3 className="text-gray-900 font-semibold mb-6 text-sm tracking-wider">LEGAL</h3>
          <div className="space-y-4">
            <a href="/privacy" className="block text-gray-600 hover:text-gray-900 transition-colors">Privacy Policy</a>
            <a href="/terms" className="block text-gray-600 hover:text-gray-900 transition-colors">Terms & Conditions</a>
          </div>
        </div>

        <div>
          <h3 className="text-gray-900 font-semibold mb-6 text-sm tracking-wider">UPDATES</h3>
          <div className="space-y-4">
            <a href="/twitter" className="block text-gray-600 hover:text-gray-900 transition-colors">Twitter</a>
            <a href="/linkedin" className="block text-gray-600 hover:text-gray-900 transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>

      <div className="text-center">
        <div className="text-gray-700">Contact: <a href="mailto:support@snapquestion.com" className="text-blue-500 hover:text-blue-400">support@snapquestion.com</a></div>
      </div>
    </div>

    <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none">
      <div className="text-[20rem] md:text-[25rem] font-bold text-gray-200/30 leading-none whitespace-nowrap transform translate-y-1/3">
        S N A P Q U E S T I O N
      </div>
    </div>
  </footer>
);

const FloatingAnimationStyles = () => (
  <style jsx>{`
    @keyframes float1 {
      0%, 100% { transform: translateY(0px) rotate(6deg); }
      50% { transform: translateY(-10px) rotate(6deg); }
    }
    @keyframes float2 {
      0%, 100% { transform: translateY(0px) rotate(-2deg); }
      50% { transform: translateY(-15px) rotate(-2deg); }
    }
    @keyframes float3 {
      0%, 100% { transform: translateY(0px) rotate(1deg); }
      50% { transform: translateY(-8px) rotate(1deg); }
    }
    @keyframes float4 {
      0%, 100% { transform: translateY(0px) rotate(2deg); }
      50% { transform: translateY(-12px) rotate(2deg); }
    }
    @keyframes float5 {
      0%, 100% { transform: translateY(0px) rotate(-3deg); }
      50% { transform: translateY(-9px) rotate(-3deg); }
    }
    
    /* Navigation floating animations - more subtle */
    @keyframes navFloat1 {
      0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
      25% { transform: translateY(-3px) translateX(2px) rotate(0.5deg); }
      50% { transform: translateY(-5px) translateX(-1px) rotate(-0.3deg); }
      75% { transform: translateY(-2px) translateX(1px) rotate(0.2deg); }
    }
    @keyframes navFloat2 {
      0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
      33% { transform: translateY(-4px) translateX(-2px) rotate(-0.4deg); }
      66% { transform: translateY(-6px) translateX(1px) rotate(0.3deg); }
    }
  `}</style>
);

function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900 relative overflow-x-hidden" style={CUSTOM_CURSOR_STYLE}>
      <FloatingAnimationStyles />
      <Header />
      <main role="main">
        <HeroSection />
        <ProductDemoSection />
        <BenefitsSection />
        <AudienceSection />
        <HowItWorksSection />
        <PricingSection />
        <ContactFormSection />
        <FinalCTASection />
      </main>
      <Footer />
      <Analytics />
    </div>
  );
}

export default App;
