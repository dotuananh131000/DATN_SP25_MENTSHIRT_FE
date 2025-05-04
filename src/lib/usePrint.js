const usePrint = (content) => {
    const printWindow = window.open('', '', 'width=900,height=600');

    printWindow.document.write(`
        <html>
          <head>
            <title>In hóa đơn</title>
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          </head>
          <body class="p-4">
            ${content}
          </body>
        </html>
      `);
    
      printWindow.document.close();
      printWindow.focus();
    // Chờ một chút để Tailwind load xong
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
}
export default usePrint;