package com.example.ullaparapressclub.data.model

data class Member(
    val id: String,
    val nameEn: String,
    val nameBn: String,
    val designationEn: String,
    val designationBn: String,
    val organizationEn: String,
    val organizationBn: String,
    val phone: String,
    val email: String,
    val bloodGroup: String,
    val pressCardId: String,
    val isExecutive: Boolean = false,
    val executiveOrder: Int = 99,
    val joinYear: String = "2010",
    val bioBn: String = "",
    val photoPlaceholderColor: Long = 0xFF142B50
)
