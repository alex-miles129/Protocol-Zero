import { notFound } from 'next/navigation';
import ApplicationForm from '../../../components/ApplicationForm';
import { applicationForms } from '../../../config/applicationForms';
import { submitApplication } from '../../../services/applicationService';
import { ApplicationType } from '../../../types/applications';

interface PageProps {
  params: Promise<{
    type: string;
  }>;
}

export default async function ApplicationPage({ params }: PageProps) {
  const { type: typeParam } = await params;
  const type = typeParam as ApplicationType;
  const config = applicationForms[type];

  if (!config) {
    notFound();
  }

  const handleSubmit = async (formData: any) => {
    try {
      await submitApplication(type, formData);
      // Show success message and redirect
      alert('Application submitted successfully!');
      window.location.href = '/profile';
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <ApplicationForm
        config={config}
        onSubmit={handleSubmit}
        isSubmitting={false}
      />
    </div>
  );
} 