let pipWindow;

function createPipWindow() {
  pipWindow = document.createElement('div');
  pipWindow.className = 'replypal-pip-container';
  pipWindow.innerHTML = `
    <div class="replypal-pip-header">
      <span>ReplyPal Assistant</span>
      <span class="replypal-pip-close">✕</span>
    </div>
    <div class="replypal-pip-content"></div>
  `;

  // Add styles
  const styles = document.createElement('style');
  styles.textContent = `
    .replypal-pip-container {
      position: fixed;
      right: 20px;
      bottom: 20px;
      width: 300px;
      height: 200px;
      background: white;
      border: 2px solid #007bff;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      z-index: 2147483647;
      padding: 1rem;
      font-family: Arial, sans-serif;
    }
    .replypal-pip-header {
      background: #007bff;
      color: white;
      padding: 8px;
      margin: -1rem -1rem 0.5rem -1rem;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .replypal-pip-close {
      cursor: pointer;
      padding: 4px 8px;
      background: rgba(255,255,255,0.2);
      border-radius: 4px;
    }
    .replypal-pip-content {
      overflow: auto;
      height: calc(100% - 40px);
    }
  `;

  document.body.appendChild(styles);
  document.body.appendChild(pipWindow);

  pipWindow.querySelector('.replypal-pip-close').addEventListener('click', () => {
    pipWindow.style.display = 'none';
  });
}

// Check for stored PiP data when page loads
chrome.storage.local.get('pipData', (result) => {
  if (result.pipData) {
    if (!pipWindow) createPipWindow();
    pipWindow.querySelector('.replypal-pip-content').textContent = result.pipData;
    pipWindow.style.display = 'block';
  }
});