import { notFound } from 'next/navigation';
import ApplicationsManager from '../../../../components/admin/ApplicationsManager';
import { applicationForms } from '../../../../config/applicationForms';
import { ApplicationType } from '../../../../types/applications';

interface PageProps {
  params: Promise<{
    type: string;
  }>;
}

export default async function ApplicationsAdminPage({ params }: PageProps) {
  const { type: typeParam } = await params;
  const type = typeParam as ApplicationType;
  const config = applicationForms[type];

  if (!config) {
    notFound();
  }

  // TODO: Get current user from auth context
  const currentUser = 'admin'; // Placeholder

  return (
    <div className="min-h-screen bg-gray-50">
      <ApplicationsManager
        type={type}
        currentUser={currentUser}
      />
    </div>
  );
} 