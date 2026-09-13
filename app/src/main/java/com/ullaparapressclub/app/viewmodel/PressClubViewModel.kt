package com.ullaparapressclub.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.ullaparapressclub.app.data.AppLanguage
import com.ullaparapressclub.app.data.ClubEvent
import com.ullaparapressclub.app.data.EmergencyContact
import com.ullaparapressclub.app.data.JournalistMember
import com.ullaparapressclub.app.data.NewsArticle
import com.ullaparapressclub.app.data.NewsCategory
import com.ullaparapressclub.app.data.SampleData
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import java.util.UUID

data class PressClubUiState(
    val language: AppLanguage = AppLanguage.BN,
    val selectedTab: Int = 0,
    val selectedCategory: NewsCategory = NewsCategory.ALL,
    val newsSearchQuery: String = "",
    val allNews: List<NewsArticle> = SampleData.newsArticles,
    val filteredNews: List<NewsArticle> = SampleData.newsArticles,
    val bookmarkedIds: Set<String> = emptySet(),
    val selectedArticle: NewsArticle? = null,
    val showSubmitNewsDialog: Boolean = false,
    val directorySearchQuery: String = "",
    val selectedBloodGroup: String = "",
    val journalists: List<JournalistMember> = SampleData.journalists,
    val filteredJournalists: List<JournalistMember> = SampleData.journalists,
    val selectedMember: JournalistMember? = null,
    val events: List<ClubEvent> = SampleData.events,
    val emergencyContacts: List<EmergencyContact> = SampleData.emergencyContacts,
    val selectedEmergencyCategory: String = "",
    val feedbackMessage: String? = null
)

class PressClubViewModel : ViewModel() {

    private val _uiState = MutableStateFlow(PressClubUiState())
    val uiState: StateFlow<PressClubUiState> = _uiState

    fun toggleLanguage() {
        _uiState.value = _uiState.value.copy(
            language = if (_uiState.value.language == AppLanguage.BN) AppLanguage.EN else AppLanguage.BN
        )
    }

    fun selectTab(tabIndex: Int) {
        _uiState.value = _uiState.value.copy(selectedTab = tabIndex)
    }

    fun selectCategory(category: NewsCategory) {
        val current = _uiState.value
        val filtered = filterNews(current.allNews, category, current.newsSearchQuery)
        _uiState.value = current.copy(
            selectedCategory = category,
            filteredNews = filtered
        )
    }

    fun onNewsSearchQueryChanged(query: String) {
        val current = _uiState.value
        val filtered = filterNews(current.allNews, current.selectedCategory, query)
        _uiState.value = current.copy(
            newsSearchQuery = query,
            filteredNews = filtered
        )
    }

    private fun filterNews(
        articles: List<NewsArticle>,
        category: NewsCategory,
        query: String
    ): List<NewsArticle> {
        return articles.filter { article ->
            val matchesCategory = (category == NewsCategory.ALL || article.category == category)
            val matchesQuery = query.isBlank() ||
                    article.titleBn.contains(query, ignoreCase = true) ||
                    article.titleEn.contains(query, ignoreCase = true) ||
                    article.authorName.contains(query, ignoreCase = true) ||
                    article.authorAffiliation.contains(query, ignoreCase = true)
            matchesCategory && matchesQuery
        }
    }

    fun toggleBookmark(articleId: String) {
        val currentBookmarks = _uiState.value.bookmarkedIds.toMutableSet()
        if (currentBookmarks.contains(articleId)) {
            currentBookmarks.remove(articleId)
        } else {
            currentBookmarks.add(articleId)
        }
        _uiState.value = _uiState.value.copy(bookmarkedIds = currentBookmarks)
    }

    fun openArticle(article: NewsArticle) {
        _uiState.value = _uiState.value.copy(selectedArticle = article)
    }

    fun closeArticle() {
        _uiState.value = _uiState.value.copy(selectedArticle = null)
    }

    fun setSubmitNewsDialogVisible(visible: Boolean) {
        _uiState.value = _uiState.value.copy(showSubmitNewsDialog = visible)
    }

    fun submitNews(
        title: String,
        body: String,
        author: String,
        affiliation: String,
        category: NewsCategory
    ) {
        if (title.isBlank() || body.isBlank()) return

        val newArticle = NewsArticle(
            id = "news-${UUID.randomUUID()}",
            titleBn = title,
            titleEn = title,
            summaryBn = if (body.length > 90) body.take(90) + "..." else body,
            summaryEn = if (body.length > 90) body.take(90) + "..." else body,
            bodyBn = body,
            bodyEn = body,
            category = category,
            authorName = if (author.isNotBlank()) author else "নিজস্ব প্রতিবেদক",
            authorAffiliation = if (affiliation.isNotBlank()) affiliation else "উল্লাপাড়া প্রতিনিধি",
            publishedDate = "আজ (Today)",
            isBreaking = false,
            isOfficialRelease = false,
            views = 1
        )

        val updatedList = listOf(newArticle) + _uiState.value.allNews
        val filtered = filterNews(updatedList, _uiState.value.selectedCategory, _uiState.value.newsSearchQuery)

        _uiState.value = _uiState.value.copy(
            allNews = updatedList,
            filteredNews = filtered,
            showSubmitNewsDialog = false,
            feedbackMessage = if (_uiState.value.language == AppLanguage.BN)
                "সংবাদটি সফলভাবে প্রকাশিত হয়েছে!"
            else
                "News report successfully published!"
        )
    }

    fun onDirectorySearchQueryChanged(query: String) {
        val current = _uiState.value
        val filtered = filterJournalists(current.journalists, query, current.selectedBloodGroup)
        _uiState.value = current.copy(
            directorySearchQuery = query,
            filteredJournalists = filtered
        )
    }

    fun selectBloodGroupFilter(bloodGroup: String) {
        val current = _uiState.value
        val nextBloodGroup = if (current.selectedBloodGroup == bloodGroup) "" else bloodGroup
        val filtered = filterJournalists(current.journalists, current.directorySearchQuery, nextBloodGroup)
        _uiState.value = current.copy(
            selectedBloodGroup = nextBloodGroup,
            filteredJournalists = filtered
        )
    }

    private fun filterJournalists(
        members: List<JournalistMember>,
        query: String,
        bloodGroup: String
    ): List<JournalistMember> {
        return members.filter { member ->
            val matchesBlood = bloodGroup.isBlank() || member.bloodGroup.equals(bloodGroup, ignoreCase = true)
            val matchesQuery = query.isBlank() ||
                    member.nameBn.contains(query, ignoreCase = true) ||
                    member.nameEn.contains(query, ignoreCase = true) ||
                    member.mediaHouse.contains(query, ignoreCase = true) ||
                    member.role.bnLabel.contains(query, ignoreCase = true) ||
                    member.role.enLabel.contains(query, ignoreCase = true) ||
                    member.phone.contains(query, ignoreCase = true)
            matchesBlood && matchesQuery
        }
    }

    fun openMemberDetail(member: JournalistMember) {
        _uiState.value = _uiState.value.copy(selectedMember = member)
    }

    fun closeMemberDetail() {
        _uiState.value = _uiState.value.copy(selectedMember = null)
    }

    fun selectEmergencyCategory(category: String) {
        val current = _uiState.value.selectedEmergencyCategory
        _uiState.value = _uiState.value.copy(
            selectedEmergencyCategory = if (current == category) "" else category
        )
    }

    fun clearFeedbackMessage() {
        _uiState.value = _uiState.value.copy(feedbackMessage = null)
    }
}
