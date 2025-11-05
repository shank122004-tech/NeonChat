// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDgjEZESPE0XEuoKO8F-mxnri3NT-ELjHw",
    authDomain: "neonchat-94f8c.firebaseapp.com",
    projectId: "neonchat-94f8c",
    storageBucket: "neonchat-94f8c.firebasestorage.app",
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
let allUsers = [];
let allChats = [];
let allGroups = [];
let currentPurchaseItem = null;

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
    googleSigninBtn: document.getElementById('google-signin-btn'),
    googleSignupBtn: document.getElementById('google-signup-btn'),
    
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
    
    // Modals
    settingsModal: document.getElementById('settings-modal'),
    newChatModal: document.getElementById('new-chat-modal'),
    newGroupModal: document.getElementById('new-group-modal'),
    profileModal: document.getElementById('profile-modal'),
    profilePicModal: document.getElementById('profile-pic-modal'),
    purchaseModal: document.getElementById('purchase-modal'),
    
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
    
    // Groups
    newGroupBtn: document.getElementById('new-group-btn'),
    groupsList: document.getElementById('groups-list'),
    createGroupBtn: document.getElementById('create-group-btn'),
    groupName: document.getElementById('group-name'),
    groupDescription: document.getElementById('group-description'),
    groupMembersList: document.getElementById('group-members-list'),
    
    // Contacts
    addContactBtn: document.getElementById('add-contact-btn'),
    contactsList: document.getElementById('contacts-list'),
    
    // Stickers
    stickerAttachmentBtn: document.getElementById('sticker-attachment-btn'),
    stickerPanel: document.getElementById('sticker-panel'),
    closeStickerPanel: document.getElementById('close-sticker-panel'),
    stickersContainer: document.getElementById('stickers-container'),
    stickersGrid: document.getElementById('stickers-grid'),
    
    // Search
    searchInput: document.getElementById('search-input'),
    searchUser: document.getElementById('search-user'),
    usersList: document.getElementById('users-list'),
    
    // Profile View
    viewProfilePic: document.getElementById('view-profile-pic'),
    viewProfileName: document.getElementById('view-profile-name'),
    viewProfileEmail: document.getElementById('view-profile-email'),
    viewProfileBio: document.getElementById('view-profile-bio'),
    viewContactsCount: document.getElementById('view-contacts-count'),
    viewGroupsCount: document.getElementById('view-groups-count'),
    viewAvatarsCount: document.getElementById('view-avatars-count'),
    viewStickersCount: document.getElementById('view-stickers-count'),
    
    // Avatars
    avatarsGrid: document.getElementById('avatars-grid'),
    myAvatarsGrid: document.getElementById('my-avatars-grid'),
    ownedAvatarsCount: document.getElementById('owned-avatars-count'),
    
    // Balance
    userBalance: document.getElementById('user-balance'),
    settingsBalance: document.getElementById('settings-balance'),
    
    // Purchase
    purchaseDetails: document.getElementById('purchase-details'),
    confirmPurchaseBtn: document.getElementById('confirm-purchase-btn'),
    cancelPurchaseBtn: document.getElementById('cancel-purchase-btn'),
    
    // Profile Picture Viewer
    fullscreenProfilePic: document.getElementById('fullscreen-profile-pic')
};

// Initialize App
function initApp() {
    setupEventListeners();
    initializeSplashScreen();
    setupAuthStateListener();
    initializeAvatars();
    initializeStickers();
    
    // Add mobile-specific optimizations
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
    elements.googleSigninBtn.addEventListener('click', handleGoogleSignIn);
    elements.googleSignupBtn.addEventListener('click', handleGoogleSignUp);
    
    // App Navigation
    elements.navItems.forEach(item => {
        item.addEventListener('click', () => switchTab(item.dataset.tab));
    });
    
    // Profile Menu
    elements.profileMenuToggle.addEventListener('click', toggleProfileMenu);
    elements.settingsBtn.addEventListener('click', openSettings);
    elements.profileBtn.addEventListener('click', openProfile);
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
    
    // Groups
    elements.newGroupBtn.addEventListener('click', openNewGroupModal);
    elements.createGroupBtn.addEventListener('click', createGroup);
    
    // Contacts
    elements.addContactBtn.addEventListener('click', addContact);
    
    // Stickers
    elements.stickerAttachmentBtn.addEventListener('click', toggleStickerPanel);
    elements.closeStickerPanel.addEventListener('click', () => {
        elements.stickerPanel.classList.add('hidden');
    });
    
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
    
    // Purchase
    elements.confirmPurchaseBtn.addEventListener('click', confirmPurchase);
    elements.cancelPurchaseBtn.addEventListener('click', () => {
        elements.purchaseModal.classList.remove('active');
    });
    
    // Profile Picture Click Events
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('clickable-profile-pic')) {
            openProfilePictureViewer(e.target.src);
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
}

// Initialize Splash Screen
function initializeSplashScreen() {
    createFloatingNeons();
    createNeonLights();
    
    setTimeout(() => {
        if (!auth.currentUser) {
            showScreen('login-screen');
        }
    }, 3000);
}

// Create Floating Neon Elements
function createFloatingNeons() {
    const container = document.querySelector('.floating-neons');
    for (let i = 0; i < 20; i++) {
        const neon = document.createElement('div');
        neon.className = 'floating-neon';
        neon.style.left = `${Math.random() * 100}%`;
        neon.style.top = `${Math.random() * 100}%`;
        neon.style.animationDelay = `${Math.random() * 8}s`;
        container.appendChild(neon);
    }
}

// Create Neon Lights
function createNeonLights() {
    const container = document.querySelector('.neon-lights');
    for (let i = 0; i < 8; i++) {
        const light = document.createElement('div');
        light.className = 'light';
        light.style.left = `${Math.random() * 100}%`;
        light.style.animationDelay = `${Math.random() * 8}s`;
        container.appendChild(light);
    }
}

// Open Profile Picture Viewer
function openProfilePictureViewer(imageSrc) {
    elements.fullscreenProfilePic.src = imageSrc;
    elements.profilePicModal.classList.add('active');
    createProfilePicNeonLights();
}

// Create Neon Lights for Profile Picture Viewer
function createProfilePicNeonLights() {
    const container = document.querySelector('.profile-pic-neon-lights');
    container.innerHTML = '';
    
    for (let i = 0; i < 12; i++) {
        const light = document.createElement('div');
        light.className = 'profile-pic-light';
        light.style.position = 'absolute';
        light.style.width = '20px';
        light.style.height = '20px';
        light.style.borderRadius = '50%';
        light.style.background = `hsl(${i * 30}, 100%, 50%)`;
        light.style.boxShadow = `0 0 20px hsl(${i * 30}, 100%, 50%)`;
        light.style.animation = `floatProfileLight 4s ease-in-out infinite`;
        light.style.animationDelay = `${i * 0.3}s`;
        light.style.left = `${50 + 40 * Math.cos((i * 30) * Math.PI / 180)}%`;
        light.style.top = `${50 + 40 * Math.sin((i * 30) * Math.PI / 180)}%`;
        container.appendChild(light);
    }
    
    // Add CSS for animation if not already added
    if (!document.getElementById('profile-pic-light-animation')) {
        const style = document.createElement('style');
        style.id = 'profile-pic-light-animation';
        style.textContent = `
            @keyframes floatProfileLight {
                0%, 100% {
                    transform: translate(-50%, -50%) scale(1);
                    opacity: 0.7;
                }
                50% {
                    transform: translate(-50%, -50%) scale(1.5);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
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
        await userRef.set({
            name: user.displayName || "New User",
            email: user.email,
            avatar: user.photoURL || "https://api.dicebear.com/7.x/adventurer/svg?seed=" + user.uid,
            bio: "Hey there! I'm using NeonChat",
            status: "online",
            lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
            contacts: [],
            groups: [],
            avatars: [],
            stickers: [],
            balance: 100,
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
            
            updateProfileView(userData);
            updateBalanceDisplay(userData.balance || 100);
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Update Balance Display
function updateBalanceDisplay(balance) {
    if (elements.userBalance) elements.userBalance.textContent = `$${balance}`;
    if (elements.settingsBalance) elements.settingsBalance.textContent = `$${balance}`;
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
                updateBalanceDisplay(userData.balance || 100);
            }
        });
    
    unsubscribeFunctions.push(userUnsubscribe);
    
    // Load all users for search
    const usersUnsubscribe = db.collection('users')
        .onSnapshot((snapshot) => {
            allUsers = snapshot.docs;
            updateContactsList(allUsers.filter(doc => 
                userContacts.some(contact => contact.email === doc.data().email)
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
    
    // Load chats
    loadChats();
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
            loadChats();
            break;
        case 'groups':
            loadGroups();
            break;
        case 'contacts':
            loadContacts();
            break;
        case 'stickers':
            loadStickersStore();
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
    }
}

// Load Settings Data
async function loadSettingsData() {
    await loadUserSettings();
    loadAvatarsStore();
    loadMyAvatars();
}

// Load User Settings
async function loadUserSettings() {
    if (!currentUser) return;
    
    try {
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        if (userDoc.exists) {
            const userData = userDoc.data();
            elements.profileName.value = userData.name || '';
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
    const bio = elements.profileBio.value.trim();
    
    if (!name) {
        alert('Please enter your name');
        return;
    }
    
    try {
        await db.collection('users').doc(currentUser.uid).update({
            name: name,
            bio: bio
        });
        
        alert('Profile updated successfully!');
        closeAllModals();
        
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('Error updating profile. Please try again.');
    }
}

// Open Profile View
function openProfile() {
    openModal(elements.profileModal);
    toggleProfileMenu();
}

// Update Profile View
function updateProfileView(userData) {
    elements.viewProfilePic.src = userData.avatar || "https://api.dicebear.com/7.x/adventurer/svg?seed=" + currentUser.uid;
    elements.viewProfileName.textContent = userData.name || 'User';
    elements.viewProfileEmail.textContent = userData.email || '';
    elements.viewProfileBio.textContent = userData.bio || 'No bio yet';
    elements.viewContactsCount.textContent = userData.contacts?.length || 0;
    elements.viewGroupsCount.textContent = userData.groups?.length || 0;
    elements.viewAvatarsCount.textContent = userData.avatars?.length || 0;
    elements.viewStickersCount.textContent = userData.stickers?.length || 0;
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
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        await userCredential.user.updateProfile({ displayName: name });
    } catch (error) {
        console.error('Signup error:', error);
        alert('Signup failed: ' + error.message);
    }
}

async function handleGoogleSignIn() {
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        await auth.signInWithPopup(provider);
    } catch (error) {
        console.error('Google signin error:', error);
        alert('Google signin failed: ' + error.message);
    }
}

async function handleGoogleSignUp() {
    await handleGoogleSignIn();
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
                <p>${user.email}</p>
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
    
    loadMessages();
}

function loadMessages() {
    if (!currentChatId) return;
    
    elements.messagesContainer.innerHTML = '';
    
    const messagesRef = db.collection('chats').doc(currentChatId).collection('messages')
        .orderBy('timestamp', 'asc');
    
    const unsubscribe = messagesRef.onSnapshot((snapshot) => {
        elements.messagesContainer.innerHTML = '';
        
        snapshot.forEach(doc => {
            const message = doc.data();
            renderMessage(message);
        });
        
        elements.messagesContainer.scrollTop = elements.messagesContainer.scrollHeight;
    });
    
    unsubscribeFunctions.push(unsubscribe);
}

function renderMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.senderId === currentUser.uid ? 'sent' : 'received'}`;
    
    const time = message.timestamp ? new Date(message.timestamp.toDate()).toLocaleTimeString([], { 
        hour: '2-digit', minute: '2-digit' 
    }) : 'Sending...';
    
    if (message.type === 'sticker') {
        messageDiv.innerHTML = `
            <div class="message-text" style="font-size: 2rem; text-align: center;">${message.text}</div>
            <div class="message-time">${time}</div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-text">${message.text}</div>
            <div class="message-time">${time}</div>
        `;
    }
    
    elements.messagesContainer.appendChild(messageDiv);
}

async function sendMessage() {
    const text = elements.messageInput.value.trim();
    if (!text || !currentChatId) return;
    
    try {
        const message = {
            text: text,
            senderId: currentUser.uid,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            type: 'text'
        };
        
        await db.collection('chats').doc(currentChatId).collection('messages').add(message);
        elements.messageInput.value = '';
        
    } catch (error) {
        console.error('Error sending message:', error);
        alert('Error sending message. Please try again.');
    }
}

function closeChatWindow() {
    elements.chatWindow.classList.add('hidden');
    currentChatId = null;
    currentChatType = null;
}

// Load Chats
async function loadChats() {
    if (!currentUser) return;
    
    try {
        // Get all users to display in chats
        const usersSnapshot = await db.collection('users').get();
        const contacts = usersSnapshot.docs.filter(doc => 
            doc.id !== currentUser.uid && 
            userContacts.some(contact => contact.email === doc.data().email)
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
                <p>${user.email}</p>
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
    
    try {
        const members = [currentUser.uid, ...selectedMembers];
        
        const groupDoc = await db.collection('groups').add({
            name: name,
            description: description,
            members: members,
            createdBy: currentUser.uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
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
    
    loadGroupMessages();
}

function loadGroupMessages() {
    if (!currentChatId) return;
    
    elements.messagesContainer.innerHTML = '';
    
    const messagesRef = db.collection('groups').doc(currentChatId).collection('messages')
        .orderBy('timestamp', 'asc');
    
    const unsubscribe = messagesRef.onSnapshot((snapshot) => {
        elements.messagesContainer.innerHTML = '';
        
        snapshot.forEach(doc => {
            const message = doc.data();
            renderMessage(message);
        });
        
        elements.messagesContainer.scrollTop = elements.messagesContainer.scrollHeight;
    });
    
    unsubscribeFunctions.push(unsubscribe);
}

// Contact Functions
async function addContact() {
    const email = prompt("Enter your friend's email:");
    if (!email) return;
    
    try {
        const usersSnapshot = await db.collection('users')
            .where('email', '==', email)
            .get();
        
        if (!usersSnapshot.empty) {
            const friendDoc = usersSnapshot.docs[0];
            const friendId = friendDoc.id;
            
            if (friendId === currentUser.uid) {
                alert("You can't add yourself as a contact!");
                return;
            }
            
            await db.collection('users').doc(currentUser.uid).update({
                contacts: firebase.firestore.FieldValue.arrayUnion({
                    id: friendId,
                    email: email,
                    addedAt: new Date().toISOString()
                })
            });
            
            alert('Contact added successfully!');
            loadContacts();
        } else {
            alert('No user found with that email.');
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
                <p>${contact.email}</p>
                <p class="chat-time">${contact.status === 'online' ? 'Online' : 'Offline'}</p>
            </div>
        `;
        contactItem.addEventListener('click', () => startChat(doc.id, contact));
        contactsList.appendChild(contactItem);
    });
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
            const email = item.querySelector('p').textContent.toLowerCase();
            if (name.includes(query) || email.includes(query)) {
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
        const email = item.querySelector('p').textContent.toLowerCase();
        if (name.includes(query) || email.includes(query)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Avatar Functions
function initializeAvatars() {
    const avatars = [
        { id: 1, url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=1', name: 'Adventurer 1', category: 'free', price: 0 },
        { id: 2, url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=2', name: 'Adventurer 2', category: 'free', price: 0 },
        { id: 3, url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=3', name: 'Adventurer 3', category: 'free', price: 0 },
        { id: 4, url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=4', name: 'Neon Warrior', category: 'premium', price: 10 },
        { id: 5, url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=5', name: 'Cyber Explorer', category: 'premium', price: 10 },
        { id: 6, url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=6', name: 'Digital Ninja', category: 'premium', price: 10 },
        { id: 7, url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=7', name: 'Tech Samurai', category: 'premium', price: 15 },
        { id: 8, url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=8', name: 'Matrix Hero', category: 'premium', price: 15 }
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
        const isOwned = userAvatars.some(owned => owned.id === avatar.id);
        const avatarItem = document.createElement('div');
        avatarItem.className = `avatar-item ${isOwned ? 'owned' : ''} ${avatar.category === 'premium' ? 'premium' : ''}`;
        avatarItem.innerHTML = `
            <img src="${avatar.url}" alt="${avatar.name}" class="clickable-profile-pic">
            <span>${isOwned ? 'OWNED' : (avatar.category === 'free' ? 'FREE' : `$${avatar.price}`)}</span>
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
        userAvatars.some(owned => owned.id === avatar.id)
    );
    
    if (ownedAvatars.length === 0) {
        myAvatarsGrid.innerHTML = '<div class="no-avatars">You don\'t have any avatars yet. Visit the store to buy some!</div>';
        return;
    }
    
    ownedAvatars.forEach(avatar => {
        const avatarItem = document.createElement('div');
        avatarItem.className = 'avatar-item owned';
        avatarItem.innerHTML = `
            <img src="${avatar.url}" alt="${avatar.name}" class="clickable-profile-pic">
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

// Sticker Functions
function initializeStickers() {
    const stickers = [
        { id: 1, text: '😊', name: 'Smile', category: 'free', price: 0 },
        { id: 2, text: '😂', name: 'Laugh', category: 'free', price: 0 },
        { id: 3, text: '❤️', name: 'Heart', category: 'free', price: 0 },
        { id: 4, text: '🔥', name: 'Fire', category: 'free', price: 0 },
        { id: 5, text: '🎉', name: 'Party', category: 'free', price: 0 },
        { id: 6, text: '👍', name: 'Thumbs Up', category: 'free', price: 0 },
        { id: 7, text: '👋', name: 'Wave', category: 'free', price: 0 },
        { id: 8, text: '💯', name: '100', category: 'free', price: 0 },
        { id: 9, text: '😎', name: 'Cool', category: 'premium', price: 5 },
        { id: 10, text: '🤩', name: 'Star Eyes', category: 'premium', price: 5 },
        { id: 11, text: '🥳', name: 'Celebration', category: 'premium', price: 5 },
        { id: 12, text: '😍', name: 'Love', category: 'premium', price: 5 },
        { id: 13, text: '🤗', name: 'Hug', category: 'premium', price: 5 },
        { id: 14, text: '😇', name: 'Angel', category: 'premium', price: 5 },
        { id: 15, text: '🤠', name: 'Cowboy', category: 'premium', price: 5 },
        { id: 16, text: '🥰', name: 'Smile Love', category: 'premium', price: 5 }
        
    ];
    
    localStorage.setItem('neonchat_stickers', JSON.stringify(stickers));
}

function loadStickersStore(category = 'all') {
    const stickers = JSON.parse(localStorage.getItem('neonchat_stickers') || '[]');
    const stickersGrid = elements.stickersGrid;
    stickersGrid.innerHTML = '';
    
    let filteredStickers = [];
    
    if (category === 'my-stickers') {
        filteredStickers = stickers.filter(sticker => 
            userStickers.some(owned => owned.id === sticker.id)
        );
    } else if (category === 'all') {
        filteredStickers = stickers;
    } else {
        filteredStickers = stickers.filter(sticker => sticker.category === category);
    }
    
    if (filteredStickers.length === 0) {
        stickersGrid.innerHTML = '<div class="no-stickers">No stickers found in this category.</div>';
        return;
    }
    
    filteredStickers.forEach(sticker => {
        const isOwned = userStickers.some(owned => owned.id === sticker.id);
        const priceClass = sticker.category === 'free' ? 'free' : 'premium';
        const stickerItem = document.createElement('div');
        stickerItem.className = `sticker-store-item ${isOwned ? 'owned' : ''} ${sticker.category === 'premium' ? 'premium' : ''}`;
        stickerItem.innerHTML = `
            <div class="sticker-circle">${sticker.text}</div>
            <div class="sticker-price ${priceClass}">
                ${isOwned ? 'OWNED' : (sticker.category === 'free' ? 'FREE' : `$${sticker.price}`)}
            </div>
            <div class="sticker-name">${sticker.name}</div>
        `;
        
        if (!isOwned && category !== 'my-stickers') {
            stickerItem.addEventListener('click', () => showPurchaseModal(sticker, 'sticker'));
        } else if (isOwned && category === 'my-stickers') {
            stickerItem.addEventListener('click', () => {
                alert(`Sticker: ${sticker.name}\n${sticker.text}`);
            });
        }
        
        stickersGrid.appendChild(stickerItem);
    });
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
    
    ownedStickers.forEach(sticker => {
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
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            type: 'sticker'
        };
        
        if (currentChatType === 'individual') {
            await db.collection('chats').doc(currentChatId).collection('messages').add(message);
        } else {
            await db.collection('groups').doc(currentChatId).collection('messages').add(message);
        }
        
    } catch (error) {
        console.error('Error sending sticker:', error);
    }
}

// Purchase Functions
function showPurchaseModal(item, type) {
    currentPurchaseItem = { ...item, type };
    
    elements.purchaseDetails.innerHTML = `
        <div class="purchase-item">
            ${type === 'avatar' ? 
                `<img src="${item.url}" alt="${item.name}" style="width: 80px; height: 80px; border-radius: 50%; border: 2px solid #ff00de; margin: 0 auto 1rem; display: block;">` :
                `<div class="sticker-circle" style="margin: 0 auto 1rem;">${item.text}</div>`
            }
            <h3 style="text-align: center; margin-bottom: 0.5rem;">${item.name}</h3>
            <p style="text-align: center; color: #aaa; margin-bottom: 1rem;">${type === 'avatar' ? 'Premium Avatar' : 'Emoji Sticker'}</p>
            <div style="text-align: center; font-size: 1.2rem; color: ${item.category === 'free' ? '#00ff00' : '#ffaa00'}; margin-bottom: 1rem;">
                ${item.category === 'free' ? 'FREE' : `$${item.price}`}
            </div>
        </div>
    `;
    
    openModal(elements.purchaseModal);
}

async function confirmPurchase() {
    if (!currentPurchaseItem) return;
    
    try {
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        const userData = userDoc.data();
        const userBalance = userData.balance || 0;
        
        if (currentPurchaseItem.category === 'free') {
            await addToCollection(currentPurchaseItem);
            alert(`${currentPurchaseItem.type === 'avatar' ? 'Avatar' : 'Sticker'} added to your collection!`);
        } else {
            if (userBalance >= currentPurchaseItem.price) {
                await db.collection('users').doc(currentUser.uid).update({
                    balance: userBalance - currentPurchaseItem.price
                });
                
                await addToCollection(currentPurchaseItem);
                alert(`Purchase successful! $${currentPurchaseItem.price} deducted from your balance.`);
            } else {
                alert(`Not enough balance! You need $${currentPurchaseItem.price} but only have $${userBalance}.`);
                return;
            }
        }
        
        elements.purchaseModal.classList.remove('active');
        currentPurchaseItem = null;
        
        // Refresh displays
        await loadUserData();
        if (currentPurchaseItem?.type === 'avatar') {
            loadAvatarsStore();
            loadMyAvatars();
        } else {
            loadStickersStore();
        }
        
    } catch (error) {
        console.error('Error processing purchase:', error);
        alert('Error processing purchase. Please try again.');
    }
}

async function addToCollection(item) {
    const field = item.type === 'avatar' ? 'avatars' : 'stickers';
    const collection = item.type === 'avatar' ? userAvatars : userStickers;
    
    if (!collection.some(owned => owned.id === item.id)) {
        await db.collection('users').doc(currentUser.uid).update({
            [field]: firebase.firestore.FieldValue.arrayUnion(item)
        });
    }
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
