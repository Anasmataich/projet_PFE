export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white px-6 py-4">
      <div className="flex items-center justify-between text-xs text-gray-500">
        <p>&copy; {new Date().getFullYear()} Ministère de l'Éducation Nationale — Plateforme GED</p>
        <p>v1.0.0</p>
      </div>
    </footer>
  );
}
