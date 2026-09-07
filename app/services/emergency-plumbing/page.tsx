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
  title: "24/7 Emergency Plumbing in Houston, TX | Piperesque",
  description:
    "Need emergency plumbing help in Houston, TX? Piperesque helps homeowners connect with independent plumbing professionals for burst pipes, major leaks, sewer backups, and urgent plumbing problems.",
  keywords: [
    "emergency plumber houston",
    "24 hour plumber houston",
    "emergency plumbing services houston",
    "emergency plumbing houston tx",
    "burst pipe repair houston",
    "plumbing emergency houston",
    "emergency plumber near me",
  ],
  openGraph: {
    title: "24/7 Emergency Plumbing Help in Houston, TX | Piperesque",
    description:
      "Piperesque helps Houston homeowners connect with independent plumbing professionals for emergency plumbing needs, including burst pipes, major leaks, sewer backups, and other urgent problems.",
    url: "https://www.piperesque.com/services/emergency-plumbing",
    type: "website",
  },
  alternates: {
    canonical: "https://www.piperesque.com/services/emergency-plumbing",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function EmergencyPlumbingPage() {
  return (
    <main className="overflow-x-hidden bg-white">
      <BreadcrumbSchema
        items={[
          {
            name: "Home",
            url: "https://www.piperesque.com",
          },
          {
            name: "Services",
            url: "https://www.piperesque.com/services",
          },
          {
            name: "Emergency Plumbing",
            url: "https://www.piperesque.com/services/emergency-plumbing",
          },
        ]}
      />

      <FAQSchema
        faqs={[
          {
            question: "What qualifies as a plumbing emergency?",
            answer:
              "A plumbing emergency may include an active burst pipe, major water leak, sewer backup, overflowing fixture, significant loss of water service, or another plumbing problem that may cause property damage or require prompt professional attention.",
          },
          {
            question: "Is emergency plumbing help available 24/7 in Houston?",
            answer:
              "Piperesque accepts plumbing service requests at any time and helps homeowners connect with independent plumbing professionals. Provider availability varies by location, time, and current service capacity.",
          },
          {
            question: "How quickly can a plumbing professional respond?",
            answer:
              "Response times vary by provider, location, time of day, and current demand. The independent plumbing provider handling the request determines availability and scheduling.",
          },
          {
            question: "Does emergency plumbing cost more?",
            answer:
              "Emergency plumbing pricing varies by provider and may depend on the type of problem, time of service, labor, materials, equipment, accessibility, and whether repair or replacement is required. Ask the provider about applicable service or diagnostic fees before authorizing work.",
          },
          {
            question: "Can I request emergency plumbing service online?",
            answer:
              "Yes. Homeowners can submit a plumbing service request through Piperesque or call the listed phone number. The request may then be connected with an independent plumbing service provider serving the area.",
          },
          {
            question: "Are plumbing providers licensed?",
            answer:
              "Licensing, insurance, qualifications, warranties, and service terms are determined by the independent plumbing provider. Homeowners should confirm applicable credentials and terms directly with the provider before authorizing work.",
          },
        ]}
      />

      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <Image
          src="/images/services/emergency-plumbing.jpg"
          alt="Emergency plumbing assistance in Houston, Texas"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-blue-950/85" />

        <div className="container-custom relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-red-600/20 px-4 py-2 mb-6">
              <AlertTriangle size={18} className="text-red-400" />
              <span className="text-red-200 font-semibold">
                Emergency Plumbing Help
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black leading-tight text-white">
              24/7 Emergency Plumbing Help in Houston, TX
            </h1>

            <p className="mt-6 text-xl leading-8 text-blue-100 max-w-2xl">
              Burst pipes, major leaks, sewer backups, overflowing fixtures,
              and other urgent plumbing problems can require prompt attention.
              Piperesque helps Houston homeowners connect with independent
              plumbing professionals serving their area.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="tel:+18773640861"
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-8 py-4 font-bold text-white hover:bg-red-700 transition"
              >
                <Phone size={20} />
                Call (877) 364-0861
              </a>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-white px-8 py-4 font-bold text-white hover:bg-white hover:text-blue-950 transition"
              >
                Request Service
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8">
              <div className="bg-white/10 backdrop-blur rounded-lg p-4 md:p-6">
                <Clock className="text-green-400 mb-2" size={28} />
                <p className="font-bold text-white">
                  24/7 Service Requests
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-lg p-4 md:p-6">
                <Users className="text-green-400 mb-2" size={28} />
                <p className="font-bold text-white">
                  Independent Providers
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-lg p-4 md:p-6">
                <Wrench className="text-green-400 mb-2" size={28} />
                <p className="font-bold text-white">
                  Availability Varies
                </p>
              </div>
            </div>

            <p className="mt-6 text-sm text-blue-200 max-w-2xl">
              Piperesque is an informational service that helps homeowners
              connect with independent plumbing providers. Availability,
              response times, pricing, warranties, and workmanship are
              determined by the provider handling the request.
            </p>
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
                Emergency Plumbing Help When You Need It
              </h2>

              <p className="text-lg leading-8 text-slate-600 mb-6">
                Plumbing emergencies can happen at any time. A burst pipe,
                major water leak, sewer backup, or overflowing fixture can
                create water damage and disrupt normal use of a home.
              </p>

              <p className="text-lg leading-8 text-slate-600 mb-6">
                Piperesque helps Houston homeowners connect with independent
                plumbing professionals for urgent plumbing problems. The
                provider handling the request determines availability,
                scheduling, diagnosis, pricing, and the appropriate service.
              </p>

              <p className="text-lg leading-8 text-slate-600">
                If an active plumbing problem is causing water or wastewater
                damage, consider limiting use of the affected fixture or
                plumbing system when it is safe to do so and seek professional
                assistance.
              </p>
            </div>

            {/* What Is Emergency Plumbing */}
            <div className="mb-16 pb-16 border-b border-slate-200">
              <h2 className="text-3xl font-black mb-6">
                What Is an Emergency Plumbing Situation?
              </h2>

              <p className="text-lg leading-8 text-slate-600 mb-6">
                Not every plumbing problem requires immediate service. An
                emergency may involve active water damage, wastewater entering
                the property, an overflowing fixture, a significant plumbing
                leak, or another problem that could become more serious if it
                is not addressed promptly.
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded mb-8">
                <h3 className="font-bold text-lg mb-4">
                  Common Plumbing Emergencies
                </h3>

                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <span className="text-red-600 font-bold">•</span>
                    <span>
                      <strong>Burst water pipes</strong> – Active water
                      escaping from a damaged or broken pipe
                    </span>
                  </li>

                  <li className="flex gap-3">
                    <span className="text-red-600 font-bold">•</span>
                    <span>
                      <strong>Major water leaks</strong> – Significant or
                      continuing water leakage around plumbing
                    </span>
                  </li>

                  <li className="flex gap-3">
                    <span className="text-red-600 font-bold">•</span>
                    <span>
                      <strong>Sewer backups</strong> – Wastewater backing up
                      into toilets, tubs, showers, or drains
                    </span>
                  </li>

                  <li className="flex gap-3">
                    <span className="text-red-600 font-bold">•</span>
                    <span>
                      <strong>Overflowing toilets</strong> – Toilet overflow
                      that cannot be safely controlled through normal use
                    </span>
                  </li>

                  <li className="flex gap-3">
                    <span className="text-red-600 font-bold">•</span>
                    <span>
                      <strong>Loss of water service</strong> – Sudden loss of
                      water affecting a property or multiple fixtures
                    </span>
                  </li>

                  <li className="flex gap-3">
                    <span className="text-red-600 font-bold">•</span>
                    <span>
                      <strong>Water heater leaks</strong> – Active leakage
                      from or around a water-heating system
                    </span>
                  </li>

                  <li className="flex gap-3">
                    <span className="text-red-600 font-bold">•</span>
                    <span>
                      <strong>Multiple drains backing up</strong> – Several
                      fixtures experiencing drainage problems at the same time
                    </span>
                  </li>

                  <li className="flex gap-3">
                    <span className="text-red-600 font-bold">•</span>
                    <span>
                      <strong>Suspected gas leak</strong> – If you smell gas,
                      leave the area and contact the appropriate emergency
                      service or utility provider rather than attempting to
                      diagnose or repair the gas line yourself
                    </span>
                  </li>
                </ul>
              </div>

              <p className="text-lg leading-8 text-slate-600">
                If you are unsure whether a plumbing problem requires urgent
                attention, describe the symptoms to a qualified professional
                and ask what level of service is appropriate.
              </p>

              <div className="mt-8">
                <a
                  href="tel:+18773640861"
                  className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 font-bold text-white hover:bg-red-700 transition"
                >
                  <Phone size={18} />
                  Call for Plumbing Help
                </a>
              </div>
            </div>

            {/* Warning Signs */}
            <div className="mb-16 pb-16 border-b border-slate-200">
              <h2 className="text-3xl font-black mb-6">
                Warning Signs of a Serious Plumbing Problem
              </h2>

              <p className="text-lg leading-8 text-slate-600 mb-8">
                Some plumbing problems become obvious immediately, while
                others develop through warning signs such as recurring
                backups, unexplained moisture, unusual sounds, or changes in
                drainage.
              </p>

              <div className="space-y-6">

                <div className="bg-slate-50 p-6 rounded-lg">
                  <h3 className="font-bold text-lg text-slate-900 mb-3">
                    Unexpected Water Sounds
                  </h3>

                  <p className="text-slate-700">
                    Gurgling, hissing, dripping, or other unusual plumbing
                    sounds can have several causes. A professional inspection
                    may be appropriate when the sound is persistent or
                    accompanied by other symptoms.
                  </p>
                </div>

                <div className="bg-slate-50 p-6 rounded-lg">
                  <h3 className="font-bold text-lg text-slate-900 mb-3">
                    Water Stains or Wet Areas
                  </h3>

                  <p className="text-slate-700">
                    Unexplained water stains, damp walls, wet flooring, or
                    moisture around plumbing fixtures can indicate a leak.
                    Continuing moisture should be investigated before the
                    underlying problem becomes more extensive.
                  </p>
                </div>

                <div className="bg-slate-50 p-6 rounded-lg">
                  <h3 className="font-bold text-lg text-slate-900 mb-3">
                    Sewer or Drain Odors
                  </h3>

                  <p className="text-slate-700">
                    Persistent sewage or unusual drain odors may indicate a
                    drainage or sewer problem. When odors occur together with
                    slow drains or backups, professional assessment may be
                    appropriate.
                  </p>
                </div>

                <div className="bg-slate-50 p-6 rounded-lg">
                  <h3 className="font-bold text-lg text-slate-900 mb-3">
                    Sudden Loss of Water Pressure
                  </h3>

                  <p className="text-slate-700">
                    A sudden change in water pressure can have multiple causes,
                    including a plumbing-system issue, fixture problem, valve
                    issue, or water-supply problem. The cause should be
                    professionally evaluated when the change is significant
                    or persistent.
                  </p>
                </div>

                <div className="bg-slate-50 p-6 rounded-lg">
                  <h3 className="font-bold text-lg text-slate-900 mb-3">
                    Wet Yard or Unexplained Outdoor Moisture
                  </h3>

                  <p className="text-slate-700">
                    An unusually wet area around a property may have several
                    possible causes, including drainage conditions or a
                    plumbing leak. Persistent unexplained moisture can justify
                    further investigation.
                  </p>
                </div>

                <div className="bg-slate-50 p-6 rounded-lg">
                  <h3 className="font-bold text-lg text-slate-900 mb-3">
                    Multiple Drain Problems
                  </h3>

                  <p className="text-slate-700">
                    When multiple fixtures become slow or back up at the same
                    time, the problem may involve a larger section of the
                    drainage system rather than one isolated fixture.
                  </p>
                </div>

              </div>

              <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-slate-900">
                  <strong>Important:</strong> If water is actively damaging
                  your property or wastewater is entering the home, limit
                  exposure to the affected area when possible and seek
                  appropriate professional assistance.
                </p>
              </div>
            </div>

            {/* Common Causes */}
            <div className="mb-16 pb-16 border-b border-slate-200">
              <h2 className="text-3xl font-black mb-6">
                Common Causes of Plumbing Emergencies in Houston
              </h2>

              <p className="text-lg leading-8 text-slate-600 mb-8">
                Plumbing emergencies can have many causes. The actual cause
                depends on the property's plumbing system, installation,
                maintenance history, environmental conditions, and the
                specific symptoms.
              </p>

              <div className="space-y-6">

                <div>
                  <h3 className="font-bold text-lg mb-3">
                    Temperature Changes
                  </h3>

                  <p className="text-slate-700 mb-3">
                    Sudden temperature changes can place additional stress on
                    exposed plumbing. During unusually cold weather, freezing
                    can contribute to pipe damage in vulnerable areas.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-3">
                    Aging or Deteriorating Pipes
                  </h3>

                  <p className="text-slate-700 mb-3">
                    Older plumbing systems can develop corrosion, deterioration,
                    leaks, restricted flow, or other failures over time.
                    Inspection can help determine the condition of affected
                    plumbing.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-3">
                    Tree Roots and Drainage Problems
                  </h3>

                  <p className="text-slate-700 mb-3">
                    Tree roots can enter damaged or compromised underground
                    sewer lines and contribute to recurring blockages. A
                    professional inspection may be needed when sewer problems
                    repeatedly return.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-3">
                    Mineral or Debris Buildup
                  </h3>

                  <p className="text-slate-700 mb-3">
                    Deposits, debris, grease, hair, foreign objects, and other
                    material can restrict water or drainage flow. Repeated
                    blockages may indicate a problem that requires more than
                    routine clearing.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-3">
                    Water Pressure Problems
                  </h3>

                  <p className="text-slate-700 mb-3">
                    Abnormally high or low water pressure can indicate an issue
                    with the plumbing system, supply, valves, or pressure
                    regulation. A professional can determine the likely cause.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-3">
                    Underground Plumbing Damage
                  </h3>

                  <p className="text-slate-700 mb-3">
                    Underground supply or sewer lines can develop leaks,
                    blockages, cracks, or other problems. Signs may include
                    recurring backups, unexplained moisture, or changes in
                    water or drainage behavior.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-3">
                    Plumbing Installation or Connection Problems
                  </h3>

                  <p className="text-slate-700 mb-3">
                    Incorrect installation, deteriorated connections, damaged
                    fittings, or improperly maintained components can contribute
                    to plumbing failures.
                  </p>
                </div>

              </div>

              <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-slate-900">
                  <strong>Houston Plumbing Consideration:</strong> Properties
                  throughout the Houston area can differ significantly in age,
                  construction, plumbing configuration, and maintenance
                  history. The appropriate diagnosis and repair approach
                  depends on the individual property and plumbing problem.
                </p>
              </div>
            </div>
                        {/* How Piperesque Helps */}
            <div className="mb-16 pb-16 border-b border-slate-200">
              <h2 className="text-3xl font-black mb-6">
                How Piperesque Helps With Emergency Plumbing Requests
              </h2>

              <p className="text-lg leading-8 text-slate-600 mb-8">
                Piperesque is designed to help homeowners find a plumbing
                professional for urgent service. We do not employ or directly
                perform plumbing work. The independent provider handling the
                request is responsible for service availability, diagnosis,
                pricing, workmanship, and scheduling.
              </p>

              <div className="space-y-8">

                {/* Step 1 */}
                <div className="flex gap-5">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-lg">
                    1
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      Describe the Plumbing Problem
                    </h3>

                    <p className="text-slate-600 leading-7">
                      Tell the plumbing professional what is happening,
                      including where the problem is located, when it started,
                      whether water is actively leaking, and whether any
                      fixtures are affected.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-5">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-lg">
                    2
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      Check Provider Availability
                    </h3>

                    <p className="text-slate-600 leading-7">
                      The independent plumbing provider determines whether
                      service is available for your location and situation.
                      Availability can vary depending on time, location,
                      workload, and the type of plumbing problem.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-5">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-lg">
                    3
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      Professional Assessment
                    </h3>

                    <p className="text-slate-600 leading-7">
                      Once a provider accepts the request, the provider can
                      assess the plumbing problem and determine what work may
                      be required.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-5">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-lg">
                    4
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      Review the Recommended Work
                    </h3>

                    <p className="text-slate-600 leading-7">
                      Before authorizing non-emergency repair work, ask the
                      provider to explain the diagnosis, recommended repair,
                      expected scope of work, and applicable charges.
                    </p>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="flex gap-5">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-lg">
                    5
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      Complete the Service
                    </h3>

                    <p className="text-slate-600 leading-7">
                      If you approve the work, the independent plumbing
                      provider performs the agreed service according to its
                      own terms, qualifications, availability, and applicable
                      requirements.
                    </p>
                  </div>
                </div>

              </div>

              <div className="mt-10 rounded-lg bg-slate-50 border border-slate-200 p-6">
                <p className="text-sm leading-6 text-slate-600">
                  <strong className="text-slate-900">
                    Provider disclosure:
                  </strong>{" "}
                  Piperesque does not employ, dispatch, or directly perform
                  plumbing services. Service availability, response time,
                  pricing, qualifications, warranties, and workmanship are
                  determined by the independent plumbing provider handling the
                  request.
                </p>
              </div>
            </div>

            {/* Emergency Plumbing Cost */}
            <div className="mb-16 pb-16 border-b border-slate-200">
              <h2 className="text-3xl font-black mb-6">
                How Much Does Emergency Plumbing Cost in Houston?
              </h2>

              <p className="text-lg leading-8 text-slate-600 mb-6">
                There is no single price for emergency plumbing service.
                Pricing depends on the plumbing problem, required labor,
                materials, equipment, accessibility, time of service, and the
                independent provider's pricing structure.
              </p>

              <p className="text-lg leading-8 text-slate-600 mb-8">
                For example, repairing an accessible fixture can be very
                different from locating an underground leak, clearing a major
                sewer blockage, replacing damaged piping, or repairing a water
                heater. A professional inspection is often necessary before
                the exact scope and cost can be determined.
              </p>

              <div className="grid gap-6 md:grid-cols-2">

                <div className="rounded-lg border border-slate-200 p-6">
                  <h3 className="text-xl font-bold mb-3">
                    Factors That Can Affect Cost
                  </h3>

                  <ul className="space-y-3 text-slate-700">
                    <li>• Type and severity of the plumbing problem</li>
                    <li>• Labor required for diagnosis and repair</li>
                    <li>• Replacement parts and materials</li>
                    <li>• Specialized equipment or access requirements</li>
                    <li>• Location of the damaged plumbing</li>
                    <li>• Repair versus replacement</li>
                    <li>• Time and day of service</li>
                    <li>• Independent provider pricing and service terms</li>
                  </ul>
                </div>

                <div className="rounded-lg border border-slate-200 p-6">
                  <h3 className="text-xl font-bold mb-3">
                    Questions to Ask Before Authorizing Work
                  </h3>

                  <ul className="space-y-3 text-slate-700">
                    <li>
                      • Is there a service or diagnostic fee?
                    </li>
                    <li>
                      • What problem did the inspection identify?
                    </li>
                    <li>
                      • What repair is being recommended?
                    </li>
                    <li>
                      • Which parts or materials are required?
                    </li>
                    <li>
                      • Is the quoted amount for the complete scope of work?
                    </li>
                    <li>
                      • Are there additional charges that could apply?
                    </li>
                    <li>
                      • Does the provider offer any warranty, and what are its
                      terms?
                    </li>
                  </ul>
                </div>

              </div>

              <div className="mt-8 rounded-lg bg-yellow-50 border border-yellow-200 p-6">
                <h3 className="font-bold text-lg mb-3">
                  Important Pricing Information
                </h3>

                <p className="text-slate-700 leading-7">
                  Piperesque does not set plumbing prices and does not
                  guarantee a particular service cost. Pricing, fees, estimates,
                  payment terms, warranties, and any financing options are
                  determined directly by the independent plumbing provider.
                </p>
              </div>
            </div>

            {/* Immediate Homeowner Actions */}
            <div className="mb-16 pb-16 border-b border-slate-200">
              <h2 className="text-3xl font-black mb-6">
                What to Do Before Plumbing Help Arrives
              </h2>

              <p className="text-lg leading-8 text-slate-600 mb-8">
                If it is safe to do so, a few basic steps can help reduce
                additional damage while you arrange professional assistance.
              </p>

              <div className="space-y-5">

                <div className="flex gap-4">
                  <div className="mt-1">
                    <AlertTriangle className="text-red-600" size={22} />
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-1">
                      Stop or limit the water source when possible
                    </h3>

                    <p className="text-slate-600 leading-7">
                      If you can safely identify and access the appropriate
                      shutoff valve, limiting the water supply may reduce
                      additional water damage.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1">
                    <AlertTriangle className="text-red-600" size={22} />
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-1">
                      Protect belongings from active water
                    </h3>

                    <p className="text-slate-600 leading-7">
                      When safe, move valuables and household items away from
                      leaking or flooded areas.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1">
                    <AlertTriangle className="text-red-600" size={22} />
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-1">
                      Avoid electrical hazards
                    </h3>

                    <p className="text-slate-600 leading-7">
                      Do not enter standing water or handle electrical
                      equipment in a wet area when doing so could create an
                      electrical hazard.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1">
                    <AlertTriangle className="text-red-600" size={22} />
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-1">
                      Do not attempt dangerous repairs
                    </h3>

                    <p className="text-slate-600 leading-7">
                      Avoid dismantling plumbing systems or attempting repairs
                      that could increase property damage or create a safety
                      risk.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1">
                    <AlertTriangle className="text-red-600" size={22} />
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-1">
                      If you smell gas, leave the area
                    </h3>

                    <p className="text-slate-600 leading-7">
                      Do not attempt to locate or repair a suspected gas leak.
                      Leave the area and contact the appropriate emergency
                      service or gas utility provider according to local
                      safety guidance.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* CTA */}
            <div className="rounded-2xl bg-blue-950 p-8 md:p-10 text-white">
              <h2 className="text-3xl font-black mb-4">
                Need Emergency Plumbing Help in Houston?
              </h2>

              <p className="text-blue-100 text-lg leading-7 mb-6 max-w-2xl">
                If you have an urgent plumbing problem, contact Piperesque to
                request help connecting with an independent plumbing
                professional serving your area.
              </p>

              <a
                href="tel:+18773640861"
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-7 py-4 font-bold text-white hover:bg-red-700 transition"
              >
                <Phone size={20} />
                Call (877) 364-0861
              </a>

              <p className="mt-5 text-sm text-blue-200 leading-6">
                Provider availability, response time, pricing, qualifications,
                warranties, and workmanship are determined by the independent
                provider handling the request.
              </p>
            </div>

          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-6">
                <h3 className="text-xl font-bold mb-5">
                  Emergency Plumbing Help
                </h3>

                <div className="space-y-4">

                  <div className="flex items-start gap-3">
                    <Clock
                      size={22}
                      className="text-blue-600 mt-1 flex-shrink-0"
                    />
                    <div>
                      <p className="font-semibold">
                        Service Requests Available 24/7
                      </p>
                      <p className="text-sm text-slate-600 mt-1">
                        Provider availability may vary.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users
                      size={22}
                      className="text-blue-600 mt-1 flex-shrink-0"
                    />
                    <div>
                      <p className="font-semibold">
                        Independent Plumbing Providers
                      </p>
                      <p className="text-sm text-slate-600 mt-1">
                        Providers determine their own service terms.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Wrench
                      size={22}
                      className="text-blue-600 mt-1 flex-shrink-0"
                    />
                    <div>
                      <p className="font-semibold">
                        Houston Service Area
                      </p>
                      <p className="text-sm text-slate-600 mt-1">
                        Availability depends on the provider and location.
                      </p>
                    </div>
                  </div>

                </div>

                <a
                  href="tel:+18773640861"
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700 transition"
                >
                  <Phone size={18} />
                  Call for Help
                </a>
              </div>

              <div className="rounded-xl border border-slate-200 p-6">
                <h3 className="text-xl font-bold mb-4">
                  Related Plumbing Services
                </h3>

                <div className="space-y-3">

                  <Link
                    href="/location/houston/sewer-line-repair"
                    className="block text-blue-700 font-semibold hover:underline"
                  >
                    Sewer Line Repair in Houston
                  </Link>

                  <Link
                    href="/location/houston/drain-cleaning"
                    className="block text-blue-700 font-semibold hover:underline"
                  >
                    Drain Cleaning in Houston
                  </Link>

                  <Link
                    href="/location/houston/leak-detection"
                    className="block text-blue-700 font-semibold hover:underline"
                  >
                    Leak Detection in Houston
                  </Link>

                  <Link
                    href="/location/houston/water-heater-repair"
                    className="block text-blue-700 font-semibold hover:underline"
                  >
                    Water Heater Repair in Houston
                  </Link>

                </div>
              </div>

            </div>
          </aside>
        </div>
      </section>
            {/* Final FAQ + Trust Information */}
      <section className="py-20 md:py-28 bg-slate-50">
        <div className="container-custom max-w-5xl">

          {/* Why Piperesque */}
          <div className="mb-16">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-black mb-6">
                Why Use Piperesque for Emergency Plumbing Help?
              </h2>

              <p className="text-lg leading-8 text-slate-600 mb-8">
                Finding the right plumbing professional during an emergency
                can be difficult. Piperesque provides a simple way for
                Houston homeowners to request help and connect with
                independent plumbing providers.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">

              <div className="rounded-xl bg-white border border-slate-200 p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <Phone className="text-blue-700" size={24} />
                </div>

                <h3 className="text-xl font-bold mb-3">
                  Simple Contact Option
                </h3>

                <p className="text-slate-600 leading-7">
                  Homeowners can call the listed number to request plumbing
                  assistance without having to search through multiple
                  service listings.
                </p>
              </div>

              <div className="rounded-xl bg-white border border-slate-200 p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <Users className="text-blue-700" size={24} />
                </div>

                <h3 className="text-xl font-bold mb-3">
                  Independent Providers
                </h3>

                <p className="text-slate-600 leading-7">
                  Plumbing services are performed by independent providers.
                  Their qualifications, availability, pricing, and service
                  terms should be confirmed directly with the provider.
                </p>
              </div>

              <div className="rounded-xl bg-white border border-slate-200 p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <Clock className="text-blue-700" size={24} />
                </div>

                <h3 className="text-xl font-bold mb-3">
                  Emergency-Focused Information
                </h3>

                <p className="text-slate-600 leading-7">
                  The site provides information about common plumbing
                  emergencies, warning signs, immediate precautions, and
                  questions homeowners can ask a plumbing professional.
                </p>
              </div>

              <div className="rounded-xl bg-white border border-slate-200 p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <Wrench className="text-blue-700" size={24} />
                </div>

                <h3 className="text-xl font-bold mb-3">
                  Houston Service Focus
                </h3>

                <p className="text-slate-600 leading-7">
                  Piperesque focuses on helping homeowners looking for
                  plumbing assistance in Houston and surrounding service
                  areas.
                </p>
              </div>

            </div>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-3xl md:text-4xl font-black mb-8">
              Emergency Plumbing FAQs
            </h2>

            <div className="space-y-5">

              <details className="group rounded-xl bg-white border border-slate-200 p-6">
                <summary className="cursor-pointer list-none font-bold text-lg pr-8 relative">
                  What qualifies as a plumbing emergency?
                  <span className="absolute right-0 top-0 text-blue-600">
                    +
                  </span>
                </summary>

                <p className="mt-4 text-slate-600 leading-7">
                  A plumbing emergency may include an active burst pipe,
                  major water leak, sewer backup, overflowing fixture,
                  significant loss of water service, or another problem that
                  could cause property damage or require prompt professional
                  attention.
                </p>
              </details>

              <details className="group rounded-xl bg-white border border-slate-200 p-6">
                <summary className="cursor-pointer list-none font-bold text-lg pr-8 relative">
                  Is emergency plumbing help available 24/7 in Houston?
                  <span className="absolute right-0 top-0 text-blue-600">
                    +
                  </span>
                </summary>

                <p className="mt-4 text-slate-600 leading-7">
                  Piperesque accepts plumbing service requests at any time
                  and helps homeowners connect with independent plumbing
                  professionals. Provider availability varies by location,
                  time, and current service capacity.
                </p>
              </details>

              <details className="group rounded-xl bg-white border border-slate-200 p-6">
                <summary className="cursor-pointer list-none font-bold text-lg pr-8 relative">
                  How quickly can a plumbing professional respond?
                  <span className="absolute right-0 top-0 text-blue-600">
                    +
                  </span>
                </summary>

                <p className="mt-4 text-slate-600 leading-7">
                  Response times vary by provider, location, time of day,
                  current demand, and the type of plumbing problem. The
                  independent plumbing provider handling the request
                  determines availability and scheduling.
                </p>
              </details>

              <details className="group rounded-xl bg-white border border-slate-200 p-6">
                <summary className="cursor-pointer list-none font-bold text-lg pr-8 relative">
                  Does emergency plumbing cost more?
                  <span className="absolute right-0 top-0 text-blue-600">
                    +
                  </span>
                </summary>

                <p className="mt-4 text-slate-600 leading-7">
                  Emergency plumbing pricing varies by provider and may depend
                  on the type of problem, time of service, labor, materials,
                  equipment, accessibility, and whether repair or replacement
                  is required. Ask the provider about applicable service or
                  diagnostic fees before authorizing work.
                </p>
              </details>

              <details className="group rounded-xl bg-white border border-slate-200 p-6">
                <summary className="cursor-pointer list-none font-bold text-lg pr-8 relative">
                  Can I request emergency plumbing service online?
                  <span className="absolute right-0 top-0 text-blue-600">
                    +
                  </span>
                </summary>

                <p className="mt-4 text-slate-600 leading-7">
                  Yes. Homeowners can submit a plumbing service request
                  through Piperesque or call the listed phone number. The
                  request may then be connected with an independent plumbing
                  service provider serving the area.
                </p>
              </details>

              <details className="group rounded-xl bg-white border border-slate-200 p-6">
                <summary className="cursor-pointer list-none font-bold text-lg pr-8 relative">
                  Are plumbing providers licensed?
                  <span className="absolute right-0 top-0 text-blue-600">
                    +
                  </span>
                </summary>

                <p className="mt-4 text-slate-600 leading-7">
                  Licensing, insurance, qualifications, warranties, and
                  service terms are determined by the independent plumbing
                  provider. Homeowners should confirm applicable credentials
                  and terms directly with the provider before authorizing
                  work.
                </p>
              </details>

              <details className="group rounded-xl bg-white border border-slate-200 p-6">
                <summary className="cursor-pointer list-none font-bold text-lg pr-8 relative">
                  What should I do if a pipe bursts?
                  <span className="absolute right-0 top-0 text-blue-600">
                    +
                  </span>
                </summary>

                <p className="mt-4 text-slate-600 leading-7">
                  If it is safe to do so, stop or limit the water supply using
                  the appropriate shutoff valve and move belongings away from
                  active water. Avoid electrical hazards and seek professional
                  plumbing assistance for the damaged pipe.
                </p>
              </details>

              <details className="group rounded-xl bg-white border border-slate-200 p-6">
                <summary className="cursor-pointer list-none font-bold text-lg pr-8 relative">
                  What should I do if I smell gas?
                  <span className="absolute right-0 top-0 text-blue-600">
                    +
                  </span>
                </summary>

                <p className="mt-4 text-slate-600 leading-7">
                  Do not attempt to locate or repair a suspected gas leak.
                  Leave the area and contact the appropriate emergency service
                  or gas utility provider according to local safety guidance.
                </p>
              </details>

              <details className="group rounded-xl bg-white border border-slate-200 p-6">
                <summary className="cursor-pointer list-none font-bold text-lg pr-8 relative">
                  Does Piperesque perform the plumbing work?
                  <span className="absolute right-0 top-0 text-blue-600">
                    +
                  </span>
                </summary>

                <p className="mt-4 text-slate-600 leading-7">
                  No. Piperesque does not employ or directly perform plumbing
                  services. Piperesque helps homeowners connect with
                  independent plumbing professionals. Service availability,
                  pricing, qualifications, warranties, and workmanship are
                  determined by the provider handling the request.
                </p>
              </details>

            </div>
          </div>

        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-blue-950">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">

            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
              Need Emergency Plumbing Help in Houston?
            </h2>

            <p className="text-lg md:text-xl text-blue-100 leading-8 mb-8">
              If you are dealing with an urgent plumbing problem, contact
              Piperesque to request help connecting with an independent
              plumbing professional serving your area.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">

              <a
                href="tel:+18773640861"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-8 py-4 font-bold text-white hover:bg-red-700 transition"
              >
                <Phone size={20} />
                Call (877) 364-0861
              </a>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white px-8 py-4 font-bold text-white hover:bg-white hover:text-blue-950 transition"
              >
                Request Service
              </Link>

            </div>

            <p className="mt-7 text-sm text-blue-200 leading-6">
              Piperesque is an informational and connection service. It does
              not directly provide plumbing services. Provider availability,
              response times, pricing, qualifications, warranties, and
              workmanship are determined by the independent provider.
            </p>

          </div>
        </div>
      </section>

      {/* Structured Data */}
      <FAQSchema
        faqs={[
          {
            question: "What qualifies as a plumbing emergency?",
            answer:
              "A plumbing emergency may include an active burst pipe, major water leak, sewer backup, overflowing fixture, significant loss of water service, or another problem that could cause property damage or require prompt professional attention.",
          },
          {
            question: "Is emergency plumbing help available 24/7 in Houston?",
            answer:
              "Piperesque accepts plumbing service requests at any time and helps homeowners connect with independent plumbing professionals. Provider availability varies by location, time, and current service capacity.",
          },
          {
            question: "How quickly can a plumbing professional respond?",
            answer:
              "Response times vary by provider, location, time of day, current demand, and the type of plumbing problem. The independent plumbing provider handling the request determines availability and scheduling.",
          },
          {
            question: "Does emergency plumbing cost more?",
            answer:
              "Emergency plumbing pricing varies by provider and may depend on the type of problem, time of service, labor, materials, equipment, accessibility, and whether repair or replacement is required.",
          },
          {
            question: "Are plumbing providers licensed?",
            answer:
              "Licensing, insurance, qualifications, warranties, and service terms are determined by the independent plumbing provider. Homeowners should confirm applicable credentials and terms directly with the provider.",
          },
          {
            question: "Does Piperesque perform the plumbing work?",
            answer:
              "No. Piperesque does not employ or directly perform plumbing services. Piperesque helps homeowners connect with independent plumbing professionals.",
          },
        ]}
      />

      {/* Global CTA */}
      <CTA />

      <Footer />
    </main>
  );
}