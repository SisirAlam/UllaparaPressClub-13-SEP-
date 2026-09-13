package com.example.ullaparapressclub.ui.screens

import android.content.Context
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Badge
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.Campaign
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Emergency
import androidx.compose.material.icons.filled.Gavel
import androidx.compose.material.icons.filled.LocalHospital
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.LocalPolice
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Divider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ullaparapressclub.data.model.ContactCategory
import com.example.ullaparapressclub.data.model.EmergencyContact
import com.example.ullaparapressclub.data.model.NewsTip
import com.example.ullaparapressclub.ui.components.dialNumber
import com.example.ullaparapressclub.ui.theme.EditorialCrimson
import com.example.ullaparapressclub.ui.theme.EmeraldGreen
import com.example.ullaparapressclub.ui.theme.GoldAccent
import com.example.ullaparapressclub.ui.theme.GoldAccentDark
import com.example.ullaparapressclub.ui.theme.PressNavyDark
import com.example.ullaparapressclub.ui.theme.PressNavyPrimary

@Composable
fun DeskScreen(
    emergencyContacts: List<EmergencyContact>,
    submittedTips: List<NewsTip>,
    isBengali: Boolean,
    onOpenDigitalCard: () -> Unit,
    onOpenNewsTipDialog: () -> Unit,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    var showEthics by remember { mutableStateOf(false) }

    LazyColumn(
        modifier = modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        // Top Action Cards
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                // Submit Tip Action
                Card(
                    modifier = Modifier
                        .weight(1f)
                        .clickable { onOpenNewsTipDialog() }
                        .testTag("desk_submit_tip_button"),
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = PressNavyPrimary)
                ) {
                    Column(
                        modifier = Modifier.padding(14.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Box(
                            modifier = Modifier
                                .size(44.dp)
                                .clip(CircleShape)
                                .background(Color.White.copy(alpha = 0.15f)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.Campaign,
                                contentDescription = null,
                                tint = GoldAccent,
                                modifier = Modifier.size(24.dp)
                            )
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = if (isBengali) "সংবাদ তথ্য পাঠান" else "Submit News Tip",
                            color = Color.White,
                            fontWeight = FontWeight.Bold,
                            fontSize = 13.sp
                        )
                        Text(
                            text = if (isBengali) "প্রেস ক্লাব বার্তা ডেস্কে" else "To Editorial Desk",
                            color = Color.White.copy(alpha = 0.8f),
                            fontSize = 10.sp
                        )
                    }
                }

                // Digital Press ID Card
                Card(
                    modifier = Modifier
                        .weight(1f)
                        .clickable { onOpenDigitalCard() }
                        .testTag("desk_view_id_button"),
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                ) {
                    Column(
                        modifier = Modifier.padding(14.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Box(
                            modifier = Modifier
                                .size(44.dp)
                                .clip(CircleShape)
                                .background(GoldAccent.copy(alpha = 0.15f)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.Badge,
                                contentDescription = null,
                                tint = GoldAccentDark,
                                modifier = Modifier.size(24.dp)
                            )
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = if (isBengali) "ডিজিটাল প্রেস আইডি" else "Digital Press ID",
                            fontWeight = FontWeight.Bold,
                            fontSize = 13.sp,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                        Text(
                            text = if (isBengali) "সাংবাদিক পরিচয়পত্র" else "Member Card",
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            fontSize = 10.sp
                        )
                    }
                }
            }
        }

        // Submitted Tips Tracker (if any)
        if (submittedTips.isNotEmpty()) {
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = EmeraldGreen.copy(alpha = 0.08f))
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.CheckCircle,
                                contentDescription = null,
                                tint = EmeraldGreen,
                                modifier = Modifier.size(16.dp)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = if (isBengali) "আপনার প্রেরিত সংবাদ তথ্য (${submittedTips.size} টি)" else "Your Submitted Tips (${submittedTips.size})",
                                fontWeight = FontWeight.Bold,
                                fontSize = 13.sp,
                                color = EmeraldGreen
                            )
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        submittedTips.forEach { tip ->
                            Surface(
                                shape = RoundedCornerShape(8.dp),
                                color = MaterialTheme.colorScheme.surface,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 4.dp)
                            ) {
                                Column(modifier = Modifier.padding(10.dp)) {
                                    Text(
                                        text = tip.headline,
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 13.sp
                                    )
                                    Text(
                                        text = "${tip.location} • ${tip.submittedAt}",
                                        fontSize = 11.sp,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                    Text(
                                        text = "অবস্থা: ${tip.status}",
                                        fontSize = 11.sp,
                                        color = EmeraldGreen,
                                        fontWeight = FontWeight.SemiBold
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }

        // Emergency Hotlines Section
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = if (isBengali) "উল্লাপাড়া ও সিরাজগঞ্জ জরুরি হটলাইন" else "Emergency Hotlines",
                    style = MaterialTheme.typography.titleMedium.copy(
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp
                    )
                )
                Surface(
                    shape = RoundedCornerShape(6.dp),
                    color = EditorialCrimson.copy(alpha = 0.1f)
                ) {
                    Text(
                        text = if (isBengali) "জরুরি সেবা" else "Direct Dial",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = EditorialCrimson,
                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                    )
                }
            }
        }

        items(emergencyContacts, key = { it.id }) { contact ->
            EmergencyContactCard(
                contact = contact,
                isBengali = isBengali,
                onDial = { dialNumber(context, contact.phone) }
            )
        }

        // Press Club Office & Secretariat Card
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = if (isBengali) "প্রেস ক্লাব বার্তা ভবন ও সচিবালয়" else "Press Club Secretariat",
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp,
                        color = PressNavyPrimary
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Row(verticalAlignment = Alignment.Top) {
                        Icon(
                            imageVector = Icons.Default.LocationOn,
                            contentDescription = null,
                            tint = EditorialCrimson,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = if (isBengali) "উল্লাপাড়া প্রেস ক্লাব ভবন, স্টেশন রোড, উল্লাপাড়া, সিরাজগঞ্জ-৬৭৪১"
                            else "Ullapara Press Club Building, Station Road, Ullapara, Sirajganj-6741",
                            fontSize = 12.sp,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                    }
                    Spacer(modifier = Modifier.height(6.dp))
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.Phone,
                            contentDescription = null,
                            tint = PressNavyPrimary,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = "হটলাইন: 01718-294050, 01712-345671",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = PressNavyPrimary
                        )
                    }
                }
            }
        }

        // Code of Ethics Expandable Card
        item {
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { showEthics = !showEthics }
                    .testTag("ethics_card"),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
                )
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.Gavel,
                                contentDescription = null,
                                tint = PressNavyPrimary,
                                modifier = Modifier.size(18.dp)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = if (isBengali) "সাংবাদিকতার নীতিমালা ও আচরণবিধি" else "Code of Journalistic Ethics",
                                fontWeight = FontWeight.Bold,
                                fontSize = 13.sp
                            )
                        }
                        Text(
                            text = if (showEthics) "সংকুচিত করুন" else "বিস্তারিত",
                            fontSize = 11.sp,
                            color = PressNavyPrimary,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    if (showEthics) {
                        Spacer(modifier = Modifier.height(10.dp))
                        Divider(color = MaterialTheme.colorScheme.outline.copy(alpha = 0.3f))
                        Spacer(modifier = Modifier.height(10.dp))
                        Text(
                            text = if (isBengali) """
                                ১. বস্তুনিষ্ঠতা ও সত্যতা: সকল সংবাদের ক্ষেত্রে ঘটনার সত্যতা যাচাই করা এবং কোনো প্রকার অপপ্রচার থেকে বিরত থাকা।
                                ২. নিরপেক্ষতা: কোনো রাজনৈতিক দল, গোষ্ঠী বা ব্যক্তিস্বার্থের ঊর্ধ্বে থেকে নিরপেক্ষ অবস্থান বজায় রাখা।
                                ৩. তথ্যসূত্র গোপনীয়তা: সংবাদের স্পর্শকাতর সোর্সের নিরাপত্তা ও পরিচয় সুরক্ষিত রাখা।
                                ৪. জনস্বার্থ অগ্রাধিকার: প্রান্তিক কৃষক, মেহনতি মানুষ ও চলনবিলের সার্বিক উন্নয়নে দায়িত্বশীল সাংবাদিকতা চর্চা করা।
                            """.trimIndent()
                            else """
                                1. Truth & Accuracy: Verify facts before publishing and avoid rumors.
                                2. Independence: Maintain strict non-partisan editorial standards.
                                3. Source Protection: Protect sensitive informants and confidential sources.
                                4. Public Interest: Champion the rights of local people and regional growth.
                            """.trimIndent(),
                            fontSize = 12.sp,
                            lineHeight = 18.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun EmergencyContactCard(
    contact: EmergencyContact,
    isBengali: Boolean,
    onDial: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .testTag("contact_card_${contact.id}"),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.5.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            val icon = when (contact.category) {
                ContactCategory.POLICE -> Icons.Default.LocalPolice
                ContactCategory.HOSPITAL -> Icons.Default.LocalHospital
                ContactCategory.FIRE_SERVICE -> Icons.Default.Emergency
                ContactCategory.ADMINISTRATION -> Icons.Default.Shield
                ContactCategory.UTILITY -> Icons.Default.Phone
            }

            Box(
                modifier = Modifier
                    .size(42.dp)
                    .clip(CircleShape)
                    .background(
                        when (contact.category) {
                            ContactCategory.POLICE -> PressNavyPrimary.copy(alpha = 0.12f)
                            ContactCategory.HOSPITAL -> EditorialCrimson.copy(alpha = 0.12f)
                            ContactCategory.FIRE_SERVICE -> EditorialCrimson.copy(alpha = 0.15f)
                            else -> PressNavyPrimary.copy(alpha = 0.1f)
                        }
                    ),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = if (contact.category == ContactCategory.HOSPITAL || contact.category == ContactCategory.FIRE_SERVICE)
                        EditorialCrimson else PressNavyPrimary,
                    modifier = Modifier.size(20.dp)
                )
            }

            Spacer(modifier = Modifier.width(12.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = if (isBengali) contact.titleBn else contact.titleEn,
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp
                )
                Text(
                    text = contact.phone,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = PressNavyPrimary
                )
                Text(
                    text = contact.addressBn,
                    fontSize = 11.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            IconButton(
                onClick = onDial,
                modifier = Modifier
                    .size(40.dp)
                    .testTag("call_contact_${contact.id}")
            ) {
                Surface(
                    modifier = Modifier.size(36.dp),
                    shape = CircleShape,
                    color = EmeraldGreen
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Icon(
                            imageVector = Icons.Default.Call,
                            contentDescription = "Call",
                            tint = Color.White,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                }
            }
        }
    }
}
