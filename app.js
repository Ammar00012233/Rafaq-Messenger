const messageArea = document.getElementById('messageArea');
const composer = document.getElementById('composer');
const messageInput = document.getElementById('messageInput');

if (composer && messageInput && messageArea) {
  composer.addEventListener('submit', (event) => {
    event.preventDefault();

    const text = messageInput.value.trim();
    if (!text) return;

    const article = document.createElement('article');
    article.className = 'message sent';

    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.textContent = text;

    const time = document.createElement('time');
    time.textContent = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    article.appendChild(bubble);
    article.appendChild(time);
    messageArea.insertBefore(article, document.getElementById('typingRow'));

    messageInput.value = '';
    messageInput.focus();

    const typingRow = document.getElementById('typingRow');
    if (typingRow) typingRow.remove();

    const typing = document.createElement('article');
    typing.id = 'typingRow';
    typing.className = 'message typing-row';
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.setAttribute('aria-label', 'يكتب الآن');
    indicator.innerHTML = '<span></span><span></span><span></span>';
    typing.appendChild(indicator);
    messageArea.appendChild(typing);

    setTimeout(() => {
      typing.remove();
      const botReply = document.createElement('article');
      botReply.className = 'message received';

      const header = document.createElement('div');
      header.className = 'message-header';
      header.innerHTML = '<span class="sender">المنظّم</span>';

      const replyBubble = document.createElement('div');
      replyBubble.className = 'bubble';
      replyBubble.textContent = 'تم استلام رسالتك، وسنراجعها فوراً.';

      const replyTime = document.createElement('time');
      replyTime.textContent = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });

      botReply.appendChild(header);
      botReply.appendChild(replyBubble);
      botReply.appendChild(replyTime);
      messageArea.appendChild(botReply);
      messageArea.scrollTop = messageArea.scrollHeight;
    }, 850);

    messageArea.scrollTop = messageArea.scrollHeight;
  });
}

const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    window.location.href = 'index.html';
  });
}
