import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/brainexa/Navbar";
import { Footer } from "@/components/brainexa/Footer";
import { SectionHeading } from "@/components/brainexa/SectionHeading";

export const Route = createFileRoute("/refund")({
  head: () => ({
    meta: [
      { title: "Refund Policy — BRAINEXA" },
      {
        name: "description",
        content:
          "BRAINEXA refund policy for course purchases, duplicate payments, payment gateway issues, and exceptional refund cases.",
      },
    ],
  }),
  component: RefundPage,
});

const POLICY_SECTIONS = [
  {
    title: "1. Strict No Refund Policy",
    titleHi: "सख्त नो रिफंड पालिसी",
    paragraphs: [
      [
        "All course purchases made on BRAINEXA are final and non-refundable.",
        "BRAINEXA पर किए गए सभी कोर्स खरीद अंतिम (Final) और नॉन-रिफंडेबल हैं।",
      ],
      [
        "Once payment has been successfully completed and course access has been granted, refund requests will not be accepted under normal circumstances.",
        "एक बार भुगतान सफलतापूर्वक पूरा हो जाने और कोर्स एक्सेस प्रदान किए जाने के बाद सामान्य परिस्थितियों में किसी भी प्रकार का रिफंड स्वीकार नहीं किया जाएगा।",
      ],
      [
        "Refund requests will not be accepted for reasons including but not limited to:",
        "निम्न कारणों से रिफंड का अनुरोध स्वीकार नहीं किया जाएगा, जिनमें शामिल हैं लेकिन केवल इन्हीं तक सीमित नहीं हैं:",
      ],
    ],
    bullets: [
      ["Change of mind after purchase", "कोर्स खरीदने के बाद मन बदल जाना"],
      [
        "Lack of time to complete the course",
        "कोर्स पूरा करने के लिए समय न मिलना",
      ],
      [
        "Not understanding the course content",
        "कोर्स की सामग्री समझ में न आना",
      ],
      ["Accidental purchase", "गलती से कोर्स खरीद लेना"],
      [
        "Device, browser or internet issues",
        "डिवाइस, ब्राउज़र या इंटरनेट समस्या",
      ],
      [
        "Dissatisfaction after accessing course content",
        "कोर्स एक्सेस करने के बाद असंतोष",
      ],
    ],
    closing: [
      [
        "Users are advised to carefully review the course details before purchasing.",
        "उपयोगकर्ताओं को सलाह दी जाती है कि कोर्स खरीदने से पहले उसकी जानकारी ध्यान से पढ़ लें।",
      ],
    ],
  },
  {
    title: "2. Course Access Policy",
    titleHi: "कोर्स एक्सेस नीति",
    paragraphs: [
      [
        "After successful payment, the purchased course will be available in the student dashboard.",
        "सफल भुगतान के बाद खरीदा गया कोर्स स्टूडेंट डैशबोर्ड में उपलब्ध होगा।",
      ],
      [
        "Course access may be limited depending on platform rules or session limits.",
        "कोर्स एक्सेस प्लेटफ़ॉर्म के नियमों या सत्र सीमाओं के अनुसार सीमित हो सकता है।",
      ],
      [
        "Since course content becomes accessible immediately after purchase, it is considered consumed and therefore refunds cannot be requested.",
        "क्योंकि कोर्स सामग्री खरीद के तुरंत बाद उपलब्ध हो जाती है, इसलिए इसे उपयोग किया हुआ माना जाएगा और इस स्थिति में रिफंड का अनुरोध स्वीकार नहीं किया जाएगा।",
      ],
    ],
  },
  {
    title: "3. Personal Responsibility Before Purchase",
    titleHi: "खरीद से पहले उपयोगकर्ता की जिम्मेदारी",
    paragraphs: [
      [
        "It is the user's responsibility to ensure that:",
        "उपयोगकर्ता की जिम्मेदारी है कि:",
      ],
    ],
    bullets: [
      [
        "The course meets their learning needs",
        "कोर्स उनकी सीखने की आवश्यकता को पूरा करता है",
      ],
      [
        "Their device and internet support video playback",
        "डिवाइस और इंटरनेट वीडियो चलाने के लिए उपयुक्त है",
      ],
      [
        "They understand the course description and structure",
        "वे कोर्स का विवरण और संरचना समझते हैं",
      ],
    ],
    closing: [
      [
        "BRAINEXA will not be responsible for technical issues arising from the user's device.",
        "यदि उपयोगकर्ता के डिवाइस या तकनीकी सीमाओं के कारण कोई समस्या आती है, तो BRAINEXA इसके लिए जिम्मेदार नहीं होगा।",
      ],
    ],
  },
  {
    title: "4. Duplicate Payments",
    titleHi: "डुप्लीकेट भुगतान",
    paragraphs: [
      [
        "If a user accidentally makes duplicate payments for the same course, they must contact us within 24 hours with valid proof such as a transaction ID or screenshot.",
        "यदि गलती से एक ही कोर्स के लिए दो बार भुगतान हो जाता है, तो उपयोगकर्ता को 24 घंटे के भीतर ट्रांज़ैक्शन आईडी या स्क्रीनशॉट के साथ संपर्क करना होगा।",
      ],
      [
        "After verification, only the extra payment may be refunded.",
        "जांच के बाद केवल अतिरिक्त भुगतान (Extra Payment) को ही रिफंड किया जा सकता है।",
      ],
    ],
  },
  {
    title: "5. Payment Gateway Issues",
    titleHi: "पेमेंट गेटवे से संबंधित समस्याएं",
    paragraphs: [
      [
        "All payments on BRAINEXA are processed through secure third-party payment gateways.",
        "BRAINEXA पर सभी भुगतान सुरक्षित थर्ड-पार्टी पेमेंट गेटवे के माध्यम से किए जाते हैं।",
      ],
      [
        "If a payment fails but the amount is deducted, the bank usually refunds it within 5–7 business days.",
        "यदि भुगतान असफल हो जाता है लेकिन राशि कट जाती है, तो बैंक आमतौर पर 5–7 कार्यदिवसों में राशि वापस कर देता है।",
      ],
    ],
  },
  {
    title: "6. Unauthorized Transactions",
    titleHi: "अनाधिकृत लेनदेन",
    paragraphs: [
      [
        "If a user believes that a payment was made without authorization, they must notify BRAINEXA within 24 hours.",
        "यदि किसी उपयोगकर्ता को लगता है कि बिना अनुमति के भुगतान किया गया है, तो उन्हें 24 घंटे के भीतर BRAINEXA को सूचित करना होगा।",
      ],
      [
        "The case will be investigated and appropriate action may be taken.",
        "मामले की जांच की जाएगी और उचित कार्रवाई की जाएगी।",
      ],
    ],
  },
  {
    title: "7. Exceptional Refund Cases",
    titleHi: "विशेष परिस्थितियों में रिफंड",
    paragraphs: [
      [
        "Refunds may only be considered in rare cases such as:",
        "रिफंड केवल निम्न विशेष परिस्थितियों में विचार किया जा सकता है:",
      ],
    ],
    bullets: [
      ["Duplicate payment", "डुप्लिकेट भुगतान"],
      [
        "Platform technical error preventing access",
        "प्लेटफ़ॉर्म की तकनीकी त्रुटि",
      ],
      [
        "Incorrect course access due to system error",
        "सिस्टम की गलती से गलत कोर्स एक्सेस",
      ],
    ],
    closing: [
      [
        "The final decision will remain solely with BRAINEXA.",
        "अंतिम निर्णय BRAINEXA का होगा।",
      ],
    ],
  },
  {
    title: "8. Refund Processing Time",
    titleHi: "रिफंड प्रोसेसिंग समय",
    paragraphs: [
      [
        "If a refund is approved, it will be processed within 5–10 business days.",
        "यदि रिफंड स्वीकृत होता है, तो इसे 5–10 कार्यदिवसों में प्रोसेस किया जाएगा।",
      ],
    ],
  },
  {
    title: "9. Policy Updates",
    titleHi: "नीति में परिवर्तन",
    paragraphs: [
      [
        "BRAINEXA reserves the right to update or modify this policy at any time without prior notice.",
        "BRAINEXA इस नीति को बिना पूर्व सूचना के अपडेट या संशोधित करने का अधिकार रखता है।",
      ],
    ],
  },
  {
    title: "10. Agreement",
    titleHi: "सहमति",
    paragraphs: [
      [
        "By purchasing any course on BRAINEXA, you confirm that you have read, understood, and agreed to this Refund Policy.",
        "BRAINEXA पर किसी भी कोर्स को खरीदकर आप पुष्टि करते हैं कि आपने इस नीति को पढ़ लिया है, समझ लिया है और इससे सहमत हैं।",
      ],
    ],
  },
];

const IMPORTANT_NOTICE = [
  "Note: In case of any conflict or interpretation issue, the English version will be considered the official and legally valid version.",
  "नोट: किसी भी विवाद या व्याख्या में अंतर की स्थिति में अंग्रेजी संस्करण ही आधिकारिक और कानूनी रूप से मान्य माना जाएगा।",
];

function RefundPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Legal"
          title="Refund Policy"
          subtitle="English and Hindi policy for course purchases, duplicate payments, and exceptional refund cases."
        />

        <div className="mt-10 space-y-6">
          {POLICY_SECTIONS.map((section) => (
            <PolicyCard key={section.title} section={section} />
          ))}

          <div className="rounded-2xl border border-gold/30 bg-gold/10 p-6 text-sm leading-relaxed shadow-soft sm:p-8">
            <h2 className="text-xl font-bold text-foreground">
              Important Notice
            </h2>
            <p className="mt-1 font-semibold text-gold">महत्वपूर्ण सूचना</p>
            <div className="mt-4 space-y-2">
              <p className="font-medium text-foreground">
                {IMPORTANT_NOTICE[0]}
              </p>
              <p className="text-muted-foreground">{IMPORTANT_NOTICE[1]}</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

type BilingualLine = [string, string];

type PolicySection = {
  title: string;
  titleHi: string;
  paragraphs: BilingualLine[];
  bullets?: BilingualLine[];
  closing?: BilingualLine[];
};

function PolicyCard({ section }: { section: PolicySection }) {
  return (
    <section className="rounded-2xl bg-card p-6 text-sm leading-relaxed text-muted-foreground ring-1 ring-border shadow-soft sm:p-8">
      <h2 className="text-xl font-bold text-foreground">{section.title}</h2>
      <p className="mt-1 font-semibold text-primary">{section.titleHi}</p>

      <div className="mt-5 space-y-4">
        {section.paragraphs.map(([en, hi]) => (
          <BilingualText key={en} en={en} hi={hi} />
        ))}

        {section.bullets && (
          <ul className="space-y-3 rounded-xl bg-muted/40 p-4">
            {section.bullets.map(([en, hi]) => (
              <li key={en} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <div>
                  <p className="font-medium text-foreground">{en}</p>
                  <p className="mt-1 text-muted-foreground">{hi}</p>
                </div>
              </li>
            ))}
          </ul>
        )}

        {section.closing?.map(([en, hi]) => (
          <BilingualText key={en} en={en} hi={hi} />
        ))}
      </div>
    </section>
  );
}

function BilingualText({ en, hi }: { en: string; hi: string }) {
  return (
    <div className="space-y-1">
      <p className="font-medium text-foreground">{en}</p>
      <p>{hi}</p>
    </div>
  );
}
