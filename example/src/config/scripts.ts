const createScript = (func: () => any) => `(${func})()`;

export const injectedJsBeforeContentLoaded = createScript(() => {
  [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossorigin: true,
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap',
    },
  ].forEach((data) => {
    const link = document.createElement('link');

    Object.entries(data).forEach((pairs) => link.setAttribute(...pairs));

    document.head.appendChild(link);
  });
});
