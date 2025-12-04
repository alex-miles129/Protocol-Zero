export function SiteFooter() {
  return (
    <footer className="bg-transparent text-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-muted-foreground/80">
          <p>&copy; {new Date().getFullYear()} Protocol: Zero. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Build with 💙 by Alex.Miles</p>
        </div>
      </div>
    </footer>
  );
} 