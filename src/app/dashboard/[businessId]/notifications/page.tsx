import NotificationPage from "./_components/NotificationPage";

export default async function Notification({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const { businessId } = await params;

  return <NotificationPage businessId={businessId} />;
}
