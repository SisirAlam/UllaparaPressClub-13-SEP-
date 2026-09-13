package com.example.ullaparapressclub.data.repository

import com.example.ullaparapressclub.data.model.ContactCategory
import com.example.ullaparapressclub.data.model.EmergencyContact
import com.example.ullaparapressclub.data.model.EventType
import com.example.ullaparapressclub.data.model.Member
import com.example.ullaparapressclub.data.model.NewsCategory
import com.example.ullaparapressclub.data.model.NewsItem
import com.example.ullaparapressclub.data.model.NewsTip
import com.example.ullaparapressclub.data.model.PressEvent
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update

class PressClubRepository {

    private val _members = MutableStateFlow<List<Member>>(initialMembers)
    val members: StateFlow<List<Member>> = _members.asStateFlow()

    private val _news = MutableStateFlow<List<NewsItem>>(initialNews)
    val news: StateFlow<List<NewsItem>> = _news.asStateFlow()

    private val _events = MutableStateFlow<List<PressEvent>>(initialEvents)
    val events: StateFlow<List<PressEvent>> = _events.asStateFlow()

    private val _emergencyContacts = MutableStateFlow<List<EmergencyContact>>(initialContacts)
    val emergencyContacts: StateFlow<List<EmergencyContact>> = _emergencyContacts.asStateFlow()

    private val _submittedTips = MutableStateFlow<List<NewsTip>>(emptyList())
    val submittedTips: StateFlow<List<NewsTip>> = _submittedTips.asStateFlow()

    fun toggleNewsBookmark(newsId: String) {
        _news.update { list ->
            list.map {
                if (it.id == newsId) it.copy(isBookmarked = !it.isBookmarked) else it
            }
        }
    }

    fun toggleEventRsvp(eventId: String) {
        _events.update { list ->
            list.map {
                if (it.id == eventId) it.copy(isRsvpd = !it.isRsvpd) else it
            }
        }
    }

    fun submitTip(tip: NewsTip) {
        _submittedTips.update { listOf(tip) + it }
    }

    companion object {
        val initialMembers = listOf(
            Member(
                id = "m1",
                nameEn = "Md. Abdul Hamid",
                nameBn = "মো. আব্দুল হামিদ",
                designationEn = "President",
                designationBn = "সভাপতি",
                organizationEn = "The Daily Ittefaq",
                organizationBn = "দৈনিক ইত্তেফাক",
                phone = "01712-345671",
                email = "hamid.ittefaq@gmail.com",
                bloodGroup = "B+",
                pressCardId = "UPC-2024-001",
                isExecutive = true,
                executiveOrder = 1,
                joinYear = "1994",
                bioBn = "উল্লাপাড়া প্রেস ক্লাবের প্রবীণ সাংবাদিক ও সাবেক সভাপতি। দীর্ঘ তিন দশক ধরে উত্তরবঙ্গের গণমানুষের কণ্ঠস্বর হিসেবে দায়িত্ব পালন করছেন।"
            ),
            Member(
                id = "m2",
                nameEn = "M. A. Matin",
                nameBn = "এম. এ. মতিন",
                designationEn = "General Secretary",
                designationBn = "সাধারণ সম্পাদক",
                organizationEn = "The Daily Karatoa",
                organizationBn = "দৈনিক করতোয়া",
                phone = "01711-987652",
                email = "matin.karatoa@gmail.com",
                bloodGroup = "O+",
                pressCardId = "UPC-2024-002",
                isExecutive = true,
                executiveOrder = 2,
                joinYear = "2001",
                bioBn = "সাংবাদিক ইউনিয়ন ও প্রেস ক্লাবের সক্রিয় সংগঠক। স্থানীয় পরিবেশ ও চলনবিল সুরক্ষা আন্দোলনে কলমযোদ্ধা।"
            ),
            Member(
                id = "m3",
                nameEn = "Sisir Alam",
                nameBn = "শিশির আলম",
                designationEn = "Publicity & ICT Secretary",
                designationBn = "প্রচার ও প্রকাশনা সম্পাদক",
                organizationEn = "Daily Sirajganj Barta & News24",
                organizationBn = "দৈনিক সিরাজগঞ্জ বার্তা ও নিউজ২৪",
                phone = "01718-294050",
                email = "sisir.info@gmail.com",
                bloodGroup = "A+",
                pressCardId = "UPC-2024-007",
                isExecutive = true,
                executiveOrder = 7,
                joinYear = "2012",
                bioBn = "ডিজিটাল সাংবাদিকতা ও তথ্যপ্রযুক্তি সমন্বয়ক। উল্লাপাড়া প্রেস ক্লাবের ডিজিটাল আর্কালাইজেশন ও অনলাইন প্রেস ডেস্কের প্রধান উদ্যোক্তা।"
            ),
            Member(
                id = "m4",
                nameEn = "Golam Mostafa",
                nameBn = "গোলাম মোস্তফা",
                designationEn = "Vice President",
                designationBn = "সহ-সভাপতি",
                organizationEn = "The Daily Star",
                organizationBn = "দ্য ডেইলি স্টার",
                phone = "01715-443322",
                email = "mostafa.star@gmail.com",
                bloodGroup = "AB+",
                pressCardId = "UPC-2024-003",
                isExecutive = true,
                executiveOrder = 3,
                joinYear = "1998",
                bioBn = "অনুসন্ধানী সাংবাদিকতায় বিশেষজ্ঞ। কৃষি ও গ্রামীণ অর্থনীতি বিষয়ক বহু জাতীয় প্রতিবেদনের প্রণেতা।"
            ),
            Member(
                id = "m5",
                nameEn = "Khandakar Rezaul Karim",
                nameBn = "খন্দকার রেজাউল করিম",
                designationEn = "Joint Secretary",
                designationBn = "যুগ্ম সাধারণ সম্পাদক",
                organizationEn = "Somoy TV",
                organizationBn = "সময় টেলিভিশন",
                phone = "01723-556677",
                email = "rezaul.somoy@gmail.com",
                bloodGroup = "B+",
                pressCardId = "UPC-2024-004",
                isExecutive = true,
                executiveOrder = 4,
                joinYear = "2008",
                bioBn = "ইলেকট্রনিক মিডিয়ার মাঠপর্যায়ের রিপোর্টার। স্থানীয় নদীভাঙন ও রেললাইন নিরাপত্তা বিষয়ে নিয়মিত প্রতিবেদন সম্প্রচার করেন।"
            ),
            Member(
                id = "m6",
                nameEn = "Mohammad Ali Jinnah",
                nameBn = "মোহাম্মদ আলী জিন্নাহ",
                designationEn = "Organizing Secretary",
                designationBn = "সাংগঠনিক সম্পাদক",
                organizationEn = "Daily Jugantor",
                organizationBn = "দৈনিক যুগান্তর",
                phone = "01714-889900",
                email = "jinnah.jugantor@gmail.com",
                bloodGroup = "O+",
                pressCardId = "UPC-2024-005",
                isExecutive = true,
                executiveOrder = 5,
                joinYear = "2006",
                bioBn = "প্রেস ক্লাবের সদস্য কল্যাণ ও সাংবাদিক অধিকার রক্ষায় নিয়োজিত কর্মবীর।"
            ),
            Member(
                id = "m7",
                nameEn = "Abu Hanif",
                nameBn = "আবু হানিফ",
                designationEn = "Finance Secretary",
                designationBn = "অর্থ সম্পাদক",
                organizationEn = "The Daily Inqilab",
                organizationBn = "দৈনিক ইনকিলাব",
                phone = "01716-112233",
                email = "hanif.inqilab@gmail.com",
                bloodGroup = "A+",
                pressCardId = "UPC-2024-006",
                isExecutive = true,
                executiveOrder = 6,
                joinYear = "2004",
                bioBn = "অর্থনীতি ও বাণিজ্য রিপোর্টার। প্রেস ক্লাবের অর্থনৈতিক স্বচ্ছতা ও তহবিল ব্যবস্থাপক।"
            ),
            Member(
                id = "m8",
                nameEn = "Nurul Islam",
                nameBn = "নুরুল ইসলাম",
                designationEn = "Office Secretary",
                designationBn = "দপ্তর সম্পাদক",
                organizationEn = "Daily Kalbela",
                organizationBn = "দৈনিক কালবেলা",
                phone = "01719-445566",
                email = "nurul.kalbela@gmail.com",
                bloodGroup = "O-",
                pressCardId = "UPC-2024-008",
                isExecutive = true,
                executiveOrder = 8,
                joinYear = "2014",
                bioBn = "প্রেস ক্লাবের দাপ্তরিক রেকর্ড ও গণসংযোগের দায়িত্বে নিষ্ঠার সাথে নিয়োজিত।"
            ),
            Member(
                id = "m9",
                nameEn = "Shafiqul Islam Bablu",
                nameBn = "শফিকুল ইসলাম বাবলু",
                designationEn = "Senior Member",
                designationBn = "সিনিয়র সদস্য",
                organizationEn = "Bangladesh Sangbad Sangstha (BSS)",
                organizationBn = "বাংলাদেশ সংবাদ সংস্থা (বাসস)",
                phone = "01712-778899",
                email = "bablu.bss@gmail.com",
                bloodGroup = "B+",
                pressCardId = "UPC-2024-009",
                isExecutive = false,
                executiveOrder = 9,
                joinYear = "1996",
                bioBn = "জাতীয় বার্তা সংস্থার সিরাজগঞ্জ প্রতিনিধি। রাষ্ট্রীয় ও নীতি-নির্ধারণী খবরের নির্ভরযোগ্য সূত্র।"
            ),
            Member(
                id = "m10",
                nameEn = "Kamrul Hasan",
                nameBn = "কামরুল হাসান",
                designationEn = "Staff Reporter & Photojournalist",
                designationBn = "স্টাফ রিপোর্টার ও আলোকচিত্রী",
                organizationEn = "Daily Prothom Alo",
                organizationBn = "দৈনিক প্রথম আলো",
                phone = "01725-334455",
                email = "kamrul.prothomalo@gmail.com",
                bloodGroup = "AB-",
                pressCardId = "UPC-2024-010",
                isExecutive = false,
                executiveOrder = 10,
                joinYear = "2016",
                bioBn = "ফিচার ফটোগ্রাফি ও চলনবিলের জনজীবন ক্যামেরায় ফুটিয়ে তোলার ক্ষেত্রে পুরস্কৃত ফটোসাংবাদিক।"
            )
        )

        val initialNews = listOf(
            NewsItem(
                id = "n1",
                titleBn = "উল্লাপাড়া প্রেস ক্লাবের কার্যনির্বাহী কমিটির দ্বি-বার্ষিক জরুরি সভা অনুষ্ঠিত",
                titleEn = "Executive Committee Emergency Meeting of Ullapara Press Club Held",
                summaryBn = "প্রেস ক্লাব মিলনায়তনে সাংবাদিকদের পেশাগত নিরাপত্তা, আইসিটি সেল গঠন এবং নতুন সদস্য অন্তর্ভুক্তির নীতিমালা নিয়ে বিস্তারিত আলোচনা হয়।",
                contentBn = "উল্লাপাড়া প্রেস ক্লাবের মিলনায়তনে সভাপতি মো. আব্দুল হামিদের সভাপতিত্বে এবং সাধারণ সম্পাদক এম. এ. মতিনের পরিচালনায় কার্যনির্বাহী কমিটির এক জরুরি সভা অনুষ্ঠিত হয়। সভায় উল্লাপাড়ায় কর্মরত সাংবাদিকদের পেশাগত নিরাপত্তা নিশ্চিতকরণ, ডিজিটাল আর্কালাইজেশন প্রকল্প বাস্তবায়ন এবং বার্ষিক স্মৃতি স্মরণ সভার তারিখ চূড়ান্ত করা হয়। প্রচার ও প্রকাশনা সম্পাদক শিশির আলম ডিজিটাল প্রেস অ্যাপের অগ্রগতি তুলে ধরেন। সভায় সর্বসম্মতিক্রমে স্থানীয় সকল গণমাধ্যমকর্মীদের কল্যাণে একটি বিশেষ আপদকালীন তহবিল গঠনের সিদ্ধান্ত গৃহীত হয়।",
                category = NewsCategory.PRESS_RELEASE,
                date = "১৩ সেপ্টেম্বর, ২০২৬",
                reporterName = "দপ্তর সেল, প্রেস ক্লাব",
                mediaHouse = "প্রেস ক্লাব সচিবালয়",
                isOfficialPressRelease = true,
                isUrgent = true,
                viewCount = 485
            ),
            NewsItem(
                id = "n2",
                titleBn = "চলনবিল অঞ্চলে বোরা ধান ও সরিষা চাষে বাম্পার ফলনের আশা: কৃষকদের মুখে হাসি",
                titleEn = "Record Harvest Expected in Chalan Beel: Joy Among Ullapara Farmers",
                summaryBn = "উল্লাপাড়া কৃষি অফিসের প্রণোদনা ও অনুকূল আবহাওয়ায় এবার রেকর্ড পরিমাণ উৎপাদন লক্ষমাত্রা অর্জিত হতে যাচ্ছে।",
                contentBn = "সিরাজগঞ্জের শস্যভাণ্ডার খ্যাত উল্লাপাড়া ও পার্শ্ববর্তী চলনবিল অঞ্চলের বিস্তীর্ণ মাঠ জুড়ে এখন সবুজ ও সোনালী রঙের সমারোহ। উপজেলা কৃষি কর্মকর্তা জানান, সময়মতো সার, বীজ বিতরণ এবং পোকা দমনে সার্বক্ষণিক পরামর্শ দেওয়ার ফলে ফসলহানি সর্বনিম্ন পর্যায়ে রাখা সম্ভব হয়েছে। উল্লাপাড়া প্রেস ক্লাবের সাংবাদিক টিম সরেজমিনে মোহনপুর ও উধুনিয়া ইউনিয়নের বিস্তীর্ণ এলাকা পরিদর্শন করে প্রান্তিক কৃষকদের সাথে কথা বলে এ তথ্য সংগ্রহ করে।",
                category = NewsCategory.AGRICULTURE,
                date = "১২ সেপ্টেম্বর, ২০২৬",
                reporterName = "গোলাম মোস্তফা",
                mediaHouse = "দ্য ডেইলি স্টার",
                isOfficialPressRelease = false,
                isUrgent = false,
                viewCount = 312
            ),
            NewsItem(
                id = "n3",
                titleBn = "উল্লাপাড়া রেলওয়ে জংশনে অতিরিক্ত স্টপেজ ও টিকিট কালোবাজারি বন্ধে প্রেস ক্লাবের স্মারকলিপি",
                titleEn = "Press Club Submits Memorandum for Railway Reforms at Ullapara Junction",
                summaryBn = "উপজেলা নির্বাহী কর্মকর্তার মাধ্যমে রেলওয়ে পূর্বাঞ্চলীয় মহাব্যবস্থাপক বরাবর ৭ দফা দাবি সম্বলিত স্মারকলিপি প্রদান।",
                contentBn = "উত্তরবঙ্গের অন্যতম গুরুত্বপূর্ণ রেল জংশন উল্লাপাড়ায় আন্তঃনগর ট্রেনের আসন সংখ্যা বৃদ্ধি, যাত্রী ছাউনি সংস্কার এবং ট্রেনের টিকিট কালোবাজারি চিরতরে বন্ধের দাবিতে উল্লাপাড়া উপজেলা নির্বাহী কর্মকর্তা (ইউএনও)-এর মাধ্যমে রেলওয়ে কর্তৃপক্ষের কাছে স্মারকলিপি পেশ করেছে উল্লাপাড়া প্রেস ক্লাব। প্রতিনিধি দলে উপস্থিত ছিলেন সভাপতি আব্দুল হামিদ, সাধারণ সম্পাদক এম. এ. মতিন, শিশির আলম প্রমুখ। প্রশাসন দ্রুততম সময়ের মধ্যে কার্যকর ব্যবস্থা গ্রহণের আশ্বাস দিয়েছেন।",
                category = NewsCategory.ADMINISTRATION,
                date = "১০ সেপ্টেম্বর, ২০২৬",
                reporterName = "খন্দকার রেজাউল করিম",
                mediaHouse = "সময় টিভি",
                isOfficialPressRelease = true,
                isUrgent = false,
                viewCount = 540
            ),
            NewsItem(
                id = "n4",
                titleBn = "প্রয়াত প্রবীণ সাংবাদিকদের স্মরণে উল্লাপাড়া প্রেস ক্লাবে দোয়া মাহফিল ও স্মৃতিচারণ",
                titleEn = "Doa Mahfil and Memorial Gathering for Departed Senior Journalists",
                summaryBn = "অত্র অঞ্চলের সাংবাদিকতার পথিকৃৎদের অবদান শ্রদ্ধাভরে স্মরণ করেন উল্লাপাড়ার রাজনৈতিক, সামাজিক ও সুশীল সমাজের নেতৃবৃন্দ।",
                contentBn = "উল্লাপাড়া প্রেস ক্লাব মিলনায়তনে প্রেস ক্লাবের প্রতিষ্ঠাতা সদস্য ও প্রয়াত জ্যেষ্ঠ সাংবাদিকদের আত্মার মাগফিরাত কামনায় বিশেষ দোয়া ও স্মরণ সভা অনুষ্ঠিত হয়। প্রেস ক্লাবের সাধারণ সম্পাদক এম. এ. মতিনের পরিচালনায় সভায় বক্তব্য রাখেন স্থানীয় সুধীজন। মরহুমদের বর্ণাঢ্য কর্মময় জীবনের ওপর স্মৃতিচারণ করা হয় এবং তাঁদের পরিবারকে প্রেস ক্লাবের পক্ষ থেকে আজীবন সম্মাননা স্মারক পৌঁছে দেওয়ার অঙ্গীকার পুনর্ব্যক্ত করা হয়।",
                category = NewsCategory.OBITUARY,
                date = "৮ সেপ্টেম্বর, ২০২৬",
                reporterName = "শিশির আলম",
                mediaHouse = "দৈনিক সিরাজগঞ্জ বার্তা",
                isOfficialPressRelease = true,
                isUrgent = false,
                viewCount = 620
            ),
            NewsItem(
                id = "n5",
                titleBn = "উল্লাপাড়ায় সড়ক নিরাপত্তা ও ট্রাফিক শৃঙ্খলা জোরদারে বিশেষ পুলিশি অভিযান",
                titleEn = "Special Traffic Safety Drive Conducted by Ullapara Police",
                summaryBn = "হাটিকুমরুল গোলচত্বর ও উল্লাপাড়া পৌর এলাকায় ফিটনেসবিহীন যান ও অবৈধ ওভারটেকিং রুখতে কড়া নজরদারি।",
                contentBn = "ঢাকা-পাবনা ও উত্তরবঙ্গ মহাসড়কে যানজট নিরসন এবং সড়ক দুর্ঘটনা শূন্যের কোঠায় নামিয়ে আনতে উল্লাপাড়া থানা পুলিশ ও ট্রাফিক বিভাগের সমন্বয়ে বিশেষ অভিযান পরিচালিত হয়েছে। উল্লাপাড়া থানার ভারপ্রাপ্ত কর্মকর্তা (ওসি) গণমাধ্যমকর্মীদের জানান, কোনো প্রকার লাইসেন্সবিহীন চালক ও অপ্রাপ্তবয়স্ক হেলপার দিয়ে যান চালানো বরদাশত করা হবে না। জনস্বার্থে এই অভিযান নিয়মিত অব্যাহত থাকবে।",
                category = NewsCategory.CRIME_LAW,
                date = "৭ সেপ্টেম্বর, ২০২৬",
                reporterName = "মোহাম্মদ আলী জিন্নাহ",
                mediaHouse = "দৈনিক যুগান্তর",
                isOfficialPressRelease = false,
                isUrgent = false,
                viewCount = 290
            )
        )

        val initialEvents = listOf(
            PressEvent(
                id = "e1",
                titleBn = "উল্লাপাড়া প্রেস ক্লাব বার্ষিক সাংবাদিক মিলনমেলা ও সম্মাননা প্রদান ২০২৬",
                titleEn = "Annual Journalists Gathering & Excellence Awards 2026",
                date = "২৫ সেপ্টেম্বর, ২০২৬",
                time = "সকাল ১০:০০ ঘটিকা",
                venueBn = "উল্লাপাড়া প্রেস ক্লাব অডিটোরিয়াম, স্টেশন রোড, উল্লাপাড়া",
                venueEn = "Press Club Auditorium, Station Road, Ullapara",
                organizerBn = "কার্যনির্বাহী সংসদ, উল্লাপাড়া প্রেস ক্লাব",
                descriptionBn = "সারা বছর অনুসন্ধানী ও বস্তুনিষ্ঠ সাংবাদিকতায় বিশেষ অবদানের স্বীকৃতিস্বরূপ বিভিন্ন ক্যাটাগরিতে উল্লাপাড়া রত্ন পদক ও সাংবাদিক সম্মাননা প্রদান। সিরাজগঞ্জ জেলা প্রশাসক ও পুলিশ সুপার প্রধান অতিথি হিসেবে উপস্থিত থাকবেন।",
                eventType = EventType.CULTURAL
            ),
            PressEvent(
                id = "e2",
                titleBn = "অনুসন্ধানী ডিজিটাল সাংবাদিকতা ও এআই টুলস ব্যবহার শীর্ষক কর্মশালা",
                titleEn = "Workshop on Investigative Digital Journalism and Fact-Checking",
                date = "২৮ সেপ্টেম্বর, ২০২৬",
                time = "বিকাল ৩:০০ ঘটিকা",
                venueBn = "প্রেস ক্লাব ডিজিটাল মিডিয়া ল্যাব",
                venueEn = "Press Club Digital Media Lab",
                organizerBn = "আইসিটি ও প্রশিক্ষণ উইং, উল্লাপাড়া প্রেস ক্লাব",
                descriptionBn = "মোবাইল জার্নালিজম (মোজো), সাইবার সিকিউরিটি এবং সত্যতা যাচাই (Fact Checking) বিষয়ক হাতে-কলমে প্রশিক্ষণ কর্মশালা। পরিচালনা করবেন শিশির আলম ও জাতীয় প্রশিক্ষকবৃন্দ।",
                eventType = EventType.WORKSHOP
            ),
            PressEvent(
                id = "e3",
                titleBn = "মাসিক সাধারণ সমন্বয় সভা ও ভবিষ্যৎ কর্মপরিকল্পনা",
                titleEn = "Monthly General Coordination Meeting",
                date = "০৫ অক্টোবর, ২০২৬",
                time = "সন্ধ্যা ৬:৩০ ঘটিকা",
                venueBn = "প্রেস ক্লাব কনফারেন্স রুম",
                venueEn = "Press Club Conference Room",
                organizerBn = "দপ্তর সেল, উল্লাপাড়া প্রেস ক্লাব",
                descriptionBn = "প্রেস ক্লাবের সকল সদস্যের সক্রিয় অংশগ্রহণে ত্রৈমাসিক অডিট অনুমোদন এবং নবায়ন প্রক্রিয়া তদারকি সভা।",
                eventType = EventType.GENERAL_MEETING
            ),
            PressEvent(
                id = "e4",
                titleBn = "মরহুম সাংবাদিকবৃন্দের রুহের মাগফিরাত কামনায় বিশেষ দোয়া মাহফিল",
                titleEn = "Special Doa Mahfil in Memory of Departed Colleagues",
                date = "১২ অক্টোবর, ২০২৬",
                time = "বাদ আসর",
                venueBn = "প্রেস ক্লাব কেন্দ্রীয় চত্বর",
                venueEn = "Press Club Central Plaza",
                organizerBn = "ধর্ম ও সমাজকল্যাণ উপ-কমিটি",
                descriptionBn = "প্রেস ক্লাবের প্রয়াত সদস্যবৃন্দের প্রতি বিনম্র শ্রদ্ধা নিবেদন এবং কোরআনখানি ও মিলাদ মাহফিল।",
                eventType = EventType.DOA_MAHFIL
            )
        )

        val initialContacts = listOf(
            EmergencyContact(
                id = "c1",
                titleBn = "উপজেলা নির্বাহী অফিসার (ইউএনও)",
                titleEn = "Upazila Nirbahi Officer (UNO), Ullapara",
                authorityBn = "উপজেলা প্রশাসন, উল্লাপাড়া",
                phone = "01713-377284",
                secondaryPhone = "02-588831201",
                category = ContactCategory.ADMINISTRATION,
                addressBn = "উপজেলা পরিষদ কমপ্লেক্স, উল্লাপাড়া, সিরাজগঞ্জ"
            ),
            EmergencyContact(
                id = "c2",
                titleBn = "অফিসার ইনচার্জ (ওসি), উল্লাপাড়া থানা",
                titleEn = "Officer-in-Charge (OC), Ullapara Police Station",
                authorityBn = "বাংলাদেশ পুলিশ",
                phone = "01713-373977",
                secondaryPhone = "07529-56033",
                category = ContactCategory.POLICE,
                addressBn = "উল্লাপাড়া থানা, থানা রোড, উল্লাপাড়া"
            ),
            EmergencyContact(
                id = "c3",
                titleBn = "উল্লাপাড়া ফায়ার সার্ভিস ও সিভিল ডিফেন্স",
                titleEn = "Ullapara Fire Service & Civil Defense",
                authorityBn = "ফায়ার সার্ভিস অ্যান্ড সিভিল ডিফেন্স",
                phone = "01716-452366",
                secondaryPhone = "07529-56222",
                category = ContactCategory.FIRE_SERVICE,
                addressBn = "মহাসড়ক সংলগ্ন, উল্লাপাড়া"
            ),
            EmergencyContact(
                id = "c4",
                titleBn = "উপজেলা স্বাস্থ্য ও পরিবার পরিকল্পনা কর্মকর্তা",
                titleEn = "Upazila Health Complex (Emergency Hospital)",
                authorityBn = "উল্লাপাড়া উপজেলা স্বাস্থ্য কমপ্লেক্স",
                phone = "01730-324810",
                secondaryPhone = "01712-889922",
                category = ContactCategory.HOSPITAL,
                addressBn = "কাওয়াক হাসপাতাল রোড, উল্লাপাড়া"
            ),
            EmergencyContact(
                id = "c5",
                titleBn = "সিরাজগঞ্জ পল্লী বিদ্যুৎ সমিতি-১ (উল্লাপাড়া জোনাল অফিস)",
                titleEn = "Sirajganj Palli Bidyut Samiti-1 (Zonal Office)",
                authorityBn = "পল্লী বিদ্যুতায়ন বোর্ড",
                phone = "01769-402288",
                secondaryPhone = "07529-56150",
                category = ContactCategory.UTILITY,
                addressBn = "বিদ্যুৎ ভবন, উল্লাপাড়া"
            ),
            EmergencyContact(
                id = "c6",
                titleBn = "উল্লাপাড়া রেলওয়ে স্টেশন মাস্টার",
                titleEn = "Station Master, Ullapara Railway Junction",
                authorityBn = "বাংলাদেশ রেলওয়ে",
                phone = "01711-239401",
                secondaryPhone = "",
                category = ContactCategory.UTILITY,
                addressBn = "রেলওয়ে স্টেশন রোড, উল্লাপাড়া"
            ),
            EmergencyContact(
                id = "c7",
                titleBn = "জেলা প্রশাসক (ডিসি), সিরাজগঞ্জ",
                titleEn = "Deputy Commissioner (DC), Sirajganj",
                authorityBn = "জেলা প্রশাসন, সিরাজগঞ্জ",
                phone = "01713-200500",
                secondaryPhone = "02-588831000",
                category = ContactCategory.ADMINISTRATION,
                addressBn = "ডিসি অফিস চত্বর, সিরাজগঞ্জ"
            ),
            EmergencyContact(
                id = "c8",
                titleBn = "পুলিশ সুপার (এসপি), সিরাজগঞ্জ",
                titleEn = "Superintendent of Police (SP), Sirajganj",
                authorityBn = "জেলা পুলিশ, সিরাজগঞ্জ",
                phone = "01713-373950",
                secondaryPhone = "02-588831100",
                category = ContactCategory.POLICE,
                addressBn = "এসপি অফিস, পুলিশ লাইনস, সিরাজগঞ্জ"
            )
        )
    }
}
