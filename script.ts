type Styles = { [key: string]: string };

const appState = {
  currentStyle: 'style1',
  styles: {
    Styl1: 'css/page1.css',
    Styl2: 'css/page2.css',
    Styl3: 'css/page3.css',
  } as Styles,
};

function init() {
  const styleSwitcher = document.getElementById('style-switcher');
  if (!styleSwitcher) return;

  for (const [styleName, stylePath] of Object.entries(appState.styles)) {
    const link = document.createElement('a');
    link.href = '#';
    link.textContent = styleName;
    link.addEventListener('click', () => switchStyle(styleName));
    styleSwitcher.appendChild(link);
    styleSwitcher.appendChild(document.createTextNode(' | '));
  }
}

function switchStyle(styleName: string) {
  if (!appState.styles[styleName]) return;

  const themeLink = document.getElementById('theme-style') as HTMLLinkElement;
  if (themeLink) {
    themeLink.href = appState.styles[styleName];
  }

  appState.currentStyle = styleName;
}

document.addEventListener('DOMContentLoaded', init);
