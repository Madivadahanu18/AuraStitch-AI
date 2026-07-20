/* AuraStitch AI - Dynamic Theme State Persistence Manager */

(function () {
  // Read saved theme from storage, fallback to 'light'
  const savedTheme = localStorage.getItem('aurastitch-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  // Expose globally so components can load and adjust
  window.AuraTheme = {
    current: savedTheme,
    
    setTheme: function(themeName) {
      document.documentElement.setAttribute('data-theme', themeName);
      localStorage.setItem('aurastitch-theme', themeName);
      this.current = themeName;
      
      // Dispatch custom event to notify components
      const event = new CustomEvent('themechanged', { detail: { theme: themeName } });
      window.dispatchEvent(event);
    },
    
    toggleDarkMode: function() {
      const nextTheme = this.current === 'dark' ? 'light' : 'dark';
      this.setTheme(nextTheme);
    }
  };
})();
