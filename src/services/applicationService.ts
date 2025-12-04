import { ApplicationType } from '../types/applications';

export const submitApplication = async (type: ApplicationType, formData: any) => {
  try {
    const response = await fetch('/api/applications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, formData }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit application');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error submitting application:', error);
    throw new Error('Failed to submit application');
  }
};

export const getApplications = async (type: ApplicationType) => {
  try {
    const response = await fetch(`/api/applications?type=${type}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch applications');
    }

    const data = await response.json();
    return data.applications;
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw new Error('Failed to fetch applications');
  }
};

export const updateApplicationStatus = async (
  type: ApplicationType,
  rowIndex: number,
  status: 'approved' | 'rejected',
  reviewedBy: string
) => {
  try {
    const response = await fetch('/api/applications', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        rowIndex,
        status,
        reviewedBy,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update application status');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating application status:', error);
    throw new Error('Failed to update application status');
  }
}; 