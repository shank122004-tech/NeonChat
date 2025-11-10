// app.js - Complete Enhanced Version with Optional Username on Signup

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
let currentChatTheme = 'default';

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
    chatThemeModal: document.getElementById('chat-theme-modal'),
    
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
    chatThemeBtn: document.getElementById('chat-theme-btn'),
    
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
    
    // Chat Themes
    chatThemesGrid: document.getElementById('chat-themes-grid'),
    customThemeUpload: document.getElementById('custom-theme-upload'),
    customThemeInput: document.getElementById('custom-theme-input'),
    uploadThemeBtn: document.getElementById('upload-theme-btn'),
    
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
    elements.chatThemeBtn.addEventListener('click', openChatThemeModal);
    
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
    
    // Chat Themes
    document.querySelectorAll('.chat-theme-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const theme = e.currentTarget.dataset.theme;
            if (theme === 'custom') {
                elements.customThemeUpload.style.display = 'block';
            } else {
                applyChatTheme(theme);
                elements.chatThemeModal.classList.remove('active');
            }
        });
    });
    
    elements.uploadThemeBtn.addEventListener('click', () => {
        elements.customThemeInput.click();
    });
    
    elements.customThemeInput.addEventListener('change', handleCustomThemeUpload);
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

// Ensure User Document Exists - MODIFIED: No username required on signup
async function ensureUserDocument(user) {
    const userRef = db.collection('users').doc(user.uid);
    const snap = await userRef.get();
    
    if (!snap.exists) {
        const referralCode = generateReferralCode();
        // Generate a unique username automatically
        let username = "user" + Math.random().toString(36).substr(2, 8);
        
        // Check if username is available, if not, generate a unique one
        let usernameAvailable = await checkUsernameAvailability(username);
        let counter = 1;
        while (!usernameAvailable && counter < 100) {
            username = "user" + Math.random().toString(36).substr(2, 8);
            usernameAvailable = await checkUsernameAvailability(username);
            counter++;
        }
        
        await userRef.set({
            name: user.displayName || "New User",
            username: username,
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
    
    // Load chats with real-time updates - Chats persist permanently
    loadChatsRealtime();
    
    // Load stories with real-time updates
    loadStoriesRealtime();
}

// Enhanced Chat System - Permanent Storage with Delete Option
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

// Update the delete chat button in updateChatsListRealtime function
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
                chatItem.dataset.chatId = doc.id;
                chatItem.innerHTML = `
                    <img src="${userData.avatar}" alt="${userData.name}" class="clickable-profile-pic">
                    <div class="chat-info">
                        <h4>${userData.name}</h4>
                        <p>${chat.lastMessage || 'No messages yet'}</p>
                    </div>
                    <div class="chat-time">${formatChatTime(chat.lastUpdated)}</div>
                    <button class="delete-chat-btn cosmic-delete" data-chat-id="${doc.id}">
                        <i class="fas fa-meteor"></i>
                    </button>
                `;
                chatItem.addEventListener('click', (e) => {
                    if (!e.target.closest('.delete-chat-btn')) {
                        startChat(partnerId, userData);
                    }
                });
                
                // Add delete functionality with asteroid animation
                const deleteBtn = chatItem.querySelector('.delete-chat-btn');
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    deleteChat(doc.id);
                });
                
                chatsList.appendChild(chatItem);
            }
        } catch (error) {
            console.error('Error loading chat user:', error);
        }
    });
}
// Enhanced Delete Chat with Asteroid Animation
async function deleteChat(chatId) {
    if (confirm('Are you sure you want to delete this chat? All messages will be permanently deleted.')) {
        try {
            // Find the chat item element
            const chatItem = document.querySelector(`[data-chat-id="${chatId}"]`) || 
                           document.querySelector(`.delete-chat-btn[data-chat-id="${chatId}"]`)?.closest('.chat-item');
            
            if (chatItem) {
                // Create asteroid animation
                createAsteroidAnimation(chatItem);
                
                // Wait for animation to complete
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Delete all messages in the chat
                const messagesSnapshot = await db.collection('chats').doc(chatId).collection('messages').get();
                const batch = db.batch();
                messagesSnapshot.forEach(doc => {
                    batch.delete(doc.ref);
                });
                await batch.commit();
                
                // Delete the chat document
                await db.collection('chats').doc(chatId).delete();
                
                showNotification('Chat deleted successfully with cosmic destruction! 🌠');
            }
        } catch (error) {
            console.error('Error deleting chat:', error);
            showNotification('Error deleting chat', 'error');
        }
    }
}

// Create Asteroid Animation
function createAsteroidAnimation(chatItem) {
    const rect = chatItem.getBoundingClientRect();
    const asteroid = document.createElement('div');
    asteroid.className = 'asteroid';
    asteroid.innerHTML = '💥';
    
    // Position asteroid outside viewport
    asteroid.style.cssText = `
        position: fixed;
        font-size: 3rem;
        z-index: 10000;
        pointer-events: none;
        top: -100px;
        right: -100px;
        transform-origin: center;
        animation: asteroidCrash 1.5s ease-in-out forwards;
    `;
    
    document.body.appendChild(asteroid);
    
    // Add explosion effect
    setTimeout(() => {
        createExplosionEffect(chatItem);
        chatItem.style.animation = 'chatDestruction 1s ease-in-out forwards';
    }, 1000);
    
    // Clean up
    setTimeout(() => {
        asteroid.remove();
    }, 2000);
}

// Create Explosion Effect
function createExplosionEffect(chatItem) {
    const rect = chatItem.getBoundingClientRect();
    const explosion = document.createElement('div');
    explosion.className = 'explosion';
    explosion.innerHTML = '✨';
    
    explosion.style.cssText = `
        position: fixed;
        font-size: 4rem;
        z-index: 9999;
        pointer-events: none;
        left: ${rect.left + rect.width/2}px;
        top: ${rect.top + rect.height/2}px;
        transform: translate(-50%, -50%);
        animation: explosionEffect 1s ease-out forwards;
    `;
    
    document.body.appendChild(explosion);
    
    setTimeout(() => {
        explosion.remove();
    }, 1000);
}

// Enhanced Story System - Real Firebase Integration
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
                const story = { id: doc.id, ...doc.data() };
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

// Display Story
function displayStory(story, userData) {
    const storiesContainer = document.querySelector(".stories-scroll");
    
    const storyItem = document.createElement('div');
    storyItem.className = 'story-item';
    storyItem.innerHTML = `
        <div class="story-circle ${story.viewers && story.viewers.includes(currentUser.uid) ? 'viewed' : ''}">
            <img src="${userData.avatar}" alt="${userData.name}">
        </div>
        <span>${userData.name}</span>
    `;
    storyItem.addEventListener('click', () => viewStory(story, userData));
    
    storiesContainer.appendChild(storyItem);
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
    elements.customThemeUpload.style.display = 'none';
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

// Profile Update - MODIFIED: Username is now optional and can be set in app
async function handleProfileUpdate(event) {
    event.preventDefault();
    
    const name = elements.profileName.value.trim();
    const username = elements.profileUsername.value.trim();
    const bio = elements.profileBio.value.trim();
    
    if (!name) {
        alert('Please enter your name');
        return;
    }
    
    // If username is provided, check availability
    if (username) {
        const usernameAvailable = await checkUsernameAvailability(username, currentUser.uid);
        if (!usernameAvailable) {
            alert('Username already taken. Please choose another one.');
            return;
        }
    }
    
    try {
        const updateData = {
            name: name,
            bio: bio
        };
        
        // Only update username if provided
        if (username) {
            updateData.username = username;
        }
        
        await db.collection('users').doc(currentUser.uid).update(updateData);
        
        alert('Profile updated successfully!');
        closeAllModals();
        
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('Error updating profile. Please try again.');
    }
}

// Check Username Availability
async function checkUsernameAvailability(username, currentUserId = null) {
    try {
        const snapshot = await db.collection('users')
            .where('username', '==', username)
            .get();
        
        if (snapshot.empty) {
            return true; // Username is available
        }
        
        // If we're checking for a specific user (during profile update)
        if (currentUserId) {
            // Check if the username belongs to the current user
            const currentUserDoc = snapshot.docs.find(doc => doc.id === currentUserId);
            if (currentUserDoc) {
                return true; // It's the current user's own username
            }
        }
        
        return false; // Username is taken by another user
    } catch (error) {
        console.error('Error checking username:', error);
        return false; // If there's an error, assume username is taken to be safe
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

// Signup Handler - MODIFIED: No username required
async function handleSignup(event) {
    event.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const referralCode = document.getElementById('referral-code').value;
    
    try {
        // Create user with email and password
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        
        // Update profile with name
        await userCredential.user.updateProfile({
            displayName: name
        });
        
        // Process referral if provided
        if (referralCode) {
            await processReferral(referralCode);
        }
        
        // User document will be created automatically by ensureUserDocument in auth state listener
        
    } catch (error) {
        console.error('Signup error:', error);
        
        // Handle specific error cases
        if (error.code === 'auth/email-already-in-use') {
            alert('Email already in use. Please use a different email or login.');
        } else if (error.code === 'auth/weak-password') {
            alert('Password is too weak. Please use a stronger password.');
        } else {
            alert('Signup failed: ' + error.message);
        }
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
    
    // Real-time status updates
    const statusUnsubscribe = db.collection('users').doc(partnerId)
        .onSnapshot((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                const status = userData.status === 'online' ? 'Online' : 
                              `Last seen ${formatLastSeen(userData.lastSeen)}`;
                elements.chatStatus.textContent = status;
            }
        });
    
    unsubscribeFunctions.push(statusUnsubscribe);
    
    elements.chatWindow.classList.remove('hidden');
    closeAllModals();
    
    const chatRef = db.collection('chats').doc(currentChatId);
    const chatDoc = await chatRef.get();
    if (!chatDoc.exists) {
        await db.collection('chats').doc(currentChatId).set({
            users: [currentUser.uid, partnerId],
            lastMessage: '',
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    }

    loadMessages();
    setupTypingListener();
    loadChatTheme(); // Load chat theme
}

// Format Last Seen Time
function formatLastSeen(timestamp) {
    if (!timestamp) return 'recently';
    
    const now = new Date();
    const lastSeen = timestamp.toDate();
    const diff = now - lastSeen;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days < 7) return `${days} days ago`;
    return lastSeen.toLocaleDateString();
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
    if (!text) return;

    // Edit mode
    if (currentEditMessageId) {
        await editMessage(currentEditMessageId, text);
        return;
    }

    // Stop typing
    stopTyping();

    if (currentChatType === "group") {
        // === GROUP CHAT ===
        const messageData = {
            text,
            senderId: currentUser.uid,
            senderName: currentUser.displayName || "User",
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            readBy: [currentUser.uid],
            type: "text",
        };

        await db.collection("groups").doc(currentChatId).collection("messages").add(messageData);

        await db.collection("groups").doc(currentChatId).update({
            lastMessage: `${messageData.senderName}: ${text}`,
            lastMessageTime: firebase.firestore.FieldValue.serverTimestamp(),
        });

        elements.messageInput.value = "";
        return;
    }

    // === INDIVIDUAL CHAT ===
    const partnerId = currentChatId.split("_").find(id => id !== currentUser.uid);
    const chatRef = db.collection("chats").doc(currentChatId);

    const messageData = {
        text,
        senderId: currentUser.uid,
        senderName: currentUser.displayName || "User",
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        readBy: [currentUser.uid],
        type: "text",
    };

    // ✅ Ensure chat document exists & properly formatted
    await chatRef.set({
        users: [currentUser.uid, partnerId],
        lastMessage: text,
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    // ✅ Add message to subcollection
    await chatRef.collection("messages").add(messageData);

    elements.messageInput.value = "";
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

// Enhanced Story Upload Modal
async function openStoryUploadModal() {
    openModal(elements.storyUploadModal);
    await loadUserMediaFromDevice();
}

// Load actual device media for stories
async function loadUserMediaFromDevice() {
    const grid = elements.storyMediaGrid;
    grid.innerHTML = '<div class="no-stickers">Accessing your gallery...</div>';
    
    try {
        // Create file input for media selection
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*,video/*';
        fileInput.multiple = true;
        fileInput.style.display = 'none';
        
        fileInput.onchange = (e) => {
            const files = Array.from(e.target.files);
            displayStoryMediaFiles(files);
        };
        
        document.body.appendChild(fileInput);
        fileInput.click();
        
    } catch (error) {
        console.error('Error accessing media:', error);
        grid.innerHTML = '<div class="no-stickers">Cannot access media. Please check permissions.</div>';
    }
}

function displayStoryMediaFiles(files) {
    const grid = elements.storyMediaGrid;
    grid.innerHTML = '';
    
    if (files.length === 0) {
        grid.innerHTML = '<div class="no-stickers">No media files selected.</div>';
        return;
    }
    
    files.forEach((file, index) => {
        const mediaItem = document.createElement('div');
        mediaItem.className = 'story-media-item';
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const isVideo = file.type.startsWith('video/');
            
            mediaItem.innerHTML = isVideo ? 
                `<video src="${e.target.result}" alt="Video ${index + 1}"></video>` :
                `<img src="${e.target.result}" alt="Image ${index + 1}">`;
                
            mediaItem.addEventListener('click', () => {
                selectStoryMediaFile(file, e.target.result, isVideo ? 'video' : 'image');
            });
        };
        reader.readAsDataURL(file);
        
        grid.appendChild(mediaItem);
    });
}

function selectStoryMediaFile(file, dataUrl, mediaType) {
    selectedStoryMedia = { file, dataUrl, mediaType };
    
    const previewSection = elements.storyPreviewSection;
    const imagePreview = elements.storyPreviewImage;
    const videoPreview = elements.storyPreviewVideo;
    
    if (mediaType === 'image') {
        imagePreview.src = dataUrl;
        imagePreview.style.display = 'block';
        videoPreview.style.display = 'none';
    } else {
        videoPreview.src = dataUrl;
        videoPreview.style.display = 'block';
        imagePreview.style.display = 'none';
    }
    
    previewSection.classList.remove('hidden');
}

// Enhanced Story Upload with Firebase Storage
async function postStory() {
    if (!selectedStoryMedia) return;
    
    try {
        // Upload media to Firebase Storage
        const storageRef = storage.ref();
        const storyRef = storageRef.child(`stories/${currentUser.uid}/${Date.now()}_${selectedStoryMedia.file.name}`);
        
        const uploadTask = storyRef.put(selectedStoryMedia.file);
        
        uploadTask.on('state_changed',
            (snapshot) => {
                // Show upload progress
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            },
            (error) => {
                alert('Error uploading story: ' + error.message);
            },
            async () => {
                // Get download URL
                const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                
                // Save story data to Firestore
                const storyData = {
                    userId: currentUser.uid,
                    username: currentUser.displayName || "User",
                    userAvatar: currentUser.photoURL || "https://api.dicebear.com/7.x/adventurer/svg?seed=" + currentUser.uid,
                    mediaUrl: downloadURL,
                    mediaType: selectedStoryMedia.mediaType,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
                    viewers: []
                };
                
                await db.collection('stories').add(storyData);
                
                closeAllModals();
                loadStoriesRealtime();
                showNotification('Story posted successfully!');
            }
        );
        
    } catch (error) {
        console.error('Error posting story:', error);
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
    
    // Mark as viewed
    if (!story.viewers || !story.viewers.includes(currentUser.uid)) {
        db.collection('stories').doc(story.id).update({
            viewers: firebase.firestore.FieldValue.arrayUnion(currentUser.uid)
        });
    }
    
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
    alert('Previous story feature will be implemented');
}

function showNextStory() {
    // Implementation for showing next story
    alert('Next story feature will be implemented');
}

// Enhanced Chat Background Themes with 5 New Premium Themes
function openChatThemeModal() {
    openModal(elements.chatThemeModal);
    loadChatThemes();
}

function loadChatThemes() {
    const themesGrid = elements.chatThemesGrid;
    if (!themesGrid) return;
    
    // Default themes + 5 new premium themes
    const themes = [
        { id: 'default', name: 'Default', class: 'default-theme' },
        { id: 'neon-grid', name: 'Neon Grid', class: 'neon-grid-theme' },
        { id: 'cyber-circuit', name: 'Cyber Circuit', class: 'cyber-circuit-theme' },
        { id: 'matrix', name: 'Matrix', class: 'matrix-theme' },
        { id: 'galaxy', name: 'Galaxy', class: 'galaxy-theme' },
        { id: 'nebula', name: 'Nebula', class: 'nebula-theme' },
        { id: 'cyberpunk', name: 'Cyberpunk', class: 'cyberpunk-theme' },
        { id: 'synthwave', name: 'Synthwave', class: 'synthwave-theme' },
        { id: 'hologram', name: 'Hologram', class: 'hologram-theme' },
        { id: 'circuit-board', name: 'Circuit Board', class: 'circuit-board-theme' },
        { id: 'custom', name: 'Custom Image', class: 'custom-theme' }
    ];
    
    themesGrid.innerHTML = '';
    
    themes.forEach(theme => {
        const themeItem = document.createElement('div');
        themeItem.className = 'chat-theme-item';
        themeItem.dataset.theme = theme.id;
        themeItem.innerHTML = `
            <div class="theme-preview ${theme.class}">
                ${theme.id === 'custom' ? '<i class="fas fa-upload"></i>' : ''}
            </div>
            <span>${theme.name}</span>
        `;
        
        themeItem.addEventListener('click', () => {
            if (theme.id === 'custom') {
                elements.customThemeUpload.style.display = 'block';
            } else {
                applyChatTheme(theme.id);
                elements.chatThemeModal.classList.remove('active');
            }
        });
        
        themesGrid.appendChild(themeItem);
    });
}

function applyChatTheme(theme) {
    currentChatTheme = theme;
    const messagesContainer = elements.messagesContainer;
    
    // Remove all theme classes
    messagesContainer.className = 'messages-container scrollable';
    
    // Add selected theme class
    messagesContainer.classList.add(`${theme}-theme`);
    
    // Save theme preference for this chat
    if (currentChatId) {
        const themeKey = `chat_theme_${currentChatId}`;
        localStorage.setItem(themeKey, theme);
    }
    
    showNotification(`Chat theme applied: ${theme}`);
}

// Handle Custom Theme Upload
async function handleCustomThemeUpload(event) {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    
    try {
        const storageRef = storage.ref();
        const themeRef = storageRef.child(`chat_themes/${currentUser.uid}/${currentChatId}_${Date.now()}_${file.name}`);
        
        const uploadTask = themeRef.put(file);
        
        uploadTask.on('state_changed',
            (snapshot) => {
                // Show upload progress
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Theme upload: ' + progress + '% done');
            },
            (error) => {
                alert('Error uploading theme: ' + error.message);
            },
            async () => {
                const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                
                // Apply custom theme
                applyCustomChatTheme(downloadURL);
                
                elements.chatThemeModal.classList.remove('active');
                elements.customThemeUpload.style.display = 'none';
                
                showNotification('Custom theme applied successfully!');
            }
        );
        
    } catch (error) {
        console.error('Error uploading custom theme:', error);
        alert('Error uploading theme image. Please try again.');
    }
}

function applyCustomChatTheme(imageUrl) {
    const messagesContainer = elements.messagesContainer;
    
    // Remove all theme classes
    messagesContainer.className = 'messages-container scrollable';
    
    // Add custom theme
    messagesContainer.classList.add('custom-theme');
    messagesContainer.style.backgroundImage = `url(${imageUrl})`;
    messagesContainer.style.backgroundSize = 'cover';
    messagesContainer.style.backgroundPosition = 'center';
    messagesContainer.style.backgroundAttachment = 'fixed';
    
    // Save custom theme
    if (currentChatId) {
        const themeKey = `chat_theme_${currentChatId}`;
        localStorage.setItem(themeKey, 'custom');
        localStorage.setItem(`${themeKey}_image`, imageUrl);
    }
}

// Load custom theme when opening chat
function loadChatTheme() {
    if (!currentChatId) return;
    
    const themeKey = `chat_theme_${currentChatId}`;
    const savedTheme = localStorage.getItem(themeKey) || 'default';
    
    if (savedTheme === 'custom') {
        const imageUrl = localStorage.getItem(`${themeKey}_image`);
        if (imageUrl) {
            applyCustomChatTheme(imageUrl);
        } else {
            applyChatTheme('default');
        }
    } else {
        applyChatTheme(savedTheme);
    }
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

// Enhanced Group Avatar System - Fixed to show only owned avatars
function loadGroupAvatars() {
    const avatars = JSON.parse(localStorage.getItem('neonchat_avatars') || '[]');
    const grid = elements.groupAvatarsGrid;
    grid.innerHTML = '';
    
    const ownedAvatars = avatars.filter(avatar => 
        userAvatars.some(owned => owned === avatar.id)
    );
    
    if (ownedAvatars.length === 0) {
        grid.innerHTML = '<div class="no-avatars">No avatars available. Purchase some from the store!</div>';
        return;
    }
    
    ownedAvatars.forEach(avatar => {
        const avatarItem = document.createElement('div');
        avatarItem.className = 'avatar-item owned';
        avatarItem.innerHTML = `
            <img src="${avatar.url}" alt="${avatar.name}" class="clickable-profile-pic">
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
    loadChatTheme(); // Load chat theme
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

// Enhanced Friend Suggestions
async function loadFriendSuggestions() {
    try {
        // Get current user's contacts
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        const userContacts = userDoc.data()?.contacts || [];
        const contactIds = userContacts.map(contact => contact.id);
        
        // Get users with similar interests or mutual connections
        const usersSnapshot = await db.collection('users')
            .where(firebase.firestore.FieldPath.documentId(), 'not-in', [...contactIds, currentUser.uid])
            .limit(20)
            .get();
        
        // Sort by potential relevance (you can enhance this algorithm)
        const suggestedUsers = usersSnapshot.docs
            .filter(doc => doc.id !== currentUser.uid)
            .slice(0, 10); // Limit to 10 suggestions
        
        updateSuggestedContactsList(suggestedUsers);
    } catch (error) {
        console.error('Error loading friend suggestions:', error);
        // Fallback: show random users
        loadRandomFriendSuggestions();
    }
}

async function loadRandomFriendSuggestions() {
    try {
        const usersSnapshot = await db.collection('users')
            .where(firebase.firestore.FieldPath.documentId(), '!=', currentUser.uid)
            .limit(10)
            .get();
        
        updateSuggestedContactsList(usersSnapshot.docs);
    } catch (error) {
        console.error('Error loading random suggestions:', error);
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

// Enhanced Avatars with Hinglish Funny Names
function initializeAvatars() {
    const avatars = [
        // Free Avatars (10)
        { id: 1, url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=1', name: 'Chotu Bhai', category: 'free', price: 0, razorpayLink: '', gender: 'boy', style: 'funny' },
        { id: 2, url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=2', name: 'Gulabo', category: 'free', price: 0, razorpayLink: '', gender: 'girl', style: 'cute' },
        { id: 3, url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=3', name: 'Bhidu', category: 'free', price: 0, razorpayLink: '', gender: 'boy', style: 'gangster' },
        { id: 4, url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=4', name: 'Chandni', category: 'free', price: 0, razorpayLink: '', gender: 'girl', style: 'cute' },
        { id: 5, url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=5', name: 'Babu Rao', category: 'free', price: 0, razorpayLink: '', gender: 'man', style: 'funny' },
        { id: 6, url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=6', name: 'Pinky', category: 'free', price: 0, razorpayLink: '', gender: 'girl', style: 'cute' },
        { id: 7, url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=7', name: 'Raju', category: 'free', price: 0, razorpayLink: '', gender: 'boy', style: 'funny' },
        { id: 8, url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=8', name: 'Chameli', category: 'free', price: 0, razorpayLink: '', gender: 'woman', style: 'cute' },
        { id: 9, url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=9', name: 'Gogo', category: 'free', price: 0, razorpayLink: '', gender: 'boy', style: 'gangster' },
        { id: 10, url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=10', name: 'Munni', category: 'free', price: 0, razorpayLink: '', gender: 'girl', style: 'cute' },


                // Bollywood Character Avatars (50 New Paid Ones)
        { id: 101, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=salman', name: 'Salman Bhai', category: 'premium', price: 199, razorpayLink: 'https://rzp.io/l/neonchat-avatar199', gender: 'man', style: 'bollywood', character: 'actor' },
        { id: 102, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=shahrukh', name: 'King Khan', category: 'premium', price: 299, razorpayLink: 'https://rzp.io/l/neonchat-avatar299', gender: 'man', style: 'bollywood', character: 'actor' },
        { id: 103, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amitabh', name: 'Big B', category: 'premium', price: 399, razorpayLink: 'https://rzp.io/l/neonchat-avatar399', gender: 'man', style: 'bollywood', character: 'actor' },
        { id: 104, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=akshay', name: 'Khiladi Kumar', category: 'premium', price: 179, razorpayLink: 'https://rzp.io/l/neonchat-avatar179', gender: 'man', style: 'bollywood', character: 'actor' },
        { id: 105, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=hrithik', name: 'Greek God', category: 'premium', price: 259, razorpayLink: 'https://rzp.io/l/neonchat-avatar259', gender: 'man', style: 'bollywood', character: 'actor' },
        
        // Bollywood Heroines
        { id: 106, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=deepika', name: 'Deepu Queen', category: 'premium', price: 229, razorpayLink: 'https://rzp.io/l/neonchat-avatar229', gender: 'woman', style: 'bollywood', character: 'actress' },
        { id: 107, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priyanka', name: 'Piggy Chops', category: 'premium', price: 279, razorpayLink: 'https://rzp.io/l/neonchat-avatar279', gender: 'woman', style: 'bollywood', character: 'actress' },
        { id: 108, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kareena', name: 'Bebo Jaan', category: 'premium', price: 249, razorpayLink: 'https://rzp.io/l/neonchat-avatar249', gender: 'woman', style: 'bollywood', character: 'actress' },
        { id: 109, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=katrina', name: 'Kat Miss', category: 'premium', price: 269, razorpayLink: 'https://rzp.io/l/neonchat-avatar269', gender: 'woman', style: 'bollywood', character: 'actress' },
        { id: 110, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alia', name: 'Alia Bhatt', category: 'premium', price: 199, razorpayLink: 'https://rzp.io/l/neonchat-avatar199', gender: 'woman', style: 'bollywood', character: 'actress' },
        
        // Iconic Bollywood Characters
        { id: 111, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=don', name: 'Don', category: 'premium', price: 349, razorpayLink: 'https://rzp.io/l/neonchat-avatar349', gender: 'man', style: 'bollywood', character: 'don' },
        { id: 112, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vijay', name: 'Vijay Dinanath', category: 'premium', price: 319, razorpayLink: 'https://rzp.io/l/neonchat-avatar319', gender: 'man', style: 'bollywood', character: 'angry young man' },
        { id: 113, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chulbul', name: 'Chulbul Pandey', category: 'premium', price: 299, razorpayLink: 'https://rzp.io/l/neonchat-avatar299', gender: 'man', style: 'bollywood', character: 'cop' },
        { id: 114, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=simba', name: 'Simba', category: 'premium', price: 279, razorpayLink: 'https://rzp.io/l/neonchat-avatar279', gender: 'man', style: 'bollywood', character: 'gangster' },
        { id: 115, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rocky', name: 'Rocky Randhawa', category: 'premium', price: 289, razorpayLink: 'https://rzp.io/l/neonchat-avatar289', gender: 'man', style: 'bollywood', character: 'boxer' },
        
        // Bollywood Villains
        { id: 116, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=gabbar', name: 'Gabbar Singh', category: 'premium', price: 399, razorpayLink: 'https://rzp.io/l/neonchat-avatar399', gender: 'man', style: 'bollywood', character: 'villain' },
        { id: 117, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mogambo', name: 'Mogambo', category: 'premium', price: 379, razorpayLink: 'https://rzp.io/l/neonchat-avatar379', gender: 'man', style: 'bollywood', character: 'villain' },
        { id: 118, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kancha', name: 'Kancha Cheena', category: 'premium', price: 359, razorpayLink: 'https://rzp.io/l/neonchat-avatar359', gender: 'man', style: 'bollywood', character: 'villain' },
        { id: 119, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=raOne', name: 'Ra One', category: 'premium', price: 329, razorpayLink: 'https://rzp.io/l/neonchat-avatar329', gender: 'man', style: 'bollywood', character: 'villain' },
        { id: 120, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=shakaal', name: 'Shakaal', category: 'premium', price: 319, razorpayLink: 'https://rzp.io/l/neonchat-avatar319', gender: 'man', style: 'bollywood', character: 'villain' },
        
        // Bollywood Comedy Characters
        { id: 121, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=circuit', name: 'Circuit', category: 'premium', price: 199, razorpayLink: 'https://rzp.io/l/neonchat-avatar199', gender: 'man', style: 'bollywood', character: 'comedy' },
        { id: 122, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=raju', name: 'Raju Guide', category: 'premium', price: 189, razorpayLink: 'https://rzp.io/l/neonchat-avatar189', gender: 'man', style: 'bollywood', character: 'comedy' },
        { id: 123, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=baburao', name: 'Baburao', category: 'premium', price: 219, razorpayLink: 'https://rzp.io/l/neonchat-avatar219', gender: 'man', style: 'bollywood', character: 'comedy' },
        { id: 124, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mehmood', name: 'Mehmood', category: 'premium', price: 179, razorpayLink: 'https://rzp.io/l/neonchat-avatar179', gender: 'man', style: 'bollywood', character: 'comedy' },
        { id: 125, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=johnylever', name: 'Johnny Lever', category: 'premium', price: 169, razorpayLink: 'https://rzp.io/l/neonchat-avatar169', gender: 'man', style: 'bollywood', character: 'comedy' },
        
        // Bollywood Item Girls
        { id: 126, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=helen', name: 'Helen Jaan', category: 'premium', price: 299, razorpayLink: 'https://rzp.io/l/neonchat-avatar299', gender: 'woman', style: 'bollywood', character: 'dancer' },
        { id: 127, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=madhu', name: 'Madhu Bala', category: 'premium', price: 279, razorpayLink: 'https://rzp.io/l/neonchat-avatar279', gender: 'woman', style: 'bollywood', character: 'actress' },
        { id: 128, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=meena', name: 'Meena Kumari', category: 'premium', price: 269, razorpayLink: 'https://rzp.io/l/neonchat-avatar269', gender: 'woman', style: 'bollywood', character: 'actress' },
        { id: 129, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rekha', name: 'Rekha Ji', category: 'premium', price: 289, razorpayLink: 'https://rzp.io/l/neonchat-avatar289', gender: 'woman', style: 'bollywood', character: 'actress' },
        { id: 130, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sridevi', name: 'Sridevi Maam', category: 'premium', price: 319, razorpayLink: 'https://rzp.io/l/neonchat-avatar319', gender: 'woman', style: 'bollywood', character: 'actress' },
        
        // Bollywood New Generation
        { id: 131, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ranveer', name: 'Ranveer Singh', category: 'premium', price: 229, razorpayLink: 'https://rzp.io/l/neonchat-avatar229', gender: 'man', style: 'bollywood', character: 'actor' },
        { id: 132, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ranbir', name: 'Ranbir Kapoor', category: 'premium', price: 239, razorpayLink: 'https://rzp.io/l/neonchat-avatar239', gender: 'man', style: 'bollywood', character: 'actor' },
        { id: 133, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=varun', name: 'Varun Dhawan', category: 'premium', price: 199, razorpayLink: 'https://rzp.io/l/neonchat-avatar199', gender: 'man', style: 'bollywood', character: 'actor' },
        { id: 134, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tiger', name: 'Tiger Shroff', category: 'premium', price: 219, razorpayLink: 'https://rzp.io/l/neonchat-avatar219', gender: 'man', style: 'bollywood', character: 'actor' },
        { id: 135, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kartik', name: 'Kartik Aryan', category: 'premium', price: 189, razorpayLink: 'https://rzp.io/l/neonchat-avatar189', gender: 'man', style: 'bollywood', character: 'actor' },
        
        // Bollywood New Actresses
        { id: 136, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kiara', name: 'Kiara Advani', category: 'premium', price: 199, razorpayLink: 'https://rzp.io/l/neonchat-avatar199', gender: 'woman', style: 'bollywood', character: 'actress' },
        { id: 137, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=shraddha', name: 'Shraddha Kapoor', category: 'premium', price: 209, razorpayLink: 'https://rzp.io/l/neonchat-avatar209', gender: 'woman', style: 'bollywood', character: 'actress' },
        { id: 138, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jacqueline', name: 'Jacqueline Fern', category: 'premium', price: 219, razorpayLink: 'https://rzp.io/l/neonchat-avatar219', gender: 'woman', style: 'bollywood', character: 'actress' },
        { id: 139, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=disha', name: 'Disha Patani', category: 'premium', price: 229, razorpayLink: 'https://rzp.io/l/neonchat-avatar229', gender: 'woman', style: 'bollywood', character: 'actress' },
        { id: 140, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ananya', name: 'Ananya Pandey', category: 'premium', price: 179, razorpayLink: 'https://rzp.io/l/neonchat-avatar179', gender: 'woman', style: 'bollywood', character: 'actress' },
        
        // Bollywood Directors/Styles
        { id: 141, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=karan', name: 'Karan Johar', category: 'premium', price: 259, razorpayLink: 'https://rzp.io/l/neonchat-avatar259', gender: 'man', style: 'bollywood', character: 'director' },
        { id: 142, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rajkumar', name: 'Rajkumar Hirani', category: 'premium', price: 239, razorpayLink: 'https://rzp.io/l/neonchat-avatar239', gender: 'man', style: 'bollywood', character: 'director' },
        { id: 143, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sanjay', name: 'Sanjay Leela', category: 'premium', price: 229, razorpayLink: 'https://rzp.io/l/neonchat-avatar229', gender: 'man', style: 'bollywood', character: 'director' },
        { id: 144, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rohit', name: 'Rohit Shetty', category: 'premium', price: 219, razorpayLink: 'https://rzp.io/l/neonchat-avatar219', gender: 'man', style: 'bollywood', character: 'director' },
        { id: 145, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=imtiaz', name: 'Imtiaz Ali', category: 'premium', price: 209, razorpayLink: 'https://rzp.io/l/neonchat-avatar209', gender: 'man', style: 'bollywood', character: 'director' },
        
        // Bollywood Music Directors
        { id: 146, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=arrahman', name: 'A R Rahman', category: 'premium', price: 299, razorpayLink: 'https://rzp.io/l/neonchat-avatar299', gender: 'man', style: 'bollywood', character: 'music' },
        { id: 147, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pritam', name: 'Pritam Da', category: 'premium', price: 189, razorpayLink: 'https://rzp.io/l/neonchat-avatar189', gender: 'man', style: 'bollywood', character: 'music' },
        { id: 148, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vishal', name: 'Vishal Dadlani', category: 'premium', price: 179, razorpayLink: 'https://rzp.io/l/neonchat-avatar179', gender: 'man', style: 'bollywood', character: 'music' },
        { id: 149, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=shankar', name: 'Shankar Mahadevan', category: 'premium', price: 199, razorpayLink: 'https://rzp.io/l/neonchat-avatar199', gender: 'man', style: 'bollywood', character: 'music' },
        
        // Premium Avatars - Boys/Men (25)
        { id: 11, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rocky', name: 'Bhai Log', category: 'premium', price: 49, razorpayLink: 'https://rzp.io/l/neonchat-avatar49', gender: 'man', style: 'gangster' },
        { id: 12, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=don', name: 'Don Bhai', category: 'premium', price: 49, razorpayLink: 'https://rzp.io/l/neonchat-avatar49', gender: 'man', style: 'gangster' },
        { id: 13, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chintu', name: 'Chintu Sweet', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-avatar39', gender: 'boy', style: 'cute' },
        { id: 14, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=badshah', name: 'Badshah', category: 'premium', price: 79, razorpayLink: 'https://rzp.io/l/neonchat-avatar79', gender: 'man', style: 'gangster' },
        { id: 15, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=motu', name: 'Motu Patlu', category: 'premium', price: 29, razorpayLink: 'https://rzp.io/l/neonchat-avatar29', gender: 'boy', style: 'funny' },
        { id: 16, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=gangster', name: 'Gunda No. 1', category: 'premium', price: 99, razorpayLink: 'https://rzp.io/l/neonchat-avatar99', gender: 'man', style: 'gangster' },
        { id: 17, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chiku', name: 'Chiku Cute', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-avatar39', gender: 'boy', style: 'cute' },
        { id: 18, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=raja', name: 'Raja Babu', category: 'premium', price: 69, razorpayLink: 'https://rzp.io/l/neonchat-avatar69', gender: 'man', style: 'funny' },
        { id: 19, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rockstar', name: 'Rocky Bhai', category: 'premium', price: 89, razorpayLink: 'https://rzp.io/l/neonchat-avatar89', gender: 'man', style: 'gangster' },
        { id: 20, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=master', name: 'Master Ji', category: 'premium', price: 49, razorpayLink: 'https://rzp.io/l/neonchat-avatar49', gender: 'man', style: 'funny' },
        
        // Girls/Women (25)
        { id: 21, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=queen', name: 'Queen Bee', category: 'premium', price: 99, razorpayLink: 'https://rzp.io/l/neonchat-avatar99', gender: 'woman', style: 'gangster' },
        { id: 22, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cutie', name: 'Cutie Pie', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-avatar39', gender: 'girl', style: 'cute' },
        { id: 23, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=gulab', name: 'Gulab Jaan', category: 'premium', price: 59, razorpayLink: 'https://rzp.io/l/neonchat-avatar59', gender: 'woman', style: 'cute' },
        { id: 24, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=badgirl', name: 'Bad Girl', category: 'premium', price: 79, razorpayLink: 'https://rzp.io/l/neonchat-avatar79', gender: 'woman', style: 'gangster' },
        { id: 25, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chamak', name: 'Chamak Challo', category: 'premium', price: 69, razorpayLink: 'https://rzp.io/l/neonchat-avatar69', gender: 'girl', style: 'funny' },
        { id: 26, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chand', name: 'Chand Sitaare', category: 'premium', price: 49, razorpayLink: 'https://rzp.io/l/neonchat-avatar49', gender: 'girl', style: 'cute' },
        { id: 27, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=doll', name: 'Doll Face', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-avatar39', gender: 'girl', style: 'cute' },
        { id: 28, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=shero', name: 'Shero Wali', category: 'premium', price: 89, razorpayLink: 'https://rzp.io/l/neonchat-avatar89', gender: 'woman', style: 'gangster' },
        { id: 29, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=masoom', name: 'Masoom Sa', category: 'premium', price: 29, razorpayLink: 'https://rzp.io/l/neonchat-avatar29', gender: 'girl', style: 'cute' },
        { id: 30, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=heroine', name: 'Heroine No. 1', category: 'premium', price: 79, razorpayLink: 'https://rzp.io/l/neonchat-avatar79', gender: 'woman', style: 'funny' },
        
        // More Funny Names (20)
        { id: 31, url: 'https://api.dicebear.com/7.x/bottts/svg?seed=robot1', name: 'Robot Chacha', category: 'premium', price: 49, razorpayLink: 'https://rzp.io/l/neonchat-avatar49', gender: 'boy', style: 'funny' },
        { id: 32, url: 'https://api.dicebear.com/7.x/bottts/svg?seed=robot2', name: 'Chipku Singh', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-avatar39', gender: 'boy', style: 'funny' },
        { id: 33, url: 'https://api.dicebear.com/7.x/bottts/svg?seed=robot3', name: 'Laddu Ji', category: 'premium', price: 29, razorpayLink: 'https://rzp.io/l/neonchat-avatar29', gender: 'boy', style: 'funny' },
        { id: 34, url: 'https://api.dicebear.com/7.x/bottts/svg?seed=robot4', name: 'Golu Molu', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-avatar39', gender: 'boy', style: 'funny' },
        { id: 35, url: 'https://api.dicebear.com/7.x/bottts/svg?seed=robot5', name: 'Bakchod Bhai', category: 'premium', price: 49, razorpayLink: 'https://rzp.io/l/neonchat-avatar49', gender: 'man', style: 'funny' },
        
        // More Gangster Names (20)
        { id: 36, url: 'https://api.dicebear.com/7.x/micah/svg?seed=gang1', name: 'Khalnayak', category: 'premium', price: 99, razorpayLink: 'https://rzp.io/l/neonchat-avatar99', gender: 'man', style: 'gangster' },
        { id: 37, url: 'https://api.dicebear.com/7.x/micah/svg?seed=gang2', name: 'Dabangg', category: 'premium', price: 89, razorpayLink: 'https://rzp.io/l/neonchat-avatar89', gender: 'man', style: 'gangster' },
        { id: 38, url: 'https://api.dicebear.com/7.x/micah/svg?seed=gang3', name: 'Bhai Saab', category: 'premium', price: 79, razorpayLink: 'https://rzp.io/l/neonchat-avatar79', gender: 'man', style: 'gangster' },
        { id: 39, url: 'https://api.dicebear.com/7.x/micah/svg?seed=gang4', name: 'Don Corleone', category: 'premium', price: 129, razorpayLink: 'https://rzp.io/l/neonchat-avatar129', gender: 'man', style: 'gangster' },
        { id: 40, url: 'https://api.dicebear.com/7.x/micah/svg?seed=gang5', name: 'Gangster Girl', category: 'premium', price: 89, razorpayLink: 'https://rzp.io/l/neonchat-avatar89', gender: 'woman', style: 'gangster' },
        
        // More Cute Names (20)
        { id: 41, url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=cute1', name: 'Chotu Baby', category: 'premium', price: 29, razorpayLink: 'https://rzp.io/l/neonchat-avatar29', gender: 'boy', style: 'cute' },
        { id: 42, url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=cute2', name: 'Pari Jaisi', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-avatar39', gender: 'girl', style: 'cute' },
        { id: 43, url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=cute3', name: 'Sweetu', category: 'premium', price: 29, razorpayLink: 'https://rzp.io/l/neonchat-avatar29', gender: 'girl', style: 'cute' },
        { id: 44, url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=cute4', name: 'Baby Doll', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-avatar39', gender: 'girl', style: 'cute' },
        { id: 45, url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=cute5', name: 'Chand Ka Tukda', category: 'premium', price: 49, razorpayLink: 'https://rzp.io/l/neonchat-avatar49', gender: 'girl', style: 'cute' },
        
        // Ultra Premium Exclusive (15)
        { id: 46, url: 'https://api.dicebear.com/7.x/identicon/svg?seed=king', name: 'King of Mumbai', category: 'premium', price: 299, razorpayLink: 'https://rzp.io/l/neonchat-avatar299', gender: 'man', style: 'gangster' },
        { id: 47, url: 'https://api.dicebear.com/7.x/identicon/svg?seed=queen2', name: 'Queen of Hearts', category: 'premium', price: 299, razorpayLink: 'https://rzp.io/l/neonchat-avatar299', gender: 'woman', style: 'gangster' },
        { id: 48, url: 'https://api.dicebear.com/7.x/identicon/svg?seed=legend', name: 'Living Legend', category: 'premium', price: 499, razorpayLink: 'https://rzp.io/l/neonchat-avatar499', gender: 'man', style: 'gangster' },
        { id: 49, url: 'https://api.dicebear.com/7.x/identicon/svg?seed=godfather', name: 'Godfather', category: 'premium', price: 999, razorpayLink: 'https://rzp.io/l/neonchat-avatar999', gender: 'man', style: 'gangster' },
        { id: 50, url: 'https://api.dicebear.com/7.x/identicon/svg?seed=empress', name: 'Empress', category: 'premium', price: 999, razorpayLink: 'https://rzp.io/l/neonchat-avatar999', gender: 'woman', style: 'gangster' },
        
        // Special Category - Mixed (25)
        { id: 51, url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=style1', name: 'Style King', category: 'premium', price: 149, razorpayLink: 'https://rzp.io/l/neonchat-avatar149', gender: 'man', style: 'funny' },
        { id: 52, url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=style2', name: 'Fashion Queen', category: 'premium', price: 149, razorpayLink: 'https://rzp.io/l/neonchat-avatar149', gender: 'woman', style: 'cute' },
        { id: 53, url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=style3', name: 'Jhatka King', category: 'premium', price: 79, razorpayLink: 'https://rzp.io/l/neonchat-avatar79', gender: 'boy', style: 'funny' },
        { id: 54, url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=style4', name: 'Dhinka Chika', category: 'premium', price: 89, razorpayLink: 'https://rzp.io/l/neonchat-avatar89', gender: 'man', style: 'funny' },
        { id: 55, url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=style5', name: 'Disco Dancer', category: 'premium', price: 99, razorpayLink: 'https://rzp.io/l/neonchat-avatar99', gender: 'man', style: 'funny' },
        
        // Additional 45 avatars to reach 100 total
        { id: 56, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chulbul', name: 'Chulbul Pandey', category: 'premium', price: 129, razorpayLink: 'https://rzp.io/l/neonchat-avatar129', gender: 'man', style: 'gangster' },
        { id: 57, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rocky2', name: 'Rocky Randhawa', category: 'premium', price: 119, razorpayLink: 'https://rzp.io/l/neonchat-avatar119', gender: 'man', style: 'gangster' },
        { id: 58, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=munna', name: 'Munna Bhai', category: 'premium', price: 109, razorpayLink: 'https://rzp.io/l/neonchat-avatar109', gender: 'man', style: 'gangster' },
        { id: 59, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=circuit', name: 'Circuit', category: 'premium', price: 89, razorpayLink: 'https://rzp.io/l/neonchat-avatar89', gender: 'boy', style: 'funny' },
        { id: 60, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=baburao', name: 'Baburao Ganpatrao', category: 'premium', price: 139, razorpayLink: 'https://rzp.io/l/neonchat-avatar139', gender: 'man', style: 'funny' },
        
        // Girls Special
        { id: 61, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=anjali', name: 'Anjali Sweet', category: 'premium', price: 49, razorpayLink: 'https://rzp.io/l/neonchat-avatar49', gender: 'girl', style: 'cute' },
        { id: 62, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya', name: 'Priya Darling', category: 'premium', price: 59, razorpayLink: 'https://rzp.io/l/neonchat-avatar59', gender: 'girl', style: 'cute' },
        { id: 63, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=simran', name: 'Simran Jaan', category: 'premium', price: 69, razorpayLink: 'https://rzp.io/l/neonchat-avatar69', gender: 'woman', style: 'cute' },
        { id: 64, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kajol', name: 'Kajol Beauty', category: 'premium', price: 79, razorpayLink: 'https://rzp.io/l/neonchat-avatar79', gender: 'woman', style: 'cute' },
        { id: 65, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aish', name: 'Aish Queen', category: 'premium', price: 99, razorpayLink: 'https://rzp.io/l/neonchat-avatar99', gender: 'woman', style: 'cute' },
        
        // More Funny Boys
        { id: 66, url: 'https://api.dicebear.com/7.x/bottts/svg?seed=funny1', name: 'Lucky Lucky', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-avatar39', gender: 'boy', style: 'funny' },
        { id: 67, url: 'https://api.dicebear.com/7.x/bottts/svg?seed=funny2', name: 'Happy Singh', category: 'premium', price: 49, razorpayLink: 'https://rzp.io/l/neonchat-avatar49', gender: 'boy', style: 'funny' },
        { id: 68, url: 'https://api.dicebear.com/7.x/bottts/svg?seed=funny3', name: 'Jolly LLB', category: 'premium', price: 59, razorpayLink: 'https://rzp.io/l/neonchat-avatar59', gender: 'man', style: 'funny' },
        { id: 69, url: 'https://api.dicebear.com/7.x/bottts/svg?seed=funny4', name: 'Masti Wala', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-avatar39', gender: 'boy', style: 'funny' },
        { id: 70, url: 'https://api.dicebear.com/7.x/bottts/svg?seed=funny5', name: 'Hasu Hasu', category: 'premium', price: 29, razorpayLink: 'https://rzp.io/l/neonchat-avatar29', gender: 'boy', style: 'funny' },
        
        // Complete the set to 100
        { id: 71, url: 'https://api.dicebear.com/7.x/micah/svg?seed=final1', name: 'Last Don', category: 'premium', price: 199, razorpayLink: 'https://rzp.io/l/neonchat-avatar199', gender: 'man', style: 'gangster' },
        { id: 72, url: 'https://api.dicebear.com/7.x/micah/svg?seed=final2', name: 'Final Boss', category: 'premium', price: 299, razorpayLink: 'https://rzp.io/l/neonchat-avatar299', gender: 'man', style: 'gangster' },
        { id: 73, url: 'https://api.dicebear.com/7.x/micah/svg?seed=final3', name: 'Game Over', category: 'premium', price: 399, razorpayLink: 'https://rzp.io/l/neonchat-avatar399', gender: 'man', style: 'gangster' },
        { id: 74, url: 'https://api.dicebear.com/7.x/micah/svg?seed=final4', name: 'King Kong', category: 'premium', price: 259, razorpayLink: 'https://rzp.io/l/neonchat-avatar259', gender: 'man', style: 'gangster' },
        { id: 75, url: 'https://api.dicebear.com/7.x/micah/svg?seed=final5', name: 'Hulk Bhai', category: 'premium', price: 179, razorpayLink: 'https://rzp.io/l/neonchat-avatar179', gender: 'man', style: 'gangster' },
        
        // Last 25 premium avatars
        { id: 76, url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=premium1', name: 'Pixel King', category: 'premium', price: 89, razorpayLink: 'https://rzp.io/l/neonchat-avatar89', gender: 'boy', style: 'funny' },
        { id: 77, url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=premium2', name: 'Digital Don', category: 'premium', price: 99, razorpayLink: 'https://rzp.io/l/neonchat-avatar99', gender: 'man', style: 'gangster' },
        { id: 78, url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=premium3', name: 'Cyber Cutie', category: 'premium', price: 79, razorpayLink: 'https://rzp.io/l/neonchat-avatar79', gender: 'girl', style: 'cute' },
        { id: 79, url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=premium4', name: 'Tech Tiger', category: 'premium', price: 119, razorpayLink: 'https://rzp.io/l/neonchat-avatar119', gender: 'man', style: 'gangster' },
        { id: 80, url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=premium5', name: 'Code Queen', category: 'premium', price: 109, razorpayLink: 'https://rzp.io/l/neonchat-avatar109', gender: 'woman', style: 'gangster' },
        
        // Final 20
        { id: 81, url: 'https://api.dicebear.com/7.x/identicon/svg?seed=ultimate1', name: 'Ultimate Boss', category: 'premium', price: 499, razorpayLink: 'https://rzp.io/l/neonchat-avatar499', gender: 'man', style: 'gangster' },
        { id: 82, url: 'https://api.dicebear.com/7.x/identicon/svg?seed=ultimate2', name: 'Supreme Leader', category: 'premium', price: 599, razorpayLink: 'https://rzp.io/l/neonchat-avatar599', gender: 'man', style: 'gangster' },
        { id: 83, url: 'https://api.dicebear.com/7.x/identicon/svg?seed=ultimate3', name: 'Mafia King', category: 'premium', price: 699, razorpayLink: 'https://rzp.io/l/neonchat-avatar699', gender: 'man', style: 'gangster' },
        { id: 84, url: 'https://api.dicebear.com/7.x/identicon/svg?seed=ultimate4', name: 'Cartel Queen', category: 'premium', price: 699, razorpayLink: 'https://rzp.io/l/neonchat-avatar699', gender: 'woman', style: 'gangster' },
        { id: 85, url: 'https://api.dicebear.com/7.x/identicon/svg?seed=ultimate5', name: 'Godmother', category: 'premium', price: 799, razorpayLink: 'https://rzp.io/l/neonchat-avatar799', gender: 'woman', style: 'gangster' },
        
        // Last 15
        { id: 86, url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=last1', name: 'Final Fantasy', category: 'premium', price: 159, razorpayLink: 'https://rzp.io/l/neonchat-avatar159', gender: 'boy', style: 'funny' },
        { id: 87, url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=last2', name: 'Last Laugh', category: 'premium', price: 139, razorpayLink: 'https://rzp.io/l/neonchat-avatar139', gender: 'man', style: 'funny' },
        { id: 88, url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=last3', name: 'Sweet Ending', category: 'premium', price: 99, razorpayLink: 'https://rzp.io/l/neonchat-avatar99', gender: 'girl', style: 'cute' },
        { id: 89, url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=last4', name: 'Happy Ending', category: 'premium', price: 119, razorpayLink: 'https://rzp.io/l/neonchat-avatar119', gender: 'woman', style: 'cute' },
        { id: 90, url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=last5', name: 'The End Boss', category: 'premium', price: 299, razorpayLink: 'https://rzp.io/l/neonchat-avatar299', gender: 'man', style: 'gangster' },
        
        // Final 10
        { id: 91, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=century1', name: 'Century King', category: 'premium', price: 199, razorpayLink: 'https://rzp.io/l/neonchat-avatar199', gender: 'man', style: 'gangster' },
        { id: 92, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=century2', name: 'Hundred Wala', category: 'premium', price: 149, razorpayLink: 'https://rzp.io/l/neonchat-avatar149', gender: 'boy', style: 'funny' },
        { id: 93, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=century3', name: 'Sau Ka Sikandar', category: 'premium', price: 199, razorpayLink: 'https://rzp.io/l/neonchat-avatar199', gender: 'man', style: 'gangster' },
        { id: 94, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=century4', name: '100 Wali Queen', category: 'premium', price: 199, razorpayLink: 'https://rzp.io/l/neonchat-avatar199', gender: 'woman', style: 'gangster' },
        { id: 95, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=century5', name: 'Sau Rupaye Wala', category: 'premium', price: 99, razorpayLink: 'https://rzp.io/l/neonchat-avatar99', gender: 'boy', style: 'funny' },
        
        // Last 5
        { id: 96, url: 'https://api.dicebear.com/7.x/bottts/svg?seed=finalfinal1', name: 'Antim Avatar', category: 'premium', price: 399, razorpayLink: 'https://rzp.io/l/neonchat-avatar399', gender: 'man', style: 'gangster' },
        { id: 97, url: 'https://api.dicebear.com/7.x/bottts/svg?seed=finalfinal2', name: 'Last Avatar', category: 'premium', price: 299, razorpayLink: 'https://rzp.io/l/neonchat-avatar299', gender: 'woman', style: 'gangster' },
        { id: 98, url: 'https://api.dicebear.com/7.x/bottts/svg?seed=finalfinal3', name: 'Final Form', category: 'premium', price: 499, razorpayLink: 'https://rzp.io/l/neonchat-avatar499', gender: 'man', style: 'gangster' },
        { id: 99, url: 'https://api.dicebear.com/7.x/bottts/svg?seed=finalfinal4', name: 'Ultimate Form', category: 'premium', price: 599, razorpayLink: 'https://rzp.io/l/neonchat-avatar599', gender: 'woman', style: 'gangster' },
        { id: 100, url: 'https://api.dicebear.com/7.x/bottts/svg?seed=finalfinal5', name: 'The Legend', category: 'premium', price: 999, razorpayLink: 'https://rzp.io/l/neonchat-avatar999', gender: 'man', style: 'gangster' }
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
        avatarItem.className = `avatar-item ${isOwned ? 'owned' : ''} ${avatar.category === 'premium' ? 'premium' : ''}`;
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

// Enhanced Stickers with Hindi Language - All Paid at INR 39
function initializeStickers() {
    const stickers = [
        // Free Stickers (10) - Keep existing
        { id: 1, text: '😊', name: 'Smile', category: 'free', price: 0, razorpayLink: '' },
        { id: 2, text: '😂', name: 'Laugh', category: 'free', price: 0, razorpayLink: '' },
        { id: 3, text: '❤️', name: 'Heart', category: 'free', price: 0, razorpayLink: '' },
        { id: 4, text: '🔥', name: 'Fire', category: 'free', price: 0, razorpayLink: '' },
        { id: 5, text: '🎉', name: 'Party', category: 'free', price: 0, razorpayLink: '' },
        { id: 6, text: '👍', name: 'Thumbs Up', category: 'free', price: 0, razorpayLink: '' },
        { id: 7, text: '👋', name: 'Wave', category: 'free', price: 0, razorpayLink: '' },
        { id: 8, text: '💯', name: '100', category: 'free', price: 0, razorpayLink: '' },
        { id: 9, text: '😎', name: 'Cool', category: 'free', price: 0, razorpayLink: '' },
        { id: 10, text: '🤩', name: 'Star Eyes', category: 'free', price: 0, razorpayLink: '' },
        
        // Hindi Language Stickers - All Premium at INR 39
        { id: 11, text: '💪', name: 'Mar Dunga', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 12, text: '🐕', name: 'Saale Kutte', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 13, text: '⏰', name: 'Bataun Abhi', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 14, text: '🙅', name: 'Na Maane', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 15, text: '👑', name: 'Baap Hu Main', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 16, text: '💔', name: 'Dil Tod Diya', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 17, text: '🎯', name: 'Sahi Pakde', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 18, text: '🤬', name: 'Gussa Aa Raha', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 19, text: '😈', name: 'Bhoot Banega', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 20, text: '🤑', name: 'Paisa Hi Paisa', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 21, text: '🤣', name: 'Has Has Ke Pet Dard', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 22, text: '🙏', name: 'Bhagwan Bharose', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 23, text: '💀', name: 'Maut Aa Gayi', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 24, text: '👊', name: 'Chamatkar Hogaya', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 25, text: '🤝', name: 'Dost Hai Bhai', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 26, text: '😴', name: 'Neend Aa Rahi', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 27, text: '🍻', name: 'Party Shuru', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 28, text: '📚', name: 'Padhle BSDK', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 29, text: '🎵', name: 'Gaana Bajega', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 30, text: '🍕', name: 'Bhookh Lagi Hai', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 31, text: '🚀', name: 'Udd Ja Re', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 32, text: '💖', name: 'Pyaar Ho Gaya', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 33, text: '😭', name: 'Rona Aa Raha', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 34, text: '🤔', name: 'Soch Raha Hu', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 35, text: '🎭', name: 'Natak Mat Kar', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 36, text: '💼', name: 'Kaam Important Hai', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 37, text: '🏆', name: 'Jeet Gaya', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 38, text: '🤫', name: 'Chup Reh', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 39, text: '👀', name: 'Kya Dekh Raha', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 40, text: '💩', name: 'Tatti Kar Diya', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 41, text: '🎮', name: 'Game Khelte Hai', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 42, text: '📱', name: 'Phone Uthale', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 43, text: '🌧️', name: 'Bahar Barish Hai', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 44, text: '🍦', name: 'Ice Cream Khayega', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 45, text: '🤸', name: 'Masti Karo', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 46, text: '💍', name: 'Shadi Karle', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 47, text: '🚫', name: 'Band Kar De', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 48, text: '✅', name: 'Theek Hai Bhai', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 49, text: '❌', name: 'Nahi Chalega', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 50, text: '⚡', name: 'Jhatpat Kar', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 51, text: '🌙', name: 'So Ja Bhai', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 52, text: '☀️', name: 'Good Morning', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 53, text: '📞', name: 'Call Kar', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 54, text: '📍', name: 'Kidhar Hai', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 55, text: '⏳', name: 'Wait Kar', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 56, text: '🎁', name: 'Gift De De', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 57, text: '🤗', name: 'Gale Lag Ja', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 58, text: '😘', name: 'Pyaar Se Dekh', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 59, text: '🤪', name: 'Pagal Hai Kya', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 60, text: '👑', name: 'King Hai Tu', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
                
        // Romantic & Love (10)
        { id: 101, text: '💖🤗', name: 'Pyaar Ki Garmi', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 102, text: '🥰👀', name: 'Dil Ki Baat', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 103, text: '💘💌', name: 'Love Letter', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 104, text: '🌹💋', name: 'Pyaar Mohabbat', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 105, text: '💑🎶', name: 'Romantic Mood', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 106, text: '💞✨', name: 'Dil Dance Maare', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 107, text: '🥂💕', name: 'Cheers Pyaar Mein', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 108, text: '💓🌙', name: 'Chand Taare', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 109, text: '💝🎁', name: 'Dil Ki Gift', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 110, text: '👫💫', name: 'Hum Dono', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },

        // Funny & Comedy (15)
        { id: 201, text: '🤣💥', name: 'Has Has Ke Fatega', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 202, text: '😂🔄', name: 'Repeat Kar De Bhai', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 203, text: '😜🎭', name: 'Masti Time', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 204, text: '🤪🚀', name: 'Uda De Re Baba', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 205, text: '🤑💰', name: 'Paisa Vasool', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 206, text: '😎🕶️', name: 'Cool Dude', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 207, text: '🤡🎪', name: 'Bakchodi Maximum', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 208, text: '💩🤦', name: 'Yaar Kya Karu', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 209, text: '🍻🎊', name: 'Party To Banti Hai', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 210, text: '🤣📈', name: 'Comedy King', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 211, text: '😆🎬', name: 'Scene Palat Gaya', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 212, text: '🤭🔊', name: 'Chup Kar Yaar', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 213, text: '💀⚰️', name: 'Maut Aagayi', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 214, text: '🎭🤡', name: 'Natak Kar Raha', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 215, text: '🍕🤤', name: 'Bhookh Lagi Hai', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },

        // Anger & Attitude (10)
        { id: 301, text: '😠💢', name: 'Gussa Aa Raha', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 302, text: '👊💥', name: 'Chamatkar Hogaya', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 303, text: '🤬🔥', name: 'Khoon Khaul Gaya', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 304, text: '💪😤', name: 'Mar Dunga', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 305, text: '🐕👊', name: 'Saale Kutte', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 306, text: '👑😠', name: 'Baap Hu Main', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 307, text: '⚡🤬', name: 'Jhatka De Dunga', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 308, text: '💣👿', name: 'Bhoot Banega', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 309, text: '🛑😡', name: 'Bas Kar Yaar', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 310, text: '💀☠️', name: 'Maut Ka Khel', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },

        // Sad & Emotional (8)
        { id: 401, text: '😢💔', name: 'Dil Tod Diya', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 402, text: '🌧️😭', name: 'Rona Aa Raha', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 403, text: '🎵💔', name: 'Dard Bhara Gaana', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 404, text: '☔😔', name: 'Dil Dukha Hai', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 405, text: '⛈️😞', name: 'Zindagi Barbaad', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 406, text: '🌑💧', name: 'Aansu Aa Gaye', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 407, text: '🎭😢', name: 'Drama Queen', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 408, text: '🚶💔', name: 'Akela Chhod Diya', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },

        // Celebration & Party (7)
        { id: 501, text: '🎉🥳', name: 'Jashn Manao', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 502, text: '🏆🎊', name: 'Jeet Gaya', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 503, text: '💃🕺', name: 'Nacho Beta', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 504, text: '🎂🎈', name: 'Happy Birthday', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 505, text: '✨🌟', name: 'Shining Star', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 506, text: '🎯🥇', name: 'Champion Hai Hum', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 507, text: '🚀🎇', name: 'Success Party', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },

        // Friendship & Support (6)
        { id: 601, text: '🤝💪', name: 'Dost Hai Bhai', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 602, text: '👬🌈', name: 'Yaari Dosti', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 603, text: '💖🤗', name: 'Hug De Bhai', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 604, text: '🎯👊', name: 'Sahi Pakde Hai', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 605, text: '🛡️💫', name: 'Main Hoon Na', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 606, text: '🌟🤝', name: 'Best Friend Forever', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },

        // Food & Cravings (8)
        { id: 701, text: '🍕🤤', name: 'Pizza Khayega?', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 702, text: '🍔🥤', name: 'Burger Time', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 703, text: '🍦😋', name: 'Ice Cream Lelo', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 704, text: '🍫💖', name: 'Chocolate De Do', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 705, text: '☕📚', name: 'Chai Sutta Time', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 706, text: '🍿🎬', name: 'Movie Night', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 707, text: '🍽️👨‍🍳', name: 'Khana Ban Gaya', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 708, text: '🥘🎉', name: 'Party Food Ready', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },

        // Gaming & Tech (6)
        { id: 801, text: '🎮🔥', name: 'Game Khelte Hai', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 802, text: '📱💻', name: 'Tech Savvy', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 803, text: '⚡🎯', name: 'Pro Gamer', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 804, text: '👾💾', name: 'Geek Mode On', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 805, text: '🎲🎰', name: 'Luck Test Karo', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 806, text: '🚀🌌', name: 'Future Tech', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },

                // Family & Relatives (10)
        { id: 1201, text: '👵💬', name: 'Mummy Ka Call', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1202, text: '👴📞', name: 'Papa Ka Pressure', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1203, text: '👨‍👩‍👧‍👦💭', name: 'Family Meeting', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1204, text: '👵🍛', name: 'Ghar Ka Khana', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1205, text: '👴🗣️', name: 'Papa Ki Daant', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1206, text: '👵💰', name: 'Pocket Money Plz', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1207, text: '👨‍👩‍👧‍👦🎯', name: 'Shaadi Ki Umar', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1208, text: '👵📚', name: 'Padhai Karo Beta', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1209, text: '👴💼', name: 'Job Dhundho Beta', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1210, text: '👵❤️', name: 'Mummy Ka Pyaar', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },

        // College & Student Life (8)
        { id: 1301, text: '📚😫', name: 'Backlogs Hai', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1302, text: '🎒🏃', name: 'Late Ho Gaya', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1303, text: '📝🤯', name: 'Exam Pressure', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1304, text: '👨‍🏫😴', name: 'Boring Lecture', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1305, text: '📖💤', name: 'Padhke Neend Aayi', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1306, text: '🎓🎉', name: 'Degree Mil Gayi', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1307, text: '👨‍🎓💼', name: 'Campus Placement', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1308, text: '📚☕', name: 'Chai Sutta Break', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },

        // Office & Work Life (8)
        { id: 1401, text: '💼😫', name: 'Monday Blues', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1402, text: '👨‍💼🗣️', name: 'Boss Ki Daant', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1403, text: '📊😵', name: 'Excel Sheet Dikhado', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1404, text: '💻🎮', name: 'Work From Home', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1405, text: '💰💸', name: 'Salary Aagayi', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1406, text: '📅😌', name: 'Weekend Plan', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1407, text: '👔😓', name: 'Meeting Chal Raha', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1408, text: '💼🚶', name: 'Office Jaana Hai', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },

        // Mumbai & Local Life (8)
        { id: 1501, text: '🚆💨', name: 'Local Pakadna Hai', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1502, text: '🚗😫', name: 'Traffic Mein Fass Gaye', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1503, text: '🌧️☔', name: 'Barish Mein Bhig Gaye', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1504, text: '🍜😋', name: 'Street Food Khayega?', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1505, text: '🏠💸', name: 'Rent Bharna Hai', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1506, text: '🚶‍♂️🏃', name: 'Auto Pakadna Hai', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1507, text: '🌃✨', name: 'Marine Drive Chill', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1508, text: '🛵💨', name: 'Bike Pe Ghumne Chalte', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },

        // Relationship & Dating (8)
        { id: 1601, text: '💑📱', name: 'Girlfriend Ka Msg', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1602, text: '👫😠', name: 'Jhagda Ho Gaya', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1603, text: '❤️📞', name: 'Miss You Call', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1604, text: '🎁💝', name: 'Gift Le Aaya', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1605, text: '💔😢', name: 'Breakup Ho Gaya', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1606, text: '👫🍽️', name: 'Date Pe Chalte Hai', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1607, text: '💖📲', name: 'Good Morning Msg', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1608, text: '👫🎬', name: 'Movie Date Plan', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },

        // Money & Finance (6)
        { id: 1701, text: '💰😫', name: 'Paisa Khtm Ho Gaya', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1702, text: '💸🛒', name: 'Shopping Kar Li', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1703, text: '🏦😌', name: 'Loan Chukaya', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1704, text: '💳😵', name: 'Credit Card Bill', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1705, text: '💰🤝', name: 'Udhaar Chahiye', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1706, text: '💸🎯', name: 'Saving Kar Raha', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },

        // Health & Fitness (6)
        { id: 1801, text: '🏃‍♂️💦', name: 'Gym Jaana Hai', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1802, text: '🍎💪', name: 'Dieting Kar Raha', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1803, text: '🤒💊', name: 'Bimar Pad Gaya', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1804, text: '💉😫', name: 'Doctor Ke Paas Jaana', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1805, text: '🧘‍♂️😌', name: 'Yoga Kar Raha', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1806, text: '💪🎯', name: 'Body Ban Raha', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },

        // Ultra Relatable Indian (8)
        { id: 1901, text: '⚡🤯', name: 'Current Chala Gaya', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1902, text: '📶😫', name: 'Network Nahi Hai', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1903, text: '🛵⛽', name: 'Petrol Khatam', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1904, text: '📱🔋', name: 'Phone Charge Nahi', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1905, text: '🌧️🏠', name: 'Ghar Pe Reh Lete', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1906, text: '🍜😋', name: 'Maggie Banate Hai', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1907, text: '📺🛋️', name: 'TV Dekh Rahe', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 1908, text: '🛌😴', name: 'Aaj To Sona Hai', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },

        // WhatsApp Forward Specials (6)
        { id: 2001, text: '📱🔁', name: 'Good Morning Forward', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 2002, text: '🙏📲', name: 'Auntie Ka Msg', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 2003, text: '🔄😴', name: 'Good Night Forward', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 2004, text: '📜🙏', name: 'Motivational Quote', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 2005, text: '😂📹', name: 'Funny Video Forward', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 2006, text: '🔗📱', name: 'Link Bhej Raha', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },

        // Premium Ultra Relatable (4)
        { id: 2101, text: '🏠💼', name: 'Ghar Wapsi', category: 'premium', price: 99, razorpayLink: 'https://rzp.io/l/neonchat-sticker99' },
        { id: 2102, text: '👨‍👩‍👧‍👦🎉', name: 'Family Function', category: 'premium', price: 99, razorpayLink: 'https://rzp.io/l/neonchat-sticker99' },
        { id: 2103, text: '💑🏠', name: 'Rishta Aaya Hai', category: 'premium', price: 99, razorpayLink: 'https://rzp.io/l/neonchat-sticker99' },
        
        // Special & Unique (10)
        { id: 901, text: '🔮✨', name: 'Future Dekhte Hai', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 902, text: '🎭🃏', name: 'Joker Card', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 903, text: '🌪️💫', name: 'Andhi Aagayi', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 904, text: '🦸⚡', name: 'Superhero Ban Gaya', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 905, text: '👻🎃', name: 'Bhootiya Time', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 906, text: '🧠💡', name: 'Idea Aa Gaya', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 907, text: '🎵🎤', name: 'Gaana Bajega', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 908, text: '📖✍️', name: 'Padhle BSDK', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 909, text: '🏃💨', name: 'Bhaag Milkha Bhaag', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },
        { id: 910, text: '🛌😴', name: 'Neend Aa Rahi', category: 'premium', price: 39, razorpayLink: 'https://rzp.io/l/neonchat-sticker39' },

        // Ultra Premium Exclusive (5)
        { id: 1001, text: '👑🔥', name: 'King of Chat', category: 'premium', price: 99, razorpayLink: 'https://rzp.io/l/neonchat-sticker99' },
        { id: 1002, text: '💎🌟', name: 'Diamond Member', category: 'premium', price: 99, razorpayLink: 'https://rzp.io/l/neonchat-sticker99' },
        { id: 1003, text: '🚀🌠', name: 'Chat Rocket', category: 'premium', price: 99, razorpayLink: 'https://rzp.io/l/neonchat-sticker99' },
        { id: 1004, text: '🎭💫', name: 'Drama King', category: 'premium', price: 99, razorpayLink: 'https://rzp.io/l/neonchat-sticker99' },
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

// Export functions for global access
window.openMediaViewer = openMediaViewer;
window.downloadFile = downloadFile;
window.showMessageActions = showMessageActions;
window.cancelEdit = cancelEdit;
window.addSuggestedContact = addSuggestedContact;
window.selectStoryMedia = selectStoryMedia;
window.viewStory = viewStory;
window.showPreviousStory = showPreviousStory;
window.showNextStory = showNextStory;
