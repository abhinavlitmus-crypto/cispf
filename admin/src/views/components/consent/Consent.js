import React, { useMemo, useState } from "react";
import { useConsentValidateMutation } from "../../../query/consent.query";

const initialForm = {
  phone: "",
  language: "en",
  fullName: "",
  dob: "",
  consent: false,
};

const LANG_OPTIONS = [
  { value: "en", label: "English" },
  { value: "gu", label: "Gujarati" },
  { value: "mr", label: "Marathi" },
  { value: "bn", label: "Bengali" },
  { value: "kn", label: "Kannada" },
  { value: "te", label: "Telugu" },
];

/**
 * NOTE:
 * These translations are best-effort and should be reviewed by your clinical/legal team
 * for exact wording and compliance in each language.
 */
const I18N = {
  en: {
    title: "Consent Form",
    step1Hint: "Enter your phone number to continue.",
    step2Hint: "Read the consent text and submit your consent.",
    step1: "Step 1",
    step2: "Step 2",

    phoneLabel: "Phone Number",
    phonePlaceholder: "10-digit phone number",
    digitsHint: (n) => `${n}/10 digits`,
    next: "Next",
    validating: "Validating...",

    phoneDisplay: "Phone:",
    change: "Change",
    languageLabel: "Language",

    consentTitle: "PrEPARED Project – Client Consent Form for Initiating PrEP",
    consentIntro:
      "PrEP (Pre-Exposure Prophylaxis) is a regular medication used to prevent HIV infection. When taken correctly, it is highly effective. Regular HIV testing, follow-up, and health monitoring are part of the protocol.",
    confidentialityTitle: "Confidentiality",
    confidentiality1: "All information provided by you will be kept strictly confidential.",
    confidentiality2:
      "Your data will be anonymized for analysis, meaning your personal information (name, contact details) will not be linked to any data used for reporting or research.",
    confidentiality3: "Only authorized project staff will have access to your data.",

    nameLabel: "Name *",
    namePlaceholder: "Enter your name",
    dobLabel: "Date of Birth *",

    consentStatementsTitle: "Consent Statements",
    consentStatements: [
      "I have understood the information provided about PrEP.",
      "I had the opportunity to ask questions and received satisfactory answers.",
      "I voluntarily agree to initiate Daily PrEP under the PrEPARED Project.",
      "I consent to the anonymized use of my data for analysis and reporting purposes.",
      "I consent to receive reminders for follow-up and any other project-related updates.",
    ],
    consentCheckboxLabel: "I agree to the above consent statements. *",

    consentDateLabel: "Date of Consent:",
    back: "Back",
    submit: "Submit",
    requiredHint: "* Required fields",

    errPhoneInvalid: "Enter a valid 10-digit phone number.",
    errPhoneFailed: "Phone validation failed.",
    errNameRequired: "Name is required.",
    errDobRequired: "Date of birth is required.",
    errConsentRequired: "Consent is required.",
  },

  gu: {
    title: "સહમતિ ફોર્મ",
    step1Hint: "આગળ વધવા માટે તમારો ફોન નંબર દાખલ કરો.",
    step2Hint: "સહમતિ લખાણ વાંચો અને તમારી સહમતિ સબમિટ કરો.",
    step1: "પગલું 1",
    step2: "પગલું 2",

    phoneLabel: "ફોન નંબર",
    phonePlaceholder: "10 અંકનો ફોન નંબર",
    digitsHint: (n) => `${n}/10 અંક`,
    next: "આગળ",
    validating: "ચકાસી રહ્યું છે...",

    phoneDisplay: "ફોન:",
    change: "બદલો",
    languageLabel: "ભાષા",

    consentTitle: "PrEPARED પ્રોજેક્ટ – PrEP શરૂ કરવા માટે ક્લાયન્ટ સહમતિ ફોર્મ",
    consentIntro:
      "PrEP (Pre-Exposure Prophylaxis) એ HIV સંક્રમણ અટકાવવા માટે નિયમિત દવા છે. યોગ્ય રીતે લેવાય તો તે ખૂબ અસરકારક છે. નિયમિત HIV ટેસ્ટિંગ, ફોલો-અપ અને આરોગ્ય મોનિટરિંગ પ્રોટોકોલનો ભાગ છે.",
    confidentialityTitle: "ગોપનીયતા",
    confidentiality1: "તમે આપેલી બધી માહિતી સંપૂર્ણ ગોપનીય રાખવામાં આવશે.",
    confidentiality2:
      "વિશ્લેષણ માટે તમારો ડેટા અનામી બનાવવામાં આવશે, એટલે કે તમારી વ્યક્તિગત માહિતી (નામ, સંપર્ક વિગતો) રિપોર્ટિંગ અથવા રીસર્ચ માટે વપરાતા ડેટા સાથે જોડાશે નહીં.",
    confidentiality3: "માત્ર અધિકૃત પ્રોજેક્ટ સ્ટાફને જ તમારા ડેટાનો ઍક્સેસ હશે.",

    nameLabel: "નામ *",
    namePlaceholder: "તમારું નામ દાખલ કરો",
    dobLabel: "જન્મ તારીખ *",

    consentStatementsTitle: "સહમતિ નિવેદનો",
    consentStatements: [
      "મને PrEP વિશે આપવામાં આવેલી માહિતી સમજાઈ છે.",
      "મને પ્રશ્ન પૂછવાની તક મળી અને સંતોષકારક જવાબ મળ્યા.",
      "હું સ્વેચ્છાએ PrEPARED પ્રોજેક્ટ હેઠળ દૈનિક PrEP શરૂ કરવા સંમત છું.",
      "વિશ્લેષણ અને રિપોર્ટિંગ માટે મારા ડેટાના અનામી ઉપયોગ માટે હું સંમત છું.",
      "ફોલો-અપ અને અન્ય પ્રોજેક્ટ અપડેટ્સ માટે રિમાઇન્ડર્સ મેળવવા માટે હું સંમત છું.",
    ],
    consentCheckboxLabel: "હું ઉપરના સહમતિ નિવેદનો સાથે સંમત છું. *",

    consentDateLabel: "સહમતિ તારીખ:",
    back: "પાછળ",
    submit: "સબમિટ",
    requiredHint: "* ફરજિયાત ફીલ્ડ્સ",

    errPhoneInvalid: "માન્ય 10 અંકનો ફોન નંબર દાખલ કરો.",
    errPhoneFailed: "ફોન ચકાસણી નિષ્ફળ ગઈ.",
    errNameRequired: "નામ ફરજિયાત છે.",
    errDobRequired: "જન્મ તારીખ ફરજિયાત છે.",
    errConsentRequired: "સહમતિ ફરજિયાત છે.",
  },

  mr: {
    title: "संमती फॉर्म",
    step1Hint: "पुढे जाण्यासाठी तुमचा फोन नंबर टाका.",
    step2Hint: "संमती मजकूर वाचा आणि संमती सबमिट करा.",
    step1: "टप्पा 1",
    step2: "टप्पा 2",

    phoneLabel: "फोन नंबर",
    phonePlaceholder: "10 अंकी फोन नंबर",
    digitsHint: (n) => `${n}/10 अंक`,
    next: "पुढे",
    validating: "तपासणी होत आहे...",

    phoneDisplay: "फोन:",
    change: "बदला",
    languageLabel: "भाषा",

    consentTitle: "PrEPARED प्रकल्प – PrEP सुरू करण्यासाठी क्लायंट संमती फॉर्म",
    consentIntro:
      "PrEP (Pre-Exposure Prophylaxis) ही HIV संसर्ग टाळण्यासाठी नियमित घेतली जाणारी औषधोपचार पद्धत आहे. योग्य रीतीने घेतल्यास ती अत्यंत प्रभावी असते. नियमित HIV चाचणी, फॉलो-अप आणि आरोग्य निरीक्षण हे प्रोटोकॉलचा भाग आहेत.",
    confidentialityTitle: "गोपनीयता",
    confidentiality1: "तुम्ही दिलेली सर्व माहिती पूर्णपणे गोपनीय ठेवली जाईल.",
    confidentiality2:
      "विश्लेषणासाठी तुमचा डेटा अनामिक (anonymized) केला जाईल; म्हणजे तुमची वैयक्तिक माहिती (नाव, संपर्क तपशील) रिपोर्टिंग किंवा संशोधनासाठी वापरल्या जाणाऱ्या डेटाशी जोडली जाणार नाही.",
    confidentiality3: "फक्त अधिकृत प्रकल्प कर्मचाऱ्यांनाच तुमच्या डेटाचा प्रवेश असेल.",

    nameLabel: "नाव *",
    namePlaceholder: "तुमचे नाव टाका",
    dobLabel: "जन्मतारीख *",

    consentStatementsTitle: "संमती विधाने",
    consentStatements: [
      "PrEP बद्दल दिलेली माहिती मला समजली आहे.",
      "मला प्रश्न विचारण्याची संधी मिळाली आणि समाधानकारक उत्तरे मिळाली.",
      "मी PrEPARED प्रकल्पांतर्गत डेली PrEP सुरू करण्यास स्वेच्छेने सहमत आहे.",
      "विश्लेषण आणि अहवालासाठी माझ्या डेटाचा अनामिक वापर करण्यास मी संमती देतो/देते.",
      "फॉलो-अप आणि इतर प्रकल्प-संबंधित अपडेट्ससाठी मला रिमाइंडर्स मिळण्यास मी संमती देतो/देते.",
    ],
    consentCheckboxLabel: "मी वरील संमती विधानांना सहमत आहे. *",

    consentDateLabel: "संमतीची तारीख:",
    back: "मागे",
    submit: "सबमिट",
    requiredHint: "* आवश्यक फील्ड्स",

    errPhoneInvalid: "वैध 10 अंकी फोन नंबर टाका.",
    errPhoneFailed: "फोन पडताळणी अयशस्वी झाली.",
    errNameRequired: "नाव आवश्यक आहे.",
    errDobRequired: "जन्मतारीख आवश्यक आहे.",
    errConsentRequired: "संमती आवश्यक आहे.",
  },

  bn: {
    title: "সম্মতি ফর্ম",
    step1Hint: "এগিয়ে যেতে আপনার ফোন নম্বর দিন।",
    step2Hint: "সম্মতির লেখা পড়ে সম্মতি জমা দিন।",
    step1: "ধাপ ১",
    step2: "ধাপ ২",

    phoneLabel: "ফোন নম্বর",
    phonePlaceholder: "১০ সংখ্যার ফোন নম্বর",
    digitsHint: (n) => `${n}/10 সংখ্যা`,
    next: "পরবর্তী",
    validating: "যাচাই হচ্ছে...",

    phoneDisplay: "ফোন:",
    change: "পরিবর্তন",
    languageLabel: "ভাষা",

    consentTitle: "PrEPARED প্রকল্প – PrEP শুরু করার জন্য ক্লায়েন্ট সম্মতি ফর্ম",
    consentIntro:
      "PrEP (Pre-Exposure Prophylaxis) হলো HIV সংক্রমণ প্রতিরোধের জন্য নিয়মিত গ্রহণযোগ্য ওষুধ। সঠিকভাবে গ্রহণ করলে এটি অত্যন্ত কার্যকর। নিয়মিত HIV পরীক্ষা, ফলো-আপ এবং স্বাস্থ্য পর্যবেক্ষণ প্রোটোকলের অংশ।",
    confidentialityTitle: "গোপনীয়তা",
    confidentiality1: "আপনার দেওয়া সমস্ত তথ্য কঠোরভাবে গোপন রাখা হবে।",
    confidentiality2:
      "বিশ্লেষণের জন্য আপনার তথ্য নামবিহীন (anonymized) করা হবে; অর্থাৎ আপনার ব্যক্তিগত তথ্য (নাম, যোগাযোগের বিবরণ) রিপোর্টিং বা গবেষণার জন্য ব্যবহৃত কোনো ডেটার সাথে যুক্ত থাকবে না।",
    confidentiality3: "শুধুমাত্র অনুমোদিত প্রকল্প কর্মীদের আপনার ডেটার অ্যাক্সেস থাকবে।",

    nameLabel: "নাম *",
    namePlaceholder: "আপনার নাম লিখুন",
    dobLabel: "জন্মতারিখ *",

    consentStatementsTitle: "সম্মতি বিবৃতি",
    consentStatements: [
      "PrEP সম্পর্কে দেওয়া তথ্য আমি বুঝেছি।",
      "প্রশ্ন করার সুযোগ পেয়েছি এবং সন্তোষজনক উত্তর পেয়েছি।",
      "PrEPARED প্রকল্পের অধীনে আমি স্বেচ্ছায় ডেইলি PrEP শুরু করতে সম্মত।",
      "বিশ্লেষণ ও রিপোর্টিংয়ের জন্য আমার ডেটা নামবিহীনভাবে ব্যবহারে আমি সম্মতি দিচ্ছি।",
      "ফলো-আপ এবং অন্যান্য প্রকল্প-সম্পর্কিত আপডেটের জন্য রিমাইন্ডার পেতে আমি সম্মতি দিচ্ছি।",
    ],
    consentCheckboxLabel: "আমি উপরের সম্মতি বিবৃতিগুলোর সাথে একমত। *",

    consentDateLabel: "সম্মতির তারিখ:",
    back: "পেছনে",
    submit: "জমা দিন",
    requiredHint: "* আবশ্যক ক্ষেত্র",

    errPhoneInvalid: "সঠিক ১০ সংখ্যার ফোন নম্বর দিন।",
    errPhoneFailed: "ফোন যাচাই ব্যর্থ হয়েছে।",
    errNameRequired: "নাম আবশ্যক।",
    errDobRequired: "জন্মতারিখ আবশ্যক।",
    errConsentRequired: "সম্মতি আবশ্যক।",
  },

  kn: {
    title: "ಸಮ್ಮತಿ ಫಾರ್ಮ್",
    step1Hint: "ಮುಂದುವರಿಯಲು ನಿಮ್ಮ ಫೋನ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.",
    step2Hint: "ಸಮ್ಮತಿ ಪಠ್ಯವನ್ನು ಓದಿ ಮತ್ತು ಸಮ್ಮತಿಯನ್ನು ಸಲ್ಲಿಸಿ.",
    step1: "ಹಂತ 1",
    step2: "ಹಂತ 2",

    phoneLabel: "ಫೋನ್ ಸಂಖ್ಯೆ",
    phonePlaceholder: "10 ಅಂಕಿಯ ಫೋನ್ ಸಂಖ್ಯೆ",
    digitsHint: (n) => `${n}/10 ಅಂಕೆಗಳು`,
    next: "ಮುಂದೆ",
    validating: "ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...",

    phoneDisplay: "ಫೋನ್:",
    change: "ಬದಲಿಸಿ",
    languageLabel: "ಭಾಷೆ",

    consentTitle: "PrEPARED ಯೋಜನೆ – PrEP ಆರಂಭಿಸಲು ಕ್ಲೈಂಟ್ ಸಮ್ಮತಿ ಫಾರ್ಮ್",
    consentIntro:
      "PrEP (Pre-Exposure Prophylaxis) ಎಂಬುದು HIV ಸೋಂಕನ್ನು ತಡೆಯಲು ನಿಯಮಿತವಾಗಿ ತೆಗೆದುಕೊಳ್ಳುವ ಔಷಧಿ. ಸರಿಯಾಗಿ ತೆಗೆದುಕೊಂಡರೆ ಇದು ಅತ್ಯಂತ ಪರಿಣಾಮಕಾರಿ. ನಿಯಮಿತ HIV ಪರೀಕ್ಷೆ, ಫಾಲೋ-ಅಪ್ ಮತ್ತು ಆರೋಗ್ಯ ಮೇಲ್ವಿಚಾರಣೆ ಪ್ರೋಟೋಕಾಲ್‌ನ ಭಾಗವಾಗಿದೆ.",
    confidentialityTitle: "ಗೌಪ್ಯತೆ",
    confidentiality1: "ನೀವು ನೀಡುವ ಎಲ್ಲಾ ಮಾಹಿತಿಯನ್ನು ಕಟ್ಟುನಿಟ್ಟಾಗಿ ಗೌಪ್ಯವಾಗಿ ಇಡಲಾಗುತ್ತದೆ.",
    confidentiality2:
      "ವಿಶ್ಲೇಷಣೆಗಾಗಿ ನಿಮ್ಮ ಡೇಟಾವನ್ನು ಹೆಸರು-ರಹಿತ (anonymized) ಮಾಡಲಾಗುತ್ತದೆ; ಅಂದರೆ ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ (ಹೆಸರು, ಸಂಪರ್ಕ ವಿವರಗಳು) ವರದಿ ಅಥವಾ ಸಂಶೋಧನೆಗಾಗಿ ಬಳಸುವ ಡೇಟಾಗೆ ಜೋಡಿಸಲಾಗುವುದಿಲ್ಲ.",
    confidentiality3: "ಅಧಿಕೃತ ಯೋಜನಾ ಸಿಬ್ಬಂದಿಗೆ ಮಾತ್ರ ನಿಮ್ಮ ಡೇಟಾಕ್ಕೆ ಪ್ರವೇಶ ಇರುತ್ತದೆ.",

    nameLabel: "ಹೆಸರು *",
    namePlaceholder: "ನಿಮ್ಮ ಹೆಸರನ್ನು ನಮೂದಿಸಿ",
    dobLabel: "ಜನ್ಮ ದಿನಾಂಕ *",

    consentStatementsTitle: "ಸಮ್ಮತಿ ಹೇಳಿಕೆಗಳು",
    consentStatements: [
      "PrEP ಬಗ್ಗೆ ನೀಡಲಾದ ಮಾಹಿತಿಯನ್ನು ನಾನು ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದೇನೆ.",
      "ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಲು ಅವಕಾಶ ದೊರೆತಿದೆ ಮತ್ತು ತೃಪ್ತಿಕರ ಉತ್ತರಗಳನ್ನು ಪಡೆದಿದ್ದೇನೆ.",
      "PrEPARED ಯೋಜನೆಯಡಿ ದೈನಂದಿನ PrEP ಆರಂಭಿಸಲು ನಾನು ಸ್ವಯಂ ಇಚ್ಛೆಯಿಂದ ಒಪ್ಪುತ್ತೇನೆ.",
      "ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ವರದಿಗಾಗಿ ನನ್ನ ಡೇಟಾವನ್ನು ಹೆಸರು-ರಹಿತವಾಗಿ ಬಳಸಲು ನಾನು ಸಮ್ಮತಿಸುತ್ತೇನೆ.",
      "ಫಾಲೋ-ಅಪ್ ಹಾಗೂ ಇತರೆ ಯೋಜನೆ ಸಂಬಂಧಿತ ಅಪ್‌ಡೇಟ್‌ಗಳಿಗೆ ರಿಮೈಂಡರ್‌ಗಳನ್ನು ಪಡೆಯಲು ನಾನು ಸಮ್ಮತಿಸುತ್ತೇನೆ.",
    ],
    consentCheckboxLabel: "ಮೇಲಿನ ಸಮ್ಮತಿ ಹೇಳಿಕೆಗಳಿಗೆ ನಾನು ಒಪ್ಪುತ್ತೇನೆ. *",

    consentDateLabel: "ಸಮ್ಮತಿ ದಿನಾಂಕ:",
    back: "ಹಿಂದೆ",
    submit: "ಸಲ್ಲಿಸಿ",
    requiredHint: "* ಅಗತ್ಯವಾದ ಕ್ಷೇತ್ರಗಳು",

    errPhoneInvalid: "ಮಾನ್ಯವಾದ 10 ಅಂಕಿಯ ಫೋನ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.",
    errPhoneFailed: "ಫೋನ್ ಪರಿಶೀಲನೆ ವಿಫಲವಾಗಿದೆ.",
    errNameRequired: "ಹೆಸರು ಅಗತ್ಯವಾಗಿದೆ.",
    errDobRequired: "ಜನ್ಮ ದಿನಾಂಕ ಅಗತ್ಯವಾಗಿದೆ.",
    errConsentRequired: "ಸಮ್ಮತಿ ಅಗತ್ಯವಾಗಿದೆ.",
  },

  te: {
    title: "సమ్మతి ఫారం",
    step1Hint: "కొనసాగడానికి మీ ఫోన్ నంబర్ నమోదు చేయండి.",
    step2Hint: "సమ్మతి పాఠ్యాన్ని చదివి సమ్మతిని సమర్పించండి.",
    step1: "దశ 1",
    step2: "దశ 2",

    phoneLabel: "ఫోన్ నంబర్",
    phonePlaceholder: "10 అంకెల ఫోన్ నంబర్",
    digitsHint: (n) => `${n}/10 అంకెలు`,
    next: "తదుపరి",
    validating: "ధృవీకరిస్తోంది...",

    phoneDisplay: "ఫోన్:",
    change: "మార్చండి",
    languageLabel: "భాష",

    consentTitle: "PrEPARED ప్రాజెక్ట్ – PrEP ప్రారంభించడానికి క్లయింట్ సమ్మతి ఫారం",
    consentIntro:
      "PrEP (Pre-Exposure Prophylaxis) అనేది HIV సంక్రమణను నివారించడానికి రోజూ/నియమితంగా తీసుకునే ఔషధం. సరిగా తీసుకుంటే ఇది చాలా ప్రభావవంతంగా ఉంటుంది. నియమిత HIV పరీక్షలు, ఫాలో-అప్, ఆరోగ్య పర్యవేక్షణలు ప్రోటోకాల్‌లో భాగం.",
    confidentialityTitle: "గోప్యత",
    confidentiality1: "మీరు అందించే సమాచారం మొత్తం కఠినంగా గోప్యంగా ఉంచబడుతుంది.",
    confidentiality2:
      "విశ్లేషణ కోసం మీ డేటా అనామకంగా (anonymized) మార్చబడుతుంది; అంటే మీ వ్యక్తిగత సమాచారం (పేరు, సంప్రదింపు వివరాలు) నివేదికలు లేదా పరిశోధన కోసం ఉపయోగించే డేటాతో లింక్ చేయబడదు.",
    confidentiality3: "అధికారిక ప్రాజెక్ట్ సిబ్బందికి మాత్రమే మీ డేటాకు ప్రాప్యత ఉంటుంది.",

    nameLabel: "పేరు *",
    namePlaceholder: "మీ పేరు నమోదు చేయండి",
    dobLabel: "పుట్టిన తేదీ *",

    consentStatementsTitle: "సమ్మతి ప్రకటనలు",
    consentStatements: [
      "PrEP గురించి అందించిన సమాచారాన్ని నేను అర్థం చేసుకున్నాను.",
      "నాకు ప్రశ్నలు అడిగే అవకాశం లభించింది మరియు తృప్తికర సమాధానాలు లభించాయి.",
      "PrEPARED ప్రాజెక్ట్ కింద డైలీ PrEP ప్రారంభించడానికి నేను స్వచ్ఛందంగా అంగీకరిస్తున్నాను.",
      "విశ్లేషణ మరియు నివేదికల కోసం నా డేటాను అనామకంగా ఉపయోగించడానికి నేను సమ్మతిస్తున్నాను.",
      "ఫాలో-అప్ మరియు ఇతర ప్రాజెక్ట్ అప్‌డేట్స్ కోసం రిమైండర్లు పొందడానికి నేను సమ్మతిస్తున్నాను.",
    ],
    consentCheckboxLabel: "పై సమ్మతి ప్రకటనలకు నేను అంగీకరిస్తున్నాను. *",

    consentDateLabel: "సమ్మతి తేదీ:",
    back: "వెనక్కి",
    submit: "సమర్పించండి",
    requiredHint: "* తప్పనిసరి ఫీల్డ్స్",

    errPhoneInvalid: "చెల్లుబాటు అయ్యే 10 అంకెల ఫోన్ నంబర్ నమోదు చేయండి.",
    errPhoneFailed: "ఫోన్ ధృవీకరణ విఫలమైంది.",
    errNameRequired: "పేరు తప్పనిసరి.",
    errDobRequired: "పుట్టిన తేదీ తప్పనిసరి.",
    errConsentRequired: "సమ్మతి తప్పనిసరి.",
  },
};

function getLocaleForLang(lang) {
  // Fallback safely for environments where a locale might not exist
  const map = {
    en: "en-IN",
    gu: "gu-IN",
    mr: "mr-IN",
    bn: "bn-IN",
    kn: "kn-IN",
    te: "te-IN",
  };
  return map[lang] || "en-IN";
}

export default function ConsentForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const { mutate: validatePhone, isLoading: isSaving } =
    useConsentValidateMutation();

  const t = I18N[form.language] || I18N.en;

  const phoneDigits = useMemo(
    () => (form.phone || "").replace(/\D/g, ""),
    [form.phone]
  );
  const isPhoneValid = phoneDigits.length === 10;

  const todayConsentDate = useMemo(() => {
    return new Date().toLocaleDateString(getLocaleForLang(form.language), {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }, [form.language]);

  const setField = (key, value) => {
    setForm((p) => ({ ...p, [key]: value }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const goNext = () => {
    if (!isPhoneValid) {
      setErrors((p) => ({
        ...p,
        phone: t.errPhoneInvalid,
      }));
      return;
    }

    setErrors((p) => ({ ...p, phone: undefined }));

    validatePhone(
      { phone: phoneDigits },
      {
        onSuccess: (res) => {
          if (!res?.data) {
            setErrors((p) => ({
              ...p,
              phone: res?.message || t.errPhoneFailed,
            }));
            return;
          }
          setStep(2);
        },
        // onSuccess: (res) => {
        //   const ok = res?.success === true || res?.status === true;

        //   if (ok) {
        //     setStep(2);
        //   } else {
        //     setErrors((p) => ({
        //       ...p,
        //       phone: res?.message || t.errPhoneFailed,
        //     }));
        //   }
        // },
        onError: (err) => {
          setErrors((p) => ({
            ...p,
            phone: err?.message || t.errPhoneFailed,
          }));
        },
      }
    );
  };

  const validateStep2 = () => {
    const nextErrors = {};

    if (!form.fullName.trim()) nextErrors.fullName = t.errNameRequired;
    if (!form.dob) nextErrors.dob = t.errDobRequired;
    if (!form.consent) nextErrors.consent = t.errConsentRequired;

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isPhoneValid) {
      setStep(1);
      setErrors({ phone: t.errPhoneInvalid });
      return;
    }

    if (!validateStep2()) return;

    const payload = {
      phone: phoneDigits,
      language: form.language, // en / gu / mr / bn / kn / te
      fullName: form.fullName.trim(),
      dob: form.dob,
      consent: true,
      consentDate: todayConsentDate,
    };

    // Replace with your real submit
    console.log("Consent submitted:", payload);
    alert("Submitted!\n" + JSON.stringify(payload, null, 2));
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900">
                {t.title}
              </h2>
              <p className="mt-1 text-sm text-zinc-600">
                {step === 1 ? t.step1Hint : t.step2Hint}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-zinc-600">
              <span
                className={[
                  "rounded-full px-3 py-1 border",
                  step === 1
                    ? "border-zinc-900 text-zinc-900"
                    : "border-zinc-200 text-zinc-500",
                ].join(" ")}
              >
                {t.step1}
              </span>
              <span
                className={[
                  "rounded-full px-3 py-1 border",
                  step === 2
                    ? "border-zinc-900 text-zinc-900"
                    : "border-zinc-200 text-zinc-500",
                ].join(" ")}
              >
                {t.step2}
              </span>
            </div>
          </div>

          {step === 1 && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-zinc-800">
                {t.phoneLabel}
              </label>

              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder={t.phonePlaceholder}
                value={form.phone}
                onChange={(e) => {
                  const onlyDigits = e.target.value.replace(/\D/g, "");
                  setField("phone", onlyDigits)
                }
                }
                className={[
                  "mt-2 w-full rounded-xl border px-3 py-2 text-sm outline-none transition",
                  errors.phone
                    ? "border-red-500 focus:ring-2 focus:ring-red-200"
                    : isPhoneValid
                      ? "border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                      : "border-zinc-300 focus:ring-2 focus:ring-zinc-200",
                ].join(" ")}
              />

              <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="text-xs text-zinc-500">
                  {t.digitsHint(phoneDigits.length)}
                </span>
                {errors.phone && (
                  <span className="text-xs font-medium text-red-600">
                    {errors.phone}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={goNext}
                disabled={!isPhoneValid || isSaving}
                className={[
                  "mt-4 w-full rounded-xl px-4 py-2 text-sm font-semibold text-white transition",
                  isPhoneValid && !isSaving
                    ? "bg-zinc-900 hover:bg-zinc-800"
                    : "cursor-not-allowed bg-zinc-300",
                ].join(" ")}
              >
                {isSaving ? t.validating : t.next}
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="mt-6">
              {/* Phone + Language */}
              <div className="mb-5 grid grid-cols-1 gap-3 rounded-xl bg-zinc-50 p-4 sm:grid-cols-2 sm:items-center">
                <div className="text-sm text-zinc-700">
                  {t.phoneDisplay}{" "}
                  <span className="font-semibold text-zinc-900">
                    {phoneDigits}
                  </span>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="ml-3 font-medium text-zinc-900 underline underline-offset-2 hover:text-zinc-700"
                  >
                    {t.change}
                  </button>
                </div>

                <SelectField
                  label={t.languageLabel}
                  value={form.language}
                  onChange={(v) => setField("language", v)}
                  options={LANG_OPTIONS}
                />
              </div>

              {/* Read-only text */}
              <div className="rounded-xl border border-zinc-200 p-4 sm:p-5">
                <p className="text-base font-semibold text-zinc-900">
                  {t.consentTitle}
                </p>

                <div className="mt-3 space-y-3 text-sm text-zinc-700 leading-relaxed">
                  <p>{t.consentIntro}</p>

                  <p className="font-semibold text-zinc-900">
                    {t.confidentialityTitle}
                  </p>

                  <p>{t.confidentiality1}</p>
                  <p>{t.confidentiality2}</p>
                  <p>{t.confidentiality3}</p>
                </div>
              </div>

              {/* Inputs: name, dob */}
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  label={t.nameLabel}
                  value={form.fullName}
                  onChange={(v) => setField("fullName", v)}
                  error={errors.fullName}
                  placeholder={t.namePlaceholder}
                />

                <Field
                  type="date"
                  label={t.dobLabel}
                  value={form.dob}
                  onChange={(v) => setField("dob", v)}
                  error={errors.dob}
                />
              </div>

              {/* Consent statements + tick */}
              <div className="mt-5 rounded-xl border border-zinc-200 p-4 sm:p-5">
                <p className="text-sm font-semibold text-zinc-900">
                  {t.consentStatementsTitle}
                </p>

                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-700">
                  {(t.consentStatements || []).map((line, idx) => (
                    <li key={idx}>{line}</li>
                  ))}
                </ul>

                <div className="mt-4">
                  <Checkbox
                    checked={form.consent}
                    onChange={(v) => setField("consent", v)}
                    label={t.consentCheckboxLabel}
                    error={errors.consent}
                  />
                </div>

                <div className="mt-4 flex flex-col gap-1 text-sm">
                  <span className="text-zinc-600">{t.consentDateLabel}</span>
                  <span className="font-semibold text-zinc-900">
                    {todayConsentDate}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full sm:w-auto rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
                >
                  {t.back}
                </button>

                <button
                  type="submit"
                  className="w-full sm:w-auto rounded-xl bg-zinc-900 px-6 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
                >
                  {t.submit}
                </button>
              </div>

              <p className="mt-4 text-xs text-zinc-500">{t.requiredHint}</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/** ---- Small UI helpers ---- */

function Field({
  label,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
  inputMode,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-800">{label}</label>
      <input
        type={type}
        value={value}
        inputMode={inputMode}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={[
          "mt-2 w-full rounded-xl border px-3 py-2 text-sm outline-none transition",
          error
            ? "border-red-500 focus:ring-2 focus:ring-red-200"
            : "border-zinc-300 focus:ring-2 focus:ring-zinc-200",
        ].join(" ")}
      />
      {error && (
        <p className="mt-1 text-xs font-medium text-red-600">{error}</p>
      )}
    </div>
  );
}

function SelectField({ label, value, onChange, error, options }) {
  return (
    <div>
      {label ? (
        <label className="block text-sm font-medium text-zinc-800">
          {label}
        </label>
      ) : null}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={[
          "mt-2 w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none transition",
          error
            ? "border-red-500 focus:ring-2 focus:ring-red-200"
            : "border-zinc-300 focus:ring-2 focus:ring-zinc-200",
        ].join(" ")}
      >
        {options.map((opt) => (
          <option key={opt.value || opt.label} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-xs font-medium text-red-600">{error}</p>
      )}
    </div>
  );
}

function Checkbox({ checked, onChange, label, error }) {
  return (
    <div>
      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-300"
        />
        <span className="text-sm text-zinc-800">{label}</span>
      </label>
      {error && (
        <p className="mt-1 text-xs font-medium text-red-600">{error}</p>
      )}
    </div>
  );
}
