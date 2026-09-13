package com.example.ullaparapressclub.data.model

data class NewsTip(
    val id: String,
    val senderName: String,
    val senderPhone: String,
    val location: String,
    val headline: String,
    val details: String,
    val submittedAt: String,
    val status: String = "Under Review"
)
