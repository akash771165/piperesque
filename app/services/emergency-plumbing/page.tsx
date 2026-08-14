import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Phone, AlertTriangle, Clock, Users, Wrench } from "lucide-react";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CTA from "@/components/sections/cta";
import BreadcrumbSchema from "@/components/seo/breadcrumb-schema";
import FAQSchema from "@/components/seo/faq-schema";

export const metadata: Metadata = {
  title: "24/7 Emergency Plumber Houston | Fast Response Times",
  description:
    "Emergency plumber in Houston, TX. 24/7 response for burst pipes, leaks, sewer backups. Licensed professionals. Call now for immediate help.",
  keywords: [
    "emergency plumber houston",
    "24 hour plumber houston",
    "emergency plumbing services houston",
    "burst pipe repair houston",
    "plumbing emergency",
  ],
  openGraph: {
    title: "24/7 Emergency Plumber Houston | Fast Response Times",
    description:
      "Emergency plumber in Houston, TX available 24/7 for burst pipes, leaks, and sewer emergencies.",
    url: "https://www.piperesque.com/services/emergency-plumbing",
  },
  alternates: {
    canonical: "https://www.piperesque.com/services/emergency-plumbing",
  },
};

export default function EmergencyPlumbingPage() {
  return (
    <main className="overflow-x-hidden bg-white">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://www.piperesque.com" },
          { name: "Services", url: "https://www.piperesque.com/services" },
          { name: "Emergency Plumbing", url: "https://www.piperesque.com/services/emergency-plumbing" },
        ]}
      />
      <FAQSchema
        faqs={[
          {
            question: "What qualifies as a plumbing emergency?",
            answer:
              "A plumbing emergency includes burst pipes, major leaks causing water damage, sewer backups, no water pressure, gas line issues, or water heater failures requiring immediate attention.",
          },
          {
            question: "Are you available 24/7 in Houston?",
            answer: "Yes, we provide emergency plumbing services 24/7, 365 days a year throughout Houston and surrounding areas.",
          },
          {
            question: "How quickly can you respond to an emergency?",
            answer:
              "Our typical response time in Houston is 30-60 minutes depending on location and current service load.",
          },
          {
            question: "Do you charge extra for emergency service?",
            answer:
              "Emergency service rates may vary from standard rates. We provide transparent pricing upfront so you know costs before we start work.",
          },
          {
            question: "Can I schedule an emergency appointment online?",
            answer:
              "Yes, call our emergency line or submit a request through our website for immediate dispatch of an available plumber.",
          },
          {
            question: "Do your plumbers carry parts for common repairs?",
            answer:
              "Yes, our service trucks are fully stocked with common parts and materials for most emergency repairs.",
          },
        ]}
      />

      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <Image
          src="/images/services/emergency-plumbing.jpg"
          alt="Emergency plumber in Houston responding to plumbing crisis"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-blue-950/85" />

        <div className="container-custom relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-red-600/20 px-4 py-2 mb-6">
              <AlertTriangle size={18} className="text-red-400" />
              <span className="text-red-200 font-semibold">Emergency Service Available</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black leading-tight text-white">
              24/7 Emergency Plumbing in Houston, TX
            </h1>

            <p className="mt-6 text-xl leading-8 text-blue-100 max-w-2xl">
              Burst pipes. Sewer backups. Major leaks. When your plumbing goes wrong at 2 AM, we're here. Licensed emergency plumbers ready to respond and solve your Houston plumbing crisis in 30-60 minutes.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="tel:+18773640861"
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-8 py-4 font-bold text-white hover:bg-red-700 transition"
              >
                <Phone size={20} />
                Call Now (877) 364-0861
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-white px-8 py-4 font-bold text-white hover:bg-white hover:text-blue-950 transition"
              >
                Request Service
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-4 md:gap-8">
              <div className="bg-white/10 backdrop-blur rounded-lg p-4 md:p-6">
                <Clock className="text-green-400 mb-2" size={28} />
                <p className="font-bold text-white">30-60 Min Response</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4 md:p-6">
                <Users className="text-green-400 mb-2" size={28} />
                <p className="font-bold text-white">Licensed Pros</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4 md:p-6">
                <Wrench className="text-green-400 mb-2" size={28} />
                <p className="font-bold text-white">Same-Day Fix</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 md:py-28">
        <div className="container-custom grid gap-16 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Introduction */}
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-black mb-6">
                Emergency Plumbing When You Need It Most
              </h2>
              <p className="text-lg leading-8 text-slate-600 mb-6">
                Plumbing emergencies don't wait for business hours. A burst pipe at midnight can flood your entire Houston home, causing thousands in water damage. A sewer backup can make your bathrooms unusable. A failed water heater leaves your family without hot water in the middle of winter.
              </p>
              <p className="text-lg leading-8 text-slate-600 mb-6">
                That's why Piperesque offers true 24/7 emergency plumbing service. Our licensed Houston plumbers are on call around the clock, 365 days a year. We dispatch the nearest available technician to your location, with typical response times between 30-60 minutes depending on your exact location and current service volume.
              </p>
              <p className="text-lg leading-8 text-slate-600">
                We understand the stress and urgency of a plumbing emergency. Our goal isn't just to fix your immediate problem—it's to fix it right, prevent future issues, and get your life back to normal as quickly as possible.
              </p>
            </div>

            {/* What is Emergency Plumbing */}
            <div className="mb-16 pb-16 border-b border-slate-200">
              <h2 className="text-3xl font-black mb-6">
                What Is an Emergency Plumbing Situation?
              </h2>
              <p className="text-lg leading-8 text-slate-600 mb-6">
                Not every plumbing problem requires emergency service. True emergency plumbing involves situations that pose immediate risks to your home, health, or safety, and require professional attention right away.
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded mb-8">
                <h3 className="font-bold text-lg mb-4">Common Emergencies:</h3>
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <span className="text-red-600 font-bold">•</span>
                    <span><strong>Burst water pipes</strong> – Active water spraying or flowing from visible pipe breaks</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-600 font-bold">•</span>
                    <span><strong>Major water leaks</strong> – Significant water damage occurring in real-time</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-600 font-bold">•</span>
                    <span><strong>Sewer backups</strong> – Sewage backing up into toilets, tubs, or drains</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-600 font-bold">•</span>
                    <span><strong>No water pressure/flow</strong> – Complete loss of water to all or part of home</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-600 font-bold">•</span>
                    <span><strong>Gas line issues</strong> – Suspected gas leaks or smell of gas</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-600 font-bold">•</span>
                    <span><strong>Water heater failure</strong> – No hot water, leaking tank, or unusual sounds</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-600 font-bold">•</span>
                    <span><strong>Overflowing toilet</strong> – Toilet continuously running or overflowing</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-600 font-bold">•</span>
                    <span><strong>Frozen/burst lines</strong> – Pipes frozen or burst due to temperature changes</span>
                  </li>
                </ul>
              </div>

              <p className="text-lg leading-8 text-slate-600">
                If you're unsure whether your situation qualifies as an emergency, call us anyway. Our goal is to help protect your home. We'd rather dispatch a plumber for a non-emergency and put your mind at ease than have you delay calling about a serious problem.
              </p>

              <div className="mt-8">
                <a
                  href="tel:+18773640861"
                  className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 font-bold text-white hover:bg-red-700 transition"
                >
                  <Phone size={18} />
                  Call Emergency Line Now
                </a>
              </div>
            </div>

            {/* Warning Signs */}
            <div className="mb-16 pb-16 border-b border-slate-200">
              <h2 className="text-3xl font-black mb-6">
                Warning Signs You Need Emergency Plumbing
              </h2>
              <p className="text-lg leading-8 text-slate-600 mb-8">
                Some plumbing emergencies announce themselves with obvious damage. Others develop gradually with subtle warning signs. Knowing what to look for can help you catch problems before they become catastrophic.
              </p>

              <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-lg">
                  <h3 className="font-bold text-lg text-slate-900 mb-3">Unexpected Water Sounds</h3>
                  <p className="text-slate-700">
                    If you hear gurgling, hissing, or strange sounds coming from your pipes when no water is running, this often indicates trapped air, water hammer (pressure shock), or pipe damage. In Houston's older neighborhoods, this might signal corrosion.
                  </p>
                </div>

                <div className="bg-slate-50 p-6 rounded-lg">
                  <h3 className="font-bold text-lg text-slate-900 mb-3">Water Stains or Wet Spots</h3>
                  <p className="text-slate-700">
                    Brown or yellow water stains on ceilings, walls, or under sinks indicate hidden leaks. These stains grow larger over time and suggest water is actively damaging your home's structure.
                  </p>
                </div>

                <div className="bg-slate-50 p-6 rounded-lg">
                  <h3 className="font-bold text-lg text-slate-900 mb-3">Sudden Odors</h3>
                  <p className="text-slate-700">
                    Foul smells from drains, yard, or under the house often indicate sewer line issues. Houston's clay soil and aging infrastructure make sewer problems increasingly common. These require immediate attention.
                  </p>
                </div>

                <div className="bg-slate-50 p-6 rounded-lg">
                  <h3 className="font-bold text-lg text-slate-900 mb-3">Low Water Pressure</h3>
                  <p className="text-slate-700">
                    Sudden loss of water pressure throughout your home might indicate a main line break. If only one fixture is affected, it's often a local valve issue. Either way, it requires professional diagnosis.
                  </p>
                </div>

                <div className="bg-slate-50 p-6 rounded-lg">
                  <h3 className="font-bold text-lg text-slate-900 mb-3">Wet Yard or Foundation Issues</h3>
                  <p className="text-slate-700">
                    Unusually wet patches in your yard, especially in dry weather, suggest underground water line leaks. Foundation cracks or shifting can develop as a result of these leaks.
                  </p>
                </div>

                <div className="bg-slate-50 p-6 rounded-lg">
                  <h3 className="font-bold text-lg text-slate-900 mb-3">Multiple Drain Issues</h3>
                  <p className="text-slate-700">
                    If several drains in your house are slow or backing up simultaneously, you likely have a main sewer line blockage or break, not just a single clogged drain.
                  </p>
                </div>
              </div>

              <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-slate-900 font-semibold">
                  <strong>Pro Tip:</strong> Act quickly on warning signs. A small leak discovered early might cost $200-400 to fix. The same leak left unaddressed for months can cause $5,000-20,000 in water damage.
                </p>
              </div>
            </div>

            {/* Common Causes */}
            <div className="mb-16 pb-16 border-b border-slate-200">
              <h2 className="text-3xl font-black mb-6">
                What Causes Plumbing Emergencies in Houston?
              </h2>
              <p className="text-lg leading-8 text-slate-600 mb-8">
                Houston's climate, infrastructure, and water quality create unique plumbing challenges. Understanding these causes helps you avoid emergencies in the future.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-lg mb-3">Temperature Fluctuations & Pipe Freezing</h3>
                  <p className="text-slate-700 mb-3">
                    While Houston rarely freezes solid, sudden temperature drops can freeze exposed pipes in attics, crawlspaces, or exterior walls. When water inside a pipe freezes, it expands, creating pressure that bursts the pipe. This often goes unnoticed until temperatures warm and water begins pouring.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-3">Aging Infrastructure & Corrosion</h3>
                  <p className="text-slate-700 mb-3">
                    Many Houston neighborhoods have pipes installed 40-60+ years ago. Galvanized steel pipes corrode from the inside out. Copper pipes develop pinhole leaks. Cast iron deteriorates. Replacement is often the only permanent solution.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-3">Tree Roots in Sewer Lines</h3>
                  <p className="text-slate-700 mb-3">
                    Houston's mature trees have roots that seek moisture. They infiltrate old sewer lines through small cracks, eventually blocking flow or breaking pipes. This is one of the most common emergencies in established neighborhoods.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-3">Hard Water Buildup</h3>
                  <p className="text-slate-700 mb-3">
                    Houston's water is moderately hard. Mineral deposits accumulate inside pipes and fixtures, reducing flow and eventually causing blockages. This develops slowly but can suddenly prevent water from reaching your home.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-3">Water Pressure Issues</h3>
                  <p className="text-slate-700 mb-3">
                    Excessive water pressure causes premature pipe failure. If your home has pressure above 80 PSI, your pipes are under constant stress. A pressure relief valve prevents damage, but many homes lack proper regulation.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-3">Mainline Breaks & Subsidence</h3>
                  <p className="text-slate-700 mb-3">
                    Houston's expansive clay soil shifts with moisture changes, causing ground to settle unevenly. This subsidence cracks underground pipes and sewer lines. It's a major cause of costly emergency repairs.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-3">DIY Installation Mistakes</h3>
                  <p className="text-slate-700 mb-3">
                    Improper installation of fixtures, incorrect pipe grades, bad connections, or missed traps can appear fine initially but fail suddenly under stress or over time.
                  </p>
                </div>
              </div>

              <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-slate-900">
                  <strong>Houston Climate Factor:</strong> Our hot, humid climate with clay soil and frequent temperature swings creates conditions that stress plumbing systems. Regular maintenance and professional inspections can catch problems before they become emergencies.
                </p>
              </div>
            </div>

            {/* Our Process */}
            <div className="mb-16 pb-16 border-b border-slate-200">
              <h2 className="text-3xl font-black mb-6">
                Our Emergency Plumbing Process
              </h2>
              <p className="text-lg leading-8 text-slate-600 mb-8">
                When you call us with a plumbing emergency, here's exactly what happens:
              </p>

              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-600 text-white font-bold text-lg">1</div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Immediate Dispatch (Within 5 Minutes)</h3>
                    <p className="text-slate-700">
                      We ask essential questions about your situation to determine urgency and dispatch the appropriate plumber from our network. If you need help stopping water flow immediately, we provide phone guidance.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-600 text-white font-bold text-lg">2</div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Rapid Arrival (30-60 Minutes)</h3>
                    <p className="text-slate-700">
                      Our plumber arrives with fully stocked service vehicle carrying parts and tools for most common emergencies. You'll be updated with real-time arrival information.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-600 text-white font-bold text-lg">3</div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Diagnostic Assessment</h3>
                    <p className="text-slate-700">
                      We thoroughly inspect the problem, identify root causes, and assess any additional issues. We explain findings in plain language and show you exactly what needs to be done.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-600 text-white font-bold text-lg">4</div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Transparent Pricing Quote</h3>
                    <p className="text-slate-700">
                      Before we do any work, we provide a detailed estimate. You know the exact cost before we proceed. No hidden fees. No surprises on your bill.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-600 text-white font-bold text-lg">5</div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Professional Repair</h3>
                    <p className="text-slate-700">
                      Our licensed plumber completes the repair using quality parts and proper techniques. We work efficiently to restore your service quickly without compromising quality.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-600 text-white font-bold text-lg">6</div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Testing & Verification</h3>
                    <p className="text-slate-700">
                      We thoroughly test the repair to ensure it works correctly. We check for any leaks, verify water pressure and flow, and confirm everything functions properly.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-600 text-white font-bold text-lg">7</div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Cleanup & Follow-up Advice</h3>
                    <p className="text-slate-700">
                      We clean up our work area completely. We provide guidance on preventing similar issues in the future and offer recommendations for maintenance or additional repairs if needed.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <a
                  href="tel:+18773640861"
                  className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 font-bold text-white hover:bg-red-700 transition"
                >
                  <Phone size={18} />
                  Call Now for Emergency Service
                </a>
              </div>
            </div>

            {/* Pricing */}
            <div className="mb-16 pb-16 border-b border-slate-200">
              <h2 className="text-3xl font-black mb-6">
                Emergency Plumbing Pricing in Houston
              </h2>
              <p className="text-lg leading-8 text-slate-600 mb-8">
                Plumbing emergency costs in Houston typically range from $200-$3,000+ depending on the nature and severity of the problem. Here's what affects your final bill:
              </p>

              <div className="bg-slate-50 p-8 rounded-lg mb-8">
                <h3 className="font-bold text-lg mb-6">Typical Emergency Service Pricing:</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span>Service Call (Diagnostic) - After Hours</span>
                    <span className="font-bold">$150-250</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span>Simple Repair (Shutoff, Valve Replacement)</span>
                    <span className="font-bold">$250-500</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span>Moderate Repair (Pipe Repair, Toilet Replacement)</span>
                    <span className="font-bold">$500-1,500</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span>Complex Repair (Sewer Line, Mainline Break)</span>
                    <span className="font-bold">$1,500-5,000+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Parts & Materials</span>
                    <span className="font-bold">Varies by repair</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6 mb-8">
                <div>
                  <h3 className="font-bold text-lg mb-3">Factors Affecting Emergency Pricing:</h3>
                  <ul className="space-y-2">
                    <li className="flex gap-3">
                      <span className="text-red-600">•</span>
                      <span><strong>Time of call:</strong> After-hours, weekend, and holiday calls may incur additional fees</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-red-600">•</span>
                      <span><strong>Severity:</strong> More damage requires more complex repairs</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-red-600">•</span>
                      <span><strong>Location:</strong> Response time to far suburbs may be longer</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-red-600">•</span>
                      <span><strong>Accessibility:</strong> Pipes in crawlspaces, walls, or underground cost more to access</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-red-600">•</span>
                      <span><strong>Parts needed:</strong> Specialty or rare parts may be more expensive</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="p-6 bg-green-50 border border-green-200 rounded-lg mb-8">
                <h3 className="font-bold text-lg mb-3">Our Pricing Guarantee:</h3>
                <ul className="space-y-2 text-slate-900">
                  <li className="flex gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>No diagnosis fee - we roll the service call into the repair cost</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>Transparent estimate before any work begins</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>No surprise charges or hidden fees</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-600 font-bold">✓</span>
                    <span>We discuss options with you and solve for your budget</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-slate-900 mb-4">
                  <strong>Pro Tip:</strong> Emergency plumbing often saves money in the long run. Addressing a minor leak immediately might cost $300-500. Ignoring it can lead to $10,000+ in water damage to your home's structure.
                </p>
                <a
                  href="tel:+18773640861"
                  className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 font-bold text-white hover:bg-red-700 transition"
                >
                  <Phone size={18} />
                  Get a Quote - Call Now
                </a>
              </div>
            </div>

            {/* Why Choose Us */}
            <div className="mb-16 pb-16 border-b border-slate-200">
              <h2 className="text-3xl font-black mb-6">
                Why Choose Piperesque for Emergency Plumbing
              </h2>

              <div className="space-y-6 mb-8">
                <div className="border-l-4 border-blue-600 pl-6">
                  <h3 className="font-bold text-lg mb-2">Licensed, Certified Professionals</h3>
                  <p className="text-slate-700">
                    All our plumbers are fully licensed and insured. We stay current on training and certifications. You're not getting someone's nephew with a wrench—you're getting qualified professionals.
                  </p>
                </div>

                <div className="border-l-4 border-blue-600 pl-6">
                  <h3 className="font-bold text-lg mb-2">True 24/7 Availability</h3>
                  <p className="text-slate-700">
                    We're here 365 days a year, including holidays. Emergencies don't clock out at 5 PM, and neither do we. Call anytime—a real person answers.
                  </p>
                </div>

                <div className="border-l-4 border-blue-600 pl-6">
                  <h3 className="font-bold text-lg mb-2">Fast Response Times</h3>
                  <p className="text-slate-700">
                    30-60 minute typical response in Houston. We have multiple trucks and plumbers positioned to reach you quickly. The faster we arrive, the less damage occurs.
                  </p>
                </div>

                <div className="border-l-4 border-blue-600 pl-6">
                  <h3 className="font-bold text-lg mb-2">Fully Stocked Service Vehicles</h3>
                  <p className="text-slate-700">
                    Our trucks carry hundreds of common parts. Most repairs are completed on first visit without additional trips. This saves you time and money.
                  </p>
                </div>

                <div className="border-l-4 border-blue-600 pl-6">
                  <h3 className="font-bold text-lg mb-2">Transparent, Honest Pricing</h3>
                  <p className="text-slate-700">
                    No surprise bills. No upselling unnecessary work. We explain what needs to be done and why. You approve the cost before we proceed.
                  </p>
                </div>

                <div className="border-l-4 border-blue-600 pl-6">
                  <h3 className="font-bold text-lg mb-2">Quality Workmanship Guarantee</h3>
                  <p className="text-slate-700">
                    We stand behind our work. If something fails due to our workmanship, we fix it. Our reputation depends on quality repairs that last.
                  </p>
                </div>

                <div className="border-l-4 border-blue-600 pl-6">
                  <h3 className="font-bold text-lg mb-2">Houston Local Expertise</h3>
                  <p className="text-slate-700">
                    We know Houston's unique plumbing challenges: clay soil, aging infrastructure, temperature fluctuations, and hard water. This expertise helps us fix problems correctly and prevent future issues.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQs */}
            <div className="mb-16">
              <h2 className="text-3xl font-black mb-8">
                Frequently Asked Questions About Emergency Plumbing
              </h2>

              <div className="space-y-6">
                <details className="group border border-slate-200 rounded-lg p-6 cursor-pointer">
                  <summary className="font-bold text-lg flex justify-between items-center">
                    <span>What should I do while waiting for the plumber to arrive?</span>
                    <span className="transition group-open:rotate-180">▼</span>
                  </summary>
                  <div className="mt-4 text-slate-700 leading-8">
                    <p className="mb-4">
                      First, stop the water if safely possible. Locate your main shutoff valve and turn it off clockwise. If you can't find or reach your shutoff, call us immediately—provide this information when we arrive.
                    </p>
                    <p className="mb-4">
                      For active leaks, place buckets or towels to catch water. Move valuables away from the affected area. Don't try to DIY repair it while waiting—professional help is minutes away.
                    </p>
                    <p>
                      Document the problem with photos for your insurance company. Have your address, phone number, and description of the problem ready when we arrive.
                    </p>
                  </div>
                </details>

                <details className="group border border-slate-200 rounded-lg p-6 cursor-pointer">
                  <summary className="font-bold text-lg flex justify-between items-center">
                    <span>Do you offer payment plans for large emergency repairs?</span>
                    <span className="transition group-open:rotate-180">▼</span>
                  </summary>
                  <div className="mt-4 text-slate-700 leading-8">
                    <p>
                      We understand that large emergency repairs can be financially stressful. Ask about our financing options. We work with homeowners to find solutions that fit their budget while ensuring the necessary repairs are completed.
                    </p>
                  </div>
                </details>

                <details className="group border border-slate-200 rounded-lg p-6 cursor-pointer">
                  <summary className="font-bold text-lg flex justify-between items-center">
                    <span>Does my homeowner's insurance cover emergency plumbing?</span>
                    <span className="transition group-open:rotate-180">▼</span>
                  </summary>
                  <div className="mt-4 text-slate-700 leading-8">
                    <p className="mb-4">
                      This depends on your specific policy and the cause of the emergency. Sudden, accidental damage is usually covered. Gradual leaks from aging pipes may not be.
                    </p>
                    <p>
                      Contact your insurance company immediately. We'll provide documentation of the damage and repair costs. Many insurance companies require an itemized estimate.
                    </p>
                  </div>
                </details>

                <details className="group border border-slate-200 rounded-lg p-6 cursor-pointer">
                  <summary className="font-bold text-lg flex justify-between items-center">
                    <span>Can you prevent emergency plumbing problems?</span>
                    <span className="transition group-open:rotate-180">▼</span>
                  </summary>
                  <div className="mt-4 text-slate-700 leading-8">
                    <p className="mb-4">
                      Many plumbing emergencies can be prevented through regular maintenance. Annual inspections catch problems before they become emergencies.
                    </p>
                    <p>
                      We recommend:
                    </p>
                    <ul className="space-y-2 mt-3">
                      <li>• Regular drain cleaning (annually or as needed)</li>
                      <li>• Water pressure regulation (if over 80 PSI)</li>
                      <li>• Water heater maintenance and flush (every 1-3 years)</li>
                      <li>• Sewer line camera inspection (especially in older homes)</li>
                      <li>• Fixture repairs as soon as leaks develop</li>
                    </ul>
                  </div>
                </details>

                <details className="group border border-slate-200 rounded-lg p-6 cursor-pointer">
                  <summary className="font-bold text-lg flex justify-between items-center">
                    <span>Do you offer warranties on emergency repairs?</span>
                    <span className="transition group-open:rotate-180">▼</span>
                  </summary>
                  <div className="mt-4 text-slate-700 leading-8">
                    <p>
                      Yes. All repairs include a workmanship warranty. Specific warranty periods depend on the repair type. We'll detail the warranty when we complete your repair.
                    </p>
                  </div>
                </details>
              </div>
            </div>

            {/* Final CTA */}
            <div className="p-8 bg-red-50 border-l-4 border-red-600 rounded-lg">
              <h3 className="text-2xl font-black text-slate-900 mb-4">
                Plumbing Emergency? Don't Wait.
              </h3>
              <p className="text-slate-700 mb-6 text-lg">
                Every minute counts when you have a plumbing emergency. Water damage grows exponentially. Sewage backups create health hazards. Call us immediately.
              </p>
              <a
                href="tel:+18773640861"
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-8 py-4 font-bold text-white hover:bg-red-700 transition text-lg"
              >
                <Phone size={20} />
                Call (877) 364-0861 NOW
              </a>
              <p className="text-sm text-slate-600 mt-4">
                Available 24/7 • 30-60 minute response • Licensed professionals
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              {/* Call Box */}
              <div className="rounded-xl bg-red-600 text-white p-8 shadow-lg">
                <h3 className="text-2xl font-black mb-4">
                  Emergency Line
                </h3>
                <p className="mb-6 text-red-100">
                  24/7 Emergency plumbing response
                </p>
                <a
                  href="tel:+18773640861"
                  className="block text-center rounded-lg bg-white text-red-600 px-6 py-4 font-bold hover:bg-red-50 transition text-lg mb-4"
                >
                  (877) 364-0861
                </a>
                <div className="space-y-3 text-sm">
                  <div className="flex gap-2">
                    <Clock size={18} className="flex-shrink-0 mt-0.5" />
                    <span>Available 24/7</span>
                  </div>
                  <div className="flex gap-2">
                    <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
                    <span>30-60 min response</span>
                  </div>
                  <div className="flex gap-2">
                    <Users size={18} className="flex-shrink-0 mt-0.5" />
                    <span>Licensed plumbers</span>
                  </div>
                </div>
              </div>

              {/* What to Expect */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow">
                <h3 className="font-bold text-lg mb-4">What to Expect</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex gap-2">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span>Fast response</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span>Professional diagnosis</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span>Transparent pricing</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span>Quality workmanship</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-blue-600 font-bold">✓</span>
                    <span>Warranty on repairs</span>
                  </li>
                </ul>
              </div>

              {/* Service Area */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow">
                <h3 className="font-bold text-lg mb-4">Service Area</h3>
                <p className="text-sm text-slate-700 mb-4">
                  Serving Houston and surrounding areas including:
                </p>
                <ul className="text-sm space-y-2 text-slate-600">
                  <li>• Houston</li>
                  <li>• Katy</li>
                  <li>• Sugar Land</li>
                  <li>• Pearland</li>
                  <li>• Cypress</li>
                  <li>• Pasadena</li>
                  <li>• <Link href="/service-areas" className="text-blue-600 hover:underline">View all areas →</Link></li>
                </ul>
              </div>

              {/* Related Services */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow">
                <h3 className="font-bold text-lg mb-4">Related Services</h3>
                <ul className="text-sm space-y-2">
                  <li><Link href="/services/burst-pipe-repair" className="text-blue-600 hover:underline">Burst Pipe Repair</Link></li>
                  <li><Link href="/services/sewer-line-repair" className="text-blue-600 hover:underline">Sewer Line Repair</Link></li>
                  <li><Link href="/services/leak-detection" className="text-blue-600 hover:underline">Leak Detection</Link></li>
                  <li><Link href="/services/drain-cleaning" className="text-blue-600 hover:underline">Drain Cleaning</Link></li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <CTA />
      <Footer />
    </main>
  );
}
