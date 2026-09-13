package com.example.ullaparapressclub.ui.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
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
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material.icons.filled.Badge
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.Campaign
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.Emergency
import androidx.compose.material.icons.filled.Newspaper
import androidx.compose.material.icons.filled.Send
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ullaparapressclub.R
import com.example.ullaparapressclub.data.model.Member
import com.example.ullaparapressclub.data.model.NewsItem
import com.example.ullaparapressclub.data.model.PressEvent
import com.example.ullaparapressclub.ui.AppTab
import com.example.ullaparapressclub.ui.components.MemberCard
import com.example.ullaparapressclub.ui.components.NewsCard
import com.example.ullaparapressclub.ui.components.dialNumber
import com.example.ullaparapressclub.ui.theme.EditorialCrimson
import com.example.ullaparapressclub.ui.theme.GoldAccent
import com.example.ullaparapressclub.ui.theme.GoldAccentDark
import com.example.ullaparapressclub.ui.theme.PressNavyDark
import com.example.ullaparapressclub.ui.theme.PressNavyPrimary

@Composable
fun HomeScreen(
    isBengali: Boolean,
    members: List<Member>,
    newsList: List<NewsItem>,
    events: List<PressEvent>,
    onSelectTab: (AppTab) -> Unit,
    onOpenMemberDetail: (Member) -> Unit,
    onOpenArticleDetail: (NewsItem) -> Unit,
    onToggleBookmark: (String) -> Unit,
    onOpenDigitalCard: () -> Unit,
    onOpenNewsTipDialog: () -> Unit,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val executiveMembers = members.filter { it.isExecutive }.take(3)
    val latestNews = newsList.take(3)
    val upcomingEvent = events.firstOrNull()

    LazyColumn(
        modifier = modifier.fillMaxSize(),
        contentPadding = PaddingValues(bottom = 24.dp)
    ) {
        // Hero Banner with Editorial Visual
        item {
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                shape = RoundedCornerShape(18.dp),
                elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
            ) {
                Box(modifier = Modifier.fillMaxWidth()) {
                    Image(
                        painter = painterResource(id = R.drawable.press_club_banner),
                        contentDescription = "Ullapara Press Club Header",
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(170.dp),
                        contentScale = ContentScale.Crop
                    )
                    // Gradient overlay
                    Box(
                        modifier = Modifier
                            .matchParentSize()
                            .background(
                                Brush.verticalGradient(
                                    colors = listOf(
                                        Color.Transparent,
                                        PressNavyDark.copy(alpha = 0.92f)
                                    )
                                )
                            )
                    )
                    // Banner text
                    Column(
                        modifier = Modifier
                            .align(Alignment.BottomStart)
                            .padding(16.dp)
                    ) {
                        Surface(
                            shape = RoundedCornerShape(4.dp),
                            color = GoldAccent
                        ) {
                            Text(
                                text = if (isBengali) "ঐতিহ্য ও বস্তুনিষ্ঠ সাংবাদিকতা" else "TRUTH & INTEGRITY IN JOURNALISM",
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = PressNavyDark,
                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                            )
                        }
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = if (isBengali) "উল্লাপাড়া প্রেস ক্লাব বার্তা ভবন" else "Ullapara Press Club Portal",
                            color = Color.White,
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = if (isBengali) "উত্তরবঙ্গের উন্নয়ন ও গণমানুষের অধিকার প্রতিষ্ঠায় অগ্রণী ভূমিকা" else "Voice of Ullapara and Sirajganj since 1984",
                            color = Color.White.copy(alpha = 0.85f),
                            fontSize = 11.sp
                        )
                    }
                }
            }
        }

        // Quick Stats Strip
        item {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                StatBadge(
                    number = "৩৮+",
                    label = if (isBengali) "স্বীকৃত সদস্য" else "Members",
                    modifier = Modifier.weight(1f)
                )
                StatBadge(
                    number = "১৪+",
                    label = if (isBengali) "গণমাধ্যম" else "Media Outlets",
                    modifier = Modifier.weight(1f)
                )
                StatBadge(
                    number = "১৯৮৪",
                    label = if (isBengali) "প্রতিষ্ঠিত" else "Est. Year",
                    modifier = Modifier.weight(1f)
                )
                StatBadge(
                    number = "২৪/৭",
                    label = if (isBengali) "প্রেস ডেস্ক" else "Press Desk",
                    modifier = Modifier.weight(1f)
                )
            }
        }

        // Quick Action Grid
        item {
            Spacer(modifier = Modifier.height(18.dp))
            Text(
                text = if (isBengali) "জরুরি ও দ্রুত সেবা" else "Quick Actions",
                style = MaterialTheme.typography.titleMedium.copy(
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp
                ),
                modifier = Modifier.padding(horizontal = 16.dp)
            )
            Spacer(modifier = Modifier.height(10.dp))

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                ActionCard(
                    icon = Icons.Default.Campaign,
                    title = if (isBengali) "তথ্য পাঠান" else "Submit Tip",
                    subtitle = if (isBengali) "প্রেস ডেস্কে তথ্য" else "To Desk",
                    iconColor = PressNavyPrimary,
                    bgColor = PressNavyPrimary.copy(alpha = 0.1f),
                    onClick = onOpenNewsTipDialog,
                    modifier = Modifier
                        .weight(1f)
                        .testTag("home_submit_tip_button")
                )
                ActionCard(
                    icon = Icons.Default.Emergency,
                    title = if (isBengali) "জরুরি হটলাইন" else "Emergency",
                    subtitle = if (isBengali) "ইউএনও, ওসি, ফায়ার" else "Police, Hospital",
                    iconColor = EditorialCrimson,
                    bgColor = EditorialCrimson.copy(alpha = 0.1f),
                    onClick = { onSelectTab(AppTab.DESK) },
                    modifier = Modifier
                        .weight(1f)
                        .testTag("home_emergency_button")
                )
                ActionCard(
                    icon = Icons.Default.Badge,
                    title = if (isBengali) "প্রেস আইডি" else "Press ID",
                    subtitle = if (isBengali) "ডিজিটাল কার্ড" else "Accreditation",
                    iconColor = GoldAccentDark,
                    bgColor = GoldAccent.copy(alpha = 0.15f),
                    onClick = onOpenDigitalCard,
                    modifier = Modifier
                        .weight(1f)
                        .testTag("home_press_card_button")
                )
            }
        }

        // Upcoming Event Highlight
        if (upcomingEvent != null) {
            item {
                Spacer(modifier = Modifier.height(20.dp))
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = if (isBengali) "আসন্ন কর্মসূচি ও সভা" else "Upcoming Events",
                        style = MaterialTheme.typography.titleMedium.copy(
                            fontWeight = FontWeight.Bold,
                            fontSize = 16.sp
                        )
                    )
                    TextButton(onClick = { onSelectTab(AppTab.EVENTS) }) {
                        Text(text = if (isBengali) "সবগুলো দেখুন" else "View All", fontSize = 12.sp)
                    }
                }

                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp)
                        .clickable { onSelectTab(AppTab.EVENTS) },
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(14.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Surface(
                            shape = RoundedCornerShape(10.dp),
                            color = PressNavyPrimary,
                            modifier = Modifier.size(50.dp)
                        ) {
                            Column(
                                modifier = Modifier.fillMaxSize(),
                                horizontalAlignment = Alignment.CenterHorizontally,
                                verticalArrangement = Arrangement.Center
                            ) {
                                Icon(
                                    imageVector = Icons.Default.CalendarMonth,
                                    contentDescription = null,
                                    tint = GoldAccent,
                                    modifier = Modifier.size(20.dp)
                                )
                                Text(
                                    text = "ইভেন্ট",
                                    fontSize = 9.sp,
                                    color = Color.White,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }

                        Spacer(modifier = Modifier.width(12.dp))

                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = if (isBengali) upcomingEvent.titleBn else upcomingEvent.titleEn,
                                fontWeight = FontWeight.Bold,
                                fontSize = 14.sp,
                                maxLines = 1
                            )
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = "${upcomingEvent.date} • ${upcomingEvent.time}",
                                fontSize = 11.sp,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Text(
                                text = upcomingEvent.venueBn,
                                fontSize = 11.sp,
                                color = PressNavyPrimary,
                                maxLines = 1
                            )
                        }

                        Icon(
                            imageVector = Icons.Default.ArrowForward,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.size(16.dp)
                        )
                    }
                }
            }
        }

        // Latest Press Releases / News
        item {
            Spacer(modifier = Modifier.height(20.dp))
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = if (isBengali) "তাজা খবর ও প্রেস বিজ্ঞপ্তি" else "Latest News & Releases",
                    style = MaterialTheme.typography.titleMedium.copy(
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp
                    )
                )
                TextButton(onClick = { onSelectTab(AppTab.NEWS) }) {
                    Text(text = if (isBengali) "সব সংবাদ" else "See All", fontSize = 12.sp)
                }
            }
        }

        items(latestNews) { news ->
            NewsCard(
                news = news,
                isBengali = isBengali,
                onClick = { onOpenArticleDetail(news) },
                onToggleBookmark = { onToggleBookmark(news.id) },
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 6.dp)
            )
        }

        // Executive Committee Spotlight
        item {
            Spacer(modifier = Modifier.height(20.dp))
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = if (isBengali) "কার্যনির্বাহী নেতৃবৃন্দ" else "Executive Leadership",
                    style = MaterialTheme.typography.titleMedium.copy(
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp
                    )
                )
                TextButton(onClick = { onSelectTab(AppTab.MEMBERS) }) {
                    Text(text = if (isBengali) "সকল সাংবাদিক" else "All Members", fontSize = 12.sp)
                }
            }
        }

        items(executiveMembers) { member ->
            MemberCard(
                member = member,
                isBengali = isBengali,
                onClick = { onOpenMemberDetail(member) },
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 5.dp)
            )
        }
    }
}

@Composable
private fun StatBadge(
    number: String,
    label: String,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(10.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 8.dp, horizontal = 4.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = number,
                fontWeight = FontWeight.Bold,
                fontSize = 15.sp,
                color = PressNavyPrimary
            )
            Text(
                text = label,
                fontSize = 10.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

@Composable
private fun ActionCard(
    icon: ImageVector,
    title: String,
    subtitle: String,
    iconColor: Color,
    bgColor: Color,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.clickable { onClick() },
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.5.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(10.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Box(
                modifier = Modifier
                    .size(38.dp)
                    .clip(CircleShape)
                    .background(bgColor),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = title,
                    tint = iconColor,
                    modifier = Modifier.size(20.dp)
                )
            }
            Spacer(modifier = Modifier.height(6.dp))
            Text(
                text = title,
                fontWeight = FontWeight.Bold,
                fontSize = 12.sp,
                color = MaterialTheme.colorScheme.onSurface
            )
            Text(
                text = subtitle,
                fontSize = 9.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}
