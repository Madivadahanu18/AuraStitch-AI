import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'te' | 'hi';

const dictionary = {
  en: {
    welcome: "Welcome to AuraStitch AI",
    home: "Home",
    search: "Search",
    reels: "Reels",
    messages: "Messages",
    profile: "Profile",
    orders: "Orders",
    designs: "Saved Designs",
    settings: "Settings",
    launch_studio: "Launch Studio",
    dashboard: "Dashboard",
    design_lab: "AI Design Lab",
    ai_recom: "AI Recommendation",
    wishlist: "Wishlist",
    cart: "Cart",
    timeline: "Order Timeline",
    measurements: "Measurements",
    logout: "Logout",
    artisan_dash: "Artisan Dashboard",
    loom_studio: "AI Handloom Studio",
    products: "Products",
    collections: "Collections",
    inventory: "Inventory List",
    market_dash: "Market Dashboard",
    b2b_orders: "B2B Sales Orders",
    admin_center: "Admin Center",
    user_control: "User Control",
    verifications: "Verifications",
    system_health: "System Health"
  },
  te: {
    welcome: "ఆరాస్టిచ్ AI కి స్వాగతం",
    home: "హోమ్",
    search: "శోధన",
    reels: "రీల్స్",
    messages: "సందేశాలు",
    profile: "ప్రొఫైల్",
    orders: "ఆర్డర్లు",
    designs: "రూపకల్పనలు",
    settings: "సెట్టింగులు",
    launch_studio: "స్టూడియో ప్రారంభించండి",
    dashboard: "డాష్‌బోర్డ్",
    design_lab: "AI డిజైన్ ల్యాబ్",
    ai_recom: "AI సిఫార్సు",
    wishlist: "ఇష్టాల జాబితా",
    cart: "కార్ట్",
    timeline: "ఆర్డర్ కాలక్రమం",
    measurements: "కొలతలు",
    logout: "లాగ్ అవుట్",
    artisan_dash: "కళాకారుల డాష్‌బోర్డ్",
    loom_studio: "AI హ్యాండ్లూమ్ స్టూడియో",
    products: "ఉత్పత్తులు",
    collections: "సేకరణలు",
    inventory: "జాబితా పట్టిక",
    market_dash: "మార్కెట్ డాష్‌బోర్డ్",
    b2b_orders: "B2B విక్రయాల ఆర్డర్లు",
    admin_center: "అడ్మిన్ కేంద్రం",
    user_control: "వినియోగదారు నియంత్రణ",
    verifications: "ధృవీకరణలు",
    system_health: "సిస్టమ్ ఆరోగ్యం"
  },
  hi: {
    welcome: "ऑरास्टिच AI में आपका स्वागत है",
    home: "होम",
    search: "خوزیں (खोजें)",
    reels: "रील्स",
    messages: "संदेश",
    profile: "प्रोफ़ाइल",
    orders: "ऑर्डर",
    designs: "डिज़ाइन्स",
    settings: "सेटिंग्स",
    launch_studio: "स्टूडियो शुरू करें",
    dashboard: "डैशबोर्ड",
    design_lab: "AI डिज़ाइन लैब",
    ai_recom: "AI अनुशंसा",
    wishlist: "इच्छा-सूची",
    cart: "कार्ट",
    timeline: "ऑर्डर टाइमलाइन",
    measurements: "माप",
    logout: "लॉग आउट",
    artisan_dash: "कारीगर डैशबोर्ड",
    loom_studio: "AI हथकरघा स्टूडियो",
    products: "उत्पाद",
    collections: "संग्रह",
    inventory: "इन्वेंटरी सूची",
    market_dash: "मार्केट डैशबोर्ड",
    b2b_orders: "B2B बिक्री आदेश",
    admin_center: "एडमिन सेंटर",
    user_control: "उपयोगकर्ता नियंत्रण",
    verifications: "सत्यापन",
    system_health: "सिस्टम स्वास्थ्य"
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translate: (key: keyof typeof dictionary['en']) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('aurastitch-lang') as Language;
    return saved || 'en';
  });

  useEffect(() => {
    localStorage.setItem('aurastitch-lang', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const translate = (key: keyof typeof dictionary['en']) => {
    return dictionary[language]?.[key] || dictionary['en']?.[key] || String(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
