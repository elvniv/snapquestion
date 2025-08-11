import React, { useState } from 'react';

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
    buttonText: 'Start Free Trial',
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
    buttonText: 'Start Free Trial',
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
    buttonText: 'Get Started Today',
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

// Utility functions
const ArrowDots = ({ size = 'w-1 h-1', color = 'bg-gray-900' }) => (
  <div className="flex items-center justify-center w-6 h-6 relative">
    <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 ${size} ${color} rounded-full`}></div>
    <div className={`absolute bottom-0 left-0 ${size} ${color} rounded-full`}></div>
    <div className={`absolute bottom-0 right-0 ${size} ${color} rounded-full`}></div>
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

const Header = () => (
  <header className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6">
    <div className="flex items-center justify-between">
      {/* Mobile Logo */}
      <div className="flex items-center space-x-2 md:hidden">
        <span className="text-lg font-medium text-gray-900">SQ</span>
      </div>
      
      {/* Desktop Logo */}
      <div className="hidden md:flex items-center space-x-2">
        <span className="text-xl font-medium tracking-[0.2em] text-gray-900">S N A P  Q U E S T I O N</span>
      </div>

      {/* Mobile Navigation */}
      <div 
        className="md:hidden bg-gray-200/50 backdrop-blur-sm rounded-full px-4 py-2 flex items-center space-x-2"
        style={{
          animation: 'navFloat1 6s ease-in-out infinite',
          animationDelay: '0s'
        }}
      >
        <ArrowDots size="w-1 h-1" />
        <button className="px-3 py-1 bg-blue-600 text-white rounded-full text-xs hover:bg-blue-500 transition-colors">
          Start Free Trial
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
        <a href="#how-it-works" className="text-gray-700 hover:text-gray-900 transition-colors">How It Works</a>
        <a href="#pricing" className="text-gray-700 hover:text-gray-900 transition-colors" onClick={scrollToPricing}>Pricing</a>
        <a href="#about" className="text-gray-700 hover:text-gray-900 transition-colors">About</a>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-500 transition-colors">
          Start Free Trial
        </button>
      </div>
    </div>
  </header>
);

const HeroSection = () => (
  <section className="min-h-[75vh] sm:min-h-[85vh] md:min-h-screen pt-20 sm:pt-28 md:pt-32 pb-4 sm:pb-8 md:pb-16 px-4 sm:px-6 md:px-8 relative">
    <div className="max-w-7xl mx-auto relative">
      {FLOATING_ELEMENTS.map(element => (
        <FloatingElement key={element.id} element={element} />
      ))}

      <div className="text-center z-30 relative pt-16 sm:pt-24 md:pt-40">
        <p className="text-gray-900 text-sm sm:text-base md:text-lg mb-3 sm:mb-4 md:mb-6 px-4" style={{ textShadow: '0 0 20px rgba(0, 0, 0, 0.1)' }}>
          SNAP QUESTION
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light tracking-tight mb-4 sm:mb-6 lg:mb-8 px-2" style={{ textShadow: '0 0 40px rgba(0, 0, 0, 0.1)' }}>
          Your Support Team, Supercharged by AI
        </h1>
        <div className="max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto mb-6 sm:mb-8 md:mb-10 lg:mb-12 px-4">
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed" style={{ textShadow: '0 0 16px rgba(0, 0, 0, 0.1)' }}>
            Answer customer questions from manuals, PDFs, and screenshots — instantly.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 px-4">
          <button 
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white rounded-full text-base sm:text-lg hover:bg-blue-500 transition-colors font-medium" 
            style={{ boxShadow: '0 0 30px rgba(37, 99, 235, 0.7)' }}
          >
            Start Free Trial
          </button>
          <p className="text-sm text-gray-600">no credit card required</p>
        </div>
      </div>

      <FloatingAnimationStyles />
    </div>
  </section>
);

const HowItWorksSection = () => (
  <section id="how-it-works" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 bg-gray-50">
    <div className="max-w-6xl mx-auto text-center">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-light mb-8">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-gray-900 font-medium mb-1">1. Upload your knowledge</div>
          <div className="text-gray-700 text-sm">Drop in PDFs, manuals, product guides, and sample screenshots.</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-gray-900 font-medium mb-1">2. Connect your channels</div>
          <div className="text-gray-700 text-sm">Add our widget to your site or plug into Zendesk, Intercom, Slack, or email.</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-gray-900 font-medium mb-1">3. Let AI handle the routine</div>
          <div className="text-gray-700 text-sm">Customers type a question or upload a photo → AI finds the answer from your own content.</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-gray-900 font-medium mb-1">4. Escalate when needed</div>
          <div className="text-gray-700 text-sm">If AI can't answer, it routes the ticket (with context) to your human agents.</div>
        </div>
      </div>
    </div>
  </section>
);

const BenefitsSection = () => (
  <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8">
    <div className="max-w-6xl mx-auto text-center">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-light mb-4">Key Benefits</h2>
      <p className="text-gray-700 max-w-3xl mx-auto mb-8 sm:mb-10 md:mb-12">
        Stop wasting time on repetitive questions. <span className="text-gray-900 font-medium">Let AI handle the routine so your team can focus on what matters.</span>
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-left">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="text-gray-900 font-medium mb-1">Faster responses</div>
          <div className="text-gray-700 text-sm">deflect up to 70% of tickets.</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="text-gray-900 font-medium mb-1">Smarter answers</div>
          <div className="text-gray-700 text-sm">AI understands text and images.</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="text-gray-900 font-medium mb-1">Seamless integration</div>
          <div className="text-gray-700 text-sm">works with your existing tools.</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="text-gray-900 font-medium mb-1">Zero setup headaches</div>
          <div className="text-gray-700 text-sm">go live in a day.</div>
        </div>
      </div>
    </div>
  </section>
);

const AudienceSection = () => (
  <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 bg-gray-50">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-center mb-8">Who It's For</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-gray-900 font-medium">Field service companies</div>
          <div className="text-gray-700 text-sm">HVAC, generators, commercial kitchens</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-gray-900 font-medium">Industrial/parts distributors</div>
          <div className="text-gray-700 text-sm">Complex product catalogs and technical specifications</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-gray-900 font-medium">Complex B2B SaaS teams</div>
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
          className={`w-full px-4 sm:px-6 py-2.5 sm:py-3 md:py-2 rounded-full text-xs sm:text-sm transition-colors ${plan.buttonStyle} font-medium`}
          style={plan.isPopular ? { boxShadow: '0 0 20px rgba(37, 99, 235, 0.5)' } : {}}
        >
          {plan.buttonText}
        </button>
      ) : (
        <div className={`w-full px-4 sm:px-6 py-2.5 sm:py-3 md:py-2 rounded-full text-xs sm:text-sm text-center font-medium ${plan.buttonStyle}`}>
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

const SocialProofSection = () => (
  <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 bg-white">
    <div className="max-w-4xl mx-auto text-center">
      <div className="bg-gray-50 border border-gray-200 p-8 rounded-2xl">
        <p className="text-xl text-gray-700 mb-6 italic">
          "We cut our support ticket volume by 40% in the first month. Setup took one afternoon."
        </p>
        <div className="text-gray-600">
          <strong>Customer Name</strong>, Company
        </div>
      </div>
    </div>
  </section>
);

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
        className="px-8 py-4 bg-white text-blue-600 rounded-full text-lg hover:bg-gray-100 transition-colors font-medium shadow-lg"
        style={{ boxShadow: '0 0 30px rgba(255, 255, 255, 0.7)' }}
      >
        Get Started Today
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
          SNAP QUESTION is the solution<br />
          you've been searching for.
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-12 mb-8 sm:mb-12">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center space-x-3">
            <ArrowDots size="w-1.5 h-1.5" />
            <span className="text-lg font-medium text-gray-900">SNAP QUESTION</span>
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
        SNAP QUESTION
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
      <HeroSection />
      <BenefitsSection />
      <AudienceSection />
      <HowItWorksSection />
      <PricingSection />
      <SocialProofSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
}

export default App;
