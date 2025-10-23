export function ComingSoon({ title, note }: { title: string; note?: string }) {
  return (
    <div className="grid place-items-center h-[60vh]">
      <div className="text-center max-w-xl">
        <h2 className="text-2xl font-semibold mb-2">{title}</h2>
        <p className="text-neutral-600 mb-4">Coming soon</p>
        {note && <p className="text-sm text-neutral-500">{note}</p>}
      </div>
    </div>
  );
}