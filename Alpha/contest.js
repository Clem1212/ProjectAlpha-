// content.js
function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

function createSuggestionBox() {
  const box = document.createElement('div');
  box.style.position = 'absolute';
  box.style.background = 'white';
  box.style.border = '1px solid #ccc';
  box.style.padding = '8px';
  box.style.borderRadius = '4px';
  box.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
  box.style.zIndex = 999999;
  box.style.maxWidth = '300px';
  box.style.fontSize = '14px';
  box.style.display = 'none';
  document.body.appendChild(box);
  return box;
}

const suggestionBox = createSuggestionBox();

function positionBox(input) {
  const rect = input.getBoundingClientRect();
  suggestionBox.style.top = window.scrollY + rect.bottom + 'px';
  suggestionBox.style.left = window.scrollX + rect.left + 'px';
}

function showSuggestion(text, input) {
  suggestionBox.textContent = text;
  positionBox(input);
  suggestionBox.style.display = 'block';
  suggestionBox.onclick = () => {
    // Insert suggestion into input box
    if (input.isContentEditable) {
      input.innerText = text;
    } else {
      input.value = text;
    }
    suggestionBox.style.display = 'none';
  };
}

function hideSuggestion() {
  suggestionBox.style.display = 'none';
}

// Debounced function to send message to background to get AI suggestion
const requestSuggestion = debounce((input) => {
  const text = input.isContentEditable ? input.innerText : input.value;
  if (!text.trim()) {
    hideSuggestion();
    return;
  }
  chrome.runtime.sendMessage({ type: 'getSuggestion', text }, (response) => {
    if (response && response.suggestion) {
      showSuggestion(response.suggestion, input);
    } else {
      hideSuggestion();
    }
  });
}, 1000);

document.addEventListener('focusin', (e) => {
  const target = e.target;
  if (
    (target.tagName === 'TEXTAREA' || 
     (target.tagName === 'INPUT' && target.type === 'text')) || 
    target.isContentEditable
  ) {
    target.addEventListener('input', () => requestSuggestion(target));
  }
});

document.addEventListener('focusout', () => {
  hideSuggestion();
});
console.log("ReplyPal content script injected!");



window.addEventListener('focus', () => {
  console.log('Window focused!');
});
