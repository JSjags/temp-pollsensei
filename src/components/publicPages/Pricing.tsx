import Link from 'next/link';
import React from 'react'

const Pricing = () => {
  const plans = [
    {
      name: "Free",
      price: "$9.99",
      description:
        "Perfect for individuals and small teams just getting started.",
      features: [
        "Access to all basic features",
        "Basic reporting and analytics",
        "Up to 10 individual users",
        "20GB individual data each user",
        "Basic chat and email support",
      ],
    },
    {
      name: "Pro",
      price: "$29.99",
      description:
        "Ideal for growing businesses that need more power and flexibility.",
      features: [
        "Access to all basic features",
        "Basic reporting and analytics",
        "Up to 10 individual users",
        "Custom branding",
        "Team collaboration tools",
        "Advanced question types",
        "Survey logic and branching",
      ],
    },
    {
      name: "Business",
      price: "$30.99",
      description:
        "Tailored solutions for large organizations with complex needs.",
      features: [
        "All Pro features",
        "Dedicated account manager",
        "API access",
        "On-premise deployment",
        "Single Sign-On (SSO)",
        "Advanced security features",
        "Custom integrations",
      ],
    },
  ];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    {plans.map((plan, index) => (
      <div
        key={index}
        data-aos="fade-up"
        data-aos-delay={index * 100}
        className="bg-[#150327] rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col"
      >
        <div className="flex-grow">
          {/* <div className="flex justify-center">{plan.icon}</div> */}
          <h2 className="text-2xl font-semibold mb-4  text-center">
            {plan.name}
          </h2>
          <p className="text-4xl font-bold mb-4 text-white text-center">
            {plan.price}
            {plan.name !== "Enterprise" && (
              <span className="text-lg font-normal ">
                /month
              </span>
            )}
          </p>
          <p className="text-gray-600 mb-6 text-center">
            {plan.description}
          </p>
          <ul className="mb-8 space-y-3">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 bg-[#E7D7FB] rounded-full text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                {feature}
              </li>
            ))}
          </ul>
          {index > 0 && (
            <p className="text-sm text-gray-600 mb-4 text-center">
              Includes all features from {plans[index - 1].name} plan
            </p>
          )}
        </div>
        <Link
          href="/register"
          className="block w-full bg-[#5B03B2] text-white text-center py-3 rounded-md hover:bg-opacity-80 transition-colors duration-300 mt-auto"
        >
          {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
        </Link>
      </div>
    ))}
  </div>
  )
}

export default Pricing
