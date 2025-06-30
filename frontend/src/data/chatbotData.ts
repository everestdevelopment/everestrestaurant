interface KnowledgeBase {
  [key: string]: {
    keywords: string[];
    answer: string | string[];
  };
}

export const knowledgeBase: KnowledgeBase = {
  greeting: {
    keywords: ['salom', 'hello', 'hi', 'hey', 'assalomu alaykum'],
    answer: "Assalomu alaykum! Men Everest Restaurant virtual yordamchisiman. Sizga qanday yordam bera olaman?",
  },
  openingHours: {
    keywords: ['ish vaqti', 'soat', 'ochiq', 'open', 'hours', 'working'],
    answer: "Biz har kuni soat 17:00 dan 00:00 gacha ishlaymiz.",
  },
  location: {
    keywords: ['manzil', 'joylashuv', 'adres', 'location', 'address', 'where'],
    answer: "Bizning manzilimiz: Navoiy viloyati, Qiziltepa tumani. Sizni kutib qolamiz!",
  },
  reservation: {
    keywords: ['bron', 'stol', 'joy', 'band qilish', 'reserve', 'reservation', 'table'],
    answer: "Stolni 'Reservations' sahifasi orqali yoki bizga qo'ng'iroq qilib bron qilishingiz mumkin. Yordam kerakmi?",
  },
  menu: {
    keywords: ['menu', 'taomlar', 'ovqat', 'dishes', 'food'],
    answer: "Bizning to'liq menyuimizni 'Menu' sahifasidan topishingiz mumkin. U yerda barcha taomlarimiz rasmlari va narxlari bilan ko'rsatilgan.",
  },
  contact: {
    keywords: ['kontakt', 'telefon', 'aloqa', 'boglanish', 'contact', 'phone'],
    answer: "Biz bilan 'Contact' sahifasi orqali yoki +1 (555) 123-4567 telefon raqami orqali bog'lanishingiz mumkin.",
  },
  thankYou: {
    keywords: ['rahmat', 'tashakkur', 'thanks', 'thank you'],
    answer: "Arzimaydi! Yana savollaringiz bo'lsa, murojaat qiling.",
  },
  about: {
    keywords: ['haqida', 'restoran', 'about', 'restaurant'],
    answer: "Everest Restaurant - bu an'anaviy taomlar va zamonaviy yondashuvni birlashtirgan oliy darajadagi restoran. Biz sizga unutilmas taom tajribasini taqdim etishga intilamiz."
  },
  default: {
    keywords: [],
    answer: "Kechirasiz, men bu savolga javob bera olmayman. Men faqat Everest Restaurant haqidagi savollarga javob berishga dasturlashtirilganman. Iltimos, savolingizni boshqacha tarzda bering yoki 'Contact' sahifasi orqali biz bilan bog'laning.",
  },
}; 