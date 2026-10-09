const messageArea = document.getElementById('messageArea');
const composer = document.getElementById('composer');
const messageInput = document.getElementById('messageInput');

composer.addEventListener('submit', (event) => {
  event.preventDefault();

  const text = messageInput.value.trim();
  if (!text) return;

  const now = new Date();
  const timeText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const article = document.createElement('article');
  article.className = 'message sent';

  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = text;

  const time = document.createElement('time');
  time.textContent = timeText;

  article.appendChild(bubble);
  article.appendChild(time);
  messageArea.insertBefore(article, messageArea.lastElementChild);

  messageInput.value = '';
  messageInput.focus();

  const typingRow = document.querySelector('.typing-row');
  if (typingRow) {
    typingRow.remove();
  }

  const typing = document.createElement('article');
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
    const response = document.createElement('div');
    response.className = 'bubble';
    response.textContent = 'تم استلام رسالتك، وسنراجعها فوراً.';
    const responseTime = document.createElement('time');
    responseTime.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    botReply.appendChild(header);
    botReply.appendChild(response);
    botReply.appendChild(responseTime);
    messageArea.appendChild(botReply);
    messageArea.scrollTop = messageArea.scrollHeight;
  }, 800);

  messageArea.scrollTop = messageArea.scrollHeight;
});
