package com.example.ullaparapressclub.data.model

data class PressEvent(
    val id: String,
    val titleBn: String,
    val titleEn: String,
    val date: String,
    val time: String,
    val venueBn: String,
    val venueEn: String,
    val organizerBn: String,
    val descriptionBn: String,
    val eventType: EventType,
    val isRsvpd: Boolean = false
)

enum class EventType(val labelBn: String, val badgeColorHex: Long) {
    GENERAL_MEETING("মাসিক সাধারণ সভা", 0xFF0F2648),
    PRESS_CONFERENCE("সংবাদ সম্মেলন", 0xFF9E1F28),
    DOA_MAHFIL("দোয়া মাহফিল ও স্মরণ", 0xFF1B6B4A),
    WORKSHOP("সাংবাদিকতা কর্মশালা", 0xFFD4972C),
    CULTURAL("সাংস্কৃতিক ও মিলনমেলা", 0xFF5B3096)
}
