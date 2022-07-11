module.exports = {
    HTML: function (title, head, body) {
      return `
        <html>
        <head>
            <meta charset="utf-8">
            <title>${title}</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            ${head}
        </head>
        
        <body>
            <header>
            </header>
            ${body} 
            <footer>
                
            </footer>
        </body>
        </html>      
        `;
    },
  };