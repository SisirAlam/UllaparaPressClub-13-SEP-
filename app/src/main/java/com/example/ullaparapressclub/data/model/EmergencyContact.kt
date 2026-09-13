package com.example.ullaparapressclub.data.model

data class EmergencyContact(
    val id: String,
    val titleBn: String,
    val titleEn: String,
    val authorityBn: String,
    val phone: String,
    val secondaryPhone: String = "",
    val category: ContactCategory,
    val addressBn: String
)

enum class ContactCategory(val labelBn: String) {
    ADMINISTRATION("উপজেলা প্রশাসন"),
    POLICE("পুলিশ ও থানা"),
    HOSPITAL("হাসপাতাল ও স্বাস্থ্য"),
    FIRE_SERVICE("ফায়ার সার্ভিস"),
    UTILITY("বিদ্যুৎ ও রেলওয়ে")
}
