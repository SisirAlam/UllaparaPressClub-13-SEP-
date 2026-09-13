package com.example.ullaparapressclub.ui

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.navigationBars
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Campaign
import androidx.compose.material.icons.filled.Emergency
import androidx.compose.material.icons.filled.Event
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Newspaper
import androidx.compose.material.icons.filled.People
import androidx.compose.material.icons.outlined.Emergency
import androidx.compose.material.icons.outlined.Event
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.Newspaper
import androidx.compose.material.icons.outlined.People
import androidx.compose.material3.ExtendedFloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Snackbar
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.ullaparapressclub.ui.components.ArticleDetailDialog
import com.example.ullaparapressclub.ui.components.DigitalIdCardDialog
import com.example.ullaparapressclub.ui.components.MemberDetailDialog
import com.example.ullaparapressclub.ui.components.NewsTipDialog
import com.example.ullaparapressclub.ui.components.PressClubTopBar
import com.example.ullaparapressclub.ui.screens.DeskScreen
import com.example.ullaparapressclub.ui.screens.EventsScreen
import com.example.ullaparapressclub.ui.screens.HomeScreen
import com.example.ullaparapressclub.ui.screens.MembersScreen
import com.example.ullaparapressclub.ui.screens.NewsScreen
import com.example.ullaparapressclub.ui.theme.EmeraldGreen
import com.example.ullaparapressclub.ui.theme.GoldAccent
import com.example.ullaparapressclub.ui.theme.PressNavyDark
import com.example.ullaparapressclub.ui.theme.PressNavyPrimary

@Composable
fun MainScreen(
    viewModel: MainViewModel = viewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    val rawMembers by viewModel.rawMembers.collectAsState()
    val filteredMembers by viewModel.filteredMembers.collectAsState()
    val rawNews by viewModel.rawNews.collectAsState()
    val filteredNews by viewModel.filteredNews.collectAsState()
    val events by viewModel.events.collectAsState()
    val emergencyContacts by viewModel.emergencyContacts.collectAsState()
    val submittedTips by viewModel.submittedTips.collectAsState()

    val snackbarHostState = remember { SnackbarHostState() }

    LaunchedEffect(uiState.tipSubmissionSuccessMessage) {
        uiState.tipSubmissionSuccessMessage?.let { msg ->
            snackbarHostState.showSnackbar(msg)
            viewModel.clearSuccessMessage()
        }
    }

    Scaffold(
        contentWindowInsets = WindowInsets.navigationBars,
        topBar = {
            PressClubTopBar(
                isBengali = uiState.isBengali,
                onToggleLanguage = { viewModel.toggleLanguage() },
                onOpenDigitalCard = { viewModel.openDigitalCard() }
            )
        },
        bottomBar = {
            NavigationBar(
                containerColor = MaterialTheme.colorScheme.surface,
                tonalElevation = 8.dp,
                modifier = Modifier.testTag("bottom_navigation_bar")
            ) {
                AppTab.values().forEach { tab ->
                    val isSelected = uiState.selectedTab == tab
                    val (icon, outlinedIcon) = when (tab) {
                        AppTab.HOME -> Pair(Icons.Filled.Home, Icons.Outlined.Home)
                        AppTab.MEMBERS -> Pair(Icons.Filled.People, Icons.Outlined.People)
                        AppTab.NEWS -> Pair(Icons.Filled.Newspaper, Icons.Outlined.Newspaper)
                        AppTab.EVENTS -> Pair(Icons.Filled.Event, Icons.Outlined.Event)
                        AppTab.DESK -> Pair(Icons.Filled.Emergency, Icons.Outlined.Emergency)
                    }

                    NavigationBarItem(
                        selected = isSelected,
                        onClick = { viewModel.selectTab(tab) },
                        icon = {
                            Icon(
                                imageVector = if (isSelected) icon else outlinedIcon,
                                contentDescription = if (uiState.isBengali) tab.labelBn else tab.labelEn,
                                modifier = Modifier.size(22.dp)
                            )
                        },
                        label = {
                            Text(
                                text = if (uiState.isBengali) tab.labelBn else tab.labelEn,
                                fontSize = 11.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                            )
                        },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = PressNavyPrimary,
                            selectedTextColor = PressNavyPrimary,
                            indicatorColor = GoldAccent.copy(alpha = 0.25f),
                            unselectedIconColor = MaterialTheme.colorScheme.onSurfaceVariant,
                            unselectedTextColor = MaterialTheme.colorScheme.onSurfaceVariant
                        ),
                        modifier = Modifier.testTag("nav_tab_${tab.name.lowercase()}")
                    )
                }
            }
        },
        floatingActionButton = {
            // Show FAB for quick tip submission when in Home or News tabs
            if (uiState.selectedTab == AppTab.HOME || uiState.selectedTab == AppTab.NEWS) {
                ExtendedFloatingActionButton(
                    onClick = { viewModel.openNewsTipDialog() },
                    containerColor = PressNavyPrimary,
                    contentColor = Color.White,
                    shape = RoundedCornerShape(16.dp),
                    icon = {
                        Icon(
                            imageVector = Icons.Default.Campaign,
                            contentDescription = "Submit Tip",
                            tint = GoldAccent
                        )
                    },
                    text = {
                        Text(
                            text = if (uiState.isBengali) "তথ্য পাঠান" else "Submit Tip",
                            fontWeight = FontWeight.Bold,
                            fontSize = 13.sp
                        )
                    },
                    modifier = Modifier.testTag("fab_submit_tip")
                )
            }
        },
        snackbarHost = {
            SnackbarHost(
                hostState = snackbarHostState,
                snackbar = { snackbarData ->
                    Snackbar(
                        containerColor = EmeraldGreen,
                        contentColor = Color.White,
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Text(snackbarData.visuals.message, fontWeight = FontWeight.SemiBold)
                    }
                }
            )
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            when (uiState.selectedTab) {
                AppTab.HOME -> {
                    HomeScreen(
                        isBengali = uiState.isBengali,
                        members = rawMembers,
                        newsList = rawNews,
                        events = events,
                        onSelectTab = { viewModel.selectTab(it) },
                        onOpenMemberDetail = { viewModel.openMemberDetail(it) },
                        onOpenArticleDetail = { viewModel.openArticleDetail(it) },
                        onToggleBookmark = { viewModel.toggleNewsBookmark(it) },
                        onOpenDigitalCard = { viewModel.openDigitalCard() },
                        onOpenNewsTipDialog = { viewModel.openNewsTipDialog() }
                    )
                }

                AppTab.MEMBERS -> {
                    MembersScreen(
                        members = filteredMembers,
                        isBengali = uiState.isBengali,
                        searchQuery = uiState.memberSearchQuery,
                        executiveOnly = uiState.memberExecutiveOnly,
                        selectedBloodFilter = uiState.selectedBloodFilter,
                        onSearchChange = { viewModel.updateMemberSearch(it) },
                        onToggleExecutiveOnly = { viewModel.toggleExecutiveOnly(it) },
                        onSelectBloodFilter = { viewModel.selectBloodFilter(it) },
                        onOpenMemberDetail = { viewModel.openMemberDetail(it) }
                    )
                }

                AppTab.NEWS -> {
                    NewsScreen(
                        newsList = filteredNews,
                        isBengali = uiState.isBengali,
                        searchQuery = uiState.newsSearchQuery,
                        selectedCategory = uiState.selectedNewsCategory,
                        bookmarksOnly = uiState.newsBookmarksOnly,
                        onSearchChange = { viewModel.updateNewsSearch(it) },
                        onSelectCategory = { viewModel.selectNewsCategory(it) },
                        onToggleBookmarksOnly = { viewModel.toggleBookmarksOnly(it) },
                        onOpenArticleDetail = { viewModel.openArticleDetail(it) },
                        onToggleBookmark = { viewModel.toggleNewsBookmark(it) }
                    )
                }

                AppTab.EVENTS -> {
                    EventsScreen(
                        events = events,
                        isBengali = uiState.isBengali,
                        onToggleRsvp = { viewModel.toggleEventRsvp(it) }
                    )
                }

                AppTab.DESK -> {
                    DeskScreen(
                        emergencyContacts = emergencyContacts,
                        submittedTips = submittedTips,
                        isBengali = uiState.isBengali,
                        onOpenDigitalCard = { viewModel.openDigitalCard() },
                        onOpenNewsTipDialog = { viewModel.openNewsTipDialog() }
                    )
                }
            }
        }
    }

    // Member Detail Modal Dialog
    uiState.selectedMemberDetail?.let { member ->
        MemberDetailDialog(
            member = member,
            isBengali = uiState.isBengali,
            onDismiss = { viewModel.closeMemberDetail() },
            onViewDigitalCard = { viewModel.openDigitalCard(it) }
        )
    }

    // Article Detail Modal Dialog
    uiState.selectedArticleDetail?.let { article ->
        ArticleDetailDialog(
            news = article,
            isBengali = uiState.isBengali,
            onDismiss = { viewModel.closeArticleDetail() }
        )
    }

    // Digital Press ID Card Modal Dialog
    if (uiState.isDigitalCardOpen && uiState.digitalCardMember != null) {
        DigitalIdCardDialog(
            member = uiState.digitalCardMember!!,
            isBengali = uiState.isBengali,
            onDismiss = { viewModel.closeDigitalCard() }
        )
    }

    // News Tip / Report Submission Dialog
    if (uiState.isNewsTipDialogOpen) {
        NewsTipDialog(
            isBengali = uiState.isBengali,
            onDismiss = { viewModel.closeNewsTipDialog() },
            onSubmit = { name, phone, location, title, details ->
                viewModel.submitNewsTip(name, phone, location, title, details)
            }
        )
    }
}
