import './globals.css';

export const metadata = {
  title: 'Chess Master',
  description: 'Um simples aplicativo de xadrez',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

