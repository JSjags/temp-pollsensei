import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function PrivacyPolicy() {
  return (
    <div className="container max-w-5xl mx-auto py-8 px-0">
      <h1 className="text-3xl font-bold mb-6 text-center">
        PRIVACY POLICY FOR POLLSENSEI (BY OAKS INTELLIGENCE LTD)
      </h1>
      <p className="text-sm text-muted-foreground mb-8 text-center">
        Last Updated: 10 November 2024
      </p>

      <Card className="mb-8 shadow-none border-none">
        <CardHeader className="px-0">
          <CardTitle>Introduction</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <p>
            Oaks Intelligence Ltd. ("Oaks Intelligence," "we," "us," or "our")
            values your privacy. This Privacy Policy describes how Oaks
            Intelligence collects, uses, and shares your personal information
            when you access PollSensei's website, services, applications, and
            products (collectively, "PollSensei Services"). By using PollSensei
            Services, you consent to the practices outlined in this Privacy
            Policy.
          </p>
        </CardContent>
      </Card>

      {[
        {
          title: "What Personal Information Does PollSensei Collect?",
          content:
            "We collect your personal information to operate and improve PollSensei Services. The types of information we collect include:\n• Information You Provide to Us: When you create an account, participate in surveys, or contact us, we collect the information you provide, such as your name, email, and phone number.\n• Automatically Collected Information: PollSensei automatically collects certain information about your device and usage, including IP address, device type, browser type, pages visited, and timestamps. We may use tokens or other identifiers to enhance functionality and monitor usage.\n• Information from Third Parties: If you interact with third-party services integrated with PollSensei (e.g., for authentication or ads), we may receive information from these sources, as permitted by their policies.",
        },
        {
          title: "How Does PollSensei Use Your Personal Information?",
          content:
            "We use personal information for various purposes, including:\n• Providing and Improving PollSensei Services: We use personal information to operate PollSensei, enhance its features, troubleshoot issues, and analyze performance.\n• Personalizing Your Experience: Based on your activity and preferences, we tailor your experience with PollSensei by recommending features, tools, or content.\n• Security and Fraud Prevention: Personal information helps us protect PollSensei, our users, and others from fraud, abuse, or unauthorized access.\n• Legal Compliance: We may collect and use personal information as required by applicable laws, including identity verification and data retention.",
        },
        {
          title: "Cookies and Other Identifiers",
          content:
            "PollSensei uses tokens, similar to cookies, to identify users, improve functionality, and deliver a personalized experience. These identifiers enable us to recognize your device and enhance your use of PollSensei Services.",
        },
        {
          title: "Does PollSensei Share Your Personal Information?",
          content:
            "Your personal information is shared only as follows:\n• Third-Party Service Providers: We engage trusted third-party providers to assist with various tasks, such as payment processing, data analysis, customer support, and marketing. These providers access personal information only as needed for their tasks and may not use it for other purposes.\n• Business Transfers: In the event of a merger, acquisition, or asset sale, user information may be transferred as part of the transaction, subject to the terms in place at the time.\n• Protection of PollSensei and Others: We may release personal information to comply with legal obligations or protect the rights, property, or safety of Oaks Intelligence, our users, or others. This includes sharing information with other companies for fraud prevention and credit risk reduction.\n\nOther than as outlined above, you will be notified if personal information is shared with other third parties, and you will have the opportunity to consent or object to the sharing.",
        },
        {
          title: "How Secure Is My Information?",
          content:
            "We prioritize the security of your personal information and implement appropriate safeguards:\n• Security Practices: We maintain physical, electronic, and procedural safeguards to protect personal data. Users are encouraged to keep their account credentials secure to prevent unauthorized access.",
        },
        {
          title: "Children and PollSensei Services",
          content:
            "PollSensei is not intended for use by children under the age of 18, and we do not knowingly collect personal information from children. If we become aware that we have collected data from a child, we will promptly delete it.",
        },
        {
          title: "Advertising and Links to Other Websites",
          content:
            "PollSensei may contain links to third-party websites or display content from third-party advertisers. These sites are governed by their privacy policies, and we encourage you to review them. PollSensei does not share personal information with advertisers.",
        },
        {
          title: "Conditions of Use, Notices, and Revisions",
          content:
            "By using PollSensei Services, you agree to this Privacy Policy. Any disputes over privacy are governed by our Terms of Use and applicable laws. This Privacy Policy may be updated periodically to reflect changes in practices, legal requirements, or improvements to PollSensei Services.",
        },
        {
          title: "Contact Information",
          content:
            "For questions or concerns about this Privacy Policy, please contact us at:\n\nOaks Intelligence Ltd.\n\nEmail: security@oaksintelligence.co\n\nAddress:\nOaks Intelligence Limited\n20 Foxborough Gardens\nBristol BS32 0BT\nUnited Kingdom",
        },
      ].map((section, index) => (
        <Card key={index} className="mb-4 shadow-none border-none">
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
