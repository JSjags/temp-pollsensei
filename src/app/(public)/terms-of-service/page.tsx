import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function TermsAndConditions() {
  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        TERMS AND CONDITIONS FOR THE USE OF POLLSENSEI
      </h1>
      <p className="text-sm text-muted-foreground mb-8 text-center">
        Last Updated: 10 November 2024
      </p>

      <Card className="mb-8 shadow-none border-none px-0">
        <CardHeader className="px-0">
          <CardTitle>Welcome to PollSensei</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <p>
            Oaks Intelligence Ltd. ("Oaks Intelligence") provides website
            features, mobile applications, and other products and services for
            you through PollSensei (collectively, "PollSensei Services"). By
            accessing PollSensei, you agree to these terms and conditions.
            Please also refer to our Privacy Policy to understand how we collect
            and process your personal information. PollSensei is an AI-driven
            survey and data analysis tool designed to simplify and enhance
            survey creation, data collection, and reporting.
          </p>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-semibold mb-4">CONDITIONS OF USE</h2>
      <p className="mb-6">
        Please read these conditions carefully before using PollSensei. By using
        PollSensei, you signify your agreement to these terms.
      </p>

      {[
        {
          title: "1. Electronic Communications",
          content:
            "When you use PollSensei or communicate with us electronically, you consent to receive communications from us electronically, including by email, in-app notifications, or by posting notices on PollSensei. You agree that all communications we provide electronically satisfy any legal requirements for written communication unless mandatory laws require otherwise.",
        },
        {
          title: "2. Personalization and Recommendations",
          content:
            "PollSensei may recommend features, surveys, or data analysis tools that may interest you based on your usage to personalize and optimize your experience on PollSensei.",
        },
        {
          title: "3. Copyright and Proprietary Rights",
          content:
            "All content within PollSensei—including text, graphics, logos, button icons, images, and data compilations—is the property of Oaks Intelligence or its content suppliers and is protected by copyright and database right laws. Thus, while Oaks Intelligence Ltd. retains ownership of the platform's tools and functionalities, users retain rights to their survey content and collected data. You may not extract or re-utilize any content or substantial parts of PollSensei without express written permission from Oaks Intelligence or a content provider. Unauthorized use may result in legal action.",
        },
        {
          title: "4. Trademarks",
          content:
            "PollSensei, Oaks Intelligence, and associated trademarks, graphics, logos, and service names appearing on PollSensei are trademarks of Oaks Intelligence. You may not use these marks in any way that causes confusion, discredits, or disparages PollSensei.",
        },
        {
          title: "5. License and Access",
          content:
            "Oaks Intelligence grants you a limited, non-exclusive, non-transferable license to access and make personal, non-commercial use of PollSensei Services. This license does not permit resale or commercial use, data mining, or automated data gathering. Unauthorized use will result in termination of the license.",
        },
        {
          title: "6. Your Account",
          content:
            "You may need an account with PollSensei to access certain services, including the option to purchase PollCoins or access premium features. You are responsible for maintaining the confidentiality of your account credentials and for any activity on your account. Oaks Intelligence reserves the right to refuse service or terminate accounts at its discretion.",
        },
        {
          title: "7. Beta Testing Participation",
          content:
            'PollSensei is currently available only for beta testing purposes, subject to user eligibility and confidentiality obligations. Beta users may report issues and provide feedback, which Oaks Intelligence may use to improve the product. Beta features are provided "as is" and without warranty.',
        },
        {
          title: "8. PollCoin System",
          content:
            "PollSensei uses a virtual coin system for certain features:\n• Earning Coins: PollCoins may be earned through activities such as completing surveys or referrals.\n• Purchasing Coins: PollCoins may be purchased through authorized channels within PollSensei.\n• Conversion and Withdrawal: PollCoins may be converted to a monetary value upon meeting a minimum threshold, subject to Oaks Intelligence's approval.",
        },
        {
          title: "9. User Roles and Permissions",
          content:
            "• Roles: Users can register as Survey Creators or Paid Respondents. All users must be 18 years or older to access paid features or to act as data collectors, validators, or analysts. PollSensei supports multiple roles within teams, including data collectors, validators, analysts, and administrators. Roles can be assigned by team administrators, and each role is assigned specific permissions.\n• Responsibilities: Users must follow ethical guidelines when creating surveys and are responsible for any data collected through their surveys. Users are responsible for maintaining the confidentiality of their accounts and for all activities that occur under their accounts.",
        },
        {
          title: "10. Intellectual Property Claims",
          content:
            "If you believe your intellectual property rights are infringed on PollSensei, please notify us via email. Oaks Intelligence may take appropriate actions, including removing or blocking access to the infringing content.",
        },
        {
          title: "11. Software and Updates",
          content:
            "PollSensei may include software updates, which you may use solely to access and enjoy PollSensei Services. Unauthorized tampering, reverse engineering, or creating derivative works is prohibited.",
        },
        {
          title: "12. Survey Creation and Distribution",
          content:
            "• Automated Tools: PollSensei's AI tools assist with question generation, formatting, and scheduling. Users may distribute surveys to third-party platforms such as WhatsApp and social media.\n• Question Flow Logic: Users can utilize question flow logic for tailored survey experiences, filtering respondents based on predefined criteria.",
        },
        {
          title: "13. Disclaimers and Limitation of Liability",
          content:
            "Oaks Intelligence endeavors to ensure uninterrupted access to PollSensei but cannot guarantee it due to internet and technical limitations. Oaks Intelligence is not liable for indirect, incidental, or consequential damages arising from your use of PollSensei.",
        },
        {
          title: "14. Alterations to Service or Terms",
          content:
            "We reserve the right to make changes to PollSensei, our policies, and these terms. Users are encouraged to review the terms regularly. Continued use signifies acceptance of any changes.",
        },
        {
          title: "15. Governing Law and Dispute Resolution",
          content: "These terms are governed by the laws of Nigeria.",
        },
        {
          title: "Additional Notes",
          content:
            "1. Children's Privacy: PollSensei is intended for users aged 18 and above. Children under the age of 18 are not permitted to use PollSensei for paid features.\n2. Beta Feature Terms: For users participating in beta testing, additional confidentiality agreements may apply. Beta users should report bugs and errors they encounter to help improve PollSensei's features.",
        },
      ].map((section, index) => (
        <Card key={index} className="mb-4 shadow-none border-none px-0">
          <CardHeader className="px-0">
            <CardTitle className="text-lg">{section.title}</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <p className="whitespace-pre-line">{section.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
