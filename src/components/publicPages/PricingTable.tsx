import React from 'react';

const PricingTable: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 overflow-x-auto">
      <h2 className="text-2xl font-semibold text-center mb-8">Compare Our Plans</h2>
      <table className="w-full border-collapse border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="w-1/4 p-4 border border-gray-200 font-semibold text-left"></th>
            <th className="w-1/4 p-4 border border-gray-200 font-semibold text-center">Basic</th>
            <th className="w-1/4 p-4 border border-gray-200 font-semibold text-center">Pro</th>
            <th className="w-1/4 p-4 border border-gray-200 font-semibold text-center">Team</th>
          </tr>
        </thead>
        <tbody>
          {[
            { feature: 'Unlimited Access', basic: '✔️', pro: '✔️', team: '✔️' },
            { feature: 'Account', basic: '1 Account', pro: '1 Account', team: '2 or more' },
            { feature: '200 Monthly Responses', basic: '200', pro: '10,000', team: 'Unlimited' },
            { feature: 'AI Survey/Poll Generation', basic: '5 Prompt by month', pro: 'Monthly Access', team: 'Monthly Access' },
            { feature: 'Data Export (PDF)', basic: 'PDF Only', pro: 'XLS, PDF, PPT', team: 'XLS, PDF, PPT, Power BI' },
            { feature: 'Add Contributors', basic: '-', pro: 'Up to 4', team: 'Unlimited' },
            { feature: 'Unlimited Polls and Surveys', basic: '-', pro: '✔️', team: '✔️' },
            { feature: 'Account Customization', basic: '-', pro: '✔️', team: '✔️' },
            { feature: 'Offline Data Collection and Analytics', basic: '-', pro: '✔️', team: '✔️' },
            { feature: 'AI Survey Assistant', basic: '-', pro: '✔️', team: '✔️' },
            { feature: 'Automatic AI Survey Reporting', basic: '-', pro: '✔️', team: '✔️' },
            { feature: 'Speech-to-Text Feature', basic: '-', pro: '✔️', team: '✔️' },
            { feature: 'A/B Testing & Randomization', basic: '-', pro: '-', team: '✔️' },
            { feature: 'Skip Logic', basic: '-', pro: '-', team: '✔️' },
            { feature: 'Multilingual Survey Support', basic: '-', pro: '-', team: '✔️' },
            { feature: 'Early Beta Feature', basic: '-', pro: '-', team: '✔️' },
            { feature: 'Priority Email Support', basic: '-', pro: '✔️', team: '✔️' },
            { feature: 'Dedicated Customer Success Manager', basic: '-', pro: '-', team: '✔️' },
          ].map((row, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="p-4 border border-gray-200 text-left font-medium">{row.feature}</td>
              <td className="p-4 border border-gray-200 text-center">{row.basic}</td>
              <td className="p-4 border border-gray-200 text-center">{row.pro}</td>
              <td className="p-4 border border-gray-200 text-center">{row.team}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PricingTable;
