package com.example.ullaparapressclub.ui.screens

import androidx.compose.foundation.horizontalScroll
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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Bloodtype
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.FilterList
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ullaparapressclub.data.model.Member
import com.example.ullaparapressclub.ui.components.MemberCard
import com.example.ullaparapressclub.ui.theme.EditorialCrimson
import com.example.ullaparapressclub.ui.theme.GoldAccent
import com.example.ullaparapressclub.ui.theme.PressNavyPrimary

@Composable
fun MembersScreen(
    members: List<Member>,
    isBengali: Boolean,
    searchQuery: String,
    executiveOnly: Boolean,
    selectedBloodFilter: String,
    onSearchChange: (String) -> Unit,
    onToggleExecutiveOnly: (Boolean) -> Unit,
    onSelectBloodFilter: (String) -> Unit,
    onOpenMemberDetail: (Member) -> Unit,
    modifier: Modifier = Modifier
) {
    val bloodGroups = listOf("ALL", "A+", "B+", "O+", "AB+", "O-", "AB-")

    Column(
        modifier = modifier.fillMaxSize()
    ) {
        // Search Bar
        Surface(
            modifier = Modifier.fillMaxWidth(),
            color = MaterialTheme.colorScheme.surface,
            shadowElevation = 1.dp
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 10.dp)
            ) {
                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = onSearchChange,
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("member_search_input"),
                    placeholder = {
                        Text(
                            text = if (isBengali) "নাম, পত্রিকা বা পদবী দিয়ে খুঁজুন..." else "Search by name, media, post...",
                            fontSize = 13.sp
                        )
                    },
                    leadingIcon = {
                        Icon(
                            imageVector = Icons.Default.Search,
                            contentDescription = "Search",
                            tint = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    },
                    trailingIcon = {
                        if (searchQuery.isNotEmpty()) {
                            IconButton(onClick = { onSearchChange("") }) {
                                Icon(imageVector = Icons.Default.Clear, contentDescription = "Clear")
                            }
                        }
                    },
                    singleLine = true,
                    shape = RoundedCornerShape(12.dp)
                )

                Spacer(modifier = Modifier.height(8.dp))

                // Filter Chips Row
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .horizontalScroll(rememberScrollState()),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    FilterChip(
                        selected = !executiveOnly,
                        onClick = { onToggleExecutiveOnly(false) },
                        label = { Text(if (isBengali) "সকল সদস্য" else "All Members", fontSize = 12.sp) },
                        modifier = Modifier.testTag("filter_all_members")
                    )

                    FilterChip(
                        selected = executiveOnly,
                        onClick = { onToggleExecutiveOnly(!executiveOnly) },
                        label = {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(
                                    imageVector = Icons.Default.Star,
                                    contentDescription = null,
                                    modifier = Modifier.size(12.dp)
                                )
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(if (isBengali) "কার্যনির্বাহী কমিটি" else "Executive Committee", fontSize = 12.sp)
                            }
                        },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = GoldAccent.copy(alpha = 0.2f),
                            selectedLabelColor = PressNavyPrimary
                        ),
                        modifier = Modifier.testTag("filter_executive_members")
                    )

                    // Blood group chips
                    bloodGroups.forEach { bg ->
                        FilterChip(
                            selected = selectedBloodFilter == bg,
                            onClick = { onSelectBloodFilter(bg) },
                            label = {
                                Text(
                                    text = if (bg == "ALL") (if (isBengali) "রক্ত: সকল" else "Blood: All") else "রক্ত $bg",
                                    fontSize = 11.sp
                                )
                            },
                            colors = if (bg != "ALL") FilterChipDefaults.filterChipColors(
                                selectedContainerColor = EditorialCrimson.copy(alpha = 0.15f),
                                selectedLabelColor = EditorialCrimson
                            ) else FilterChipDefaults.filterChipColors(),
                            modifier = Modifier.testTag("filter_blood_$bg")
                        )
                    }
                }
            }
        }

        // Member Count Bar
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 8.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = if (isBengali) "মোট সদস্য: ${members.size} জন" else "Total Members: ${members.size}",
                fontSize = 12.sp,
                fontWeight = FontWeight.SemiBold,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            if (executiveOnly) {
                Surface(
                    shape = RoundedCornerShape(4.dp),
                    color = PressNavyPrimary.copy(alpha = 0.1f)
                ) {
                    Text(
                        text = if (isBengali) "কার্যনির্বাহী সংসদ" else "Executive Board",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = PressNavyPrimary,
                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                    )
                }
            }
        }

        // List
        if (members.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(32.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        imageVector = Icons.Default.Search,
                        contentDescription = null,
                        modifier = Modifier.size(48.dp),
                        tint = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.4f)
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    Text(
                        text = if (isBengali) "কোনো সদস্য পাওয়া যায়নি" else "No members found",
                        fontWeight = FontWeight.SemiBold,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        } else {
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(start = 16.dp, end = 16.dp, bottom = 20.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(members, key = { it.id }) { member ->
                    MemberCard(
                        member = member,
                        isBengali = isBengali,
                        onClick = { onOpenMemberDetail(member) }
                    )
                }
            }
        }
    }
}
