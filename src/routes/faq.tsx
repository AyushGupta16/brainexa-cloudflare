import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/brainexa/Navbar";
import { Footer } from "@/components/brainexa/Footer";
import { SectionHeading } from "@/components/brainexa/SectionHeading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — BRAINEXA" },
      {
        name: "description",
        content:
          "Frequently asked questions about BRAINEXA courses, account access, payments, referrals, certificates, security, and support.",
      },
    ],
  }),
  component: FaqPage,
});

const FAQS = [
  {
    q: "What is BRAINEXA?",
    qHi: "BRAINEXA क्या है?",
    a: "BRAINEXA is an online learning platform where you can learn professional courses across various subjects and skills.",
    aHi: "BRAINEXA एक ऑनलाइन लर्निंग प्लेटफॉर्म है जहाँ आप विभिन्न विषयों और स्किल्स से जुड़े प्रोफेशनल कोर्स सीख सकते हैं।",
  },
  {
    q: "How can I create an account on BRAINEXA?",
    qHi: "BRAINEXA पर अकाउंट कैसे बनाएं?",
    a: 'Click on Student Login and choose "Continue with Google". Your account will be created instantly.',
    aHi: "Student Login पर क्लिक करें और Continue with Google से लॉगिन करें। आपका अकाउंट तुरंत बन जाएगा।",
  },
  {
    q: "Are BRAINEXA courses free or paid?",
    qHi: "क्या BRAINEXA के कोर्स फ्री हैं या paid?",
    a: "Some courses are free, while others are paid. Once you purchase a paid course, you get full access.",
    aHi: "कुछ कोर्स फ्री हो सकते हैं और कुछ paid होते हैं। Paid course खरीदने के बाद आपको पूरा access मिल जाता है।",
  },
  {
    q: "How do I access a course after purchase?",
    qHi: "कोर्स खरीदने के बाद access कैसे मिलेगा?",
    a: "After successful payment, the course will be automatically available in your Student Dashboard.",
    aHi: "Payment सफल होने के बाद आपका course automatically Student Dashboard में enroll हो जाएगा।",
  },
  {
    q: "Can I watch courses on mobile?",
    qHi: "क्या मैं मोबाइल से कोर्स देख सकता हूँ?",
    a: "Yes, BRAINEXA works on mobile, tablet, and computer devices.",
    aHi: "हाँ, BRAINEXA वेबसाइट मोबाइल, टैबलेट और कंप्यूटर सभी डिवाइस पर काम करती है।",
  },
  {
    q: "Can I watch the course multiple times?",
    qHi: "क्या मैं कोर्स बार-बार देख सकता हूँ?",
    a: "No, BRAINEXA courses are available with single session access.",
    aHi: "नहीं, BRAINEXA के कोर्स single session access के साथ आते हैं।",
  },
  {
    q: "What is the BRAINEXA Referral Program?",
    qHi: "BRAINEXA Referral Program क्या है?",
    a: "If you invite friends and they purchase a course using your referral, you may earn rewards.",
    aHi: "अगर आप अपने दोस्तों को invite करते हैं और वे आपके referral से course खरीदते हैं, तो आपको reward मिल सकता है।",
  },
  {
    q: "How can I share my referral link?",
    qHi: "Referral Link कैसे share करें?",
    a: "You can get your referral link from the Student Dashboard and share it via WhatsApp, Telegram, or social media.",
    aHi: "आप Student Dashboard से referral link प्राप्त करके WhatsApp, Telegram या सोशल मीडिया पर share कर सकते हैं।",
  },
  {
    q: "What should I do if I face login or payment issues?",
    qHi: "लॉगिन या पेमेंट समस्या होने पर क्या करें?",
    a: "You can contact us through the Contact Us page.",
    aHi: "आप Contact Us पेज के माध्यम से हमसे संपर्क कर सकते हैं।",
  },
  {
    q: "Will I get a certificate?",
    qHi: "क्या certificate मिलता है?",
    a: "Some courses may provide a completion certificate.",
    aHi: "कुछ courses में completion certificate दिया जा सकता है।",
  },
  {
    q: "Is BRAINEXA secure?",
    qHi: "क्या BRAINEXA सुरक्षित है?",
    a: "Yes, BRAINEXA is a secure platform and payments are processed safely.",
    aHi: "हाँ, BRAINEXA एक सुरक्षित प्लेटफॉर्म है और पेमेंट सुरक्षित तरीके से किया जाता है।",
  },
  {
    q: "Can I share my course with others?",
    qHi: "क्या कोर्स शेयर कर सकते हैं?",
    a: "No, courses are strictly for the account that purchased them.",
    aHi: "नहीं, कोर्स केवल उसी अकाउंट के लिए होता है जिसने उसे खरीदा है।",
  },
  {
    q: "How can I contact BRAINEXA?",
    qHi: "BRAINEXA से संपर्क कैसे करें?",
    a: "You can reach us through the Contact Us page.",
    aHi: "आप Contact Us पेज के माध्यम से हमसे संपर्क कर सकते हैं।",
  },
];

function FaqPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Help Center"
          title="Frequently Asked Questions"
          subtitle="English and Hindi answers to common questions about BRAINEXA."
        />

        <Accordion
          type="single"
          collapsible
          className="mt-10 rounded-2xl bg-card p-2 ring-1 ring-border shadow-soft"
        >
          {FAQS.map((f, i) => (
            <AccordionItem
              key={f.q}
              value={`item-${i}`}
              className="border-border px-4 last:border-b-0"
            >
              <AccordionTrigger className="py-5 text-left hover:no-underline">
                <div>
                  <p className="text-base font-semibold text-foreground">
                    {f.q}
                  </p>
                  <p className="mt-1 text-sm font-medium text-primary">
                    {f.qHi}
                  </p>
                </div>
              </AccordionTrigger>

              <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                <div className="space-y-2">
                  <p className="font-medium text-foreground">{f.a}</p>
                  <p>{f.aHi}</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </main>
      <Footer />
    </div>
  );
}
