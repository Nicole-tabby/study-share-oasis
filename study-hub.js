
// DOM Elements
const pageContent = document.getElementById('root');
let currentUser = null;

// Theme state
let darkMode = localStorage.getItem('darkMode') === 'true';

// Store for notes data
let notesData = JSON.parse(localStorage.getItem('notesData')) || [];
let savedNotes = JSON.parse(localStorage.getItem('savedNotes')) || [];
let userNotes = JSON.parse(localStorage.getItem('userNotes')) || [];

// Router function to handle page navigation
function navigate(path) {
  window.history.pushState({}, '', path);
  renderPage(path);
  return false;
}

// Initialize theme on load
function initializeTheme() {
  if (darkMode) {
    document.body.classList.add('dark-mode');
    updateThemeIcons(true);
  } else {
    document.body.classList.remove('dark-mode');
    updateThemeIcons(false);
  }
}

// Toggle dark mode
function toggleDarkMode() {
  darkMode = !darkMode;
  localStorage.setItem('darkMode', darkMode);
  
  if (darkMode) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
  
  updateThemeIcons(darkMode);
  showToast('Theme changed', `Switched to ${darkMode ? 'dark' : 'light'} mode`);
}

// Update theme icons
function updateThemeIcons(isDark) {
  const themeIcon = document.getElementById('theme-icon');
  const themeText = document.getElementById('theme-text');
  const themeIconMobile = document.getElementById('theme-icon-mobile');
  const themeTextMobile = document.getElementById('theme-text-mobile');
  
  if (themeIcon && themeText) {
    themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    themeText.textContent = isDark ? 'Light Mode' : 'Dark Mode';
  }
  
  if (themeIconMobile && themeTextMobile) {
    themeIconMobile.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    themeTextMobile.textContent = isDark ? 'Light Mode' : 'Dark Mode';
  }
}

// Mobile menu toggle
function toggleMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  mobileMenu.classList.toggle('show');
}

// Close mobile menu
function closeMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  mobileMenu.classList.remove('show');
}

// Toggle dropdown menu
function toggleDropdown() {
  const dropdown = document.querySelector('.dropdown-menu');
  dropdown.classList.toggle('show');
  
  // Close dropdown when clicking outside
  document.addEventListener('click', function closeDropdown(e) {
    if (!e.target.closest('.dropdown')) {
      dropdown.classList.remove('show');
      document.removeEventListener('click', closeDropdown);
    }
  });
}

// Show toast notifications
function showToast(title, message, type = 'success') {
  const toastContainer = document.querySelector('.toast-container') || createToastContainer();
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = 'fa-check-circle';
  if (type === 'error') icon = 'fa-exclamation-circle';
  if (type === 'warning') icon = 'fa-exclamation-triangle';
  
  toast.innerHTML = `
    <div class="toast-icon"><i class="fas ${icon}"></i></div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" onclick="this.parentNode.remove()"><i class="fas fa-times"></i></button>
  `;
  
  toastContainer.appendChild(toast);
  
  // Show toast with animation
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // Auto remove toast after 5 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

// Create toast container if it doesn't exist
function createToastContainer() {
  const container = document.createElement('div');
  container.className = 'toast-container';
  document.body.appendChild(container);
  return container;
}

// Validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Render the appropriate page based on the current path
function renderPage(path) {
  // Check if user is logged in for protected routes
  if ((path === '/browse' || path === '/profile' || path === '/upload' || path === '/my-notes' || path === '/saved-notes') && !currentUser) {
    path = '/login';
    window.history.replaceState({}, '', path);
  }
  
  switch(path) {
    case '/':
      renderHome();
      break;
    case '/login':
      renderLogin();
      break;
    case '/register':
      renderRegister();
      break;
    case '/profile':
      renderProfile();
      break;
    case '/browse':
      renderBrowse();
      break;
    case '/upload':
      renderUpload();
      break;
    case '/my-notes':
      renderMyNotes();
      break;
    case '/saved-notes':
      renderSavedNotes();
      break;
    case '/support':
      renderSupport();
      break;
    default:
      if (currentUser) {
        renderBrowse();
      } else {
        renderHome();
      }
  }
  
  // Add event listeners for mobile menu after rendering page
  setupEventListeners();
  // Initialize theme
  initializeTheme();
}

// Add event listeners
function setupEventListeners() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const closeMobileMenuBtn = document.getElementById('close-mobile-menu');
  
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
  }
  
  if (closeMobileMenuBtn) {
    closeMobileMenuBtn.addEventListener('click', closeMobileMenu);
  }
}

// Navigation bar component
function createNavBar() {
  return `
    <nav class="nav">
      <div class="container nav-container">
        <a href="/" class="logo" onclick="navigate('/'); return false;">
          <img src="/lovable-uploads/6adbb992-d70a-4069-9933-fa9085f43ad7.png" alt="Study Hub" class="logo-img">
          Study Hub
        </a>
        
        <div class="nav-links">
          <a href="/browse" class="nav-link" onclick="navigate('/browse'); return false;">
            <i class="fas fa-book"></i> Browse Notes
          </a>
          
          ${currentUser ? `
            <a href="/upload" class="nav-link" onclick="navigate('/upload'); return false;">
              <i class="fas fa-upload"></i> Upload Notes
            </a>
            <a href="/profile" class="nav-link" onclick="navigate('/profile'); return false;">
              <i class="fas fa-user"></i> Profile
            </a>
            
            <div class="dropdown">
              <button class="dropdown-toggle" onclick="toggleDropdown()">
                <i class="fas fa-ellipsis-h"></i>
              </button>
              <div class="dropdown-menu">
                <a href="/profile" class="dropdown-item" onclick="navigate('/profile'); return false;">
                  <i class="fas fa-user"></i> View Profile
                </a>
                <a href="/my-notes" class="dropdown-item" onclick="navigate('/my-notes'); return false;">
                  <i class="fas fa-file-alt"></i> My Uploads
                </a>
                <a href="/saved-notes" class="dropdown-item" onclick="navigate('/saved-notes'); return false;">
                  <i class="fas fa-bookmark"></i> Saved Notes
                </a>
                <a href="#" class="dropdown-item" onclick="logout(); return false;">
                  <i class="fas fa-sign-out-alt"></i> Logout
                </a>
              </div>
            </div>
            
            <button class="theme-toggle" onclick="toggleDarkMode()">
              <i id="theme-icon" class="fas fa-moon"></i>
              <span id="theme-text">Dark Mode</span>
            </button>
          ` : `
            <a href="/login" class="btn btn-outline" onclick="navigate('/login'); return false;">Login</a>
            <a href="/register" class="btn btn-primary" onclick="navigate('/register'); return false;">Sign Up</a>
            
            <button class="theme-toggle" onclick="toggleDarkMode()">
              <i id="theme-icon" class="fas fa-moon"></i>
              <span id="theme-text">Dark Mode</span>
            </button>
          `}
        </div>
        
        <button class="mobile-menu-toggle">
          <i class="fas fa-bars"></i>
        </button>
      </div>
    </nav>
  `;
}

// Home page
function renderHome() {
  pageContent.innerHTML = `
    ${createNavBar()}
    <main>
      <section class="hero">
        <div class="container">
          <div class="hero-grid">
            <div class="hero-content">
              <span class="hero-badge">For students, by students</span>
              <h1 class="hero-title">Streamline Your Study Materials</h1>
              <p class="hero-description">Study Hub transforms study material sharing for students worldwide. Upload, find, and organize your notes in one place.</p>
              <div class="hero-buttons">
                <a href="/register" class="btn btn-primary" onclick="navigate('/register'); return false;">Get Started</a>
                <a href="/browse" class="btn btn-outline" onclick="navigate('/browse'); return false;">Browse Materials</a>
              </div>
              <div class="hero-users">
                <div class="hero-avatars">
                  <div class="hero-avatar">A</div>
                  <div class="hero-avatar">B</div>
                  <div class="hero-avatar">C</div>
                  <div class="hero-avatar">D</div>
                </div>
                <span class="hero-users-text">Join 10,000+ students already sharing notes</span>
              </div>
            </div>
            <div class="hero-image">
              <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="Students studying together">
              <div class="hero-image-overlay"></div>
            </div>
          </div>
        </div>
      </section>

      <section class="features">
        <div class="container">
          <h2 class="features-title">Why students love Study Hub</h2>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon"><i class="fas fa-upload"></i></div>
              <h3 class="feature-title">Easy Note Sharing</h3>
              <p class="feature-description">Upload and share your study materials with classmates in seconds</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon"><i class="fas fa-search"></i></div>
              <h3 class="feature-title">Find What You Need</h3>
              <p class="feature-description">Search for notes by course, semester, or year to find exactly what you need</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon"><i class="fas fa-user-friends"></i></div>
              <h3 class="feature-title">Build Your Network</h3>
              <p class="feature-description">Connect with other students in your courses and collaborate effectively</p>
            </div>
          </div>
        </div>
      </section>
    </main>
    ${createFooter()}
  `;
}

// Login page
function renderLogin() {
  pageContent.innerHTML = `
    ${createNavBar()}
    <div class="auth-container">
      <div class="auth-content">
        <div class="auth-card">
          <div class="auth-header">
            <h2 class="auth-title">Welcome back</h2>
            <p class="auth-subtitle">Sign in to your account</p>
          </div>
          <form id="login-form" onsubmit="handleLogin(event)">
            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" class="form-input" id="login-email" required>
              <div class="form-error" id="email-error"></div>
            </div>
            <div class="form-group">
              <label class="form-label">Password</label>
              <input type="password" class="form-input" id="login-password" required>
              <div class="form-error" id="password-error"></div>
            </div>
            <div class="form-footer">
              <label class="form-checkbox">
                <input type="checkbox" id="remember-me"> Remember me
              </label>
              <a href="#" class="auth-link">Forgot password?</a>
            </div>
            <button type="submit" class="btn btn-primary auth-button">Sign In</button>
          </form>
          <div class="auth-divider">
            <span>or continue with</span>
          </div>
          <div class="social-buttons">
            <button class="social-button">Google</button>
            <button class="social-button">GitHub</button>
          </div>
          <p class="auth-footer">
            Don't have an account? 
            <a href="/register" class="auth-link" onclick="navigate('/register'); return false;">Sign up</a>
          </p>
        </div>
      </div>
    </div>
    ${createFooter()}
  `;
}

// Register page
function renderRegister() {
  pageContent.innerHTML = `
    ${createNavBar()}
    <div class="auth-container">
      <div class="auth-content">
        <div class="auth-card">
          <div class="auth-header">
            <h2 class="auth-title">Create an account</h2>
            <p class="auth-subtitle">Start sharing your study materials</p>
          </div>
          <form id="register-form" onsubmit="handleRegister(event)">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input type="text" class="form-input" id="register-name" required>
              <div class="form-error" id="name-error"></div>
            </div>
            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" class="form-input" id="register-email" required>
              <div class="form-error" id="register-email-error"></div>
            </div>
            <div class="form-group">
              <label class="form-label">Password</label>
              <input type="password" class="form-input" id="register-password" required>
              <div class="form-error" id="register-password-error"></div>
            </div>
            <div class="form-group">
              <label class="form-label">Confirm Password</label>
              <input type="password" class="form-input" id="confirm-password" required>
              <div class="form-error" id="confirm-password-error"></div>
            </div>
            <button type="submit" class="btn btn-primary auth-button">Sign Up</button>
          </form>
          <div class="auth-divider">
            <span>or continue with</span>
          </div>
          <div class="social-buttons">
            <button class="social-button">Google</button>
            <button class="social-button">GitHub</button>
          </div>
          <p class="auth-footer">
            Already have an account? 
            <a href="/login" class="auth-link" onclick="navigate('/login'); return false;">Sign in</a>
          </p>
        </div>
      </div>
    </div>
    ${createFooter()}
  `;
}

// Profile page
function renderProfile() {
  pageContent.innerHTML = `
    ${createNavBar()}
    <div class="container profile-container">
      <div class="profile-header">
        <div class="profile-avatar">
          <img src="${currentUser?.avatar || '#'}" alt="Profile" onerror="this.parentNode.innerHTML = '${currentUser?.name?.charAt(0) || 'U'}'">
        </div>
        <div class="profile-info">
          <h1 class="profile-name">${currentUser?.name || 'User'}</h1>
          <p class="profile-meta">${currentUser?.email || 'user@example.com'}</p>
          <button class="btn btn-outline" onclick="openEditProfileModal()">Edit Profile</button>
        </div>
      </div>
      
      <div class="profile-tabs">
        <ul class="tabs-list">
          <li class="tab-item active" onclick="switchProfileTab('my-notes', this)">My Notes</li>
          <li class="tab-item" onclick="switchProfileTab('saved-notes', this)">Saved Notes</li>
          <li class="tab-item" onclick="switchProfileTab('settings', this)">Settings</li>
        </ul>
      </div>
      
      <div id="profile-tab-content">
        <div id="my-notes" class="notes-grid">
          ${renderUserNotes()}
        </div>
      </div>
    </div>
    ${createFooter()}
  `;
}

// Switch profile tabs
function switchProfileTab(tabId, element) {
  // Update active tab
  const tabs = document.querySelectorAll('.tab-item');
  tabs.forEach(tab => tab.classList.remove('active'));
  element.classList.add('active');
  
  // Update tab content
  const tabContent = document.getElementById('profile-tab-content');
  
  switch(tabId) {
    case 'my-notes':
      tabContent.innerHTML = `<div id="my-notes" class="notes-grid">${renderUserNotes()}</div>`;
      break;
    case 'saved-notes':
      tabContent.innerHTML = `<div id="saved-notes" class="notes-grid">${renderSavedNotesContent()}</div>`;
      break;
    case 'settings':
      tabContent.innerHTML = `
        <div id="settings">
          <div class="auth-card" style="max-width: 100%;">
            <h3 class="auth-title" style="text-align: left; margin-bottom: 1.5rem;">Account Settings</h3>
            <form id="settings-form" onsubmit="saveAccountSettings(event)">
              <div class="form-group">
                <label class="form-label">Full Name</label>
                <input type="text" class="form-input" id="settings-name" value="${currentUser?.name || ''}" required>
              </div>
              <div class="form-group">
                <label class="form-label">Email</label>
                <input type="email" class="form-input" id="settings-email" value="${currentUser?.email || ''}" required>
              </div>
              <div class="form-group">
                <label class="form-label">Current Password</label>
                <input type="password" class="form-input" id="current-password">
                <div class="form-error" id="current-password-error"></div>
              </div>
              <div class="form-group">
                <label class="form-label">New Password (leave blank to keep current)</label>
                <input type="password" class="form-input" id="new-password">
                <div class="form-error" id="new-password-error"></div>
              </div>
              <div class="form-group">
                <label class="form-label">Confirm New Password</label>
                <input type="password" class="form-input" id="confirm-new-password">
                <div class="form-error" id="confirm-new-password-error"></div>
              </div>
              <div style="display: flex; justify-content: flex-end;">
                <button type="submit" class="btn btn-primary" style="width: auto;">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      `;
      break;
  }
}

// Save account settings
function saveAccountSettings(event) {
  event.preventDefault();
  
  const name = document.getElementById('settings-name').value.trim();
  const email = document.getElementById('settings-email').value.trim();
  const currentPassword = document.getElementById('current-password').value;
  const newPassword = document.getElementById('new-password').value;
  const confirmNewPassword = document.getElementById('confirm-new-password').value;
  
  // Validate email
  if (!isValidEmail(email)) {
    document.getElementById('settings-email').classList.add('error');
    return;
  }
  
  // Validate new password if provided
  if (newPassword) {
    if (newPassword.length < 6) {
      document.getElementById('new-password-error').textContent = 'Password must be at least 6 characters';
      return;
    }
    
    if (newPassword !== confirmNewPassword) {
      document.getElementById('confirm-new-password-error').textContent = 'Passwords do not match';
      return;
    }
  }
  
  // Update user data
  currentUser = {
    ...currentUser,
    name,
    email
  };
  
  // Save to localStorage
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  
  showToast('Success', 'Your account settings have been updated');
}

// Render user's notes
function renderUserNotes() {
  if (userNotes.length === 0) {
    return `
      <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
        <div style="margin-bottom: 1rem; font-size: 4rem; color: var(--gray-300);"><i class="fas fa-file-alt"></i></div>
        <h3 class="feature-title">No notes uploaded yet</h3>
        <p class="feature-description" style="margin-bottom: 1.5rem;">Start sharing your knowledge by uploading your study materials</p>
        <a href="/upload" class="btn btn-primary" onclick="navigate('/upload'); return false;">Upload Notes</a>
      </div>
    `;
  }
  
  return userNotes.map(note => `
    <div class="note-card">
      <img src="${note.image || '/lovable-uploads/2b56f43b-f3b9-4feb-acc7-529ae390f16e.png'}" alt="${note.title}" class="note-image">
      <div class="note-content">
        <div class="note-meta">
          <span>${note.course}</span>
          <span>${note.year}</span>
        </div>
        <h3 class="note-title">${note.title}</h3>
        <p class="note-desc">${note.description}</p>
        <div class="note-footer">
          <span>Uploaded ${getRelativeTime(note.date)}</span>
          <button class="btn btn-outline" onclick="deleteNote(${note.id})">Delete</button>
        </div>
      </div>
    </div>
  `).join('');
}

// Render saved notes
function renderSavedNotesContent() {
  if (savedNotes.length === 0) {
    return `
      <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
        <div style="margin-bottom: 1rem; font-size: 4rem; color: var(--gray-300);"><i class="fas fa-bookmark"></i></div>
        <h3 class="feature-title">No saved notes yet</h3>
        <p class="feature-description" style="margin-bottom: 1.5rem;">Browse notes and save them for later</p>
        <a href="/browse" class="btn btn-primary" onclick="navigate('/browse'); return false;">Browse Notes</a>
      </div>
    `;
  }
  
  return savedNotes.map(note => `
    <div class="note-card">
      <img src="${note.image || '/lovable-uploads/2b56f43b-f3b9-4feb-acc7-529ae390f16e.png'}" alt="${note.title}" class="note-image">
      <div class="note-content">
        <div class="note-meta">
          <span>${note.course}</span>
          <span>${note.year}</span>
        </div>
        <h3 class="note-title">${note.title}</h3>
        <p class="note-desc">${note.description}</p>
        <div class="note-footer">
          <div class="note-user">
            <div class="user-avatar">${note.author ? note.author.charAt(0) : 'U'}</div>
            <span>${note.author || 'Unknown'}</span>
          </div>
          <button class="btn btn-outline" onclick="unsaveNote(${note.id})">Remove</button>
        </div>
      </div>
    </div>
  `).join('');
}

// Browse page
function renderBrowse() {
  pageContent.innerHTML = `
    ${createNavBar()}
    <div class="container browse-container">
      <div class="browse-header">
        <h1 class="browse-title">Browse Study Materials</h1>
        <p class="browse-subtitle">Find notes shared by other students</p>
      </div>
      
      <div class="search-bar">
        <input type="text" id="search-input" class="search-input" placeholder="Search by course name...">
        <button class="btn btn-primary" onclick="searchNotes()">Search</button>
      </div>
      
      <div class="sort-options">
        <label>Sort by: 
          <select id="sort-select" class="sort-select" onchange="sortNotes(this.value)">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="az">A-Z</option>
            <option value="za">Z-A</option>
          </select>
        </label>
      </div>
      
      <div class="filters">
        <div class="filter-group">
          <select id="course-filter" class="filter-select" onchange="filterNotes()">
            <option value="">All Courses</option>
            <option>Computer Science</option>
            <option>Engineering</option>
            <option>Business</option>
            <option>Psychology</option>
            <option>Mathematics</option>
          </select>
        </div>
        <div class="filter-group">
          <select id="year-filter" class="filter-select" onchange="filterNotes()">
            <option value="">All Years</option>
            <option>Year 1</option>
            <option>Year 2</option>
            <option>Year 3</option>
            <option>Year 4</option>
          </select>
        </div>
        <div class="filter-group">
          <select id="semester-filter" class="filter-select" onchange="filterNotes()">
            <option value="">All Semesters</option>
            <option>Semester 1</option>
            <option>Semester 2</option>
          </select>
        </div>
      </div>
      
      <div id="notes-container" class="notes-grid">
        ${renderNotes()}
      </div>
    </div>
    ${createFooter()}
  `;
}

// Upload page
function renderUpload() {
  pageContent.innerHTML = `
    ${createNavBar()}
    <div class="container upload-container">
      <div class="upload-header">
        <h1 class="upload-title">Upload Study Materials</h1>
        <p class="upload-subtitle">Share your knowledge with other students</p>
      </div>
      
      <div class="upload-form">
        <form id="upload-form" onsubmit="handleUpload(event)">
          <div class="form-group">
            <label class="form-label">Title</label>
            <input type="text" class="form-input" id="note-title" required>
          </div>
          
          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea class="form-input" id="note-description" rows="3" required></textarea>
          </div>
          
          <div class="form-group">
            <label class="form-label">Course</label>
            <input type="text" class="form-input" id="note-course" required>
          </div>
          
          <div class="form-group">
            <div style="display: flex; gap: 1rem;">
              <div style="flex: 1;">
                <label class="form-label">Year</label>
                <select class="form-input" id="note-year" required>
                  <option value="">Select Year</option>
                  <option>Year 1</option>
                  <option>Year 2</option>
                  <option>Year 3</option>
                  <option>Year 4</option>
                </select>
              </div>
              <div style="flex: 1;">
                <label class="form-label">Semester</label>
                <select class="form-input" id="note-semester" required>
                  <option value="">Select Semester</option>
                  <option>Semester 1</option>
                  <option>Semester 2</option>
                </select>
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">Upload File</label>
            <div class="file-drop" id="file-drop" onclick="document.getElementById('file-input').click()">
              <div class="file-drop-icon">
                <i class="fas fa-cloud-upload-alt"></i>
              </div>
              <p class="file-drop-text">Drag and drop your file here, or click to browse</p>
              <p class="file-drop-hint">Supports PDF, DOCX, PPTX (Max 10MB)</p>
              <input type="file" id="file-input" style="display: none;" accept=".pdf,.doc,.docx,.ppt,.pptx">
            </div>
          </div>
          
          <div id="file-preview-container" style="display: none;">
            <div class="file-preview">
              <div class="file-preview-icon">
                <i class="fas fa-file-pdf"></i>
              </div>
              <div class="file-preview-info">
                <div class="file-preview-name" id="file-name"></div>
                <div class="file-preview-size" id="file-size"></div>
              </div>
              <button type="button" class="file-preview-remove" onclick="removeFile()">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
          
          <div id="upload-progress-container" style="display: none;">
            <div class="upload-progress">
              <div class="upload-progress-bar" id="upload-progress-bar" style="width: 0%"></div>
            </div>
          </div>
          
          <button type="submit" class="btn btn-primary">Upload Note</button>
        </form>
      </div>
    </div>
    ${createFooter()}
  `;
  
  // Set up file input change event
  const fileInput = document.getElementById('file-input');
  fileInput.addEventListener('change', handleFileSelect);
  
  // Set up drag and drop
  const dropZone = document.getElementById('file-drop');
  
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = 'var(--studyhub-500)';
    dropZone.style.backgroundColor = 'var(--studyhub-50)';
  });
  
  dropZone.addEventListener('dragleave', () => {
    dropZone.style.borderColor = '';
    dropZone.style.backgroundColor = '';
  });
  
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '';
    dropZone.style.backgroundColor = '';
    
    if (e.dataTransfer.files.length) {
      fileInput.files = e.dataTransfer.files;
      handleFileSelect();
    }
  });
}

// Handle file selection
function handleFileSelect() {
  const fileInput = document.getElementById('file-input');
  const file = fileInput.files[0];
  
  if (file) {
    const filePreviewContainer = document.getElementById('file-preview-container');
    const fileName = document.getElementById('file-name');
    const fileSize = document.getElementById('file-size');
    
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    
    filePreviewContainer.style.display = 'block';
    
    // Update preview icon based on file type
    const previewIcon = document.querySelector('.file-preview-icon i');
    if (file.type.includes('pdf')) {
      previewIcon.className = 'fas fa-file-pdf';
    } else if (file.type.includes('word') || file.type.includes('doc')) {
      previewIcon.className = 'fas fa-file-word';
    } else if (file.type.includes('powerpoint') || file.type.includes('ppt')) {
      previewIcon.className = 'fas fa-file-powerpoint';
    } else {
      previewIcon.className = 'fas fa-file';
    }
  }
}

// Format file size
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Remove selected file
function removeFile() {
  const fileInput = document.getElementById('file-input');
  const filePreviewContainer = document.getElementById('file-preview-container');
  
  fileInput.value = '';
  filePreviewContainer.style.display = 'none';
}

// Handle upload form submission
function handleUpload(event) {
  event.preventDefault();
  
  const title = document.getElementById('note-title').value.trim();
  const description = document.getElementById('note-description').value.trim();
  const course = document.getElementById('note-course').value.trim();
  const year = document.getElementById('note-year').value;
  const semester = document.getElementById('note-semester').value;
  const fileInput = document.getElementById('file-input');
  
  if (!title || !description || !course || !year || !semester) {
    showToast('Error', 'Please fill in all required fields', 'error');
    return;
  }
  
  if (!fileInput.files.length) {
    showToast('Error', 'Please select a file to upload', 'error');
    return;
  }
  
  // Show progress
  const progressContainer = document.getElementById('upload-progress-container');
  const progressBar = document.getElementById('upload-progress-bar');
  progressContainer.style.display = 'block';
  
  // Simulate upload progress
  let progress = 0;
  const interval = setInterval(() => {
    progress += 5;
    progressBar.style.width = `${progress}%`;
    
    if (progress >= 100) {
      clearInterval(interval);
      completeUpload(title, description, course, year, semester, fileInput.files[0]);
    }
  }, 100);
}

// Complete upload after progress is done
function completeUpload(title, description, course, year, semester, file) {
  // Get selected file type
  let fileType = '';
  if (file.type.includes('pdf')) {
    fileType = 'PDF';
  } else if (file.type.includes('word') || file.type.includes('doc')) {
    fileType = 'DOCX';
  } else if (file.type.includes('powerpoint') || file.type.includes('ppt')) {
    fileType = 'PPTX';
  } else {
    fileType = 'Document';
  }
  
  // Create new note object
  const newNote = {
    id: Date.now(),
    title,
    description,
    course,
    year,
    semester,
    fileType,
    fileName: file.name,
    fileSize: formatFileSize(file.size),
    date: new Date().toISOString(),
    author: currentUser.name,
    authorId: currentUser.id,
    image: '/lovable-uploads/2b56f43b-f3b9-4feb-acc7-529ae390f16e.png'
  };
  
  // Add to user's notes
  userNotes.push(newNote);
  localStorage.setItem('userNotes', JSON.stringify(userNotes));
  
  // Add to all notes
  notesData.push(newNote);
  localStorage.setItem('notesData', JSON.stringify(notesData));
  
  showToast('Success', 'Your note has been uploaded successfully');
  
  // Redirect to my notes page
  setTimeout(() => {
    navigate('/my-notes');
  }, 1500);
}

// Render my notes page
function renderMyNotes() {
  pageContent.innerHTML = `
    ${createNavBar()}
    <div class="container browse-container">
      <div class="browse-header">
        <h1 class="browse-title">My Uploaded Notes</h1>
        <p class="browse-subtitle">Manage your uploaded study materials</p>
      </div>
      
      <div id="notes-container" class="notes-grid">
        ${renderUserNotes()}
      </div>
    </div>
    ${createFooter()}
  `;
}

// Render saved notes page
function renderSavedNotes() {
  pageContent.innerHTML = `
    ${createNavBar()}
    <div class="container browse-container">
      <div class="browse-header">
        <h1 class="browse-title">Saved Notes</h1>
        <p class="browse-subtitle">Your collection of saved study materials</p>
      </div>
      
      <div id="notes-container" class="notes-grid">
        ${renderSavedNotesContent()}
      </div>
    </div>
    ${createFooter()}
  `;
}

// Support page
function renderSupport() {
  pageContent.innerHTML = `
    ${createNavBar()}
    <div class="container browse-container">
      <div class="browse-header">
        <h1 class="browse-title">Support Center</h1>
        <p class="browse-subtitle">Get help with Study Hub</p>
      </div>
      
      <div class="auth-card" style="max-width: 100%; margin-bottom: 2rem;">
        <h3 class="feature-title">Contact Our Support Team</h3>
        <div class="support-team">
          <div class="support-person">
            <p class="support-name">Nicole Tabby</p>
            <p class="support-phone">+918792721830</p>
          </div>
          <div class="support-person">
            <p class="support-name">Aravind Yavad</p>
            <p class="support-phone">+918197910698</p>
          </div>
          <div class="support-person">
            <p class="support-name">Vishwas Gowda</p>
            <p class="support-phone">+918073785737</p>
          </div>
        </div>
      </div>
      
      <div class="auth-card" style="max-width: 100%;">
        <h3 class="feature-title">Common Questions</h3>
        <div style="margin-top: 1.5rem;">
          <div style="margin-bottom: 1.5rem;">
            <p style="font-weight: 500; margin-bottom: 0.5rem;">How do I upload notes?</p>
            <p style="color: var(--gray-600);">Click on the "Upload Notes" link in the navigation bar, fill out the form with your note details, and upload your file.</p>
          </div>
          <div style="margin-bottom: 1.5rem;">
            <p style="font-weight: 500; margin-bottom: 0.5rem;">What file formats are supported?</p>
            <p style="color: var(--gray-600);">Study Hub supports PDF, Word documents (DOC/DOCX), and PowerPoint presentations (PPT/PPTX).</p>
          </div>
          <div>
            <p style="font-weight: 500; margin-bottom: 0.5rem;">How do I save notes?</p>
            <p style="color: var(--gray-600);">When browsing notes, click the bookmark icon or "Save" button to add notes to your saved collection.</p>
          </div>
        </div>
      </div>
    </div>
    ${createFooter()}
  `;
}

// Render notes for the browse page
function renderNotes() {
  if (notesData.length === 0) {
    // Sample notes for new users
    const sampleNotes = [
      {
        id: 1,
        title: "Introduction to Computer Science",
        description: "Comprehensive notes on basic programming concepts and algorithms",
        course: "Computer Science",
        year: "Year 1",
        semester: "Semester 1",
        author: "John Smith",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        image: "/lovable-uploads/2b56f43b-f3b9-4feb-acc7-529ae390f16e.png"
      },
      {
        id: 2,
        title: "Engineering Mathematics",
        description: "Complete semester notes with solved examples",
        course: "Engineering",
        year: "Year 2",
        semester: "Semester 1",
        author: "Sarah Johnson",
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        image: "/lovable-uploads/6adbb992-d70a-4069-9933-fa9085f43ad7.png"
      },
      {
        id: 3,
        title: "Business Ethics",
        description: "Case studies and theoretical frameworks for ethical decision-making",
        course: "Business",
        year: "Year 3",
        semester: "Semester 2",
        author: "Michael Brown",
        date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
        image: "/lovable-uploads/f92f06ad-f147-4cff-9f89-4492a22989f8.png"
      }
    ];
    
    notesData = [...sampleNotes, ...userNotes];
    localStorage.setItem('notesData', JSON.stringify(notesData));
  }
  
  // Combine sample notes with user uploaded notes
  const allNotes = [...notesData, ...userNotes];
  
  if (allNotes.length === 0) {
    return `
      <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
        <p>No notes found. Be the first to upload study materials!</p>
        <a href="/upload" class="btn btn-primary" style="margin-top: 1rem;" onclick="navigate('/upload'); return false;">Upload Notes</a>
      </div>
    `;
  }
  
  return allNotes.map(note => `
    <div class="note-card">
      <img src="${note.image || '/lovable-uploads/2b56f43b-f3b9-4feb-acc7-529ae390f16e.png'}" alt="${note.title}" class="note-image">
      <div class="note-content">
        <div class="note-meta">
          <span>${note.course}</span>
          <span>${note.year}</span>
        </div>
        <h3 class="note-title">${note.title}</h3>
        <p class="note-desc">${note.description}</p>
        <div class="note-footer">
          <div class="note-user">
            <div class="user-avatar">${note.author ? note.author.charAt(0) : 'U'}</div>
            <span>${note.author || 'Unknown'}</span>
          </div>
          <button class="btn btn-outline" onclick="saveNote(${note.id})">Save</button>
        </div>
      </div>
    </div>
  `).join('');
}

// Get relative time from date string
function getRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSecs < 60) {
    return 'just now';
  } else if (diffMins < 60) {
    return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else if (diffDays < 30) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString();
  }
}

// Save a note
function saveNote(noteId) {
  const note = notesData.find(n => n.id === noteId);
  if (!note) return;
  
  // Check if already saved
  if (savedNotes.some(n => n.id === noteId)) {
    showToast('Info', 'This note is already in your saved collection');
    return;
  }
  
  // Add to saved notes
  savedNotes.push(note);
  localStorage.setItem('savedNotes', JSON.stringify(savedNotes));
  
  showToast('Success', 'Note saved to your collection');
}

// Remove a saved note
function unsaveNote(noteId) {
  savedNotes = savedNotes.filter(n => n.id !== noteId);
  localStorage.setItem('savedNotes', JSON.stringify(savedNotes));
  
  // Re-render the saved notes page
  if (window.location.pathname === '/saved-notes') {
    renderSavedNotes();
  } else {
    // Re-render the saved notes tab if on profile page
    const tabContent = document.getElementById('profile-tab-content');
    if (tabContent && document.querySelector('.tab-item.active').textContent === 'Saved Notes') {
      tabContent.innerHTML = `<div id="saved-notes" class="notes-grid">${renderSavedNotesContent()}</div>`;
    }
  }
  
  showToast('Success', 'Note removed from your collection');
}

// Delete a note
function deleteNote(noteId) {
  // Remove from user notes
  userNotes = userNotes.filter(n => n.id !== noteId);
  localStorage.setItem('userNotes', JSON.stringify(userNotes));
  
  // Remove from all notes
  notesData = notesData.filter(n => n.id !== noteId);
  localStorage.setItem('notesData', JSON.stringify(notesData));
  
  // Remove from saved notes if present
  if (savedNotes.some(n => n.id === noteId)) {
    savedNotes = savedNotes.filter(n => n.id !== noteId);
    localStorage.setItem('savedNotes', JSON.stringify(savedNotes));
  }
  
  // Re-render the current page
  if (window.location.pathname === '/my-notes') {
    renderMyNotes();
  } else {
    // Re-render the my notes tab if on profile page
    const tabContent = document.getElementById('profile-tab-content');
    if (tabContent && document.querySelector('.tab-item.active').textContent === 'My Notes') {
      tabContent.innerHTML = `<div id="my-notes" class="notes-grid">${renderUserNotes()}</div>`;
    }
  }
  
  showToast('Success', 'Note deleted successfully');
}

// Search notes
function searchNotes() {
  const searchInput = document.getElementById('search-input').value.toLowerCase();
  
  if (!searchInput.trim()) {
    document.getElementById('notes-container').innerHTML = renderNotes();
    return;
  }
  
  // Filter notes based on search input
  const filteredNotes = notesData.filter(note => 
    note.title.toLowerCase().includes(searchInput) || 
    note.description.toLowerCase().includes(searchInput) || 
    note.course.toLowerCase().includes(searchInput)
  );
  
  if (filteredNotes.length === 0) {
    document.getElementById('notes-container').innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
        <p>No notes found matching your search criteria.</p>
      </div>
    `;
  } else {
    document.getElementById('notes-container').innerHTML = filteredNotes.map(note => `
      <div class="note-card">
        <img src="${note.image || '/lovable-uploads/2b56f43b-f3b9-4feb-acc7-529ae390f16e.png'}" alt="${note.title}" class="note-image">
        <div class="note-content">
          <div class="note-meta">
            <span>${note.course}</span>
            <span>${note.year}</span>
          </div>
          <h3 class="note-title">${note.title}</h3>
          <p class="note-desc">${note.description}</p>
          <div class="note-footer">
            <div class="note-user">
              <div class="user-avatar">${note.author ? note.author.charAt(0) : 'U'}</div>
              <span>${note.author || 'Unknown'}</span>
            </div>
            <button class="btn btn-outline" onclick="saveNote(${note.id})">Save</button>
          </div>
        </div>
      </div>
    `).join('');
  }
}

// Sort notes
function sortNotes(sortBy) {
  const notesContainer = document.getElementById('notes-container');
  
  // Clone notes array to avoid modifying original data
  let sortedNotes = [...notesData];
  
  switch (sortBy) {
    case 'newest':
      sortedNotes.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    case 'oldest':
      sortedNotes.sort((a, b) => new Date(a.date) - new Date(b.date));
      break;
    case 'az':
      sortedNotes.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'za':
      sortedNotes.sort((a, b) => b.title.localeCompare(a.title));
      break;
  }
  
  notesContainer.innerHTML = sortedNotes.map(note => `
    <div class="note-card">
      <img src="${note.image || '/lovable-uploads/2b56f43b-f3b9-4feb-acc7-529ae390f16e.png'}" alt="${note.title}" class="note-image">
      <div class="note-content">
        <div class="note-meta">
          <span>${note.course}</span>
          <span>${note.year}</span>
        </div>
        <h3 class="note-title">${note.title}</h3>
        <p class="note-desc">${note.description}</p>
        <div class="note-footer">
          <div class="note-user">
            <div class="user-avatar">${note.author ? note.author.charAt(0) : 'U'}</div>
            <span>${note.author || 'Unknown'}</span>
          </div>
          <button class="btn btn-outline" onclick="saveNote(${note.id})">Save</button>
        </div>
      </div>
    </div>
  `).join('');
}

// Filter notes
function filterNotes() {
  const courseFilter = document.getElementById('course-filter').value;
  const yearFilter = document.getElementById('year-filter').value;
  const semesterFilter = document.getElementById('semester-filter').value;
  
  // Filter notes based on selected filters
  let filteredNotes = notesData.filter(note => {
    return (!courseFilter || note.course === courseFilter) &&
           (!yearFilter || note.year === yearFilter) &&
           (!semesterFilter || note.semester === semesterFilter);
  });
  
  // Update the notes display
  const notesContainer = document.getElementById('notes-container');
  
  if (filteredNotes.length === 0) {
    notesContainer.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
        <p>No notes found matching your filter criteria.</p>
      </div>
    `;
  } else {
    notesContainer.innerHTML = filteredNotes.map(note => `
      <div class="note-card">
        <img src="${note.image || '/lovable-uploads/2b56f43b-f3b9-4feb-acc7-529ae390f16e.png'}" alt="${note.title}" class="note-image">
        <div class="note-content">
          <div class="note-meta">
            <span>${note.course}</span>
            <span>${note.year}</span>
          </div>
          <h3 class="note-title">${note.title}</h3>
          <p class="note-desc">${note.description}</p>
          <div class="note-footer">
            <div class="note-user">
              <div class="user-avatar">${note.author ? note.author.charAt(0) : 'U'}</div>
              <span>${note.author || 'Unknown'}</span>
            </div>
            <button class="btn btn-outline" onclick="saveNote(${note.id})">Save</button>
          </div>
        </div>
      </div>
    `).join('');
  }
}

// Footer component
function createFooter() {
  return `
    <footer class="footer">
      <div class="container footer-container">
        <div class="footer-logo">
          <span class="logo">
            <img src="/lovable-uploads/6adbb992-d70a-4069-9933-fa9085f43ad7.png" alt="Study Hub" class="logo-img">
            Study Hub
          </span>
          <p class="footer-tagline">Simplifying study material sharing since 2023</p>
        </div>
        <div class="footer-links">
          <div class="footer-column">
            <h4>Platform</h4>
            <ul>
              <li><a href="/browse" onclick="navigate('/browse'); return false;">Browse Notes</a></li>
              <li><a href="/upload" onclick="navigate('/upload'); return false;">Upload Materials</a></li>
            </ul>
          </div>
          <div class="footer-column">
            <h4>Company</h4>
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/support" onclick="navigate('/support'); return false;">Support</a></li>
              <li><a href="/privacy">Privacy</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="footer-copyright">
          © ${new Date().getFullYear()} Study Hub. All rights reserved.
        </div>
      </div>
    </footer>
  `;
}

// Handle form submissions
function handleLogin(event) {
  event.preventDefault();
  
  // Reset error messages
  document.getElementById('email-error').textContent = '';
  document.getElementById('password-error').textContent = '';
  
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const rememberMe = document.getElementById('remember-me').checked;
  
  // Validate email format
  if (!isValidEmail(email)) {
    document.getElementById('email-error').textContent = 'Please enter a valid email address';
    return;
  }
  
  // Validate password length
  if (password.length < 6) {
    document.getElementById('password-error').textContent = 'Password must be at least 6 characters';
    return;
  }
  
  // Simulate login - in a real app this would validate against a server
  currentUser = {
    id: 1,
    name: 'Demo User',
    email: email
  };
  
  // Store user data in localStorage for persistence
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  localStorage.setItem('isLoggedIn', 'true');
  
  showToast('Success', 'Logged in successfully');
  
  // Navigate to browse page after successful login
  setTimeout(() => {
    navigate('/browse');
  }, 1000);
}

function handleRegister(event) {
  event.preventDefault();
  
  // Reset error messages
  document.getElementById('name-error').textContent = '';
  document.getElementById('register-email-error').textContent = '';
  document.getElementById('register-password-error').textContent = '';
  document.getElementById('confirm-password-error').textContent = '';
  
  const name = document.getElementById('register-name').value.trim();
  const email = document.getElementById('register-email').value.trim();
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  
  // Validate name
  if (name.length < 2) {
    document.getElementById('name-error').textContent = 'Name is too short';
    return;
  }
  
  // Validate email format
  if (!isValidEmail(email)) {
    document.getElementById('register-email-error').textContent = 'Please enter a valid email address';
    return;
  }
  
  // Validate password length
  if (password.length < 6) {
    document.getElementById('register-password-error').textContent = 'Password must be at least 6 characters';
    return;
  }
  
  // Confirm passwords match
  if (password !== confirmPassword) {
    document.getElementById('confirm-password-error').textContent = 'Passwords do not match';
    return;
  }
  
  // Simulate registration - in a real app this would send data to a server
  currentUser = {
    id: Date.now(), // Use timestamp as a simple ID
    name: name,
    email: email
  };
  
  // Store user data in localStorage for persistence
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  localStorage.setItem('isLoggedIn', 'true');
  
  showToast('Success', 'Account created successfully');
  
  // Navigate to browse page after successful registration
  setTimeout(() => {
    navigate('/browse');
  }, 1000);
}

function logout() {
  // Clear user data
  currentUser = null;
  localStorage.removeItem('currentUser');
  localStorage.removeItem('isLoggedIn');
  
  // Show toast notification
  showToast('Success', 'Logged out successfully');
  
  // Navigate to login page
  setTimeout(() => {
    navigate('/login');
  }, 500);
}

// Handle browser navigation
window.addEventListener('popstate', () => {
  renderPage(window.location.pathname);
});

// Load user data from localStorage when the page loads
document.addEventListener('DOMContentLoaded', () => {
  // Try to restore user session
  const storedUser = localStorage.getItem('currentUser');
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (storedUser && isLoggedIn) {
    try {
      currentUser = JSON.parse(storedUser);
    } catch (e) {
      currentUser = null;
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isLoggedIn');
    }
  }
  
  // Load saved and uploaded notes
  const storedNotes = localStorage.getItem('notesData');
  const storedSavedNotes = localStorage.getItem('savedNotes');
  const storedUserNotes = localStorage.getItem('userNotes');
  
  if (storedNotes) {
    try {
      notesData = JSON.parse(storedNotes);
    } catch (e) {
      notesData = [];
    }
  }
  
  if (storedSavedNotes) {
    try {
      savedNotes = JSON.parse(storedSavedNotes);
    } catch (e) {
      savedNotes = [];
    }
  }
  
  if (storedUserNotes) {
    try {
      userNotes = JSON.parse(storedUserNotes);
    } catch (e) {
      userNotes = [];
    }
  }
  
  // Initialize theme
  darkMode = localStorage.getItem('darkMode') === 'true';
  
  // Initial render
  renderPage(window.location.pathname);
});
