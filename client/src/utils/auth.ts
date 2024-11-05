import { JwtPayload, jwtDecode } from 'jwt-decode';






let inactivityTimeout: NodeJS.Timeout;
const refreshThreshold = 10000; // 4 minutes in milliseconds


class AuthService {

  constructor() {
    this.autoLogoutOnTokenExpiry();
    this.resetInactivityTimer = this.resetInactivityTimer.bind(this);
    this.resetInactivityTimer();
  }

  resetInactivityTimer() {
    clearTimeout(inactivityTimeout);
    inactivityTimeout = setTimeout(() => {

      alert("You've been inactive. Please log in again.");
      this.logout();

    } , refreshThreshold);

    // Attach to user activity events
    window.addEventListener('mousemove', this.resetInactivityTimer);
    window.addEventListener('keydown', this.resetInactivityTimer);
    // Initialize the timer on page load
  }


  getProfile() {
    // TODO: return the decoded token
    const token = this.getToken();
    return token ? jwtDecode<JwtPayload>(token) : null;
  }

  loggedIn() {
    // TODO: return a value that indicates if the user is logged in
    const token = this.getToken();
    return token && !this.isTokenExpired(token);
  }

  isTokenExpired(token: string) {
    // TODO: return a value that indicates if the token is expired
    try {
      const decoded: JwtPayload = jwtDecode<JwtPayload>(token);
      if (!decoded.exp) return true;
      return decoded.exp * 1000 < Date.now();
    } catch (error) {
      return true;
    }
  }

  autoLogoutOnTokenExpiry() {
    const token = this.getToken();
    if (!token) return;

    setInterval(() => {
      if (this.isTokenExpired(token)) {
        this.logout();
      }
    }, 5000);
  }


  getToken(): string | null {
    // TODO: return the token
    return localStorage.getItem('token');
  }

  login(idToken: string) {
    // TODO: set the token to localStorage
    // TODO: redirect to the home page
    localStorage.setItem('token', idToken);
    window.location.assign('/'); // Redirect to home page
  }


  logout() {
    // TODO: remove the token from localStorage
    // TODO: redirect to the login page
    localStorage.removeItem('token');
    window.location.assign('/login');
  }
}



export default new AuthService();
