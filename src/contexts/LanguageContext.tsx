import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Language Selection
    'language.select': 'Select Your Language',
    'language.english': 'English',
    'language.hindi': 'हिंदी (Hindi)',
    'language.continue': 'Continue',
    'language.welcome': 'Welcome to Engagement Experts!',
    'language.choose': 'Please choose your preferred language to get started.',

    // Dashboard Header
    'dashboard.welcome': 'Welcome back, {name}! 👋',
    'dashboard.ready': 'Ready to earn some money today?',
    'dashboard.age': 'Age: {age}',
    'dashboard.member': 'Member since today',
    'dashboard.signout': 'Sign Out',

    // Earnings Card
    'earnings.today': "Today's Earnings",
    'earnings.total': 'Total Earnings',
    'earnings.keepup': 'Keep it up! 🚀',
    'earnings.withdraw': 'Ready to withdraw! 💰',
    'earnings.need': '₹{amount} to withdraw',

    // Navigation Tabs
    'nav.available': 'Available Tasks',
    'nav.pending': 'Pending Tasks',
    'nav.completed': 'Completed Tasks',
    'nav.withdraw': 'Withdraw',
    'nav.referral': 'Refer & Earn',

    // Task Instructions
    'task.instructions': 'How to complete this task:',
    'task.step1': 'Click "Open Google Profile" above',
    'task.step2': 'Find the review section on their Google profile',
    'task.step3': 'Click "Write a review" or similar button',
    'task.step4': 'Give them {rating} stars',
    'task.step5': 'Copy and paste the review text provided above',
    'task.step6': 'Submit the review on Google',
    'task.step7': 'Come back here and submit a screenshot',
    'task.show': 'Show Instructions',
    'task.hide': 'Hide Instructions',
    'task.submit': 'Submit Task with Screenshot (₹{amount})',
    'task.copy': 'Copy',
    'task.copied': 'Copied!',
    'task.review': 'Review to Copy:',
    'task.profile': 'Google Profile to Review:',
    'task.open': 'Open Google Profile',
    'task.important': 'Important:',
    'task.warning': 'Once you submit this task, it will be removed from everyone\'s task list immediately. Only one user can complete each task. Make sure to follow instructions carefully.',

    // Task Status
    'status.submitted': '⏳ Submitted for Review',
    'status.pending': 'Ready for Admin Review',
    'status.approved': 'Task Approved! ₹{amount} credited to your account',
    'status.rejected': 'Task Rejected',
    'status.review': 'Your task submission is being reviewed by our admin team. You will be notified once it\'s approved or rejected.',
    'status.waiting': 'Your task is waiting for admin review and approval.',
    'status.credited': 'Your earnings have been added to your account balance.',
    'status.tryagain': 'Please try again with a valid screenshot.',

    // Company Policy
    'policy.title': '⚠️ Important Review Policy',
    'policy.one': 'One Review Per Company:',
    'policy.description': 'You can only submit ONE review per company. Once you complete any task for {company}, you cannot submit additional reviews for this company. Choose your task carefully as this is your only opportunity to earn from {company}.',

    // Task Submission
    'submit.title': 'Submit Task Screenshot',
    'submit.update': 'Update Task Screenshot',
    'submit.drop': 'Drop your screenshot here',
    'submit.browse': 'or click to browse',
    'submit.choose': 'Choose File',
    'submit.remove': 'Remove',
    'submit.submitting': 'Submitting...',
    'submit.submit': 'Submit for Review',
    'submit.update_btn': 'Update Submission',
    'submit.cancel': 'Cancel',
    'submit.note': 'Note:',
    'submit.update_note': 'Updating your submission will reset the review status to pending. The admin will need to review your new screenshot.',
    'submit.important_note': 'Important: Please upload a clear screenshot showing that you\'ve completed the Google review as instructed. Your submission will be reviewed by our admin team before earnings are credited. Remember: Only one review per profile will be accepted.',
    'submit.success_title': 'Task Submitted Successfully!',
    'submit.success_message': 'Your task has been submitted for review. Our admin team will verify your submission and credit your earnings once approved.',
    'submit.update_success': 'Your task submission has been updated successfully. The admin team will review your new screenshot.',
    'submit.review_time': 'Review Time: 2-3 Business Days',
    'submit.reward_pending': '₹{amount} will be credited after approval',

    // Withdrawal
    'withdraw.title': 'Withdraw Earnings',
    'withdraw.available': 'Available: ₹{amount}',
    'withdraw.minimum': 'Minimum Balance Required',
    'withdraw.need_amount': 'You need at least ₹{min} to make a withdrawal. You currently have ₹{current}.',
    'withdraw.keep_earning': 'Keep completing tasks to reach the minimum withdrawal amount! You need ₹{need} more.',
    'withdraw.info': 'Withdrawal Information',
    'withdraw.min': '• Minimum withdrawal: ₹{min}',
    'withdraw.processing': '• Processing time: 2-3 business days',
    'withdraw.balance': '• Available balance: ₹{balance}',
    'withdraw.fees': '• No processing fees',
    'withdraw.upi': 'UPI ID',
    'withdraw.amount': 'Withdrawal Amount (₹)',
    'withdraw.amount_placeholder': 'Enter amount (Min: ₹{min})',
    'withdraw.request': 'Request Withdrawal',
    'withdraw.success': 'Withdrawal Requested!',
    'withdraw.success_msg': 'Your withdrawal request has been submitted successfully. You\'ll receive the money in your UPI account within 2-3 business days.',
    'withdraw.another': 'Make Another Withdrawal',

    // Task History
    'history.title': 'Task History',
    'history.completed': '{count} tasks completed',
    'history.none': 'No Task History',
    'history.first': 'Complete your first task to see your earning history here!',
    'history.approved': 'Approved',

    // Pending Tasks
    'pending.title': 'My Submitted Tasks',
    'pending.submissions': '{count} submissions',
    'pending.none': 'No Submitted Tasks',
    'pending.description': 'Tasks you submit for review will appear here. You can edit or delete pending submissions.',
    'pending.submitted': 'Submitted:',
    'pending.estimated': 'Estimated Approval:',
    'pending.reviewed': 'Reviewed:',
    'pending.notes': 'Admin Notes:',
    'pending.screenshot': 'Screenshot:',
    'pending.uploaded': 'Screenshot uploaded',
    'pending.edit': 'Edit',
    'pending.delete': 'Delete',
    'pending.resubmit': 'Resubmit',
    'pending.verification': 'Under Verification',
    'pending.ready': 'Ready for Review',

    // No Tasks Available
    'notasks.title': 'No Tasks Available',
    'notasks.description': 'All available tasks have been completed or you\'ve already submitted to these profiles. Check back later for new opportunities.',
    'notasks.tip': '💡 Tip: Remember, you can only submit one review per profile. New tasks are added regularly!',

    // Companies
    'companies.available': '{count} tasks available',
    'companies.instruction': '👆 Click "View Tasks" below each company to see and complete available tasks',
    'companies.view': 'View Tasks',
    'companies.hide': 'Hide Tasks',
    'companies.none': 'No Companies Available',
    'companies.check': 'No companies are currently offering tasks. Check back later for new opportunities!',

    // General
    'general.loading': 'Loading...',
    'general.error': 'Error',
    'general.success': 'Success',
    'general.confirm': 'Are you sure?',
    'general.yes': 'Yes',
    'general.no': 'No',
    'general.close': 'Close',
    'general.save': 'Save',
    'general.edit': 'Edit',
    'general.delete': 'Delete',
    'general.view': 'View',

    // Platforms
    'platform.google': 'Google',
    'platform.instagram': 'Instagram',
    'platform.youtube': 'YouTube',
    'platform.playstore': 'Play Store',
    'platform.voting': 'Voting',

    // Task Types
    'taskType.review': 'Review',
    'taskType.comment': 'Comment',
    'taskType.like': 'Like',
    'taskType.follow': 'Follow',
    'taskType.subscribe': 'Subscribe',
    'taskType.install_review': 'Install & Review',
    'taskType.vote': 'Vote',

    // Voting Tasks
    'voting.instructions': 'How to complete this voting task:',
    'voting.step1': 'Click the voting link below to open the voting page',
    'voting.step2': 'Cast your vote for the specified contestant',
    'voting.step3': 'Take a screenshot of your vote confirmation',
    'voting.step4': 'Upload the screenshot as proof',
    'voting.openLink': 'Open Voting Page',

    // Guest Task Flow
    'guest.enterEmail': 'Enter your email address',
    'guest.emailHint': 'Use the same email when creating your account to claim rewards',
    'guest.submitProof': 'Submit & Claim ₹{amount}',
    'guest.success': 'Submission Received!',
    'guest.successMsg': 'Your proof has been submitted for review.',
    'guest.createAccount': 'Create an account with this email to track and withdraw your rewards!',
    'guest.alreadySubmitted': 'You have already submitted for this task with this email.',
    'guest.proofScreenshot': 'Proof Screenshot',
    'guest.uploadHint': 'Click or drag to upload screenshot',

    // Header
    'header.safe': 'Safe & Secure',
    'header.earnings': 'Easy Earnings',
    'header.language': 'Change Language',
  },
  hi: {
    // Language Selection
    'language.select': 'अपनी भाषा चुनें',
    'language.english': 'English',
    'language.hindi': 'हिंदी (Hindi)',
    'language.continue': 'जारी रखें',
    'language.welcome': 'TeenPay में आपका स्वागत है!',
    'language.choose': 'शुरू करने के लिए कृपया अपनी पसंदीदा भाषा चुनें।',

    // Dashboard Header
    'dashboard.welcome': 'वापसी पर स्वागत है, {name}! 👋',
    'dashboard.ready': 'आज कुछ पैसे कमाने के लिए तैयार हैं?',
    'dashboard.age': 'उम्र: {age}',
    'dashboard.member': 'आज से सदस्य',
    'dashboard.signout': 'साइन आउट',

    // Earnings Card
    'earnings.today': 'आज की कमाई',
    'earnings.total': 'कुल कमाई',
    'earnings.keepup': 'बढ़िया काम! 🚀',
    'earnings.withdraw': 'निकालने के लिए तैयार! 💰',
    'earnings.need': 'निकालने के लिए ₹{amount} चाहिए',

    // Navigation Tabs
    'nav.available': 'उपलब्ध कार्य',
    'nav.pending': 'लंबित कार्य',
    'nav.completed': 'पूर्ण कार्य',
    'nav.withdraw': 'पैसे निकालें',
    'nav.referral': 'रेफर करें और कमाएं',

    // Task Instructions
    'task.instructions': 'इस कार्य को पूरा करने का तरीका:',
    'task.step1': 'ऊपर "Google Profile खोलें" पर क्लिक करें',
    'task.step2': 'उनके Google profile पर review section खोजें',
    'task.step3': '"Write a review" या समान बटन पर क्लिक करें',
    'task.step4': 'उन्हें {rating} स्टार दें',
    'task.step5': 'ऊपर दिया गया review text कॉपी करके paste करें',
    'task.step6': 'Google पर review submit करें',
    'task.step7': 'यहाँ वापस आकर screenshot submit करें',
    'task.show': 'निर्देश दिखाएं',
    'task.hide': 'निर्देश छुपाएं',
    'task.submit': 'Screenshot के साथ कार्य जमा करें (₹{amount})',
    'task.copy': 'कॉपी करें',
    'task.copied': 'कॉपी हो गया!',
    'task.review': 'कॉपी करने के लिए Review:',
    'task.profile': 'Review करने के लिए Google Profile:',
    'task.open': 'Google Profile खोलें',
    'task.important': 'महत्वपूर्ण:',
    'task.warning': 'एक बार आप यह कार्य जमा कर देंगे, तो यह तुरंत सभी की कार्य सूची से हट जाएगा। केवल एक उपयोगकर्ता प्रत्येक कार्य को पूरा कर सकता है। निर्देशों का सावधानीपूर्वक पालन करना सुनिश्चित करें।',

    // Task Status
    'status.submitted': '⏳ समीक्षा के लिए जमा किया गया',
    'status.pending': 'Admin समीक्षा के लिए तैयार',
    'status.approved': 'कार्य स्वीकृत! ₹{amount} आपके खाते में जमा',
    'status.rejected': 'कार्य अस्वीकृत',
    'status.review': 'आपका कार्य submission हमारी admin team द्वारा समीक्षा की जा रही है। स्वीकृत या अस्वीकृत होने पर आपको सूचित किया जाएगा।',
    'status.waiting': 'आपका कार्य admin समीक्षा और अनुमोदन की प्रतीक्षा में है।',
    'status.credited': 'आपकी कमाई आपके खाते की शेष राशि में जोड़ दी गई है।',
    'status.tryagain': 'कृपया एक वैध screenshot के साथ फिर से कोशिश करें।',

    // Company Policy
    'policy.title': '⚠️ महत्वपूर्ण समीक्षा नीति',
    'policy.one': 'प्रति कंपनी एक समीक्षा:',
    'policy.description': 'आप प्रति कंपनी केवल एक समीक्षा जमा कर सकते हैं। एक बार जब आप {company} के लिए कोई भी कार्य पूरा कर लेते हैं, तो आप इस कंपनी के लिए अतिरिक्त समीक्षा जमा नहीं कर सकते। अपना कार्य सावधानीपूर्वक चुनें क्योंकि यह {company} से कमाने का आपका एकमात्र अवसर है।',

    // Task Submission
    'submit.title': 'कार्य Screenshot जमा करें',
    'submit.update': 'कार्य Screenshot अपडेट करें',
    'submit.drop': 'अपना screenshot यहाँ छोड़ें',
    'submit.browse': 'या browse करने के लिए क्लिक करें',
    'submit.choose': 'फ़ाइल चुनें',
    'submit.remove': 'हटाएं',
    'submit.submitting': 'जमा कर रहे हैं...',
    'submit.submit': 'समीक्षा के लिए जमा करें',
    'submit.update_btn': 'Submission अपडेट करें',
    'submit.cancel': 'रद्द करें',
    'submit.note': 'नोट:',
    'submit.update_note': 'आपका submission अपडेट करने से समीक्षा स्थिति pending पर रीसेट हो जाएगी। Admin को आपके नए screenshot की समीक्षा करनी होगी।',
    'submit.important_note': 'महत्वपूर्ण: कृपया एक स्पष्ट screenshot अपलोड करें जो दिखाता हो कि आपने निर्देशानुसार Google review पूरा किया है। कमाई जमा होने से पहले आपके submission की हमारी admin team द्वारा समीक्षा की जाएगी। याद रखें: प्रति profile केवल एक समीक्षा स्वीकार की जाएगी।',
    'submit.success_title': 'कार्य सफलतापूर्वक जमा किया गया!',
    'submit.success_message': 'आपका कार्य समीक्षा के लिए जमा कर दिया गया है। हमारी admin team आपके submission को सत्यापित करेगी और अनुमोदन के बाद आपकी कमाई जमा करेगी।',
    'submit.update_success': 'आपका कार्य submission सफलतापूर्वक अपडेट कर दिया गया है। Admin team आपके नए screenshot की समीक्षा करेगी।',
    'submit.review_time': 'समीक्षा समय: 2-3 कार्य दिवस',
    'submit.reward_pending': 'अनुमोदन के बाद ₹{amount} जमा किया जाएगा',

    // Withdrawal
    'withdraw.title': 'कमाई निकालें',
    'withdraw.available': 'उपलब्ध: ₹{amount}',
    'withdraw.minimum': 'न्यूनतम शेष राशि आवश्यक',
    'withdraw.need_amount': 'निकासी करने के लिए आपको कम से कम ₹{min} की आवश्यकता है। आपके पास वर्तमान में ₹{current} है।',
    'withdraw.keep_earning': 'न्यूनतम निकासी राशि तक पहुंचने के लिए कार्य पूरे करते रहें! आपको ₹{need} और चाहिए।',
    'withdraw.info': 'निकासी जानकारी',
    'withdraw.min': '• न्यूनतम निकासी: ₹{min}',
    'withdraw.processing': '• प्रसंस्करण समय: 2-3 कार्य दिवस',
    'withdraw.balance': '• उपलब्ध शेष: ₹{balance}',
    'withdraw.fees': '• कोई प्रसंस्करण शुल्क नहीं',
    'withdraw.upi': 'UPI ID',
    'withdraw.amount': 'निकासी राशि (₹)',
    'withdraw.amount_placeholder': 'राशि दर्ज करें (न्यूनतम: ₹{min})',
    'withdraw.request': 'निकासी का अनुरोध करें',
    'withdraw.success': 'निकासी का अनुरोध किया गया!',
    'withdraw.success_msg': 'आपका निकासी अनुरोध सफलतापूर्वक जमा किया गया है। आपको 2-3 कार्य दिवसों के भीतर अपने UPI खाते में पैसे मिल जाएंगे।',
    'withdraw.another': 'एक और निकासी करें',

    // Task History
    'history.title': 'कार्य इतिहास',
    'history.completed': '{count} कार्य पूर्ण',
    'history.none': 'कोई कार्य इतिहास नहीं',
    'history.first': 'अपनी कमाई का इतिहास यहाँ देखने के लिए अपना पहला कार्य पूरा करें!',
    'history.approved': 'स्वीकृत',

    // Pending Tasks
    'pending.title': 'मेरे जमा किए गए कार्य',
    'pending.submissions': '{count} submissions',
    'pending.none': 'कोई जमा किए गए कार्य नहीं',
    'pending.description': 'समीक्षा के लिए जमा किए गए कार्य यहाँ दिखाई देंगे। आप लंबित submissions को edit या delete कर सकते हैं।',
    'pending.submitted': 'जमा किया गया:',
    'pending.estimated': 'अनुमानित अनुमोदन:',
    'pending.reviewed': 'समीक्षा की गई:',
    'pending.notes': 'Admin नोट्स:',
    'pending.screenshot': 'Screenshot:',
    'pending.uploaded': 'Screenshot अपलोड किया गया',
    'pending.edit': 'संपादित करें',
    'pending.delete': 'हटाएं',
    'pending.resubmit': 'फिर से जमा करें',
    'pending.verification': 'सत्यापन के तहत',
    'pending.ready': 'समीक्षा के लिए तैयार',

    // No Tasks Available
    'notasks.title': 'कोई कार्य उपलब्ध नहीं',
    'notasks.description': 'सभी उपलब्ध कार्य पूर्ण हो गए हैं या आपने पहले से ही इन profiles को submit किया है। नए अवसरों के लिए बाद में जांचें।',
    'notasks.tip': '💡 सुझाव: याद रखें, आप प्रति profile केवल एक समीक्षा जमा कर सकते हैं। नए कार्य नियमित रूप से जोड़े जाते हैं!',

    // Companies
    'companies.available': '{count} कार्य उपलब्ध',
    'companies.instruction': '👆 प्रत्येक कंपनी के नीचे "कार्य देखें" पर क्लिक करके उपलब्ध कार्य देखें और पूरा करें',
    'companies.view': 'कार्य देखें',
    'companies.hide': 'कार्य छुपाएं',
    'companies.none': 'कोई कंपनी उपलब्ध नहीं',
    'companies.check': 'वर्तमान में कोई कंपनी कार्य की पेशकश नहीं कर रही है। नए अवसरों के लिए बाद में जांचें!',

    // General
    'general.loading': 'लोड हो रहा है...',
    'general.error': 'त्रुटि',
    'general.success': 'सफलता',
    'general.confirm': 'क्या आप सुनिश्चित हैं?',
    'general.yes': 'हाँ',
    'general.no': 'नहीं',
    'general.close': 'बंद करें',
    'general.save': 'सेव करें',
    'general.edit': 'संपादित करें',
    'general.delete': 'हटाएं',
    'general.view': 'देखें',

    // Platforms
    'platform.google': 'गूगल',
    'platform.instagram': 'इंस्टाग्राम',
    'platform.youtube': 'यूट्यूब',
    'platform.playstore': 'प्ले स्टोर',
    'platform.voting': 'वोटिंग',

    // Task Types
    'taskType.review': 'रिव्यू',
    'taskType.comment': 'कमेंट',
    'taskType.like': 'लाइक',
    'taskType.follow': 'फॉलो',
    'taskType.subscribe': 'सब्सक्राइब',
    'taskType.install_review': 'इंस्टॉल और रिव्यू',
    'taskType.vote': 'वोट',

    // Voting Tasks
    'voting.instructions': 'इस वोटिंग कार्य को कैसे पूरा करें:',
    'voting.step1': 'वोटिंग पेज खोलने के लिए नीचे दिए गए वोटिंग लिंक पर क्लिक करें',
    'voting.step2': 'निर्दिष्ट प्रतियोगी के लिए अपना वोट डालें',
    'voting.step3': 'अपने वोट पुष्टिकरण का स्क्रीनशॉट लें',
    'voting.step4': 'प्रमाण के रूप में स्क्रीनशॉट अपलोड करें',
    'voting.openLink': 'वोटिंग पेज खोलें',

    // Guest Task Flow
    'guest.enterEmail': 'अपना ईमेल पता दर्ज करें',
    'guest.emailHint': 'पुरस्कार प्राप्त करने के लिए अपना खाता बनाते समय वही ईमेल उपयोग करें',
    'guest.submitProof': 'जमा करें और ₹{amount} प्राप्त करें',
    'guest.success': 'सबमिशन प्राप्त हुआ!',
    'guest.successMsg': 'आपका प्रमाण समीक्षा के लिए जमा कर दिया गया है।',
    'guest.createAccount': 'अपने पुरस्कारों को ट्रैक और निकालने के लिए इस ईमेल से खाता बनाएं!',
    'guest.alreadySubmitted': 'आपने इस ईमेल से इस कार्य के लिए पहले ही जमा कर दिया है।',
    'guest.proofScreenshot': 'प्रमाण स्क्रीनशॉट',
    'guest.uploadHint': 'स्क्रीनशॉट अपलोड करने के लिए क्लिक करें या खींचें',

    // Header
    'header.safe': 'सुरक्षित और संरक्षित',
    'header.earnings': 'आसान कमाई',
    'header.language': 'भाषा बदलें',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('teenpay_language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'hi')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('teenpay_language', lang);
  };

  const t = (key: string, params?: Record<string, string | number>) => {
    let translation = translations[language][key] || translations['en'][key] || key;
    
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(`{${param}}`, String(value));
      });
    }
    
    return translation;
  };

  const value = {
    language,
    setLanguage: handleSetLanguage,
    t,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};