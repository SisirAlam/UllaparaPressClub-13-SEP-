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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Bookmark
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.Newspaper
import androidx.compose.material.icons.filled.Search
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
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ullaparapressclub.data.model.NewsCategory
import com.example.ullaparapressclub.data.model.NewsItem
import com.example.ullaparapressclub.ui.components.NewsCard
import com.example.ullaparapressclub.ui.theme.EditorialCrimson
import com.example.ullaparapressclub.ui.theme.GoldAccent
import com.example.ullaparapressclub.ui.theme.PressNavyPrimary

@Composable
fun NewsScreen(
    newsList: List<NewsItem>,
    isBengali: Boolean,
    searchQuery: String,
    selectedCategory: NewsCategory,
    bookmarksOnly: Boolean,
    onSearchChange: (String) -> Unit,
    onSelectCategory: (NewsCategory) -> Unit,
    onToggleBookmarksOnly: (Boolean) -> Unit,
    onOpenArticleDetail: (NewsItem) -> Unit,
    onToggleBookmark: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    Column(modifier = modifier.fillMaxSize()) {
        // Search & Filter header
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
                        .testTag("news_search_input"),
                    placeholder = {
                        Text(
                            text = if (isBengali) "সংবাদ বা বিজ্ঞপ্তি খুঁজুন..." else "Search news or notices...",
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

                // Category Chips Row
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .horizontalScroll(rememberScrollState()),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Bookmarked Toggle Chip
                    FilterChip(
                        selected = bookmarksOnly,
                        onClick = { onToggleBookmarksOnly(!bookmarksOnly) },
                        label = {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(
                                    imageVector = Icons.Default.Bookmark,
                                    contentDescription = null,
                                    tint = if (bookmarksOnly) GoldAccent else MaterialTheme.colorScheme.onSurfaceVariant,
                                    modifier = Modifier.size(14.dp)
                                )
                                Spacer(modifier = Modifier.size(4.dp))
                                Text(if (isBengali) "বুকমার্ক" else "Saved", fontSize = 12.sp)
                            }
                        },
                        modifier = Modifier.testTag("filter_news_bookmarks")
                    )

                    // Categories
                    NewsCategory.values().forEach { cat ->
                        FilterChip(
                            selected = selectedCategory == cat,
                            onClick = { onSelectCategory(cat) },
                            label = {
                                Text(
                                    text = if (isBengali) cat.labelBn else cat.labelEn,
                                    fontSize = 12.sp
                                )
                            },
                            colors = if (cat == NewsCategory.PRESS_RELEASE) FilterChipDefaults.filterChipColors(
                                selectedContainerColor = EditorialCrimson.copy(alpha = 0.15f),
                                selectedLabelColor = EditorialCrimson
                            ) else FilterChipDefaults.filterChipColors(),
                            modifier = Modifier.testTag("filter_category_${cat.name}")
                        )
                    }
                }
            }
        }

        // Count / Info row
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 8.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = if (isBengali) "সংবাদের সংখ্যা: ${newsList.size} টি" else "Articles: ${newsList.size}",
                fontSize = 12.sp,
                fontWeight = FontWeight.SemiBold,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            if (selectedCategory != NewsCategory.ALL) {
                Surface(
                    shape = RoundedCornerShape(4.dp),
                    color = PressNavyPrimary.copy(alpha = 0.1f)
                ) {
                    Text(
                        text = if (isBengali) selectedCategory.labelBn else selectedCategory.labelEn,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = PressNavyPrimary,
                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                    )
                }
            }
        }

        // News List
        if (newsList.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(32.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        imageVector = Icons.Default.Newspaper,
                        contentDescription = null,
                        modifier = Modifier.size(48.dp),
                        tint = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.4f)
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    Text(
                        text = if (isBengali) "কোনো সংবাদ খুঁজে পাওয়া যায়নি" else "No articles found",
                        fontWeight = FontWeight.SemiBold,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        } else {
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(start = 16.dp, end = 16.dp, bottom = 20.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                items(newsList, key = { it.id }) { news ->
                    NewsCard(
                        news = news,
                        isBengali = isBengali,
                        onClick = { onOpenArticleDetail(news) },
                        onToggleBookmark = { onToggleBookmark(news.id) }
                    )
                }
            }
        }
    }
}
