'use client';

import { Lock, Code, Infinity, Server } from 'lucide-react';

const features = [
  {
    icon: Lock,
    title: 'Your keys, your funds',
    description: 'The security and privacy of our users\' funds is of utmost importance, and we have implemented strict protocols to ensure that the private keys are protected at all times. Only the users themselves have access to their private keys, giving them full control and security over their funds.'
  },
  {
    icon: Code,
    title: 'Tailor-made scripts',
    description: 'Unique approach involves using tailor-made Fivem scripts, specifically designed to enhance the performance and functionality of our server. With a focus on optimization, customization, Nightcall is developed to ensure a seamless and enjoyable experience for all.'
  },
  {
    icon: Infinity,
    title: 'Blockchain',
    description: 'We believe in the power of decentralization, which is why we\'ve created a token that operates on a secure and transparent blockchain. This system gives players more control over their virtual assets and creates a truly decentralized gaming economy.'
  },
  {
    icon: Server,
    title: 'Infrastructure',
    description: 'Reliability and stability are at the forefront of our operations. With multiple backups and fail-safes in place, we guarantee that your progress will never be lost, and downtime will be kept to a minimum. We understand that the last thing you want to worry about is server lag or instability, which is why we\'ve made it our mission to provide the most resilient and stable gaming environment possible.'
  }
];

export function HowItWorksSection() {
  return (
    <>
      {/* Fixed Background Image */}
      <div className="fixed inset-0 w-full h-full -z-10">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center blur-sm"
          style={{
            backgroundImage: "url('https://files.fivemerr.com/images/99f9abf9-ed5e-40bc-921b-a59a2efb991a.png')",
          }}
        />
        {/* Dark overlay with blur for better text readability */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>

      <section id="how-it-works" className="relative min-h-screen py-24 flex items-center">

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-16">
        {/* Title */}
        <div className="text-right mb-16">
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white uppercase tracking-tight">
            HOW IT WORKS
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="bg-black/60 backdrop-blur-sm border border-red-900/30 rounded-lg p-6 hover:border-red-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-900/20"
              >
                {/* Red Icon */}
                <div className="mb-4 flex justify-center">
                  <div className="p-3 bg-red-600/20 rounded-lg border border-red-600/30">
                    <IconComponent className="w-8 h-8 text-red-600" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-4 text-center">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-white/90 leading-relaxed text-center">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
    </>
  );
}

