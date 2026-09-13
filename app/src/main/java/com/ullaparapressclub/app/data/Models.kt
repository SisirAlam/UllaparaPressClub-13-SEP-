package com.ullaparapressclub.app.data

enum class AppLanguage(val code: String, val displayName: String) {
    BN("bn", "বাংলা"),
    EN("en", "English")
}

enum class NewsCategory(val bnLabel: String, val enLabel: String) {
    ALL("সকল সংবাদ", "All News"),
    LOCAL("উল্লাপাড়া সংবাদ", "Ullapara News"),
    PRESS_RELEASE("প্রেস বিজ্ঞপ্তি", "Press Release"),
    DISTRICT("সিরাজগঞ্জ জেলা", "Sirajganj District"),
    NATIONAL("জাতীয় ও সমসাময়িক", "National"),
    NOTICES("নোটিশ বোর্ড", "Notices")
}

data class NewsArticle(
    val id: String,
    val titleBn: String,
    val titleEn: String,
    val summaryBn: String,
    val summaryEn: String,
    val bodyBn: String,
    val bodyEn: String,
    val category: NewsCategory,
    val authorName: String,
    val authorAffiliation: String,
    val publishedDate: String,
    val isBreaking: Boolean = false,
    val isOfficialRelease: Boolean = false,
    val views: Int = 120
)

enum class CommitteeRole(val bnLabel: String, val enLabel: String, val priority: Int) {
    PRESIDENT("সভাপতি", "President", 1),
    SR_VICE_PRESIDENT("সিনিয়র সহ-সভাপতি", "Senior Vice President", 2),
    VICE_PRESIDENT("সহ-সভাপতি", "Vice President", 3),
    GENERAL_SECRETARY("সাধারণ সম্পাদক", "General Secretary", 4),
    JOINT_SECRETARY("যুগ্ম সাধারণ সম্পাদক", "Joint Secretary", 5),
    ORGANIZING_SECRETARY("সাংগঠনিক সম্পাদক", "Organizing Secretary", 6),
    FINANCE_SECRETARY("অর্থ ও হিসাব সম্পাদক", "Finance Secretary", 7),
    OFFICE_SECRETARY("দপ্তর সম্পাদক", "Office Secretary", 8),
    ICT_PUBLICATION_SECRETARY("প্রচার ও প্রকাশনা সম্পাদক", "ICT & Publication Secretary", 9),
    EXECUTIVE_MEMBER("কার্যনির্বাহী সদস্য", "Executive Member", 10),
    GENERAL_MEMBER("সাধারণ সদস্য", "General Member", 11)
}

data class JournalistMember(
    val id: String,
    val nameBn: String,
    val nameEn: String,
    val role: CommitteeRole,
    val mediaHouse: String,
    val mediaType: String, // "দৈনিক পত্রিকা", "টেলিভিশন চ্যানেল", "অনলাইন পোর্টাল"
    val phone: String,
    val email: String,
    val bloodGroup: String,
    val membershipNo: String,
    val experienceYears: Int,
    val addressBn: String,
    val addressEn: String
)

data class ClubEvent(
    val id: String,
    val titleBn: String,
    val titleEn: String,
    val date: String,
    val time: String,
    val venueBn: String,
    val venueEn: String,
    val descriptionBn: String,
    val descriptionEn: String,
    val type: String, // "সাধারণ সভা", "প্রেস ব্রিফিং", "দোয়া মাহফিল", "প্রশিক্ষণ"
    val isUpcoming: Boolean = true
)

data class EmergencyContact(
    val id: String,
    val serviceBn: String,
    val serviceEn: String,
    val designationBn: String,
    val designationEn: String,
    val phone: String,
    val category: String, // "প্রশাসন", "পুলিশ", "স্বাস্থ্য", "ফায়ার সার্ভিস", "জরুরি সেবা"
    val addressBn: String,
    val addressEn: String
)
