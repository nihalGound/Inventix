import Theme from "./_components/Theme";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const { businessId } = await params;
  return (
    <div className="flex flex-col">
      <Theme />
    </div>
  );
}
