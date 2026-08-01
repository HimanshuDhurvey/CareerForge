export const authService = {
  /**
   * Logs in a user with credentials.
   * @param {Object} credentials
   * @param {string} credentials.email
   * @param {string} credentials.password
   * @returns {Promise<Object>}
   */
  login: async (credentials) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Validate credentials structure
        if (!credentials.email || !credentials.password) {
          reject(new Error("Email and password are required."));
          return;
        }

        if (credentials.password.length < 8) {
          reject(new Error("Password must be at least 8 characters."));
          return;
        }

        // Mock a successful response
        const mockResponse = {
          success: true,
          token: "sample-jwt-token",
          user: {
            id: 1,
            name: "John Doe",
            email: credentials.email,
          },
        };

        // Persist session
        try {
          localStorage.setItem("token", mockResponse.token);
          localStorage.setItem("user", JSON.stringify(mockResponse.user));
        } catch (e) {
          console.error("Failed to write credentials to localStorage:", e);
        }

        resolve(mockResponse);
      }, 1000);
    });
  },

  /**
   * Registers a user with credentials.
   * @param {Object} userData
   * @param {string} userData.name
   * @param {string} userData.email
   * @param {string} userData.password
   * @returns {Promise<Object>}
   */
  register: async (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!userData.name || !userData.email || !userData.password) {
          reject(new Error("Registration failed. Please try again."));
          return;
        }

        const mockResponse = {
          success: true,
          message: "Registration successful",
          user: {
            id: 1,
            name: userData.name,
            email: userData.email,
          },
        };

        resolve(mockResponse);
      }, 1000);
    });
  },

  /**
   * Logs out the current user by removing credentials from localStorage.
   */
  logout: () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (e) {
      console.error("Failed to clear credentials from localStorage:", e);
    }
  },

  /**
   * Retrieves the currently logged in user.
   * @returns {Object|null}
   */
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch (e) {
      console.error("Failed to read user from localStorage:", e);
      return null;
    }
  },

  /**
   * Checks if a user session is active.
   * @returns {boolean}
   */
  isAuthenticated: () => {
    try {
      return !!localStorage.getItem("token");
    } catch {
      return false;
    }
  },
};
