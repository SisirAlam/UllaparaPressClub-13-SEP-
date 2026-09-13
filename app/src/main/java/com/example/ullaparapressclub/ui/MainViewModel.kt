package com.example.ullaparapressclub.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.ullaparapressclub.data.model.EmergencyContact
import com.example.ullaparapressclub.data.model.Member
import com.example.ullaparapressclub.data.model.NewsCategory
import com.example.ullaparapressclub.data.model.NewsItem
import com.example.ullaparapressclub.data.model.NewsTip
import com.example.ullaparapressclub.data.model.PressEvent
import com.example.ullaparapressclub.data.repository.PressClubRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.UUID

enum class AppTab(val index: Int, val labelBn: String, val labelEn: String) {
    HOME(0, "হোম", "Home"),
    MEMBERS(1, "সদস্য তালিকা", "Members"),
    NEWS(2, "সংবাদ ও বিজ্ঞপ্তি", "News"),
    EVENTS(3, "কর্মসূচি", "Events"),
    DESK(4, "জরুরি ও সেবা", "Desk")
}

data class UiState(
    val selectedTab: AppTab = AppTab.HOME,
    val isBengali: Boolean = true,
    val memberSearchQuery: String = "",
    val memberExecutiveOnly: Boolean = false,
    val selectedBloodFilter: String = "ALL",
    val newsSearchQuery: String = "",
    val selectedNewsCategory: NewsCategory = NewsCategory.ALL,
    val newsBookmarksOnly: Boolean = false,
    val selectedMemberDetail: Member? = null,
    val selectedArticleDetail: NewsItem? = null,
    val isDigitalCardOpen: Boolean = false,
    val digitalCardMember: Member? = null,
    val isNewsTipDialogOpen: Boolean = false,
    val tipSubmissionSuccessMessage: String? = null
)

class MainViewModel(
    private val repository: PressClubRepository = PressClubRepository()
) : ViewModel() {

    private val _uiState = MutableStateFlow(UiState())
    val uiState: StateFlow<UiState> = _uiState.asStateFlow()

    val rawMembers: StateFlow<List<Member>> = repository.members
    val rawNews: StateFlow<List<NewsItem>> = repository.news
    val events: StateFlow<List<PressEvent>> = repository.events
    val emergencyContacts: StateFlow<List<EmergencyContact>> = repository.emergencyContacts
    val submittedTips: StateFlow<List<NewsTip>> = repository.submittedTips

    // Filtered members flow
    val filteredMembers: StateFlow<List<Member>> = combine(
        rawMembers,
        _uiState
    ) { members, state ->
        members.filter { member ->
            val matchesSearch = state.memberSearchQuery.isBlank() ||
                    member.nameBn.contains(state.memberSearchQuery, ignoreCase = true) ||
                    member.nameEn.contains(state.memberSearchQuery, ignoreCase = true) ||
                    member.designationBn.contains(state.memberSearchQuery, ignoreCase = true) ||
                    member.organizationBn.contains(state.memberSearchQuery, ignoreCase = true) ||
                    member.organizationEn.contains(state.memberSearchQuery, ignoreCase = true)

            val matchesExecutive = !state.memberExecutiveOnly || member.isExecutive

            val matchesBlood = state.selectedBloodFilter == "ALL" || member.bloodGroup == state.selectedBloodFilter

            matchesSearch && matchesExecutive && matchesBlood
        }.sortedWith(compareBy({ !it.isExecutive }, { it.executiveOrder }))
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), repository.members.value)

    // Filtered news flow
    val filteredNews: StateFlow<List<NewsItem>> = combine(
        rawNews,
        _uiState
    ) { newsList, state ->
        newsList.filter { item ->
            val matchesCategory = state.selectedNewsCategory == NewsCategory.ALL ||
                    item.category == state.selectedNewsCategory

            val matchesSearch = state.newsSearchQuery.isBlank() ||
                    item.titleBn.contains(state.newsSearchQuery, ignoreCase = true) ||
                    item.summaryBn.contains(state.newsSearchQuery, ignoreCase = true) ||
                    item.reporterName.contains(state.newsSearchQuery, ignoreCase = true)

            val matchesBookmarks = !state.newsBookmarksOnly || item.isBookmarked

            matchesCategory && matchesSearch && matchesBookmarks
        }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), repository.news.value)

    fun selectTab(tab: AppTab) {
        _uiState.value = _uiState.value.copy(selectedTab = tab)
    }

    fun toggleLanguage() {
        _uiState.value = _uiState.value.copy(isBengali = !_uiState.value.isBengali)
    }

    fun updateMemberSearch(query: String) {
        _uiState.value = _uiState.value.copy(memberSearchQuery = query)
    }

    fun toggleExecutiveOnly(only: Boolean) {
        _uiState.value = _uiState.value.copy(memberExecutiveOnly = only)
    }

    fun selectBloodFilter(bloodGroup: String) {
        _uiState.value = _uiState.value.copy(selectedBloodFilter = bloodGroup)
    }

    fun updateNewsSearch(query: String) {
        _uiState.value = _uiState.value.copy(newsSearchQuery = query)
    }

    fun selectNewsCategory(category: NewsCategory) {
        _uiState.value = _uiState.value.copy(selectedNewsCategory = category)
    }

    fun toggleBookmarksOnly(only: Boolean) {
        _uiState.value = _uiState.value.copy(newsBookmarksOnly = only)
    }

    fun toggleNewsBookmark(newsId: String) {
        repository.toggleNewsBookmark(newsId)
    }

    fun toggleEventRsvp(eventId: String) {
        repository.toggleEventRsvp(eventId)
    }

    fun openMemberDetail(member: Member) {
        _uiState.value = _uiState.value.copy(selectedMemberDetail = member)
    }

    fun closeMemberDetail() {
        _uiState.value = _uiState.value.copy(selectedMemberDetail = null)
    }

    fun openArticleDetail(article: NewsItem) {
        _uiState.value = _uiState.value.copy(selectedArticleDetail = article)
    }

    fun closeArticleDetail() {
        _uiState.value = _uiState.value.copy(selectedArticleDetail = null)
    }

    fun openDigitalCard(member: Member? = null) {
        val targetMember = member ?: rawMembers.value.firstOrNull { it.nameEn.contains("Sisir", ignoreCase = true) } ?: rawMembers.value.firstOrNull()
        _uiState.value = _uiState.value.copy(
            isDigitalCardOpen = true,
            digitalCardMember = targetMember
        )
    }

    fun closeDigitalCard() {
        _uiState.value = _uiState.value.copy(isDigitalCardOpen = false)
    }

    fun openNewsTipDialog() {
        _uiState.value = _uiState.value.copy(isNewsTipDialogOpen = true, tipSubmissionSuccessMessage = null)
    }

    fun closeNewsTipDialog() {
        _uiState.value = _uiState.value.copy(isNewsTipDialogOpen = false)
    }

    fun submitNewsTip(name: String, phone: String, location: String, title: String, details: String) {
        val dateStr = SimpleDateFormat("dd MMM yyyy, hh:mm a", Locale.getDefault()).format(Date())
        val newTip = NewsTip(
            id = UUID.randomUUID().toString(),
            senderName = name.ifBlank { "বেনামী সংবাদদাতা" },
            senderPhone = phone,
            location = location.ifBlank { "উল্লাপাড়া" },
            headline = title,
            details = details,
            submittedAt = dateStr
        )
        repository.submitTip(newTip)
        _uiState.value = _uiState.value.copy(
            isNewsTipDialogOpen = false,
            tipSubmissionSuccessMessage = "তথ্যটি উল্লাপাড়া প্রেস ক্লাব বার্তা ডেস্কে সফলভাবে প্রেরিত হয়েছে!"
        )
    }

    fun clearSuccessMessage() {
        _uiState.value = _uiState.value.copy(tipSubmissionSuccessMessage = null)
    }
}
