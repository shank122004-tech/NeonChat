// app.js - Updated Version with Only 3 Theme Colors and Enhanced Payment System

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDgjEZESPE0XEuoKO8F-mxnri3NT-ELjHw",
    authDomain: "neonchat-94f8c.firebaseapp.com",
    projectId: "neonchat-94f8c",
    storageBucket: "neonchat-94f8c.appspot.com",
    messagingSenderId: "165418216560",
    appId: "1:165418216560:web:954cca83e6b0231d9d98b5",
    measurementId: "G-CQHXN518JW"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// App State
let currentUser = null;
let currentChatId = null;
let currentChatType = null;
let unsubscribeFunctions = [];
let userContacts = [];
let userGroups = [];
let userAvatars = [];
let userStickers = [];
let userThemeColors = [];
let userPurchases = [];
let allUsers = [];
let allChats = [];
let allGroups = [];
let currentPurchaseItem = null;
let typingTimeout = null;
let isTyping = false;
let currentEditMessageId = null;
let userStories = [];
let selectedMessageId = null;
let selectedStoryMedia = null;
let currentViewingUserId = null;

// DOM Elements
const elements = {
    // Screens
    splashScreen: document.getElementById('splash-screen'),
    loginScreen: document.getElementById('login-screen'),
    signupScreen: document.getElementById('signup-screen'),
    appScreen: document.getElementById('app-screen'),
    
    // Auth Forms
    loginForm: document.getElementById('login-form'),
    signupForm: document.getElementById('signup-form'),
    
    // Navigation
    showSignup: document.getElementById('show-signup'),
    showLogin: document.getElementById('show-login'),
    
    // App Navigation
    navItems: document.querySelectorAll('.nav-item'),
    tabContents: document.querySelectorAll('.tab-content'),
    
    // Profile
    profileMenuToggle: document.getElementById('profile-menu-toggle'),
    profileMenu: document.getElementById('profile-menu'),
    profilePic: document.getElementById('profile-pic'),
    settingsBtn: document.getElementById('settings-btn'),
    profileBtn: document.getElementById('profile-btn'),
    logoutBtn: document.getElementById('logout-btn'),
    referralBtn: document.getElementById('referral-btn'),
    storiesBtn: document.getElementById('stories-btn'),
    
    // Modals
    settingsModal: document.getElementById('settings-modal'),
    newChatModal: document.getElementById('new-chat-modal'),
    newGroupModal: document.getElementById('new-group-modal'),
    profileModal: document.getElementById('profile-modal'),
    userProfileModal: document.getElementById('user-profile-modal'),
    groupInfoModal: document.getElementById('group-info-modal'),
    profilePicModal: document.getElementById('profile-pic-modal'),
    purchaseModal: document.getElementById('purchase-modal'),
    paymentSuccessModal: document.getElementById('payment-success-modal'),
    paymentFailedModal: document.getElementById('payment-failed-modal'),
    referralModal: document.getElementById('referral-modal'),
    storyUploadModal: document.getElementById('story-upload-modal'),
    storyViewerModal: document.getElementById('story-viewer-modal'),
    messageActionsModal: document.getElementById('message-actions-modal'),
    groupAvatarsModal: document.getElementById('group-avatars-modal'),
    
    // Close Modal Buttons
    closeModalBtns: document.querySelectorAll('.close-modal'),
    closeProfilePicBtn: document.querySelector('.close-profile-pic'),
    
    // Settings
    settingsTabs: document.querySelectorAll('.settings-tab'),
    settingsPanels: document.querySelectorAll('.settings-panel'),
    
    // Profile Settings
    uploadPicBtn: document.getElementById('upload-pic-btn'),
    profilePicInput: document.getElementById('profile-pic-input'),
    settingsProfilePic: document.getElementById('settings-profile-pic'),
    profileForm: document.getElementById('profile-form'),
    profileName: document.getElementById('profile-name'),
    profileUsername: document.getElementById('profile-username'),
    profileEmail: document.getElementById('profile-email'),
    profileBio: document.getElementById('profile-bio'),
    
    // Chat
    newChatBtn: document.getElementById('new-chat-btn'),
    chatsList: document.getElementById('chats-list'),
    chatWindow: document.getElementById('chat-window'),
    backToChats: document.getElementById('back-to-chats'),
    messagesContainer: document.getElementById('messages-container'),
    messageInput: document.getElementById('message-input'),
    sendBtn: document.getElementById('send-btn'),
    chatName: document.getElementById('chat-name'),
    chatAvatar: document.getElementById('chat-avatar'),
    chatStatus: document.getElementById('chat-status'),
    typingIndicator: document.getElementById('typing-indicator'),
    chatInfoBtn: document.getElementById('chat-info-btn'),
    
    // Groups
    newGroupBtn: document.getElementById('new-group-btn'),
    groupsList: document.getElementById('groups-list'),
    createGroupBtn: document.getElementById('create-group-btn'),
    groupName: document.getElementById('group-name'),
    groupDescription: document.getElementById('group-description'),
    groupMembersList: document.getElementById('group-members-list'),
    groupAvatarInput: document.getElementById('group-avatar-input'),
    groupAvatarPreview: document.getElementById('group-avatar-preview'),
    groupDefaultAvatar: document.getElementById('group-default-avatar'),
    browseAvatarsBtn: document.getElementById('browse-avatars-btn'),
    groupAvatarsGrid: document.getElementById('group-avatars-grid'),
    
    // Contacts
    addContactBtn: document.getElementById('add-contact-btn'),
    contactsList: document.getElementById('contacts-list'),
    suggestedContactsList: document.getElementById('suggested-contacts-list'),
    
    // Stickers
    stickerAttachmentBtn: document.getElementById('sticker-attachment-btn'),
    stickerPanel: document.getElementById('sticker-panel'),
    closeStickerPanel: document.getElementById('close-sticker-panel'),
    stickersContainer: document.getElementById('stickers-container'),
    stickersGrid: document.getElementById('stickers-grid'),
    myStickersGrid: document.getElementById('my-stickers-grid'),
    ownedStickersCount: document.getElementById('owned-stickers-count'),
    
    // Media Attachments
    mediaAttachmentBtn: document.getElementById('media-attachment-btn'),
    fileAttachmentBtn: document.getElementById('file-attachment-btn'),
    
    // Search
    searchInput: document.getElementById('search-input'),
    searchUser: document.getElementById('search-user'),
    usersList: document.getElementById('users-list'),
    
    // Profile View
    viewProfilePic: document.getElementById('view-profile-pic'),
    viewProfileName: document.getElementById('view-profile-name'),
    viewProfileUsername: document.getElementById('view-profile-username'),
    viewProfileEmail: document.getElementById('view-profile-email'),
    viewProfileBio: document.getElementById('view-profile-bio'),
    viewContactsCount: document.getElementById('view-contacts-count'),
    viewGroupsCount: document.getElementById('view-groups-count'),
    viewAvatarsCount: document.getElementById('view-avatars-count'),
    viewStickersCount: document.getElementById('view-stickers-count'),
    viewPurchasesCount: document.getElementById('view-purchases-count'),
    
    // User Profile View
    userViewProfilePic: document.getElementById('user-view-profile-pic'),
    userViewProfileName: document.getElementById('user-view-profile-name'),
    userViewProfileUsername: document.getElementById('user-view-profile-username'),
    userViewProfileBio: document.getElementById('user-view-profile-bio'),
    startChatWithUser: document.getElementById('start-chat-with-user'),
    addToContacts: document.getElementById('add-to-contacts'),
    
    // Group Info
    groupInfoAvatar: document.getElementById('group-info-avatar'),
    groupInfoName: document.getElementById('group-info-name'),
    groupInfoDescription: document.getElementById('group-info-description'),
    groupMembersCount: document.getElementById('group-members-count'),
    groupInfoMembersList: document.getElementById('group-info-members-list'),
    exitGroupBtn: document.getElementById('exit-group-btn'),
    makeAdminBtn: document.getElementById('make-admin-btn'),
    removeMemberBtn: document.getElementById('remove-member-btn'),
    
    // Avatars
    avatarsGrid: document.getElementById('avatars-grid'),
    myAvatarsGrid: document.getElementById('my-avatars-grid'),
    ownedAvatarsCount: document.getElementById('owned-avatars-count'),
    
    // Theme Colors
    themesGrid: document.getElementById('themes-grid'),
    myThemesGrid: document.getElementById('my-themes-grid'),
    ownedThemesCount: document.getElementById('owned-themes-count'),
    
    // Balance
    userBalance: document.getElementById('user-balance'),
    
    // Purchase
    purchaseDetails: document.getElementById('purchase-details'),
    confirmPurchaseBtn: document.getElementById('confirm-purchase-btn'),
    cancelPurchaseBtn: document.getElementById('cancel-purchase-btn'),
    retryPaymentBtn: document.getElementById('retry-payment-btn'),
    
    // Profile Picture Viewer
    fullscreenProfilePic: document.getElementById('fullscreen-profile-pic'),
    
    // Referral
    userReferralCode: document.getElementById('user-referral-code'),
    shareReferralBtn: document.getElementById('share-referral-btn'),
    referralCount: document.getElementById('referral-count'),
    referralRewards: document.getElementById('referral-rewards'),
    
    // Stories
    storyMediaGrid: document.getElementById('story-media-grid'),
    backFromStory: document.getElementById('back-from-story'),
    storyPreviewSection: document.getElementById('story-preview-section'),
    storyPreviewImage: document.getElementById('story-preview-image'),
    storyPreviewVideo: document.getElementById('story-preview-video'),
    postStoryBtn: document.getElementById('post-story-btn'),
    cancelStoryBtn: document.getElementById('cancel-story-btn'),
    
    // Story Viewer
    viewerProfilePic: document.getElementById('viewer-profile-pic'),
    viewerUsername: document.getElementById('viewer-username'),
    viewerTime: document.getElementById('viewer-time'),
    viewerStoryImage: document.getElementById('viewer-story-image'),
    viewerStoryVideo: document.getElementById('viewer-story-video'),
    prevStoryBtn: document.getElementById('prev-story-btn'),
    nextStoryBtn: document.getElementById('next-story-btn'),
    
    // Message Actions
    editMessageBtn: document.getElementById('edit-message-btn'),
    deleteMessageBtn: document.getElementById('delete-message-btn'),
    cancelActionsBtn: document.getElementById('cancel-actions-btn'),
    
    // New Elements for Enhanced Features
    purchaseHistoryList: document.getElementById('purchase-history-list'),
    enhancedStatsGrid: document.getElementById('enhanced-stats-grid'),
    themeStoreGrid: document.getElementById('theme-store-grid'),
    avatarStoreGrid: document.getElementById('avatar-store-grid')
};

// Initialize App
function initApp() {
    setupEventListeners();
    initializeSplashScreen();
    setupAuthStateListener();
    initializeAvatars();
    initializeStickers();
    initializeThemes();
    addMobileOptimizations();
}

// Add mobile optimizations
function addMobileOptimizations() {
    // Prevent zoom on input focus
    document.addEventListener('touchstart', function() {}, {passive: true});
    
    // Handle viewport height on mobile
    function setVH() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
    
    // Prevent pull-to-refresh on mobile
    document.body.style.overscrollBehavior = 'none';
}

// Setup Event Listeners
function setupEventListeners() {
    // Auth Navigation
    elements.showSignup.addEventListener('click', () => showScreen('signup-screen'));
    elements.showLogin.addEventListener('click', () => showScreen('login-screen'));
    
    // Auth Forms
    elements.loginForm.addEventListener('submit', handleLogin);
    elements.signupForm.addEventListener('submit', handleSignup);
    
    // App Navigation
    elements.navItems.forEach(item => {
        item.addEventListener('click', () => switchTab(item.dataset.tab));
    });
    
    // Profile Menu
    elements.profileMenuToggle.addEventListener('click', toggleProfileMenu);
    elements.settingsBtn.addEventListener('click', openSettings);
    elements.profileBtn.addEventListener('click', openProfile);
    elements.referralBtn.addEventListener('click', openReferralModal);
    elements.storiesBtn.addEventListener('click', openStoryUploadModal);
    elements.logoutBtn.addEventListener('click', handleLogout);
    
    // Close Modals
    elements.closeModalBtns.forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    
    // Close Profile Picture Modal
    elements.closeProfilePicBtn.addEventListener('click', () => {
        elements.profilePicModal.classList.remove('active');
    });
    
    // Settings Tabs
    elements.settingsTabs.forEach(tab => {
        tab.addEventListener('click', () => switchSettingsTab(tab.dataset.tab));
    });
    
    // Profile Settings
    elements.uploadPicBtn.addEventListener('click', () => elements.profilePicInput.click());
    elements.profilePicInput.addEventListener('change', handleProfilePicUpload);
    elements.profileForm.addEventListener('submit', handleProfileUpdate);
    
    // Chat
    elements.newChatBtn.addEventListener('click', openNewChatModal);
    elements.backToChats.addEventListener('click', closeChatWindow);
    elements.sendBtn.addEventListener('click', sendMessage);
    elements.messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    elements.chatInfoBtn.addEventListener('click', openChatInfo);
    
    // Typing Indicator
    elements.messageInput.addEventListener('input', handleTyping);
    
    // Groups
    elements.newGroupBtn.addEventListener('click', openNewGroupModal);
    elements.createGroupBtn.addEventListener('click', createGroup);
    
    // Group Avatar Options
    document.querySelectorAll('.group-avatar-option').forEach(option => {
        option.addEventListener('click', (e) => {
            document.querySelectorAll('.group-avatar-option').forEach(opt => opt.classList.remove('active'));
            e.currentTarget.classList.add('active');
            handleGroupAvatarOption(e.currentTarget.dataset.type);
        });
    });
    
    elements.groupAvatarInput.addEventListener('change', handleGroupAvatarUpload);
    elements.browseAvatarsBtn.addEventListener('click', openGroupAvatarsModal);
    
    // Contacts
    elements.addContactBtn.addEventListener('click', addContact);
    
    // Stickers
    elements.stickerAttachmentBtn.addEventListener('click', toggleStickerPanel);
    elements.closeStickerPanel.addEventListener('click', () => {
        elements.stickerPanel.classList.add('hidden');
    });
    
    // Media Attachments
    elements.mediaAttachmentBtn.addEventListener('click', () => attachMedia('image/*,video/*'));
    elements.fileAttachmentBtn.addEventListener('click', () => attachMedia('*'));
    
    // Search
    elements.searchInput.addEventListener('input', handleSearch);
    elements.searchUser.addEventListener('input', handleUserSearch);
    
    // Sticker Categories
    document.querySelectorAll('.sticker-category-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.sticker-category-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            loadStickersStore(e.target.dataset.category);
        });
    });
    
    // Avatar Categories
    document.querySelectorAll('.avatar-category').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.avatar-category').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            loadAvatarsStore(e.target.dataset.category);
        });
    });
    
    // Theme Categories
    document.querySelectorAll('.theme-category-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.theme-category-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            loadThemesStore(e.target.dataset.category);
        });
    });
    
    // Purchase
    elements.confirmPurchaseBtn.addEventListener('click', confirmPurchase);
    elements.cancelPurchaseBtn.addEventListener('click', () => {
        elements.purchaseModal.classList.remove('active');
    });
    elements.retryPaymentBtn.addEventListener('click', () => {
        elements.paymentFailedModal.classList.remove('active');
        if (currentPurchaseItem) {
            showPurchaseModal(currentPurchaseItem, currentPurchaseItem.purchaseType);
        }
    });
    
    // Profile Picture Click Events
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('clickable-profile-pic')) {
            if (e.target.id === 'chat-avatar' && currentChatType === 'individual') {
                // Show user profile when clicking on chat avatar
                const partnerId = currentChatId.split('_').find(id => id !== currentUser.uid);
                showUserProfile(partnerId);
            } else {
                openProfilePictureViewer(e.target.src);
            }
        }
    });
    
    // Close modals when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.profile-menu') && !e.target.closest('.profile-icon')) {
            elements.profileMenu.classList.remove('show');
        }
        
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
    
    // Referral
    elements.shareReferralBtn.addEventListener('click', shareReferralLink);
    
    // Stories
    elements.backFromStory.addEventListener('click', () => {
        elements.storyPreviewSection.classList.add('hidden');
    });
    elements.postStoryBtn.addEventListener('click', postStory);
    elements.cancelStoryBtn.addEventListener('click', () => {
        elements.storyPreviewSection.classList.add('hidden');
    });
    
    // Add Story Button
    document.querySelector('.add-story').addEventListener('click', openStoryUploadModal);
    
    // Story Viewer Navigation
    elements.prevStoryBtn.addEventListener('click', showPreviousStory);
    elements.nextStoryBtn.addEventListener('click', showNextStory);
    
    // Message Actions
    elements.editMessageBtn.addEventListener('click', handleEditMessage);
    elements.deleteMessageBtn.addEventListener('click', handleDeleteMessage);
    elements.cancelActionsBtn.addEventListener('click', () => {
        elements.messageActionsModal.classList.remove('active');
    });
    
    // User Profile Actions
    elements.startChatWithUser.addEventListener('click', startChatWithCurrentUser);
    elements.addToContacts.addEventListener('click', addCurrentUserToContacts);
    
    // Group Info Actions
    elements.exitGroupBtn.addEventListener('click', exitGroup);
    elements.makeAdminBtn.addEventListener('click', makeAdmin);
    elements.removeMemberBtn.addEventListener('click', removeMember);
}

// Initialize Splash Screen
function initializeSplashScreen() {
    setTimeout(() => {
        if (!auth.currentUser) {
            showScreen('login-screen');
        }
    }, 3000);
}

// Firebase Auth State Listener
function setupAuthStateListener() {
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            currentUser = user;
            await ensureUserDocument(user);
            await loadUserData();
            showScreen('app-screen');
            setupRealtimeListeners();
            setupPaymentMonitoring();
        } else {
            currentUser = null;
            cleanupRealtimeListeners();
            showScreen('login-screen');
        }
    });
}

// Ensure User Document Exists
async function ensureUserDocument(user) {
    const userRef = db.collection('users').doc(user.uid);
    const snap = await userRef.get();
    
    if (!snap.exists) {
        const referralCode = generateReferralCode();
        await userRef.set({
            name: user.displayName || "New User",
            username: user.email.split('@')[0] || "user" + Math.random().toString(36).substr(2, 5),
            email: user.email,
            avatar: user.photoURL || "https://api.dicebear.com/7.x/adventurer/svg?seed=" + user.uid,
            bio: "Hey there! I'm using NeonChat",
            status: "online",
            lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
            contacts: [],
            groups: [],
            avatars: ["default"],
            stickers: [],
            themeColors: ["default"],
            purchases: [],
            coins: 100,
            referralCode: referralCode,
            referredBy: null,
            referrals: [],
            referralRewards: 0,
            currentThemeColor: '#ff00de',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    } else {
        await userRef.update({
            status: 'online',
            lastSeen: firebase.firestore.FieldValue.serverTimestamp()
        });
    }
    
    updateProfileElements(user);
}

// Generate Referral Code
function generateReferralCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Update Profile UI Elements
function updateProfileElements(user) {
    if (elements.profilePic) {
        elements.profilePic.src = user.photoURL || "https://api.dicebear.com/7.x/adventurer/svg?seed=" + user.uid;
    }
    loadUserSettings();
}

// Load User Data
async function loadUserData() {
    if (!currentUser) return;
    
    try {
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        if (userDoc.exists) {
            const userData = userDoc.data();
            userContacts = userData.contacts || [];
            userGroups = userData.groups || [];
            userAvatars = userData.avatars || [];
            userStickers = userData.stickers || [];
            userThemeColors = userData.themeColors || [];
            userPurchases = userData.purchases || [];
            
            updateProfileView(userData);
            updateBalance(userData.coins || 0);
            loadStories();
            loadFriendSuggestions();
            loadPurchaseHistory();
            updateEnhancedStats();
            
            // Apply user preferences
            if (userData.currentThemeColor) {
                applyThemeColor(userData.currentThemeColor);
            }
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Update Profile View
function updateProfileView(userData) {
    elements.viewProfilePic.src = userData.avatar || "https://api.dicebear.com/7.x/adventurer/svg?seed=" + currentUser.uid;
    elements.viewProfileName.textContent = userData.name || 'User';
    elements.viewProfileUsername.textContent = '@' + (userData.username || 'username');
    elements.viewProfileEmail.textContent = userData.email || '';
    elements.viewProfileBio.textContent = userData.bio || 'No bio yet';
    elements.viewContactsCount.textContent = userData.contacts?.length || 0;
    elements.viewGroupsCount.textContent = userData.groups?.length || 0;
    elements.viewAvatarsCount.textContent = userData.avatars?.length || 0;
    elements.viewStickersCount.textContent = userData.stickers?.length || 0;
    elements.viewPurchasesCount.textContent = userData.purchases?.length || 0;
    
    // Update referral code
    if (elements.userReferralCode) {
        elements.userReferralCode.textContent = userData.referralCode || 'Loading...';
    }
    
    // Update referral stats
    if (elements.referralCount) {
        elements.referralCount.textContent = userData.referrals?.length || 0;
    }
    if (elements.referralRewards) {
        elements.referralRewards.textContent = userData.referralRewards || 0;
    }
}

// Update Enhanced Stats
function updateEnhancedStats() {
    const statsGrid = elements.enhancedStatsGrid;
    if (!statsGrid) return;
    
    statsGrid.innerHTML = `
        <div class="stat-card">
            <i class="fas fa-users"></i>
            <span class="stat-value">${userContacts.length}</span>
            <div class="stat-label">Contacts</div>
        </div>
        <div class="stat-card">
            <i class="fas fa-layer-group"></i>
            <span class="stat-value">${userGroups.length}</span>
            <div class="stat-label">Groups</div>
        </div>
        <div class="stat-card">
            <i class="fas fa-user-circle"></i>
            <span class="stat-value">${userAvatars.length}</span>
            <div class="stat-label">Avatars</div>
        </div>
        <div class="stat-card">
            <i class="fas fa-smile"></i>
            <span class="stat-value">${userStickers.length}</span>
            <div class="stat-label">Stickers</div>
        </div>
        <div class="stat-card">
            <i class="fas fa-palette"></i>
            <span class="stat-value">${userThemeColors.length}</span>
            <div class="stat-label">Themes</div>
        </div>
        <div class="stat-card">
            <i class="fas fa-shopping-bag"></i>
            <span class="stat-value">${userPurchases.length}</span>
            <div class="stat-label">Purchases</div>
        </div>
    `;
}

// Load Purchase History
function loadPurchaseHistory() {
    const historyList = elements.purchaseHistoryList;
    if (!historyList) return;
    
    historyList.innerHTML = '';
    
    if (userPurchases.length === 0) {
        historyList.innerHTML = '<div class="no-stickers">No purchases yet.</div>';
        return;
    }
    
    userPurchases.forEach(purchase => {
        const purchaseItem = document.createElement('div');
        purchaseItem.className = 'purchase-item';
        purchaseItem.innerHTML = `
            <div class="purchase-info">
                <h5>${purchase.itemName}</h5>
                <p>${new Date(purchase.timestamp).toLocaleDateString()}</p>
            </div>
            <div class="purchase-amount">₹${purchase.amount}</div>
        `;
        historyList.appendChild(purchaseItem);
    });
}

// Update Balance Display
function updateBalance(coins) {
    if (elements.userBalance) {
        elements.userBalance.textContent = coins + ' coins';
    }
}

// Setup Realtime Listeners
function setupRealtimeListeners() {
    if (!currentUser) return;
    
    // Listen for user profile changes
    const userUnsubscribe = db.collection('users').doc(currentUser.uid)
        .onSnapshot((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                updateProfileElements(currentUser);
                updateProfileView(userData);
                updateBalance(userData.coins || 0);
                updateEnhancedStats();
                loadPurchaseHistory();
            }
        });
    
    unsubscribeFunctions.push(userUnsubscribe);
    
    // Load all users for search
    const usersUnsubscribe = db.collection('users')
        .onSnapshot((snapshot) => {
            allUsers = snapshot.docs;
            updateContactsList(allUsers.filter(doc => 
                userContacts.some(contact => contact.id === doc.id)
            ));
        });
    
    unsubscribeFunctions.push(usersUnsubscribe);
    
    // Listen for groups
    const groupsUnsubscribe = db.collection('groups')
        .where('members', 'array-contains', currentUser.uid)
        .onSnapshot((snapshot) => {
            allGroups = snapshot.docs;
            updateGroupsList(allGroups);
        });
    
    unsubscribeFunctions.push(groupsUnsubscribe);
    
    // Load chats with real-time updates
    loadChatsRealtime();
    
    // Load stories with real-time updates
    loadStoriesRealtime();
}

// Load Chats with Real-time Updates
function loadChatsRealtime() {
    if (!currentUser) return;
    
    const chatsUnsubscribe = db.collection('chats')
        .where('users', 'array-contains', currentUser.uid)
        .orderBy('lastUpdated', 'desc')
        .onSnapshot((snapshot) => {
            allChats = snapshot.docs;
            updateChatsListRealtime(allChats);
        });
    
    unsubscribeFunctions.push(chatsUnsubscribe);
}

// Update Chats List with Real-time Data
function updateChatsListRealtime(chatDocs) {
    const chatsList = elements.chatsList;
    chatsList.innerHTML = '';
    
    if (chatDocs.length === 0) {
        chatsList.innerHTML = '<div class="no-chats">No chats yet. Start a new conversation!</div>';
        return;
    }
    
    chatDocs.forEach(async (doc) => {
        const chat = doc.data();
        const partnerId = chat.users.find(id => id !== currentUser.uid);
        
        try {
            const userDoc = await db.collection('users').doc(partnerId).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                const chatItem = document.createElement('div');
                chatItem.className = 'chat-item';
                chatItem.innerHTML = `
                    <img src="${userData.avatar}" alt="${userData.name}" class="clickable-profile-pic">
                    <div class="chat-info">
                        <h4>${userData.name}</h4>
                        <p>${chat.lastMessage || 'No messages yet'}</p>
                    </div>
                    <div class="chat-time">${formatChatTime(chat.lastUpdated)}</div>
                `;
                chatItem.addEventListener('click', () => startChat(partnerId, userData));
                chatsList.appendChild(chatItem);
            }
        } catch (error) {
            console.error('Error loading chat user:', error);
        }
    });
}

// Load Stories with Real-time Updates
function loadStoriesRealtime() {
    const now = Date.now();
    const storiesContainer = document.querySelector(".stories-scroll");
    
    // Clear existing stories except add story button
    const addStory = storiesContainer.querySelector('.add-story');
    storiesContainer.innerHTML = "";
    storiesContainer.appendChild(addStory);

    const storiesUnsubscribe = db.collection("stories")
        .where("expiresAt", ">", now)
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
            const userStoriesMap = new Map();
            
            snapshot.forEach(doc => {
                const story = doc.data();
                if (!userStoriesMap.has(story.userId)) {
                    userStoriesMap.set(story.userId, story);
                }
            });
            
            // Load user data for each story
            userStoriesMap.forEach(async (story, userId) => {
                try {
                    const userDoc = await db.collection('users').doc(userId).get();
                    if (userDoc.exists) {
                        const userData = userDoc.data();
                        displayStory(story, userData);
                    }
                } catch (error) {
                    console.error('Error loading story user:', error);
                }
            });
        });
    
    unsubscribeFunctions.push(storiesUnsubscribe);
}

// Cleanup Realtime Listeners
function cleanupRealtimeListeners() {
    unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
    unsubscribeFunctions = [];
}

// Screen Management
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
    
    if (screenId !== 'app-screen') {
        closeAllModals();
    }
}

// Tab Switching
function switchTab(tabId) {
    elements.navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.tab === tabId) {
            item.classList.add('active');
        }
    });
    
    elements.tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === `${tabId}-tab`) {
            content.classList.add('active');
        }
    });
    
    switch(tabId) {
        case 'chats':
            loadChatsRealtime();
            break;
        case 'groups':
            loadGroups();
            break;
        case 'contacts':
            loadContacts();
            break;
    }
}

// Modal Management
function openModal(modal) {
    closeAllModals();
    modal.classList.add('active');
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
    elements.stickerPanel.classList.add('hidden');
}

// Profile Menu
function toggleProfileMenu() {
    elements.profileMenu.classList.toggle('show');
}

// Settings
function openSettings() {
    openModal(elements.settingsModal);
    toggleProfileMenu();
    loadSettingsData();
}

function switchSettingsTab(tabId) {
    elements.settingsTabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.tab === tabId) {
            tab.classList.add('active');
        }
    });
    
    elements.settingsPanels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === `${tabId}-settings`) {
            panel.classList.add('active');
        }
    });
    
    if (tabId === 'avatars') {
        loadAvatarsStore();
    } else if (tabId === 'my-avatars') {
        loadMyAvatars();
    } else if (tabId === 'stickers-store') {
        loadStickersStore('all');
    } else if (tabId === 'my-stickers') {
        loadMyStickers();
    } else if (tabId === 'themes-store') {
        loadThemesStore('all');
    } else if (tabId === 'my-themes') {
        loadMyThemes();
    }
}

// Load Settings Data
async function loadSettingsData() {
    await loadUserSettings();
    loadAvatarsStore();
    loadMyAvatars();
    loadStickersStore('all');
    loadMyStickers();
    loadThemesStore('all');
    loadMyThemes();
}

// Load User Settings
async function loadUserSettings() {
    if (!currentUser) return;
    
    try {
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        if (userDoc.exists) {
            const userData = userDoc.data();
            elements.profileName.value = userData.name || '';
            elements.profileUsername.value = userData.username || '';
            elements.profileEmail.value = userData.email || '';
            elements.profileBio.value = userData.bio || '';
            elements.settingsProfilePic.src = userData.avatar || "https://api.dicebear.com/7.x/adventurer/svg?seed=" + currentUser.uid;
        }
    } catch (error) {
        console.error('Error loading user settings:', error);
    }
}

// Profile Picture Upload
async function handleProfilePicUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
        elements.uploadPicBtn.innerHTML = '<div class="loading"></div>';
        
        const storageRef = storage.ref();
        const avatarRef = storageRef.child(`avatars/${currentUser.uid}/${file.name}`);
        await avatarRef.put(file);
        const downloadURL = await avatarRef.getDownloadURL();
        
        await db.collection('users').doc(currentUser.uid).update({
            avatar: downloadURL
        });
        
        elements.settingsProfilePic.src = downloadURL;
        elements.profilePic.src = downloadURL;
        
        elements.uploadPicBtn.textContent = 'Change Picture';
        
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        alert('Error uploading picture. Please try again.');
        elements.uploadPicBtn.textContent = 'Change Picture';
    }
}

// Profile Update
async function handleProfileUpdate(event) {
    event.preventDefault();
    
    const name = elements.profileName.value.trim();
    const username = elements.profileUsername.value.trim();
    const bio = elements.profileBio.value.trim();
    
    if (!name) {
        alert('Please enter your name');
        return;
    }
    
    if (!username) {
        alert('Please enter a username');
        return;
    }
    
    // Check username availability
    const usernameAvailable = await checkUsernameAvailability(username);
    if (!usernameAvailable) {
        alert('Username already taken. Please choose another one.');
        return;
    }
    
    try {
        await db.collection('users').doc(currentUser.uid).update({
            name: name,
            username: username,
            bio: bio
        });
        
        alert('Profile updated successfully!');
        closeAllModals();
        
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('Error updating profile. Please try again.');
    }
}

// Check Username Availability
async function checkUsernameAvailability(username) {
    try {
        const snapshot = await db.collection('users')
            .where('username', '==', username)
            .where(firebase.firestore.FieldPath.documentId(), '!=', currentUser.uid)
            .get();
        
        return snapshot.empty;
    } catch (error) {
        console.error('Error checking username:', error);
        return false;
    }
}

// Open Profile View
function openProfile() {
    openModal(elements.profileModal);
    toggleProfileMenu();
}

// Show User Profile
async function showUserProfile(userId) {
    try {
        const userDoc = await db.collection('users').doc(userId).get();
        if (userDoc.exists) {
            const userData = userDoc.data();
            currentViewingUserId = userId;
            
            elements.userViewProfilePic.src = userData.avatar || "https://api.dicebear.com/7.x/adventurer/svg?seed=" + userId;
            elements.userViewProfileName.textContent = userData.name || 'User';
            elements.userViewProfileUsername.textContent = '@' + (userData.username || 'username');
            elements.userViewProfileBio.textContent = userData.bio || 'No bio yet';
            
            // Check if already in contacts
            const isContact = userContacts.some(contact => contact.id === userId);
            elements.addToContacts.style.display = isContact ? 'none' : 'block';
            
            openModal(elements.userProfileModal);
        }
    } catch (error) {
        console.error('Error loading user profile:', error);
    }
}

// Start Chat with Current User
function startChatWithCurrentUser() {
    if (!currentViewingUserId) return;
    
    db.collection('users').doc(currentViewingUserId).get().then(doc => {
        if (doc.exists) {
            const userData = doc.data();
            startChat(currentViewingUserId, userData);
            closeAllModals();
        }
    });
}

// Add Current User to Contacts
async function addCurrentUserToContacts() {
    if (!currentViewingUserId) return;
    
    try {
        const userDoc = await db.collection('users').doc(currentViewingUserId).get();
        if (userDoc.exists) {
            const userData = userDoc.data();
            
            await db.collection('users').doc(currentUser.uid).update({
                contacts: firebase.firestore.FieldValue.arrayUnion({
                    id: currentViewingUserId,
                    username: userData.username,
                    email: userData.email,
                    addedAt: new Date().toISOString()
                })
            });
            
            alert('Contact added successfully!');
            elements.addToContacts.style.display = 'none';
        }
    } catch (error) {
        console.error('Error adding contact:', error);
        alert('Error adding contact. Please try again.');
    }
}

// Authentication Handlers
async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        await auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed: ' + error.message);
    }
}

async function handleSignup(event) {
    event.preventDefault();
    const name = document.getElementById('signup-name').value;
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const referralCode = document.getElementById('referral-code').value;
    
    try {
        // Check username availability first
        const usernameAvailable = await checkUsernameAvailability(username);
        if (!usernameAvailable) {
            alert('Username already taken. Please choose another one.');
            return;
        }
        
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        await userCredential.user.updateProfile({ displayName: name });
        
        // Process referral if provided
        if (referralCode) {
            await processReferral(referralCode);
        }
    } catch (error) {
        console.error('Signup error:', error);
        alert('Signup failed: ' + error.message);
    }
}

async function handleLogout() {
    try {
        if (currentUser) {
            await db.collection('users').doc(currentUser.uid).update({
                status: 'offline',
                lastSeen: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        
        await auth.signOut();
        toggleProfileMenu();
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Chat Functions
function getChatId(uid1, uid2) {
    return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
}

async function openNewChatModal() {
    openModal(elements.newChatModal);
    loadAvailableUsers();
}

async function loadAvailableUsers() {
    try {
        const usersSnapshot = await db.collection('users')
            .where('email', '!=', currentUser.email)
            .get();
        
        updateUsersList(usersSnapshot.docs);
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

function updateUsersList(userDocs) {
    const usersList = elements.usersList;
    usersList.innerHTML = '';
    
    if (userDocs.length === 0) {
        usersList.innerHTML = '<div class="no-contacts">No other users found.</div>';
        return;
    }
    
    userDocs.forEach(doc => {
        const user = doc.data();
        const userItem = document.createElement('div');
        userItem.className = 'contact-item';
        userItem.innerHTML = `
            <img src="${user.avatar}" alt="${user.name}" class="clickable-profile-pic">
            <div class="contact-info">
                <h4>${user.name}</h4>
                <p>@${user.username}</p>
            </div>
        `;
        userItem.addEventListener('click', () => startChat(doc.id, user));
        usersList.appendChild(userItem);
    });
}

async function startChat(partnerId, partnerData) {
    currentChatId = getChatId(currentUser.uid, partnerId);
    currentChatType = 'individual';
    
    elements.chatName.textContent = partnerData.name;
    elements.chatAvatar.src = partnerData.avatar;
    elements.chatStatus.textContent = partnerData.status === 'online' ? 'Online' : 'Last seen recently';
    
    elements.chatWindow.classList.remove('hidden');
    closeAllModals();
    
    const chatRef = db.collection('chats').doc(currentChatId);
    const chatDoc = await chatRef.get();
    if (!chatDoc.exists) {
        await chatRef.set({
            users: [currentUser.uid, partnerId],
            lastMessage: '',
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
    }

    loadMessages();
    setupTypingListener();
}

function loadMessages() {
    if (!currentChatId) return;
    
    elements.messagesContainer.innerHTML = '';
    
    let messagesRef;
    if (currentChatType === 'individual') {
        messagesRef = db.collection('chats').doc(currentChatId).collection('messages')
            .orderBy('timestamp', 'asc');
    } else {
        messagesRef = db.collection('groups').doc(currentChatId).collection('messages')
            .orderBy('timestamp', 'asc');
    }
    
    const unsubscribe = messagesRef.onSnapshot((snapshot) => {
        elements.messagesContainer.innerHTML = '';
        
        snapshot.forEach(doc => {
            const message = doc.data();
            renderMessage(message, doc.id);
        });
        
        elements.messagesContainer.scrollTop = elements.messagesContainer.scrollHeight;
        
        // Mark messages as read
        markMessagesAsRead();
    });
    
    unsubscribeFunctions.push(unsubscribe);
}

function renderMessage(message, messageId) {
    if (message.deleted) {
        renderDeletedMessage(message, messageId);
        return;
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.senderId === currentUser.uid ? 'sent' : 'received'}`;
    messageDiv.dataset.messageId = messageId;
    
    const time = message.timestamp ? new Date(message.timestamp.toDate()).toLocaleTimeString([], { 
        hour: '2-digit', minute: '2-digit' 
    }) : 'Sending...';
    
    let messageContent = '';
    
    switch (message.type) {
        case 'sticker':
            messageContent = `
                <div class="message-text" style="font-size: 2rem; text-align: center;">${message.text}</div>
            `;
            break;
        case 'image':
            messageContent = `
                <div class="media-message">
                    <img src="${message.mediaUrl}" alt="Image" onclick="openMediaViewer('${message.mediaUrl}')">
                </div>
            `;
            break;
        case 'video':
            messageContent = `
                <div class="media-message">
                    <video controls src="${message.mediaUrl}" onclick="openMediaViewer('${message.mediaUrl}')"></video>
                </div>
            `;
            break;
        case 'file':
            messageContent = `
                <div class="file-message">
                    <div class="file-icon">
                        <i class="fas fa-file"></i>
                    </div>
                    <div class="file-info">
                        <div class="file-name">${message.fileName}</div>
                        <div class="file-size">${formatFileSize(message.fileSize)}</div>
                    </div>
                    <button class="download-btn" onclick="downloadFile('${message.mediaUrl}', '${message.fileName}')">
                        <i class="fas fa-download"></i>
                    </button>
                </div>
            `;
            break;
        default:
            messageContent = `
                <div class="message-text">${message.text}</div>
            `;
    }
    
    // Add sender name for group messages
    let senderName = '';
    if (currentChatType === 'group' && message.senderId !== currentUser.uid) {
        senderName = `<div class="message-sender">${message.senderName}</div>`;
    }
    
    let statusIndicator = '';
    if (message.senderId === currentUser.uid) {
        const isRead = message.readBy && message.readBy.length > 1;
        statusIndicator = `
            <div class="message-status ${isRead ? 'read' : ''}">
                <i class="fas fa-check${isRead ? '-double' : ''}"></i>
            </div>
        `;
    }
    
    messageDiv.innerHTML = `
        ${senderName}
        ${messageContent}
        <div class="message-footer">
            <div class="message-time">
                ${time}
                ${message.edited ? '<span class="edited-badge">edited</span>' : ''}
            </div>
            ${statusIndicator}
        </div>
        ${message.senderId === currentUser.uid ? `
            <button class="message-actions-btn" onclick="showMessageActions('${messageId}')">
                <i class="fas fa-ellipsis-v"></i>
            </button>
        ` : ''}
    `;
    
    elements.messagesContainer.appendChild(messageDiv);
}

function renderDeletedMessage(message, messageId) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.senderId === currentUser.uid ? 'sent' : 'received'} deleted`;
    messageDiv.innerHTML = `
        <div class="message-text deleted-message">
            <i class="fas fa-trash"></i> This message was deleted
        </div>
        <div class="message-time">${new Date(message.timestamp?.toDate()).toLocaleTimeString([], { 
            hour: '2-digit', minute: '2-digit' 
        })}</div>
    `;
    elements.messagesContainer.appendChild(messageDiv);
}

function showMessageActions(messageId) {
    selectedMessageId = messageId;
    openModal(elements.messageActionsModal);
}

async function handleEditMessage() {
    if (!selectedMessageId) return;
    
    let messageRef;
    if (currentChatType === 'individual') {
        messageRef = db.collection('chats').doc(currentChatId).collection('messages').doc(selectedMessageId);
    } else {
        messageRef = db.collection('groups').doc(currentChatId).collection('messages').doc(selectedMessageId);
    }
    
    const messageDoc = await messageRef.get();
    if (messageDoc.exists) {
        const message = messageDoc.data();
        elements.messageInput.value = message.text;
        elements.messageInput.focus();
        currentEditMessageId = selectedMessageId;
        
        // Add edit mode indicator
        const existingIndicator = document.querySelector('.edit-mode-indicator');
        if (existingIndicator) existingIndicator.remove();
        
        const indicator = document.createElement('div');
        indicator.className = 'edit-mode-indicator';
        indicator.innerHTML = `
            Editing message
            <button class="cancel-edit-btn" onclick="cancelEdit()">Cancel</button>
        `;
        elements.messageInput.parentNode.insertBefore(indicator, elements.messageInput);
    }
    
    elements.messageActionsModal.classList.remove('active');
}

function cancelEdit() {
    currentEditMessageId = null;
    elements.messageInput.value = '';
    document.querySelector('.edit-mode-indicator')?.remove();
}

async function handleDeleteMessage() {
    if (!selectedMessageId) return;
    
    if (confirm('Are you sure you want to delete this message?')) {
        let messageRef;
        if (currentChatType === 'individual') {
            messageRef = db.collection('chats').doc(currentChatId).collection('messages').doc(selectedMessageId);
        } else {
            messageRef = db.collection('groups').doc(currentChatId).collection('messages').doc(selectedMessageId);
        }
        
        await messageRef.update({
            deleted: true,
            text: 'This message was deleted',
            mediaUrl: null
        });
        
        elements.messageActionsModal.classList.remove('active');
    }
}

async function sendMessage() {
    const text = elements.messageInput.value.trim();
    
    if (currentEditMessageId) {
        await editMessage(currentEditMessageId, text);
        return;
    }
    
    if (!text) return;

    if (currentChatType === "group") {
        const messageData = {
            text: text,
            senderId: currentUser.uid,
            senderName: currentUser.displayName || "User",
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            readBy: [currentUser.uid],
            type: "text",
        };

        await db.collection("groups")
                .doc(currentChatId)
                .collection("messages")
                .add(messageData);

        await db.collection("groups").doc(currentChatId).update({
            lastMessage: `${messageData.senderName}: ${text}`,
            lastMessageTime: firebase.firestore.FieldValue.serverTimestamp(),
        });

        elements.messageInput.value = "";
        stopTyping();
        return;
    }

    const chatId = currentChatId;
    const messageData = {
        text: text,
        senderId: currentUser.uid,
        senderName: currentUser.displayName || "User",
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        readBy: [currentUser.uid],
        type: "text",
    };

    await db.collection("chats")
            .doc(chatId)
            .collection("messages")
            .add(messageData);

    await db.collection("chats").doc(chatId).set({
        users: [currentUser.uid, currentChatId.split('_').find(id => id !== currentUser.uid)],
        lastMessage: text,
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    elements.messageInput.value = "";
    stopTyping();
}

async function editMessage(messageId, newText) {
    if (!newText.trim()) {
        cancelEdit();
        return;
    }
    
    let messageRef;
    if (currentChatType === 'individual') {
        messageRef = db.collection('chats').doc(currentChatId).collection('messages').doc(messageId);
    } else {
        messageRef = db.collection('groups').doc(currentChatId).collection('messages').doc(messageId);
    }
    
    await messageRef.update({
        text: newText,
        edited: true,
        editTimestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    cancelEdit();
}

function handleTyping() {
    if (!isTyping) {
        isTyping = true;
        startTyping();
    }
    
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        stopTyping();
    }, 1000);
}

function startTyping() {
    if (!currentChatId) return;
    
    if (currentChatType === 'individual') {
        db.collection('chats').doc(currentChatId).update({
            [`typing.${currentUser.uid}`]: true
        });
    } else {
        db.collection('groups').doc(currentChatId).update({
            [`typing.${currentUser.uid}`]: true
        });
    }
}

function stopTyping() {
    if (!currentChatId || !isTyping) return;
    
    isTyping = false;
    if (currentChatType === 'individual') {
        db.collection('chats').doc(currentChatId).update({
            [`typing.${currentUser.uid}`]: false
        });
    } else {
        db.collection('groups').doc(currentChatId).update({
            [`typing.${currentUser.uid}`]: false
        });
    }
}

function setupTypingListener() {
    if (!currentChatId) return;
    
    let docRef;
    if (currentChatType === 'individual') {
        docRef = db.collection('chats').doc(currentChatId);
    } else {
        docRef = db.collection('groups').doc(currentChatId);
    }
    
    const unsubscribe = docRef.onSnapshot((doc) => {
        if (doc.exists) {
            const data = doc.data();
            const typing = data.typing || {};
            const otherUsersTyping = Object.keys(typing).filter(uid => 
                uid !== currentUser.uid && typing[uid]
            );
            
            if (otherUsersTyping.length > 0) {
                elements.typingIndicator.classList.remove('hidden');
                elements.typingIndicator.innerHTML = `
                    <span>${otherUsersTyping.length > 1 ? 'Several people are' : 'is'} typing...</span>
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                `;
            } else {
                elements.typingIndicator.classList.add('hidden');
            }
        }
    });
    
    unsubscribeFunctions.push(unsubscribe);
}

function markMessagesAsRead() {
    if (!currentChatId) return;
    
    let messagesRef;
    if (currentChatType === 'individual') {
        messagesRef = db.collection('chats').doc(currentChatId).collection('messages');
    } else {
        messagesRef = db.collection('groups').doc(currentChatId).collection('messages');
    }
    
    // Mark all unread messages as read
    messagesRef
        .where('senderId', '!=', currentUser.uid)
        .where('readBy', 'not-in', [[currentUser.uid]])
        .get()
        .then((snapshot) => {
            const batch = db.batch();
            snapshot.forEach((doc) => {
                const messageRef = messagesRef.doc(doc.id);
                batch.update(messageRef, {
                    readBy: firebase.firestore.FieldValue.arrayUnion(currentUser.uid)
                });
            });
            return batch.commit();
        })
        .catch((error) => {
            console.error('Error marking messages as read:', error);
        });
}

function attachMedia(fileType) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = fileType;
    input.onchange = (e) => uploadMedia(e.target.files[0]);
    input.click();
}

async function uploadMedia(file) {
    if (!file) return;
    
    const fileType = file.type.split('/')[0];
    const filePath = `chat_media/${currentUser.uid}/${Date.now()}_${file.name}`;
    const storageRef = storage.ref(filePath);
    
    try {
        const uploadTask = storageRef.put(file);
        
        uploadTask.on('state_changed',
            (snapshot) => {
                // Progress handling can be added here
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            },
            (error) => {
                alert('Error uploading file: ' + error.message);
            },
            async () => {
                const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                const messageData = {
                    senderId: currentUser.uid,
                    senderName: currentUser.displayName || "User",
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    readBy: [currentUser.uid],
                    type: fileType === 'image' ? 'image' : fileType === 'video' ? 'video' : 'file',
                    mediaUrl: downloadURL,
                    fileName: file.name,
                    fileSize: file.size
                };
                
                if (currentChatType === 'individual') {
                    await db.collection('chats').doc(currentChatId).collection('messages').add(messageData);
                    await db.collection('chats').doc(currentChatId).update({
                        lastMessage: fileType === 'image' ? '📷 Image' : fileType === 'video' ? '🎥 Video' : '📄 File',
                        lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
                    });
                } else {
                    await db.collection('groups').doc(currentChatId).collection('messages').add(messageData);
                    await db.collection('groups').doc(currentChatId).update({
                        lastMessage: fileType === 'image' ? '📷 Image' : fileType === 'video' ? '🎥 Video' : '📄 File',
                        lastMessageTime: firebase.firestore.FieldValue.serverTimestamp()
                    });
                }
            }
        );
    } catch (error) {
        alert('Error uploading media: ' + error.message);
    }
}

function openMediaViewer(mediaUrl) {
    // Simple media viewer implementation
    window.open(mediaUrl, '_blank');
}

function downloadFile(url, filename) {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function closeChatWindow() {
    elements.chatWindow.classList.add('hidden');
    currentChatId = null;
    currentChatType = null;
    stopTyping();
}

// Open Chat Info
function openChatInfo() {
    if (currentChatType === 'individual') {
        const partnerId = currentChatId.split('_').find(id => id !== currentUser.uid);
        showUserProfile(partnerId);
    } else if (currentChatType === 'group') {
        openGroupInfo(currentChatId);
    }
}

// Load Chats
async function loadChats() {
    if (!currentUser) return;
    
    try {
        // Get all users to display in chats
        const usersSnapshot = await db.collection('users').get();
        const contacts = usersSnapshot.docs.filter(doc => 
            doc.id !== currentUser.uid && 
            userContacts.some(contact => contact.id === doc.id)
        );
        
        updateChatsList(contacts);
    } catch (error) {
        console.error('Error loading chats:', error);
    }
}

function updateChatsList(contactDocs) {
    const chatsList = elements.chatsList;
    chatsList.innerHTML = '';
    
    if (contactDocs.length === 0) {
        chatsList.innerHTML = '<div class="no-chats">No chats yet. Start a new conversation!</div>';
        return;
    }
    
    contactDocs.forEach(doc => {
        const contact = doc.data();
        const chatItem = document.createElement('div');
        chatItem.className = 'chat-item';
        chatItem.innerHTML = `
            <img src="${contact.avatar}" alt="${contact.name}" class="clickable-profile-pic">
            <div class="chat-info">
                <h4>${contact.name}</h4>
                <p>${contact.status === 'online' ? 'Online' : 'Offline'}</p>
            </div>
            <div class="chat-time">Now</div>
        `;
        chatItem.addEventListener('click', () => startChat(doc.id, contact));
        chatsList.appendChild(chatItem);
    });
}

// Group Functions
async function openNewGroupModal() {
    openModal(elements.newGroupModal);
    loadAvailableGroupMembers();
    resetGroupAvatar();
}

function handleGroupAvatarOption(type) {
    const browseBtn = elements.browseAvatarsBtn;
    const avatarInput = elements.groupAvatarInput;
    
    if (type === 'gallery') {
        browseBtn.style.display = 'none';
        avatarInput.style.display = 'block';
    } else if (type === 'avatar') {
        avatarInput.style.display = 'none';
        browseBtn.style.display = 'block';
    } else {
        // Default
        browseBtn.style.display = 'none';
        avatarInput.style.display = 'none';
        resetGroupAvatar();
    }
}

function resetGroupAvatar() {
    elements.groupAvatarPreview.style.display = 'none';
    elements.groupDefaultAvatar.style.display = 'flex';
}

async function handleGroupAvatarUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
        // Upload the image to Firebase Storage
        const storageRef = storage.ref();
        const avatarRef = storageRef.child(`group_avatars/${currentUser.uid}/${Date.now()}_${file.name}`);
        await avatarRef.put(file);
        const downloadURL = await avatarRef.getDownloadURL();
        
        elements.groupAvatarPreview.src = downloadURL;
        elements.groupAvatarPreview.style.display = 'block';
        elements.groupDefaultAvatar.style.display = 'none';
    } catch (error) {
        console.error('Error uploading group avatar:', error);
        alert('Error uploading group avatar');
    }
}

function openGroupAvatarsModal() {
    openModal(elements.groupAvatarsModal);
    loadGroupAvatars();
}

function loadGroupAvatars() {
    const avatars = JSON.parse(localStorage.getItem('neonchat_avatars') || '[]');
    const grid = elements.groupAvatarsGrid;
    grid.innerHTML = '';
    
    avatars.forEach(avatar => {
        const isOwned = userAvatars.some(owned => owned === avatar.id);
        if (!isOwned) return;
        
        const avatarItem = document.createElement('div');
        avatarItem.className = 'avatar-item owned';
        avatarItem.innerHTML = `
            <img src="${avatar.url}" alt="${avatar.name}">
            <span>${avatar.name}</span>
        `;
        avatarItem.addEventListener('click', () => {
            elements.groupAvatarPreview.src = avatar.url;
            elements.groupAvatarPreview.style.display = 'block';
            elements.groupDefaultAvatar.style.display = 'none';
            closeAllModals();
        });
        grid.appendChild(avatarItem);
    });
}

async function loadAvailableGroupMembers() {
    try {
        const usersSnapshot = await db.collection('users')
            .where('email', '!=', currentUser.email)
            .get();
        
        updateGroupMembersList(usersSnapshot.docs);
    } catch (error) {
        console.error('Error loading group members:', error);
    }
}

function updateGroupMembersList(userDocs) {
    const membersList = elements.groupMembersList;
    membersList.innerHTML = '';
    
    userDocs.forEach(doc => {
        const user = doc.data();
        const memberItem = document.createElement('div');
        memberItem.className = 'contact-item';
        memberItem.innerHTML = `
            <input type="checkbox" id="member-${doc.id}" value="${doc.id}">
            <img src="${user.avatar}" alt="${user.name}" class="clickable-profile-pic">
            <div class="contact-info">
                <h4>${user.name}</h4>
                <p>@${user.username}</p>
            </div>
        `;
        membersList.appendChild(memberItem);
    });
}

async function createGroup() {
    const name = elements.groupName.value.trim();
    const description = elements.groupDescription.value.trim();
    
    if (!name) {
        alert('Please enter a group name');
        return;
    }
    
    const selectedMembers = Array.from(document.querySelectorAll('#group-members-list input:checked'))
        .map(input => input.value);
    
    if (selectedMembers.length === 0) {
        alert('Please select at least one member');
        return;
    }
    
    let groupAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;
    
    // Check if custom avatar is selected
    const activeOption = document.querySelector('.group-avatar-option.active').dataset.type;
    if (activeOption === 'gallery' && elements.groupAvatarPreview.style.display !== 'none') {
        groupAvatar = elements.groupAvatarPreview.src;
    } else if (activeOption === 'avatar' && elements.groupAvatarPreview.style.display !== 'none') {
        groupAvatar = elements.groupAvatarPreview.src;
    }
    
    try {
        const members = [currentUser.uid, ...selectedMembers];
        const admins = [currentUser.uid];
        
        const groupDoc = await db.collection('groups').add({
            name: name,
            description: description,
            members: members,
            admins: admins,
            createdBy: currentUser.uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            avatar: groupAvatar
        });
        
        const batch = db.batch();
        members.forEach(memberId => {
            const userRef = db.collection('users').doc(memberId);
            batch.update(userRef, {
                groups: firebase.firestore.FieldValue.arrayUnion(groupDoc.id)
            });
        });
        await batch.commit();
        
        alert('Group created successfully!');
        closeAllModals();
        loadGroups();
        
    } catch (error) {
        console.error('Error creating group:', error);
        alert('Error creating group. Please try again.');
    }
}

function loadGroups() {
    // Groups are loaded via realtime listener
}

function updateGroupsList(groupDocs) {
    const groupsList = elements.groupsList;
    groupsList.innerHTML = '';
    
    if (groupDocs.length === 0) {
        groupsList.innerHTML = '<div class="no-groups">No groups yet. Create your first group!</div>';
        return;
    }
    
    groupDocs.forEach(doc => {
        const group = doc.data();
        const groupItem = document.createElement('div');
        groupItem.className = 'group-item';
        groupItem.innerHTML = `
            <img src="${group.avatar}" alt="${group.name}">
            <div class="group-info">
                <h4>${group.name}</h4>
                <p>${group.description || 'No description'}</p>
                <p>${group.members?.length || 0} members</p>
            </div>
        `;
        groupItem.addEventListener('click', () => openGroupChat(doc.id, group));
        groupsList.appendChild(groupItem);
    });
}

async function openGroupChat(groupId, groupData) {
    currentChatId = groupId;
    currentChatType = 'group';
    
    elements.chatName.textContent = groupData.name;
    elements.chatAvatar.src = groupData.avatar;
    elements.chatStatus.textContent = `${groupData.members?.length || 0} members`;
    
    elements.chatWindow.classList.remove('hidden');
    
    loadMessages();
    setupTypingListener();
}

// Open Group Info
async function openGroupInfo(groupId) {
    try {
        const groupDoc = await db.collection('groups').doc(groupId).get();
        if (groupDoc.exists) {
            const groupData = groupDoc.data();
            
            elements.groupInfoAvatar.src = groupData.avatar;
            elements.groupInfoName.textContent = groupData.name;
            elements.groupInfoDescription.textContent = groupData.description || 'No description';
            elements.groupMembersCount.textContent = groupData.members?.length || 0;
            
            // Load members
            await loadGroupMembers(groupId, groupData);
            
            // Check if current user is admin
            const isAdmin = groupData.admins && groupData.admins.includes(currentUser.uid);
            elements.makeAdminBtn.style.display = isAdmin ? 'block' : 'none';
            elements.removeMemberBtn.style.display = isAdmin ? 'block' : 'none';
            
            openModal(elements.groupInfoModal);
        }
    } catch (error) {
        console.error('Error loading group info:', error);
    }
}

// Load Group Members
async function loadGroupMembers(groupId, groupData) {
    const membersList = elements.groupInfoMembersList;
    membersList.innerHTML = '';
    
    if (!groupData.members || groupData.members.length === 0) return;
    
    for (const memberId of groupData.members) {
        try {
            const userDoc = await db.collection('users').doc(memberId).get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                const isAdmin = groupData.admins && groupData.admins.includes(memberId);
                
                const memberItem = document.createElement('div');
                memberItem.className = 'contact-item';
                memberItem.innerHTML = `
                    <img src="${userData.avatar}" alt="${userData.name}" class="clickable-profile-pic">
                    <div class="contact-info">
                        <h4>${userData.name} ${isAdmin ? '(Admin)' : ''}</h4>
                        <p>@${userData.username}</p>
                    </div>
                `;
                membersList.appendChild(memberItem);
            }
        } catch (error) {
            console.error('Error loading member:', error);
        }
    }
}

// Exit Group
async function exitGroup() {
    if (!currentChatId || currentChatType !== 'group') return;
    
    if (confirm('Are you sure you want to exit this group?')) {
        try {
            await db.collection('groups').doc(currentChatId).update({
                members: firebase.firestore.FieldValue.arrayRemove(currentUser.uid),
                admins: firebase.firestore.FieldValue.arrayRemove(currentUser.uid)
            });
            
            await db.collection('users').doc(currentUser.uid).update({
                groups: firebase.firestore.FieldValue.arrayRemove(currentChatId)
            });
            
            closeAllModals();
            closeChatWindow();
            loadGroups();
            
        } catch (error) {
            console.error('Error exiting group:', error);
            alert('Error exiting group. Please try again.');
        }
    }
}

// Make Admin (placeholder - needs implementation)
async function makeAdmin() {
    alert('Make admin feature will be implemented');
}

// Remove Member (placeholder - needs implementation)
async function removeMember() {
    alert('Remove member feature will be implemented');
}

// Contact Functions
async function addContact() {
    const username = prompt("Enter your friend's username (without @):");
    if (!username) return;
    
    try {
        const usersSnapshot = await db.collection('users')
            .where('username', '==', username)
            .get();
        
        if (!usersSnapshot.empty) {
            const friendDoc = usersSnapshot.docs[0];
            const friendId = friendDoc.id;
            const friendData = friendDoc.data();
            
            if (friendId === currentUser.uid) {
                alert("You can't add yourself as a contact!");
                return;
            }
            
            await db.collection('users').doc(currentUser.uid).update({
                contacts: firebase.firestore.FieldValue.arrayUnion({
                    id: friendId,
                    username: username,
                    email: friendData.email,
                    addedAt: new Date().toISOString()
                })
            });
            
            alert('Contact added successfully!');
            loadContacts();
        } else {
            alert('No user found with that username.');
        }
    } catch (error) {
        console.error('Error adding contact:', error);
        alert('Error adding contact. Please try again.');
    }
}

function loadContacts() {
    // Contacts are loaded via realtime listener
}

function updateContactsList(contactDocs) {
    const contactsList = elements.contactsList;
    contactsList.innerHTML = '';
    
    if (contactDocs.length === 0) {
        contactsList.innerHTML = '<div class="no-contacts">No contacts yet. Add some friends!</div>';
        return;
    }
    
    contactDocs.forEach(doc => {
        const contact = doc.data();
        const contactItem = document.createElement('div');
        contactItem.className = 'contact-item';
        contactItem.innerHTML = `
            <img src="${contact.avatar}" alt="${contact.name}" class="clickable-profile-pic">
            <div class="contact-info">
                <h4>${contact.name}</h4>
                <p>@${contact.username}</p>
                <p class="chat-time">${contact.status === 'online' ? 'Online' : 'Offline'}</p>
            </div>
        `;
        contactItem.addEventListener('click', () => startChat(doc.id, contact));
        contactsList.appendChild(contactItem);
    });
}

// Friend Suggestions with Real-time Integration
async function loadFriendSuggestions() {
    try {
        // Get current user's contacts
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        const userContacts = userDoc.data()?.contacts || [];
        const contactIds = userContacts.map(contact => contact.id);
        
        // Find users who are not in contacts and not current user
        const usersSnapshot = await db.collection('users')
            .where(firebase.firestore.FieldPath.documentId(), 'not-in', [...contactIds, currentUser.uid])
            .limit(10)
            .get();
        
        updateSuggestedContactsList(usersSnapshot.docs);
    } catch (error) {
        console.error('Error loading friend suggestions:', error);
    }
}

function updateSuggestedContactsList(userDocs) {
    const suggestedList = elements.suggestedContactsList;
    suggestedList.innerHTML = '';
    
    if (userDocs.length === 0) {
        suggestedList.innerHTML = '<div class="no-contacts">No suggestions found.</div>';
        return;
    }
    
    userDocs.forEach(doc => {
        const user = doc.data();
        const contactItem = document.createElement('div');
        contactItem.className = 'suggested-contact';
        contactItem.innerHTML = `
            <img src="${user.avatar}" alt="${user.name}" class="clickable-profile-pic">
            <span>${user.name}</span>
            <small>@${user.username}</small>
            <button class="add-contact-btn" onclick="addSuggestedContact('${doc.id}', '${user.username}')">
                <i class="fas fa-user-plus"></i> Add
            </button>
        `;
        suggestedList.appendChild(contactItem);
    });
}

async function addSuggestedContact(userId, username) {
    try {
        const userDoc = await db.collection('users').doc(userId).get();
        const userData = userDoc.data();
        
        await db.collection('users').doc(currentUser.uid).update({
            contacts: firebase.firestore.FieldValue.arrayUnion({
                id: userId,
                username: username,
                email: userData.email,
                addedAt: new Date().toISOString()
            })
        });
        
        alert('Contact added successfully!');
        loadContacts();
        loadFriendSuggestions();
    } catch (error) {
        console.error('Error adding suggested contact:', error);
        alert('Error adding contact. Please try again.');
    }
}

// Search Functions
function handleSearch(event) {
    const query = event.target.value.toLowerCase();
    
    // Search in chats
    if (elements.chatsList.style.display !== 'none') {
        const chatItems = elements.chatsList.querySelectorAll('.chat-item');
        chatItems.forEach(item => {
            const name = item.querySelector('h4').textContent.toLowerCase();
            if (name.includes(query)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    // Search in contacts
    if (elements.contactsList.style.display !== 'none') {
        const contactItems = elements.contactsList.querySelectorAll('.contact-item');
        contactItems.forEach(item => {
            const name = item.querySelector('h4').textContent.toLowerCase();
            const username = item.querySelector('p').textContent.toLowerCase();
            if (name.includes(query) || username.includes(query)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    // Search in groups
    if (elements.groupsList.style.display !== 'none') {
        const groupItems = elements.groupsList.querySelectorAll('.group-item');
        groupItems.forEach(item => {
            const name = item.querySelector('h4').textContent.toLowerCase();
            const description = item.querySelector('p').textContent.toLowerCase();
            if (name.includes(query) || description.includes(query)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }
}

function handleUserSearch(event) {
    const query = event.target.value.toLowerCase();
    const userItems = elements.usersList.querySelectorAll('.contact-item');
    userItems.forEach(item => {
        const name = item.querySelector('h4').textContent.toLowerCase();
        const username = item.querySelector('p').textContent.toLowerCase();
        if (name.includes(query) || username.includes(query)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

function initializeAvatars() {
    const avatars = [
        // Free Avatars (10)
        { id: 1, url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=1', name: 'Adventurer 1', category: 'free', price: 0, razorpayLink: '' },
        { id: 2, url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=2', name: 'Adventurer 2', category: 'free', price: 0, razorpayLink: '' },
        { id: 3, url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=3', name: 'Adventurer 3', category: 'free', price: 0, razorpayLink: '' },
        { id: 4, url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=4', name: 'Adventurer 4', category: 'free', price: 0, razorpayLink: '' },
        { id: 5, url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=5', name: 'Adventurer 5', category: 'free', price: 0, razorpayLink: '' },
        { id: 6, url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=6', name: 'Adventurer 6', category: 'free', price: 0, razorpayLink: '' },
        { id: 7, url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=7', name: 'Adventurer 7', category: 'free', price: 0, razorpayLink: '' },
        { id: 8, url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=8', name: 'Adventurer 8', category: 'free', price: 0, razorpayLink: '' },
        { id: 9, url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=9', name: 'Adventurer 9', category: 'free', price: 0, razorpayLink: '' },
        { id: 10, url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=10', name: 'Adventurer 10', category: 'free', price: 0, razorpayLink: '' },
        
        // Premium Avatars with Razorpay Links
        { id: 11, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1', name: 'Cyber Warrior', category: 'premium', price: 99, razorpayLink: 'https://rzp.io/l/neonchat-avatar99' },
        { id: 12, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2', name: 'Neon Explorer', category: 'premium', price: 99, razorpayLink: 'https://rzp.io/l/neonchat-avatar99' },
        { id: 13, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3', name: 'Digital Ninja', category: 'premium', price: 99, razorpayLink: 'https://rzp.io/l/neonchat-avatar99' },
        { id: 14, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4', name: 'Tech Samurai', category: 'premium', price: 149, razorpayLink: 'https://rzp.io/l/neonchat-avatar149' },
        { id: 15, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5', name: 'Matrix Hero', category: 'premium', price: 149, razorpayLink: 'https://rzp.io/l/neonchat-avatar149' },
        { id: 16, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6', name: 'Cyber Punk', category: 'premium', price: 89, razorpayLink: 'https://rzp.io/l/neonchat-avatar89' },
        { id: 17, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=7', name: 'Neon Gladiator', category: 'premium', price: 89, razorpayLink: 'https://rzp.io/l/neonchat-avatar89' },
        { id: 18, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=8', name: 'Digital Phantom', category: 'premium', price: 129, razorpayLink: 'https://rzp.io/l/neonchat-avatar129' },
        { id: 19, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=9', name: 'Tech Wizard', category: 'premium', price: 129, razorpayLink: 'https://rzp.io/l/neonchat-avatar129' },
        { id: 20, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=10', name: 'Cyber Queen', category: 'premium', price: 149, razorpayLink: 'https://rzp.io/l/neonchat-avatar149' },
        
        // More premium avatars with different prices
        { id: 21, url: 'https://api.dicebear.com/7.x/bottts/svg?seed=1', name: 'Robot 1', category: 'premium', price: 49, razorpayLink: 'https://rzp.io/l/neonchat-avatar49' },
        { id: 22, url: 'https://api.dicebear.com/7.x/bottts/svg?seed=2', name: 'Robot 2', category: 'premium', price: 49, razorpayLink: 'https://rzp.io/l/neonchat-avatar49' },
        { id: 23, url: 'https://api.dicebear.com/7.x/bottts/svg?seed=3', name: 'Robot 3', category: 'premium', price: 49, razorpayLink: 'https://rzp.io/l/neonchat-avatar49' },
        { id: 24, url: 'https://api.dicebear.com/7.x/bottts/svg?seed=4', name: 'Robot 4', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-avatar39' },
        { id: 25, url: 'https://api.dicebear.com/7.x/bottts/svg?seed=5', name: 'Robot 5', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-avatar39' },
        
        // Ultra Premium Avatars
        { id: 26, url: 'https://api.dicebear.com/7.x/micah/svg?seed=1', name: 'Ultra Warrior', category: 'premium', price: 499, razorpayLink: 'https://rzp.io/l/neonchat-avatar499' },
        { id: 27, url: 'https://api.dicebear.com/7.x/micah/svg?seed=2', name: 'Mega Explorer', category: 'premium', price: 499, razorpayLink: 'https://rzp.io/l/neonchat-avatar499' },
        { id: 28, url: 'https://api.dicebear.com/7.x/micah/svg?seed=3', name: 'Super Ninja', category: 'premium', price: 1099, razorpayLink: 'https://rzp.io/l/neonchat-avatar1099' },
        { id: 29, url: 'https://api.dicebear.com/7.x/micah/svg?seed=4', name: 'Legend Samurai', category: 'premium', price: 1099, razorpayLink: 'https://rzp.io/l/neonchat-avatar1099' },
        { id: 30, url: 'https://api.dicebear.com/7.x/micah/svg?seed=5', name: 'Epic Hero', category: 'premium', price: 3099, razorpayLink: 'https://rzp.io/l/neonchat-avatar3099' },
        
        // Exclusive Avatars
        { id: 31, url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=1', name: 'Pixel Warrior', category: 'premium', price: 29999, razorpayLink: 'https://rzp.io/l/neonchat-avatar29999' },
        { id: 32, url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=2', name: 'Pixel Queen', category: 'premium', price: 29999, razorpayLink: 'https://rzp.io/l/neonchat-avatar29999' }
        
    ];
    
    localStorage.setItem('neonchat_avatars', JSON.stringify(avatars));
}

function loadAvatarsStore(category = 'all') {
    const avatars = JSON.parse(localStorage.getItem('neonchat_avatars') || '[]');
    const avatarsGrid = elements.avatarsGrid;
    avatarsGrid.innerHTML = '';
    
    const filteredAvatars = category === 'all' ? avatars : avatars.filter(avatar => avatar.category === category);
    
    if (filteredAvatars.length === 0) {
        avatarsGrid.innerHTML = '<div class="no-avatars">No avatars found in this category.</div>';
        return;
    }
    
    filteredAvatars.forEach(avatar => {
        const isOwned = userAvatars.some(owned => owned === avatar.id);
        const avatarItem = document.createElement('div');
        avatarItem.className = `avatar-item ${isOwned ? 'owned' : ''} ${avatar.category === 'premium' || avatar.category === '3d' || avatar.category === 'anime' || avatar.category === 'live' || avatar.category === 'ultra' || avatar.category === 'special' ? 'premium' : ''}`;
        avatarItem.innerHTML = `
            <img src="${avatar.url}" alt="${avatar.name}" class="clickable-profile-pic avatar-3d">
            <span>${isOwned ? 'OWNED' : (avatar.category === 'free' ? 'FREE' : `₹${avatar.price}`)}</span>
        `;
        
        if (!isOwned) {
            avatarItem.addEventListener('click', () => showPurchaseModal(avatar, 'avatar'));
        } else {
            avatarItem.addEventListener('click', () => setUserAvatar(avatar.url));
        }
        
        avatarsGrid.appendChild(avatarItem);
    });
}

function loadMyAvatars() {
    const avatars = JSON.parse(localStorage.getItem('neonchat_avatars') || '[]');
    const myAvatarsGrid = elements.myAvatarsGrid;
    myAvatarsGrid.innerHTML = '';
    
    const ownedAvatars = avatars.filter(avatar => 
        userAvatars.some(owned => owned === avatar.id)
    );
    
    if (ownedAvatars.length === 0) {
        myAvatarsGrid.innerHTML = '<div class="no-avatars">You don\'t have any avatars yet. Visit the store to buy some!</div>';
        return;
    }
    
    ownedAvatars.forEach(avatar => {
        const avatarItem = document.createElement('div');
        avatarItem.className = 'avatar-item owned';
        avatarItem.innerHTML = `
            <img src="${avatar.url}" alt="${avatar.name}" class="clickable-profile-pic avatar-3d">
            <span>OWNED</span>
        `;
        avatarItem.addEventListener('click', () => setUserAvatar(avatar.url));
        myAvatarsGrid.appendChild(avatarItem);
    });
    
    // Update owned avatars count
    if (elements.ownedAvatarsCount) {
        elements.ownedAvatarsCount.textContent = ownedAvatars.length;
    }
}

async function setUserAvatar(avatarUrl) {
    try {
        await db.collection('users').doc(currentUser.uid).update({
            avatar: avatarUrl
        });
        
        elements.profilePic.src = avatarUrl;
        elements.settingsProfilePic.src = avatarUrl;
        
        alert('Avatar applied successfully!');
        
    } catch (error) {
        console.error('Error setting avatar:', error);
        alert('Error setting avatar. Please try again.');
    }
}

// Theme Colors - ONLY 3 COLORS: Orange, Green, Pink Neon
function initializeThemes() {
    const themes = [
        // Free Theme
        { id: 'default', color: '#ff00de', name: 'Neon Pink', category: 'free', price: 0, razorpayLink: '' },
        
        // Premium Themes with Razorpay Links
        { id: 'orange', color: '#ff9f43', name: 'Orange Crush', category: 'premium', price: 99, razorpayLink: 'https://rzp.io/l/neonchat-theme99' },
        { id: 'green', color: '#00ff00', name: 'Neon Green', category: 'premium', price: 99, razorpayLink: 'https://rzp.io/l/neonchat-theme99' }
    ];
    
    localStorage.setItem('neonchat_themes', JSON.stringify(themes));
}

function loadThemesStore(category = 'all') {
    const themes = JSON.parse(localStorage.getItem('neonchat_themes') || '[]');
    const themesGrid = elements.themesGrid;
    if (!themesGrid) return;
    
    themesGrid.innerHTML = '';
    
    const filteredThemes = category === 'all' ? themes : themes.filter(theme => theme.category === category);
    
    if (filteredThemes.length === 0) {
        themesGrid.innerHTML = '<div class="no-stickers">No themes found in this category.</div>';
        return;
    }
    
    filteredThemes.forEach(theme => {
        const isOwned = userThemeColors.some(owned => owned === theme.id);
        const themeItem = document.createElement('div');
        themeItem.className = `theme-color-item ${isOwned ? 'owned' : ''} ${theme.category === 'premium' ? 'premium' : ''}`;
        themeItem.dataset.color = theme.color;
        themeItem.dataset.themeId = theme.id;
        themeItem.innerHTML = `
            <div class="color-preview" style="background: ${theme.color};"></div>
            <span>${theme.name}</span>
            <div class="premium-badge">${isOwned ? 'OWNED' : (theme.category === 'free' ? 'FREE' : `₹${theme.price}`)}</div>
        `;
        
        if (!isOwned) {
            themeItem.addEventListener('click', () => showPurchaseModal(theme, 'theme'));
        } else {
            themeItem.addEventListener('click', () => applyThemeColor(theme.color, theme.id));
        }
        
        themesGrid.appendChild(themeItem);
    });
}

function loadMyThemes() {
    const themes = JSON.parse(localStorage.getItem('neonchat_themes') || '[]');
    const myThemesGrid = elements.myThemesGrid;
    if (!myThemesGrid) return;
    
    myThemesGrid.innerHTML = '';
    
    const ownedThemes = themes.filter(theme => 
        userThemeColors.some(owned => owned === theme.id)
    );
    
    if (ownedThemes.length === 0) {
        myThemesGrid.innerHTML = '<div class="no-stickers">You don\'t have any themes yet. Visit the store to buy some!</div>';
        return;
    }
    
    ownedThemes.forEach(theme => {
        const themeItem = document.createElement('div');
        themeItem.className = 'theme-color-item owned';
        themeItem.dataset.color = theme.color;
        themeItem.innerHTML = `
            <div class="color-preview" style="background: ${theme.color};"></div>
            <span>${theme.name}</span>
            <div class="premium-badge">OWNED</div>
        `;
        themeItem.addEventListener('click', () => applyThemeColor(theme.color, theme.id));
        myThemesGrid.appendChild(themeItem);
    });
    
    // Update owned themes count
    if (elements.ownedThemesCount) {
        elements.ownedThemesCount.textContent = ownedThemes.length;
    }
}

function applyThemeColor(color, themeId = null) {
    document.documentElement.style.setProperty('--neon-primary', color);
    
    // Save to user preferences
    if (currentUser) {
        const updateData = {
            currentThemeColor: color
        };
        
        // If themeId is provided and user doesn't own it yet, add it to their collection
        if (themeId && !userThemeColors.includes(themeId)) {
            updateData.themeColors = firebase.firestore.FieldValue.arrayUnion(themeId);
            userThemeColors.push(themeId);
        }
        
        db.collection('users').doc(currentUser.uid).update(updateData).catch(error => {
            console.error('Error saving theme color:', error);
        });
    }
    
    // Show success message
    const themes = JSON.parse(localStorage.getItem('neonchat_themes') || '[]');
    const theme = themes.find(t => t.color === color);
    if (theme) {
        showNotification(`Theme "${theme.name}" applied successfully!`);
    }
}

// Sticker Functions
function initializeStickers() {
    const stickers = [
        // Free Stickers (10)
        { id: 1, text: '😊', name: 'Smile', category: 'free', price: 0 },
        { id: 2, text: '😂', name: 'Laugh', category: 'free', price: 0 },
        { id: 3, text: '❤️', name: 'Heart', category: 'free', price: 0 },
        { id: 4, text: '🔥', name: 'Fire', category: 'free', price: 0 },
        { id: 5, text: '🎉', name: 'Party', category: 'free', price: 0 },
        { id: 6, text: '👍', name: 'Thumbs Up', category: 'free', price: 0 },
        { id: 7, text: '👋', name: 'Wave', category: 'free', price: 0 },
        { id: 8, text: '💯', name: '100', category: 'free', price: 0 },
        { id: 9, text: '😎', name: 'Cool', category: 'free', price: 0 },
        { id: 10, text: '🤩', name: 'Star Eyes', category: 'free', price: 0 },
        
        // Premium Stickers (90) - All priced at 29 INR
        { id: 11, text: '🥳', name: 'Celebration', category: 'premium', price: 29 },
        { id: 12, text: '😍', name: 'Love', category: 'premium', price: 29 },
        { id: 13, text: '🤗', name: 'Hug', category: 'premium', price: 29 },
        { id: 14, text: '😇', name: 'Angel', category: 'premium', price: 29 },
        { id: 15, text: '🤠', name: 'Cowboy', category: 'premium', price: 29 },
        // ... (continue with all 100 stickers)
        { id: 100, text: '🤽', name: 'Water Polo', category: 'premium', price: 29 }
    ];
    
    localStorage.setItem('neonchat_stickers', JSON.stringify(stickers));
}

function loadStickersStore(category = 'all') {
    const stickers = JSON.parse(localStorage.getItem('neonchat_stickers') || '[]');
    const stickersGrid = elements.stickersGrid;
    
    if (!stickersGrid) return;
    
    stickersGrid.innerHTML = '';
    
    const filteredStickers = category === 'all' ? stickers : stickers.filter(sticker => sticker.category === category);
    
    if (filteredStickers.length === 0) {
        stickersGrid.innerHTML = '<div class="no-stickers">No stickers found in this category.</div>';
        return;
    }
    
    filteredStickers.forEach(sticker => {
        const isOwned = userStickers.some(owned => owned === sticker.id);
        const priceClass = sticker.category === 'free' ? 'free' : 'premium';
        const stickerItem = document.createElement('div');
        stickerItem.className = `sticker-store-item ${isOwned ? 'owned' : ''} ${sticker.category === 'premium' ? 'premium' : ''}`;
        stickerItem.innerHTML = `
            <div class="sticker-circle">${sticker.text}</div>
            <div class="sticker-price ${priceClass}">
                ${isOwned ? 'OWNED' : (sticker.category === 'free' ? 'FREE' : `₹${sticker.price}`)}
            </div>
            <div class="sticker-name">${sticker.name}</div>
        `;
        
        if (!isOwned) {
            stickerItem.addEventListener('click', () => showPurchaseModal(sticker, 'sticker'));
        } else {
            stickerItem.addEventListener('click', () => {
                sendSticker(sticker.text);
            });
        }
        
        stickersGrid.appendChild(stickerItem);
    });
}

function loadMyStickers() {
    const stickers = JSON.parse(localStorage.getItem('neonchat_stickers') || '[]');
    const myStickersGrid = elements.myStickersGrid;
    
    if (!myStickersGrid) return;
    
    myStickersGrid.innerHTML = '';
    
    const ownedStickers = stickers.filter(sticker => 
        userStickers.some(owned => owned === sticker.id)
    );
    
    if (ownedStickers.length === 0) {
        myStickersGrid.innerHTML = '<div class="no-stickers">You don\'t have any stickers yet. Visit the store to buy some!</div>';
        return;
    }
    
    ownedStickers.forEach(sticker => {
        const stickerItem = document.createElement('div');
        stickerItem.className = 'sticker-store-item owned';
        stickerItem.innerHTML = `
            <div class="sticker-circle">${sticker.text}</div>
            <div class="sticker-price free">OWNED</div>
            <div class="sticker-name">${sticker.name}</div>
        `;
        stickerItem.addEventListener('click', () => {
            sendSticker(sticker.text);
        });
        myStickersGrid.appendChild(stickerItem);
    });
    
    // Update owned stickers count
    if (elements.ownedStickersCount) {
        elements.ownedStickersCount.textContent = ownedStickers.length;
    }
}

function toggleStickerPanel() {
    elements.stickerPanel.classList.toggle('hidden');
    if (!elements.stickerPanel.classList.contains('hidden')) {
        loadStickerPanel();
    }
}

function loadStickerPanel() {
    const stickersContainer = elements.stickersContainer;
    stickersContainer.innerHTML = '';
    
    const ownedStickers = userStickers;
    
    if (ownedStickers.length === 0) {
        stickersContainer.innerHTML = '<div class="no-stickers">No stickers available. Buy some sticker packs!</div>';
        return;
    }
    
    const stickers = JSON.parse(localStorage.getItem('neonchat_stickers') || '[]');
    const ownedStickerData = stickers.filter(sticker => 
        ownedStickers.some(owned => owned === sticker.id)
    );
    
    ownedStickerData.forEach(sticker => {
        const stickerItem = document.createElement('div');
        stickerItem.className = 'sticker-item';
        stickerItem.innerHTML = `<div class="sticker-circle">${sticker.text}</div>`;
        stickerItem.addEventListener('click', () => {
            sendSticker(sticker.text);
            elements.stickerPanel.classList.add('hidden');
        });
        stickersContainer.appendChild(stickerItem);
    });
}

async function sendSticker(sticker) {
    if (!currentChatId) return;
    
    try {
        const message = {
            text: sticker,
            senderId: currentUser.uid,
            senderName: currentUser.displayName || "User",
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            readBy: [currentUser.uid],
            type: 'sticker'
        };
        
        if (currentChatType === 'individual') {
            await db.collection('chats').doc(currentChatId).collection('messages').add(message);
            await db.collection('chats').doc(currentChatId).update({
                lastMessage: '🎨 Sticker',
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            });
        } else {
            await db.collection('groups').doc(currentChatId).collection('messages').add(message);
            await db.collection('groups').doc(currentChatId).update({
                lastMessage: '🎨 Sticker',
                lastMessageTime: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        
    } catch (error) {
        console.error('Error sending sticker:', error);
    }
}

// Enhanced Payment System with 3-Second Verification for ALL ITEMS
function showPurchaseModal(item, type) {
    currentPurchaseItem = { ...item, purchaseType: type };
    
    let detailsHTML = '';
    if (type === 'avatar') {
        detailsHTML = `
            <h3>Purchase Avatar</h3>
            <img src="${item.url}" alt="${item.name}" style="width: 100px; height: 100px; border-radius: 50%; margin: 10px 0;">
            <p><strong>${item.name}</strong></p>
            <p>${item.category === 'free' ? 'Free Avatar' : 'Premium Avatar'}</p>
            <div class="price" style="font-size: 1.5rem; font-weight: bold; color: var(--neon-primary); margin: 10px 0;">
                ${item.category === 'free' ? 'FREE' : `₹${item.price}`}
            </div>
        `;
    } else if (type === 'sticker') {
        detailsHTML = `
            <h3>Purchase Sticker</h3>
            <div class="sticker-circle" style="font-size: 3rem; margin: 10px 0;">${item.text}</div>
            <p><strong>${item.name}</strong></p>
            <p>${item.category === 'free' ? 'Free Sticker' : 'Premium Sticker'}</p>
            <div class="price" style="font-size: 1.5rem; font-weight: bold; color: var(--neon-primary); margin: 10px 0;">
                ${item.category === 'free' ? 'FREE' : `₹${item.price}`}
            </div>
        `;
    } else if (type === 'theme') {
        detailsHTML = `
            <h3>Purchase Theme Color</h3>
            <div class="color-preview" style="width: 80px; height: 80px; background: ${item.color}; margin: 10px auto; border-radius: 10px;"></div>
            <p><strong>${item.name}</strong></p>
            <p>${item.category === 'free' ? 'Free Theme' : 'Premium Theme'}</p>
            <div class="price" style="font-size: 1.5rem; font-weight: bold; color: var(--neon-primary); margin: 10px 0;">
                ${item.category === 'free' ? 'FREE' : `₹${item.price}`}
            </div>
        `;
    }
    
    elements.purchaseDetails.innerHTML = detailsHTML;
    elements.purchaseModal.classList.add('active');
}

async function confirmPurchase() {
    if (!currentPurchaseItem) return;
  
    try {
        // Free items
        if (currentPurchaseItem.category === 'free' || currentPurchaseItem.price === 0) {
            await addToCollection(currentPurchaseItem);
            showPaymentSuccess(`${currentPurchaseItem.purchaseType === 'avatar' ? 'Avatar' : currentPurchaseItem.purchaseType === 'sticker' ? 'Sticker' : 'Theme'} unlocked successfully!`);
            return;
        }
  
        // Paid items - redirect to Razorpay
        const price = currentPurchaseItem.price;
        let paymentUrl = currentPurchaseItem.razorpayLink || "https://rzp.io/l/neonchat-premium";

        // Create payment verification record
        const paymentRecord = {
            userId: currentUser.uid,
            itemId: currentPurchaseItem.id,
            itemName: currentPurchaseItem.name,
            itemType: currentPurchaseItem.purchaseType,
            amount: price,
            status: 'pending',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            razorpayOrderId: 'pending'
        };

        // Save payment record to Firestore
        const paymentRef = await db.collection('payments').add(paymentRecord);
        
        const paymentLink = `${paymentUrl}?uid=${currentUser.uid}&item=${encodeURIComponent(currentPurchaseItem.name)}&paymentId=${paymentRef.id}`;
  
        if (confirm(`Redirecting to payment page. Complete the payment of ₹${price} to get ${currentPurchaseItem.name}`)) {
            // Open payment in new tab
            const paymentWindow = window.open(paymentLink, "_blank");
            
            // Start 3-second payment verification
            startQuickPaymentVerification(paymentRef.id, currentPurchaseItem, paymentWindow);
        }
  
    } catch (error) {
        console.error('Error processing purchase:', error);
        showPaymentFailed();
    }
}

// Fast 3-second Payment Verification System
async function startQuickPaymentVerification(paymentId, item, paymentWindow) {
    const totalTime = 3000; // 3 seconds total
    const intervalTime = 500; // Check every 500ms
    const maxAttempts = totalTime / intervalTime; // 6 attempts
    
    let attempts = 0;
    
    // Show loading state
    elements.confirmPurchaseBtn.innerHTML = '<div class="loading"></div> Verifying Payment...';
    elements.confirmPurchaseBtn.disabled = true;
    
    const checkInterval = setInterval(async () => {
        attempts++;
        
        try {
            const paymentDoc = await db.collection('payments').doc(paymentId).get();
            
            if (paymentDoc.exists) {
                const paymentData = paymentDoc.data();
                
                if (paymentData.status === 'completed') {
                    clearInterval(checkInterval);
                    // Payment successful - unlock the item
                    await addToCollection(item);
                    showPaymentSuccess(`${item.name} unlocked successfully!`);
                    
                    // Reset button state
                    elements.confirmPurchaseBtn.innerHTML = 'Confirm Purchase';
                    elements.confirmPurchaseBtn.disabled = false;
                    return;
                } else if (paymentData.status === 'failed') {
                    clearInterval(checkInterval);
                    showPaymentFailed();
                    
                    // Reset button state
                    elements.confirmPurchaseBtn.innerHTML = 'Confirm Purchase';
                    elements.confirmPurchaseBtn.disabled = false;
                    return;
                }
            }
            
            // Show progress to user
            const progress = Math.min((attempts / maxAttempts) * 100, 100);
            elements.confirmPurchaseBtn.innerHTML = `<div class="loading"></div> Verifying... ${Math.round(progress)}%`;
            
            // Stop checking after 3 seconds (6 attempts)
            if (attempts >= maxAttempts) {
                clearInterval(checkInterval);
                
                // Final check
                const finalCheck = await db.collection('payments').doc(paymentId).get();
                if (finalCheck.exists && finalCheck.data().status === 'completed') {
                    await addToCollection(item);
                    showPaymentSuccess(`${item.name} unlocked successfully!`);
                } else {
                    // Check if payment window is still open
                    if (paymentWindow && !paymentWindow.closed) {
                        // Payment still in process
                        showPaymentPending();
                    } else {
                        // Payment window closed but no success
                        showPaymentFailed('Payment not completed. Please try again.');
                    }
                }
                
                // Reset button state
                elements.confirmPurchaseBtn.innerHTML = 'Confirm Purchase';
                elements.confirmPurchaseBtn.disabled = false;
            }
        } catch (error) {
            console.error('Error checking payment status:', error);
            if (attempts >= maxAttempts) {
                clearInterval(checkInterval);
                showPaymentFailed('Payment verification error. Please contact support.');
                
                // Reset button state
                elements.confirmPurchaseBtn.innerHTML = 'Confirm Purchase';
                elements.confirmPurchaseBtn.disabled = false;
            }
        }
    }, intervalTime); // Check every 500ms
}

// Setup Payment Monitoring
function setupPaymentMonitoring() {
    if (!currentUser) return;
    
    const paymentsUnsubscribe = db.collection('payments')
        .where('userId', '==', currentUser.uid)
        .where('status', 'in', ['pending', 'completed'])
        .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'modified') {
                    const paymentData = change.doc.data();
                    if (paymentData.status === 'completed') {
                        // Refresh user data to show purchased items
                        loadUserData();
                    }
                }
            });
        });
    
    unsubscribeFunctions.push(paymentsUnsubscribe);
}

function showPaymentSuccess(message) {
    elements.purchaseModal.classList.remove('active');
    const successMessage = document.getElementById('success-message');
    if (successMessage) {
        successMessage.textContent = message;
    }
    openModal(elements.paymentSuccessModal);
    
    // Refresh user data
    loadUserData();
    
    // Auto close after 3 seconds
    setTimeout(() => {
        elements.paymentSuccessModal.classList.remove('active');
    }, 3000);
}

function showPaymentFailed(errorMessage = 'Payment failed. Please try again.') {
    elements.purchaseModal.classList.remove('active');
    const failedMessage = document.getElementById('failed-message');
    if (failedMessage) {
        failedMessage.textContent = errorMessage;
    }
    openModal(elements.paymentFailedModal);
    
    // Reset button state
    elements.confirmPurchaseBtn.innerHTML = 'Confirm Purchase';
    elements.confirmPurchaseBtn.disabled = false;
}

function showPaymentPending() {
    elements.purchaseModal.classList.remove('active');
    alert('Payment is still processing. Your item will be unlocked automatically once payment is confirmed.');
    
    // Reset button state
    elements.confirmPurchaseBtn.innerHTML = 'Confirm Purchase';
    elements.confirmPurchaseBtn.disabled = false;
}

// Add to Collection
async function addToCollection(item) {
    try {
        let updateData = {};
        let purchaseRecord = {
            itemId: item.id,
            itemName: item.name,
            itemType: item.purchaseType,
            amount: item.price || 0,
            timestamp: new Date().toISOString()
        };
        
        if (item.purchaseType === 'avatar') {
            updateData = {
                avatars: firebase.firestore.FieldValue.arrayUnion(item.id)
            };
            userAvatars.push(item.id);
        } else if (item.purchaseType === 'sticker') {
            updateData = {
                stickers: firebase.firestore.FieldValue.arrayUnion(item.id)
            };
            userStickers.push(item.id);
        } else if (item.purchaseType === 'theme') {
            updateData = {
                themeColors: firebase.firestore.FieldValue.arrayUnion(item.id)
            };
            userThemeColors.push(item.id);
            // Apply the theme immediately after purchase
            applyThemeColor(item.color, item.id);
        }
        
        // Add purchase record
        updateData.purchases = firebase.firestore.FieldValue.arrayUnion(purchaseRecord);
        userPurchases.push(purchaseRecord);
        
        await db.collection('users').doc(currentUser.uid).update(updateData);
        
        // Refresh the relevant store
        if (item.purchaseType === 'avatar') {
            loadAvatarsStore();
            loadMyAvatars();
        } else if (item.purchaseType === 'sticker') {
            loadStickersStore();
            loadMyStickers();
            loadStickerPanel();
        } else if (item.purchaseType === 'theme') {
            loadThemesStore();
            loadMyThemes();
        }
        
        // Update profile view
        updateEnhancedStats();
        loadPurchaseHistory();
        
    } catch (error) {
        console.error('Error adding to collection:', error);
        throw error;
    }
}

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Referral System
function openReferralModal() {
    openModal(elements.referralModal);
    toggleProfileMenu();
}

async function processReferral(referralCode) {
    try {
        // Find user with this referral code
        const usersSnapshot = await db.collection('users')
            .where('referralCode', '==', referralCode)
            .get();
        
        if (!usersSnapshot.empty) {
            const referrerDoc = usersSnapshot.docs[0];
            const referrerId = referrerDoc.id;
            
            if (referrerId === currentUser.uid) {
                alert("You can't use your own referral code!");
                return;
            }
            
            // Update current user's referredBy field
            await db.collection('users').doc(currentUser.uid).update({
                referredBy: referrerId
            });
            
            // Update referrer's referrals
            await db.collection('users').doc(referrerId).update({
                referrals: firebase.firestore.FieldValue.arrayUnion({
                    userId: currentUser.uid,
                    username: currentUser.displayName || "New User",
                    joinedAt: new Date().toISOString()
                }),
                referralRewards: firebase.firestore.FieldValue.increment(1),
                coins: firebase.firestore.FieldValue.increment(50)
            });
            
            // Award rewards to both users
            await awardReferralRewards(currentUser.uid);
            await awardReferralRewards(referrerId);
            
            alert('🎉 Referral applied! You both received rewards!');
        } else {
            alert('Invalid referral code.');
        }
    } catch (error) {
        console.error('Error processing referral:', error);
    }
}

async function awardReferralRewards(userId) {
    try {
        await db.collection('users').doc(userId).update({
            coins: firebase.firestore.FieldValue.increment(50)
        });
        
        // Award random premium avatar
        const premiumAvatars = [11, 12, 13, 14, 15];
        const randomAvatarId = premiumAvatars[Math.floor(Math.random() * premiumAvatars.length)];
        
        await db.collection('users').doc(userId).update({
            avatars: firebase.firestore.FieldValue.arrayUnion(randomAvatarId)
        });
    } catch (error) {
        console.error('Error awarding referral rewards:', error);
    }
}

function shareReferralLink() {
    const referralCode = elements.userReferralCode.textContent;
    const shareText = `Join me on NeonChat! Use my referral code: ${referralCode} to get free premium rewards! Download at: https://neonchat.com`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Join NeonChat',
            text: shareText,
            url: 'https://becomebillionaire.shop/'
        });
    } else {
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Referral message copied to clipboard!');
        });
    }
}

// Stories System
async function openStoryUploadModal() {
    openModal(elements.storyUploadModal);
    await loadUserMedia();
}

async function loadUserMedia() {
    // This is a simplified version - in a real app, you'd need proper media access
    const grid = elements.storyMediaGrid;
    grid.innerHTML = '<div class="no-stickers">Loading your media...</div>';
    
    // Simulate loading media (in a real app, you'd access device storage)
    setTimeout(() => {
        grid.innerHTML = `
            <div class="story-media-item" onclick="selectStoryMedia('https://picsum.photos/300/300?random=1', 'image')">
                <img src="https://picsum.photos/300/300?random=1" alt="Media">
            </div>
            <div class="story-media-item" onclick="selectStoryMedia('https://picsum.photos/300/300?random=2', 'image')">
                <img src="https://picsum.photos/300/300?random=2" alt="Media">
            </div>
            <div class="story-media-item" onclick="selectStoryMedia('https://picsum.photos/300/300?random=3', 'image')">
                <img src="https://picsum.photos/300/300?random=3" alt="Media">
            </div>
        `;
    }, 1000);
}

function selectStoryMedia(mediaUrl, mediaType) {
    selectedStoryMedia = { url: mediaUrl, type: mediaType };
    
    const previewSection = elements.storyPreviewSection;
    const imagePreview = elements.storyPreviewImage;
    const videoPreview = elements.storyPreviewVideo;
    
    if (mediaType === 'image') {
        imagePreview.src = mediaUrl;
        imagePreview.style.display = 'block';
        videoPreview.style.display = 'none';
    } else {
        videoPreview.src = mediaUrl;
        videoPreview.style.display = 'block';
        imagePreview.style.display = 'none';
    }
    
    previewSection.classList.remove('hidden');
}

async function postStory() {
    if (!selectedStoryMedia) return;
    
    try {
        const storyData = {
            userId: currentUser.uid,
            username: currentUser.displayName || "User",
            mediaUrl: selectedStoryMedia.url,
            mediaType: selectedStoryMedia.type,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours expiry
        };
        
        await db.collection('stories').add(storyData);
        closeAllModals();
        loadStoriesRealtime();
        alert('Story posted successfully!');
        
    } catch (error) {
        alert('Error posting story: ' + error.message);
    }
}



function viewStory(story, userData) {
    const viewer = elements.storyViewerModal;
    const image = elements.viewerStoryImage;
    const video = elements.viewerStoryVideo;
    
    if (story.mediaType === "image") {
        image.src = story.mediaUrl;
        image.style.display = "block";
        video.style.display = "none";
    } else {
        video.src = story.mediaUrl;
        video.style.display = "block";
        image.style.display = "none";
    }
    
    // Load user info
    elements.viewerProfilePic.src = userData.avatar;
    elements.viewerUsername.textContent = userData.name;
    elements.viewerTime.textContent = formatStoryTime(story.timestamp?.toDate());
    
    openModal(elements.storyViewerModal);
}

function formatStoryTime(timestamp) {
    if (!timestamp) return '';
    const now = new Date();
    const diff = now - timestamp;
    const hours = Math.floor(diff / 3600000);
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return timestamp.toLocaleDateString();
}

function showPreviousStory() {
    // Implementation for showing previous story
    alert('Previous story feature');
}

function showNextStory() {
    // Implementation for showing next story
    alert('Next story feature');
}

// Open Profile Picture Viewer
function openProfilePictureViewer(imageSrc) {
    elements.fullscreenProfilePic.src = imageSrc;
    elements.profilePicModal.classList.add('active');
}

// Utility Functions
function formatChatTime(timestamp) {
    if (!timestamp) return '';
    const now = new Date();
    const messageTime = timestamp.toDate();
    const diff = now - messageTime;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return messageTime.toLocaleDateString();
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

// Handle app visibility change to update online status
document.addEventListener('visibilitychange', async () => {
    if (currentUser) {
        const status = document.hidden ? 'away' : 'online';
        await db.collection('users').doc(currentUser.uid).update({
            status: status,
            lastSeen: firebase.firestore.FieldValue.serverTimestamp()
        });
    }
});

// Handle beforeunload to set offline status
window.addEventListener('beforeunload', async () => {
    if (currentUser) {
        await db.collection('users').doc(currentUser.uid).update({
            status: 'offline',
            lastSeen: firebase.firestore.FieldValue.serverTimestamp()
        });
    }
});
