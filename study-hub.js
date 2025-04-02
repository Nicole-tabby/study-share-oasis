
// DOM Elements
const pageContent = document.getElementById('root');
let currentUser = null;

// Router function to handle page navigation
function navigate(path) {
  window.history.pushState({}, '', path);
  renderPage(path);
}

// Render the appropriate page based on the current path
function renderPage(path) {
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
      if (!currentUser) {
        navigate('/login');
        return;
      }
      renderProfile();
      break;
    case '/browse':
      renderBrowse();
      break;
    default:
      renderHome();
  }
}

// Navigation bar component
function createNavBar() {
  return `
    <nav class="nav">
      <div class="container nav-container">
        <a href="/" class="logo" onclick="navigate('/'); return false;">
          <span class="logo-icon">📚</span>
          Study Hub
        </a>
        <div class="nav-links">
          <a href="/browse" class="nav-link" onclick="navigate('/browse'); return false;">Browse</a>
          ${currentUser ? `
            <a href="/profile" class="nav-link" onclick="navigate('/profile'); return false;">Profile</a>
            <button class="btn btn-outline" onclick="logout()">Logout</button>
          ` : `
            <a href="/login" class="btn btn-outline" onclick="navigate('/login'); return false;">Login</a>
            <a href="/register" class="btn btn-primary" onclick="navigate('/register'); return false;">Sign Up</a>
          `}
        </div>
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
              <img src="/lovable-uploads/04a4f175-b3db-4f62-bb4f-c923d862a1d5.png" alt="Study materials">
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
              <div class="feature-icon">1</div>
              <h3 class="feature-title">Easy Note Sharing</h3>
              <p class="feature-description">Upload and share your study materials with classmates in seconds</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">2</div>
              <h3 class="feature-title">Find What You Need</h3>
              <p class="feature-description">Search for notes by course, semester, or year to find exactly what you need</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">3</div>
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
          <form onsubmit="handleLogin(event)">
            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">Password</label>
              <input type="password" class="form-input" required>
            </div>
            <div class="form-footer">
              <label class="form-checkbox">
                <input type="checkbox"> Remember me
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
          <form onsubmit="handleRegister(event)">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input type="text" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label">Password</label>
              <input type="password" class="form-input" required>
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
          <img src="${currentUser?.avatar || '#'}" alt="Profile" onerror="this.innerHTML = 'JD'">
        </div>
        <div class="profile-info">
          <h1 class="profile-name">${currentUser?.name || 'John Doe'}</h1>
          <p class="profile-meta">${currentUser?.email || 'john@example.com'}</p>
          <button class="btn btn-outline">Edit Profile</button>
        </div>
      </div>
      
      <div class="profile-tabs">
        <ul class="tabs-list">
          <li class="tab-item active">My Notes</li>
          <li class="tab-item">Saved Notes</li>
          <li class="tab-item">Settings</li>
        </ul>
      </div>
      
      <div class="notes-grid">
        <!-- Example note cards -->
        <div class="note-card">
          <img src="/lovable-uploads/2b56f43b-f3b9-4feb-acc7-529ae390f16e.png" alt="Note" class="note-image">
          <div class="note-content">
            <div class="note-meta">
              <span>Computer Science</span>
              <span>Year 2</span>
            </div>
            <h3 class="note-title">Data Structures Notes</h3>
            <p class="note-desc">Comprehensive notes on arrays, linked lists, and trees</p>
            <div class="note-footer">
              <span>Updated 2 days ago</span>
              <button class="btn btn-outline">Edit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    ${createFooter()}
  `;
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
      
      <div class="filters">
        <div class="filter-group">
          <select class="filter-select">
            <option value="">All Courses</option>
            <option>Computer Science</option>
            <option>Engineering</option>
            <option>Business</option>
          </select>
        </div>
        <div class="filter-group">
          <select class="filter-select">
            <option value="">All Years</option>
            <option>Year 1</option>
            <option>Year 2</option>
            <option>Year 3</option>
            <option>Year 4</option>
          </select>
        </div>
        <div class="filter-group">
          <select class="filter-select">
            <option value="">All Semesters</option>
            <option>Semester 1</option>
            <option>Semester 2</option>
          </select>
        </div>
      </div>
      
      <div class="notes-grid">
        <!-- Example note cards -->
        <div class="note-card">
          <img src="/lovable-uploads/6adbb992-d70a-4069-9933-fa9085f43ad7.png" alt="Note" class="note-image">
          <div class="note-content">
            <div class="note-meta">
              <span>Engineering</span>
              <span>Year 3</span>
            </div>
            <h3 class="note-title">Circuit Analysis</h3>
            <p class="note-desc">Complete semester notes with diagrams</p>
            <div class="note-footer">
              <div class="note-user">
                <div class="user-avatar">S</div>
                <span>Sarah M.</span>
              </div>
              <span>3 days ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    ${createFooter()}
  `;
}

// Footer component
function createFooter() {
  return `
    <footer class="footer">
      <div class="container footer-container">
        <div class="footer-logo">
          <span class="logo">
            <span class="logo-icon">📚</span>
            Study Hub
          </span>
          <p class="footer-tagline">Simplifying study material sharing since 2023</p>
        </div>
        <div class="footer-links">
          <div class="footer-column">
            <h4>Platform</h4>
            <ul>
              <li><a href="/browse" onclick="navigate('/browse'); return false;">Browse Notes</a></li>
              <li><a href="/upload">Upload Materials</a></li>
              <li><a href="/tools">Study Tools</a></li>
            </ul>
          </div>
          <div class="footer-column">
            <h4>Company</h4>
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/support">Support</a></li>
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
  const [email, password] = event.target.querySelectorAll('input');
  // Simulate login
  currentUser = {
    name: 'John Doe',
    email: email.value,
    avatar: null
  };
  navigate('/profile');
}

function handleRegister(event) {
  event.preventDefault();
  const [name, email, password] = event.target.querySelectorAll('input');
  // Simulate registration
  currentUser = {
    name: name.value,
    email: email.value,
    avatar: null
  };
  navigate('/profile');
}

function logout() {
  currentUser = null;
  navigate('/');
}

// Handle browser navigation
window.addEventListener('popstate', () => {
  renderPage(window.location.pathname);
});

// Initial render
document.addEventListener('DOMContentLoaded', () => {
  renderPage(window.location.pathname);
});
