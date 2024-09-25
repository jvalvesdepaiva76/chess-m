import './globals.css'; // Importa os estilos globais

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

