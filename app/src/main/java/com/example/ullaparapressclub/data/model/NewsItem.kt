package com.example.ullaparapressclub.data.model

data class NewsItem(
    val id: String,
    val titleBn: String,
    val titleEn: String,
    val summaryBn: String,
    val contentBn: String,
    val category: NewsCategory,
    val date: String,
    val reporterName: String,
    val mediaHouse: String,
    val isOfficialPressRelease: Boolean = false,
    val isUrgent: Boolean = false,
    val viewCount: Int = 120,
    val isBookmarked: Boolean = false
)

enum class NewsCategory(val labelBn: String, val labelEn: String) {
    ALL("সকল", "All"),
    PRESS_RELEASE("প্রেস বিজ্ঞপ্তি", "Press Release"),
    LOCAL("স্থানীয় সংবাদ", "Local News"),
    ADMINISTRATION("প্রশাসন ও উন্নয়ন", "Administration"),
    CRIME_LAW("আইন-শৃঙ্খলা", "Law & Order"),
    AGRICULTURE("কৃষি ও চলনবিল", "Agriculture"),
    EDUCATION_CULTURE("শিক্ষা ও সংস্কৃতি", "Education & Culture"),
    OBITUARY("শোকবার্তা", "Obituary")
}
